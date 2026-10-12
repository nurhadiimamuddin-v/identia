import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-left">
          <img
            src="/images/myn.png"
            alt="MYN Logo"
            style={{ height: "24px", filter: "brightness(0)" }}
          />
          <span className="nav-brand">
            Identification Environment for Telkom Internal Access
          </span>
        </div>
        <div className="nav-right">
          <a
            href="https://montaklo.id"
            className="montaklo"
            target="_blank"
            rel="noopener noreferrer"
          >
            Montaklo
          </a>
          <Link href="/login" className="log-in">
            Log in
          </Link>
        </div>
      </nav>

      {/* Hero Content */}
      <main className="hero">
        {/* Logo Stack Animation */}
        <div className="logo-stack">
          <div className="stack-item item-1">
            <img src="/images/myn.png" alt="App Logo 1" />
          </div>
          <div className="stack-item item-2">
            <img src="/images/J.png" alt="App Logo 2" />
          </div>
          <div className="stack-item item-3">
            <img src="/images/da.png" alt="App Logo 3" />
          </div>
          <div className="stack-item item-4">
            <img src="/images/mk.png" alt="App Logo 4" />
          </div>
          <div className="stack-item item-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="white"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 004.5 10.5a7.464 7.464 0 01-1.15 3.993m1.989 3.559A11.209 11.209 0 008.25 10.5a3.75 3.75 0 117.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 01-3.6 9.75m6.633-4.596a18.666 18.666 0 01-2.485 5.33" />
            </svg>
          </div>
        </div>

        <h1 className="col-12">
          Transforming internal-access <br /> security systems.
        </h1>

        <p className="subtitle">
          Open your Fiber Termination Management Room-<br />with just one touch.
        </p>

        <div className="actions">
          <Link href="/login" className="btn-black">
            Get Started
          </Link>
        </div>
      </main>
    </>
  );
}
