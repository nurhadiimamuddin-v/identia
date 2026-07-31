import Script from 'next/script';

import React from 'react';

export default async function ChatsPage() {
  
  const htmlContent = `
<style>/* PAGE_CSS_INJECTED */
/* CSS for Chat Interface */
.chat-wrapper {
    display: flex;
    height: 600px;
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    position: relative;
}

/* Custom Delete Modal */
.del-overlay { display:none; position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.35); z-index:10000; align-items:center; justify-content:center; }
.del-overlay.show { display:flex; }
.del-box { background:#fff; border-radius:14px; width:260px; overflow:hidden; box-shadow:0 10px 40px rgba(0,0,0,0.18); animation: delPop 0.15s ease-out; }
@keyframes delPop { from { transform:scale(0.92); opacity:0; } to { transform:scale(1); opacity:1; } }
.del-title { padding:18px 20px 14px; text-align:center; font-size:14px; font-weight:700; color:#1a1a1a; border-bottom:1px solid #f0f0f0; }
.del-option { padding:12px 20px; text-align:center; font-size:13px; font-weight:500; cursor:pointer; transition:background 0.12s; border-bottom:1px solid #f0f0f0; }
.del-option:last-child { border-bottom:none; }
.del-option:hover { background:#f8f9fa; }
.del-option.del-red { color:#ef4444; }
.del-option.del-amber { color:#f59e0b; }
.del-option.del-cancel { color:#64748b; }

.chat-sidebar {
    width: 340px;
    border-right: 1px solid #f0f0f0;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
}
.chat-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #fafbfe;
    position: relative;
}
.chat-search-header {
    padding: 18px 20px;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    align-items: center;
    gap: 12px;
}
.chat-search-header img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
}
.chat-search-box {
    flex: 1;
    position: relative;
}
.chat-search-box input {
    width: 100%;
    padding: 8px 16px 8px 36px;
    border-radius: 20px;
    border: 1px solid #e0e0e0;
    font-size: 13px;
    outline: none;
    transition: 0.2s;
}
.chat-search-box input:focus {
    border-color: #5856d6;
    box-shadow: 0 0 0 3px rgba(88, 86, 214, 0.1);
}
.chat-search-box i {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
    font-size: 14px;
}

.chat-list-wrapper {
    flex: 1;
    overflow-y: auto;
}
.chat-list-wrapper::-webkit-scrollbar { width: 6px; }
.chat-list-wrapper::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }

.section-title {
    padding: 16px 20px 8px;
    font-size: 14px;
    font-weight: 600;
    color: #5856d6;
}

.contact-item {
    display: flex;
    padding: 12px 20px;
    gap: 12px;
    cursor: pointer;
    transition: 0.2s;
    align-items: center;
}
.contact-item:hover {
    background: #f8faff;
}
.contact-item.active {
    background: #5856d6;
}
.contact-item.active .ci-name { color: #fff; }
.contact-item.active .ci-msg { color: #e0e7ff; }
.contact-item.active .ci-time { color: #c7d2fe; }

.ci-avatar {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    position: relative;
}
.ci-avatar img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
}
.ci-status {
    position: absolute;
    bottom: 2px;
    right: 2px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #10b981;
    border: 2px solid #fff;
}
.contact-item.active .ci-status { border-color: #5856d6; }

.ci-info {
    flex: 1;
    min-width: 0;
}
.ci-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 4px;
}
.ci-name {
    font-size: 14px;
    color: #333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.ci-time {
    font-size: 11px;
    color: #999;
    flex-shrink: 0;
}
.ci-msg {
    font-size: 12px;
    color: #666;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.ci-unread-badge {
    background: #5856d6;
    color: #fff;
    font-size: 9px;
    font-weight: bold;
    padding: 1.5px 5px;
    border-radius: 8px;
    display: inline-block;
    min-width: 14px;
    text-align: center;
}

/* Right Blank View */
.chat-blank {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #666;
}
.chat-blank-icon {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: #eff6ff;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
}
.chat-blank-icon i { font-size: 40px; color: #5856d6; }

/* Right Active View */
.chat-active-view {
    display: none;
    flex-direction: column;
    height: 100%;
}
.chat-header {
    padding: 16px 24px;
    background: #fff;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.ch-left {
    display: flex;
    align-items: center;
    gap: 12px;
}
.ch-left img {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    object-fit: cover;
}
.ch-name {
    font-size: 15px;
    font-weight: 600;
    color: #333;
    margin-bottom: 2px;
}
.ch-status {
    font-size: 12px;
    color: #666;
}
.ch-right {
    display: flex;
    gap: 16px;
    color: #666;
}
.ch-right i {
    font-size: 18px;
    cursor: pointer;
    transition: 0.2s;
}
.ch-right i:hover { color: #5856d6; }

.chat-history {
    flex: 1;
    padding: 24px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
}
.chat-history::-webkit-scrollbar { width: 6px; }
.chat-history::-webkit-scrollbar-thumb { background: #ccc; border-radius: 4px; }

.msg-row {
    display: flex;
    align-items: flex-end;
    gap: 8px;
    max-width: 80%;
}
.msg-row img {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
}
.msg-content {
    display: flex;
    flex-direction: column;
}
.msg-bubble {
    padding: 6px 7px 4px 9px;
    border-radius: 7.5px;
    font-size: 14.2px;
    line-height: 19px;
    box-shadow: 0 1px .5px rgba(11,20,26,.13);
    position: relative;
    color: #111b21;
    word-break: break-all; /* Force long URLs/strings to break anywhere */
    white-space: pre-wrap;
}
.msg-bubble p {
    margin-bottom: 0;
    margin-top: 0;
}

.msg-time {
    font-size: 11px;
    color: #667781;
    display: inline-flex;
    align-items: center;
    float: right;
    margin-top: 4px;
    margin-bottom: -4px;
    margin-left: 12px;
}

/* WhatsApp-like message status */
.msg-status { display: inline-flex; align-items: center; margin-left: 3px; }
.msg-status .mdi { font-size: 15.5px; line-height: 1; margin-top: 1px;}
.msg-status-sending .mdi { color: #8696a0; animation: spinCheck 1s linear infinite; font-size: 13px;}
.msg-status-sent .mdi { color: #8696a0; }
.msg-status-delivered .mdi { color: #8696a0; }
.msg-status-read .mdi { color: #53bdeb; }
@keyframes spinCheck { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

/* Optimistic message (temporary) */
.msg-row.msg-sending { opacity: .7; }
.msg-row.msg-sending .msg-bubble { position: relative; }

/* Occupant Msg (Left) */
.msg-left {
    align-self: flex-start;
}
.msg-left .msg-bubble {
    background: #ffffff;
    border-top-left-radius: 0;
}
.msg-left .msg-time { color: #667781; }

/* Admin Msg (Right) - Updated to Primary Color */
.msg-right {
    align-self: flex-end;
    flex-direction: row-reverse;
}
.msg-right .msg-bubble {
    background: #5856d6;
    color: #ffffff;
    border-top-right-radius: 0;
}
.msg-right .msg-time { color: #667781; }
.msg-right .msg-status .mdi { color: #8696a0 !important; }
.msg-right .msg-status-read .mdi { color: #53bdeb !important; }
.edit-tag { 
    float: right !important; 
    margin-top: 2px !important; 
    margin-left: 8px !important; 
    font-size: 11.5px !important;
}
.msg-right .edit-tag { color: rgba(255,255,255,0.8) !important; }
.msg-left .edit-tag { color: #8696a0 !important; }

/* Chat Footer */
.chat-footer {
    padding: 16px 24px;
    background: #fff;
    border-top: 1px solid #f0f0f0;
    display: flex;
    flex-direction: column;
}
.chat-footer-top {
    display: flex;
    align-items: center;
    gap: 16px;
    width: 100%;
}
.reply-preview-box {
    display: none;
    width: 100%;
    margin-bottom: 12px;
    padding: 10px 14px;
    background: #f8fafc;
    border-left: 4px solid #5856d6;
    border-radius: 6px;
    position: relative;
    font-size: 13px;
}
.rp-close {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: #94a3b8;
    font-size: 18px;
}
.rp-close:hover { color: #ef4444; }
.rp-title { font-weight: bold; color: #5856d6; margin-bottom: 2px;}
.rp-text { color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding-right: 20px;}

.msg-reply-block {
    background: rgba(0,0,0,0.05);
    border-left: 3px solid #5856d6;
    padding: 6px 10px;
    border-radius: 4px;
    margin-bottom: 6px;
    font-size: 12px;
    cursor: pointer;
}
.msg-reply-block .replier { font-weight: bold; color: #5856d6; }
.msg-right .msg-reply-block { background: rgba(255,255,255,0.2); border-color: #fff; }
.msg-right .msg-reply-block .replier { color: #fff; }

.chat-footer .input-wrapper {
    flex: 1;
    background: #f8fafc;
    border-radius: 20px;
    border: 1px solid #e2e8f0;
    display: flex;
    align-items: flex-end; /* Align to bottom for textarea growth */
    padding: 8px 16px;
    transition: 0.2s;
}
.chat-footer .input-wrapper:focus-within {
    border-color: #5856d6;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(88, 86, 214, 0.1);
}
.chat-footer textarea {
    flex: 1;
    border: none;
    background: transparent;
    outline: none;
    padding: 8px;
    font-size: 14px;
    color: #333;
    font-family: inherit;
    resize: none;
    max-height: 120px;
    overflow-y: auto;
    box-sizing: border-box;
    /* Hide scrollbar for cleaner look */
    -ms-overflow-style: none;
    scrollbar-width: none;
}
.chat-footer textarea::-webkit-scrollbar {
    display: none;
}

#btnEmoji {
    background: transparent;
    border: none;
    outline: none;
    box-shadow: none;
    color: #64748b;
    font-size: 20px;
    padding: 0;
    margin: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}
#btnEmoji:hover {
    color: #5856d6;
}

.btn-send {
    background: #5856d6;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 10px 20px;
    font-weight: 600;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: 0.2s;
    box-shadow: none;
}
.btn-send:hover { background: #4b49ac; transform: translateY(-1px); }

/* Emoji Picker */
.emoji-picker {
    display: none; position: absolute; bottom: 70px; right: 24px;
    width: 320px; background: #fff; border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0,0,0,.12); border: 1px solid #edf2f7;
    z-index: 100; overflow: hidden;
}
.emoji-picker.show { display: block; }
.emoji-tabs { display: flex; border-bottom: 1px solid #f1f5f9; padding: 0 4px; }
.emoji-tab {
    flex: 1; padding: 8px 0; text-align: center; cursor: pointer;
    font-size: 16px; opacity: .5; transition: .12s; border-bottom: 2px solid transparent;
}
.emoji-tab:hover { opacity: .8; }
.emoji-tab.active { opacity: 1; border-bottom-color: #5856d6; }
.emoji-grid { display: grid; grid-template-columns: repeat(8, 1fr); gap: 2px; padding: 8px; max-height: 200px; overflow-y: auto; }
.emoji-grid::-webkit-scrollbar { width: 4px; }
.emoji-grid::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }
.emoji-item { font-size: 20px; text-align: center; padding: 6px; cursor: pointer; border-radius: 6px; transition: .1s; }
.emoji-item:hover { background: #f1f5f9; transform: scale(1.2); }


/* Custom Context Menu */
.chat-context-menu {
    position: fixed; z-index: 9999; width: 180px; background: #fff;
    border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,.15);
    padding: 6px 0; display: none; font-size: 13px;
    border: 1px solid #edf2f7;
}
.chat-context-menu ul { list-style: none; padding: 0; margin: 0; }
.chat-context-menu li {
    display: flex; align-items: center; gap: 10px; padding: 9px 16px;
    cursor: pointer; transition: background .12s; color: #334155;
}
.chat-context-menu li:hover { background: #f1f5f9; }
.chat-context-menu li i { font-size: 16px; width: 18px; text-align: center; color: #64748b; }
.chat-context-menu li.ctx-danger { color: #ef4444; }
.chat-context-menu li.ctx-danger i { color: #ef4444; }
.chat-context-menu .ctx-sep { height: 1px; background: #f1f5f9; margin: 4px 0; }

/* Selection Mode */
.msg-checkbox {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 22px;
    color: #94a3b8;
    display: none;
    cursor: pointer;
    z-index: 10;
}
.msg-row { position: relative; transition: 0.2s; }
.msg-row.selectable {
    cursor: pointer;
}
/* Admin Chat Checkbox */
.msg-right .msg-checkbox {
    left: 15px; /* sedikit ditambah jaraknya */
}
.msg-right.selectable {
    padding-left: 45px; /* memberi ruang */
}
/* Occupant Chat Checkbox */
.msg-left .msg-checkbox {
    position: static;
    transform: none;
    margin-left: 15px;
    align-self: center;
    order: 3;
}
.msg-left.selectable {
    padding-left: 0;
}
.msg-row.selectable .msg-checkbox {
    display: block;
}
.msg-row.selected .msg-checkbox i::before {
    content: "\F0134"; /* mdi-checkbox-marked-circle */
    color: #5856d6;
}
.msg-row.selected .msg-bubble {
    background: rgba(88, 86, 214, 0.15) !important;
    color: #111b21 !important;
}
.msg-row.msg-right.selected .msg-bubble {
    background: rgba(88, 86, 214, 0.8) !important;
    color: #fff !important;
}
.ch-right-actions {
    display: none;
    align-items: center;
    gap: 15px;
}
.ch-right-actions i {
    font-size: 22px;
    cursor: pointer;
    color: #64748b;
}
.ch-right-actions i.action-del { color: #ef4444; }
.ch-right-actions i.action-close:hover { color: #333; }

/* Dropdown Menu */
.header-dropdown {
    position: relative;
    display: inline-block;
}
.header-dropdown-content {
    display: none;
    position: absolute;
    right: 0;
    top: 30px;
    background-color: #fff;
    min-width: 150px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1000;
    border-radius: 8px;
    overflow: hidden;
}
.header-dropdown-content a {
    color: #333;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
    font-size: 14px;
}
.header-dropdown-content a:hover {
    background-color: #f1f5f9;
}
.show-dropdown {
    display: block;
}

/* Profile View */
.profile-view {
    display: none;
    width: 100%;
    height: 100%;
    background: #fff;
    flex-direction: row;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 50;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}
.pv-left {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    border-right: 1px solid #e2e8f0;
}
.pv-left img {
    max-width: 80%;
    max-height: 80%;
    border-radius: 20px;
    object-fit: contain;
    border: 1px solid #e2e8f0;
}
.pv-right {
    flex: 1;
    padding: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.pv-close {
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 24px;
    cursor: pointer;
    color: #64748b;
    z-index: 51;
}
.pv-close:hover { color: #333; }
.pv-info-row {
    margin-bottom: 20px;
}
.pv-label {
    font-size: 11px;
    color: #94a3b8;
    margin-bottom: 4px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
}
.pv-value {
    font-size: 16px;
    color: #0f172a;
    font-weight: 500;
}

@media (max-width: 768px) {
    .profile-view {
        flex-direction: column;
        overflow-y: auto;
    }
    .pv-left {
        border-right: none;
        border-bottom: 1px solid #f0f0f0;
        padding: 40px 20px;
        flex: none;
    }
    .pv-left img {
        max-width: 200px;
        max-height: 200px;
        border-radius: 50%;
    }
    .pv-right {
        padding: 20px;
        flex: none;
    }
}

/* ===== RESPONSIVE MOBILE (WhatsApp-like) ===== */
.chat-back-btn {
    display: none;
    background: none;
    border: none;
    font-size: 22px;
    color: #5856d6;
    cursor: pointer;
    padding: 0;
    margin-right: 8px;
    line-height: 1;
}
@media (max-width: 768px) {
    .chat-wrapper {
        height: calc(100vh - 120px);
    }
    .chat-sidebar {
        width: 100%;
        border-right: none;
    }
    .chat-main {
        display: none !important;
        width: 100%;
    }
    .chat-wrapper.mobile-chat-open .chat-sidebar {
        display: none !important;
    }
    .chat-wrapper.mobile-chat-open .chat-main {
        display: flex !important;
        width: 100%;
    }
    .chat-back-btn {
        display: inline-flex;
    }
    .emoji-picker {
        width: 280px;
        right: 10px;
        bottom: 60px;
    }
}

.delete-confirm-cb:checked ~ .custom-control-label::before {
    background-color: #ff4747 !important;
    border-color: #ff4747 !important;
}

</style>

<div class="content-wrapper">
    <div class="row">
      <div class="col-md-12 grid-margin stretch-card mb-4 mt-3" style="display:none;">
      </div>
    
      <div class="col-md-12 grid-margin stretch-card">
        <div class="card" style="border:1px solid #e5e9f0;box-shadow:none;border-radius:12px;">
          <div class="card-body" style="padding:0;">
          
            <div class="chat-wrapper">
                <!-- Sidebar -->
                <div class="chat-sidebar">
                    <div class="chat-search-header">
                        <img src="images/admin.png" alt="Admin">
                        <div class="chat-search-box">
                            <i class="mdi mdi-magnify"></i>
                            <input type="text" id="searchInput" placeholder="Search..." onkeyup="filterContacts()">
                        </div>
                    </div>
                    <div class="chat-list-wrapper">
                        <div id="chatsSection" style="display:none;">
                            <div class="section-title">Chats</div>
                            <div id="chatsList"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Main Chat Area -->
                <div class="chat-main">
                    <!-- Blank State -->
                    <div class="chat-blank" id="chatBlank">
                        <div class="chat-blank-icon">
                            <i class="mdi mdi-message-text-outline"></i>
                        </div>
                        <p>Select a contact to start a conversation.</p>
                    </div>
                    
                    <!-- Active Chat State -->
                    <div class="chat-active-view" id="chatActive">
                        <div class="chat-header">
                            <div class="ch-left">
                                <button class="chat-back-btn" id="btnBackToContacts" onclick="backToContacts()" title="Back">
                                    <i class="mdi mdi-arrow-left"></i>
                                </button>
                                <img src="" id="activeAvatar" alt="Contact Avatar">
                                <div>
                                    <div class="ch-name" id="activeName"></div>
                                    <div class="ch-status" id="activeStatus">Occupant</div>
                                </div>
                            </div>
                            <div class="ch-right">
                                <div id="normalHeaderActions" class="header-dropdown">
                                    <i class="mdi mdi-dots-vertical" onclick="toggleHeaderDropdown()"></i>
                                    <div id="headerDropdownMenu" class="header-dropdown-content">
                                        <a href="javascript:void(0)" onclick="openProfileView()">Profile</a>
                                        <a href="javascript:void(0)" onclick="deleteAllChats()" style="color:#ef4444;">Delete all chats</a>
                                    </div>
                                </div>
                                <div id="selectionHeaderActions" class="ch-right-actions">
                                    <span id="selectionCount" style="font-size:15px; font-weight:bold; color:#5856d6;">0</span>
                                    <i class="mdi mdi-delete action-del" title="Delete" onclick="triggerBulkDelete()"></i>
                                    <i class="mdi mdi-close action-close" title="Cancel" onclick="exitSelectionMode()"></i>
                                </div>
                            </div>
                        </div>
                        
                        <div class="chat-history" id="chatHistory">
                            <!-- JS will populate -->
                        </div>
                        
                        <div class="chat-footer">
                            <div class="reply-preview-box" id="replyPreview">
                                <div class="rp-title" id="rpTitle">Replying to User</div>
                                <div class="rp-text" id="rpText">...</div>
                                <i class="mdi mdi-close rp-close" onclick="closeReplyBox()"></i>
                            </div>

                            <div class="reply-preview-box" id="editPreview" style="border-left-color: #f59e0b;">
                                <div class="rp-title" style="color: #f59e0b;"><i class="mdi mdi-pencil" style="font-size:14px; margin-right:4px;"></i> Editing Message...</div>
                                <div class="rp-text" id="epText">...</div>
                                <i class="mdi mdi-close rp-close" onclick="cancelEdit()"></i>
                            </div>

                            <div class="chat-footer-top" id="footerNormal">
                                <div class="input-wrapper">
                                    <textarea id="messageInput" rows="1" placeholder="Type a message..." onkeydown="handleEnter(event)"></textarea> 
                                    <button class="icon-btn" id="btnEmoji" onclick="toggleEmoji()" style="margin-bottom: 4px;"><i class="mdi mdi-emoticon-outline"></i></button>
                                </div>
                                <button class="btn-send" onclick="submitMessageOrEdit()" style="align-self: flex-end; margin-bottom: 4px;">
                                    <i class="mdi mdi-send"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Profile View Overlay -->
                <div class="profile-view" id="profileView">
                    <i class="mdi mdi-close pv-close" onclick="closeProfileView()" title="Close Profile"></i>
                    <div class="pv-left">
                        <img src="" id="pvImage" alt="Profile Image">
                    </div>
                    <div class="pv-right">
                        <h3 style="margin-bottom: 30px; color: #1e293b; font-weight: 600;">Occupant Profile</h3>
                        <div class="pv-info-row">
                            <div class="pv-label">Name</div>
                            <div class="pv-value" id="pvName"></div>
                        </div>
                        <div class="pv-info-row">
                            <div class="pv-label">Phone Number</div>
                            <div class="pv-value" id="pvPhone"></div>
                        </div>
                        <div class="pv-info-row">
                            <div class="pv-label">NIK / NIP</div>
                            <div class="pv-value" id="pvNik"></div>
                        </div>
                    </div>
                </div>
                
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>

<!-- Emoji Picker -->
<div class="emoji-picker" id="emojiPicker">
    <div class="emoji-tabs">
        <div class="emoji-tab active" data-cat="smileys">😊</div>
        <div class="emoji-tab" data-cat="gestures">👍</div>
        <div class="emoji-tab" data-cat="hearts">❤️</div>
        <div class="emoji-tab" data-cat="objects">🎉</div>
        <div class="emoji-tab" data-cat="animals">🐱</div>
        <div class="emoji-tab" data-cat="food">🍕</div>
    </div>
    <div class="emoji-grid" id="emojiGrid"></div>
</div>

<!-- Context Menu -->
<div id="msgContextMenu" class="chat-context-menu">
    <ul>
        <li onclick="prepareReply(event)"><i class="mdi mdi-reply"></i> Reply</li>
        <li id="ctxMenuEdit" onclick="editSelectedMessage(event)" style="display:none;"><i class="mdi mdi-pencil-outline"></i> Edit</li>
        <li onclick="enterSelectionMode(event)"><i class="mdi mdi-checkbox-marked-outline"></i> Select</li>
        <div class="ctx-sep"></div>
        <li class="ctx-danger" onclick="deleteSelectedMessage(event)"><i class="mdi mdi-delete-outline"></i> Delete</li>
    </ul>
</div>

<!-- Custom Delete Modal -->
<div class="del-overlay" id="delOverlay">
    <div class="del-box">
        <div class="del-title" id="delTitle"></div>
        <div id="delOptions"></div>
    </div>
</div>

<!-- ==================== MODAL: DELETE ALL CHATS ==================== -->
<div class="modal fade" id="modalDeleteAllChats" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content mdl-card" style="border: none; border-radius: 6px; box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);">
      <form id="formDeleteAllChats" onsubmit="executeDeleteAllChats(event)">
        <div class="modal-body p-4" style="text-align: left;">
          <h5 class="font-weight-bold mb-3">Delete All Chats</h5>
          <p style="font-size:14px;color:#666;margin-bottom:20px;">Are you sure you want to delete all chats with <strong id="deleteAll_occupant_name">this occupant</strong>?</p>
          
          <div class="d-flex justify-content-end align-items-center" style="gap:20px;">
            <span style="font-size:14px; font-weight:500; color:#1e293b; cursor:pointer;" data-dismiss="modal">Cancel</span>
            <span style="font-size:14px; font-weight:500; color:#ef4444; cursor:pointer;" onclick="executeDeleteAllChats(event)">Delete</span>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>

<style>
.delete-confirm-cb:checked ~ .custom-control-label::before {
    background-color: #ff4747 !important;
    border-color: #ff4747 !important;
}
</style>



 
  `;

  const scriptContent = `


  `;

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      <div dangerouslySetInnerHTML={{ __html: scriptContent }} />
      <Script src="/js/chats-script.js" strategy="lazyOnload" />
      {/* fix_scripts_applied */}
    </>
  );
}
