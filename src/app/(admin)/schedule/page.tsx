'use client';

import { useState, useEffect } from 'react';

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activities, setActivities] = useState<any[]>([]);
  const [eventsByDate, setEventsByDate] = useState<Record<string, any[]>>({});
  
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [selectedDateEvents, setSelectedDateEvents] = useState<{ dateStr: string, events: any[], title: string, color: string }>({ dateStr: '', events: [], title: '', color: '' });

  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const dayNames = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
  const allColors = ['#4B49AC','#10b981','#f59e0b','#ec4899','#0891b2','#8b5cf6','#ef4444','#4b7bec',
                     '#059669','#d946ef','#0d9488','#e11d48','#7c3aed','#ca8a04','#2563eb','#dc2626',
                     '#16a34a','#9333ea','#0284c7','#c026d3','#ea580c','#4f46e5','#15803d','#be123c',
                     '#6d28d9','#b45309','#0369a1','#a21caf','#c2410c','#4338ca','#047857','#9f1239'];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-11
  
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startWeekday = firstDay.getDay();
  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    // Mock fetch events for this month/year
    const m = month + 1;
    const y = year;
    const mockEvents = [
      { id_schedule: '1', date: `${y}-${String(m).padStart(2,'0')}-05 10:00:00`, kegiatan: 'Meeting IoT Team' },
      { id_schedule: '2', date: `${y}-${String(m).padStart(2,'0')}-05 14:00:00`, kegiatan: 'Server Maintenance' },
      { id_schedule: '3', date: `${y}-${String(m).padStart(2,'0')}-12 09:00:00`, kegiatan: 'Weekly Sync' },
      { id_schedule: '4', date: `${y}-${String(m).padStart(2,'0')}-20 13:30:00`, kegiatan: 'Client Presentation' },
    ];
    setActivities(mockEvents);
    
    const byDate: Record<string, any[]> = {};
    mockEvents.forEach(ev => {
      const d = ev.date.substring(0, 10);
      if(!byDate[d]) byDate[d] = [];
      byDate[d].push(ev);
    });
    setEventsByDate(byDate);
  }, [month, year]);

  const dateColors: Record<string, string> = {};
  let ci = 0;
  Object.keys(eventsByDate).forEach(dateKey => {
    dateColors[dateKey] = allColors[ci % allColors.length];
    ci++;
  });

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(year, month + offset, 1));
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentDate(new Date(year, parseInt(e.target.value), 1));
  };
  
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentDate(new Date(parseInt(e.target.value), month, 1));
  };

  const openDateModal = (ds: string) => {
    const parts = ds.split('-');
    const d = new Date(parseInt(parts[0]), parseInt(parts[1])-1, parseInt(parts[2]));
    const title = `${['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][d.getDay()]}, ${parseInt(parts[2])} ${monthNames[d.getMonth()]} ${parts[0]}`;
    
    setSelectedDateEvents({
      dateStr: ds,
      events: eventsByDate[ds] || [],
      title: title,
      color: dateColors[ds] || '#4B49AC'
    });
    setShowDateModal(true);
  };

  const hexToRgba = (hex: string, a: number) => {
    const r = parseInt(hex.substring(1,3), 16);
    const g = parseInt(hex.substring(3,5), 16);
    const b = parseInt(hex.substring(5,7), 16);
    return `rgba(${r},${g},${b},${a})`;
  };

  const renderGridCells = () => {
    const cells = [];
    // Empty cells before start
    for (let i = 0; i < startWeekday; i++) {
      cells.push(<div key={`empty-start-${i}`} className="bcc empty"></div>);
    }
    
    // Days
    for (let d = 1; d <= daysInMonth; d++) {
      const ds = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isT = ds === todayStr;
      const wd = (startWeekday + d - 1) % 7;
      let cls = 'bcc';
      if (isT) cls += ' today';
      if (wd === 0) cls += ' sun';
      
      const evData = eventsByDate[ds] || [];
      const dateColor = dateColors[ds] || '#4B49AC';
      
      cells.push(
        <div key={`day-${d}`} className={cls} onClick={() => openDateModal(ds)}>
          <div className={`bcn ${isT ? 'tn' : ''}`}>{d}</div>
          {evData.slice(0, 3).map((evt, idx) => (
            <div key={`evt-${idx}`} className="bce" style={{ background: hexToRgba(dateColor, 0.12), color: dateColor, borderLeft: `3px solid ${dateColor}` }}>
              {evt.kegiatan}
            </div>
          ))}
          {evData.length > 3 && <div className="bcm">+{evData.length - 3} more</div>}
        </div>
      );
    }
    
    // Empty cells after end
    const total = startWeekday + daysInMonth;
    const rem = (7 - (total % 7)) % 7;
    for (let i = 0; i < rem; i++) {
      cells.push(<div key={`empty-end-${i}`} className="bcc empty"></div>);
    }
    
    return cells;
  };

  const renderMiniGrid = () => {
    const cells = [];
    ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(dn => {
      cells.push(<div key={`mh-${dn}`} className="mcgh">{dn}</div>);
    });
    
    for (let i = 0; i < startWeekday; i++) {
      cells.push(<div key={`me-${i}`} className="mcd empty"></div>);
    }
    
    for (let d = 1; d <= daysInMonth; d++) {
      const ds = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isT = ds === todayStr;
      const hasEv = !!eventsByDate[ds];
      const wd = (startWeekday + d - 1) % 7;
      let cls = 'mcd';
      if (isT) cls += ' today';
      if (hasEv) cls += ' hev';
      if (wd === 0) cls += ' sun';
      
      cells.push(<div key={`md-${d}`} className={cls}>{d}</div>);
    }
    return cells;
  };

  return (
    <>
      <div className="content-wrapper">
        <div className="row">
          <div className="col-md-12 grid-margin">
            <div className="row">
              <div className="col-12 col-xl-8 mb-4 mb-xl-0">
                <h3 className="font-weight-bold">Schedule</h3>
                <h6 className="font-weight-normal mb-0">Activity schedule and upcoming agenda, <span className="text-primary">View all schedules here!</span></h6>
              </div>
              <div className="col-12 col-xl-4">
                <div className="justify-content-end d-flex flex-wrap" style={{ gap: '15px', alignItems: 'center' }}>
                  <button type="button" className="btn btn-primary" onClick={() => setShowExportModal(true)}>
                    <i className="mdi mdi-file-export mr-1"></i> Export Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12 grid-margin stretch-card">
            <div className="card" style={{ border: '1px solid #e5e9f0', boxShadow: 'none', borderRadius: '12px' }}>
              <div className="card-body" style={{ padding: '24px' }}>
                <div className="sch-layout">
                  {/* LEFT */}
                  <div className="sch-sidebar">
                    <div className="mini-cal-hdr">
                      <button onClick={() => changeMonth(-1)} className="mcn bg-transparent"><i className="mdi mdi-chevron-left"></i></button>
                      <span className="mct">{monthNames[month]} {year}</span>
                      <button onClick={() => changeMonth(1)} className="mcn bg-transparent"><i className="mdi mdi-chevron-right"></i></button>
                    </div>
                    <div className="mcg">
                      {renderMiniGrid()}
                    </div>

                    <hr style={{ margin: '18px 0', borderColor: '#f0f0f0' }} />

                    <p className="card-title mb-3" style={{ fontSize: '14px' }}><i className="mdi mdi-format-list-checks mr-1 text-primary"></i>Activities for {monthNames[month]}</p>
                    <div className="al">
                      {activities.length === 0 ? (
                        <div style={{ textAlign: 'center', color: '#999', padding: '30px 10px', fontSize: '13px' }}>
                          <i className="mdi mdi-calendar-blank" style={{ fontSize: '32px', display: 'block', marginBottom: '6px', color: '#ddd' }}></i>No activities yet
                        </div>
                      ) : (
                        activities.map(ev => {
                          const dt = new Date(ev.date.replace(' ', 'T')); // Handle mock date format safely
                          const dateKey = ev.date.substring(0, 10);
                          const isToday = dateKey === todayStr;
                          const color = dateColors[dateKey] || '#4B49AC';
                          const jam = ev.date.substring(11, 16);
                          
                          return (
                            <div key={ev.id_schedule} className="ali">
                              <div className="ald" style={{ background: color }}></div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div className="aldt">
                                  {isToday && <span style={{ color: '#4B49AC', fontWeight: 700 }}>Today · </span>}
                                  {dt.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} · <span style={{ color: '#bbb' }}>{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][dt.getDay()]}</span>
                                </div>
                                <div className="altx">{ev.kegiatan} <span style={{ color: '#999', fontWeight: 400, fontSize: '10px' }}>({jam})</span></div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  <div className="sch-divider"></div>

                  {/* RIGHT */}
                  <div className="sch-main">
                    <div className="bch">
                      <div style={{ fontSize: '18px', fontWeight: 700, color: '#1a1a1a' }}>
                        <i className="mdi mdi-calendar-month mr-1 text-primary"></i>{monthNames[month]} {year}
                      </div>
                      <div className="bcs">
                        <button onClick={() => changeMonth(-1)} className="bca bg-transparent"><i className="mdi mdi-chevron-left"></i></button>
                        <select className="bsel" value={month} onChange={handleMonthChange}>
                          {monthNames.map((m, i) => <option key={i} value={i}>{m}</option>)}
                        </select>
                        <select className="bsel" value={year} onChange={handleYearChange}>
                          {Array.from({length: 11}, (_, i) => year - 5 + i).map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                        <button onClick={() => changeMonth(1)} className="bca bg-transparent"><i className="mdi mdi-chevron-right"></i></button>
                      </div>
                    </div>

                    <div className="bcg">
                      {dayNames.map(dh => <div key={`dh-${dh}`} className="bcdh">{dh}</div>)}
                      {renderGridCells()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Date Modal */}
      {showDateModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content" style={{ border: 'none', borderRadius: '6px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}>
              <div className="modal-header py-2">
                <h6 className="modal-title font-weight-bold"><i className="mdi mdi-calendar-today mr-1 text-primary"></i> <span>{selectedDateEvents.title}</span></h6>
                <button type="button" className="close" onClick={() => setShowDateModal(false)}>&times;</button>
              </div>
              <div className="modal-body" style={{ padding: '16px 20px' }}>
                {selectedDateEvents.events.length === 0 ? (
                  <div className="meve" style={{ textAlign: 'center', padding: '30px 10px', color: '#999', fontSize: '13px' }}>
                    <i className="mdi mdi-calendar-blank" style={{ fontSize: '32px', display: 'block', marginBottom: '6px', color: '#ddd' }}></i>No activities on this date
                  </div>
                ) : (
                  selectedDateEvents.events.map(ev => {
                    const jam = ev.date.length >= 16 ? ev.date.substring(11, 16) : '00:00';
                    return (
                      <div key={ev.id_schedule} className="mevi" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px 14px', background: '#f8fafc', borderRadius: '8px', marginBottom: '8px', borderLeft: `3px solid ${selectedDateEvents.color}` }}>
                        <div className="mevic" style={{ width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '16px', background: hexToRgba(selectedDateEvents.color, 0.1), color: selectedDateEvents.color }}>
                          <i className="mdi mdi-clock-outline"></i>
                        </div>
                        <div>
                          <div className="mevt" style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a' }}>{ev.kegiatan}</div>
                          <div className="mevtm" style={{ fontSize: '11px', color: '#666', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <i className="mdi mdi-clock-outline"></i> {jam} &nbsp;·&nbsp; <i className="mdi mdi-calendar"></i> {selectedDateEvents.title}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content" style={{ border: 'none', borderRadius: '6px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}>
              <div className="modal-header py-2">
                <h6 className="modal-title font-weight-bold"><i className="mdi mdi-file-export mr-1 text-primary"></i> Export Schedule Data</h6>
                <button type="button" className="close" onClick={() => setShowExportModal(false)}>&times;</button>
              </div>
              <div className="modal-body" style={{ padding: '16px 20px' }}>
                <form action="/api/export_schedule" method="GET" target="_blank" onSubmit={() => setTimeout(() => setShowExportModal(false), 500)}>
                  <div className="form-group">
                    <label className="font-weight-bold">Month</label>
                    <select className="form-control" name="start_month">
                      {monthNames.map((m, i) => <option key={i} value={i+1}>{m}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="font-weight-bold">Until Month (Optional)</label>
                    <select className="form-control" name="end_month">
                      <option value="">-- Leave blank / Only 1 Month --</option>
                      {monthNames.map((m, i) => <option key={i} value={i+1}>{m}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="font-weight-bold">Year</label>
                    <select className="form-control" name="year" defaultValue={year}>
                      {Array.from({length: 11}, (_, i) => year - 5 + i).map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="font-weight-bold">File Format</label>
                    <select className="form-control" name="format">
                      <option value="excel">Excel</option>
                      <option value="pdf">PDF</option>
                    </select>
                  </div>
                  <div className="text-right mt-4">
                    <button type="submit" className="btn btn-primary"> Download</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .sch-layout{display:flex;gap:0;align-items:stretch;min-height:500px}
        .sch-sidebar{width:240px;flex-shrink:0;padding-right:20px}
        .sch-divider{width:1px;background:#e5e9f0;flex-shrink:0}
        .sch-main{flex:1;padding-left:24px;min-width:0;overflow:hidden;display:flex;flex-direction:column}
        @media(max-width:992px){.sch-layout{flex-direction:column}.sch-sidebar{width:100%;padding-right:0;padding-bottom:16px}.sch-divider{width:100%;height:1px;margin:8px 0}.sch-main{padding-left:0}}
        @media(max-width:576px){.bcc{min-height:50px;padding:4px}.bce{font-size:7px;padding:1px 2px}.bcm{font-size:7px}.bcn{font-size:10px}.bcdh{font-size:8px;padding:6px 2px}.bch{flex-direction:column;align-items:flex-start}}

        .mini-cal-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
        .mct{font-size:13px;font-weight:700;color:#1a1a1a}
        .mcn{width:26px;height:26px;border-radius:6px;border:1px solid #e5e9f0;display:flex;align-items:center;justify-content:center;color:#666;text-decoration:none;font-size:14px;transition:.2s; cursor:pointer}
        .mcn:hover{background:#f0f4ff;color:#4B49AC;text-decoration:none}
        .mcg{display:grid;grid-template-columns:repeat(7,1fr);gap:1px;text-align:center}
        .mcgh{font-size:9px;font-weight:700;color:#999;padding:4px 0;text-transform:uppercase}
        .mcd{font-size:11px;color:#333;padding:5px 0;border-radius:6px;font-weight:500;position:relative}
        .mcd.empty{visibility:hidden}.mcd.sun{color:#ef4444}
        .mcd.today{background:#4B49AC;color:#fff;font-weight:700;border-radius:50%}
        .mcd.hev::after{content:'';position:absolute;bottom:1px;left:50%;transform:translateX(-50%);width:4px;height:4px;border-radius:50%;background:#4B49AC}
        .mcd.today.hev::after{background:#fff}

        .al{max-height:340px;overflow-y:auto}
        .ali{display:flex;gap:10px;padding:10px 0;border-bottom:1px solid #f5f5f5;align-items:flex-start}
        .ali:last-child{border-bottom:none}
        .ald{width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:5px}
        .aldt{font-size:10px;color:#666;font-weight:500;margin-bottom:1px}
        .altx{font-size:12px;font-weight:600;color:#1a1a1a;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

        .bch{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;flex-wrap:wrap;gap:8px}
        .bcs{display:flex;align-items:center;gap:6px}
        .bsel{border:1px solid #e5e9f0;border-radius:6px;padding:5px 10px;font-size:11px;font-weight:600;color:#333;background:#fff;cursor:pointer;outline:none}
        .bsel:focus{border-color:#4B49AC}
        .bca{width:30px;height:30px;border-radius:6px;border:1px solid #e5e9f0;display:flex;align-items:center;justify-content:center;color:#666;text-decoration:none;font-size:16px;transition:.2s; cursor:pointer}
        .bca:hover{background:#f0f4ff;color:#4B49AC;text-decoration:none}

        .bcg{display:grid;grid-template-columns:repeat(7,1fr);gap:1px;background:#e5e9f0;border:1px solid #e5e9f0;border-radius:10px;overflow:hidden;flex:1}
        .bcdh{background:#fafbfc;padding:10px 4px;text-align:center;font-size:10px;font-weight:700;color:#555;text-transform:uppercase;letter-spacing:.5px}
        .bcc{background:#fff;min-height:100px;padding:6px;transition:background .15s;cursor:pointer;overflow:hidden}
        .bcc:hover{background:#f8faff}
        .bcc.empty{background:#fafbfc;pointer-events:none}
        .bcc.today{background:#eff6ff}
        .bcc.sun .bcn{color:#ef4444}
        .bcn{font-size:12px;font-weight:700;color:#333;margin-bottom:4px}
        .tn{background:#4B49AC;color:#fff!important;width:24px;height:24px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:11px}
        .bce{font-size:9px;padding:2px 4px;border-radius:3px;margin-bottom:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600;max-width:100%}
        .bcm{font-size:9px;color:#999;padding:0 4px;font-weight:500}
      `}} />
    </>
  );
}
