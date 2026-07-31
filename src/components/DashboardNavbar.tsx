'use client';

import Link from 'next/link';

export default function DashboardNavbar() {
  return (
    <nav className="navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
      <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
        <Link className="navbar-brand brand-logo mr-5" href="/dashboard">
          <img src="/images/ko.png" className="mr-2" alt="logo" width="100" height="110" />
        </Link>
        <Link className="navbar-brand brand-logo-mini" href="/dashboard">
          <img src="/images/myn.png" alt="logo" />
        </Link>
      </div>
      <div className="navbar-menu-wrapper d-flex align-items-center justify-content-end">
        <button className="navbar-toggler navbar-toggler align-self-center" type="button" data-toggle="minimize">
          <span className="icon-menu"></span>
        </button>
        <ul className="navbar-nav mr-lg-2">
          <li className="nav-item nav-search d-none d-lg-block">
            <div className="input-group" style={{ position: 'relative' }}>
              <div className="input-group-prepend hover-cursor" id="navbar-search-icon">
                <span className="input-group-text" id="search">
                  <i className="icon-search"></i>
                </span>
              </div>
              <input type="text" className="form-control" id="navbar-search-input" placeholder="Search now"
                aria-label="search" aria-describedby="search" autoComplete="off" />
              {/* Search Results Dropdown */}
              <div className="search-dropdown" id="searchDropdown" style={{ display: 'none' }}>
                <div className="search-tabs" id="searchTabs">
                  <button className="search-tab-item active" data-tab="all">All</button>
                  <button className="search-tab-item" data-tab="overview">Overview</button>
                  <button className="search-tab-item" data-tab="account">Account</button>
                  <button className="search-tab-item" data-tab="occupant">Occupant</button>
                </div>
                <div className="search-results" id="searchResults">
                  <div className="search-empty">Type to search...</div>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <ul className="navbar-nav navbar-nav-right">
          <li className="nav-item nav-profile dropdown">
            <a className="nav-link dropdown-toggle" href="#" data-toggle="dropdown" id="profileDropdown">
              <span
                style={{
                  fontFamily: "'Inter','Segoe UI',sans-serif",
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#212529',
                  marginRight: '8px',
                  display: 'inline-flex',
                  alignItems: 'center'
                }}
              >
                Admin Name
                <i className="mdi mdi-check-decagram" style={{ color: '#1da1f2', fontSize: '16px', marginLeft: '4px' }} title="Verified"></i>
              </span>
              <img src="/images/admin.png" alt="profile" style={{ objectFit: 'cover' }} />
            </a>
            <div className="dropdown-menu dropdown-menu-right navbar-dropdown" aria-labelledby="profileDropdown">
              <a className="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">
                <i className="ti-power-off text-primary"></i>
                Logout
              </a>
            </div>
          </li>
          <li className="nav-item nav-settings d-none d-lg-flex">
            <a className="nav-link" href="#" style={{ background: 'transparent !important', padding: '0 15px', border: 'none' }}>
              <i className="icon-ellipsis" style={{ fontSize: '20px', color: '#6c7383' }}></i>
            </a>
          </li>
        </ul>
        <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button"
          data-toggle="offcanvas">
          <span className="icon-menu"></span>
        </button>
      </div>
    </nav>
  );
}
