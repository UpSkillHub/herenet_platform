'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.replace('/login');
  };

  const navItems = [
    { href: '/admin/dashboard', icon: '📊', label: 'Dashboard'    },
    { href: '/admin/ads',       icon: '📋', label: 'Manage Ads'   },
    { href: '/admin/users',     icon: '👥', label: 'Manage Users' },
    { href: '/admin/payments',  icon: '💳', label: 'Payments'     },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        :root {
          --gold:#C9A84C; --gold-light:#E8C97A; --gold-dim:rgba(201,168,76,0.12);
          --dark:#0A0A0C; --sidebar:#111114; --mid:#1C1C22;
          --text-muted:rgba(255,255,255,0.38); --text-soft:rgba(255,255,255,0.65);
          --border:rgba(255,255,255,0.07);
        }
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'DM Sans',sans-serif;background:var(--dark);color:white;min-height:100vh}

        /* SHELL */
        .admin-shell{display:flex;min-height:100vh}

        /* SIDEBAR */
        .sidebar{
          width:260px; min-width:260px;
          background:var(--sidebar);
          border-right:1px solid var(--border);
          display:flex; flex-direction:column;
          position:sticky; top:0; height:100vh;
          overflow-y:auto;
        }

        /* LOGO */
        .sidebar-logo{
          padding:32px 28px 28px;
          border-bottom:1px solid var(--border);
          display:flex; align-items:center; gap:12px;
          text-decoration:none;
        }
        .logo-text{
          font-family:'Cormorant Garamond',serif;
          font-size:28px; font-weight:600;
          color:white; letter-spacing:-.02em; line-height:1;
        }
        .logo-text em{font-style:italic;color:var(--gold-light)}
        .logo-badge{
          font-size:9px; letter-spacing:.14em; text-transform:uppercase;
          background:var(--gold-dim); color:var(--gold-light);
          border:1px solid rgba(201,168,76,0.25);
          border-radius:100px; padding:4px 10px;
        }

        /* NAV */
        .sidebar-nav{flex:1;padding:20px 16px;display:flex;flex-direction:column;gap:4px}

        .nav-item{
          display:flex; align-items:center; gap:12px;
          padding:13px 16px; border-radius:14px;
          font-size:14px; font-weight:400;
          color:var(--text-muted);
          text-decoration:none;
          border:1px solid transparent;
          transition:all .22s;
          position:relative;
        }
        .nav-item:hover{
          background:rgba(255,255,255,0.04);
          color:var(--text-soft);
          border-color:rgba(255,255,255,0.05);
        }
        .nav-item.active{
          background:var(--gold-dim);
          color:var(--gold-light);
          border-color:rgba(201,168,76,0.2);
        }
        .nav-item.active::before{
          content:'';
          position:absolute; left:-16px; top:50%; transform:translateY(-50%);
          width:3px; height:24px;
          background:var(--gold);
          border-radius:0 3px 3px 0;
          box-shadow:0 0 10px rgba(201,168,76,0.5);
        }
        .nav-icon{font-size:16px;flex-shrink:0;width:20px;text-align:center}

        /* DIVIDER */
        .sidebar-divider{height:1px;background:var(--border);margin:8px 0}

        /* SIDEBAR FOOTER */
        .sidebar-footer{padding:20px 16px;border-top:1px solid var(--border)}

        .logout-btn{
          width:100%; padding:13px 16px;
          border-radius:14px;
          background:none;
          border:1px solid rgba(239,68,68,0.15);
          color:rgba(252,165,165,0.7);
          font-family:'DM Sans',sans-serif;
          font-size:14px; font-weight:400;
          cursor:pointer;
          display:flex; align-items:center; gap:12px;
          transition:all .22s;
          text-align:left;
        }
        .logout-btn:hover{
          background:rgba(239,68,68,0.08);
          border-color:rgba(239,68,68,0.3);
          color:#fca5a5;
        }

        /* MOBILE — hide sidebar, show top bar */
        @media(max-width:768px){
          .sidebar{display:none}
          .mobile-topbar{
            display:flex; align-items:center; justify-content:space-between;
            padding:16px 20px;
            background:var(--sidebar);
            border-bottom:1px solid var(--border);
            position:sticky; top:0; z-index:40;
          }
          .mobile-logo{
            font-family:'Cormorant Garamond',serif;
            font-size:22px; font-weight:600; color:white;
            text-decoration:none; letter-spacing:-.02em;
          }
          .mobile-logo em{font-style:italic;color:var(--gold-light)}
          .mobile-nav{display:flex;gap:6px;flex-wrap:wrap;padding:12px 20px;border-bottom:1px solid var(--border);background:var(--sidebar)}
          .mobile-nav-link{font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--text-muted);text-decoration:none;padding:7px 12px;border-radius:100px;border:1px solid var(--border);transition:all .2s;white-space:nowrap}
          .mobile-nav-link:hover,.mobile-nav-link.active{border-color:rgba(201,168,76,0.3);color:var(--gold-light);background:var(--gold-dim)}
          .mobile-logout{background:none;border:1px solid rgba(239,68,68,0.15);border-radius:8px;padding:7px 14px;font-family:'DM Sans',sans-serif;font-size:12px;color:rgba(252,165,165,0.7);cursor:pointer;transition:all .2s}
          .mobile-logout:hover{background:rgba(239,68,68,0.08);color:#fca5a5}
        }
        @media(min-width:769px){
          .mobile-topbar{display:none}
          .mobile-nav{display:none}
        }

        /* MAIN */
        .admin-main{flex:1;min-width:0;overflow-x:hidden}
      `}</style>

      <div className="admin-shell">

        {/* ── DESKTOP SIDEBAR ── */}
        <aside className="sidebar">
          <Link href="/admin/dashboard" className="sidebar-logo">
            <span className="logo-text">Here<em>Net</em></span>
            <span className="logo-badge">Admin</span>
          </Link>

          <nav className="sidebar-nav">
            {navItems.map(({ href, icon, label }) => (
              <Link
                key={href}
                href={href}
                className={`nav-item${pathname === href || pathname.startsWith(href + '/') ? ' active' : ''}`}
              >
                <span className="nav-icon">{icon}</span>
                {label}
              </Link>
            ))}

            <div className="sidebar-divider" />

            <Link
              href="/"
              className="nav-item"
            >
              <span className="nav-icon">🌐</span>
              View Site
            </Link>
          </nav>

          <div className="sidebar-footer">
            <button className="logout-btn" onClick={handleLogout}>
              <span className="nav-icon">🚪</span>
              Log out
            </button>
          </div>
        </aside>

        {/* ── MOBILE TOP BAR ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div className="mobile-topbar">
            <Link href="/admin/dashboard" className="mobile-logo">Here<em>Net</em></Link>
            <button className="mobile-logout" onClick={handleLogout}>Log out</button>
          </div>
          <div className="mobile-nav">
            {navItems.map(({ href, icon, label }) => (
              <Link
                key={href}
                href={href}
                className={`mobile-nav-link${pathname === href ? ' active' : ''}`}
              >
                {icon} {label}
              </Link>
            ))}
          </div>

          {/* ── MAIN CONTENT ── */}
          <main className="admin-main">
            {children}
          </main>
        </div>

      </div>
    </>
  );
}