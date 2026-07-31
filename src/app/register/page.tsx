"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [fileName, setFileName] = useState("Tidak ada file yang dipilih");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Particle Canvas logic (Same as Login)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particlesArray: any[] = [];
    let animationFrameId: number;

    function resize() {
      if (canvas) {
        canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
        canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
      }
    }
    window.addEventListener("resize", resize);
    resize();

    let mouse = { x: null as number | null, y: null as number | null, radius: 120 };
    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    };
    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    class Particle {
      x: number;
      y: number;
      directionX: number;
      directionY: number;
      size: number;
      color: string;

      constructor(x: number, y: number, directionX: number, directionY: number, size: number, color: string) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
      }
      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
      update() {
        if (canvas && (this.x > canvas.width || this.x < 0)) this.directionX = -this.directionX;
        if (canvas && (this.y > canvas.height || this.y < 0)) this.directionY = -this.directionY;

        if (mouse.x != null && mouse.y != null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius + this.size) {
            if (canvas && mouse.x < this.x && this.x < canvas.width - this.size * 10) this.x += 1;
            if (mouse.x > this.x && this.x > this.size * 10) this.x -= 1;
            if (canvas && mouse.y < this.y && this.y < canvas.height - this.size * 10) this.y += 1;
            if (mouse.y > this.y && this.y > this.size * 10) this.y -= 1;
          }
        }
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
      }
    }

    function init() {
      particlesArray = [];
      if (!canvas) return;
      let numberOfParticles = (canvas.height * canvas.width) / 10000;
      for (let i = 0; i < numberOfParticles; i++) {
        let size = Math.random() * 2 + 0.5;
        let x = Math.random() * (canvas.width - size * 2 - size * 2) + size * 2;
        let y = Math.random() * (canvas.height - size * 2 - size * 2) + size * 2;
        let directionX = Math.random() * 1 - 0.5;
        let directionY = Math.random() * 1 - 0.5;
        let color = "rgba(255,255,255,0.4)";
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
      }
    }

    function connect() {
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          let distance =
            (particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x) +
            (particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y);
          if (canvas && distance < (canvas.width / 7) * (canvas.height / 7)) {
            let opacityValue = 1 - distance / 20000;
            if (ctx) {
              ctx.strokeStyle = "rgba(255,255,255," + opacityValue * 0.4 + ")";
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
              ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
              ctx.stroke();
            }
          }
        }
      }
    }

    function animate() {
      if (!ctx || !canvas) return;
      animationFrameId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
      }
      connect();
    }

    init();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      if (canvas) {
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseleave", handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // UseEffect for Vanilla JS logics like face-api, password strength
  useEffect(() => {
    // We put all DOM manipulation code here to maintain 1:1 original behavior
    const script = document.createElement("script");
    script.src = "/js/register-script.js";
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-tooltip-wrapper { position: relative; display: block; }
        .custom-tooltip {
            position: absolute; top: 100%; left: 50%; transform: translateX(-50%);
            background-color: white; color: #333; padding: 8px 15px; border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-size: 14px; white-space: nowrap;
            z-index: 1000; margin-top: 8px; border: 1px solid #ddd; display: none;
            align-items: center; gap: 8px;
        }
        .custom-tooltip::before {
            content: ''; position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%);
            border-width: 8px; border-style: solid; border-color: transparent transparent #ddd transparent;
        }
        .custom-tooltip::after {
            content: ''; position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%);
            border-width: 7px; border-style: solid; border-color: transparent transparent white transparent;
        }
        .custom-tooltip .error-icon {
            background-color: #ff9800; color: white; width: 20px; height: 20px;
            display: inline-flex; align-items: center; justify-content: center;
            border-radius: 3px; font-weight: bold; font-family: serif;
        }
        .custom-alert {
            position: fixed; top: 20px; right: 20px; background: #fff;
            border-left: 4px solid #fcd34d; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            padding: 15px 20px; border-radius: 4px; z-index: 9999; display: none;
            align-items: center; gap: 12px; min-width: 300px; max-width: 400px;
        }
        .custom-alert.error { border-left-color: #ef4444; }
        .custom-alert.success { border-left-color: #10b981; }
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        .custom-alert-icon { font-size: 24px; }
        .custom-alert.error .custom-alert-icon { color: #ef4444; }
        .custom-alert.success .custom-alert-icon { color: #10b981; }
        .custom-alert.warning .custom-alert-icon { color: #f59e0b; }
        .custom-alert-content { flex: 1; text-align: left; }
        .custom-alert-title { font-weight: bold; font-size: 14px; margin-bottom: 2px; color: #333; }
        .custom-alert-msg { font-size: 13px; color: #666; line-height: 1.4; }
        .custom-alert-close { cursor: pointer; color: #999; font-size: 18px; }
        .custom-alert-close:hover { color: #333; }
        
        body, .container-scroller, .page-body-wrapper, .content-wrapper {
          background-color: #f8f9fa !important;
        }
        #rightSideBg { padding: 6rem 5rem; min-height: 100vh; }
        @media (max-width: 991px) { #rightSideBg { display: none !important; } }
        @keyframes spinSlow { 100% { transform: rotate(360deg); } }
        @keyframes spinReverse { 100% { transform: rotate(-360deg); } }
        .carousel-indicators .active { opacity: 1 !important; transform: scale(1.2); }
      `}} />

      <div className="container-fluid p-0 position-relative">
        <Link
          href="/"
          style={{
            position: "absolute",
            top: "30px",
            left: "30px",
            zIndex: 999,
            color: "#888888",
            textDecoration: "none",
            background: "transparent",
            border: "none",
            transition: "color 0.2s ease",
            display: "flex",
            alignItems: "center",
          }}
          title="Kembali ke Identia"
        >
          <i className="mdi mdi-arrow-left" style={{ fontSize: "24px" }}></i>
        </Link>
        <div className="row m-0 w-100" style={{ minHeight: "100vh" }}>
          
          {/* Left Side: Form */}
          <div className="col-12 col-lg-6 d-flex flex-column bg-white" style={{ zIndex: 10, boxShadow: "2px 0 15px rgba(0,0,0,0.1)", padding: "4rem 10%", overflowY: "auto", maxHeight: "100vh" }}>
            <div className="auth-form-light text-left py-0 px-0 rounded" style={{ margin: "auto 0" }}>
              <div className="d-flex align-items-center mb-4">
                <img src="/images/myn.png" alt="logo" style={{ height: "48px", filter: "brightness(0)", marginRight: "15px" }} />
                <div>
                  <h2 className="font-weight-bold text-dark mb-1" style={{ fontSize: "2rem", lineHeight: 1.2 }}>New here?</h2>
                  <p className="font-weight-light text-muted mb-0" style={{ fontSize: "1rem" }}>Signing up is easy. It only takes a few steps</p>
                </div>
              </div>

              <form className="pt-3" id="registerForm">
                <div className="form-group mb-3">
                  <input type="text" className="form-control form-control-lg border" name="name" style={{ borderRadius: "8px", borderColor: "#e2e8f0", fontSize: "0.95rem", padding: "1rem" }} placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="form-group custom-tooltip-wrapper mb-3">
                  <input type="text" className="form-control form-control-lg border" name="username" id="usernameInput" style={{ borderRadius: "8px", borderColor: "#e2e8f0", fontSize: "0.95rem", padding: "1rem" }} placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                  <div className="custom-tooltip" id="usernameTooltip">
                    <span className="error-icon">!</span>
                    <span>Username ini sudah digunakan.</span>
                  </div>
                </div>
                <div className="form-group mb-3">
                  <div className="input-group">
                    <input type={showPassword ? "text" : "password"} className="form-control form-control-lg border" name="password" id="register_password" placeholder="Password" required style={{ borderRadius: "8px 0 0 8px", borderColor: "#e2e8f0", borderRight: "none", fontSize: "0.95rem", padding: "1rem" }} value={password} onChange={(e) => setPassword(e.target.value)} />
                    <div className="input-group-append">
                      <span className="input-group-text eye-toggle bg-white" onClick={() => setShowPassword(!showPassword)} style={{ cursor: "pointer", borderRadius: "0 8px 8px 0", border: "1px solid #e2e8f0", borderLeft: "none" }}>
                        <i className={`mdi \${showPassword ? "mdi-eye" : "mdi-eye-off"} text-muted`}></i>
                      </span>
                    </div>
                  </div>
                  <div className="progress mt-1" style={{ height: "5px", display: "none" }} id="pwStrengthMeterReg">
                    <div className="progress-bar" id="pwStrengthBarReg" role="progressbar" style={{ width: "0%" }}></div>
                  </div>
                  <small id="pwStrengthTextReg" className="form-text mt-1 mb-1 font-weight-bold" style={{ fontSize: "11px" }}></small>
                  <small className="text-muted d-block mt-0" style={{ fontSize: "10px", lineHeight: 1.2 }}>*Min. 8 characters, uppercase, lowercase, numbers & symbols.</small>
                </div>
                <div className="form-group mb-3">
                  <div className="input-group">
                    <input type={showConfirmPassword ? "text" : "password"} className="form-control form-control-lg border" name="confirm_password" id="register_confirm_password" placeholder="Confirm Password" required style={{ borderRadius: "8px 0 0 8px", borderColor: "#e2e8f0", borderRight: "none", fontSize: "0.95rem", padding: "1rem" }} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    <div className="input-group-append">
                      <span className="input-group-text eye-toggle bg-white" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ cursor: "pointer", borderRadius: "0 8px 8px 0", border: "1px solid #e2e8f0", borderLeft: "none" }}>
                        <i className={`mdi \${showConfirmPassword ? "mdi-eye" : "mdi-eye-off"} text-muted`}></i>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="form-group mb-3">
                  <label className="font-weight-medium text-dark mb-1" style={{ fontSize: "0.9rem" }}>Upload Photo</label>
                  <div className="custom-file-upload form-control form-control-lg border" style={{ padding: 0, display: "flex", alignItems: "center", overflow: "hidden", background: "#fff", borderRadius: "8px", borderColor: "#e2e8f0", height: "52px" }}>
                      <input type="file" name="foto" id="fotoInputRegister" className="d-none" style={{ display: "none" }} accept="image/*" required onChange={(e) => setFileName(e.target.files && e.target.files.length > 0 ? e.target.files[0].name : "Tidak ada file yang dipilih")} />
                      <label htmlFor="fotoInputRegister" className="file-btn" style={{ margin: 0, padding: "0 20px", height: "100%", display: "flex", alignItems: "center", background: "#f8f9fa", borderRight: "1px solid #e2e8f0", cursor: "pointer", fontWeight: 400, fontSize: "0.9rem", color: "#495057" }}>Pilih File</label>
                      <span className="file-text" id="fotoTextReg" style={{ padding: "0 15px", fontSize: "0.9rem", color: fileName !== "Tidak ada file yang dipilih" ? "#495057" : "#c9c8c8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "flex", alignItems: "center", height: "100%" }}>{fileName}</span>
                  </div>
                  <div id="faceDetectPreview" style={{ display: "none", marginTop: "10px" }}>
                    <div id="faceDetectBadge" style={{ padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: 600, display: "inline-block", width: "100%", textAlign: "center" }}></div>
                  </div>
                  <input type="hidden" id="faceVerifiedFlag" defaultValue="0" />
                </div>
                <div className="form-group mb-4">
                  <label className="font-weight-medium text-dark mb-1" style={{ fontSize: "0.9rem" }}>Security Captcha</label>
                  <div className="row align-items-center mx-0">
                    <div className="col-6 px-0 pr-1">
                      {/* Using API route placeholder for captcha */}
                      <img src="/api/captcha" alt="Captcha" className="img-fluid rounded shadow-sm w-100" style={{ height: "52px", border: "1px solid #e2e8f0", borderRadius: "8px !important", cursor: "pointer" }} onClick={(e) => (e.currentTarget.src = '/api/captcha?r=' + Math.random())} title="Click to refresh" />
                    </div>
                    <div className="col-6 px-0 pl-1 custom-tooltip-wrapper">
                      <input type="text" id="captchaInputReg" className="form-control form-control-lg border" name="captcha" placeholder="Enter Captcha" required style={{ borderRadius: "8px", borderColor: "#e2e8f0", fontSize: "0.95rem", height: "52px", padding: "0.5rem 1rem" }} value={captcha} onChange={(e) => setCaptcha(e.target.value)} />
                      <div className="custom-tooltip" id="captchaTooltip">
                        <span className="error-icon">!</span>
                        <span>Incorrect Captcha</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3">
                  <button type="submit" className="btn btn-block btn-lg text-white font-weight-medium mb-3" style={{ backgroundColor: "#4B49AC", borderRadius: "8px", padding: "0.8rem" }}>Sign up</button>
                </div>
                <div className="text-center mt-4" style={{ fontSize: "0.9rem" }}>
                  Already have an account? <Link href="/login" style={{ color: "#4B49AC" }}>Sign in</Link>
                </div>
              </form>
            </div>
          </div>

          {/* Right Side: Highly Innovative Tech Background */}
          <div id="rightSideBg" className="col-12 col-lg-6 d-flex flex-column align-items-center justify-content-center position-relative" style={{ backgroundColor: "#4B49AC", overflow: "hidden" }}>
            {/* Animated Tech Rings */}
            <div style={{ position: "absolute", top: "-20%", right: "-20%", width: "800px", height: "800px", border: "1px dashed rgba(255,255,255,0.15)", borderRadius: "50%", animation: "spinSlow 60s linear infinite", zIndex: 0, pointerEvents: "none" }}>
              <div style={{ position: "absolute", top: "10%", left: "10%", width: "80%", height: "80%", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "50%", animation: "spinReverse 40s linear infinite" }}>
                 <div style={{ position: "absolute", top: "-5px", left: "50%", width: "10px", height: "10px", background: "rgba(255,255,255,0.8)", borderRadius: "50%", boxShadow: "0 0 15px rgba(255,255,255,1)" }}></div>
              </div>
              <div style={{ position: "absolute", top: "25%", left: "25%", width: "50%", height: "50%", border: "2px solid rgba(255,255,255,0.03)", borderRadius: "50%" }}></div>
            </div>

            {/* Interactive Particle Canvas */}
            <canvas id="particleCanvas" ref={canvasRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1, pointerEvents: "auto" }}></canvas>

            {/* Sliding Text Container */}
            <div style={{ zIndex: 2, maxWidth: "600px", color: "#fff", pointerEvents: "none" }}>
              <div id="loginTextSlider" className="carousel slide" data-ride="carousel" data-interval="4000" style={{ pointerEvents: "auto" }}>
                <div className="carousel-inner">
                  <div className="carousel-item active">
                    <h1 className="font-weight-bold mb-4" style={{ fontSize: "4rem", letterSpacing: "0px", textShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>Welcome to...</h1>
                    <p style={{ fontSize: "1.15rem", opacity: 0.85, fontWeight: 300, lineHeight: 1.6 }}>Experience the best way to manage your work and track user activities efficiently with our state-of-the-art platform.</p>
                  </div>
                  <div className="carousel-item">
                    <h1 className="font-weight-bold mb-4" style={{ fontSize: "4rem", letterSpacing: "0px", textShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>Secure Access</h1>
                    <p style={{ fontSize: "1.15rem", opacity: 0.85, fontWeight: 300, lineHeight: 1.6 }}>Your data is protected with military-grade security encryption and seamless advanced biometric login features.</p>
                  </div>
                  <div className="carousel-item">
                    <h1 className="font-weight-bold mb-4" style={{ fontSize: "4rem", letterSpacing: "0px", textShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>Deep Analytics</h1>
                    <p style={{ fontSize: "1.15rem", opacity: 0.85, fontWeight: 300, lineHeight: 1.6 }}>Get detailed insights, real-time history logs, and actionable metrics to make informed administrative decisions instantly.</p>
                  </div>
                </div>
                <ol className="carousel-indicators" style={{ position: "relative", marginTop: "3rem", marginBottom: 0, justifyContent: "flex-start", marginLeft: 0 }}>
                  <li data-target="#loginTextSlider" data-slide-to="0" className="active" style={{ width: "10px", height: "10px", borderRadius: "50%", margin: "0 8px 0 0", backgroundColor: "#fff", opacity: 0.5, border: "none" }}></li>
                  <li data-target="#loginTextSlider" data-slide-to="1" style={{ width: "10px", height: "10px", borderRadius: "50%", margin: "0 8px 0 0", backgroundColor: "#fff", opacity: 0.5, border: "none" }}></li>
                  <li data-target="#loginTextSlider" data-slide-to="2" style={{ width: "10px", height: "10px", borderRadius: "50%", margin: "0 8px 0 0", backgroundColor: "#fff", opacity: 0.5, border: "none" }}></li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Alert Container */}
      <div id="customAlert" className="custom-alert warning">
          <i className="mdi mdi-alert-circle custom-alert-icon" id="customAlertIcon"></i>
          <div className="custom-alert-content">
              <div className="custom-alert-title" id="customAlertTitle">Warning</div>
              <div className="custom-alert-msg" id="customAlertMsg">Message goes here</div>
          </div>
          <i className="mdi mdi-close custom-alert-close" onClick={() => (window as any).closeCustomAlert?.()}></i>
      </div>
    </>
  );
}
