`
      function showCustomAlert(title, message, type='warning') {
          const alertBox = document.getElementById('customAlert');
          const icon = document.getElementById('customAlertIcon');
          
          alertBox.className = 'custom-alert ' + type;
          if(type === 'error') icon.className = 'mdi mdi-close-circle custom-alert-icon';
          else if(type === 'success') icon.className = 'mdi mdi-check-circle custom-alert-icon';
          else icon.className = 'mdi mdi-alert-circle custom-alert-icon';

          document.getElementById('customAlertTitle').innerText = title;
          document.getElementById('customAlertMsg').innerText = message;
          
          alertBox.style.display = 'flex';
          alertBox.style.animation = 'slideIn 0.3s ease-out';

          setTimeout(() => closeCustomAlert(), 5000);
      }

      function closeCustomAlert() {
          const alertBox = document.getElementById('customAlert');
          alertBox.style.animation = 'fadeOut 0.3s ease-out forwards';
          setTimeout(() => {
              alertBox.style.display = 'none';
          }, 300);
      }
      window.closeCustomAlert = closeCustomAlert;

      setTimeout(() => {
          const usernameInput = document.getElementById('usernameInput');
          const usernameTooltip = document.getElementById('usernameTooltip');
          let checkTimeout;

          function checkUsername() {
              const username = usernameInput.value.trim();
              if (username === '') {
                  usernameTooltip.style.display = 'none';
                  usernameInput.setCustomValidity(''); 
                  return;
              }
              // API endpoint for phase 6 (Next.js route handler)
              fetch('/api/check-username?username=' + username)
              .then(res => res.json())
              .then(data => {
                  if (data.status === 'taken') {
                      usernameTooltip.style.display = 'flex';
                      usernameInput.setCustomValidity('Username already taken');
                  } else {
                      usernameTooltip.style.display = 'none';
                      usernameInput.setCustomValidity('');
                  }
              }).catch(err => console.error(err));
          }

          if(usernameInput) {
            usernameInput.addEventListener('input', function() {
                usernameTooltip.style.display = 'none';
                clearTimeout(checkTimeout);
                checkTimeout = setTimeout(checkUsername, 500);
            });
            usernameInput.addEventListener('blur', checkUsername);
            usernameInput.addEventListener('focus', function() {
                usernameTooltip.style.display = 'none';
            });
          }

          // Face API
          var fotoInput = document.getElementById('fotoInputRegister');
          var faceModelLoaded = false;
          
          if(window.faceapi) {
            faceapi.nets.tinyFaceDetector.loadFromUri('/js/face-api/models').then(function() {
                faceModelLoaded = true;
            });
          }
          
          if(fotoInput) {
            fotoInput.addEventListener('change', function() {
                var file = this.files[0];
                if (!file) {
                    document.getElementById('faceDetectPreview').style.display = 'none';
                    return;
                }
                
                var preview = document.getElementById('faceDetectPreview');
                var badge = document.getElementById('faceDetectBadge');
                
                preview.style.display = 'block';
                badge.style.display = 'inline-block';
                badge.style.background = '#e2e8f0';
                badge.style.color = '#475569';
                badge.style.border = '1px solid #cbd5e1';
                badge.innerHTML = '<div class="spinner-border spinner-border-sm text-secondary mr-2" role="status"></div> Face Verification...';
                document.getElementById('faceVerifiedFlag').value = '0';
                
                var reader = new FileReader();
                reader.onload = function(ev) {
                    var img = new Image();
                    img.src = ev.target.result;
                    img.onload = function() {
                        if (!faceModelLoaded && window.faceapi) {
                            faceapi.nets.tinyFaceDetector.loadFromUri('/js/face-api/models').then(function() {
                                faceModelLoaded = true;
                                detectFaceInImage(img, badge);
                            }).catch(function() {
                                badge.style.background = '#fef2f2';
                                badge.style.color = '#dc2626';
                                badge.style.border = '1px solid #fca5a5';
                                badge.innerHTML = '<i class="mdi mdi-alert-circle"></i> Failed to load model';
                            });
                        } else if(window.faceapi) {
                            detectFaceInImage(img, badge);
                        }
                    };
                };
                reader.readAsDataURL(file);
            });
          }
          
          function detectFaceInImage(img, badge) {
              faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.3 })).then(function(dets) {
                  if (dets.length === 1) {
                      badge.style.background = '#f0fdf4';
                      badge.style.color = '#16a34a';
                      badge.style.border = '1px solid #86efac';
                      badge.innerHTML = '<i class="mdi mdi-check-circle"></i> Face Detected';
                      document.getElementById('faceVerifiedFlag').value = '1';
                  } else if (dets.length > 1) {
                      badge.style.background = '#fff7ed';
                      badge.style.color = '#ea580c';
                      badge.style.border = '1px solid #fdba74';
                      badge.innerHTML = '<i class="mdi mdi-alert"></i> ' + dets.length + ' Faces Detected (Please use 1 face)';
                      document.getElementById('faceVerifiedFlag').value = '0';
                  } else {
                      badge.style.background = '#fef2f2';
                      badge.style.color = '#dc2626';
                      badge.style.border = '1px solid #fca5a5';
                      badge.innerHTML = '<i class="mdi mdi-close-circle"></i> No Face Detected';
                      document.getElementById('faceVerifiedFlag').value = '0';
                  }
              }).catch(function(err) {
                  badge.style.background = '#fef2f2';
                  badge.style.color = '#dc2626';
                  badge.style.border = '1px solid #fca5a5';
                  badge.innerHTML = '<i class="mdi mdi-alert-circle"></i> Detection Error';
                  console.error('Face detection error:', err);
              });
          }

          const registerForm = document.getElementById('registerForm');
          if(registerForm) {
            registerForm.addEventListener('submit', function(e) {
                if (document.getElementById('faceVerifiedFlag').value !== '1') {
                    e.preventDefault();
                    showCustomAlert('Photo Not Verified', 'Please upload a profile photo with a detected face first.', 'error');
                    return;
                }
                var pass = document.getElementById("register_password").value;
                const pwValid = (pass.length >= 8 && /[a-z]/.test(pass) && /[A-Z]/.test(pass) && /\\d/.test(pass) && /[^A-Za-z0-9]/.test(pass));
                if (!pwValid) {
                    e.preventDefault();
                    showCustomAlert("Warning", "Password does not meet the criteria (min. 8 characters, uppercase, lowercase, numbers, and symbols)!", "warning");
                    document.getElementById("register_password").focus();
                }
            });
          }

          const regPw = document.getElementById('register_password');
          if(regPw) {
            regPw.addEventListener('input', function() {
                var pass = this.value;
                var meter = document.getElementById('pwStrengthMeterReg');
                var bar = document.getElementById('pwStrengthBarReg');
                var text = document.getElementById('pwStrengthTextReg');

                if(pass.length > 0) {
                    meter.style.display = 'flex';
                    var hasLower = /[a-z]/.test(pass);
                    var hasUpper = /[A-Z]/.test(pass);
                    var hasNumber = /\\d/.test(pass);
                    var hasSymbol = /[^A-Za-z0-9]/.test(pass);
                    var typesCount = (hasLower?1:0) + (hasUpper?1:0) + (hasNumber?1:0) + (hasSymbol?1:0);
                    
                    if (pass.length >= 8 && typesCount === 4) {
                        bar.style.width = '100%'; bar.style.backgroundColor = '#10b981';
                        text.innerText = 'Strong Password'; text.style.color = '#10b981';
                    } else if (pass.length >= 6 && typesCount >= 2) {
                        bar.style.width = '66%'; bar.style.backgroundColor = '#f59e0b';
                        text.innerText = 'Medium Password'; text.style.color = '#f59e0b';
                    } else {
                        bar.style.width = '33%'; bar.style.backgroundColor = '#ef4444';
                        text.innerText = 'Weak Password'; text.style.color = '#ef4444';
                    }
                } else {
                    meter.style.display = 'none';
                    text.innerText = '';
                }
            });
          }
      }, 500);
    `