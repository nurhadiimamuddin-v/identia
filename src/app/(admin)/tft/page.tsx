import Script from 'next/script';

import React from 'react';

export default async function TftPage() {
  
  const htmlContent = `
<style>/* PAGE_CSS_INJECTED */
body { background-color: #f8f9fa; }
        .control-btn {
            height: 60px;
            font-size: 16px;
            font-weight: bold;
            border-radius: 12px;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }

</style>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>TFT Remote Control - Identia</title>
    <!-- css & plugins -->
    <link rel="stylesheet" href="vendors/feather/feather.css">
    <link rel="stylesheet" href="vendors/ti-icons/css/themify-icons.css">
    <link rel="stylesheet" href="vendors/css/vendor.bundle.base.css">
    <link rel="stylesheet" href="css/vertical-layout-light/style.css">
    <link rel="stylesheet" href="vendors/mdi/css/materialdesignicons.min.css">
    <style>
        body { background-color: #f8f9fa; }
        .control-btn {
            height: 60px;
            font-size: 16px;
            font-weight: bold;
            border-radius: 12px;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
    </style>
</head>
<body>
    <div class="container-scroller">
        <div class="container-fluid page-body-wrapper full-page-wrapper">
            <div class="content-wrapper d-flex align-items-center auth px-0">
                <div class="row w-100 mx-0">
                    <div class="col-lg-4 mx-auto">
                        <div class="auth-form-light text-left py-5 px-4 px-sm-5" style="border-radius: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                            <div class="brand-logo text-center mb-4">
                                <img src="images/ko.png" alt="logo" style="width: 150px;">
                            </div>
                            <h4 class="font-weight-bold text-center mb-2">TFT Remote Control</h4>
                            <p class="text-center text-muted mb-3" style="font-size: 13px;">Ubah tampilan layar ESP32 dari jarak jauh (Solusi sementara Touch Screen).</p>
                            
                            <h5 class="text-primary font-weight-bold mb-3 mt-4" style="font-size: 14px; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px;">Menu Utama & Registrasi</h5>
                            <button class="btn btn-primary btn-block control-btn" onclick="setScreen('SCR_MAIN')">
                                <i class="mdi mdi-home"></i> Halaman Utama
                            </button>
                            <button class="btn btn-info btn-block control-btn" onclick="setScreen('SCR_REGISTER_MENU')">
                                <i class="mdi mdi-account-plus"></i> Buka Form Registrasi
                            </button>
                            <button class="btn btn-outline-info btn-block control-btn" onclick="setScreen('SCR_INPUT_CODE')" style="border-width: 2px;">
                                <i class="mdi mdi-dialpad"></i> Register with Code
                            </button>

                            <h5 class="text-primary font-weight-bold mb-3 mt-4" style="font-size: 14px; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px;">Input Form (Keyboard)</h5>
                            <button class="btn btn-outline-primary btn-block control-btn" onclick="setScreen('SCR_INPUT_KEYBOARD_0')" style="border-width: 2px;">
                                <i class="mdi mdi-keyboard"></i> Isi Kolom: Nama Lengkap
                            </button>
                            <button class="btn btn-outline-primary btn-block control-btn" onclick="setScreen('SCR_INPUT_KEYBOARD_1')" style="border-width: 2px;">
                                <i class="mdi mdi-keyboard"></i> Isi Kolom: NIK / NIP
                            </button>
                            <button class="btn btn-outline-primary btn-block control-btn" onclick="setScreen('SCR_INPUT_KEYBOARD_2')" style="border-width: 2px;">
                                <i class="mdi mdi-keyboard"></i> Isi Kolom: No. Telegram
                            </button>
                            <button class="btn btn-outline-primary btn-block control-btn" onclick="setScreen('SCR_INPUT_KEYBOARD_3')" style="border-width: 2px;">
                                <i class="mdi mdi-dialpad"></i> Isi Kolom: PIN (Num)
                            </button>

                            <h5 class="text-primary font-weight-bold mb-3 mt-4" style="font-size: 14px; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px;">Proses Lanjutan & Darurat</h5>
                            <button class="btn btn-success btn-block control-btn" onclick="setScreen('SCR_QR_REG_FOTO')">
                                <i class="mdi mdi-qrcode-scan"></i> Tampilkan QR Foto
                            </button>
                            <button class="btn btn-warning btn-block control-btn" onclick="setScreen('SCR_REG_FINGER')">
                                <i class="mdi mdi-fingerprint"></i> Tampilkan Scan Sidik Jari
                            </button>
                            <button class="btn btn-danger btn-block control-btn" onclick="setScreen('SCR_EMERGENCY')">
                                <i class="mdi mdi-alert"></i> Buka Pin Darurat
                            </button>
                            <hr>
                            <p class="text-center text-success mt-3" id="statusMsg" style="display:none;font-weight:bold;">Perintah terkirim!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    
    
</body>
</html>

  `;

  const scriptContent = `

  `;

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      <div dangerouslySetInnerHTML={{ __html: scriptContent }} />
      <Script src="vendors/js/vendor.bundle.base.js" strategy="lazyOnload" />
      <Script src="/js/tft-script.js" strategy="lazyOnload" />
      {/* fix_scripts_applied */}
    </>
  );
}
