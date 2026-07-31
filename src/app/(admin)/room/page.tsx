'use client';

import { useState, useEffect } from 'react';

export default function RoomPage() {
  const [restrictions, setRestrictions] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ id_restriction: '', day_of_week: '', time_from_h: '', time_from_m: '', time_to_h: '', time_to_m: '' });

  // Mock data to replicate PHP output
  useEffect(() => {
    // This will be replaced by Firebase fetch later
    setRestrictions([
      { id_restriction: '1', day_of_week: 'Saturday', time_from: '08:00', time_to: '17:00' },
      { id_restriction: '2', day_of_week: 'Sunday', time_from: '00:00', time_to: '23:59' },
    ]);
  }, []);

  const handleEdit = (res: any) => {
    const fromParts = res.time_from.split(':');
    const toParts = res.time_to.split(':');
    setFormData({ 
      id_restriction: res.id_restriction, 
      day_of_week: res.day_of_week, 
      time_from_h: fromParts[0], time_from_m: fromParts[1], 
      time_to_h: toParts[0], time_to_m: toParts[1] 
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setFormData({ id_restriction: '', day_of_week: '', time_from_h: '', time_from_m: '', time_to_h: '', time_to_m: '' });
    setIsEditing(false);
  };

  const handleDelete = (id: string, dayName: string) => {
    // Mock delete modal trigger
    alert(`Delete modal for ${dayName} (ID: ${id})`);
  };

  const hours = Array.from({length: 24}, (_, i) => String(i).padStart(2, '0'));
  const minutes = Array.from({length: 60}, (_, i) => String(i).padStart(2, '0'));

  return (
    <>
      <div className="content-wrapper">
        <div className="row">
          <div className="col-md-12 grid-margin">
            <div className="row">
              <div className="col-12 col-xl-8 mb-4 mb-xl-0">
                <h3 className="font-weight-bold">Room</h3>
                <h6 className="font-weight-normal mb-0">Manage room access restrictions, <span className="text-primary">Set restricted hours for the room!</span></h6>
              </div>
            </div>
          </div>
        </div>

        {/* FORM CARD */}
        <div className="row">
          <div className="col-md-12 grid-margin stretch-card">
            <div className="card" style={{ border: '1px solid #e5e9f0', boxShadow: 'none', borderRadius: '12px' }}>
              <div className="card-body" style={{ padding: '28px' }}>
                <p className="card-title mb-0">Add Restriction</p>
                <p className="text-muted mt-1 mb-4" style={{ fontSize: '12px' }}>Define the time period when the room cannot be accessed via fingerprint.</p>

                <form id="formRestriction">
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="frm-lbl" style={{ fontSize: '12px', fontWeight: 600, color: '#555', marginBottom: '3px', display: 'block' }}>Day</label>
                      <select className="form-control form-control-sm" required style={{ borderColor: '#e5e9f0', height: '38px' }}
                        value={formData.day_of_week} onChange={e => setFormData({ ...formData, day_of_week: e.target.value })}>
                        <option value="">--- Select Day ---</option>
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                        <option value="Sunday">Sunday</option>
                        <option value="Every Day">Every Day (*)</option>
                      </select>
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="frm-lbl" style={{ fontSize: '12px', fontWeight: 600, color: '#555', marginBottom: '3px', display: 'block' }}>From</label>
                      <div className="form-control form-control-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px', borderColor: '#e5e9f0', height: '38px', padding: '0 10px' }}>
                        <select required style={{ height: '28px', width: '44px', border: 'none', background: 'transparent', fontSize: '14px', fontWeight: 400, color: '#495057', textAlign: 'center', outline: 'none', appearance: 'none', padding: '0 2px' }}
                          value={formData.time_from_h} onChange={e => setFormData({ ...formData, time_from_h: e.target.value })}>
                          <option value="">--</option>
                          {hours.map(h => <option key={h} value={h}>{h}</option>)}
                        </select>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#495057', lineHeight: '28px' }}>:</span>
                        <select required style={{ height: '28px', width: '44px', border: 'none', background: 'transparent', fontSize: '14px', fontWeight: 400, color: '#495057', textAlign: 'center', outline: 'none', appearance: 'none', padding: '0 2px' }}
                          value={formData.time_from_m} onChange={e => setFormData({ ...formData, time_from_m: e.target.value })}>
                          <option value="">--</option>
                          {minutes.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="frm-lbl" style={{ fontSize: '12px', fontWeight: 600, color: '#555', marginBottom: '3px', display: 'block' }}>To</label>
                      <div className="form-control form-control-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px', borderColor: '#e5e9f0', height: '38px', padding: '0 10px' }}>
                        <select required style={{ height: '28px', width: '44px', border: 'none', background: 'transparent', fontSize: '14px', fontWeight: 400, color: '#495057', textAlign: 'center', outline: 'none', appearance: 'none', padding: '0 2px' }}
                          value={formData.time_to_h} onChange={e => setFormData({ ...formData, time_to_h: e.target.value })}>
                          <option value="">--</option>
                          {hours.map(h => <option key={h} value={h}>{h}</option>)}
                        </select>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#495057', lineHeight: '28px' }}>:</span>
                        <select required style={{ height: '28px', width: '44px', border: 'none', background: 'transparent', fontSize: '14px', fontWeight: 400, color: '#495057', textAlign: 'center', outline: 'none', appearance: 'none', padding: '0 2px' }}
                          value={formData.time_to_m} onChange={e => setFormData({ ...formData, time_to_m: e.target.value })}>
                          <option value="">--</option>
                          {minutes.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center" style={{ gap: '10px' }}>
                    <button type="button" className="btn btn-primary btn-sm" style={{ padding: '8px 20px', fontWeight: 600 }}>
                      <i className="mdi mdi-content-save mr-1"></i>Save
                    </button>
                    {isEditing && (
                      <button type="button" className="btn btn-light btn-sm" style={{ padding: '8px 20px', fontWeight: 600 }} onClick={handleCancelEdit}>
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* TABLE CARD */}
        <div className="row">
          <div className="col-md-12 grid-margin stretch-card">
            <div className="card" style={{ border: '1px solid #e5e9f0', boxShadow: 'none', borderRadius: '12px' }}>
              <div className="card-body" style={{ padding: '28px' }}>
                <p className="card-title mb-3">Restricted Hours</p>
                <div className="table-responsive">
                  <table className="table table-borderless" id="restrictionTable" style={{ borderCollapse: 'collapse', width: '100%', marginTop: '10px' }}>
                    <thead>
                      <tr>
                        <th style={{ width: '50px', borderBottom: '1px solid #e2e8f0', fontSize: '13px', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px', padding: '20px 24px' }}>No</th>
                        <th style={{ borderBottom: '1px solid #e2e8f0', fontSize: '13px', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px', padding: '20px 24px' }}>Day</th>
                        <th style={{ borderBottom: '1px solid #e2e8f0', fontSize: '13px', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px', padding: '20px 24px' }}>From</th>
                        <th style={{ borderBottom: '1px solid #e2e8f0', fontSize: '13px', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px', padding: '20px 24px' }}>To</th>
                        <th style={{ width: '180px', textAlign: 'center', borderBottom: '1px solid #e2e8f0', fontSize: '13px', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px', padding: '20px 24px' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {restrictions.length === 0 ? (
                        <tr>
                          <td colSpan={5} style={{ textAlign: 'center', padding: '30px 10px', color: '#999', fontSize: '13px' }}>
                            <i className="mdi mdi-clock-alert-outline" style={{ fontSize: '32px', display: 'block', marginBottom: '6px', color: '#ddd' }}></i>
                            No restrictions have been set yet
                          </td>
                        </tr>
                      ) : (
                        restrictions.map((row, index) => {
                          const dayLabel = row.day_of_week === 'Every Day' ? 'Every Day (*)' : row.day_of_week;
                          return (
                            <tr key={row.id_restriction} style={{ backgroundColor: index % 2 === 0 ? '#fafafa' : '#ffffff' }}>
                              <td style={{ verticalAlign: 'middle', fontWeight: 600, color: '#555', padding: '20px 24px' }}>{index + 1}</td>
                              <td style={{ verticalAlign: 'middle', padding: '20px 24px' }}>
                                <span style={{ fontWeight: 500, fontSize: '14px', color: '#212529' }}>{dayLabel}</span>
                              </td>
                              <td style={{ verticalAlign: 'middle', fontWeight: 500, padding: '20px 24px' }}>
                                <span style={{ fontFamily: "'Courier New',monospace", fontSize: '13px', color: '#4b49ac', fontWeight: 'bold' }}>{row.time_from.substring(0, 5)}</span>
                              </td>
                              <td style={{ verticalAlign: 'middle', fontWeight: 500, padding: '20px 24px' }}>
                                <span style={{ fontFamily: "'Courier New',monospace", fontSize: '13px', color: '#4b49ac', fontWeight: 'bold' }}>{row.time_to.substring(0, 5)}</span>
                              </td>
                              <td style={{ verticalAlign: 'middle', textAlign: 'center', padding: '20px 24px' }}>
                                <button className="btn-edit-action" title="Edit" onClick={() => handleEdit(row)} style={{ fontSize: '13px', fontWeight: 500, color: '#333', background: '#fff', border: '1px solid #d4d4d8', borderRadius: '6px', padding: '6px 16px', cursor: 'pointer', transition: 'all .15s', display: 'inline-flex', alignItems: 'center', lineHeight: 1 }}>
                                  <i className="mdi mdi-pencil mr-1"></i>Edit
                                </button>
                                <button className="btn-delete-action ml-2" title="Delete" onClick={() => handleDelete(row.id_restriction, row.day_of_week)} style={{ fontSize: '13px', fontWeight: 500, color: '#fff', background: '#ff4747', border: '1px solid #ff4747', borderRadius: '6px', padding: '6px 16px', cursor: 'pointer', transition: 'all .15s', display: 'inline-flex', alignItems: 'center', lineHeight: 1 }}>
                                  <i className="mdi mdi-delete"></i>
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
