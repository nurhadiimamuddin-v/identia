(function() {
    window.triggerDoorAnimation = function(redirectUrl) {
        const leftSide = document.querySelector('.bg-white') || document.querySelector('.col-lg-5') || document.querySelector('.col-lg-6');
        const rightSide = document.getElementById('rightSideBg');
        
        if (leftSide && rightSide) {
            document.body.style.overflow = 'hidden';
            
            // Fetch the dashboard HTML first to prevent double-loading
            fetch(redirectUrl)
            .then(res => res.text())
            .then(html => {
                // Ensure backgrounds are transparent so the iframe shows through
                document.body.style.setProperty('background-color', 'transparent', 'important');
                const container = document.querySelector('.container-fluid');
                if (container) container.style.setProperty('background-color', 'transparent', 'important');
                const row = document.querySelector('.row');
                if (row) row.style.setProperty('background-color', 'transparent', 'important');

                // Create iframe and use srcdoc to render the fetched HTML visually without a second request
                const iframe = document.createElement('iframe');
                iframe.srcdoc = html;
                iframe.style.position = 'fixed';
                iframe.style.top = '0';
                iframe.style.left = '0';
                iframe.style.width = '100vw';
                iframe.style.height = '100vh';
                iframe.style.border = 'none';
                iframe.style.zIndex = '-1';
                document.body.appendChild(iframe);
                
                // Wait briefly for the iframe content to parse and render
                setTimeout(() => {
                    leftSide.style.transition = 'transform 0.8s cubic-bezier(0.77, 0, 0.175, 1)';
                    rightSide.style.transition = 'transform 0.8s cubic-bezier(0.77, 0, 0.175, 1)';
                    
                    leftSide.style.transform = 'translateX(-100%)';
                    rightSide.style.transform = 'translateX(100%)';
                    
                    // After animation, replace the current document with the fetched HTML
                    setTimeout(() => {
                        document.open();
                        document.write(html);
                        document.close();
                        window.history.pushState(null, '', redirectUrl);
                    }, 800);
                }, 100);
            })
            .catch(err => {
                // Fallback in case of error
                window.location.href = redirectUrl;
            });
        } else {
            window.location.href = redirectUrl;
        }
    };

    // Intercept only the login form to show the door opening animation on success
    document.addEventListener('submit', function(e) {
        const form = e.target;
        if (form.id === 'loginForm') {
            e.preventDefault();
            const action = form.getAttribute('action') || window.location.href;
            const method = (form.getAttribute('method') || 'POST').toUpperCase();
            const formData = new FormData(form);
            
            if (e.submitter && e.submitter.name) {
                formData.append(e.submitter.name, e.submitter.value);
            }

            const signInBtn = document.getElementById('signInBtn');
            const signInText = document.getElementById('signInText');
            const signInLoading = document.getElementById('signInLoading');

            if (signInBtn) signInBtn.disabled = true;
            if (signInText) signInText.style.display = 'none';
            if (signInLoading) signInLoading.style.display = 'inline-block';

            fetch(action, { 
                method: method, 
                body: formData, 
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json'
                }
            })
            .then(async response => {
                const text = await response.text();
                let isSuccess = false;
                let redirectUrl = 'dashboard.php';
                
                try {
                    // Robust JSON parsing in case of PHP warnings/spaces
                    const jsonMatch = text.match(/\{[\s\S]*\}/);
                    const dataToParse = jsonMatch ? jsonMatch[0] : text;
                    const data = JSON.parse(dataToParse);
                    
                    if (data.success) {
                        isSuccess = true;
                        redirectUrl = data.redirect || redirectUrl;
                    } else if (data.error) {
                        // Display error using custom alert instead of native submit
                        if (typeof showCustomAlert === 'function') {
                            showCustomAlert("Login Failed", data.error, "error");
                        }
                        if (signInBtn) signInBtn.disabled = false;
                        if (signInText) signInText.style.display = 'inline-block';
                        if (signInLoading) signInLoading.style.display = 'none';
                        return; // Stop execution
                    }
                } catch (err) {
                    console.error('Failed to parse JSON response:', text);
                    // Not JSON, meaning it returned HTML (login failed)
                }

                if (isSuccess) {
                    window.triggerDoorAnimation(redirectUrl);
                } else {
                    if (signInBtn) signInBtn.disabled = false;
                    if (signInText) signInText.style.display = 'inline-block';
                    if (signInLoading) signInLoading.style.display = 'none';
                    // Login failed and no JSON error found, submit natively to show error
                    form.submit();
                }
            }).catch(err => {
                console.error('Login submit error:', err);
                if (signInBtn) signInBtn.disabled = false;
                if (signInText) signInText.style.display = 'inline-block';
                if (signInLoading) signInLoading.style.display = 'none';
                form.submit();
            });
        }
    });
})();
