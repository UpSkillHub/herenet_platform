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
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  isFeatured: boolean;
  createdAt: string;
  expiryDate?: string;
  images?: string[];
}

export default function MyAds() {
  const router = useRouter();
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [mounted, setMounted] = useState(false);

  // ── Auth guard ──
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.replace('/login'); return; }
    const raw = localStorage.getItem('user');
    const parsed = raw ? JSON.parse(raw) : null;
    const isAdmin =
      parsed?.isAdmin === true ||
      parsed?.isAdmin === 1 ||
      String(parsed?.isAdmin).toLowerCase() === 'true';
    if (isAdmin) { router.replace('/admin/dashboard'); return; }
  }, [router]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ── Fetch user's own ads ──
  useEffect(() => {
    // ✅ FIXED: /user/ads (was /ads which returns ALL ads)
    api.get('/user/ads')
      .then(res => setAds(res.data || []))
      .catch(() => showToast('Failed to load your ads.', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Delete ──
  const handleDelete = async (id: string) => {
    setDeleteLoading(true);
    try {
      await api.delete(`/ads/${id}`);
      setAds(prev => prev.filter(a => a.id !== id));
      setDeleteId(null);
      showToast('Ad deleted successfully.', 'success');
    } catch {
      showToast('Failed to delete ad. Please try again.', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const counts = {
    all:      ads.length,
    approved: ads.filter(a => a.status === 'approved').length,
    pending:  ads.filter(a => a.status === 'pending').length,
    rejected: ads.filter(a => a.status === 'rejected').length,
    expired:  ads.filter(a => a.status === 'expired').length,
  };

  const filtered = filter === 'all' ? ads : ads.filter(a => a.status === filter);

  const formatDate = (d?: string) => d
    ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

  // ── Placeholder image (no random external URLs) ──
  const placeholderBg = (id: string) => {
    const colors = ['#1a1a2e','#16213e','#1c1c2e','#1a2332','#1e1e2e','#1a1f2e'];
    const idx = id.charCodeAt(0) % colors.length;
    return colors[idx];
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        :root {
          --gold:#C9A84C; --gold-light:#E8C97A; --gold-dim:rgba(201,168,76,0.12);
          --dark:#0A0A0C; --mid:#1C1C22; --mid-2:#222228;
          --text-muted:rgba(255,255,255,0.38); --text-soft:rgba(255,255,255,0.65); --border:rgba(255,255,255,0.07);
        }
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'DM Sans',sans-serif;background:var(--dark);color:white}
        .page{min-height:100vh;padding:48px 24px 100px;position:relative}
        .grid-lines{position:fixed;inset:0;background-image:linear-gradient(rgba(201,168,76,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.025) 1px,transparent 1px);background-size:80px 80px;pointer-events:none;z-index:0}
        .inner{max-width:1280px;margin:0 auto;position:relative;z-index:1}

        /* NAV */
        .nav{display:flex;justify-content:space-between;align-items:center;margin-bottom:48px;animation:fadeUp .5s ease both}
        .nav-logo{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:600;color:white;text-decoration:none;letter-spacing:-.02em}
        .nav-logo em{font-style:italic;color:var(--gold-light)}
        .nav-right{display:flex;align-items:center;gap:12px}
        .nav-link-subtle{font-size:13px;color:var(--text-muted);text-decoration:none;transition:color .2s}
        .nav-link-subtle:hover{color:white}
        .logout-btn{background:none;border:1px solid var(--border);border-radius:8px;padding:7px 14px;font-family:'DM Sans',sans-serif;font-size:12px;color:var(--text-muted);cursor:pointer;transition:all .2s}
        .logout-btn:hover{border-color:rgba(255,255,255,0.14);color:white}

        /* HEADER */
        .topbar{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:32px;flex-wrap:wrap;gap:20px;animation:fadeUp .6s ease .05s both}
        .eyebrow{display:inline-flex;align-items:center;gap:8px;background:rgba(201,168,76,0.1);border:1px solid rgba(201,168,76,0.22);border-radius:100px;padding:5px 16px;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--gold-light);margin-bottom:14px}
        .eyebrow::before{content:'';width:5px;height:5px;border-radius:50%;background:var(--gold);box-shadow:0 0 6px var(--gold);animation:pulse 2s ease-in-out infinite}
        @keyframes pulse{0%,100%{opacity:1;box-shadow:0 0 6px var(--gold)}50%{opacity:.5;box-shadow:0 0 14px var(--gold)}}
        .page-title{font-family:'Cormorant Garamond',serif;font-size:clamp(36px,5vw,52px);font-weight:300;line-height:1;letter-spacing:-.02em}
        .page-title em{font-style:italic;color:var(--gold-light)}
        .post-btn{display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,var(--gold),#8a6020);color:white;text-decoration:none;padding:14px 26px;border-radius:12px;font-size:13px;font-weight:500;letter-spacing:.04em;box-shadow:0 8px 28px rgba(201,168,76,0.2);transition:transform .2s,box-shadow .2s}
        .post-btn:hover{transform:translateY(-2px);box-shadow:0 14px 40px rgba(201,168,76,0.32)}

        /* FILTER TABS */
        .filter-tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:28px;animation:fadeUp .6s ease .08s both}
        .filter-tab{display:flex;align-items:center;gap:6px;font-size:11px;letter-spacing:.08em;text-transform:capitalize;padding:9px 16px;border-radius:100px;border:1px solid var(--border);background:transparent;color:var(--text-muted);cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .2s}
        .filter-tab:hover{border-color:rgba(201,168,76,0.25);color:var(--text-soft)}
        .filter-tab.active{border-color:rgba(201,168,76,0.35);color:var(--gold-light);background:var(--gold-dim)}
        .tab-count{background:rgba(255,255,255,0.07);border-radius:100px;padding:2px 8px;font-size:10px;font-weight:600}
        .filter-tab.active .tab-count{background:rgba(201,168,76,0.18);color:var(--gold-light)}

        /* GRID */
        .ads-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;animation:fadeUp .6s ease .12s both}
        @media(max-width:900px){.ads-grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:560px){.ads-grid{grid-template-columns:1fr}}

        /* AD CARD */
        .ad-card{background:var(--mid);border:1px solid var(--border);border-radius:18px;overflow:hidden;transition:border-color .3s,box-shadow .35s,transform .35s;animation:fadeUp .5s ease both}
        .ad-card:hover{border-color:rgba(201,168,76,0.2);box-shadow:0 16px 48px rgba(0,0,0,0.5);transform:translateY(-4px)}

        /* CARD IMAGE */
        .card-img{height:170px;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center}
        .card-img img{width:100%;height:100%;object-fit:cover;filter:saturate(.82);transition:transform .5s ease}
        .ad-card:hover .card-img img{transform:scale(1.05)}
        .card-img-placeholder{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:32px;opacity:.3}

        /* CARD BADGES */
        .status-badge{position:absolute;top:10px;left:10px;font-size:9px;letter-spacing:.1em;text-transform:uppercase;padding:4px 10px;border-radius:100px;font-weight:500;display:inline-flex;align-items:center;gap:4px;backdrop-filter:blur(8px)}
        .status-badge::before{content:'';width:4px;height:4px;border-radius:50%;background:currentColor}
        .status-badge.pending{background:rgba(251,191,36,0.18);border:1px solid rgba(251,191,36,0.3);color:#fcd34d}
        .status-badge.approved{background:rgba(16,185,129,0.18);border:1px solid rgba(16,185,129,0.3);color:#6ee7b7}
        .status-badge.rejected{background:rgba(239,68,68,0.18);border:1px solid rgba(239,68,68,0.3);color:#fca5a5}
        .status-badge.expired{background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);color:var(--text-muted)}
        .featured-badge{position:absolute;top:10px;right:10px;font-size:9px;letter-spacing:.08em;text-transform:uppercase;background:rgba(201,168,76,0.2);border:1px solid rgba(201,168,76,0.4);color:var(--gold-light);padding:4px 10px;border-radius:100px}

        /* CARD BODY */
        .card-body{padding:18px 20px 20px}
        .card-title{font-size:14px;font-weight:400;color:rgba(255,255,255,0.88);line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:40px}
        .card-price{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:600;color:var(--gold-light);margin-top:8px;line-height:1}
        .card-price-unit{font-size:13px;font-weight:300;color:var(--text-muted)}
        .card-meta{display:flex;flex-direction:column;gap:3px;margin-top:8px}
        .card-location{font-size:12px;color:var(--text-muted)}
        .card-expiry{font-size:11px;color:var(--text-muted);letter-spacing:.03em}
        .card-expiry.expiring-soon{color:#fcd34d}

        /* CARD ACTIONS */
        .card-actions{display:flex;gap:7px;margin-top:16px;padding-top:14px;border-top:1px solid var(--border)}
        .card-btn{flex:1;text-align:center;border-radius:10px;padding:9px 6px;font-size:12px;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all .2s;text-decoration:none;display:flex;align-items:center;justify-content:center;gap:4px;border:1px solid var(--border);color:var(--text-soft);background:transparent}
        .card-btn:hover{background:var(--mid-2);color:white;border-color:rgba(255,255,255,0.12)}
        .card-btn.primary{color:var(--gold-light);border-color:rgba(201,168,76,0.2)}
        .card-btn.primary:hover{background:var(--gold-dim);border-color:rgba(201,168,76,0.4)}
        .card-btn.danger{color:var(--text-muted)}
        .card-btn.danger:hover{background:rgba(239,68,68,0.08);border-color:rgba(239,68,68,0.2);color:#fca5a5}

        /* SKELETON */
        .skel-card{background:var(--mid);border:1px solid var(--border);border-radius:18px;overflow:hidden}
        .skel-img{height:170px;background:linear-gradient(90deg,#1c1c22 25%,#252530 50%,#1c1c22 75%);background-size:200% 100%;animation:shimmer 1.5s infinite}
        .skel-body{padding:18px 20px}
        .skel-line{height:12px;border-radius:6px;background:linear-gradient(90deg,#1c1c22 25%,#252530 50%,#1c1c22 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;margin-bottom:10px}
        @keyframes shimmer{from{background-position:200% 0}to{background-position:-200% 0}}

        /* EMPTY */
        .empty{text-align:center;padding:80px 24px;animation:fadeUp .6s ease both}
        .empty-icon{font-size:48px;opacity:.3;margin-bottom:16px}
        .empty-title{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:300;color:rgba(255,255,255,.45)}
        .empty-sub{font-size:13px;color:var(--text-muted);margin-top:8px;margin-bottom:28px}

        /* DELETE MODAL */
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
        .modal-confirm:hover:not(:disabled){background:rgba(239,68,68,0.25)}
        .modal-confirm:disabled{opacity:.6;cursor:not-allowed}
        .spinner{width:14px;height:14px;border:2px solid rgba(255,255,255,0.2);border-top-color:currentColor;border-radius:50%;animation:spin .7s linear infinite}
        @keyframes spin{to{transform:rotate(360deg)}}

        /* TOAST */
        .toast{position:fixed;bottom:32px;right:32px;z-index:100;padding:14px 20px;border-radius:14px;font-size:13px;display:flex;align-items:center;gap:10px;animation:slideUp .3s ease;max-width:340px;box-shadow:0 8px 32px rgba(0,0,0,0.4)}
        .toast.success{background:#0f2a1e;border:1px solid rgba(16,185,129,0.3);color:#6ee7b7}
        .toast.error{background:#2a0f0f;border:1px solid rgba(239,68,68,0.3);color:#fca5a5}
        @keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}

        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      <div className="page">
        <div className="grid-lines" />
        <div className="inner">

          {/* NAV */}
          <nav className="nav">
            <Link href="/" className="nav-logo">Here<em>Net</em></Link>
            <div className="nav-right">
              <Link href="/dashboard" className="nav-link-subtle">Dashboard</Link>
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
              <div className="eyebrow">My Account</div>
              <h1 className="page-title">My <em>Ads</em></h1>
            </div>
            <Link href="/ads/create" className="post-btn">+ Post New Ad</Link>
          </div>

          {/* FILTER TABS */}
          <div className="filter-tabs">
            {(['all', 'approved', 'pending', 'rejected', 'expired'] as const).map(s => (
              <button
                key={s}
                className={`filter-tab${filter === s ? ' active' : ''}`}
                onClick={() => setFilter(s)}
              >
                {s}
                <span className="tab-count">{counts[s]}</span>
              </button>
            ))}
          </div>

          {/* CONTENT */}
          {loading ? (
            <div className="ads-grid">
              {[...Array(6)].map((_, i) => (
                <div className="skel-card" key={i}>
                  <div className="skel-img" />
                  <div className="skel-body">
                    <div className="skel-line" />
                    <div className="skel-line" style={{ width: '60%' }} />
                    <div className="skel-line" style={{ width: '40%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">📋</div>
              <p className="empty-title">
                {filter === 'all' ? 'No ads yet' : `No ${filter} ads`}
              </p>
              <p className="empty-sub">
                {filter === 'all'
                  ? 'Post your first ad to reach thousands of buyers across Rwanda.'
                  : `You have no ads with "${filter}" status right now.`}
              </p>
              {filter === 'all' && (
                <Link href="/ads/create" className="post-btn" style={{ display: 'inline-flex' }}>
                  + Post your first ad
                </Link>
              )}
            </div>
          ) : (
            <div className="ads-grid">
              {filtered.map((ad, index) => {
                const firstImage = ad.images?.[0];
                const expDate = ad.expiryDate ? new Date(ad.expiryDate) : null;
                const daysLeft = mounted && expDate
                  ? Math.ceil((expDate.getTime() - Date.now()) / 86400000)
                  : null;
                const expiringSoon = daysLeft !== null && daysLeft <= 3 && daysLeft > 0;

                return (
                  <div
                    className="ad-card"
                    key={ad.id}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* IMAGE */}
                    <div
                      className="card-img"
                      style={{ background: placeholderBg(ad.id) }}
                    >
                      {firstImage ? (
                        <img src={firstImage} alt={ad.title} loading="lazy" />
                      ) : (
                        <div className="card-img-placeholder">🏷️</div>
                      )}
                      <span className={`status-badge ${ad.status}`}>{ad.status}</span>
                      {ad.isFeatured && <span className="featured-badge">⭐ Featured</span>}
                    </div>

                    {/* BODY */}
                    <div className="card-body">
                      <div className="card-title">{ad.title}</div>
                      <div className="card-price">
                        {(ad.price || 0).toLocaleString()}
                        <span className="card-price-unit"> RWF</span>
                      </div>
                      <div className="card-meta">
                        {ad.location && (
                          <div className="card-location">📍 {ad.location}</div>
                        )}
                        {expDate && (
                          <div className={`card-expiry${expiringSoon ? ' expiring-soon' : ''}`}>
                            {expiringSoon
                              ? `⚠ Expires in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`
                              : `Expires: ${formatDate(ad.expiryDate)}`}
                          </div>
                        )}
                      </div>
                      <div className="card-actions">
                        <Link href={`/ads/${ad.id}`} className="card-btn primary">
                          👁 View
                        </Link>
                        <Link href={`/ads/${ad.id}/edit`} className="card-btn">
                          ✏️ Edit
                        </Link>
                        <button
                          className="card-btn danger"
                          onClick={() => setDeleteId(ad.id)}
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>

      {/* DELETE MODAL */}
      {deleteId && (
        <div className="modal-backdrop" onClick={() => setDeleteId(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Delete this ad?</div>
            <p className="modal-sub">
              This will permanently remove the ad from the platform. This action cannot be undone.
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
                {deleteLoading
                  ? <><div className="spinner" /> Deleting…</>
                  : 'Yes, delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          <span>{toast.type === 'success' ? '✓' : '✕'}</span>
          <span>{toast.msg}</span>
        </div>
      )}
    </>
  );
}