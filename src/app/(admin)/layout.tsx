import DashboardNavbar from '@/components/DashboardNavbar';
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardFooter from '@/components/DashboardFooter';
import Script from 'next/script';
import '@/../public/vendors/feather/feather.css';
import '@/../public/vendors/ti-icons/css/themify-icons.css';
import '@/../public/vendors/css/vendor.bundle.base.css';
import '@/../public/vendors/datatables.net-bs4/dataTables.bootstrap4.css';
import '@/../public/js/select.dataTables.min.css';
import '@/../public/css/vertical-layout-light/style.css';
// Note: We use global CSS imports here so they apply to all admin routes.

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <link rel="stylesheet" href="https://cdn.datatables.net/1.13.4/css/jquery.dataTables.min.css" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      
      <div className="container-scroller">
        <DashboardNavbar />
        <div className="container-fluid page-body-wrapper">
          {/* Right sidebar settings panel placeholder */}
          <div id="right-sidebar" className="settings-panel" style={{ backgroundColor: '#ffffff', borderLeft: '1px solid #ebedf2', boxShadow: 'none' }}>
            <i className="settings-close ti-close" style={{ position: 'absolute', right: '20px', top: '16px', fontSize: '16px', cursor: 'pointer', color: '#6c7383', zIndex: 2 }}></i>
            <div className="d-flex align-items-center justify-content-between" style={{ padding: '15px 50px 15px 20px', borderBottom: '1px solid #ebedf2', position: 'relative' }}>
              <p className="mb-0" style={{ fontSize: '15px', fontWeight: 'bold', color: '#5856d6', letterSpacing: '0.5px' }}>CHATS</p>
              <a href="/chats" style={{ textDecoration: 'none' }}><small className="font-weight-bold" style={{ color: '#6c7383' }}>See All</small></a>
            </div>
            <div className="tab-content" id="setting-content" style={{ padding: 0, overflowY: 'auto', height: 'calc(100vh - 65px)' }}>
              <div className="chat-list-wrapper" id="headerChatsList" style={{ paddingTop: '5px' }}>
                <div style={{ textAlign: 'center', padding: '20px', color: '#999', fontSize: '13px' }}>Loading...</div>
              </div>
            </div>
          </div>
          
          <DashboardSidebar />
          
          <div className="main-panel">
            {children}
            <DashboardFooter />
          </div>
        </div>
      </div>

      {/* Logout Modal */}
      <div className="modal fade" id="logoutModal" tabIndex={-1} role="dialog" aria-hidden="true">
        <div className="modal-dialog" role="document" style={{ maxWidth: '400px' }}>
          <div className="modal-content border-0 custom-modal-logout" style={{ borderRadius: '10px !important', boxShadow: 'none !important', overflow: 'hidden', backgroundColor: '#ffffff' }}>
            <div className="modal-body text-center p-5" style={{ position: 'relative', zIndex: 1 }}>
              <div className="modal-icon-container mb-4 mx-auto" style={{ position: 'relative', width: '85px', height: '85px', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2 }}>
                <div className="icon-circle" style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #ff0000 0%, #ff4d4d 100%)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 8px 25px rgba(255, 0, 0, 0.5)' }}>
                  <i className="ti-power-off" style={{ fontSize: '36px', color: '#ffffff', fontWeight: 'bold' }}></i>
                </div>
              </div>
              <h4 className="modal-title-custom mb-2" style={{ fontWeight: 700, color: '#2c2e33', fontSize: '1.4rem', zIndex: 2, position: 'relative' }}>Are You Sure You Want to Log Out?</h4>
              <p className="text-muted mb-4 modal-desc-custom" style={{ fontSize: '0.95rem', lineHeight: 1.6, zIndex: 2, position: 'relative', padding: '0 10px' }}>Your session will end shortly. Make sure your work has been saved safely.</p>
              <div className="d-flex justify-content-center align-items-center mt-4 pt-2">
                <button type="button" className="btn btn-cancel-custom mr-3" data-dismiss="modal" style={{ borderRadius: '10px !important', fontWeight: 600, padding: '10px 24px', color: '#6c7383', backgroundColor: '#f4f5f7', border: '1px solid #e1e3e9', transition: 'all 0.3s ease', zIndex: 2, position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                  <i className="ti-close mr-1 text-muted"></i> Cancel
                </button>
                <a href="/login" className="btn btn-logout-custom" style={{ borderRadius: '10px !important', fontWeight: 600, padding: '10px 26px', background: 'linear-gradient(135deg, #4B49AC 0%, #4B49AC 100%)', border: 'none', transition: 'all 0.3s ease', zIndex: 2, position: 'relative', color: '#ffffff !important', display: 'inline-flex', alignItems: 'center' }}>
                  <i className="ti-check mr-1 text-white"></i> Yes, Log Out
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Script src="/vendors/js/vendor.bundle.base.js" strategy="afterInteractive" />
      <Script src="/vendors/chart.js/Chart.min.js" strategy="lazyOnload" />
      <Script src="/vendors/datatables.net/jquery.dataTables.js" strategy="lazyOnload" />
      <Script src="/vendors/datatables.net-bs4/dataTables.bootstrap4.js" strategy="lazyOnload" />
      <Script src="/js/dataTables.select.min.js" strategy="lazyOnload" />
      <Script src="https://cdn.datatables.net/1.13.4/js/jquery.dataTables.min.js" strategy="lazyOnload" />
      <Script src="/js/off-canvas.js" strategy="lazyOnload" />
      <Script src="/js/hoverable-collapse.js" strategy="lazyOnload" />
      <Script src="/js/template.js" strategy="lazyOnload" />
      <Script src="/js/settings.js" strategy="lazyOnload" />
      <Script src="/js/todolist.js" strategy="lazyOnload" />
    </>
  );
}
