'use client';

export default function DashboardFooter() {
  return (
    <footer className="footer" style={{ background: '#f8f9fb' }}>
      <div className="d-sm-flex justify-content-center justify-content-sm-end">
        <span className="text-muted text-center text-sm-right d-block d-sm-inline-block">
          © 2026{' '}
          <a href="https://www.polije.ac.id/" target="_blank" rel="noopener noreferrer">
            Politeknik Negeri Jember.
          </a>{' '}
          All Rights Reserved.
          <img
            src="/images/polije.png"
            alt="Logo Polije"
            style={{ height: '20px', marginLeft: '8px', verticalAlign: 'middle' }}
          />
        </span>
      </div>
    </footer>
  );
}
