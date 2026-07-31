'use client';

import { useState, useEffect } from 'react';

export default function HistoryPage() {
  const [search, setSearch] = useState('');
  const [histories, setHistories] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);
  
  const [selectedHistory, setSelectedHistory] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  const [deleteId, setDeleteId] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const limit = 12;

  useEffect(() => {
    // Mock fetch histories
    const mockData = [
      {
        id_history: '1', name: 'John Doe', occupant_name: '', occupant_foto: '', nik_nip: '123456', no_hp: '08123456789',
        kegiatan: 'Entering room', schedule_date: new Date().toISOString(), history_foto: '', is_read: 0
      },
      {
        id_history: '2', name: '', occupant_name: 'Jane Smith (Deleted)', occupant_foto: '', nik_nip: '-', no_hp: '-',
        kegiatan: 'Leaving room', schedule_date: new Date(Date.now() - 86400000).toISOString(), history_foto: '', is_read: 1
      }
    ];
    setHistories(mockData);
    setTotalData(2);
    setTotalPages(1);
  }, [page, search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    // In real app, it triggers the useEffect dependency
  };

  const openDetail = (h: any) => {
    setSelectedHistory(h);
    setShowDetailModal(true);
    // Mark as read in UI
    if (h.is_read === 0) {
      setHistories(prev => prev.map(item => item.id_history === h.id_history ? { ...item, is_read: 1 } : item));
    }
  };

  const openDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeleteId(id);
    setConfirmDelete(false);
    setShowDeleteModal(true);
  };

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDeleting(true);
    setTimeout(() => {
      setHistories(prev => prev.filter(h => h.id_history !== deleteId));
      setTotalData(prev => prev - 1);
      setIsDeleting(false);
      setShowDeleteModal(false);
    }, 500);
  };

  const offset = (page - 1) * limit;

  return (
    <>
      <div className="content-wrapper">
        <div className="history-container" style={{ padding: 0, fontFamily: "'Inter', -apple-system, sans-serif" }}>
          
          <div className="row mb-4 align-items-center">
            <div className="col-12 col-xl-8 mb-4 mb-xl-0">
              <h3 className="font-weight-bold">Activity Feed</h3>
              <h6 className="font-weight-normal mb-0">List of occupant activities reported, <span className="text-primary">Review them below!</span></h6>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12 grid-margin stretch-card">
              <div className="card" style={{ border: '1px solid #e5e9f0', boxShadow: 'none', borderRadius: '12px' }}>
                <div className="card-body" style={{ padding: '32px' }}>
                  
                  <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap" style={{ gap: '16px' }}>
                    <p className="card-title mb-0">All Reported Activities</p>
                    <div className="history-search" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem' }}>
                      <form onSubmit={handleSearch} className="history-search m-0" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <label style={{ marginBottom: 0, fontWeight: 400, color: '#333', whiteSpace: 'nowrap' }}>Search:</label>
                        <input type="search" value={search} onChange={e => setSearch(e.target.value)} 
                          style={{ background: 'transparent', border: '1px solid #d1d5db', borderRadius: '3px', color: '#333', padding: '0.3rem 0.6rem', fontSize: '0.8rem', height: '28px', transition: '0.2s ease', outline: 'none' }} />
                      </form>
                    </div>
                  </div>

                  {histories.length === 0 ? (
                    <div className="empty-state" style={{ textAlign: 'center', padding: '60px 20px' }}>
                      <i className="mdi mdi-clipboard-text-outline" style={{ fontSize: '48px', color: '#d4d4d8', marginBottom: '16px', display: 'block' }}></i>
                      <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1a1a1a', marginBottom: '8px' }}>No activities found</h3>
                      <p style={{ fontSize: '14px', color: '#888' }}>When someone submits an activity report, it will appear here.</p>
                    </div>
                  ) : (
                    <>
                      <div className="history-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
                        {histories.map(h => {
                          const dateObj = new Date(h.schedule_date);
                          const timeDate = dateObj.toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }).replace(',', ' •');
                          
                          const dispName = h.name ? h.name : (h.occupant_name ? h.occupant_name : 'Deleted Occupant');
                          const dispFoto = h.occupant_foto || '/images/admin.png'; // In Next.js, static files are in /public, so /images/admin.png
                          const mainImg = h.history_foto || '/images/placeholder.jpg';
                          
                          return (
                            <div key={h.id_history} className="history-card" onClick={() => openDetail(h)}
                              style={{ background: '#ffffff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e9f0', display: 'flex', flexDirection: 'column', cursor: 'pointer', position: 'relative', transition: 'all 0.2s ease' }}>
                              
                              {h.is_read === 0 && (
                                <div className="unread-indicator" style={{ position: 'absolute', top: '12px', right: '12px', width: '28px', height: '28px', backgroundColor: '#ffaf02', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, boxShadow: '0 3px 8px rgba(0, 0, 0, 0.28)' }}>
                                  <i className="mdi mdi-bell-ring" style={{ color: '#ffffff', fontSize: '16px', margin: 0 }}></i>
                                </div>
                              )}
                              
                              <img src={mainImg} className="history-card-img" alt="Activity" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', background: '#e2e8f0', borderBottom: '1px solid #e5e9f0' }} />
                              
                              <div className="history-card-body" style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                <div className="activity-desc" title={h.kegiatan} style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a', marginBottom: '16px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                  {h.kegiatan}
                                </div>
                                
                                <div className="occupant-info" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px dashed #e5e9f0' }}>
                                  <img src={dispFoto} className="occupant-avatar" alt="Avatar" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #e5e9f0' }} />
                                  <div className="occupant-details" style={{ flexGrow: 1, overflow: 'hidden' }}>
                                    <h4 className="occupant-name" style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a1a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: '0 0 2px 0' }}>{dispName}</h4>
                                    <p className="occupant-nik" style={{ fontSize: '11px', color: '#888', margin: 0 }}>NIK: {h.nik_nip || '-'}</p>
                                  </div>
                                </div>
                                
                                <div className="card-footer-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                                  <div className="history-time" style={{ fontSize: '12px', fontWeight: 500, color: '#888', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <i className="mdi mdi-clock-outline" style={{ fontSize: '14px', color: '#94a3b8' }}></i> {timeDate}
                                  </div>
                                  <button className="btn-delete-card" onClick={(e) => openDelete(e, h.id_history)} title="Delete Report"
                                    style={{ background: 'transparent', color: '#d4d4d8', border: 'none', padding: '6px', borderRadius: '8px', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                                    <i className="mdi mdi-delete-outline"></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="pagination-wrapper" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                        <div className="page-info" style={{ fontSize: '0.875rem', color: '#333' }}>
                          Showing {Math.min(offset + 1, totalData)} to {Math.min(offset + limit, totalData)} of {totalData} entries
                        </div>
                        <div className="pagination-btns" style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                          {page > 1 ? (
                            <button onClick={() => setPage(page - 1)} className="paginate_button" style={{ background: 'transparent', border: '1px solid transparent', padding: '0.25rem 0.6rem', fontSize: '0.875rem', borderRadius: '4px' }}>Previous</button>
                          ) : (
                            <span className="paginate_button disabled" style={{ padding: '0.25rem 0.6rem', fontSize: '0.875rem', color: '#aaa', cursor: 'not-allowed', opacity: 0.5 }}>Previous</span>
                          )}
                          
                          <span className="paginate_button current" style={{ background: 'transparent', border: '1px solid #ddd', color: '#7b7979', borderRadius: '4px', padding: '0.25rem 0.6rem', fontSize: '0.875rem' }}>{page}</span>
                          
                          {page < totalPages ? (
                            <button onClick={() => setPage(page + 1)} className="paginate_button" style={{ background: 'transparent', border: '1px solid transparent', padding: '0.25rem 0.6rem', fontSize: '0.875rem', borderRadius: '4px' }}>Next</button>
                          ) : (
                            <span className="paginate_button disabled" style={{ padding: '0.25rem 0.6rem', fontSize: '0.875rem', color: '#aaa', cursor: 'not-allowed', opacity: 0.5 }}>Next</span>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Detail */}
      {showDetailModal && selectedHistory && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
          <div className="modal-dialog" style={{ maxWidth: '400px', marginTop: '5vh' }}>
            <div className="modal-content" style={{ border: 'none', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title font-weight-bold" style={{ color: '#1a1a1a', fontSize: '16px' }}><i className="mdi mdi-text-box-search-outline text-primary mr-2"></i>Activity Detail</h5>
                <button type="button" className="close" onClick={() => setShowDetailModal(false)} style={{ outline: 'none' }}>&times;</button>
              </div>
              <div className="modal-body p-4">
                <div className="text-center mb-3">
                  <img src={selectedHistory.history_foto || '/images/placeholder.jpg'} className="shadow-sm" alt="Activity" style={{ width: '100%', borderRadius: '8px', border: '1px solid #e5e9f0', marginBottom: 0, maxHeight: '250px', objectFit: 'cover' }} />
                </div>
                <div style={{ background: '#ffffff', border: '1px solid #e5e9f0', borderRadius: '8px', padding: '15px' }}>
                  <div className="d-flex align-items-center mb-3 pb-2" style={{ borderBottom: '1px solid #e5e9f0' }}>
                    <img src={selectedHistory.occupant_foto || '/images/admin.png'} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #d4d4d8', marginRight: '12px' }} alt="Avatar" />
                    <div>
                      <h6 className="font-weight-bold mb-1" style={{ color: '#1a1a1a', fontSize: '13px' }}>{selectedHistory.name || selectedHistory.occupant_name || 'Deleted Occupant'}</h6>
                      <p className="text-muted mb-0" style={{ fontSize: '11px' }}><i className="mdi mdi-clock-outline mr-1"></i>{new Date(selectedHistory.schedule_date).toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }).replace(',', ' •')}</p>
                    </div>
                  </div>
                  <div className="mb-2">
                    <span style={{ display: 'block', fontSize: '11px', fontWeight: 500, color: '#4B49AC', marginBottom: '4px' }}>Activity Description</span>
                    <p className="font-weight-bold" style={{ color: '#4B49AC', fontSize: '13px', marginBottom: 0 }}>{selectedHistory.kegiatan}</p>
                  </div>
                  <div className="row">
                    <div className="col-6 mb-2">
                      <span style={{ display: 'block', fontSize: '11px', fontWeight: 500, color: '#4B49AC', marginBottom: '4px' }}>NIK / NIP</span>
                      <p style={{ fontSize: '12px', color: '#1a1a1a', marginBottom: 0 }}>{selectedHistory.nik_nip || '-'}</p>
                    </div>
                    <div className="col-6 mb-2">
                      <span style={{ display: 'block', fontSize: '11px', fontWeight: 500, color: '#4B49AC', marginBottom: '4px' }}>Phone (WhatsApp)</span>
                      <p style={{ fontSize: '12px', color: '#1a1a1a', marginBottom: 0 }}>{selectedHistory.no_hp || '-'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Delete */}
      {showDeleteModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
          <div className="modal-dialog" style={{ marginTop: '10vh' }}>
            <div className="modal-content" style={{ border: 'none', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}>
              <form onSubmit={handleDelete}>
                <div className="modal-body p-4" style={{ textAlign: 'left' }}>
                  <h5 className="font-weight-bold mb-3">Delete Report</h5>
                  <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>Are you sure you want to delete this activity report?</p>
                  
                  <div className="custom-control custom-checkbox mb-4" style={{ display: 'flex', alignItems: 'center' }}>
                    <input type="checkbox" className="custom-control-input" id="deleteConfirmCheckHistory" required 
                      checked={confirmDelete} onChange={e => setConfirmDelete(e.target.checked)} />
                    <label className="custom-control-label" htmlFor="deleteConfirmCheckHistory" style={{ fontSize: '14px', color: '#1e1f23', paddingTop: '2px' }}>I understand that this report will be permanently removed</label>
                  </div>
                  
                  <div className="d-flex justify-content-end" style={{ gap: '8px' }}>
                    <button type="button" className="btn btn-light font-weight-bold" onClick={() => setShowDeleteModal(false)} style={{ padding: '8px 18px', fontSize: '13px' }}>Cancel</button>
                    <button type="submit" className="btn btn-danger font-weight-bold" disabled={!confirmDelete || isDeleting} style={{ padding: '8px 18px', fontSize: '13px' }}>
                      {isDeleting ? <><i className="mdi mdi-loading mdi-spin mr-1"></i>Deleting...</> : 'Delete'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .history-card:hover { border-color: #d1d5db !important; transform: translateY(-2px); }
        .btn-delete-card:hover { background: #fef2f2 !important; color: #ef4444 !important; }
      `}} />
    </>
  );
}
