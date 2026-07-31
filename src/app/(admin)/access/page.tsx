'use client';

import { useState, useEffect } from 'react';

export default function AccessPage() {
  const [occupants, setOccupants] = useState<any[]>([]);
  const [doorState, setDoorState] = useState<'locked' | 'unlocked'>('locked');
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showDoorModal, setShowDoorModal] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [welcomeName, setWelcomeName] = useState('');
  
  // Track original values for the select dropdowns
  const [originalAccessValues, setOriginalAccessValues] = useState<Record<string, string>>({});
  const [currentAccessValues, setCurrentAccessValues] = useState<Record<string, string>>({});

  useEffect(() => {
    // Mock fetching occupants
    const mockOccupants = [
      { id_occupant: '1', name: 'John Doe', access: 'active', nik_nip: '123', no_hp: '123', pin: '123', foto: 'f.jpg', finger_id: '1', code_register: '123', progress: 'used', status: 'approved' },
      { id_occupant: '2', name: 'Jane Smith', access: 'pending', nik_nip: '124', no_hp: '124', pin: '124', foto: 'f.jpg', finger_id: '-', code_register: '124', progress: 'used', status: 'approved' },
    ];
    setOccupants(mockOccupants);
    
    const initialVals: Record<string, string> = {};
    mockOccupants.forEach(o => { initialVals[o.id_occupant] = o.access; });
    setOriginalAccessValues(initialVals);
    setCurrentAccessValues(initialVals);

    // Mock polling
    const interval = setInterval(() => {
      // In a real implementation this would fetch door status from Firebase
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleAccessChange = (id: string, value: string) => {
    setCurrentAccessValues(prev => ({ ...prev, [id]: value }));
  };

  const saveAccessChange = (id: string) => {
    const value = currentAccessValues[id];
    // Mock save
    setTimeout(() => {
      setOriginalAccessValues(prev => ({ ...prev, [id]: value }));
      alert(`Access for occupant ${id} updated to ${value}`);
    }, 500);
  };

  const handleOpenDoorClick = () => {
    if (doorState === 'unlocked') {
      // Lock door
      setDoorState('locked');
      setShowDoorModal(false);
      alert('Door locked successfully!');
    } else {
      setShowVerifyModal(true);
    }
  };

  const confirmUnlock = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setShowVerifyModal(false);
      setDoorState('unlocked');
      setWelcomeName('Admin');
      setShowDoorModal(true);
    }, 800);
  };

  return (
    <>
      <div className="content-wrapper">
        <div className="row">
          <div className="col-md-12 grid-margin">
            <div className="row">
              <div className="col-12 col-xl-8 mb-4 mb-xl-0">
                <h3 className="font-weight-bold">Access Control</h3>
                <h6 className="font-weight-normal mb-0">Manage occupant access and IoT door, <span className="text-primary">Manage access & door!</span></h6>
              </div>
            </div>
          </div>
        </div>
        
        <div className="row">
          {/* Tabel Occupant */}
          <div className="col-md-8 grid-margin">
            <div className="card" style={{ border: '1px solid #e2e8f0', borderRadius: '10px' }}>
              <div className="card-body">
                <p className="card-title mb-0">Data Access Occupant</p>
                <br />
                <div className="table-responsive">
                  <table className="table table-borderless" id="myTable" style={{ borderSpacing: '0 12px', borderCollapse: 'separate' }}>
                    <thead>
                      <tr>
                        <th style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>No</th>
                        <th style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>Name</th>
                        <th style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>Access</th>
                        <th style={{ width: '60px', textAlign: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>Action</th>
                      </tr>  
                    </thead>
                    <tbody>
                      {occupants.map((row, index) => {
                        const isVerified = row.name && row.nik_nip && row.no_hp && row.pin && row.foto && row.finger_id && row.finger_id !== '-' && row.code_register && row.progress === 'used' && row.status === 'approved' && row.access === 'active';
                        const hasChanged = currentAccessValues[row.id_occupant] !== originalAccessValues[row.id_occupant];
                        return (
                          <tr key={row.id_occupant} style={{ backgroundColor: index % 2 === 0 ? '#fafafa' : '#ffffff' }}>
                            <td style={{ verticalAlign: 'middle', fontWeight: 600, color: '#555', paddingTop: '6px', paddingBottom: '6px' }}>{index + 1}</td>
                            <td style={{ verticalAlign: 'middle', paddingTop: '6px', paddingBottom: '6px' }}>
                              <div className="d-flex align-items-center">
                                <span style={{ fontWeight: 500, fontSize: '14px', color: '#212529', display: 'inline-flex', alignItems: 'center' }}>
                                  {row.name}
                                  {isVerified && <i className="mdi mdi-check-decagram" style={{ color: '#1da1f2', fontSize: '16px', marginLeft: '4px' }} title="Verified Approved"></i>}
                                </span>
                              </div>
                            </td>
                            <td style={{ verticalAlign: 'middle', paddingTop: '6px', paddingBottom: '6px' }}>
                              <select className="form-control form-control-sm" style={{ borderRadius: '6px', width: '120px', height: '35px', padding: '2px 10px', fontSize: '13px' }}
                                value={currentAccessValues[row.id_occupant] || row.access} onChange={(e) => handleAccessChange(row.id_occupant, e.target.value)}>
                                <option value="active">Active</option>
                                <option value="pending">Pending</option>
                                <option value="suspend">Suspend</option>
                              </select>
                            </td>
                            <td style={{ verticalAlign: 'middle', textAlign: 'center', paddingTop: '6px', paddingBottom: '6px' }}>
                              <button className={`btn btn-sm text-white ${hasChanged ? 'btn-success' : 'btn-secondary'}`} 
                                disabled={!hasChanged} onClick={() => saveAccessChange(row.id_occupant)}
                                style={{ borderRadius: '6px', fontWeight: 'bold', width: '32px', padding: '4px 0', fontSize: '14px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                <i className="mdi mdi-check"></i>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* IoT Door Control */}
          <div className="col-md-4 grid-margin">
            <div className="card iot-card" style={{ border: '1px solid #e2e8f0', borderRadius: '10px', background: 'linear-gradient(145deg, #ffffff, #ffffffff)', position: 'relative', overflow: 'hidden' }}>
              <div className="card-body d-flex flex-column align-items-center text-center py-4" style={{ zIndex: 1 }}>
                <div style={{ background: '#4b49ac', borderRadius: '20px', padding: '6px 16px', marginBottom: '24px' }}>
                  <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '11px', letterSpacing: '1px' }}>SMART LOCK SYSTEM</span>
                </div>

                <div className="door-illustration mb-3 mt-2" style={{ position: 'relative' }}>
                  <div className="door-frame" style={{ width: '120px', height: '150px', border: '4px solid #e2e8f0', borderBottom: 'none', borderRadius: '8px 8px 0 0', margin: '0 auto', position: 'relative', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <i className={`mdi ${doorState === 'unlocked' ? 'mdi-door-open' : 'mdi-door-closed'} text-primary`} style={{ fontSize: '100px', color: '#4b49ac', transition: 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), color 0.3s', lineHeight: 1 }}></i>
                  </div>
                  <div style={{ width: '140px', height: '4px', background: '#cbd5e1', margin: '0 auto', borderRadius: '2px' }}></div>
                </div>
                
                <p className="text-muted px-2" style={{ fontSize: '13px', lineHeight: 1.4, marginBottom: '15px' }}>Confirmation is required to unlock the IoT door access.</p>

                <button className={`btn btn-lg mt-auto w-100 ${doorState === 'unlocked' ? 'btn-danger' : 'btn-primary'}`} onClick={handleOpenDoorClick} style={{ borderRadius: '10px', fontWeight: 700, fontSize: '14px', letterSpacing: '1px', padding: '12px', transition: 'all 0.2s', position: 'relative', overflow: 'hidden', boxShadow: 'none' }}>
                  <span className="btn-text d-flex align-items-center justify-content-center" style={{ position: 'relative', zIndex: 2 }}>
                    <i className={`mdi ${doorState === 'unlocked' ? 'mdi-lock' : 'mdi-key'} mr-2`} style={{ fontSize: '20px' }}></i> 
                    {doorState === 'unlocked' ? 'LOCK DOOR' : 'UNLOCK DOOR'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: CONFIRM UNLOCK */}
      {showVerifyModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
          <div className="modal-dialog modal-sm" style={{ marginTop: '10vh' }}>
            <div className="modal-content" style={{ border: 'none', borderRadius: '6px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}>
              <div className="modal-header">
                <h6 className="modal-title font-weight-bold"><i className="mdi mdi-door-open mr-1 text-primary"></i> Confirm Unlock</h6>
                <button type="button" className="close" onClick={() => setShowVerifyModal(false)}>&times;</button>
              </div>
              <div className="modal-body text-center">
                <i className="mdi mdi-shield-check-outline" style={{ fontSize: '40px', color: '#10b981' }}></i>
                <p className="mt-2 mb-3" style={{ fontSize: '13px', color: '#666' }}>Are you sure you want to unlock the door?</p>
                <div className="d-flex justify-content-between mt-4">
                  <button type="button" className="btn btn-light btn-sm" onClick={() => setShowVerifyModal(false)} style={{ width: '48%' }}>No</button>
                  <button type="button" className="btn btn-primary btn-sm" onClick={confirmUnlock} disabled={isVerifying} style={{ width: '48%' }}>
                    {isVerifying ? <><i className="mdi mdi-loading mdi-spin mr-1"></i> Unlocking</> : <><i className="mdi mdi-check mr-1"></i>Yes</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DOOR UNLOCKED */}
      {showDoorModal && (
        <div className="fp-modal-overlay" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(4px)', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
          <div className="fp-modal-content" style={{ background: '#ffffff', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', borderRadius: '12px', padding: '30px 24px', textAlign: 'center', color: '#333', maxWidth: '320px', width: '90%' }}>
            <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)' }}>
              <i className="mdi mdi-door-open" style={{ fontSize: '44px', color: '#fff' }}></i>
            </div>
            <div style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px', color: '#10b981' }}>Door Unlocked</div>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '20px', lineHeight: 1.5 }}>
              <span>Welcome, {welcomeName}! </span>The door has been successfully unlocked.<br />Remember to lock the door when you're done.
            </div>
            <button type="button" onClick={() => { setDoorState('locked'); setShowDoorModal(false); }} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', width: '100%', padding: '10px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
              <i className="mdi mdi-lock"></i> Lock Door
            </button>
          </div>
        </div>
      )}
    </>
  );
}
