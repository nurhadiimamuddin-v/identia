'use client';

import { useState, useEffect } from 'react';

export default function AccountPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ id_account: '', name: '', username: '', password: '' });
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Mock data to replicate PHP output
  useEffect(() => {
    // This will be replaced by Firebase fetch later
    setAccounts([
      { id_account: '1', name: 'Admin', username: 'admin' },
      { id_account: '2', name: 'User 1', username: 'user1' },
    ]);
  }, []);

  const handleEdit = (acc: any) => {
    setFormData({ id_account: acc.id_account, name: acc.name, username: acc.username, password: '' });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setFormData({ id_account: '', name: '', username: '', password: '' });
    setIsEditing(false);
  };

  const handleDelete = (id: string) => {
    // Mock delete modal trigger
    alert('Delete modal for ID: ' + id);
  };

  return (
    <>
      <div className="content-wrapper">
        <div className="row">
          <div className="col-md-12 grid-margin">
            <div className="row">
              <div className="col-12 col-xl-8 mb-4 mb-xl-0">
                <h3 className="font-weight-bold">Account Operations</h3>
                <h6 className="font-weight-normal mb-0">Manage operational account data, <span className="text-primary">Managing active accounts!</span></h6>
              </div>
            </div>
          </div>
        </div>

        {/* FORM CARD */}
        <div className="row">
          <div className="col-md-12 grid-margin stretch-card">
            <div className="card" style={{ border: '1px solid #e5e9f0', boxShadow: 'none', borderRadius: '12px' }}>
              <div className="card-body" style={{ padding: '28px' }}>
                <p className="card-title mb-0">{isEditing ? 'Edit Account' : 'Add Account'}</p>
                <p className="text-muted mt-1 mb-4" style={{ fontSize: '12px' }}>
                  {isEditing ? `Update details for ${formData.name}` : 'Create a new account.'}
                </p>

                <form id="formAccount">
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="frm-lbl">Name</label>
                      <input type="text" className="form-control form-control-sm" required style={{ borderColor: '#e5e9f0', height: '38px' }}
                        value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="frm-lbl">Username</label>
                      <input type="text" className="form-control form-control-sm" required style={{ borderColor: '#e5e9f0', height: '38px' }}
                        value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="frm-lbl">Password</label>
                      <div className="input-group">
                        <input type={passwordVisible ? "text" : "password"} className="form-control form-control-sm" style={{ borderColor: '#e5e9f0', height: '38px' }}
                          value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required={!isEditing} disabled={isEditing} />
                        <div className="input-group-append">
                          <span className="input-group-text bg-white" onClick={() => setPasswordVisible(!passwordVisible)} style={{ cursor: 'pointer', borderRadius: '0 4px 4px 0', border: '1px solid #e5e9f0', borderLeft: 'none', height: '38px', display: 'flex', alignItems: 'center', padding: '0 12px' }}>
                            <i className={`mdi ${passwordVisible ? 'mdi-eye' : 'mdi-eye-off'} text-muted`}></i>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row mt-2">
                    <div className="col-md-12 text-right">
                      {isEditing && (
                        <button type="button" className="btn btn-light btn-sm mr-2" style={{ fontWeight: 'bold', borderRadius: '6px' }} onClick={handleCancelEdit}>Cancel Edit</button>
                      )}
                      <button type="button" className="btn btn-primary btn-sm" style={{ fontWeight: 'bold', borderRadius: '6px', padding: '8px 16px' }}><i className="mdi mdi-content-save mr-1"></i>Save</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* TABLE CARD */}
        <div className="row">
          <div className="col-md-12 grid-margin stretch-card">
            <div className="card" style={{ border: '1px solid #e2e8f0', borderRadius: '10px' }}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <p className="card-title mb-0">Data Account</p>
                  <div>
                    <button className={`btn btn-sm ${isSelectMode ? 'btn-light' : 'btn-outline-secondary'}`} onClick={() => setIsSelectMode(!isSelectMode)} style={{ fontWeight: 'bold', borderRadius: '6px', padding: '6px 10px', fontSize: '16px' }}>
                      <i className={`mdi ${isSelectMode ? 'mdi-close' : 'mdi-checkbox-multiple-marked-outline'}`}></i>
                    </button>
                    {isSelectMode && (
                      <button className="btn btn-sm btn-danger ml-2" style={{ fontWeight: 'bold', borderRadius: '6px', padding: '6px 10px', fontSize: '16px' }}>
                        <i className="mdi mdi-delete"></i>
                      </button>
                    )}
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="table table-borderless" id="myTable">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Name</th>
                        <th>Username</th>
                        <th style={{ width: '80px', textAlign: 'center' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {accounts.map((row, index) => (
                        <tr key={row.id_account} className={index % 2 === 0 ? 'row-odd' : 'row-even'}>
                          <td style={{ verticalAlign: 'middle', fontWeight: 600, color: '#555' }}>
                            <span style={{ position: 'relative', display: 'inline-block' }}>{index + 1}</span>
                          </td>
                          <td style={{ verticalAlign: 'middle' }}>
                            <span style={{ fontWeight: 500, fontSize: '14px', color: '#212529', display: 'inline-flex', alignItems: 'center' }}>{row.name}</span>
                          </td>
                          <td style={{ verticalAlign: 'middle', fontSize: '13px', color: '#495057' }}>
                            {row.username || '-'}
                          </td>
                          <td style={{ verticalAlign: 'middle', textAlign: 'center', whiteSpace: 'nowrap' }}>
                            <div className="d-flex align-items-center justify-content-center">
                              {!isSelectMode ? (
                                <div className="dropdown btn-row-delete">
                                  <button className="btn btn-sm dropdown-dots-btn" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{ padding: '4px 8px' }}>
                                    <i className="mdi mdi-dots-vertical"></i>
                                  </button>
                                  <div className="dropdown-menu dropdown-menu-right" style={{ borderRadius: '5px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', border: '1px solid #f1f2f4', minWidth: '150px', padding: 0, overflow: 'hidden' }}>
                                    <button className="dropdown-item d-flex align-items-center py-3 px-4 btn-custom-dropdown" type="button" onClick={() => handleEdit(row)}>
                                      <span style={{ fontSize: '14px', fontWeight: 400, color: '#1f2125' }}>Edit Data</span>
                                    </button>
                                    <button className="dropdown-item d-flex align-items-center py-3 px-4 btn-custom-dropdown" type="button" onClick={() => handleDelete(row.id_account)}>
                                      <span style={{ fontSize: '14px', fontWeight: 400, color: '#ff4d4f' }}>Delete</span>
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <input type="checkbox" className="bulk-cb" value={row.id_account} style={{ transform: 'scale(1.5)', cursor: 'pointer', marginLeft: '10px', marginTop: 0 }} />
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .dropdown-dots-btn { background: transparent !important; border: none !important; box-shadow: none !important; }
        .dropdown-dots-btn:hover, .dropdown-dots-btn:focus, .dropdown-dots-btn:active { background: transparent !important; border: none !important; box-shadow: none !important; outline: none !important; }
        .dropdown-dots-btn i { font-size: 28px; color: #495057; }
        #myTable thead th { border-bottom: 1px solid #e2e8f0 !important; }
        #myTable tbody tr td { border-bottom: none !important; }
        .frm-lbl { font-size: 12px; font-weight: 600; color: #555; margin-bottom: 3px; }
        .btn-custom-dropdown:hover, .btn-custom-dropdown:focus { background-color: #ededed !important; }
        .row-highlight { background-color: #f1f5f9 !important; }
      `}} />
    </>
  );
}
