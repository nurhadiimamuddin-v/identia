/**
 * Premium QR Code Card Designer — Bright Blue Edition
 * Clean design with bright dark blue background and elegant geometric shapes.
 */
function createCompositeQrImage(qrCanvas) {
    var W = 900, H = 1200;
    var c = document.createElement('canvas');
    c.width = W; c.height = H;
    var ctx = c.getContext('2d');

    // ═══════════════════════════════════════════
    // 1. BRIGHTER DARK BLUE GRADIENT BACKGROUND
    // ═══════════════════════════════════════════
    var bgGrad = ctx.createLinearGradient(0, 0, W * 0.3, H);
    bgGrad.addColorStop(0, '#0c2d6b');
    bgGrad.addColorStop(0.35, '#103a8a');
    bgGrad.addColorStop(0.7, '#1348a0');
    bgGrad.addColorStop(1, '#0b2558');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // ═══════════════════════════════════════════
    // 2. ELEGANT GEOMETRIC BACKGROUND SHAPES
    // ═══════════════════════════════════════════

    // --- Large swooping curve — top area ---
    ctx.fillStyle = 'rgba(40, 100, 200, 0.15)';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(W, 0);
    ctx.lineTo(W, 180);
    ctx.quadraticCurveTo(W * 0.5, 320, 0, 160);
    ctx.closePath();
    ctx.fill();

    // --- Large swooping curve — bottom area ---
    ctx.fillStyle = 'rgba(30, 80, 180, 0.12)';
    ctx.beginPath();
    ctx.moveTo(0, H);
    ctx.lineTo(W, H);
    ctx.lineTo(W, H - 170);
    ctx.quadraticCurveTo(W * 0.5, H - 310, 0, H - 140);
    ctx.closePath();
    ctx.fill();

    // --- Big hexagon — top-right (partially off-screen) ---
    ctx.fillStyle = 'rgba(50, 120, 220, 0.08)';
    ctx.beginPath();
    var hx = W - 60, hy = 80, hr = 220;
    for (var i = 0; i < 6; i++) {
        var angle = (Math.PI / 3) * i - Math.PI / 6;
        var px = hx + hr * Math.cos(angle);
        var py = hy + hr * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();

    // --- Big hexagon — bottom-left (partially off-screen) ---
    ctx.fillStyle = 'rgba(40, 100, 200, 0.07)';
    ctx.beginPath();
    var hx2 = 70, hy2 = H - 90, hr2 = 200;
    for (var j = 0; j < 6; j++) {
        var angle2 = (Math.PI / 3) * j;
        var px2 = hx2 + hr2 * Math.cos(angle2);
        var py2 = hy2 + hr2 * Math.sin(angle2);
        if (j === 0) ctx.moveTo(px2, py2); else ctx.lineTo(px2, py2);
    }
    ctx.closePath();
    ctx.fill();

    // --- Diagonal parallelogram — left side ---
    ctx.fillStyle = 'rgba(50, 120, 220, 0.06)';
    ctx.beginPath();
    ctx.moveTo(0, 480);
    ctx.lineTo(140, 400);
    ctx.lineTo(160, 500);
    ctx.lineTo(0, 580);
    ctx.closePath();
    ctx.fill();

    // --- Diagonal parallelogram — right side ---
    ctx.fillStyle = 'rgba(40, 110, 210, 0.06)';
    ctx.beginPath();
    ctx.moveTo(W, 650);
    ctx.lineTo(W - 150, 730);
    ctx.lineTo(W - 130, 830);
    ctx.lineTo(W, 750);
    ctx.closePath();
    ctx.fill();

    // --- Diamond — left-center ---
    ctx.save();
    ctx.translate(90, 720);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = 'rgba(60, 140, 240, 0.07)';
    ctx.fillRect(-30, -30, 60, 60);
    ctx.restore();

    // --- Diamond — right-upper ---
    ctx.save();
    ctx.translate(W - 100, 350);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = 'rgba(50, 130, 230, 0.06)';
    ctx.fillRect(-22, -22, 44, 44);
    ctx.restore();

    // --- Small dots scattered ---
    ctx.fillStyle = 'rgba(100, 170, 255, 0.12)';
    ctx.beginPath(); ctx.arc(180, 200, 5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(W - 200, H - 250, 4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(130, H - 300, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(W - 140, 260, 4, 0, Math.PI * 2); ctx.fill();

    // --- Subtle glow — center ---
    var glow = ctx.createRadialGradient(W / 2, H / 2, 10, W / 2, H / 2, 450);
    glow.addColorStop(0, 'rgba(40, 100, 220, 0.08)');
    glow.addColorStop(1, 'rgba(40, 100, 220, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    // ═══════════════════════════════════════════
    // 3. WHITE CARD — CLEAN & CENTERED
    // ═══════════════════════════════════════════
    var cardW = 700, cardH = 780;
    var cardX = (W - cardW) / 2;
    var cardY = (H - cardH) / 2 - 30;
    var cardR = 24;

    // Card shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
    ctx.shadowBlur = 60;
    ctx.shadowOffsetY = 18;

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, cardR);
    ctx.fill();

    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // ═══════════════════════════════════════════
    // 4. QR CODE — BIGGER with more padding
    // ═══════════════════════════════════════════
    var qrPadding = 50;
    var qrSize = cardW - (qrPadding * 2);
    var qrX = cardX + qrPadding;
    var qrY = cardY + (cardH - qrSize) / 2;

    ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

    // ═══════════════════════════════════════════
    // 5. HEADER — ABOVE CARD
    // ═══════════════════════════════════════════
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 46px "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('IDENTIA', W / 2, cardY - 50);

    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '500 18px "Segoe UI", Arial, sans-serif';
    ctx.fillText('Scan QR Code', W / 2, cardY - 18);

    // ═══════════════════════════════════════════
    // 6. FOOTER — BELOW CARD
    // ═══════════════════════════════════════════
    var footY = cardY + cardH + 45;

    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '500 16px "Segoe UI", Arial, sans-serif';
    ctx.fillText('identia.montaklo.id', W / 2, footY);

    return c.toDataURL('image/png');
}
