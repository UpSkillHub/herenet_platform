'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Corrected token + user handling - updates instantly after login
  useEffect(() => {
    const updateAuth = () => {
      const t = localStorage.getItem('token');
      const u = localStorage.getItem('user');
      setToken(t);
      setUser(u ? JSON.parse(u) : null);
    };

    // Initial check
    updateAuth();

    // Listen for login/logout from other tabs/pages
    window.addEventListener('storage', updateAuth);
    // Also check when user returns to this tab
    window.addEventListener('focus', updateAuth);

    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('storage', updateAuth);
      window.removeEventListener('focus', updateAuth);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

        :root {
          --gold: #C9A84C;
          --gold-light: #E8C97A;
          --dark: #0A0A0C;
          --mid: #1C1C22;
          --text-muted: rgba(255,255,255,0.45);
          --text-soft: rgba(255,255,255,0.75);
        }

        .navbar {
          position: sticky;
          top: 0;
          z-index: 50;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.4s, border-color 0.4s, backdrop-filter 0.4s, box-shadow 0.4s;
          border-bottom: 1px solid transparent;
        }

        .navbar.scrolled {
          background: rgba(10, 10, 12, 0.88);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-color: rgba(255,255,255,0.07);
          box-shadow: 0 4px 40px rgba(0,0,0,0.4);
        }

        .navbar.top {
          background: rgba(10, 10, 12, 0.4);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-color: rgba(255,255,255,0.04);
        }

        .nav-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 32px;
          height: 68px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
        }

        /* Logo */
        .nav-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px;
          font-weight: 600;
          color: white;
          text-decoration: none;
          letter-spacing: -0.02em;
          flex-shrink: 0;
          transition: color 0.2s;
        }

        .nav-logo em {
          font-style: italic;
          color: var(--gold-light);
        }

        .nav-logo:hover { color: var(--gold-light); }

        /* Nav links */
        .nav-links {
          display: flex;
          align-items: center;
          gap: 36px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .nav-links a {
          font-size: 13px;
          font-weight: 400;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--text-soft);
          text-decoration: none;
          position: relative;
          padding-bottom: 2px;
          transition: color 0.2s;
        }

        .nav-links a::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -2px;
          width: 0;
          height: 1px;
          background: var(--gold);
          transition: width 0.25s ease;
        }

        .nav-links a:hover { color: white; }
        .nav-links a:hover::after { width: 100%; }

        /* Right side */
        .nav-right {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-shrink: 0;
        }

        .nav-auth-link {
          font-size: 13px;
          font-weight: 400;
          letter-spacing: 0.04em;
          color: var(--text-soft);
          text-decoration: none;
          transition: color 0.2s;
        }

        .nav-auth-link:hover { color: white; }

        .nav-logout {
          font-size: 13px;
          font-weight: 400;
          letter-spacing: 0.04em;
          color: var(--text-muted);
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: color 0.2s;
          padding: 0;
        }

        .nav-logout:hover { color: white; }

        /* Divider */
        .nav-divider {
          width: 1px;
          height: 16px;
          background: rgba(255,255,255,0.12);
        }

        /* Post Ad button */
        .nav-post-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, var(--gold), #8a6020);
          color: white;
          text-decoration: none;
          padding: 10px 22px;
          border-radius: 100px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.04em;
          box-shadow: 0 4px 20px rgba(201,168,76,0.2);
          transition: transform 0.2s, box-shadow 0.2s;
          white-space: nowrap;
        }

        .nav-post-btn:hover {
          transform: translateY(-1px) scale(1.02);
          box-shadow: 0 8px 30px rgba(201,168,76,0.35);
        }

        .nav-post-btn:active { transform: scale(0.98); }

        .nav-post-arrow {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          transition: transform 0.2s;
        }

        .nav-post-btn:hover .nav-post-arrow { transform: translateX(2px); }

        /* Mobile hamburger */
        .nav-hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
        }

        .nav-hamburger span {
          display: block;
          width: 22px;
          height: 1.5px;
          background: rgba(255,255,255,0.7);
          border-radius: 2px;
          transition: transform 0.3s, opacity 0.3s, width 0.3s;
          transform-origin: center;
        }

        .nav-hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
        .nav-hamburger.open span:nth-child(2) { opacity: 0; width: 0; }
        .nav-hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

        /* Mobile menu */
        .nav-mobile {
          display: none;
          position: fixed;
          top: 68px;
          left: 0;
          right: 0;
          background: rgba(10,10,12,0.97);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          padding: 28px 32px 36px;
          flex-direction: column;
          gap: 0;
          z-index: 49;
          transform: translateY(-10px);
          opacity: 0;
          pointer-events: none;
          transition: transform 0.3s ease, opacity 0.3s ease;
        }

        .nav-mobile.open {
          transform: translateY(0);
          opacity: 1;
          pointer-events: all;
        }

        .nav-mobile a,
        .nav-mobile button {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 400;
          color: var(--text-soft);
          text-decoration: none;
          padding: 16px 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: block;
          background: none;
          border-left: none;
          border-right: none;
          border-top: none;
          cursor: pointer;
          text-align: left;
          width: 100%;
          transition: color 0.2s;
        }

        .nav-mobile a:hover,
        .nav-mobile button:hover { color: white; }

        .nav-mobile a:last-child,
        .nav-mobile button:last-child { border-bottom: none; }

        .nav-mobile .mobile-post {
          margin-top: 24px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, var(--gold), #8a6020);
          color: white !important;
          padding: 14px 28px;
          border-radius: 100px;
          font-weight: 500;
          letter-spacing: 0.04em;
          border: none !important;
          width: fit-content;
        }

        @media (max-width: 768px) {
          .nav-links { display: none; }
          .nav-auth-link,
          .nav-logout,
          .nav-divider,
          .nav-post-btn { display: none; }
          .nav-hamburger { display: flex; }
          .nav-mobile { display: flex; }
        }
      `}</style>

      <nav className={`navbar ${scrolled ? 'scrolled' : 'top'}`}>
        <div className="nav-inner">

          {/* Logo */}
          <Link href="/" className="nav-logo">
            Here<em>Net</em>
          </Link>

          {/* Desktop nav links */}
          <ul className="nav-links">
            <li><Link href="/categories">Categories</Link></li>
            <li><Link href="/search">Search</Link></li>
            <li><Link href="/jobs">Jobs</Link></li>
          </ul>

          {/* Desktop right side */}
          <div className="nav-right">
            {token ? (
              <>
                <Link 
                  href={user?.isAdmin ? "/admin/dashboard" : "/dashboard"} 
                  className="nav-auth-link"
                >
                  Dashboard
                </Link>
                <div className="nav-divider" />
                <button onClick={logout} className="nav-logout">Logout</button>
              </>
            ) : (
              <Link href="/login" className="nav-auth-link">Log in</Link>
            )}

            <Link href="/post-ad" className="nav-post-btn">
              Post Ad
              <span className="nav-post-arrow">→</span>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className={`nav-hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`nav-mobile ${menuOpen ? 'open' : ''}`}>
        <Link href="/categories" onClick={() => setMenuOpen(false)}>Categories</Link>
        <Link href="/search" onClick={() => setMenuOpen(false)}>Search</Link>
        <Link href="/jobs" onClick={() => setMenuOpen(false)}>Jobs</Link>
        {token ? (
          <>
            <Link 
              href={user?.isAdmin ? "/admin/dashboard" : "/dashboard"} 
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Link>
            <button onClick={() => { logout(); setMenuOpen(false); }}>Logout</button>
          </>
        ) : (
          <Link href="/login" onClick={() => setMenuOpen(false)}>Log in</Link>
        )}
        <Link href="/post-ad" className="mobile-post" onClick={() => setMenuOpen(false)}>
          Post Ad →
        </Link>
      </div>
    </>
  );
}