import Script from 'next/script';

import React from 'react';

export default async function DashboardPage() {
  // Mock data for now, later fetch from Firebase
  const dashName = "Admin";
  const dashName2 = "Admin Web";
  const dashUsername = "admin";
  const dashFotoSrc = "/images/admin.png";
  const totalOccupant = 12;
  const totalAccount = 2;

  const htmlContent = `
<style>/* PAGE_CSS_INJECTED */
.cursor-type {
              display: inline-block;
              width: 5px;
              height: 1.05em;
              background: linear-gradient(to bottom,
                  rgba(71, 71, 161, 0.45) 0%,
                  rgba(71, 71, 161, 0.45) 55%,
                  rgba(0, 128, 0, 0.45) 70%,
                  rgba(255, 193, 0, 0.45) 85%,
                  rgba(255, 0, 0, 0.45) 100%);
              vertical-align: middle;
              animation: cursorBlink 1.2s step-end infinite;
              margin-left: 6px;
              margin-top: -4px;
              border-radius: 5px;
              filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.8)) blur(2.5px);
              box-shadow: 0 0 5px 2px rgba(255, 255, 255, 0.7), 0 0 10px 4px rgba(255, 255, 255, 0.4);
            }

            @keyframes cursorBlink {

              0%,
              100% {
                opacity: 1;
              }

              50% {
                opacity: 0;
              }
            }

@property --bg-angle {
                  syntax: "<angle>";
                  inherits: false;
                  initial-value: 0deg;
                }

                .animated-clock-container {
                  border-radius: 50px;
                  border: 1px solid transparent;
                  background-image:
                    linear-gradient(#fff, #fff),
                    conic-gradient(from var(--bg-angle),
                      #dcf2fd 0%,
                      #2b8afb 15%,
                      #8b24f5 40%,
                      #df12c0 60%,
                      #8b24f5 75%,
                      #2b8afb 90%,
                      #dcf2fd 100%);
                  background-origin: border-box;
                  background-clip: padding-box, border-box;
                  box-sizing: border-box;
                  animation: spin-gradient 3s linear infinite;
                }

                @keyframes spin-gradient {
                  to {
                    --bg-angle: 360deg;
                  }
                }

.profile-animated-card::before {
          content: '';
          position: absolute;
          width: 120px;
          height: 200%;
          /* Gradasi: Biru Muda -> Biru Tua -> Putih (Agak Tebal) -> Ungu Tua -> Ungu Muda -> Biru Muda */
          background-image: linear-gradient(180deg, #dcf2fd, #2b8afb, #ffffff 40%, #ffffff 60%, #8b24f5, #df12c0, #dcf2fd);
          animation: rotBGimgProfile 3s linear infinite;
          transition: all 0.2s linear;
          z-index: 0;
          top: 50%;
          left: 50%;
        }

        @keyframes rotBGimgProfile {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }

          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        .profile-animated-card::after {
          content: '';
          position: absolute;
          background: #ffffff;
          inset: 1.5px;
          border-radius: 8.5px;
          z-index: 1;
        }

@keyframes notifModalPop {
      0% {
        transform: scale(0.8) translateY(20px);
        opacity: 0;
      }

      100% {
        transform: scale(1) translateY(0);
        opacity: 1;
      }
    }

    .notif-icon-wrap::after {
      content: '';
      position: absolute;
      inset: -8px;
      border-radius: 50%;
      border: 2px solid rgba(71, 71, 161, 0.3);
      animation: pulse-ring 2s infinite;
    }

    .notif-icon-wrap.blocked {
      background: #fee2e2 !important;
    }

    .notif-icon-wrap.blocked i {
      color: #ef4444 !important;
    }

    .notif-icon-wrap.blocked::after {
      border-color: rgba(239, 68, 68, 0.4) !important;
    }

    @keyframes pulse-ring {
      0% {
        transform: scale(0.8);
        opacity: 1;
      }

      100% {
        transform: scale(1.3);
        opacity: 0;
      }
    }

    #btn-allow-notif:hover,
    #btn-close-notif:hover {
      transform: translateY(-2px);
    }

    #btn-deny-notif:hover {
      background: #f1f5f9;
      color: #0f172a;
      border-color: #cbd5e1;
    }

/* === WiFi Antenna Arc Animation === */
    .wifi-arc {
      opacity: 0.12;
    }

    .arc-l1,
    .arc-r1 {
      animation: arcBlink 2s ease-in-out infinite 0s;
    }

    .arc-l2,
    .arc-r2 {
      animation: arcBlink 2s ease-in-out infinite 0.3s;
    }

    .arc-l3,
    .arc-r3 {
      animation: arcBlink 2s ease-in-out infinite 0.6s;
    }

    .arc-l4,
    .arc-r4 {
      animation: arcBlink 2s ease-in-out infinite 0.9s;
    }

    @keyframes arcBlink {

      0%,
      100% {
        opacity: 0.12;
      }

      20%,
      45% {
        opacity: 1;
      }
    }

    .scan-dots {
      animation: scanDots 1.5s steps(4, end) infinite;
    }

    @keyframes scanDots {
      0% {
        content: '';
      }

      25% {
        content: '.';
      }

      50% {
        content: '..';
      }

      75% {
        content: '...';
      }
    }

    /* === Save Modal Glass Card === */
    .save-glass-card {
      background: rgba(255, 255, 255, 0.92);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-radius: 16px;
      padding: 28px 24px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.3) inset;
    }

    #wifiSaveModal .modal-backdrop {
      opacity: 0.35 !important;
    }

    /* === Orbit Animation (Step 1) === */
    .save-orbit-wrap {
      position: relative;
      width: 80px;
      height: 80px;
      margin: 0 auto 16px;
    }

    .save-center-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 30px;
    }

    .save-orbit-dot {
      position: absolute;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #4B49AC;
      top: 50%;
      left: 50%;
      animation: orbitSpin 1.5s linear infinite;
      animation-delay: var(--delay, 0s);
    }

    @keyframes orbitSpin {
      0% {
        transform: translate(-50%, -50%) rotate(0deg) translateX(34px) scale(1);
        opacity: 0.8;
      }

      50% {
        opacity: 1;
        transform: translate(-50%, -50%) rotate(180deg) translateX(34px) scale(1.3);
      }

      100% {
        transform: translate(-50%, -50%) rotate(360deg) translateX(34px) scale(1);
        opacity: 0.8;
      }
    }

    /* === Particles (Step 2) === */
    .save-particle {
      position: absolute;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: #f59e0b;
      top: 50%;
      left: 50%;
      animation: particleFly 2s ease-in-out infinite;
      animation-delay: var(--delay, 0s);
    }

    @keyframes particleFly {
      0% {
        transform: translate(-50%, -50%) rotate(var(--angle)) translateX(0) scale(0);
        opacity: 0;
      }

      30% {
        opacity: 1;
        transform: translate(-50%, -50%) rotate(var(--angle)) translateX(30px) scale(1);
      }

      70% {
        opacity: 0.6;
        transform: translate(-50%, -50%) rotate(var(--angle)) translateX(38px) scale(0.6);
      }

      100% {
        opacity: 0;
        transform: translate(-50%, -50%) rotate(var(--angle)) translateX(42px) scale(0);
      }
    }

    /* === Bounce Restart (Step 3) === */
    @keyframes bounceRestart {

      0%,
      100% {
        transform: translate(-50%, -50%) scale(1) rotate(0deg);
      }

      25% {
        transform: translate(-50%, -50%) scale(0.85) rotate(-30deg);
      }

      50% {
        transform: translate(-50%, -50%) scale(1.15) rotate(15deg);
      }

      75% {
        transform: translate(-50%, -50%) scale(0.95) rotate(-5deg);
      }
    }

    .restart-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #ef4444;
      animation: dotPulse 1.2s ease-in-out infinite;
    }

    /* === Shared Keyframes === */
    @keyframes spinSave {
      0% {
        transform: translate(-50%, -50%) rotate(0deg);
      }

      100% {
        transform: translate(-50%, -50%) rotate(360deg);
      }
    }

    @keyframes dotPulse {

      0%,
      80%,
      100% {
        transform: scale(0.5);
        opacity: 0.3;
      }

      40% {
        transform: scale(1.2);
        opacity: 1;
      }
    }

    @keyframes popIn {
      0% {
        transform: scale(0);
        opacity: 0;
      }

      60% {
        transform: scale(1.2);
      }

      100% {
        transform: scale(1);
        opacity: 1;
      }
    }

    /* === Progress Bar === */
    .save-bar-track {
      width: 160px;
      height: 4px;
      background: #eee;
      border-radius: 4px;
      margin: 0 auto;
      overflow: hidden;
    }

    .save-bar-fill {
      width: 0%;
      height: 100%;
      border-radius: 4px;
      transition: width 0.6s ease;
    }

</style>

<div class="content-wrapper">
    <div class="row">
      <div class="col-md-12 mb-2">
        <div class="row">
          <div class="col-12 col-xl-8 mb-2 mb-xl-0">
            <!--
            if (session_status() === PHP_SESSION_NONE)
              session_start();
            $dashName = isset($_SESSION['name']) ? $_SESSION['name'] : 'User';
            -->
            <h3 class="font-weight-bold">
              <span id="typed-text"></span><span class="cursor-type" id="cursor1"></span>
            </h3>
            <h6 class="font-weight-normal mb-0"
              style="max-width: 750px; line-height: 1.6; font-family: 'Inter', sans-serif;">
              <span id="typed-sub"></span><span class="cursor-type" id="cursor2" style="display: none;"></span>
            </h6>
          </div>
          <style>
            .cursor-type {
              display: inline-block;
              width: 5px;
              height: 1.05em;
              background: linear-gradient(to bottom,
                  rgba(71, 71, 161, 0.45) 0%,
                  rgba(71, 71, 161, 0.45) 55%,
                  rgba(0, 128, 0, 0.45) 70%,
                  rgba(255, 193, 0, 0.45) 85%,
                  rgba(255, 0, 0, 0.45) 100%);
              vertical-align: middle;
              animation: cursorBlink 1.2s step-end infinite;
              margin-left: 6px;
              margin-top: -4px;
              border-radius: 5px;
              filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.8)) blur(2.5px);
              box-shadow: 0 0 5px 2px rgba(255, 255, 255, 0.7), 0 0 10px 4px rgba(255, 255, 255, 0.4);
            }

            @keyframes cursorBlink {

              0%,
              100% {
                opacity: 1;
              }

              50% {
                opacity: 0;
              }
            }
          </style>
          
          <div class="col-12 col-xl-4">
            <div class="justify-content-end d-flex">
              <style>
                @property --bg-angle {
                  syntax: "<angle>";
                  inherits: false;
                  initial-value: 0deg;
                }

                .animated-clock-container {
                  border-radius: 50px;
                  border: 1px solid transparent;
                  background-image:
                    linear-gradient(#fff, #fff),
                    conic-gradient(from var(--bg-angle),
                      #dcf2fd 0%,
                      #2b8afb 15%,
                      #8b24f5 40%,
                      #df12c0 60%,
                      #8b24f5 75%,
                      #2b8afb 90%,
                      #dcf2fd 100%);
                  background-origin: border-box;
                  background-clip: padding-box, border-box;
                  box-sizing: border-box;
                  animation: spin-gradient 3s linear infinite;
                }

                @keyframes spin-gradient {
                  to {
                    --bg-angle: 360deg;
                  }
                }
              </style>
              <div class="d-flex align-items-center animated-clock-container" style="padding:6px 16px;">
                <span id="dashLiveClock" style="font-size:13px;font-weight:600;color:#2c2e33;"></span>
                <span class="mx-2" style="color:#ccc;">|</span>
                <span id="dashLiveDate" style="font-size:12px;color:#64748b;"></span>
              </div>
            </div>
          </div>
        </div>



      </div>
    </div>
    <!--
    $lastLogDevice = 'Unknown Device';
    $lastLogTime = '-';
    $lastLogDesc = 'No history yet';
    if ($lastLog) {
      $uaLog = strtolower($lastLog['device_info']);
      if (strpos($uaLog, 'windows') !== false)
        $lastLogDevice = 'Windows PC';
      elseif (strpos($uaLog, 'mac') !== false)
        $lastLogDevice = 'Mac OS PC';
      elseif (strpos($uaLog, 'android') !== false)
        $lastLogDevice = 'Android Device';
      elseif (strpos($uaLog, 'iphone') !== false || strpos($uaLog, 'ipad') !== false)
        $lastLogDevice = 'iOS Device';
      elseif (strpos($uaLog, 'linux') !== false)
        $lastLogDevice = 'Linux PC';

      $tLog = strtotime($lastLog['login_time']);
      $lastLogTime = date('H:i:s', $tLog);
      $lastLogDesc = date('l, d F Y', $tLog);
    }
    -->
    <div class="row mt-3">
      <div class="col-md-3 stretch-card transparent mb-4">
        <div class="card" style="background:#ffc100;color:#fff;border-radius:16px;">
          <div class="card-body" style="position:relative;padding-bottom:36px;">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <p class="mb-0">Door Status</p>
              <span id="dash-top-door-pill" class="badge"
                style="background: #ffffff;color:#059669;font-size:9px;padding:3px 8px;border-radius:20px;font-weight:700;box-shadow:0 2px 4px rgba(0,0,0,0.05);"><i
                  class="mdi mdi-lock mr-1"></i>LOCKED</span>
            </div>
            <div class="d-flex align-items-center justify-content-between mb-2">
              <div class="d-flex align-items-center">
                <span style="font-size:11px;">Time</span>
              </div>
              <span style="font-size:11px; font-weight: 500;" id="dash-top-door-time">--:--:--</span>
            </div>
            <div class="d-flex align-items-center justify-content-between mb-0">
              <div class="d-flex align-items-center">
                <span style="font-size:11px;">Date</span>
              </div>
              <span style="font-size:11px; font-weight: 500;" id="dash-top-door-date">-</span>
            </div>
            <div style="position:absolute;bottom:10px;left:20px;">
              <span style="font-size:11px; font-weight:500; opacity:0.7;">Real-time
                monitoring</span>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3 stretch-card transparent mb-4">
        <div class="card card-dark-blue">
          <div class="card-body" style="position:relative;">
            <div id="esp32-status-icon-container" style="position:absolute; top:20px; right:20px;">
              <!-- Signal / Loading icon will appear here -->
            </div>
            <p class="mb-3">ESP32 Microcontroller</p>
            <div style="font-size:12px;">
              <p class="mb-1"><span class="esp32-wifi-dot" id="wifi-dot"
                  style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#10b981;margin-right:5px;"></span>
                <span id="wifi-status-text" style="color:#ffffff;">WiFi Connected</span>
              </p>
              <p class="mb-1">SSID: <strong id="esp32-ssid">FiberID_Network</strong></p>
              <p class="mb-0">IP: <strong id="esp32-ip" style="font-family:monospace;color:#ffffff;">Unknown</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3 stretch-card transparent mb-4">
        <div class="card card-tale">
          <div class="card-body">
            <p class="mb-4">Occupant Data</p>
            <p class="fs-30 mb-2" id="occupant-count">${totalOccupant}</p>
            <p>Total Occupants Registered</p>
          </div>
        </div>
      </div>
      <div class="col-md-3 stretch-card transparent mb-4">
        <div class="card card-light-blue">
          <div class="card-body">
            <p class="mb-4">Account Data</p>
            <p class="fs-30 mb-2" id="account-count">${totalAccount}</p>
            <p>Total Accounts Active</p>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <!-- Login History Card (Left - 5/12) -->
      <div class="col-md-5 grid-margin stretch-card">
        <div class="card" style="border:1px solid #e2e8f0;border-radius:10px;width:100%;">
          <div class="card-body" style="padding:1rem;">
            <p class="card-title mb-0" style="font-size:0.95rem;">Login History</p>
            <small class="text-muted">Your recent login activity</small>
            <div id="loginHistoryCardBody" class="mt-3" style="max-height:260px;overflow-y:auto;">
              <div class="text-center py-3">
                <i class="mdi mdi-loading mdi-spin" style="font-size:28px;color:#4B49AC;"></i>
                <p class="mt-2 mb-0" style="font-size:11px;color:#999;">Loading login history...</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Change WiFi Card (Center - 4/12) -->
      <div class="col-md-4 grid-margin stretch-card">
        <div class="card" style="border:1px solid #e2e8f0;border-radius:10px;width:100%;">
          <div class="card-body" style="padding:1rem;">
            <p class="card-title mb-0" style="font-size:0.95rem;">Change WiFi
            </p>
            <small class="text-muted">Change WiFi configuration</small>
            <div class="form-group mb-2 mt-3">
              <label style="font-size:10px;font-weight:600;color:#555;margin-bottom:3px;">Target SSID</label>
              <div class="input-group input-group-sm">
                <input type="text" class="form-control" id="new-ssid" placeholder="Use the right button ->" required
                  readonly
                  style="font-size:11px;border-radius:6px 0 0 6px;border:1px solid #e2e8f0;background-color:#f8f9fa;cursor:not-allowed;">
                <div class="input-group-append">
                  <button class="btn btn-primary" type="button" id="btnScanWifi"
                    style="border-radius:0 6px 6px 0;border-color:#4b49ac;font-size:11px;" title="Search WiFi"><i
                      class="mdi mdi-magnify"></i></button>
                </div>
              </div>
            </div>
            <div class="form-group mb-2">
              <label style="font-size:10px;font-weight:600;color:#555;margin-bottom:3px;">Password</label>
              <div class="input-group input-group-sm">
                <input type="password" class="form-control" id="new-wifi-pass" placeholder="Enter password" required
                  style="font-size:11px;border-radius:6px 0 0 6px;border:1px solid #e2e8f0;">
                <div class="input-group-append">
                  <button class="btn btn-light" type="button" id="toggleNewPass"
                    style="border-radius:0 6px 6px 0;border-color:#e2e8f0;font-size:11px;"><i
                      class="mdi mdi-eye-outline"></i></button>
                </div>
              </div>
            </div>
            <div class="mt-1 mb-2"
              style="background:#fffbeb;border:1px solid #fcd34d;border-radius:8px;display:flex;align-items:flex-start;gap:6px;padding:7px 10px;font-size:9px;color: #742e03ff;">
              <i class="mdi mdi-alert" style="font-size:14px;color:#f59e0b;flex-shrink:0;margin-top:1px;"></i>
              <div style="flex:1;line-height:1.3;"><strong>Change ESP32 WiFi Network:</strong> Use this menu to switch
                the ESP32 to a different WiFi connection (e.g., from WiFi A to WiFi B). Press the <b>Scan</b> button
                next to the SSID name to search for nearby WiFi networks.</div>
            </div>
            <button type="button" class="btn btn-sm btn-block" id="saveWifiBtn"
              style="background:#4B49AC;color:#fff;border-radius:6px;font-weight:600;font-size:11px;padding:6px;">
              <i class="mdi mdi-check mr-1"></i> Save
            </button>
          </div>
        </div>
      </div>

      <!-- Profile Card (Right - 3/12) -->
      <style>
        .profile-animated-card::before {
          content: '';
          position: absolute;
          width: 120px;
          height: 200%;
          /* Gradasi: Biru Muda -> Biru Tua -> Putih (Agak Tebal) -> Ungu Tua -> Ungu Muda -> Biru Muda */
          background-image: linear-gradient(180deg, #dcf2fd, #2b8afb, #ffffff 40%, #ffffff 60%, #8b24f5, #df12c0, #dcf2fd);
          animation: rotBGimgProfile 3s linear infinite;
          transition: all 0.2s linear;
          z-index: 0;
          top: 50%;
          left: 50%;
        }

        @keyframes rotBGimgProfile {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }

          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        .profile-animated-card::after {
          content: '';
          position: absolute;
          background: #ffffff;
          inset: 1.5px;
          border-radius: 8.5px;
          z-index: 1;
        }
      </style>
      <div class="col-md-3 grid-margin">
        <div class="card profile-animated-card"
          style="border: none; border-radius: 10px; position: relative; overflow: hidden; width:100%;">
          <div class="card-body" style="z-index:2;padding:1rem;text-align:center; position:relative;">
            <p class="card-title mb-0" style="font-size:0.95rem;">My Profile</p>
            <small class="text-muted">Logged in account</small>
            <div style="margin-top:12px;">
              <div
                style="width:86px;height:86px;border-radius:50%;overflow:hidden;border:3px solid #e2e8f0;margin:0 auto;">
                <img src="${dashFotoSrc}" alt="Profile"
                  style="width:100%;height:100%;object-fit:cover;">
              </div>
            </div>
            <!-- Name & Username -->
            <div style="margin-top:8px;">
              <p class="mb-0" style="font-size:13px;font-weight:700;color:#1a1a1a;">${dashName2}
              </p>
              <p class="mb-0" style="font-size:11px;color:#94a3b8;">@${dashUsername}</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- content-wrapper ends -->

  <!-- WIFI CHANGE MODAL (Removed) -->
  <!-- ==================== MODAL: WIFI SCAN ==================== -->
  <div class="modal fade" id="wifiScanModal" tabindex="-1">
    <div class="modal-dialog modal-sm">
      <div class="modal-content mdl-card">
        <div class="modal-header">
          <h6 class="modal-title font-weight-bold"><i class="mdi mdi-wifi-marker mr-1 text-primary"></i> Scan WiFi</h6>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>
        <div class="modal-body text-center">
          <!-- Scanning Animation -->
          <div id="wifiScanAnim">
            <div style="margin:16px auto 20px;">
              <svg width="80" height="70" viewBox="0 0 80 70" fill="none" style="display:block;margin:0 auto;">
                <!-- Antenna head (circle) -->
                <circle cx="40" cy="28" r="7" stroke="#4B49AC" stroke-width="3" fill="none" />
                <!-- Antenna stick -->
                <rect x="38" y="35" width="4" height="22" rx="2" fill="#4B49AC" />

                <!-- LEFT arcs (inner to outer) -->
                <path class="wifi-arc arc-l1" d="M26 28 A14 14 0 0 1 26 14" stroke="#4B49AC" stroke-width="3"
                  stroke-linecap="round" fill="none" />
                <path class="wifi-arc arc-l2" d="M20 32 A20 20 0 0 1 20 10" stroke="#4B49AC" stroke-width="3"
                  stroke-linecap="round" fill="none" />
                <path class="wifi-arc arc-l3" d="M14 36 A26 26 0 0 1 14 6" stroke="#4B49AC" stroke-width="3"
                  stroke-linecap="round" fill="none" />
                <path class="wifi-arc arc-l4" d="M8 40 A32 32 0 0 1 8 2" stroke="#4B49AC" stroke-width="3"
                  stroke-linecap="round" fill="none" />

                <!-- RIGHT arcs (inner to outer) -->
                <path class="wifi-arc arc-r1" d="M54 14 A14 14 0 0 1 54 28" stroke="#4B49AC" stroke-width="3"
                  stroke-linecap="round" fill="none" />
                <path class="wifi-arc arc-r2" d="M60 10 A20 20 0 0 1 60 32" stroke="#4B49AC" stroke-width="3"
                  stroke-linecap="round" fill="none" />
                <path class="wifi-arc arc-r3" d="M66 6 A26 26 0 0 1 66 36" stroke="#4B49AC" stroke-width="3"
                  stroke-linecap="round" fill="none" />
                <path class="wifi-arc arc-r4" d="M72 2 A32 32 0 0 1 72 40" stroke="#4B49AC" stroke-width="3"
                  stroke-linecap="round" fill="none" />
              </svg>
            </div>
            <p style="font-size:12px;color:#666;margin:0;">Scanning for WiFi networks near the ESP32<span
                class="scan-dots">...</span></p>
          </div>
          <!-- Network List -->
          <div id="wifiNetworkList" style="display:none;text-align:left;">
            <p
              style="font-size:10px;color:#999;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">
              <i class="mdi mdi-access-point-network mr-1"></i> Networks Found
            </p>
            <div id="wifiListItems" style="max-height:240px;overflow-y:auto;"></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ==================== MODAL: SAVE PROGRESS (TRANSPARENT) ==================== -->
  <div class="modal fade" id="wifiSaveModal" tabindex="-1" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog modal-sm" id="wifiSaveModalDialog">
      <div class="modal-content mdl-card" style="border:none;overflow:visible;background:transparent;box-shadow:none;">
        <div class="save-glass-card">
          <!-- Step 1: Connecting -->
          <div id="saveStep1" class="save-step text-center">
            <div class="save-orbit-wrap">
              <div class="save-orbit-dot" style="animation-delay:0s;"></div>
              <div class="save-orbit-dot" style="animation-delay:0.4s;"></div>
              <div class="save-orbit-dot" style="animation-delay:0.8s;"></div>
              <i class="mdi mdi-wifi save-center-icon" style="color:#4B49AC;"></i>
            </div>
            <h6 class="font-weight-bold mb-1">Connecting</h6>
            <p style="font-size:11px;color:#888;margin-bottom:12px;">Sending configuration to ESP32...</p>
            <div class="save-bar-track">
              <div class="save-bar-fill" style="background:linear-gradient(90deg,#4B49AC,#7978E9);"></div>
            </div>
          </div>
          <!-- Step 2: Configuring -->
          <div id="saveStep2" class="save-step text-center" style="display:none;">
            <div class="save-orbit-wrap">
              <i class="mdi mdi-cog save-center-icon" style="color:#f59e0b;animation:spinSave 2s linear infinite;"></i>
              <div class="save-particle" style="--angle:0deg;--delay:0s;"></div>
              <div class="save-particle" style="--angle:60deg;--delay:0.2s;"></div>
              <div class="save-particle" style="--angle:120deg;--delay:0.4s;"></div>
              <div class="save-particle" style="--angle:180deg;--delay:0.6s;"></div>
              <div class="save-particle" style="--angle:240deg;--delay:0.8s;"></div>
              <div class="save-particle" style="--angle:300deg;--delay:1s;"></div>
            </div>
            <h6 class="font-weight-bold mb-1">Configuring</h6>
            <p style="font-size:11px;color:#888;margin-bottom:12px;">Saving ESP32 settings...</p>
            <div class="save-bar-track">
              <div class="save-bar-fill" style="background:linear-gradient(90deg,#f59e0b,#fbbf24);"></div>
            </div>
          </div>
          <!-- Step 3: Restarting -->
          <div id="saveStep3" class="save-step text-center" style="display:none;">
            <div class="save-orbit-wrap">
              <i class="mdi mdi-restart save-center-icon"
                style="color:#ef4444;animation:bounceRestart 1s ease infinite;"></i>
            </div>
            <h6 class="font-weight-bold mb-1">Restarting ESP32</h6>
            <p style="font-size:11px;color:#888;margin-bottom:12px;">Connecting to new network...</p>
            <div class="d-flex justify-content-center" style="gap:5px;">
              <div class="restart-dot" style="animation-delay:0s;"></div>
              <div class="restart-dot" style="animation-delay:0.15s;"></div>
              <div class="restart-dot" style="animation-delay:0.3s;"></div>
            </div>
          </div>
          <!-- Step 4: Success -->
          <div id="saveStep4" class="save-step text-center" style="display:none;">
            <div
              style="width:70px;height:70px;margin:0 auto 14px;border-radius:50%;background:rgba(16,185,129,0.1);display:flex;align-items:center;justify-content:center;">
              <i class="mdi mdi-check-circle" style="font-size:44px;color:#10b981;animation:popIn 0.5s ease;"></i>
            </div>
            <h6 class="font-weight-bold mb-1" style="color:#10b981;">Successfully Connected!</h6>
            <p id="saveNewSsidDisplay" style="font-size:13px;font-weight:700;color:#333;margin-bottom:14px;"></p>
            <button type="button" class="btn btn-sm btn-block" id="btnCloseSaveModal"
              style="background:#10b981;color:#fff;border-radius:6px;font-weight:600;font-size:12px;"><i
                class="mdi mdi-check mr-1"></i> Done</button>
          </div>
          <!-- Step 5: Failed -->
          <div id="saveStep5" class="save-step text-center" style="display:none;">
            <div
              style="width:70px;height:70px;margin:0 auto 14px;border-radius:50%;background:rgba(239,68,68,0.1);display:flex;align-items:center;justify-content:center;">
              <i class="mdi mdi-close-circle" style="font-size:44px;color:#ef4444;animation:popIn 0.5s ease;"></i>
            </div>
            <h6 class="font-weight-bold mb-1" style="color:#ef4444;">Connection Failed!</h6>
            <p id="saveErrorDisplay" style="font-size:11px;color:#888;margin-bottom:10px;padding:0 10px;">Wrong password
              or weak signal.</p>

            <!-- Detail Explanation Box (Analisis Kegagalan) -->
            <div id="saveFailDetailBox" style="text-align:left;padding:8px 14px;margin-bottom:6px;">
              <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;">
                <i class="mdi mdi-alert-circle" style="font-size:16px;color:#dc2626;"></i>
                <span style="font-size:11px;font-weight:700;color:#212024;">Failure Analysis</span>
              </div>
              <div id="saveFailReasonText" style="font-size:10.5px;color:#212024;line-height:1.6;"></div>
            </div>

            <!-- Saran Tindakan Box (separate, no background) -->
            <div id="saveFailSuggestBox" style="text-align:left;padding:8px 14px;margin-bottom:10px;">
              <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
                <i class="mdi mdi-lightbulb-on-outline" style="font-size:14px;color:#d97706;"></i>
                <span style="font-size:10.5px;font-weight:700;color:#212024;">Suggested Actions</span>
              </div>
              <ul id="saveFailSuggestions"
                style="font-size:10.5px;color:#212024;line-height:1.6;padding-left:16px;margin:0;"></ul>
            </div>

            <!-- Fallback Status (outside both boxes) -->
            <div id="saveFailFallbackInfo" style="margin-bottom:14px;display:none;"></div>

            <button type="button" class="btn btn-sm btn-block" id="btnRetrySaveModal"
              style="background:#ef4444;color:#fff;border-radius:6px;font-weight:600;font-size:12px;"><i
                class="mdi mdi-refresh mr-1"></i> Try Again</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Login History Modal removed - now displayed inline in card -->

  <!-- ==================== MODAL: NOTIFICATION ACCESS ==================== -->
  <div id="notif-gate"
    style="position: fixed; inset: 0; z-index: 99999; background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(8px); display: none; align-items: center; justify-content: center; padding: 32px; text-align: center;">
    <div class="modal-card" id="notif-modal"
      style="background: #ffffff; border-radius: 24px; padding: 32px 24px; width: 100%; max-width: 360px; box-shadow: 0 20px 40px rgba(0,0,0,0.15); animation: notifModalPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); position: relative; z-index: 100000; text-align: center;">
      <div class="notif-icon-wrap" id="notif-icon-wrap"
        style="width: 80px; height: 80px; border-radius: 50%; background: #e6e6f2; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; position: relative; transition: all 0.3s;">
        <i class="mdi mdi-bell-ring" id="notif-icon" style="font-size: 38px; color: #4747a1; transition: all 0.3s;"></i>
      </div>
      <h2
        style="font-size: 22px; font-weight: 800; color: #0f172a; margin-bottom: 12px; font-family: 'Inter', sans-serif;">
        Notification Access</h2>
      <p
        style="font-size: 14px; color: #64748b; margin-bottom: 28px; line-height: 1.6; font-family: 'Inter', sans-serif;">
        Please allow notifications to stay updated in real-time. The system will send instant alerts to your device
        whenever a new chat arrives, new occupant or account registrations occur, when the FTM Room Door is accessed,
        and if the ESP32 Wi-Fi is disconnected.</p>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <button id="btn-allow-notif"
          style="background: #4747a1; color: #fff; border: none; padding: 16px; border-radius: 14px; font-weight: 700; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: 'Inter', sans-serif; display: flex; align-items: center; justify-content: center; gap: 8px;">
          <i class="mdi mdi-bell-plus"></i> Allow Notification
        </button>
        <button id="btn-deny-notif"
          style="background: transparent; color: #64748b; border: 2px solid #e2e8f0; padding: 14px; border-radius: 14px; font-weight: 700; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: 'Inter', sans-serif;">
          Deny
        </button>
        <button id="btn-close-notif"
          style="display: none; background: #4747a1; color: #fff; border: none; padding: 16px; border-radius: 14px; font-weight: 700; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: 'Inter', sans-serif; align-items: center; justify-content: center; gap: 8px;">
          <i class="mdi mdi-close-circle-outline" style="font-size: 18px;"></i> Close
        </button>
        <div id="notif-translate-wrap" style="text-align: right; margin-top: 4px;">
          <span id="translate-notif"
            style="font-size: 11px; font-weight: 600; color: #4747a1; cursor: pointer; text-decoration: underline;">Terjemahkan
            ke Indonesia</span>
        </div>
      </div>
    </div>
  </div>

  <style>
    @keyframes notifModalPop {
      0% {
        transform: scale(0.8) translateY(20px);
        opacity: 0;
      }

      100% {
        transform: scale(1) translateY(0);
        opacity: 1;
      }
    }

    .notif-icon-wrap::after {
      content: '';
      position: absolute;
      inset: -8px;
      border-radius: 50%;
      border: 2px solid rgba(71, 71, 161, 0.3);
      animation: pulse-ring 2s infinite;
    }

    .notif-icon-wrap.blocked {
      background: #fee2e2 !important;
    }

    .notif-icon-wrap.blocked i {
      color: #ef4444 !important;
    }

    .notif-icon-wrap.blocked::after {
      border-color: rgba(239, 68, 68, 0.4) !important;
    }

    @keyframes pulse-ring {
      0% {
        transform: scale(0.8);
        opacity: 1;
      }

      100% {
        transform: scale(1.3);
        opacity: 0;
      }
    }

    #btn-allow-notif:hover,
    #btn-close-notif:hover {
      transform: translateY(-2px);
    }

    #btn-deny-notif:hover {
      background: #f1f5f9;
      color: #0f172a;
      border-color: #cbd5e1;
    }
  </style>

  
  `;

  const scriptContent = `
<!-- DASHBOARD SCRIPTS -->
  
  

  <style>
    /* === WiFi Antenna Arc Animation === */
    .wifi-arc {
      opacity: 0.12;
    }

    .arc-l1,
    .arc-r1 {
      animation: arcBlink 2s ease-in-out infinite 0s;
    }

    .arc-l2,
    .arc-r2 {
      animation: arcBlink 2s ease-in-out infinite 0.3s;
    }

    .arc-l3,
    .arc-r3 {
      animation: arcBlink 2s ease-in-out infinite 0.6s;
    }

    .arc-l4,
    .arc-r4 {
      animation: arcBlink 2s ease-in-out infinite 0.9s;
    }

    @keyframes arcBlink {

      0%,
      100% {
        opacity: 0.12;
      }

      20%,
      45% {
        opacity: 1;
      }
    }

    .scan-dots {
      animation: scanDots 1.5s steps(4, end) infinite;
    }

    @keyframes scanDots {
      0% {
        content: '';
      }

      25% {
        content: '.';
      }

      50% {
        content: '..';
      }

      75% {
        content: '...';
      }
    }

    /* === Save Modal Glass Card === */
    .save-glass-card {
      background: rgba(255, 255, 255, 0.92);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-radius: 16px;
      padding: 28px 24px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.3) inset;
    }

    #wifiSaveModal .modal-backdrop {
      opacity: 0.35 !important;
    }

    /* === Orbit Animation (Step 1) === */
    .save-orbit-wrap {
      position: relative;
      width: 80px;
      height: 80px;
      margin: 0 auto 16px;
    }

    .save-center-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 30px;
    }

    .save-orbit-dot {
      position: absolute;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #4B49AC;
      top: 50%;
      left: 50%;
      animation: orbitSpin 1.5s linear infinite;
      animation-delay: var(--delay, 0s);
    }

    @keyframes orbitSpin {
      0% {
        transform: translate(-50%, -50%) rotate(0deg) translateX(34px) scale(1);
        opacity: 0.8;
      }

      50% {
        opacity: 1;
        transform: translate(-50%, -50%) rotate(180deg) translateX(34px) scale(1.3);
      }

      100% {
        transform: translate(-50%, -50%) rotate(360deg) translateX(34px) scale(1);
        opacity: 0.8;
      }
    }

    /* === Particles (Step 2) === */
    .save-particle {
      position: absolute;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: #f59e0b;
      top: 50%;
      left: 50%;
      animation: particleFly 2s ease-in-out infinite;
      animation-delay: var(--delay, 0s);
    }

    @keyframes particleFly {
      0% {
        transform: translate(-50%, -50%) rotate(var(--angle)) translateX(0) scale(0);
        opacity: 0;
      }

      30% {
        opacity: 1;
        transform: translate(-50%, -50%) rotate(var(--angle)) translateX(30px) scale(1);
      }

      70% {
        opacity: 0.6;
        transform: translate(-50%, -50%) rotate(var(--angle)) translateX(38px) scale(0.6);
      }

      100% {
        opacity: 0;
        transform: translate(-50%, -50%) rotate(var(--angle)) translateX(42px) scale(0);
      }
    }

    /* === Bounce Restart (Step 3) === */
    @keyframes bounceRestart {

      0%,
      100% {
        transform: translate(-50%, -50%) scale(1) rotate(0deg);
      }

      25% {
        transform: translate(-50%, -50%) scale(0.85) rotate(-30deg);
      }

      50% {
        transform: translate(-50%, -50%) scale(1.15) rotate(15deg);
      }

      75% {
        transform: translate(-50%, -50%) scale(0.95) rotate(-5deg);
      }
    }

    .restart-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #ef4444;
      animation: dotPulse 1.2s ease-in-out infinite;
    }

    /* === Shared Keyframes === */
    @keyframes spinSave {
      0% {
        transform: translate(-50%, -50%) rotate(0deg);
      }

      100% {
        transform: translate(-50%, -50%) rotate(360deg);
      }
    }

    @keyframes dotPulse {

      0%,
      80%,
      100% {
        transform: scale(0.5);
        opacity: 0.3;
      }

      40% {
        transform: scale(1.2);
        opacity: 1;
      }
    }

    @keyframes popIn {
      0% {
        transform: scale(0);
        opacity: 0;
      }

      60% {
        transform: scale(1.2);
      }

      100% {
        transform: scale(1);
        opacity: 1;
      }
    }

    /* === Progress Bar === */
    .save-bar-track {
      width: 160px;
      height: 4px;
      background: #eee;
      border-radius: 4px;
      margin: 0 auto;
      overflow: hidden;
    }

    .save-bar-fill {
      width: 0%;
      height: 100%;
      border-radius: 4px;
      transition: width 0.6s ease;
    }
  </style>
  `;

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      <div dangerouslySetInnerHTML={{ __html: scriptContent }} />
      <Script src="https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js" strategy="lazyOnload" />
      <Script src="/js/dashboard-script.js" strategy="lazyOnload" />
      {/* fix_scripts_applied */}
    </>
  );
}
