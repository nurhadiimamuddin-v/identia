
document.querySelectorAll('.eye-toggle').forEach(function(b) { b.addEventListener('click', function() { var t = document.getElementById(this.dataset.target), i = this.querySelector('i'); if (t.type === 'password') { t.type = 'text'; i.classList.replace('mdi-eye-off','mdi-eye'); } else { t.type = 'password'; i.classList.replace('mdi-eye','mdi-eye-off'); } }); });

var currentQrUrl = '';

// Generate QR after tambah (in Code Register modal)
function generateQrInCodeModal(idOccupant) {
    var area = document.getElementById('qrCodeArea');
    var canvas = document.getElementById('qrCodeCanvas');
    area.style.display = 'none';
    canvas.innerHTML = '';

    var fd = new FormData();
    fd.append('id_occupant', idOccupant);
    fetch('generate_foto_token.php', { method: 'POST', body: fd })
    .then(function(r){ return r.json(); })
    .then(function(d) {
        if (d.status === 'success') {
            area.style.display = 'block';
            currentQrUrl = d.url;
            document.getElementById('qrLinkText').value = d.url;
            new QRCode(canvas, {
                text: d.url,
                width: 200,
                height: 200,
                colorDark: '#0f172a',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
            });
        }
    }).catch(function(){});
}

function copyQrCodeRegisterLink() {
    navigator.clipboard.writeText(document.getElementById('qrLinkText').value);
    showCustomAlert('Link copied successfully!');
}



function downloadQrCodeRegister() {
    var qrCanvas = document.querySelector('#qrCodeCanvas canvas');
    if (!qrCanvas) { alert("QR Code has not been generated yet."); return; }
    
    var imgUrl = createCompositeQrImage(qrCanvas);
    var dlLink = document.createElement('a');
    dlLink.download = 'QR_Registrasi_Foto.png';
    dlLink.href = imgUrl;
    dlLink.click();
}

// Show QR modal from edit/dropdown
function showQrFoto(idOccupant) {
    $('#modalEdit').modal('hide');
    var loading = document.getElementById('qrFotoLoading');
    var canvas = document.getElementById('qrFotoCanvas');
    var actions = document.getElementById('qrFotoActions');
    loading.style.display = 'block';
    canvas.style.display = 'none';
    canvas.innerHTML = '';
    actions.style.display = 'none';
    document.getElementById('qrFotoName').textContent = '';
    $('#modalQrFoto').modal('show');

    var fd = new FormData();
    fd.append('id_occupant', idOccupant);
    fetch('generate_foto_token.php', { method: 'POST', body: fd })
    .then(function(r){ return r.json(); })
    .then(function(d) {
        loading.style.display = 'none';
        if (d.status === 'success') {
            document.getElementById('qrFotoContainer').style.display = 'block';
            canvas.style.display = 'block';
            actions.style.display = 'block';
            document.getElementById('qrFotoName').textContent = d.name;
            document.getElementById('qrFotoLinkText').value = d.url;
            new QRCode(canvas, {
                text: d.url,
                width: 220,
                height: 220,
                colorDark: '#0f172a',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
            });
        } else {
            document.getElementById('qrFotoContainer').style.display = 'none';
            loading.innerHTML = '<i class="mdi mdi-alert-circle" style="font-size:40px;color:#ef5350;"></i><p style="font-size:13px;color:#999;margin-top:8px;">' + (d.message || 'Failed to generate QR') + '</p>';
            loading.style.display = 'block';
        }
    }).catch(function(){
        loading.innerHTML = '<i class="mdi mdi-alert-circle" style="font-size:40px;color:#ef5350;"></i><p style="font-size:13px;color:#999;margin-top:8px;">Connection failed</p>';
        loading.style.display = 'block';
    });
}

function copyQrFotoLink() {
    navigator.clipboard.writeText(document.getElementById('qrFotoLinkText').value);
    showCustomAlert('Link copied successfully!');
}

function downloadQrFoto() {
    var qrCanvas = document.querySelector('#qrFotoCanvas canvas');
    if (!qrCanvas) { alert("QR Code has not been generated yet."); return; }
    
    var imgUrl = createCompositeQrImage(qrCanvas);
    var dlLink = document.createElement('a');
    dlLink.download = 'QR_Edit_Foto.png';
    dlLink.href = imgUrl;
    dlLink.click();
}


// Tambah
document.getElementById("formTambahOccupant").addEventListener("submit", function(e) {
    e.preventDefault();
    var btn = document.getElementById("btnSubmitOccupant"); btn.disabled = true; btn.innerHTML = '<i class="mdi mdi-loading mdi-spin mr-1"></i>Saving...';
    fetch("tambah_occupant.php", { method: "POST", body: new FormData(this) }).then(function(r){ return r.json(); }).then(function(d) {
        btn.disabled = false; btn.innerHTML = '<i class="mdi mdi-content-save mr-1"></i>Save';
        if (d.status === "success") { $("#modalTambah").modal("hide"); document.getElementById("formTambahOccupant").reset(); document.getElementById("previewFoto").src = "images/faces/user.jpg"; document.getElementById("hasilCodeRegister").value = d.code_register; $("#modalCodeRegister").modal({ backdrop:'static', keyboard:false }); if (d.id_occupant) { generateQrInCodeModal(d.id_occupant); } }
        else { showCustomAlert(d.message || "Failed to save data."); }
    }).catch(function(){ btn.disabled=false; btn.innerHTML='<i class="mdi mdi-content-save mr-1"></i>Save'; showCustomAlert("Connection to server failed."); });
});

// Edit
document.getElementById("formEditOccupant").addEventListener("submit", function(e) {
    e.preventDefault();
// Removed edit password validation
    var btn = document.getElementById("btnEditOccupant"); btn.disabled = true; btn.innerHTML = '<i class="mdi mdi-loading mdi-spin mr-1"></i>Saving...';
    fetch("edit_occupant.php", { method: "POST", body: new FormData(this) }).then(function(r){ return r.json(); }).then(function(d) {
        btn.disabled = false; btn.innerHTML = '<i class="mdi mdi-content-save mr-1"></i>Save';
        if (d.status === "success") { 
            $("#modalEdit").modal("hide"); 
            document.getElementById("editFotoOccupantId").value = document.getElementById("edit_id").value;
            document.getElementById("editFotoPreview").src = currentEditFoto || 'images/faces/user.jpg';
            document.getElementById("editFotoDefaultView").style.display = "block";
            document.getElementById("editFotoLoadingView").style.display = "none";
            document.getElementById("editFotoQrView").style.display = "none";
            $("#modalEditFoto").modal("show");
        }
        else { showCustomAlert(d.message || "Failed to save changes."); }
    }).catch(function(){ btn.disabled=false; btn.innerHTML='<i class="mdi mdi-content-save mr-1"></i>Save'; showCustomAlert("Connection to server failed."); });
});

function copyCode() { var v = document.getElementById("hasilCodeRegister").value, b = document.getElementById("btnCopy").querySelector('i'); navigator.clipboard.writeText(v).then(function() { b.classList.replace("fa-copy","fa-check"); showCustomAlert('Registration Code copied successfully!'); setTimeout(function(){ b.classList.replace("fa-check","fa-copy"); }, 2000); }); }
function copyRevealed() { var v = document.getElementById("revealedPassword").value, b = document.getElementById("btnCopyRevealed"); navigator.clipboard.writeText(v).then(function() { b.classList.replace("fa-copy","fa-check"); showCustomAlert('Password copied successfully!'); setTimeout(function(){ b.classList.replace("fa-check","fa-copy"); }, 2000); }); }

var currentEditFoto = '';

function openDeleteModal(id, name) { document.getElementById("delete_id_occupant").value = id; document.getElementById("delete_occupant_name").innerText = name; $("#modalDeleteOccupant").modal("show"); }
function openEditModal(id, name, nik, no_hp, foto) {
    document.getElementById("edit_id").value = id;
    document.getElementById("edit_name").value = name;
    document.getElementById("edit_nik").value = nik || '';
    document.getElementById("edit_no_hp").value = no_hp;
    currentEditFoto = foto;
    $("#modalEdit").modal("show");
}

function generateEditFotoQr() {
    var id = document.getElementById("editFotoOccupantId").value;
    document.getElementById("editFotoDefaultView").style.display = 'none';
    document.getElementById("editFotoLoadingView").style.display = 'block';
    var fd = new FormData();
    fd.append('id_occupant', id);
    fetch('generate_foto_token.php', { method: 'POST', body: fd })
    .then(function(r) { return r.json(); })
    .then(function(d) {
        document.getElementById("editFotoLoadingView").style.display = 'none';
        if (d.status === 'success') {
            document.getElementById("editFotoQrView").style.display = 'block';
            var canvas = document.getElementById("editFotoQrCanvas");
            canvas.innerHTML = '';
            document.getElementById("editFotoLinkText").value = d.url;
            new QRCode(canvas, {
                text: d.url,
                width: 180,
                height: 180,
                colorDark: '#1e1b4b',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
            });
        } else {
            showCustomAlert("Failed to generate QR");
            document.getElementById("editFotoDefaultView").style.display = 'block';
        }
    }).catch(function(e) {
        document.getElementById("editFotoLoadingView").style.display = 'none';
        showCustomAlert("Connection failed while generating QR.");
        document.getElementById("editFotoDefaultView").style.display = 'block';
    });
}
function copyEditFotoLink() {
    navigator.clipboard.writeText(document.getElementById('editFotoLinkText').value);
    showCustomAlert('Edit Photo link copied successfully!');
}
function downloadEditFotoQr() {
    var qrCanvas = document.querySelector('#editFotoQrCanvas canvas');
    if (!qrCanvas) { showCustomAlert("QR Code has not been generated yet."); return; }
    var imgUrl = createCompositeQrImage(qrCanvas);
    var dlLink = document.createElement('a');
    dlLink.download = 'QR_Perbarui_Foto.png';
    dlLink.href = imgUrl;
    dlLink.click();
}
function closeEditFotoModal() { $("#modalEditFoto").modal("hide"); location.reload(); }

function toggleStatus(id) { $.post("toggle_status_occupant.php", { id_occupant: id }, function(d) { if (d.status === "success") location.reload(); else showCustomAlert(d.message || "Failed to process."); }, "json"); }

function quickRegisterFinger(code) {
    if (!code) { showCustomAlert("Error: Kode pendaftaran tidak ditemukan."); return; }
    document.getElementById("reg_finger_code_fast").value = code;
    var regCb = document.getElementById('registerConfirmCheck');
    var regBtn = document.getElementById('btnNowRegisterFinger');
    if(regCb) regCb.checked = false;
    if(regBtn) regBtn.disabled = true;
    $("#modalRegisterFingerConfirm").modal("show");
}

var fingerPollInterval = null;

function executeRegisterFinger() {
    var code = document.getElementById("reg_finger_code_fast").value;
    document.getElementById("reg_finger_poll_code").value = code;
    // Reset modal to waiting state
    document.getElementById("fingerWaitingView").style.display = "block";
    document.getElementById("fingerSuccessView").style.display = "none";
    $("#modalRegisterFingerConfirm").modal("hide");
    $("#modalRegisterFingerProgress").modal("show");
    $.post("api_wifi.php", { action: "set_tft_screen", screen: "SCR_REG_FINGER", form_code: code }, function(d) {
        if (!d.success) {
            showCustomAlert("Failed to start registration on device.");
        }
    }, "json");
    // Start polling for finger_id every 2 seconds
    startFingerPoll(code);
}

function startFingerPoll(code) {
    stopFingerPoll();
    fingerPollInterval = setInterval(function() {
        $.get("api_wifi.php", { action: "check_finger_status", code: code }, function(d) {
            if (d.status === "success" && d.finger_id) {
                stopFingerPoll();
                // Show success view
                document.getElementById("fingerWaitingView").style.display = "none";
                document.getElementById("fingerSuccessView").style.display = "block";
                document.getElementById("fingerSuccessId").textContent = d.finger_id;
            }
        }, "json");
    }, 2000);
}

function stopFingerPoll() {
    if (fingerPollInterval) {
        clearInterval(fingerPollInterval);
        fingerPollInterval = null;
    }
}

function cancelRegisterFinger() {
    stopFingerPoll();
    $("#modalRegisterFingerProgress").modal("hide");
    $.post("api_wifi.php", { action: "set_tft_screen", screen: "SCR_MAIN" }, function(d) {
        // Returned to main
    }, "json");
}

function closeFingerSuccessModal() {
    stopFingerPoll();
    $("#modalRegisterFingerProgress").modal("hide");
    location.reload();
}

// PIN verify QR
function closePinModal() {
    $("#modalVerifikasiPin").modal("hide");
}

function openPinVerifikasiModal(id) {
    document.getElementById("verifikasiPinOccupantId").value = id;
    document.getElementById("verifikasiPinDefaultView").style.display = "block";
    document.getElementById("verifikasiPinLoadingView").style.display = "none";
    document.getElementById("verifikasiPinQrView").style.display = "none";
    
    // Auto generate QR on open
    $("#modalVerifikasiPin").modal("show");
    generatePinQr();
}

function generatePinQr() {
    var id = document.getElementById("verifikasiPinOccupantId").value;
    document.getElementById("verifikasiPinDefaultView").style.display = 'none';
    document.getElementById("verifikasiPinLoadingView").style.display = 'block';
    
    var fd = new FormData();
    fd.append('id_occupant', id);
    
    fetch('generate_pin_token.php', { method: 'POST', body: fd })
    .then(function(r) { return r.json(); })
    .then(function(d) {
        document.getElementById("verifikasiPinLoadingView").style.display = 'none';
        if (d.status === 'success') {
            document.getElementById("verifikasiPinQrView").style.display = 'block';
            document.getElementById("verifikasiPinLinkText").value = d.url;
            var canvas = document.getElementById("verifikasiPinQrCanvas");
            canvas.innerHTML = '';
            new QRCode(canvas, {
                text: d.url,
                width: 200,
                height: 200,
                colorDark: '#0f172a',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
            });
        } else {
            alert("Gagal generate QR: " + (d.message || "Unknown error"));
            document.getElementById("verifikasiPinDefaultView").style.display = 'block';
        }
    })
    .catch(function(e) {
        document.getElementById("verifikasiPinLoadingView").style.display = 'none';
        alert("Terjadi kesalahan jaringan.");
        document.getElementById("verifikasiPinDefaultView").style.display = 'block';
    });
}

function copyPinQrLink() {
    navigator.clipboard.writeText(document.getElementById('verifikasiPinLinkText').value);
    showCustomAlert('Link verifikasi PIN berhasil disalin!');
}

function downloadPinQr() {
    var qrCanvas = document.querySelector('#verifikasiPinQrCanvas canvas');
    if (!qrCanvas) {
        alert("QR Code has not been generated yet.");
        return;
    }
    
    var imgUrl = createCompositeQrImage(qrCanvas);
    var dlLink = document.createElement('a');
    dlLink.download = 'QR_Verifikasi_PIN.png';
    dlLink.href = imgUrl;
    dlLink.click();
}

