import Script from 'next/script';

import React from 'react';

export default async function NewPage() {
  
  const htmlContent = `
<style>/* PAGE_CSS_INJECTED */
/* ── MANUAL STRIPES & BORDERS ── */
    #myTable thead th {
      border-bottom: 1px solid #e2e8f0 !important;
    }

    #myTable tbody tr td {
      border-bottom: none !important;
      /* Hapus garis horizontal bawah antar menu */
    }

    .pill {
      display: inline-flex;
      align-items: center;
      font-weight: 600;
      font-size: 11px;
      padding: 3px 12px;
      border-radius: 20px;
    }

    .pill-green {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .pill-red {
      background: #ffebee;
      color: #c62828;
    }

    .pill-amber {
      background: #fff8e1;
      color: #f57f17;
    }

    .pill-gray {
      background: #f5f5f5;
      color: #757575;
    }

    .tbl-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
      border: 1.5px solid #eee;
    }

    .ios-switch {
      position: relative;
      display: inline-block;
      width: 32px;
      height: 18px;
      margin: 0;
    }

    .ios-switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .ios-slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #e5e5ea;
      transition: .4s cubic-bezier(0.4, 0.0, 0.2, 1);
      border-radius: 26px;
      box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .ios-slider:before {
      position: absolute;
      content: "";
      height: 14px;
      width: 14px;
      left: 2px;
      bottom: 2px;
      background-color: white;
      transition: .4s cubic-bezier(0.4, 0.0, 0.2, 1);
      border-radius: 50%;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }

    .ios-switch input:checked+.ios-slider {
      background-color: #1e1f23;
    }

    .ios-switch input:checked+.ios-slider:before {
      transform: translateX(14px);
    }

    .expand-arrow {
      font-size: 18px;
      color: #bbb;
      transition: transform 0.25s ease, color 0.2s;
    }

    tr.shown .expand-arrow {
      transform: rotate(180deg);
      color: #4b7bec;
    }

    .details-control:hover .expand-arrow {
      color: #4b7bec;
    }

    /* ══════════════ DROPDOWN — Seamless UI ══════════════ */
    #myTable tbody tr.shown>td {
      border-bottom: none !important;
      border-top: none !important;
      /* Hapus garis atas */
    }

    #myTable tbody tr.shown+tr>td {
      padding: 0 !important;
      margin: 0 !important;
      border-bottom: none !important;
      border-top: 1px solid #e2e8f0 !important;
      /* Tambah garis horizontal pemisah antar Menu dengan Halaman Dropdown */
      background-color: #fafafa !important;
    }

    #myTable tbody tr.shown+tr>td>div,
    #myTable tbody tr.shown+tr>td>* {
      padding: 0 !important;
      margin: 0 !important;
    }

    #myTable tbody tr.shown+tr>td:first-child {
      border-left: 1px solid #fafafa !important;
      border-bottom-left-radius: 8px;
    }

    #myTable tbody tr.shown+tr>td:last-child {
      border-right: 1px solid #fafafa !important;
      border-bottom-right-radius: 8px;
    }

    #myTable tbody tr.shown>td:first-child {
      border-left: 1px solid #e2e8f0 !important;
      border-top-left-radius: 8px;
    }

    #myTable tbody tr.shown>td:last-child {
      border-right: 1px solid #e2e8f0 !important;
      border-top-right-radius: 8px;
    }

    @keyframes ddSlideIn {
      from {
        opacity: 0;
        transform: translateY(-4px);
      }

      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* ── MODALS ── */
    .mdl-card {
      border: none;
      border-radius: 6px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
    }

    .confirm-circle {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border: 2.5px solid #ef5350;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 10px;
    }

    .confirm-circle span {
      font-size: 28px;
      color: #ef5350;
      line-height: 1;
    }

    .delete-ok-msg {
      display: none;
      margin-top: 12px;
      font-size: 13px;
      color: #43a047;
      font-weight: 500;
    }

    .frm-lbl {
      font-size: 12px;
      font-weight: 600;
      color: #555;
      margin-bottom: 3px;
    }

    .pin-warning {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      background: #fffbeb;
      border: 1px solid #fcd34d;
      border-radius: 6px;
      padding: 10px 12px;
      font-size: 12px;
      color: #92400e;
    }

    .pin-warning i {
      font-size: 18px;
      color: #f59e0b;
      flex-shrink: 0;
      margin-top: 1px;
    }

    .foto-wrapper {
      position: relative;
      display: inline-block;
      cursor: pointer;
      width: 72px;
      height: 72px;
    }

    .foto-circle {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #e0e0e0;
      transition: border-color 0.2s;
    }

    .foto-badge {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #4b7bec;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #fff;
    }

    .foto-badge i {
      color: #fff;
      font-size: 12px;
    }

    .foto-wrapper:hover .foto-circle {
      border-color: #4b7bec;
    }

    .btn-custom-edit {
      background: #e2e6ea;
      border: none;
      color: #212529;
      transition: background 0.2s ease;
    }

    .btn-custom-edit:hover,
    .btn-custom-edit:focus {
      background: #cbd3da;
      color: #212529;
    }

    .eye-toggle {
      cursor: pointer;
      background: #fff;
      border-left: none;
    }

    .eye-toggle:hover i {
      color: #4b7bec;
    }

    .code-big {
      font-size: 26px;
      letter-spacing: 8px;
      color: #222;
      font-weight: 700;
      border-right: none;
    }

    .code-input-group .form-control {
      border-right: none;
    }

    .info-alert {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      font-size: 13px;
      color: #1e293b;
    }

    .info-alert-icon {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: #1d4ed8;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .info-alert-icon i {
      color: #e0ecff;
      font-size: 14px;
      line-height: 1;
    }

    .countdown-timer {
      font-weight: 700;
      color: #dc2626;
      font-size: 12px;
      margin-left: 8px;
      display: inline-flex;
      align-items: center;
      background: #fef2f2;
      padding: 3px 10px;
      border-radius: 6px;
      border: 1px solid #fecaca;
      white-space: nowrap;
    }

    @keyframes pulse-timer {

      0%,
      100% {
        opacity: 1;
      }

      50% {
        opacity: 0.5;
      }
    }

    .delete-confirm-cb:checked~.custom-control-label::before {
      background-color: #ff4747 !important;
      border-color: #ff4747 !important;
    }

</style>

<div class="content-wrapper">
    <div class="row">
      <div class="col-md-12 grid-margin">
        <div class="row">
          <div class="col-12 col-xl-8 mb-4 mb-xl-0">
            <h3 class="font-weight-bold">New Occupant</h3>
            <h6 class="font-weight-normal mb-0">Register new users for available rooms, <span
                class="text-primary">Registering a new occupant!</span></h6>
          </div>

          <div class="col-12 col-xl-4">
            <div class="justify-content-end d-flex flex-wrap" style="gap:15px; align-items:center;">

              <div class="justify-content-end d-flex">
                <div class="dropdown flex-md-grow-1 flex-xl-grow-0">
                  <button class="btn btn-primary mb-3" data-toggle="modal" data-target="#modalTambah">
                    <i class="mdi mdi-account-plus mr-1"></i> Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12 grid-margin stretch-card">
        <div class="card"
          style="border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.03); border-radius: 10px;">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <p class="card-title mb-0">Data Occupant</p>
              <div>
                <button class="btn btn-sm btn-outline-light" id="btnSelectMode"
                  style="font-weight:bold; border-radius:6px;"><i
                    class="mdi mdi-checkbox-multiple-marked-outline mr-1"></i></button>
                <button class="btn btn-sm btn-danger ml-2" id="btnBulkDelete"
                  style="display:none; font-weight:bold; border-radius:6px;"><i
                    class="mdi mdi-delete mr-1"></i></button>
              </div>
            </div>
            <div class="table-responsive">
              <table class="table table-borderless" id="myTable">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Name</th>
                    <th>Phone No.</th>
                    <th>Code Reg</th>
                    <th>Status</th>
                    <th style="width:60px; text-align:center;">Action</th>
                  </tr>
                </thead>
                
                <tbody>
                  
                    <tr class="">
                      <td style="vertical-align:middle; font-weight:600; color:#555;"></td>
                      <td style="vertical-align:middle;">
                        <div class="d-flex align-items-center"><span
                            style="font-weight:500; font-size:14px; color:#212529;"></span>
                        </div>
                      </td>
                      <td style="vertical-align:middle; font-weight:500;"></td>
                      <td style="vertical-align:middle;">
                        <div
                          style="font-family:'Courier New', monospace; font-size:13px; color:#4b49ac; font-weight:bold; letter-spacing:1px;">
                          </div>
                      </td>
                      <td style="vertical-align:middle;"></td>
                      <td style="vertical-align:middle; text-align:center;">
                        <button class="btn btn-sm btn-danger text-white btn-row-delete" title="Delete Data"
                          onclick="openDeleteModal('', '')"
                          style="border-radius:6px; font-weight:bold; width:32px; padding: 4px 0; font-size:14px; display:inline-flex; align-items:center; justify-content:center;">
                          <i class="mdi mdi-delete"></i>
                        </button>
                        <input type="checkbox" class="bulk-cb" value=""
                          style="display:none; transform: scale(1.5); cursor:pointer; margin-top:5px;">
                      </td>
                    </tr>
                    
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ==================== MODAL: TAMBAH ==================== -->
  <div class="modal fade" id="modalTambah" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content mdl-card">
        <form id="formTambahOccupant" enctype="multipart/form-data">
          <div class="modal-header">
            <h6 class="modal-title font-weight-bold"><i class="mdi mdi-account-plus mr-1 text-primary"></i> Add Occupant
            </h6>
            <button type="button" class="close" data-dismiss="modal">&times;</button>
          </div>
          <div class="modal-body py-3">

            <div class="text-center mb-3">
              <div class="foto-wrapper" style="cursor:default;">
                <img id="previewFoto" src="images/faces/user.jpg" class="foto-circle">
                <div class="foto-badge"><i class="mdi mdi-camera"></i></div>
              </div>
              <small class="text-muted d-block" style="font-size:11px;"><i class="mdi mdi-information-outline"></i>
                Photo is taken via QR code after data is saved</small>
            </div>
            <div class="row">
              <div class="col-6">
                <div class="form-group mb-2"><label class="frm-lbl">Full Name</label><input type="text" name="name"
                    class="form-control form-control-sm" placeholder="Full name" required></div>
              </div>
              <div class="col-6">
                <div class="form-group mb-2"><label class="frm-lbl">NIK / NIP</label><input type="text" name="nik_nip"
                    class="form-control form-control-sm" placeholder="NIK or NIP" required></div>
              </div>
            </div>
            <div class="form-group mb-2"><label class="frm-lbl">Phone Number (Telegram)</label><input type="text"
                name="no_hp" class="form-control form-control-sm" placeholder="08xxxxxxxxxxx" required></div>
            <div class="row">
            </div>

            <div class="form-group mb-1">
              <label class="frm-lbl">PIN (6 Digit)</label>
              <input type="password" name="pin" id="inputPinField" maxlength="6" class="form-control form-control-sm"
                placeholder="6 digit PIN" pattern="\d{6}" required style="letter-spacing:4px;">
              <small class="text-muted" style="font-size:10px;"><i class="mdi mdi-information mr-1"></i>PIN is required
                for emergency door access</small>
            </div>
          </div>
          <div class="modal-footer py-2">
            <button type="button" class="btn btn-light btn-sm" data-dismiss="modal">Cancel</button>
            <button type="submit" class="btn btn-primary btn-sm" id="btnSubmitOccupant"><i
                class="mdi mdi-content-save mr-1"></i>Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- ==================== MODAL: EDIT ==================== -->
  <div class="modal fade" id="modalEdit" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content mdl-card">
        <form id="formEditOccupant">
          <input type="hidden" name="id_occupant" id="edit_id">
          <div class="modal-header">
            <h6 class="modal-title font-weight-bold"><i class="mdi mdi-pencil mr-1 text-primary"></i> Edit Occupant</h6>
            <button type="button" class="close" data-dismiss="modal">&times;</button>
          </div>
          <div class="modal-body py-3">

            <div class="row">
              <div class="col-6">
                <div class="form-group mb-2"><label class="frm-lbl">Full Name</label><input type="text" name="name"
                    id="edit_name" class="form-control form-control-sm" required></div>
              </div>
              <div class="col-6">
                <div class="form-group mb-2"><label class="frm-lbl">NIK / NIP</label><input type="text" name="nik_nip"
                    id="edit_nik" class="form-control form-control-sm" required></div>
              </div>
            </div>
            <div class="form-group mb-2"><label class="frm-lbl">Phone Number (Telegram)</label><input type="text"
                name="no_hp" id="edit_no_hp" class="form-control form-control-sm" required></div>
          </div>
          <div class="modal-footer py-2">
            <button type="button" class="btn btn-light btn-sm" data-dismiss="modal">Cancel</button>
            <button type="submit" class="btn btn-primary btn-sm" id="btnEditOccupant"><i
                class="mdi mdi-content-save mr-1"></i>Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- ==================== MODAL: EDIT ==================== -->
  <div class="modal fade" id="modalEditFoto" tabindex="-1" data-backdrop="static">
    <div class="modal-dialog">
      <div class="modal-content mdl-card">
        <div class="modal-header">
          <h6 class="modal-title font-weight-bold"><i class="mdi mdi-camera mr-1 text-primary"></i> Edit Photo</h6>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>
        <div class="modal-body text-center" id="editFotoBody" style="padding-bottom:20px;">
          <input type="hidden" id="editFotoOccupantId">

          <div class="info-alert mb-3 text-left">
            <div class="info-alert-icon"><i class="mdi mdi-check-circle-outline"></i></div>
            <div class="info-alert-text" style="flex:1; font-size:12px; line-height:1.4;">
              <strong style="display:block; margin-bottom:2px;">Data Updated Successfully!</strong>
              Follow the steps below to update the photo. If you <b>don't</b> want to update the photo, click
              <b>Finish</b>.
            </div>
          </div>

          <div id="editFotoDefaultView" style="cursor:pointer;" onclick="generateEditFotoQr()">
            <img id="editFotoPreview" src="images/faces/user.jpg"
              style="width:120px; height:120px; border-radius:50%; object-fit:cover; border:3px solid #e0e7ff; box-shadow:0 4px 10px rgba(0,0,0,0.05); transition:transform 0.2s;">
            <p class="mt-3 text-muted" style="font-size:12px; font-weight:500;"><i
                class="mdi mdi-cursor-default-click text-primary mr-1"></i>Click the photo above to change via QR Code
            </p>
          </div>
          <div id="editFotoLoadingView" style="display:none; padding:30px;">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2" style="font-size:12px; color:#999; font-weight:500;">Generating QR...</p>
          </div>
          <div id="editFotoQrView" style="display:none;">
            <div id="editFotoQrCanvas"
              style="display:inline-block; padding:12px; background:#fff; border-radius:12px; border:2px solid #e0e7ff; box-shadow:0 4px 16px rgba(99,102,241,0.1);">
            </div>

            <div class="input-group mb-2 mt-3">
              <input type="text" id="editFotoLinkText" class="form-control form-control-sm" readonly
                style="font-size:11px;">
              <div class="input-group-append">
                <button class="btn btn-outline-light text-dark btn-sm" type="button" onclick="copyEditFotoLink()"><i
                    class="mdi mdi-content-copy mr-1"></i>Copy</button>
              </div>
            </div>
            <button class="btn btn-sm btn-primary mt-2 w-100" onclick="downloadEditFotoQr()"
              style="border-radius:8px; font-weight:bold; letter-spacing:0.5px;"><i
                class="mdi mdi-download mr-1"></i>Download QR Code</button>
          </div>
        </div>
        <div class="modal-footer py-2">
          <button type="button" class="btn btn-light btn-sm" onclick="closeEditFotoModal()">Finish</button>
        </div>
      </div>
    </div>
  </div>

  <!-- ==================== MODAL: VERIFIKASI PIN QR ==================== -->
  <div class="modal fade" id="modalVerifikasiPin" tabindex="-1" data-backdrop="static">
    <div class="modal-dialog modal-sm">
      <div class="modal-content mdl-card">
        <div class="modal-header">
          <h6 class="modal-title font-weight-bold"><i class="mdi mdi-face-recognition mr-1 text-primary"></i> Verify PIN
          </h6>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>
        <div class="modal-body text-center" id="verifikasiPinBody" style="padding-bottom:20px;">
          <input type="hidden" id="verifikasiPinOccupantId">
          <div id="verifikasiPinDefaultView" style="cursor:pointer;" onclick="generatePinQr()">
            <div
              style="width:100px; height:100px; border-radius:16px; background:#f8fafc; border:2px dashed #cbd5e1; margin:0 auto; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 10px rgba(0,0,0,0.02); transition:transform 0.2s;">
              <i class="mdi mdi-qrcode-scan" style="font-size:40px; color:#94a3b8;"></i>
            </div>
            <p class="mt-3 text-muted" style="font-size:12px; font-weight:500;"><i
                class="mdi mdi-cursor-default-click text-primary mr-1"></i>Click the icon above to generate QR Code</p>
          </div>
          <div id="verifikasiPinLoadingView" style="display:none; padding:30px;">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2" style="font-size:12px; color:#999; font-weight:500;">Generating QR...</p>
          </div>
          <div id="verifikasiPinQrView" style="display:none;">
            <div id="qrPinContainer"
              style="display:inline-block; padding:16px; background:#fff; border-radius:12px; box-shadow:0 8px 24px rgba(0,0,0,0.12); border: 2px solid #e2e8f0; margin-bottom:16px;">
              <div id="verifikasiPinQrCanvas"></div>
            </div>
            <div class="input-group mb-2">
              <input type="text" id="verifikasiPinLinkText" class="form-control form-control-sm" readonly
                style="font-size:11px;">
              <div class="input-group-append">
                <button class="btn btn-outline-light text-dark btn-sm" type="button" onclick="copyPinQrLink()"><i
                    class="mdi mdi-content-copy mr-1"></i>Copy</button>
              </div>
            </div>
            <button class="btn btn-sm btn-primary mt-2 w-100" onclick="downloadPinQr()"
              style="border-radius:8px; font-weight:bold; letter-spacing:0.5px;"><i
                class="mdi mdi-download mr-1"></i>Download QR Code</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ==================== MODAL: PHOTO PREVIEW ==================== -->
  <div class="modal fade" id="modalPhotoPreview" tabindex="-1" data-backdrop="static">
    <div class="modal-dialog" style="display:flex; align-items:center; min-height:100vh;">
      <div class="modal-content mdl-card">
        <div class="modal-header">
          <h6 class="modal-title font-weight-bold" style="color:#1e293b;"><i
              class="mdi mdi-image-outline mr-1 text-primary"></i> Photo Preview</h6>
          <button type="button" class="close" data-dismiss="modal"
            style="position:absolute; right:15px; top:10px; color:#64748b;">&times;</button>
        </div>
        <div class="modal-body text-center" style="padding:0 20px 20px 20px; background:#f8fafc;">
          <img id="previewModalImage" src=""
            style="width:100%; max-height:350px; object-fit:cover; border-radius:8px; border:2px solid #e2e8f0; margin-bottom:15px; box-shadow:0 4px 12px rgba(0,0,0,0.05);">
        </div>
        <div class="modal-footer py-2">
          <button type="button" class="btn btn-light btn-sm" data-dismiss="modal">Close</button>
          <a id="btnDownloadPreview" href="#" download="Occupant_Photo.jpg" class="btn btn-primary btn-sm"><i
              class="mdi mdi-download mr-1"></i>Download Photo</a>
        </div>
      </div>
    </div>
  </div>

  <!-- ==================== MODAL: CODE REGISTER ==================== -->
  <div class="modal fade" id="modalCodeRegister" tabindex="-1" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog">
      <div class="modal-content mdl-card">
        <div class="modal-header">
          <h6 class="modal-title font-weight-bold" style="font-size:14px;"><i
              class="mdi mdi-key-variant mr-1 text-primary"></i> Registration Code</h6>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>
        <div class="modal-body" style="padding: 15px 20px;">
          <div class="info-alert mb-2">
            <div class="info-alert-icon" style="width:20px; height:20px;"><i class="mdi mdi-check-circle-outline"
                style="font-size:12px;"></i></div>
            <div class="info-alert-text"
              style="flex:1;display:flex;align-items:center;justify-content:space-between; font-size:11px;">
              <span><strong>Data Saved Successfully!</strong> Save the code below to register on the Fingerprint
                device.</span>
              <span class="countdown-timer" id="codeRegisterCountdown" title="Modal akan tertutup otomatis"
                style="font-size:11px; padding:2px 6px;"><i class="mdi mdi-timer-outline mr-1"></i>05:00</span>
            </div>
          </div>
          <label class="frm-lbl" style="font-size:11px; margin-bottom:4px;">Registration Code</label>
          <div class="input-group code-input-group mb-2">
            <input type="text" id="hasilCodeRegister" class="form-control text-center code-big" readonly
              style="font-size:20px; padding:4px; height:auto;">
            <div class="input-group-append"><span class="input-group-text"
                style="background:#fff;border-left:none;cursor:pointer; padding:4px 10px;" id="btnCopy"
                onclick="copyCode()"><i class="fas fa-copy" style="color:#6c757d; font-size:12px;"></i></span></div>
          </div>
          <!-- QR Code Area -->
          <div id="qrCodeArea" style="display:none;">
            <label class="frm-lbl" style="font-size:11px; margin-bottom:2px;"><i class="mdi mdi-qrcode mr-1"></i>Photo
              Registration QR Code</label>
            <div class="text-center">
              <div id="qrCodeContainer"
                style="display:inline-block; padding:10px; background:#fff; border-radius:10px; border:2px solid #e0e7ff; box-shadow:0 4px 12px rgba(0,0,0,0.08); margin-bottom:10px;">
                <div id="qrCodeCanvas"></div>
              </div>
            </div>
            <div class="input-group mb-2 mt-2">
              <input type="text" id="qrLinkText" class="form-control form-control-sm" readonly
                style="font-size:11px; padding:4px;">
              <div class="input-group-append">
                <button class="btn btn-outline-light text-dark btn-sm" type="button" onclick="copyQrCodeRegisterLink()"
                  style="padding:4px 10px;"><i class="mdi mdi-content-copy mr-1"></i>Copy</button>
              </div>
            </div>
            <button class="btn btn-primary btn-sm btn-block mt-2" onclick="downloadQrCodeRegister()"
              id="btnDownloadQrReg" style="padding:10px;"><i class="mdi mdi-download mr-1"></i>Download QR Code</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ==================== MODAL: QR FOTO ==================== -->
  <div class="modal fade" id="modalQrFoto" tabindex="-1" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog " style="max-width:420px;">
      <div class="modal-content mdl-card">
        <div class="modal-header py-2 bg-light">
          <h6 class="modal-title font-weight-bold"><i class="mdi mdi-qrcode mr-1 text-primary"></i> Photo Registration
            QR</h6>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>
        <div class="modal-body text-center">
          <div class="mb-3">
            <div
              style="width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#e0e7ff,#c7d2fe);display:inline-flex;align-items:center;justify-content:center;margin-bottom:8px;">
              <i class="mdi mdi-face-recognition" style="font-size:28px;color:#4b7bec;"></i>
            </div>
            <p style="font-size:13px;color:#555;margin:0;">Share this QR code with <strong id="qrFotoName"></strong></p>
            <p style="font-size:11px;color:#999;margin:4px 0 0;"><i class="mdi mdi-alert-circle-outline mr-1"></i>QR can
              only be used <strong>once</strong></p>
          </div>
          <div id="qrFotoLoading" style="padding:30px;">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2" style="font-size:12px;color:#999;">Generating QR...</p>
          </div>
          <div id="qrFotoContainer"
            style="display:none; padding:16px; background:#fff; border-radius:12px; border:2px solid #e0e7ff; box-shadow:0 8px 24px rgba(0,0,0,0.12); margin-bottom:16px; margin-left:auto; margin-right:auto; width:fit-content;">
            <div id="qrFotoCanvas"></div>
          </div>
          <div id="qrFotoActions" style="display:none;">
            <div class="input-group mb-2">
              <input type="text" id="qrFotoLinkText" class="form-control form-control-sm" readonly
                style="font-size:11px;">
              <div class="input-group-append">
                <button class="btn btn-outline-light text-dark btn-sm" type="button" onclick="copyQrFotoLink()"><i
                    class="mdi mdi-content-copy mr-1"></i>Copy</button>
              </div>
            </div>
            <button class="btn btn-primary btn-sm btn-block mt-2" onclick="downloadQrFoto()"><i
                class="mdi mdi-download mr-1"></i>Download QR Code</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ==================== MODAL: VERIFY PIN ==================== -->
  <div class="modal fade" id="modalVerifyPin" tabindex="-1">
    <div class="modal-dialog  modal-sm">
      <div class="modal-content mdl-card">
        <div class="modal-header py-2">
          <h6 class="modal-title font-weight-bold"><i class="mdi mdi-lock mr-1 text-warning"></i> Verify PIN</h6>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>
        <div class="modal-body text-center">
          <i class="mdi mdi-shield-lock-outline" style="font-size:40px;color:#f59e0b;"></i>
          <p class="mt-2 mb-3" style="font-size:12px;color:#666;">Enter 6-digit PIN to view the original password.</p>
          <input type="hidden" id="verifyPinOccupantId">
          <input type="password" id="verifyPinInput" class="form-control text-center" maxlength="6"
            placeholder="● ● ● ● ● ●" style="letter-spacing:8px;font-size:18px;font-weight:700;">
          <div id="verifyPinError" class="text-danger mt-2" style="display:none;font-size:12px;"><i
              class="mdi mdi-alert-circle mr-1"></i><span id="verifyPinErrorMsg"></span></div>
          <button type="button" class="btn btn-primary btn-sm btn-block mt-3" id="btnVerifyPin"
            onclick="submitPinVerify()"><i class="mdi mdi-check mr-1"></i>Verify</button>
        </div>
      </div>
    </div>
  </div>

  <!-- ==================== MODAL: SHOW PASSWORD ==================== -->
  <div class="modal fade" id="modalShowPassword" tabindex="-1">
    <div class="modal-dialog  modal-sm">
      <div class="modal-content mdl-card">
        <div class="modal-header py-2">
          <h6 class="modal-title font-weight-bold"><i class="mdi mdi-key mr-1 text-success"></i> Original Password</h6>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="pin-warning mb-2" style="background:#fff3cd;border-color:#ffc107;">
            <i class="mdi mdi-alert" style="color:#d97706;"></i>
            <div style="color:#92400e;font-size:11px;">Do not share this password with anyone!</div>
          </div>
          <div class="input-group">
            <input type="text" id="revealedPassword" class="form-control" readonly
              style="font-size:15px;font-weight:600;letter-spacing:1px;">
            <div class="input-group-append"><span class="input-group-text" style="cursor:pointer;"
                onclick="copyRevealed()"><i class="fas fa-copy" id="btnCopyRevealed" style="color:#6c757d;"></i></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ==================== MODAL: DELETE ==================== -->
  <div class="modal fade" id="modalDeleteOccupant" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content mdl-card">
        <form id="formDeleteOccupant">
          <div class="modal-body p-4" style="text-align: left;">
            <input type="hidden" name="id_occupant" id="delete_id_occupant">
            <h5 class="font-weight-bold mb-3">Delete Occupant</h5>
            <p style="font-size:14px;color:#666;margin-bottom:20px;">Are you sure you want to delete <strong
                id="delete_occupant_name"></strong>?</p>

            <div class="custom-control custom-checkbox mb-4" style="display:flex; align-items:center;">
              <input type="checkbox" class="custom-control-input delete-confirm-cb" id="deleteConfirmCheckOccupant"
                required>
              <label class="custom-control-label" for="deleteConfirmCheckOccupant"
                style="font-size:14px; color:#1e1f23; padding-top:2px;">I understand that all of my data will be
                deleted</label>
            </div>

            <div class="d-flex justify-content-end" style="gap:8px;">
              <button type="button" class="btn btn-light font-weight-bold" style="padding:8px 18px;font-size:13px;"
                data-dismiss="modal">Cancel</button>
              <button type="submit" class="btn btn-danger font-weight-bold" style="padding:8px 18px;font-size:13px;"
                id="btnDeleteOccupant" disabled>Delete</button>
            </div>

          </div>
        </form>
      </div>
    </div>
  </div>
  


  <!-- ========================== CSS ========================== -->
  <style>
    /* ── MANUAL STRIPES & BORDERS ── */
    #myTable thead th {
      border-bottom: 1px solid #e2e8f0 !important;
    }

    #myTable tbody tr td {
      border-bottom: none !important;
      /* Hapus garis horizontal bawah antar menu */
    }

    .pill {
      display: inline-flex;
      align-items: center;
      font-weight: 600;
      font-size: 11px;
      padding: 3px 12px;
      border-radius: 20px;
    }

    .pill-green {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .pill-red {
      background: #ffebee;
      color: #c62828;
    }

    .pill-amber {
      background: #fff8e1;
      color: #f57f17;
    }

    .pill-gray {
      background: #f5f5f5;
      color: #757575;
    }

    .tbl-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
      border: 1.5px solid #eee;
    }

    .ios-switch {
      position: relative;
      display: inline-block;
      width: 32px;
      height: 18px;
      margin: 0;
    }

    .ios-switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .ios-slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #e5e5ea;
      transition: .4s cubic-bezier(0.4, 0.0, 0.2, 1);
      border-radius: 26px;
      box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .ios-slider:before {
      position: absolute;
      content: "";
      height: 14px;
      width: 14px;
      left: 2px;
      bottom: 2px;
      background-color: white;
      transition: .4s cubic-bezier(0.4, 0.0, 0.2, 1);
      border-radius: 50%;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }

    .ios-switch input:checked+.ios-slider {
      background-color: #1e1f23;
    }

    .ios-switch input:checked+.ios-slider:before {
      transform: translateX(14px);
    }

    .expand-arrow {
      font-size: 18px;
      color: #bbb;
      transition: transform 0.25s ease, color 0.2s;
    }

    tr.shown .expand-arrow {
      transform: rotate(180deg);
      color: #4b7bec;
    }

    .details-control:hover .expand-arrow {
      color: #4b7bec;
    }

    /* ══════════════ DROPDOWN — Seamless UI ══════════════ */
    #myTable tbody tr.shown>td {
      border-bottom: none !important;
      border-top: none !important;
      /* Hapus garis atas */
    }

    #myTable tbody tr.shown+tr>td {
      padding: 0 !important;
      margin: 0 !important;
      border-bottom: none !important;
      border-top: 1px solid #e2e8f0 !important;
      /* Tambah garis horizontal pemisah antar Menu dengan Halaman Dropdown */
      background-color: #fafafa !important;
    }

    #myTable tbody tr.shown+tr>td>div,
    #myTable tbody tr.shown+tr>td>* {
      padding: 0 !important;
      margin: 0 !important;
    }

    #myTable tbody tr.shown+tr>td:first-child {
      border-left: 1px solid #fafafa !important;
      border-bottom-left-radius: 8px;
    }

    #myTable tbody tr.shown+tr>td:last-child {
      border-right: 1px solid #fafafa !important;
      border-bottom-right-radius: 8px;
    }

    #myTable tbody tr.shown>td:first-child {
      border-left: 1px solid #e2e8f0 !important;
      border-top-left-radius: 8px;
    }

    #myTable tbody tr.shown>td:last-child {
      border-right: 1px solid #e2e8f0 !important;
      border-top-right-radius: 8px;
    }

    @keyframes ddSlideIn {
      from {
        opacity: 0;
        transform: translateY(-4px);
      }

      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* ── MODALS ── */
    .mdl-card {
      border: none;
      border-radius: 6px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
    }

    .confirm-circle {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border: 2.5px solid #ef5350;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 10px;
    }

    .confirm-circle span {
      font-size: 28px;
      color: #ef5350;
      line-height: 1;
    }

    .delete-ok-msg {
      display: none;
      margin-top: 12px;
      font-size: 13px;
      color: #43a047;
      font-weight: 500;
    }

    .frm-lbl {
      font-size: 12px;
      font-weight: 600;
      color: #555;
      margin-bottom: 3px;
    }

    .pin-warning {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      background: #fffbeb;
      border: 1px solid #fcd34d;
      border-radius: 6px;
      padding: 10px 12px;
      font-size: 12px;
      color: #92400e;
    }

    .pin-warning i {
      font-size: 18px;
      color: #f59e0b;
      flex-shrink: 0;
      margin-top: 1px;
    }

    .foto-wrapper {
      position: relative;
      display: inline-block;
      cursor: pointer;
      width: 72px;
      height: 72px;
    }

    .foto-circle {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #e0e0e0;
      transition: border-color 0.2s;
    }

    .foto-badge {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #4b7bec;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #fff;
    }

    .foto-badge i {
      color: #fff;
      font-size: 12px;
    }

    .foto-wrapper:hover .foto-circle {
      border-color: #4b7bec;
    }

    .btn-custom-edit {
      background: #e2e6ea;
      border: none;
      color: #212529;
      transition: background 0.2s ease;
    }

    .btn-custom-edit:hover,
    .btn-custom-edit:focus {
      background: #cbd3da;
      color: #212529;
    }

    .eye-toggle {
      cursor: pointer;
      background: #fff;
      border-left: none;
    }

    .eye-toggle:hover i {
      color: #4b7bec;
    }

    .code-big {
      font-size: 26px;
      letter-spacing: 8px;
      color: #222;
      font-weight: 700;
      border-right: none;
    }

    .code-input-group .form-control {
      border-right: none;
    }

    .info-alert {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      font-size: 13px;
      color: #1e293b;
    }

    .info-alert-icon {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: #1d4ed8;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .info-alert-icon i {
      color: #e0ecff;
      font-size: 14px;
      line-height: 1;
    }

    .countdown-timer {
      font-weight: 700;
      color: #dc2626;
      font-size: 12px;
      margin-left: 8px;
      display: inline-flex;
      align-items: center;
      background: #fef2f2;
      padding: 3px 10px;
      border-radius: 6px;
      border: 1px solid #fecaca;
      white-space: nowrap;
    }

    @keyframes pulse-timer {

      0%,
      100% {
        opacity: 1;
      }

      50% {
        opacity: 0.5;
      }
    }

    .delete-confirm-cb:checked~.custom-control-label::before {
      background-color: #ff4747 !important;
      border-color: #ff4747 !important;
    }
  </style>

  <!-- content-wrapper ends -->
   
  `;

  const scriptContent = `
<!-- ========================== JS ========================== -->
  
  
  

  

  
  `;

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      <div dangerouslySetInnerHTML={{ __html: scriptContent }} />
      <Script src="https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js" strategy="lazyOnload" />
      <Script src="js/qr_card_designer.js" strategy="lazyOnload" />
      <Script src="/js/new-script.js" strategy="lazyOnload" />
      {/* fix_scripts_applied */}
    </>
  );
}
