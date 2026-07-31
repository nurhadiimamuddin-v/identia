
        function setScreen(screenName) {
            const formData = new FormData();
            formData.append('action', 'set_tft_screen');
            formData.append('screen', screenName);

            fetch('api_wifi.php', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                if(data.success) {
                    let msg = document.getElementById('statusMsg');
                    msg.style.display = 'block';
                    setTimeout(() => msg.style.display='none', 2000);
                } else {
                    alert('Gagal: ' + data.message);
                }
            })
            .catch(err => alert('Network error!'));
        }
    
