
// Reveal content once DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    var body = document.querySelector('.ntf-page-body');
    if (body) body.classList.add('ntf-ready');
});

function filterNtf(event, filterType, el) {
    event.preventDefault();
    
    // Update active class on filter tags
    document.querySelectorAll('.ntf-filter-item').forEach(e => e.classList.remove('active'));
    el.classList.add('active');
    
    // Logic to show/hide based on filterType
    const activeWrap = document.getElementById('activeListWrapper');
    const trashWrap = document.getElementById('trashListWrapper');
    const mainTitle = document.getElementById('mainListTitle');
    
    // Main Actions Buttons
    const btnEmpty = document.getElementById('btnEmptyTrash');
    const btnMarkAll = document.getElementById('btnMarkAll');
    const btnDeleteAll = document.getElementById('btnDeleteAllToTrash');
    
    if(filterType === 'trash') {
        activeWrap.style.display = 'none';
        trashWrap.style.display = 'block';
        mainTitle.textContent = 'Notifications in Trash';
        
        btnEmpty.style.display = 'block';
        btnMarkAll.style.display = 'none';
        btnDeleteAll.style.display = 'none';
        return;
    }
    
    activeWrap.style.display = 'block';
    trashWrap.style.display = 'none';
    mainTitle.textContent = 'Recent Notifications';
    
    btnEmpty.style.display = 'none';
    btnMarkAll.style.display = 'block';
    btnDeleteAll.style.display = 'block';

    const allCards = activeWrap.querySelectorAll('.ntf-card-item');
    allCards.forEach(card => {
        let isMatch = false;
        if(filterType === 'all') isMatch = true;
        if(filterType === 'unread' && card.dataset.unread === '1') isMatch = true;
        if(filterType === 'danger' && card.dataset.danger === '1') isMatch = true;
        
        card.style.display = isMatch ? 'flex' : 'none';
    });
    
    // Hide date headers if they have no visible descendants
    document.querySelectorAll('.ntf-group-wrap').forEach(wrap => {
        const visibleCards = wrap.querySelectorAll('.ntf-card-item[style*="display: flex"], .ntf-card-item:not([style*="display: none"])');
        
        // Find the corresponding date-hdr using class matching
        const classList = Array.from(wrap.classList).find(c => c.startsWith('ntf-date-group-'));
        const hdr = document.querySelector('.ntf-date-hdr.'+classList);
        
        if(visibleCards.length === 0) {
            wrap.style.display = 'none';
            if(hdr) hdr.style.display = 'none';
        } else {
            wrap.style.display = 'block';
            if(hdr) hdr.style.display = 'block';
        }
    });
}

function showNtf(el, id) {
    const isDanger = el.dataset.danger === '1';
    
    // Fill data
    document.getElementById('nmdl-title').textContent = el.dataset.title;
    document.getElementById('nmdl-msg').textContent = el.dataset.msg;
    document.getElementById('nmdl-dtl').textContent = el.dataset.detail;
    document.getElementById('nmdl-time').textContent = el.dataset.time + ' - ' + el.querySelector('.nc-ago').textContent;
    
    // Icon
    document.getElementById('nmdl-icn').className = 'mdi ' + el.dataset.icnclass;
    
    // Theme
    const hdr = document.getElementById('nmdl-hdr');
    if(isDanger) {
        hdr.parentElement.className = 'modal-content nt-modal-simple modal-theme-danger';
    } else {
        hdr.parentElement.className = 'modal-content nt-modal-simple modal-theme-info';
    }

    // Mark as read conceptually and in DB
    if (el.classList.contains('unread')) {
        el.classList.remove('unread');
        el.dataset.unread = '0';
        
        // Update unread count in UI
        let cnt = document.getElementById('cntUnread');
        if(cnt) {
            let n = parseInt(cnt.textContent) - 1;
            cnt.textContent = n;
            if(n<=0) {
                cnt.style.display = 'none';
                const btnMarkAll = document.getElementById('btnMarkAll');
                if(btnMarkAll) btnMarkAll.disabled = true;
            }
        }
        
        // AJAX to DB
        fetch('api_notifications.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: 'action=mark_read&id='+id
        });
    }

    $('#modalNtf').modal('show');
}

// Mark All
const btnAll = document.getElementById('btnMarkAll');
if (btnAll) {
    btnAll.addEventListener('click', function() {
        document.querySelectorAll('.ntf-card.unread').forEach(el => {
            el.classList.remove('unread');
            el.dataset.unread = '0';
        });
        this.disabled = true;
        
        const badgeUnread = document.getElementById('cntUnread');
        if(badgeUnread) badgeUnread.style.display = 'none';
        
        // AJAX request
        fetch('api_notifications.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: 'action=mark_all_read'
        });
    });
}

// Delete All to Trash
const btnDeleteAll = document.getElementById('btnDeleteAllToTrash');
if (btnDeleteAll) {
    btnDeleteAll.addEventListener('click', function() {
        if(!confirm('Move all notifications to trash?')) return;
        
        this.disabled = true;
        this.innerHTML = '<i class="mdi mdi-loading mdi-spin mr-1"></i> Processing...';
        
        fetch('api_notifications.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: 'action=delete_all_to_trash'
        }).then(r => r.json()).then(res => {
            if(res.status === 'success') {
                location.reload();
            } else {
                this.disabled = false;
                this.innerHTML = 'Delete All to Trash';
                alert('Failed to move notifications to trash.');
            }
        });
    });
}

// Custom Context Menu Logic
let currCardId = null;

function showContextMenu(e, id, type) {
    e.preventDefault();
    currCardId = id;
    const menu = document.getElementById('ctxMenu');
    
    if (type === 'active') {
        menu.innerHTML = `<div class="ctx-item text-danger" onclick="notifAction('move_trash')"><i class="mdi mdi-delete-outline"></i> Move to Trash</div>`;
    } else {
        menu.innerHTML = `<div class="ctx-item" onclick="notifAction('restore')"><i class="mdi mdi-restore"></i> Restore</div>
                          <div class="ctx-item text-danger" onclick="notifAction('delete_permanently')"><i class="mdi mdi-delete-forever"></i> Delete Permanently</div>`;
    }
    
    menu.style.display = 'block';
    
    let x = e.clientX;
    let y = e.clientY;
    
    // Prevent menu overflowing right edge
    if(x + menu.offsetWidth > window.innerWidth) x = window.innerWidth - menu.offsetWidth - 10;
    
    menu.style.left = x + 'px';
    menu.style.top = y + 'px';
}

function notifAction(action) {
    if(!currCardId) return;
    
    fetch('api_notifications.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: 'action='+action+'&id='+currCardId
    }).then(r => r.json()).then(res => {
        if(res.status==='success') {
            location.reload(); // Quick refresh to update UI accurately matching db
        }
    });
}

// Empty Trash Modal Logic
const btnEmptyTrash = document.getElementById('btnEmptyTrash');
const cbConfirmEmpty = document.getElementById('confirmEmptyTrash');
const btnConfirmEmpty = document.getElementById('btnConfirmEmptyTrash');

if (btnEmptyTrash) {
    btnEmptyTrash.addEventListener('click', function() {
        cbConfirmEmpty.checked = false;
        btnConfirmEmpty.disabled = true;
        $('#modalDeleteTrash').modal('show');
    });
}

if (cbConfirmEmpty) {
    cbConfirmEmpty.addEventListener('change', function() {
        btnConfirmEmpty.disabled = !this.checked;
    });
}

if (btnConfirmEmpty) {
    btnConfirmEmpty.addEventListener('click', function() {
        this.disabled = true;
        this.innerHTML = '<i class="mdi mdi-loading mdi-spin mr-1"></i> Emptying...';
        
        fetch('api_notifications.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: 'action=empty_trash'
        }).then(() => {
            location.reload();
        });
    });
}

document.addEventListener('click', function(e) {
    const menu = document.getElementById('ctxMenu');
    if(menu && menu.style.display === 'block') {
        menu.style.display = 'none';
    }
});

