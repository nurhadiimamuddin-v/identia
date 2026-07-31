'use client';

import Link from 'next/link';

export default function DashboardSidebar() {
  return (
    <nav className="sidebar sidebar-offcanvas" id="sidebar">
      <ul className="nav">
        <li className="nav-item">
          <Link className="nav-link" href="/dashboard">
            <i className="icon-grid menu-icon"></i>
            <span className="menu-title">Dashboard</span>
          </Link>
        </li>
        <li className="nav-item">
          <a className="nav-link" data-toggle="collapse" href="#occupant-menu" aria-expanded="false" aria-controls="occupant-menu">
            <i className="icon-layout menu-icon"></i>
            <span className="menu-title">Occupant</span>
            <i className="menu-arrow"></i>
          </a>
          <div className="collapse" id="occupant-menu">
            <ul className="nav flex-column sub-menu">
              <li className="nav-item"> <Link className="nav-link" href="/occupant/new"> New </Link></li>
              <li className="nav-item"> <Link className="nav-link" href="/occupant/manage"> Manage </Link></li>
            </ul>
          </div>
        </li>
        <li className="nav-item">
          <Link className="nav-link" href="/access">
            <i className="icon-toggle menu-icon"></i>
            <span className="menu-title">Access</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" href="/room">
            <i className="ti-home menu-icon"></i>
            <span className="menu-title">Room</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" href="/account">
            <i className="icon-head menu-icon"></i>
            <span className="menu-title">Account</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" href="/history">
            <i className="icon-paper menu-icon"></i>
            <span className="menu-title">History</span>
            {/* 
              Badge Placeholder
              <span className="badge ml-auto" id="sidebar-history-badge" style={{background:'#e5e7eb', color:'#374151', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px'}}>0</span>
            */}
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" href="/schedule">
            <i className="icon-clock menu-icon"></i>
            <span className="menu-title">Schedule</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" href="/notifications">
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <i className="icon-bell menu-icon" style={{ marginRight: 0 }}></i>
              {/* Badge placeholder */}
            </div>
            <span className="menu-title" style={{ marginLeft: '14px' }}>Notifications</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" href="/chats">
            <i className="ti-comments menu-icon"></i>
            <span className="menu-title">Chat</span>
            {/* Badge placeholder */}
          </Link>
        </li>
      </ul>
    </nav>
  );
}
