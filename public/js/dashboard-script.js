
            document.addEventListener("DOMContentLoaded", function () {
              const userName = "${dashName}";
              const text1 = "Welcome, " + userName + "! Monitor and manage your IoT Smart Door system seamlessly.";
              const text2 = "Manage your system completely from one place: Organize Web Accounts, configure Room Occupants access, monitor real-time Access History, receive instant Notifications, and communicate across users via Live Chats.";

              const el1 = document.getElementById('typed-text');
              const el2 = document.getElementById('typed-sub');
              const cur1 = document.getElementById('cursor1');
              const cur2 = document.getElementById('cursor2');

              let idx1 = 0;
              let idx2 = 0;

              function typeText1() {
                if (idx1 < text1.length) {
                  el1.innerHTML += text1.charAt(idx1);
                  idx1++;
                  setTimeout(typeText1, Math.random() * 50 + 20);
                } else {
                  cur1.style.display = 'none';
                  cur2.style.display = 'inline-block';
                  setTimeout(typeText2, 400); // delay before starting subtitle
                }
              }

              function typeText2() {
                if (idx2 < text2.length) {
                  el2.innerHTML += text2.charAt(idx2);
                  idx2++;
                  setTimeout(typeText2, Math.random() * 30 + 10); // faster typing for subtitle
                } else {
                  el2.innerHTML = "Manage your system completely from one place: Organize <b>Web Accounts</b>, configure <b>Room Occupants</b> access, monitor real-time <b>Access History</b>, receive instant <b>Notifications</b>, and communicate across users via <b>Live Chats</b>.";
                }
              }

              if (document.referrer && (document.referrer.includes('login') || document.referrer.includes('index'))) {
                sessionStorage.removeItem('dashboard_typed');
              }

              const typedFlag = sessionStorage.getItem('dashboard_typed');

              if (typedFlag) {
                // Already typed, just show the final text
                el1.innerHTML = text1;
                el2.innerHTML = "Manage your system completely from one place: Organize <b>Web Accounts</b>, configure <b>Room Occupants</b> access, monitor real-time <b>Access History</b>, receive instant <b>Notifications</b>, and communicate across users via <b>Live Chats</b>.";
                cur1.style.display = 'none';
                cur2.style.display = 'inline-block';
              } else {
                // Run typing animation
                sessionStorage.setItem('dashboard_typed', 'true');
                setTimeout(typeText1, 600);
              }
            });
          

    $(document).ready(function () {

      // ===== NOTIFICATION ACCESS LOGIC =====
      var notifTranslated = false;

      function checkNotificationAccess() {
        if (!("Notification" in window)) return;

        // Clear dismiss status if user just logged in (arrived from login page)
        if (document.referrer && (document.referrer.includes('login') || document.referrer.includes('index'))) {
          sessionStorage.removeItem('notif_modal_dismissed');
        }

        // We check permission. If granted, never show. If not granted, we show.
        // We use sessionStorage to ensure it functions as requested: "MUNCUL LAGI DISETIAP LOGIN BERHASIL" if denied.
        if (Notification.permission !== 'granted' && sessionStorage.getItem('notif_modal_dismissed') !== 'true') {
          $('#notif-gate').css('display', 'flex');

          if (Notification.permission === 'denied') {
            $('#notif-gate h2').text(notifTranslated ? 'Notifikasi Diblokir' : 'Notifications Blocked');
            $('#notif-gate p').text(notifTranslated ?
              'Anda telah memblokir notifikasi untuk situs ini. Agar sistem dapat kembali mengirimkan peringatan real-time terkait pesan baru, pendaftaran akun/occupant, aktivitas akses Pintu Ruang FTM, serta jika koneksi Wi-Fi ESP32 terputus, mohon aktifkan ulang izin notifikasi melalui pengaturan browser Anda.' :
              'You have blocked notifications for this site. To resume receiving real-time alerts regarding new messages, account/occupant registrations, FTM Room Door access activities, and ESP32 Wi-Fi disconnections, please re-enable permissions in your browser settings.');
            $('#notif-icon-wrap').addClass('blocked');
            $('#notif-icon').removeClass('mdi-bell-ring').addClass('mdi-bell-off');
            $('#btn-allow-notif').hide();
            $('#btn-deny-notif').hide();
            $('#btn-close-notif').css('display', 'flex');
          }
        }
      }

      setTimeout(checkNotificationAccess, 800);

      $('#btn-allow-notif').on('click', function () {
        if (!("Notification" in window)) return;

        Notification.requestPermission().then(function (permission) {
          if (permission === 'granted') {
            $('#notif-gate').fadeOut(300);
          } else if (permission === 'denied') {
            // Jika browser tetap menolak, tampilkan teks peringatan dan ganti tombol.
            $('#notif-gate h2').text(notifTranslated ? 'Notifikasi Diblokir' : 'Notifications Blocked');
            $('#notif-gate p').text(notifTranslated ?
              'Anda telah memblokir notifikasi untuk situs ini. Agar sistem dapat kembali mengirimkan peringatan real-time terkait pesan baru, pendaftaran akun/occupant, aktivitas akses Pintu Ruang FTM, serta jika koneksi Wi-Fi ESP32 terputus, mohon aktifkan ulang izin notifikasi melalui pengaturan browser Anda.' :
              'You have blocked notifications for this site. To resume receiving real-time alerts regarding new messages, account/occupant registrations, FTM Room Door access activities, and ESP32 Wi-Fi disconnections, please re-enable permissions in your browser settings.');
            $('#notif-icon-wrap').addClass('blocked');
            $('#notif-icon').removeClass('mdi-bell-ring').addClass('mdi-bell-off');
            $('#btn-allow-notif').hide();
            $('#btn-deny-notif').hide();
            $('#btn-close-notif').css('display', 'flex');
          } else {
            sessionStorage.setItem('notif_modal_dismissed', 'true');
            $('#notif-gate').fadeOut(300);
          }
        });
      });

      $('#btn-deny-notif').on('click', function () {
        sessionStorage.setItem('notif_modal_dismissed', 'true');
        $('#notif-gate').fadeOut(300);
      });

      $('#btn-close-notif').on('click', function () {
        sessionStorage.setItem('notif_modal_dismissed', 'true');
        $('#notif-gate').fadeOut(300);
      });

      $('#translate-notif').on('click', function () {
        var isBlocked = $('#notif-icon-wrap').hasClass('blocked');
        if (!notifTranslated) {
          if (isBlocked) {
            $('#notif-gate h2').text('Notifikasi Diblokir');
            $('#notif-gate p').text('Anda telah memblokir notifikasi untuk situs ini. Agar sistem dapat kembali mengirimkan peringatan real-time terkait pesan baru, pendaftaran akun/occupant, aktivitas akses Pintu Ruang FTM, serta jika koneksi Wi-Fi ESP32 terputus, mohon aktifkan ulang izin notifikasi melalui pengaturan browser Anda.');
          } else {
            $('#notif-gate h2').text('Akses Notifikasi');
            $('#notif-gate p').text('Mohon aktifkan notifikasi agar Anda dapat menerima pemberitahuan secara real-time. Sistem akan memberikan informasi langsung ke perangkat Anda setiap kali terdapat pesan masuk, aktivitas pendaftaran akun/occupant baru, saat Pintu Ruang FTM diakses, maupun jika koneksi Wi-Fi ESP32 terputus.');
          }
          $(this).text('Translate to Engl ish');
          notifTranslated = true;
        } else {
          if (isBlocked) {
            $('#notif-gate h2').text('Notifications Blocked');
            $('#notif-gate p').text('You have blocked notifications for this site. To resume receiving real-time alerts regarding new messages, account/occupant registrations, FTM Room Door access activities, and ESP32 Wi-Fi disconnections, please re-enable permissions in your browser settings.');
          } else {
            $('#notif-gate h2').text('Notification Access');
            $('#notif-gate p').text('Please allow notifications to stay updated in real-time. The system will send instant alerts to your device whenever a new chat arrives, new occupant or account registrations occur, when the FTM Room Door is accessed, and if the ESP32 Wi-Fi is disconnected.');
          }
          $(this).text('Terjemahkan ke Indonesia');
          notifTranslated = false;
        }
      });


      // ===== LIVE CLOCK & DATE =====
      function updateDashClock() {
        var now = new Date();
        var h = String(now.getHours()).padStart(2, '0');
        var m = String(now.getMinutes()).padStart(2, '0');
        var s = String(now.getSeconds()).padStart(2, '0');
        $('#dashLiveClock').text(h + ':' + m + ':' + s);
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        var IDbulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

        $('#dashLiveDate').text(now.getDate() + ' ' + months[now.getMonth()] + ' ' + now.getFullYear());
      }
      updateDashClock();
      setInterval(updateDashClock, 1000);

      // ===== LOGIN HISTORY INLINE CARD =====
      function loadLoginHistoryCard() {
        $.getJSON('api_login_history.php', function (res) {
          if (res.success && res.logs.length > 0) {
            var html = '';
            res.logs.forEach(function (log, i) {
              var iconBg = log.is_desktop ? '#eff6ff' : '#f0fdf4';
              var iconColor = log.is_desktop ? '#3b82f6' : '#10b981';
              var deviceIcon = log.is_desktop ? 'mdi-monitor' : 'mdi-cellphone';
              html += '<div class="d-flex align-items-center py-2 px-2" style="border-bottom:1px solid #f1f5f9;transition:background 0.2s;border-radius:6px;margin-bottom:2px;" onmouseenter="this.style.background=\'#f8fafc\'" onmouseleave="this.style.background=\'\'">';
              html += '  <div style="width:32px;height:32px;border-radius:50%;background:' + iconBg + ';display:flex;align-items:center;justify-content:center;margin-right:10px;flex-shrink:0;">';
              html += '    <i class="mdi ' + deviceIcon + '" style="font-size:15px;color:' + iconColor + ';"></i>';
              html += '  </div>';
              html += '  <div style="flex:1;min-width:0;">';
              html += '    <div style="font-size:11px;font-weight:600;color:#212529;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + log.device + (log.browser ? ' · ' + log.browser : '') + '</div>';
              html += '    <div style="font-size:10px;color:#94a3b8;">' + log.date + ' · ' + log.time + '</div>';
              html += '  </div>';
              html += '  <div style="flex-shrink:0;text-align:right;">';
              html += '    <span style="font-size:10px;font-family:monospace;color:#4B49AC;font-weight:600;">' + log.ip + '</span>';
              html += '  </div>';
              html += '</div>';
            });
            html += '<div style="text-align:center;padding:6px 0 2px;font-size:10px;color:#cbd5e1;"><i class="mdi mdi-information-outline mr-1"></i>' + res.logs.length + ' login records</div>';
            $('#loginHistoryCardBody').html(html);
          } else if (res.success && res.logs.length === 0) {
            $('#loginHistoryCardBody').html('<div class="text-center py-4"><i class="mdi mdi-history" style="font-size:36px;color:#e2e8f0;"></i><p class="mt-2 mb-0" style="font-size:11px;color:#999;">No login history found.</p></div>');
          } else {
            $('#loginHistoryCardBody').html('<div class="text-center py-3 text-danger"><i class="mdi mdi-alert-circle" style="font-size:24px;"></i><p class="mt-1 mb-0" style="font-size:11px;">Failed to load.</p></div>');
          }
        }).fail(function () {
          $('#loginHistoryCardBody').html('<div class="text-center py-3 text-danger"><i class="mdi mdi-alert-circle" style="font-size:24px;"></i><p class="mt-1 mb-0" style="font-size:11px;">Connection error.</p></div>');
        });
      }
      loadLoginHistoryCard();

      // Password toggle removed as requested

      // ===== WIFI MODAL PASSWORD TOGGLE =====
      $('#toggleNewPass').on('click', function () {
        var inp = $('#new-wifi-pass');
        if (inp.attr('type') === 'password') {
          inp.attr('type', 'text');
          $(this).find('i').removeClass('mdi-eye-outline').addClass('mdi-eye-off-outline');
        } else {
          inp.attr('type', 'password');
          $(this).find('i').removeClass('mdi-eye-off-outline').addClass('mdi-eye-outline');
        }
      });

      // ===== WIFI SCAN BUTTON =====
      $('#btnScanWifi').on('click', function () {
        $('#wifiScanAnim').show();
        $('#wifiNetworkList').hide();
        $('#wifiListItems').empty();
        $('#wifiScanModal').modal('show');

        // Trigger Scan on Backend
        $.post('api_wifi.php', { action: 'trigger_scan' }, function (triggerRes) {
          if (triggerRes.success) {
            // Poll for results every 1.5 seconds
            var scanPoll = setInterval(function () {
              $.post('api_wifi.php', { action: 'get_scan_results' }, function (res) {
                if (res.success && res.results) {
                  clearInterval(scanPoll); // Stop polling
                  $('#wifiScanAnim').hide();

                  var html = '';
                  if (res.results.length === 0) {
                    html = '<div class="text-center p-3 text-muted" style="font-size:12px;">No WiFi networks detected.</div>';
                  } else {
                    res.results.forEach(function (net) {
                      // Convert RSSI to roughly percentage (RSSI goes from approx -30 to -90)
                      var rssi = parseInt(net.signal) || -90;
                      var signalPct = Math.min(Math.max(2 * (rssi + 100), 0), 100);

                      var sigIcon = signalPct > 70 ? 'mdi-wifi-strength-4' : (signalPct > 40 ? 'mdi-wifi-strength-2' : 'mdi-wifi-strength-1');
                      var sigColor = signalPct > 70 ? '#10b981' : (signalPct > 40 ? '#f59e0b' : '#ef4444');
                      var isLocked = (net.locked === true || net.locked === "true" || net.locked === 1 || net.locked === "1");

                      html += '<div class="wifi-network-item d-flex align-items-center justify-content-between" style="padding:10px 12px;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:6px;cursor:pointer;transition:background 0.2s;" data-ssid="' + net.ssid + '">';
                      html += '  <div class="d-flex align-items-center">';
                      html += '    <i class="mdi ' + sigIcon + '" style="font-size:20px;color:' + sigColor + ';margin-right:10px;"></i>';
                      html += '    <div>';
                      html += '      <span style="font-size:12px;font-weight:600;color:#212529;">' + net.ssid + '</span>';
                      html += '      <br><span style="font-size:10px;color:#999;">' + signalPct + '% signal (' + rssi + ' dBm)</span>';
                      html += '    </div>';
                      html += '  </div>';
                      html += '  <i class="mdi ' + (isLocked ? 'mdi-lock' : 'mdi-lock-open-variant') + '" style="font-size:14px;color:' + (isLocked ? '#64748b' : '#10b981') + ';"></i>';
                      html += '</div>';
                    });
                  }
                  $('#wifiListItems').html(html);
                  $('#wifiNetworkList').fadeIn(300);
                }
              }, 'json');
            }, 1500);

            // Timeout scan after 30 seconds
            setTimeout(function () {
              clearInterval(scanPoll);
              if ($('#wifiScanAnim').is(':visible')) {
                $('#wifiScanAnim').hide();
                $('#wifiListItems').html('<div class="text-center p-3 text-danger" style="font-size:12px;">Failed to scan networks (Timeout). Make sure the ESP32 is powered on.</div>');
                $('#wifiNetworkList').fadeIn(300);
              }
            }, 30000);

          } else {
            $('#wifiScanAnim').hide();
            $('#wifiListItems').html('<div class="text-center p-3 text-danger" style="font-size:12px;">Failed to trigger scan.</div>');
            $('#wifiNetworkList').fadeIn(300);
          }
        }, 'json').fail(function () {
          $('#wifiScanAnim').hide();
          $('#wifiListItems').html('<div class="text-center p-3 text-danger" style="font-size:12px;">Server connection error.</div>');
          $('#wifiNetworkList').fadeIn(300);
        });
      });

      // Click on network to fill SSID
      $(document).on('click', '.wifi-network-item', function () {
        var ssid = $(this).data('ssid');
        $('#new-ssid').val(ssid);
        $('#wifiScanModal').modal('hide');
        $('#new-wifi-pass').val('').focus();
      });

      // Hover effect on network items
      $(document).on('mouseenter', '.wifi-network-item', function () {
        $(this).css('background', '#f0eeff');
      }).on('mouseleave', '.wifi-network-item', function () {
        $(this).css('background', '');
      });

      // Global variable to hold the interval
      window.wifiChangeCheckInterval = null;

      // ===== WIFI SAVE WITH FULLSCREEN ANIMATION =====
      $('#saveWifiBtn').on('click', function () {
        var ssid = $('#new-ssid').first().val().trim();
        var pass = $('#new-wifi-pass').first().val().trim();
        if (!ssid) { alert('SSID cannot be empty'); return; }

        // Clear any orphaned polling interval if the user clicks Save rapidly
        if (window.wifiChangeCheckInterval) {
          clearInterval(window.wifiChangeCheckInterval);
          window.wifiChangeCheckInterval = null;
        }

        // Send change API command
        $.post('api_wifi.php', { action: 'change_wifi', ssid: ssid, password: pass }, function (res) {
          if (res.success) {
            // Reset all steps
            $('.save-step').hide();
            $('.save-bar-fill').css('width', '0%');
            // Reset modal to small for non-failure steps
            $('#wifiSaveModalDialog').removeClass('modal-lg').addClass('modal-sm');
            $('#saveStep1').show();
            $('#wifiSaveModal').modal('show');

            // Step 1: Connecting (0-2.5s)
            setTimeout(function () { $('#saveStep1 .save-bar-fill').css('width', '50%'); }, 500);
            setTimeout(function () { $('#saveStep1 .save-bar-fill').css('width', '100%'); }, 1800);

            // Step 2 & 3: Waiting logic
            setTimeout(function () {
              $('.save-step').hide();
              $('#saveStep2').fadeIn(300);

              // Animasi progress bar step 2 melambat (pura-pura proses hingga batas waktu)
              $('#saveStep2 .save-bar-fill').css({ 'width': '85%', 'transition': 'width 30s cubic-bezier(0.1, 0.8, 0.3, 1)' });
            }, 1800);

            // Simpan sesi ganti WiFi & Mulai Timer Timeout (Misal 60 Detik maksimal)
            var isCheckingChangeStatus = true;
            var maxTimeout = 120; // detik (diperpanjang agar cukup untuk connect 15s + fallback 10s + report)
            var elapsedWait = 0;

            // Polling status penggantian WiFi
            window.wifiChangeCheckInterval = setInterval(function () {
              elapsedWait += 2;

              $.get('api_wifi.php?action=check_change_status', function (statusRes) {
                if (statusRes.status === 'failed' || elapsedWait >= maxTimeout) {
                  clearInterval(window.wifiChangeCheckInterval);
                  var reason = statusRes.reason || '';
                  var errMsg = statusRes.status === 'failed' ? (statusRes.message || 'Connection failed.') : 'Connection Timeout.';

                  // Build detailed failure explanation
                  var reasonText = '';
                  var suggestions = [];
                  var fallbackHtml = '';
                  var targetSsid = $('#new-ssid').first().val().trim();

                  if (reason.indexOf('wrong_password') !== -1) {
                    errMsg = 'WiFi Authentication Rejected (Wrong Password)';
                    reasonText = '<strong>Cause:</strong> The ESP32 successfully found the WiFi network <strong>"' + targetSsid + '"</strong>, but the router <strong>rejected the connection because the submitted password does not match</strong> the password configured on the access point/router.';
                    suggestions = [
                      '<strong>Re-enter the password correctly</strong> — make sure there are no typos, pay attention to uppercase/lowercase (case-sensitive), spaces, and special characters like @, #, !, etc.',
                      '<strong>Check WiFi security type</strong> — ESP32 only supports WPA and WPA2. If the router uses WPA3 or WPA2/WPA3 mixed mode, change to WPA2-Only in the router settings.',
                      '<strong>Confirm the latest password</strong> — if the WiFi password was recently changed by the network admin, request the correct password and re-enter it.',
                      '<strong>Test from another device</strong> — try the same password from a phone/laptop to verify the password is correct before trying again on the ESP32.'
                    ];
                  } else if (reason.indexOf('no_ssid') !== -1) {
                    errMsg = 'WiFi Network Not Found (SSID Not Found)';
                    reasonText = '<strong>Cause:</strong> The ESP32 <strong>failed to find a WiFi network named "' + targetSsid + '"</strong> while scanning the 2.4GHz frequency. The router may be powered off, out of range, or the SSID is set to hidden mode.';
                    suggestions = [
                      '<strong>Make sure the target WiFi router is powered on</strong> — check if the WiFi indicator light on the router is blinking/active. If the router is off, turn it on first.',
                      '<strong>Move ESP32 closer to the router</strong> — being too far away or blocked by thick walls can prevent the signal from being detected. Ideally within <10 meters without obstructions.',
                      '<strong>Check the SSID spelling</strong> — the WiFi name must be typed exactly the same including uppercase/lowercase. Example: "WiFi_Home" ≠ "wifi_home" ≠ "WiFi Home".',
                      '<strong>Disable hidden SSID</strong> — if the SSID is hidden (hidden network) in the router settings, enable SSID broadcast first so the ESP32 can detect it.',
                      '<strong>Make sure the 2.4GHz band is active</strong> — ESP32 only supports the 2.4GHz frequency. If the router only broadcasts 5GHz, the ESP32 will not be able to detect it.'
                    ];
                  } else if (reason.indexOf('weak_signal') !== -1) {
                    errMsg = 'WiFi Signal Too Weak (Weak Signal)';
                    reasonText = '<strong>Cause:</strong> The ESP32 detected the network <strong>"' + targetSsid + '"</strong> but the <strong>signal strength is too weak</strong> (below -75 dBm) to establish a stable connection. Handshake data packets failed to be sent/received properly due to excessive distance or physical obstructions between the ESP32 and router.';
                    suggestions = [
                      '<strong>Move ESP32 closer to the target WiFi router</strong> — position the ESP32 within 5-10 meters of the router without major obstructions. Ideal signal strength is above -65 dBm.',
                      '<strong>Remove physical obstructions</strong> — concrete walls, metal cabinets, and mirrors can significantly absorb or reflect 2.4GHz WiFi signals. Position the ESP32 in a location with a clear line of sight to the router.',
                      '<strong>Use a WiFi repeater/extender</strong> — if the ESP32 must be placed far from the router, install a WiFi repeater at a midpoint to extend the signal range.',
                      '<strong>Check the router antenna orientation</strong> — make sure the router antennas are pointing vertically (upright). For multi-floor coverage, tilt one antenna horizontal and one vertical.',
                      '<strong>Reduce interference</strong> — keep the ESP32 and router away from electronic devices that generate interference such as microwaves, cordless phones, or active Bluetooth devices.'
                    ];
                  } else if (reason.indexOf('timeout') !== -1 || elapsedWait >= maxTimeout) {
                    errMsg = 'Connection Timeout';
                    reasonText = '<strong>Cause:</strong> The ESP32 tried to connect to the network <strong>"' + targetSsid + '"</strong> for <strong>15 seconds but received no response</strong> from the router. The connection could not be established within the specified time limit.';
                    suggestions = [
                      '<strong>Check MAC filtering on the router</strong> — some routers restrict device connections based on MAC address. Add the ESP32 MAC address to the whitelist if this feature is enabled.',
                      '<strong>Restart the target WiFi router</strong> — a router that has been running for a long time may experience memory leaks or channel congestion. A restart can resolve this issue.',
                      '<strong>Reduce connected devices</strong> — if the router has reached its maximum connected device limit (typically 32 devices), disconnect some unused devices.',
                      '<strong>Try changing the router WiFi channel</strong> — interference from neighboring WiFi on the same channel can disrupt connections. Switch to channel 1, 6, or 11 with the least interference.',
                      '<strong>Check firewall and client isolation</strong> — some routers have AP Isolation or Client Isolation features that prevent new devices from connecting. Disable this feature in the router settings.'
                    ];
                  } else {
                    errMsg = 'Connection Failed (Unknown Reason)';
                    reasonText = '<strong>Cause:</strong> The ESP32 failed to connect to the network <strong>"' + targetSsid + '"</strong> due to <strong>a reason that could not be specifically identified</strong> by the microcontroller firmware.';
                    suggestions = [
                      '<strong>Restart ESP32</strong> — press the reset button or unplug and reconnect the ESP32 power, then try connecting again.',
                      '<strong>Re-scan networks</strong> — press the Scan button and select the target WiFi network again, make sure the network is still active and detected.',
                      '<strong>Check router configuration</strong> — make sure the router is not in maintenance mode, firmware is not being updated, and there is no firewall configuration blocking new devices.',
                      '<strong>Factory reset if recurring</strong> — if the problem persists, try resetting the ESP32 to factory settings and reconfigure from scratch.'
                    ];
                  }

                  // Fallback status info (rendered OUTSIDE the red/yellow boxes)
                  if (reason.indexOf('fallback_ok') !== -1) {
                    fallbackHtml = '<div style="background:#f0fdf4;border:1px solid #bbf7d0;color:#166534;padding:10px 12px;border-radius:8px;font-size:10px;line-height:1.5;display:flex;align-items:flex-start;gap:8px;"><i class="mdi mdi-check-circle" style="font-size:16px;color:#16a34a;flex-shrink:0;margin-top:1px;"></i><div><strong>Connection Restored:</strong> The ESP32 has successfully reconnected to the previously connected WiFi network. The system is back online as before.</div></div>';
                  } else if (reason.indexOf('fallback_fail') !== -1) {
                    fallbackHtml = '<div style="background:#fef3c7;border:1px solid #fcd34d;color:#92400e;padding:10px 12px;border-radius:8px;font-size:10px;line-height:1.5;display:flex;align-items:flex-start;gap:8px;"><i class="mdi mdi-access-point-network" style="font-size:16px;color:#d97706;flex-shrink:0;margin-top:1px;"></i><div><strong>Hotspot Mode Active:</strong> The ESP32 also failed to reconnect to the previous WiFi. Currently, the ESP32 is broadcasting a configuration hotspot. Connect to WiFi <strong>@Identia.id</strong> then open <strong>192.168.4.1</strong> in a browser for manual configuration.</div></div>';
                  }

                  // Render into modal
                  $('.save-step').hide();
                  $('#saveStep2 .save-bar-fill').css({ 'width': '0%', 'transition': 'none' });
                  $('#saveErrorDisplay').text(errMsg);
                  $('#saveFailReasonText').html(reasonText);

                  var sugHtml = '';
                  suggestions.forEach(function (s, i) { sugHtml += '<li style="margin-bottom:4px;">' + s + '</li>'; });
                  $('#saveFailSuggestions').html(sugHtml);

                  if (fallbackHtml) {
                    $('#saveFailFallbackInfo').html(fallbackHtml).show();
                  } else {
                    $('#saveFailFallbackInfo').hide();
                  }

                  // Widen modal for detailed failure view
                  $('#wifiSaveModalDialog').removeClass('modal-sm').addClass('modal-md');
                  $('#saveStep5').fadeIn(300);

                } else if (statusRes.status === 'success') {
                  clearInterval(window.wifiChangeCheckInterval);

                  $('#saveStep2 .save-bar-fill').css({ 'width': '100%', 'transition': 'width 0.5s' }); // Cepat penuhi

                  setTimeout(function () {
                    // Lanjutkan ke Success View
                    $('.save-step').hide();
                    $('#saveStep2 .save-bar-fill').css({ 'width': '0%', 'transition': 'none' }); // Reset for next
                    $('#saveNewSsidDisplay').html('<i class="mdi mdi-wifi mr-1"></i> ' + ssid);
                    $('#saveStep4').fadeIn(300);

                    // Perbarui kartu ESP32 di Dashboard
                    $('#esp32-ssid').text(ssid);

                    // Trigger Notification
                    $.post('api_notifications.php', {
                      action: 'create_notification',
                      type: 'wifi_change',
                      title: 'WiFi Connected',
                      message: 'Successfully switched to WiFi: ' + ssid
                    });
                  }, 600);
                }
              }, 'json').fail(function () {
                // Jika API API PHP gak bisa diakses (misal server mati)
                if (elapsedWait >= maxTimeout) {
                  clearInterval(window.wifiChangeCheckInterval);
                  $('.save-step').hide();
                  $('#saveStep2 .save-bar-fill').css({ 'width': '0%', 'transition': 'none' }); // Reset
                  $('#saveErrorDisplay').text('Connection error to the PHP API server.');
                  $('#wifiSaveModalDialog').removeClass('modal-sm').addClass('modal-md');
                  $('#saveStep5').fadeIn(300);
                }
              });
            }, 2000); // Check every 2 seconds (faster feedback)
          } else {
            alert("Failed to save: " + res.message);
          }
        }, 'json');
      });

      // Close fullscreen save modal and refresh on OK
      $('#btnCloseSaveModal').on('click', function () {
        $('#wifiSaveModal').modal('hide');
        // location.reload(); // Optional: reload page to ensure clean state
      });

      // Retry button on failed modal
      $('#btnRetrySaveModal').on('click', function () {
        $('#wifiSaveModal').modal('hide');
      });

      // SIMULATE WIFI DISCONNECT (Toggle locally for test, but actual logic relies on polling below)
      var isWifiConnected = true;
      var hasNotifiedWifiDisconnect = false;
      var hasNotifiedWifiConnect = true; // start true so it doesn't notify on first load if already connected

      $('#wifi-status-text').closest('p').css('cursor', 'pointer').on('click', function () {
        // Toggle for visual testing ONLY
        $(this).toggleClass('manual-override');
      });

      // ===== Real-time ESP32 Status Polling =====
      function pollESP32Status() {
        $.post('api_wifi.php', { action: 'get_status' }, function (res) {

          if ($('#wifi-status-text').closest('p').hasClass('manual-override')) return; // skip if manually toggled

          if (res.status === 'online') {
            if (!isWifiConnected || $('#wifi-status-text').text() !== 'WiFi Connected') {
              isWifiConnected = true;
              $('#wifi-status-text').text('WiFi Connected').css('color', '#ffffff');
              $('#wifi-dot').css({ 'background': '#10b981', 'box-shadow': 'none' });

              // Trigger notification on reconnect
              if (!hasNotifiedWifiConnect && hasNotifiedWifiDisconnect) {
                $.post('api_notifications.php', {
                  action: 'create_notification',
                  icon: 'mdi-wifi',
                  title: 'WiFi Terhubung',
                  message: '@Identia.id berhasil terhubung kembali ke jaringan WiFi.',
                  detail: 'Sistem kembali online dan dapat dipantau.',
                  is_danger: 0
                });
                hasNotifiedWifiConnect = true;
                hasNotifiedWifiDisconnect = false;
              }
            }

            // Update RSSI Signal Strength Icon
            var rssi = parseInt(res.rssi) || -90;
            var signalPct = Math.min(Math.max(2 * (rssi + 100), 0), 100);
            var sigIcon = signalPct > 70 ? 'mdi-wifi-strength-4' : (signalPct > 40 ? 'mdi-wifi-strength-2' : 'mdi-wifi-strength-1');
            var sigColor = signalPct > 70 ? '#10b981' : (signalPct > 40 ? '#f59e0b' : '#ef4444');
            $('#esp32-status-icon-container').html('<i class="mdi ' + sigIcon + '" style="font-size:24px;color:' + sigColor + ';" title="Signal: ' + signalPct + '%"></i>');

            // Selalu Update connected SSID
            if (res.current_ssid && res.current_ssid !== 'Unknown') {
              $('#esp32-ssid').text(res.current_ssid);
            }

            // Selalu Update IP Address
            if (res.esp_ip && res.esp_ip !== 'Unknown') {
              $('#esp32-ip').text(res.esp_ip);
            }
          } else if (res.status === 'connecting') {
            isWifiConnected = false;
            $('#wifi-status-text').text('WiFi Connecting...').css('color', '#ffffff');
            $('#wifi-dot').css({ 'background': '#f59e0b', 'box-shadow': 'none' });

            // Loading Spinner
            $('#esp32-status-icon-container').html('<i class="mdi mdi-loading mdi-spin" style="font-size:24px;color:#fcd34d;"></i>');
            $('#esp32-ssid').text('Unknown');
            $('#esp32-ip').text('Unknown');

          } else {
            // Offline
            if (isWifiConnected || $('#wifi-status-text').text() !== 'WiFi Disconnected') {
              isWifiConnected = false;
              $('#wifi-status-text').text('WiFi Disconnected').css('color', '#ffffff');
              $('#wifi-dot').css({ 'background': '#ef4444', 'box-shadow': 'none' });

              $('#esp32-status-icon-container').html('<i class="mdi mdi-wifi-off" style="font-size:24px;color:#cbd5e1;"></i>');
              $('#esp32-ssid').text('Unknown');
              $('#esp32-ip').text('Unknown');

              // Trigger danger notification on disconnect
              if (!hasNotifiedWifiDisconnect) {
                $.post('api_notifications.php', {
                  action: 'create_notification',
                  icon: 'mdi-wifi-off',
                  title: 'WiFi Terputus',
                  message: 'Koneksi ke ESP32 terputus! Alat sedang dalam status offline.',
                  detail: 'Segera periksa ketersediaan internet pada router atau sumber daya pada Smart Door.',
                  is_danger: 1
                });
                hasNotifiedWifiDisconnect = true;
                hasNotifiedWifiConnect = false;
              }
            }
          }
        }, 'json').fail(function () {
          console.error("Failed to poll ESP32 status");
        });
      }

      // Poll every 3 seconds
      setInterval(pollESP32Status, 3000);
      pollESP32Status();

      // ===== Real-time Door Status Polling =====
      function pollDoorStatus() {
        $.get('api_door_status.php', function (data) {
          if (data && data.status === 'success') {
            // Update status text and icon based on server state
            if (data.door_state === 'unlocked') {
              $('#dash-top-door-pill').html('<i class="mdi mdi-lock-open mr-1"></i>UNLOCKED')
                .css({ 'background': '#ffffff', 'color': '#dc2626', 'font-weight': '700', 'box-shadow': '0 2px 4px rgba(0,0,0,0.05)' });
            } else {
              $('#dash-top-door-pill').html('<i class="mdi mdi-lock mr-1"></i>LOCKED')
                .css({ 'background': '#ffffff', 'color': '#059669', 'font-weight': '700', 'box-shadow': '0 2px 4px rgba(0,0,0,0.05)' });
            }

            // Update physical time strings
            if (data.last_updated_time) {
              $('#dash-top-door-time').text(data.last_updated_time);
            }
            if (data.last_updated_date) {
              $('#dash-top-door-date').text(data.last_updated_date);
            }
          }
        }, 'json');
      }

      // Poll exactly as access.php does (every 2.5s)
      setInterval(pollDoorStatus, 2500);
      pollDoorStatus();

      // SIMULATE BATTERY FULL / CHARGING TOGGLE
      var isCharging = false;
      var batFullTimestamp = null;
      var hasNotifiedLowBat = false;
      var hasNotifiedAlmostFull = false;
      var hasNotifiedFull = false;
      var hasNotifiedOvercharge = false;

      $('#battery-percent-wrap').css('cursor', 'pointer').attr('title', 'Click to toggle Charging / Discharging').on('click', function () {
        isCharging = !isCharging;
        if (isCharging) {
          batLevel = 100;
          batFullTimestamp = new Date().getTime();
          hasNotifiedAlmostFull = true;
          hasNotifiedFull = true;
          $('#bat-status').text('Charging').css('color', '#3b82f6');

          $.post('api_notifications.php', {
            action: 'create_notification',
            icon: 'mdi-battery-charging-100',
            title: 'Smart Door Battery Full',
            message: 'Kapasitas baterai telah mencapai 100%.',
            detail: 'Pengisian daya sudah penuh.',
            is_danger: 0
          });
          alert('Device is now CHARGING (Simulated at 100%). Menunggu 1 jam untuk peringatan overcharge...');
        } else {
          batFullTimestamp = null;
          hasNotifiedOvercharge = false;
          hasNotifiedFull = false;
          $('#bat-status').text('Discharging').css('color', '#10b981');
          alert('Device is now DISCHARGING.');
        }
      });

      // ===== BATTERY MONITORING CHART =====
      var maxPts = 40, batLevel = 85, batLabels = [], batData = [];
      var now = new Date();
      for (var i = maxPts - 1; i >= 0; i--) {
        var t = new Date(now.getTime() - i * 2000);
        batLabels.push(t.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        batData.push(batLevel + Math.random() * 2 - 1);
      }
      var ctx = document.getElementById('battery-chart').getContext('2d');
      var grad = ctx.createLinearGradient(0, 0, 0, 200);
      grad.addColorStop(0, 'rgba(75,73,172,0.25)');
      grad.addColorStop(1, 'rgba(75,73,172,0.02)');
      var batChart = new Chart(ctx, {
        type: 'line',
        data: { labels: batLabels, datasets: [{ label: 'Battery %', data: batData, borderColor: '#4B49AC', backgroundColor: grad, borderWidth: 2.5, fill: true, tension: 0.4, pointRadius: 0, pointHoverRadius: 5, pointHoverBackgroundColor: '#4B49AC' }] },
        options: { responsive: true, maintainAspectRatio: false, animation: { duration: 600 }, plugins: { legend: { display: false }, tooltip: { backgroundColor: '#2c2e33', padding: 10, cornerRadius: 8, callbacks: { label: function (c) { return c.parsed.y.toFixed(1) + '%'; } } } }, scales: { x: { display: true, grid: { display: false }, ticks: { font: { size: 10 }, color: '#bbb', maxRotation: 0, maxTicksLimit: 8 } }, y: { display: true, min: 0, max: 100, grid: { color: '#f5f5f5' }, ticks: { font: { size: 10 }, color: '#bbb', callback: function (v) { return v + '%'; } } } } }
      });
      setInterval(function () {
        if (!isCharging) {
          batLevel -= (Math.random() * 0.5 + 0.1);
          // Auto charge if too low (for simulation loops)
          if (batLevel < 5) {
            isCharging = true;
            $('#bat-status').text('Charging').css('color', '#3b82f6');
            hasNotifiedLowBat = false;
          }
        } else {
          if (batLevel < 100) batLevel += (Math.random() * 2 + 1);
          if (batLevel > 100) batLevel = 100;
        }

        // Battery Overcharge Logic (100% for 1 hour)
        if (batLevel === 100 && isCharging) {
          if (!batFullTimestamp) batFullTimestamp = new Date().getTime();

          if (!hasNotifiedFull) {
            $.post('api_notifications.php', {
              action: 'create_notification',
              icon: 'mdi-battery-charging-100',
              title: 'Smart Door Battery Full',
              message: 'Kapasitas baterai telah terisi 100%.',
              detail: 'Pengisian daya telah selesai dilakukan.',
              is_danger: 0
            });
            hasNotifiedFull = true;
          }

          // 1 hour = 3600000 ms
          if (!hasNotifiedOvercharge && (new Date().getTime() - batFullTimestamp) > 3600000) {
            $.post('api_notifications.php', {
              action: 'create_notification',
              icon: 'mdi-battery-alert',
              title: 'Overcharge',
              message: 'Baterai di tingkat 100% dan charger mendeteksi terhubung selama 1 jam lebih.',
              detail: 'Sistem menyarankan agar pengisi daya segera dicabut untuk menghindari kerusakan pada baterai.',
              is_danger: 1
            });
            hasNotifiedOvercharge = true;
          }
        } else {
          batFullTimestamp = null;
          hasNotifiedOvercharge = false;
          hasNotifiedFull = false;
        }

        // Low Battery Notification (<= 20%)
        if (batLevel <= 20 && !hasNotifiedLowBat && !isCharging) {
          $.post('api_notifications.php', {
            action: 'create_notification',
            icon: 'mdi-battery-10',
            title: 'Low Baterai',
            message: 'Kapasitas tersisa di bawah 20%.',
            detail: 'Segera hubungkan charger untuk menjaga sistem door lock.',
            is_danger: 1
          });
          hasNotifiedLowBat = true;
        } else if (batLevel > 25) {
          hasNotifiedLowBat = false;
        }

        // Almost Full Notification (>= 90% and < 100%)
        if (batLevel >= 90 && batLevel < 100 && !hasNotifiedAlmostFull && isCharging) {
          $.post('api_notifications.php', {
            action: 'create_notification',
            icon: 'mdi-battery-90',
            title: 'Baterai Hampir Penuh',
            message: 'Kapasitas alat sudah mencapai ' + Math.floor(batLevel) + '%.',
            detail: 'Tidak lama lagi bisa dicabut dari pengisian daya.',
            is_danger: 0
          });
          hasNotifiedAlmostFull = true;
        } else if (batLevel < 85) {
          hasNotifiedAlmostFull = false;
        }

        var val = Math.max(0, Math.min(100, batLevel));
        var t2 = new Date();
        batLabels.push(t2.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        batData.push(val);
        if (batLabels.length > maxPts) { batLabels.shift(); batData.shift(); }
        batChart.update();
        var pct = Math.round(val);
        var circ = 2 * Math.PI * 52;
        var off = circ - (circ * pct / 100);
        var gf = document.getElementById('gauge-fill');
        gf.setAttribute('stroke-dashoffset', off);
        document.getElementById('gauge-text').textContent = pct + '%';
        var c = '#10b981';
        if (pct <= 20) c = '#ef4444'; else if (pct <= 60) c = '#f59e0b';
        gf.setAttribute('stroke', c);

        // Update voltage visually
        if (!isCharging) {
          $('#bat-voltage').text((3.0 + (val / 100) * 1.2).toFixed(2) + 'V');
        } else {
          $('#bat-voltage').text('5.00V');
        }
      }, 2000);

      // ===== LED RGB COLOR PICKERS =====
      $('.led-color-picker').on('input', function () {
        var clr = $(this).val();
        var tid = $(this).data('target');
        var nid = $(this).data('name');
        $('#' + tid).css('background', clr);
        $('#' + nid).text(clr.toUpperCase());
      });

    });
  
