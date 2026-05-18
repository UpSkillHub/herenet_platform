'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface Ad {
  id: string;
  title: string;
  price: number;
  location: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired' | 'active';
  createdAt: string;
  expiryDate?: string;
  images?: string[];
  userId?: number;
}

interface Stats {
  totalAds: number;
  live: number;
  pending: number;
  expired: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats>({ totalAds: 0, live: 0, pending: 0, expired: 0 });
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState('');

  // ── Auth guard ──
  useEffect(() => {
    const token = localStorage.getItem('token');
    const raw = localStorage.getItem('user');
    if (!token) { router.replace('/login'); return; }

    const parsed: User = raw ? JSON.parse(raw) : null;

    // Redirect admin away from user dashboard
    const isAdmin =
      parsed?.isAdmin === true ||
      (parsed?.isAdmin as any) === 1 ||
      String(parsed?.isAdmin).toLowerCase() === 'true';

    if (isAdmin) { router.replace('/admin'); return; }

    setUser(parsed);
  }, [router]);

  // ── Fetch data ──
  useEffect(() => {
    if (user) {
      fetchUserAds();
    } else {
      // If user is not set yet but token exists, wait a bit
      const token = localStorage.getItem('token');
      if (token) {
        const interval = setInterval(() => {
          const raw = localStorage.getItem('user');
          if (raw) {
            setUser(JSON.parse(raw));
            clearInterval(interval);
          }
        }, 100);
        return () => clearInterval(interval);
      } else {
        setLoading(false);
      }
    }
  }, [user]);

  const fetchUserAds = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch all ads and filter by user ID
      const response = await api.get('/ads');
      const allAds = response.data || [];
      
      // Filter ads for current user (using userId comparison)
      const userAds = allAds.filter((ad: Ad) => {
        // Compare as strings or numbers
        return String(ad.userId) === String(user?.id);
      });
      
      console.log('Current user ID:', user?.id);
      console.log('All ads:', allAds);
      console.log('User ads:', userAds);
      
      setAds(userAds);
      
      // Calculate stats from user's ads
      const totalAds = userAds.length;
      const live = userAds.filter((ad: Ad) => 
        ad.status === 'approved' || ad.status === 'active'
      ).length;
      const pending = userAds.filter((ad: Ad) => ad.status === 'pending').length;
      const expired = userAds.filter((ad: Ad) => ad.status === 'expired').length;
      
      setStats({ totalAds, live, pending, expired });
    } catch (err: any) {
      console.error('Dashboard fetch error:', err);
      setError('Failed to load your ads. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  // ── Delete ad ──
  const handleDelete = async (id: string) => {
    setDeleteLoading(true);
    try {
      await api.delete(`/ads/${id}`);
      const updatedAds = ads.filter(a => a.id !== id);
      setAds(updatedAds);
      setDeleteId(null);
      
      // Refresh stats
      const totalAds = updatedAds.length;
      const live = updatedAds.filter((ad: Ad) => 
        ad.status === 'approved' || ad.status === 'active'
      ).length;
      const pending = updatedAds.filter((ad: Ad) => ad.status === 'pending').length;
      const expired = updatedAds.filter((ad: Ad) => ad.status === 'expired').length;
      setStats({ totalAds, live, pending, expired });
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete ad. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // ── Filter ads ──
  const filteredAds = ads.filter(ad => {
    const matchSearch = ad.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || ad.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatPrice = (price: number) =>
    price ? `${price.toLocaleString()} RWF` : '—';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        :root {
          --gold:#C9A84C; --gold-light:#E8C97A; --gold-dim:rgba(201,168,76,0.12);
          --dark:#0A0A0C; --dark-2:#111114; --mid:#1C1C22; --mid-2:#222228;
          --text-muted:rgba(255,255,255,0.38); --text-soft:rgba(255,255,255,0.65); --border:rgba(255,255,255,0.07);
        }
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'DM Sans',sans-serif;background:var(--dark);color:white}
        .page{min-height:100vh;padding:48px 24px 100px;position:relative}
        .grid-lines{position:fixed;inset:0;background-image:linear-gradient(rgba(201,168,76,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.025) 1px,transparent 1px);background-size:80px 80px;pointer-events:none;z-index:0}
        .inner{max-width:1280px;margin:0 auto;position:relative;z-index:1}

        .nav{display:flex;justify-content:space-between;align-items:center;margin-bottom:48px;animation:fadeUp .5s ease both}
        .nav-logo{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:600;color:white;text-decoration:none;letter-spacing:-.02em}
        .nav-logo em{font-style:italic;color:var(--gold-light)}
        .nav-right{display:flex;align-items:center;gap:16px}
        .nav-user{display:flex;align-items:center;gap:10px;font-size:13px;color:var(--text-soft)}
        .nav-avatar{width:34px;height:34px;border-radius:50%;background:var(--gold-dim);border:1px solid rgba(201,168,76,0.3);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:500;color:var(--gold-light)}
        .logout-btn{background:none;border:1px solid var(--border);border-radius:8px;padding:7px 14px;font-family:'DM Sans',sans-serif;font-size:12px;color:var(--text-muted);cursor:pointer;transition:all .2s}
        .logout-btn:hover{border-color:rgba(255,255,255,0.14);color:white}

        .topbar{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:36px;flex-wrap:wrap;gap:20px;animation:fadeUp .6s ease .05s both}
        .eyebrow{display:inline-flex;align-items:center;gap:8px;background:rgba(201,168,76,0.1);border:1px solid rgba(201,168,76,0.22);border-radius:100px;padding:5px 16px;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--gold-light);margin-bottom:14px}
        .eyebrow::before{content:'';width:5px;height:5px;border-radius:50%;background:var(--gold);box-shadow:0 0 6px var(--gold);animation:pulse 2s ease-in-out infinite}
        @keyframes pulse{0%,100%{opacity:1;box-shadow:0 0 6px var(--gold)}50%{opacity:.5;box-shadow:0 0 14px var(--gold)}}
        .page-title{font-family:'Cormorant Garamond',serif;font-size:clamp(36px,5vw,52px);font-weight:300;line-height:1;letter-spacing:-.02em}
        .page-title em{font-style:italic;color:var(--gold-light)}

        .post-btn{display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,var(--gold),#8a6020);color:white;border:none;border-radius:12px;padding:14px 24px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;letter-spacing:.04em;cursor:pointer;text-decoration:none;box-shadow:0 8px 28px rgba(201,168,76,0.22);transition:transform .2s,box-shadow .2s}
        .post-btn:hover{transform:translateY(-2px);box-shadow:0 14px 40px rgba(201,168,76,0.35)}

        .stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:36px;animation:fadeUp .6s ease .1s both}
        @media(max-width:768px){.stats-row{grid-template-columns:1fr 1fr}}
        @media(max-width:480px){.stats-row{grid-template-columns:1fr}}
        .stat-card{background:var(--mid);border:1px solid var(--border);border-radius:18px;padding:24px 28px;position:relative;overflow:hidden;transition:border-color .2s}
        .stat-card:hover{border-color:rgba(201,168,76,0.2)}
        .stat-card::after{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--gold),transparent);opacity:.4}
        .stat-label{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--text-muted)}
        .stat-value{font-family:'Cormorant Garamond',serif;font-size:42px;font-weight:600;color:var(--gold-light);margin-top:6px;line-height:1}
        .stat-sub{font-size:12px;color:var(--text-muted);margin-top:6px}

        .controls{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:20px;animation:fadeUp .6s ease .13s both}
        .search-input{flex:1;min-width:220px;max-width:360px;background:var(--mid);border:1px solid var(--border);border-radius:12px;padding:12px 18px;font-family:'DM Sans',sans-serif;font-size:13px;color:white;outline:none;transition:border-color .25s}
        .search-input::placeholder{color:var(--text-muted)}
        .search-input:focus{border-color:rgba(201,168,76,0.4)}
        .filter-select{background:var(--mid);border:1px solid var(--border);border-radius:12px;padding:12px 16px;font-family:'DM Sans',sans-serif;font-size:13px;color:var(--text-soft);outline:none;cursor:pointer;transition:border-color .25s}
        .filter-select:focus{border-color:rgba(201,168,76,0.4)}
        .filter-select option{background:var(--mid)}

        .error-message{background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);color:#fca5a5;padding:12px 20px;border-radius:12px;margin-bottom:20px;text-align:center}

        .table-wrap{background:var(--mid);border:1px solid var(--border);border-radius:20px;overflow:hidden;animation:fadeUp .6s ease .16s both;overflow-x:auto}
        .table{width:100%;border-collapse:collapse;min-width:640px}
        .table th{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--text-muted);font-weight:500;padding:16px 20px;text-align:left;border-bottom:1px solid var(--border)}
        .table td{padding:15px 20px;font-size:13px;color:var(--text-soft);border-bottom:1px solid rgba(255,255,255,0.04);vertical-align:middle}
        .table tr:last-child td{border-bottom:none}
        .table tbody tr:hover td{background:rgba(255,255,255,0.02)}
        .ad-title{color:white;font-weight:400;max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .price-cell{color:var(--gold-light);font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:600}
        .date-cell{font-size:12px;color:var(--text-muted)}

        .badge{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:100px;font-size:11px;font-weight:500;letter-spacing:.04em;text-transform:capitalize}
        .badge::before{content:'';width:5px;height:5px;border-radius:50%;flex-shrink:0}
        .badge.approved{background:rgba(16,185,129,0.1);color:#6ee7b7;border:1px solid rgba(16,185,129,0.2)}
        .badge.approved::before{background:#10b981}
        .badge.active{background:rgba(16,185,129,0.1);color:#6ee7b7;border:1px solid rgba(16,185,129,0.2)}
        .badge.active::before{background:#10b981}
        .badge.pending{background:rgba(245,158,11,0.1);color:#fcd34d;border:1px solid rgba(245,158,11,0.2)}
        .badge.pending::before{background:#f59e0b}
        .badge.rejected{background:rgba(239,68,68,0.1);color:#fca5a5;border:1px solid rgba(239,68,68,0.2)}
        .badge.rejected::before{background:#ef4444}
        .badge.expired{background:rgba(255,255,255,0.05);color:var(--text-muted);border:1px solid var(--border)}
        .badge.expired::before{background:rgba(255,255,255,0.2)}

        .actions{display:flex;gap:8px;align-items:center}
        .action-btn{padding:6px 12px;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:400;cursor:pointer;border:1px solid;transition:all .2s;text-decoration:none;display:inline-flex;align-items:center}
        .action-view{color:var(--gold-light);border-color:rgba(201,168,76,0.2);background:transparent}
        .action-view:hover{background:var(--gold-dim);border-color:rgba(201,168,76,0.4)}
        .action-edit{color:var(--text-soft);border-color:var(--border);background:transparent}
        .action-edit:hover{color:white;border-color:rgba(255,255,255,0.14)}
        .action-delete{color:#fca5a5;border-color:rgba(239,68,68,0.15);background:transparent}
        .action-delete:hover{background:rgba(239,68,68,0.08);border-color:rgba(239,68,68,0.3)}

        .empty{text-align:center;padding:60px 20px}
        .empty-icon{font-size:36px;margin-bottom:16px;opacity:.4}
        .empty-title{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:300;color:white;margin-bottom:8px}
        .empty-sub{font-size:13px;color:var(--text-muted);margin-bottom:24px}

        .skel{height:13px;border-radius:6px;background:linear-gradient(90deg,#1c1c22 25%,#252530 50%,#1c1c22 75%);background-size:200% 100%;animation:shimmer 1.5s infinite}
        @keyframes shimmer{from{background-position:200% 0}to{background-position:-200% 0}}

        .modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:50;display:flex;align-items:center;justify-content:center;padding:24px;animation:fadeIn .2s ease}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        .modal{background:var(--mid);border:1px solid var(--border);border-radius:20px;padding:32px;max-width:400px;width:100%;animation:popUp .25s ease}
        @keyframes popUp{from{transform:scale(.95);opacity:0}to{transform:scale(1);opacity:1}}
        .modal-title{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:300;margin-bottom:10px}
        .modal-sub{font-size:13px;color:var(--text-muted);margin-bottom:28px;line-height:1.6}
        .modal-actions{display:flex;gap:12px}
        .modal-cancel{flex:1;background:transparent;border:1px solid var(--border);border-radius:10px;padding:13px;font-family:'DM Sans',sans-serif;font-size:14px;color:var(--text-soft);cursor:pointer;transition:all .2s}
        .modal-cancel:hover{border-color:rgba(255,255,255,0.14);color:white}
        .modal-confirm{flex:1;background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.3);border-radius:10px;padding:13px;font-family:'DM Sans',sans-serif;font-size:14px;color:#fca5a5;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:8px}
        .modal-confirm:hover{background:rgba(239,68,68,0.25)}
        .modal-confirm:disabled{opacity:.6;cursor:not-allowed}

        .spinner{width:14px;height:14px;border:2px solid rgba(255,255,255,0.25);border-top-color:white;border-radius:50%;animation:spin .7s linear infinite}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      <div className="page">
        <div className="grid-lines" />
        <div className="inner">

          {/* NAV */}
          <nav className="nav">
            <Link href="/" className="nav-logo">Here<em>Net</em></Link>
            <div className="nav-right">
              {user && (
                <div className="nav-user">
                  <div className="nav-avatar">
                    {user.name?.[0]?.toUpperCase() ?? 'U'}
                  </div>
                  <span>{user.name}</span>
                </div>
              )}
              <button
                className="logout-btn"
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  router.replace('/login');
                }}
              >
                Log out
              </button>
            </div>
          </nav>

          {/* HEADER */}
          <div className="topbar">
            <div>
              <div className="eyebrow">My Dashboard</div>
              <h1 className="page-title">My <em>Ads</em></h1>
            </div>
            <Link href="/post-ad" className="post-btn">
              + Post New Ad
            </Link>
          </div>

          {/* STATS */}
          <div className="stats-row">
            {[
              { label: 'Total Ads', value: stats.totalAds, sub: 'All my listings' },
              { label: 'Live & Active', value: stats.live, sub: 'Currently visible' },
              { label: 'Pending', value: stats.pending, sub: 'Awaiting approval' },
              { label: 'Expired', value: stats.expired, sub: 'Ended listings' },
            ].map(({ label, value, sub }) => (
              <div className="stat-card" key={label}>
                <div className="stat-label">{label}</div>
                <div className="stat-value">{loading ? '—' : value}</div>
                <div className="stat-sub">{sub}</div>
              </div>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          {/* CONTROLS */}
          <div className="controls">
            <input
              className="search-input"
              placeholder="Search my ads…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select
              className="filter-select"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="all">All statuses</option>
              <option value="approved">Approved</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          {/* TABLE */}
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Ad Title</th>
                  <th>Price</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Posted</th>
                  <th>Expires</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      {[70, 45, 55, 35, 40, 40, 30].map((w, j) => (
                        <td key={j}><div className="skel" style={{ width: `${w}%` }} /></td>
                      ))}
                    </tr>
                  ))
                ) : filteredAds.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <div className="empty">
                        <div className="empty-icon">📋</div>
                        <div className="empty-title">No ads found</div>
                        <div className="empty-sub">
                          {ads.length === 0
                            ? "You haven't posted any ads yet."
                            : 'No ads match your search or filter.'}
                        </div>
                        {ads.length === 0 && (
                          <Link href="/post-ad" className="post-btn" style={{ display: 'inline-flex' }}>
                            + Post your first ad
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAds.map(ad => (
                    <tr key={ad.id}>
                      <td className="ad-title" title={ad.title}>{ad.title}</td>
                      <td><span className="price-cell">{formatPrice(ad.price)}</span></td>
                      <td>{ad.location || '—'}</td>
                      <td><span className={`badge ${ad.status}`}>{ad.status}</span></td>
                      <td><span className="date-cell">{formatDate(ad.createdAt)}</span></td>
                      <td><span className="date-cell">{formatDate(ad.expiryDate)}</span></td>
                      <td>
                        <div className="actions">
                          <Link href={`/ad/${ad.id}`} className="action-btn action-view">View</Link>
                          <Link href={`/post-ad?id=${ad.id}`} className="action-btn action-edit">Edit</Link>
                          <button
                            className="action-btn action-delete"
                            onClick={() => setDeleteId(ad.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {deleteId && (
        <div className="modal-backdrop" onClick={() => setDeleteId(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Delete this ad?</div>
            <p className="modal-sub">
              This action cannot be undone. The ad will be permanently removed from the platform.
            </p>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setDeleteId(null)}>
                Cancel
              </button>
              <button
                className="modal-confirm"
                disabled={deleteLoading}
                onClick={() => handleDelete(deleteId)}
              >
                {deleteLoading ? <><div className="spinner" /> Deleting…</> : 'Yes, delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}