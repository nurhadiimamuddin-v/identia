
function showDeleteModal(title, options) {
    document.getElementById('delTitle').textContent = title;
    let optHtml = '';
    options.forEach(function(o) {
        optHtml += '<div class="del-option ' + o.cls + '" id="del-opt-' + Math.random().toString(36).substr(2,5) + '">' + o.text + '</div>';
    });
    optHtml += '<div class="del-option del-cancel">Cancel</div>';
    document.getElementById('delOptions').innerHTML = optHtml;
    
    // Bind events
    let optEls = document.getElementById('delOptions').querySelectorAll('.del-option');
    let idx = 0;
    options.forEach(function(o) {
        optEls[idx].onclick = o.action;
        idx++;
    });
    // Cancel = last one
    optEls[optEls.length - 1].onclick = closeDeleteModal;
    
    document.getElementById('delOverlay').classList.add('show');
}
function closeDeleteModal() {
    document.getElementById('delOverlay').classList.remove('show');
}
// Close on overlay background click
document.getElementById('delOverlay').addEventListener('click', function(e) {
    if (e.target === this) closeDeleteModal();
});

