document.addEventListener('DOMContentLoaded', () => {
    // Listen for back/forward browser buttons
    window.addEventListener('popstate', (e) => {
        if (e.state && e.state.url) {
            fetchPage(e.state.url, false);
        } else {
            fetchPage(window.location.href, false);
        }
    });

    // Intercept clicks globally
    document.body.addEventListener('click', (e) => {
        // Find closest anchor tag
        const a = e.target.closest('a');
        if (!a) return;
        
        // Ignore external links, new tabs, and non-http links
        if (a.target === '_blank' || a.host !== window.location.host || a.protocol !== window.location.protocol) return;
        
        // Ignore links meant for modals or javascript functions
        const href = a.getAttribute('href');
        if (!href || href === '#' || href.startsWith('javascript:') || a.hasAttribute('data-toggle')) return;
        
        // Only apply SPA to internal .php pages or root
        if (a.pathname.endsWith('.php') || a.pathname === '/' || a.pathname === '') {
            e.preventDefault();
            const url = a.href;
            if (url !== window.location.href) {
                fetchPage(url, true);
            }
        }
    });
});

function getSkeletonHtml() {
    return `
    <div class="row">
        <div class="col-12 grid-margin stretch-card">
            <div class="card" style="box-shadow: none; border: 1px solid #e2e8f0; border-radius: 10px;">
                <div class="card-body">
                    <div class="skeleton-header"></div>
                    <hr class="skeleton-divider">
                    <div class="skeleton-row">
                        <div class="skeleton-avatar"></div>
                        <div class="skeleton-text-group">
                            <div class="skeleton-text-line skeleton-w-60"></div>
                            <div class="skeleton-text-line skeleton-w-40"></div>
                        </div>
                        <div class="skeleton-btn ms-auto"></div>
                        <div class="skeleton-btn ms-2" style="margin-left: 8px;"></div>
                    </div>
                    <hr class="skeleton-divider">
                    <div class="skeleton-row">
                        <div class="skeleton-avatar"></div>
                        <div class="skeleton-text-group">
                            <div class="skeleton-text-line skeleton-w-50"></div>
                            <div class="skeleton-text-line skeleton-w-30"></div>
                        </div>
                        <div class="skeleton-btn ms-auto"></div>
                        <div class="skeleton-btn ms-2" style="margin-left: 8px;"></div>
                    </div>
                     <hr class="skeleton-divider">
                    <div class="skeleton-row">
                        <div class="skeleton-avatar"></div>
                        <div class="skeleton-text-group">
                            <div class="skeleton-text-line skeleton-w-70"></div>
                            <div class="skeleton-text-line skeleton-w-40"></div>
                        </div>
                        <div class="skeleton-btn ms-auto"></div>
                        <div class="skeleton-btn ms-2" style="margin-left: 8px;"></div>
                    </div>
                     <hr class="skeleton-divider">
                    <div class="skeleton-row">
                        <div class="skeleton-avatar"></div>
                        <div class="skeleton-text-group">
                            <div class="skeleton-text-line skeleton-w-50"></div>
                            <div class="skeleton-text-line skeleton-w-60"></div>
                        </div>
                        <div class="skeleton-btn ms-auto"></div>
                        <div class="skeleton-btn ms-2" style="margin-left: 8px;"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
}

function fetchPage(url, push = true) {
    const mainWrapper = document.querySelector('.main-panel');
    if (!mainWrapper) {
        window.location.href = url; // Hard fallback if structure is weird
        return;
    }
    
    let contentWrapper = mainWrapper.querySelector('.content-wrapper');
    if(contentWrapper) {
        // Show skeleton immediately
        contentWrapper.innerHTML = getSkeletonHtml();
    }
    
    // Update active state in sidebar immediately to provide UX feedback
    updateSidebarActiveState(url);

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.text();
        })
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Extract and update title
            const newTitle = doc.querySelector('title');
            if (newTitle) {
                document.title = newTitle.textContent;
            }
            
            // Extract new main-panel
            const newMain = doc.querySelector('.main-panel');
            if (newMain && mainWrapper) {
                mainWrapper.innerHTML = newMain.innerHTML;
                
                // Push history state to URL
                if (push) {
                    history.pushState({url: url}, '', url);
                }
                
                // Execute inline scripts that come natively with the injected HTML
                executeScripts(mainWrapper);
                
                // Dispatch event so global listeners (like DataTables) can reinitialize
                document.dispatchEvent(new CustomEvent('spaContentReplaced', { detail: { url: url } }));
            } else {
                // If the target page doesn't have the expected structure, fallback to full load
                window.location.href = url;
            }
        })
        .catch(err => {
            console.error('SPA Fetch Error:', err);
            window.location.href = url; // Fallback to normal navigation on error
        });
}

function executeScripts(container) {
    // When elements are injected via innerHTML, their <script> tags don't run automatically
    // We must manually recreate and append them.
    const scripts = container.querySelectorAll('script');
    scripts.forEach(oldScript => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
        if (oldScript.parentNode) {
            oldScript.parentNode.replaceChild(newScript, oldScript);
        }
    });
}

function updateSidebarActiveState(url) {
    const urlObj = new URL(url, window.location.origin);
    const path = urlObj.pathname.split('/').pop() || 'index.php'; // get filename like 'dashboard.php'
    
    const sidebar = document.getElementById('sidebar');
    if(!sidebar) return;
    
    // Remove "active" from all items
    sidebar.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    // Close all submenus
    sidebar.querySelectorAll('.collapse').forEach(col => {
        col.classList.remove('show');
        const trigger = sidebar.querySelector('[href="#'+col.id+'"]');
        if(trigger) trigger.setAttribute('aria-expanded', 'false');
    });
    
    // Find newly matched link
    const links = sidebar.querySelectorAll('a.nav-link');
    links.forEach(link => {
        const href = link.getAttribute('href');
        if(href && href === path) {
            const li = link.closest('.nav-item');
            if(li) li.classList.add('active');
            
            // If it's inside a submenu, open the submenu and make the parent menu item active
            const collapse = link.closest('.collapse');
            if(collapse) {
                collapse.classList.add('show');
                const parentLi = collapse.closest('.nav-item');
                if(parentLi) parentLi.classList.add('active');
                
                const trigger = sidebar.querySelector('[href="#'+collapse.id+'"]');
                if(trigger) trigger.setAttribute('aria-expanded', 'true');
            }
        }
    });
}

// Ensure initial state is recorded in history exactly once
if (!history.state) {
    history.replaceState({url: window.location.href}, '', window.location.href);
}
