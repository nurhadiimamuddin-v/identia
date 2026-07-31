import Script from 'next/script';

import React from 'react';

export default async function NotificationsPage() {
  
  const htmlContent = `
<style>/* PAGE_CSS_INJECTED */
/* Layout copied and adapted from schedule.php */
.sch-layout { display:flex; gap:0; align-items:stretch; min-height:500px; font-family:'Inter', sans-serif; }
.sch-sidebar { width:240px; flex-shrink:0; padding-right:20px; }
.sch-divider { width:1px; background:#e5e9f0; flex-shrink:0; }
.sch-main { flex:1; padding-left:24px; min-width:0; overflow:hidden; display:flex; flex-direction:column; }
@media(max-width:992px){ 
    .sch-layout{ flex-direction:column; }
    .sch-sidebar{ width:100%; padding-right:0; padding-bottom:16px; }
    .sch-divider{ width:100%; height:1px; margin:8px 0; }
    .sch-main{ padding-left:0; }
    .ntf-filter-list { flex-direction:row; gap:6px; overflow-x:auto; padding-bottom:4px; }
    .ntf-filter-item { white-space:nowrap; padding:6px 12px; font-size:12px; }
    .nfi-icon { width:22px; height:22px; margin-right:6px; font-size:12px; }
    .nfi-text { font-size:12px; }
    .sch-sidebar hr, .sch-sidebar > div:last-child { display:none; }
    .ntf-card { padding:10px 36px 10px 12px; }
    .ntf-actions { display:block !important; opacity:0.5; right:2px; }
}

/* Sidebar Elements */
.ntf-filter-list { display:flex; flex-direction:column; gap:6px; }
.ntf-filter-item {
    display:flex; align-items:center; padding:8px 12px; border-radius:8px;
    text-decoration:none; color:#4b5563; transition:all 0.2s;
}
.ntf-filter-item:hover { background:#f9fafb; text-decoration:none; color:#111827; }
.ntf-filter-item.active { background:#f0f4ff; color:#4B49AC; font-weight:600; }
.nfi-icon {
    width:28px; height:28px; border-radius:6px; display:flex; align-items:center; justify-content:center;
    margin-right:12px; font-size:14px;
}
.nfi-text { flex:1; font-size:13px; }
.nfi-count {
    background:#e5e7eb; color:#4b5563; font-size:11px; font-weight:700;
    padding:2px 8px; border-radius:20px;
}

.ntf-stats-mini { display:flex; gap:10px; }
.nsm-item { flex:1; background:#f9fafb; border:1px solid #f3f4f6; border-radius:8px; padding:12px; text-align:center; }
.nsm-val { display:block; font-size:20px; font-weight:700; color:#111827; line-height:1; margin-bottom:4px; }
.nsm-lbl { display:block; font-size:11px; color:#6b7280; text-transform:uppercase; letter-spacing:0.5px; }

/* Main Content List */
.ntf-list-container { overflow-y:auto; max-height:600px; padding-right:10px; position:relative; }
.ntf-list-container::-webkit-scrollbar { width:5px; }
.ntf-list-container::-webkit-scrollbar-thumb { background:#ddd; border-radius:4px; }

.ntf-date-hdr { font-size:11px; font-weight:700; color:#9ca3af; text-transform:uppercase; letter-spacing:1px; margin:0 0 10px 4px; }
.ntf-group-wrap { margin-bottom:24px; }

/* Notification Card */
.ntf-card {
    display:flex; align-items:center; padding:12px 28px 12px 16px; margin-bottom:8px;
    background:#fff; border:1px solid #f3f4f6; border-radius:10px;
    cursor:pointer; transition:all 0.2s; position:relative; overflow:hidden;
}
.ntf-card:hover { border-color:#e5e7eb; box-shadow:0 4px 12px rgba(0,0,0,0.03); transform:translateY(-1px); }

/* Hover Actions */
.ntf-actions {
    opacity: 0; position:absolute; right:-4px; top:50%; transform:translateY(-50%);
    background: transparent; border-radius:6px; padding:4px 8px; box-shadow: none;
    color:#6b7280; z-index:10; transition:opacity 0.2s; font-size:22px; line-height:1;
    display: none;
}
.ntf-card:not(.unread):hover .ntf-actions { opacity: 1; display: block; }
.ntf-actions:hover { color:#111827; }

/* Remove any borders and accents, rely strictly on background and color */

.ntf-card.unread { background:#eff6ff !important; border-color:#bfdbfe !important; }

.nc-icon {
    width:36px; height:36px; border-radius:8px; background:#f3f4f6; color:#6b7280;
    display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0; margin-right:14px;
}
/* matching unread strictly to the alert image */
.ntf-card.unread .nc-icon { background:#2563eb !important; color:#ffffff !important; border-radius:50% !important; }

.nc-body { flex:1; min-width:0; padding-right:16px; }
.nc-title { font-size:13px; font-weight:600; color:#1f2937; margin-bottom:2px; }
/* specific unread and danger title colors */
.ntf-card.unread .nc-title { color:#1e293b !important; }

.nc-desc { font-size:12px; color:#6b7280; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.ntf-card.unread .nc-desc { color:#475569 !important; }

.nc-meta { text-align:right; flex-shrink:0; }
.nc-time { display:block; font-size:12px; font-weight:600; color:#9ca3af; }
.ntf-card.unread .nc-time { color:#2563eb !important; }
.ntf-card.danger .nc-time { color:#ef4444 !important; } /* Only the time is red for danger */
.nc-ago { display:block; font-size:10px; color:#d1d5db; margin-top:2px; }
/* match ago text slightly stronger on selected rows */
.ntf-card.unread .nc-ago { color:#94a3b8 !important; }
.ntf-card.danger .nc-ago { color:#ef4444 !important; } /* Only the ago text is red for danger */


/* Modal Simple */
.nt-modal-simple { border:none; border-radius:14px; box-shadow:0 15px 35px rgba(0,0,0,0.1); overflow:hidden; }
.ntms-header { display:flex; align-items:center; padding:20px 24px 16px; border-bottom:1px solid #f3f4f6; background:#fff; }
.ntms-icon { width:42px; height:42px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:22px; margin-right:16px; }
.ntms-title { margin:0 0 4px 0; font-size:15px; font-weight:700; color:#111827; }
.ntms-time { font-size:12px; color:#6b7280; font-weight:500; }

.ntms-body { padding:20px 24px 24px; background:#fcfcfd; }
.ntms-msg { font-size:14px; color:#374151; line-height:1.6; margin-bottom:16px; }
.ntms-detail { background:#fff; border:1px solid #e5e7eb; border-radius:8px; padding:12px 16px; font-size:12px; color:#4b5563; line-height:1.5; font-family:'Roboto Mono', monospace; }

.modal-theme-danger .ntms-icon { background:#fef2f2; color:#ef4444; }
.modal-theme-danger .ntms-title { color:#991b1b; }
.modal-theme-danger .ntms-detail { background:#fffafa; border-color:#fee2e2; color:#991b1b; }

.modal-theme-info .ntms-icon { background:#eff6ff; color:#2563eb; }

/* Context Menu Items */
.ctx-item { display:flex; align-items:center; padding:10px 16px; font-size:13px; color:#374151; cursor:pointer; transition:0.1s; }
.ctx-item:hover { background:#f3f4f6; color:#111827; }
.ctx-item i { margin-right:10px; font-size:16px; color:#6b7280; }
.ctx-item.text-danger:hover { background:#fef2f2; }
.ctx-item.text-danger i { color:#ef4444; }

/* Style for custom checkbox to match new_occupant.php feel */
#confirmEmptyTrash:checked + label::before {
    background-color: #ef4444 !important;
    border-color: #ef4444 !important;
}

</style>

<div class="content-wrapper">
        
        <!-- Page Header -->
        <div class="row">
          <div class="col-md-12 grid-margin">
            <div class="row align-items-center">
              <div class="col-12 col-xl-8 mb-4 mb-xl-0">
                <h3 class="font-weight-bold" style="font-family:'Inter', sans-serif;">Notifications</h3>
                <h6 class="font-weight-normal mb-0 text-muted">System activity and security alerts</h6>
              </div>
              
              <div class="col-12 col-xl-4">
<div class="justify-content-end d-flex flex-wrap" style="gap:15px; align-items:center;">
<!-- Action buttons relocated to card body -->
</div>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12 grid-margin stretch-card">
            <div class="card" style="border:1px solid #e5e9f0;box-shadow:none;border-radius:12px;">
              <div class="card-body ntf-page-body" style="padding:24px;">
                
                <!-- DUAL COLUMN LAYOUT (Copied from schedule.php & adapted) -->
                <div class="sch-layout">
                  
                  <!-- LEFT SIDEBAR -->
                  <div class="sch-sidebar">
                    <h5 style="font-size:14px;font-weight:700;color:#111827;margin-bottom:16px;">
                        <i class="mdi mdi-filter-variant mr-1 text-primary"></i> Filter
                    </h5>
                    
                    <div class="ntf-filter-list">
                        <a href="#" class="ntf-filter-item active" data-filter="all" onclick="filterNtf(event, 'all', this)">
                            <div class="nfi-icon" style="color:#4B49AC;background:#f0f4ff;"><i class="mdi mdi-inbox-multiple"></i></div>
                            <div class="nfi-text">All Notifications</div>
                        </a>
                        <a href="#" class="ntf-filter-item" data-filter="unread" onclick="filterNtf(event, 'unread', this)">
                            <div class="nfi-icon" style="color:#0284c7;background:#f0f9ff;"><i class="mdi mdi-email-open"></i></div>
                            <div class="nfi-text">Unread</div>
                            <div class="nfi-count" id="cntUnread" style="background:#0284c7;color:#fff;"></div>
                        </a>
                        <a href="#" class="ntf-filter-item" data-filter="danger" onclick="filterNtf(event, 'danger', this)">
                            <div class="nfi-icon" style="color:#ef4444;background:#fef2f2;"><i class="mdi mdi-alert-circle"></i></div>
                            <div class="nfi-text">Warnings</div>
                        </a>
                        <a href="#" class="ntf-filter-item" data-filter="trash" onclick="filterNtf(event, 'trash', this)">
                            <div class="nfi-icon" style="color:#6b7280;background:#f3f4f6;"><i class="mdi mdi-delete-outline"></i></div>
                            <div class="nfi-text">Trash (30 Days)</div>
                            <div class="nfi-count" id="cntTrash" style="background:#e5e7eb;color:#374151;"></div>
                        </a>
                    </div>
                    
                    <hr style="margin:20px 0;border-color:#f0f0f0;">
                    
                    <div style="font-size:12px;color:#6b7280;line-height:1.5;padding:0 12px;">
                        <strong>Info:</strong> Notifications in the trash will be automatically permanently deleted after 30 days.
                    </div>

                  </div>

                  <div class="sch-divider"></div>

                  <!-- RIGHT MAIN CONTENT -->
                  <div class="sch-main">
                    <div class="bch" style="margin-bottom:20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
                      <div style="font-size:16px;font-weight:700;color:#1a1a1a;" id="mainListTitle">
                         Recent Notifications
                      </div>
                      <div class="ntf-main-actions d-flex align-items-center" style="gap:8px;">
                        <button class="btn btn-sm btn-danger" id="btnDeleteAllToTrash"  style="border-radius:6px;font-size:12px;padding:7px 10px;">Delete All to Trash</button>
                        <button class="btn btn-sm btn-primary" id="btnMarkAll"  style="border-radius:6px;font-size:12px;padding:7px 10px;">Mark All as Read</button>
                        <button class="btn btn-sm btn-danger" id="btnEmptyTrash" style="display:none;border-radius:6px;font-size:12px;padding:7px 10px;">Empty Trash</button>
                      </div>
                    </div>
                    
                    <!-- Notification List Container -->
                    <div class="ntf-list-container">
                        
                        <!-- ACTIVE LIST -->
                        <div id="activeListWrapper">
                            
                                <div style="text-align:center;padding:50px 20px;color:#9ca3af;">
                                    <i class="mdi mdi-bell-sleep-outline" style="font-size:40px;display:block;margin-bottom:10px;color:#e5e7eb;"></i>
                                    <span style="font-size:14px;">No notifications.</span>
                                </div>
                            
                                
                                    <div class="ntf-date-hdr ntf-date-group-"></div>
                                    
                                    <div class="ntf-group-wrap ntf-date-group-">
                                        
                                            <div class="ntf-card ntf-card-item  "
                                                 id="ncard-"
                                                 onclick="showNtf(this, )"
                                                 data-id=""
                                                 data-icnclass=""
                                                 data-title=""
                                                 data-msg=""
                                                 data-detail=""
                                                 data-time=""
                                                 data-danger=""
                                                 data-unread=""
                                                 oncontextmenu="showContextMenu(event, , 'active')">
                                                
                                                <div class="nc-icon"><i class="mdi "></i></div>
                                                <div class="nc-body">
                                                    <div class="nc-title"></div>
                                                    <div class="nc-desc"></div>
                                                </div>
                                                <div class="nc-meta">
                                                    <span class="nc-time"></span>
                                                    <span class="nc-ago"></span>
                                                </div>
                                                
                                                <!-- Action Menu Button (Mobile Friendly) -->
                                                <div class="ntf-actions" onclick="event.stopPropagation(); showContextMenu(event, , 'active')">
                                                    <i class="mdi mdi-dots-vertical"></i>
                                                </div>
                                            </div>
                                        
                                    </div>
                                
                            
                        </div>

                        <!-- TRASH LIST -->
                        <div id="trashListWrapper" style="display:none;">
                            
                                <div style="text-align:center;padding:50px 20px;color:#9ca3af;">
                                    <i class="mdi mdi-delete-empty" style="font-size:40px;display:block;margin-bottom:10px;color:#e5e7eb;"></i>
                                    <span style="font-size:14px;">Trash is empty.</span>
                                </div>
                            
                                
                                    <div class="ntf-date-hdr"></div>
                                    <div class="ntf-group-wrap">
                                        
                                            <div class="ntf-card ntf-card-item" style="opacity:0.75;" id="ncard-"
                                                 oncontextmenu="showContextMenu(event, , 'trash')">
                                                
                                                <div class="nc-icon"><i class="mdi "></i></div>
                                                <div class="nc-body">
                                                    <div class="nc-title"></div>
                                                    <div class="nc-desc"></div>
                                                </div>
                                                <div class="nc-meta">
                                                    <span class="nc-time"></span>
                                                    <span class="nc-ago">Deleted </span>
                                                </div>
                                                
                                                <!-- Action Menu Button -->
                                                <div class="ntf-actions" onclick="event.stopPropagation(); showContextMenu(event, , 'trash')">
                                                    <i class="mdi mdi-dots-vertical"></i>
                                                </div>
                                            </div>
                                        
                                    </div>
                                
                            
                        </div>

                    </div>
                    
                  </div>
                </div>
                <!-- END DUAL COLUMN -->

              </div>
            </div>
          </div>
        </div>
      </div>

<!-- Simple Clean Modal -->
<div class="modal fade" id="modalNtf" tabindex="-1">
  <div class="modal-dialog" style="max-width: 420px;">
    <div class="modal-content nt-modal-simple">
      <div class="ntms-header" id="nmdl-hdr">
        <div class="ntms-icon" id="nmdl-icn-wrap"><i class="mdi" id="nmdl-icn"></i></div>
        <div style="flex:1;">
            <h5 class="ntms-title" id="nmdl-title">Title</h5>
            <div class="ntms-time" id="nmdl-time">Time</div>
        </div>
        <button type="button" class="close" data-dismiss="modal" style="outline:none;">&times;</button>
      </div>
      <div class="ntms-body">
        <p class="ntms-msg" id="nmdl-msg">Message goes here.</p>
        <div class="ntms-detail" id="nmdl-dtl">Detail goes here.</div>
      </div>
    </div>
  </div>
</div>

<!-- Context Menu -->
<div id="ctxMenu" style="display:none; position:fixed; z-index:9999; background:#fff; border-radius:8px; box-shadow:0 10px 25px rgba(0,0,0,0.1); border:1px solid #e5e7eb; overflow:hidden; min-width:160px;">
    <!-- Filled via JS -->
</div>

<!-- ==================== MODAL: DELETE TRASH ==================== -->
<div class="modal fade" id="modalDeleteTrash" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content nt-modal-simple" style="border-radius:12px;">
      <div class="modal-body p-4" style="text-align: left;">
        <h5 class="font-weight-bold mb-3">Empty Trash</h5>
        <p style="font-size:14px;color:#666;margin-bottom:20px;">Are you sure you want to permanently delete all items in the trash?</p>
        
        <div class="custom-control custom-checkbox mb-4" style="display:flex; align-items:center;">
            <input type="checkbox" class="custom-control-input" id="confirmEmptyTrash" style="width:18px;height:18px;margin-right:10px;cursor:pointer;">
            <label class="custom-control-label" for="confirmEmptyTrash" style="font-size:14px; color:#1e1f23; padding-top:2px; cursor:pointer;">I understand that all items in the trash will be permanently deleted</label>
        </div>
        
        <div class="d-flex justify-content-end" style="gap:8px;">
          <button type="button" class="btn btn-light font-weight-bold" style="padding:8px 18px;font-size:13px;border-radius:6px;" data-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-danger font-weight-bold" style="padding:8px 18px;font-size:13px;border-radius:6px;" id="btnConfirmEmptyTrash" disabled>Empty Trash</button>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
/* Style for custom checkbox to match new_occupant.php feel */
#confirmEmptyTrash:checked + label::before {
    background-color: #ef4444 !important;
    border-color: #ef4444 !important;
}
</style>



 
  `;

  const scriptContent = `



  `;

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      <div dangerouslySetInnerHTML={{ __html: scriptContent }} />
      <Script src="/js/notifications-script.js" strategy="lazyOnload" />
      {/* fix_scripts_applied */}
    </>
  );
}
