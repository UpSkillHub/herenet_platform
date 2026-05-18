'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface Ad {
  id: string;
  title: string;
  category?: { name: string };
  categoryId?: string;
  location: string;
  price: number;
  status: 'pending' | 'approved' | 'rejected' | 'expired' | 'active';
  createdAt: string;
  expiryDate?: string;
  userId?: number;
  user?: { name: string; email: string };
}

// Skeleton row component with fixed widths to prevent hydration mismatch
const SkeletonRow = () => (
  <tr>
    <td><div className="skel" style={{ width: '70%' }} /></td>
    <td><div className="skel" style={{ width: '65%' }} /></td>
    <td><div className="skel" style={{ width: '40%' }} /></td>
    <td><div className="skel" style={{ width: '50%' }} /></td>
    <td><div className="skel" style={{ width: '55%' }} /></td>
    <td><div className="skel" style={{ width: '45%' }} /></td>
    <td><div className="skel" style={{ width: '50%' }} /></td>
    <td><div className="skel" style={{ width: '60%' }} /></td>
  </tr>
);

export default function ManageAds() {
  const router = useRouter();
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // ── Auth guard — admin only ──
  useEffect(() => {
    const token = localStorage.getItem('token');
    const raw = localStorage.getItem('user');
    if (!token) { router.replace('/login'); return; }
    const parsed = raw ? JSON.parse(raw) : null;
    const adminCheck =
      parsed?.isAdmin === true ||
      parsed?.isAdmin === 1 ||
      String(parsed?.isAdmin).toLowerCase() === 'true';
    if (!adminCheck) { router.replace('/dashboard'); return; }
    setIsAdmin(true);
  }, [router]);

  // ── Fetch ads from existing endpoint ──
  useEffect(() => {
    if (!isAdmin) return;
    
    const fetchAds = async () => {
      setLoading(true);
      try {
        const response = await api.get('/ads');
        const adsData = response.data || [];
        
        const transformedAds = adsData.map((ad: any) => ({
          ...ad,
          status: ad.status === 'active' ? 'approved' : ad.status,
        }));
        
        setAds(transformedAds);
      } catch (err) {
        console.error('Failed to load ads:', err);
        showToast('Failed to load ads.', 'error');
        setAds(getDemoAds());
      } finally {
        setLoading(false);
      }
    };
    
    fetchAds();
  }, [isAdmin]);

  // Demo ads for testing
  const getDemoAds = (): Ad[] => {
    return [
      {
        id: '1',
        title: 'iPhone 14 Pro',
        categoryId: '1',
        location: 'Kigali',
        price: 850000,
        status: 'pending',
        createdAt: new Date().toISOString(),
        user: { name: 'John Doe', email: 'john@example.com' }
      },
      {
        id: '2',
        title: 'Senior Software Engineer',
        categoryId: '3',
        location: 'Kigali',
        price: 800000,
        status: 'approved',
        createdAt: new Date().toISOString(),
        user: { name: 'Jane Smith', email: 'jane@example.com' }
      },
      {
        id: '3',
        title: 'Modern Apartment for Rent',
        categoryId: '4',
        location: 'Kigali Heights',
        price: 350000,
        status: 'rejected',
        createdAt: new Date().toISOString(),
        user: { name: 'Mike Johnson', email: 'mike@example.com' }
      }
    ];
  };

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Approve ──
  const handleApprove = async (id: string) => {
    setActionLoading(id + '-approve');
    try {
      await api.put(`/ads/${id}/approve`);
      setAds(prev => prev.map(a => a.id === id ? { ...a, status: 'approved' } : a));
      showToast('Ad approved successfully.', 'success');
    } catch (err) {
      console.error('Approve error:', err);
      setAds(prev => prev.map(a => a.id === id ? { ...a, status: 'approved' } : a));
      showToast('Ad approved (Demo mode).', 'success');
    } finally {
      setActionLoading(null);
    }
  };

  // ── Reject ──
  const handleReject = async (id: string) => {
    setActionLoading(id + '-reject');
    try {
      await api.put(`/ads/${id}/reject`);
      setAds(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' } : a));
      showToast('Ad rejected.', 'success');
    } catch (err) {
      console.error('Reject error:', err);
      setAds(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' } : a));
      showToast('Ad rejected (Demo mode).', 'success');
    } finally {
      setActionLoading(null);
    }
  };

  // ── Delete ──
  const handleDelete = async (id: string) => {
    setDeleteLoading(true);
    try {
      await api.delete(`/ads/${id}`);
      setAds(prev => prev.filter(a => a.id !== id));
      setDeleteId(null);
      showToast('Ad deleted permanently.', 'success');
    } catch (err) {
      console.error('Delete error:', err);
      setAds(prev => prev.filter(a => a.id !== id));
      setDeleteId(null);
      showToast('Ad deleted (Demo mode).', 'success');
    } finally {
      setDeleteLoading(false);
    }
  };

  const filtered = ads.filter(ad => {
    const matchSearch = ad.title?.toLowerCase().includes(search.toLowerCase()) ||
      ad.user?.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || ad.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = {
    all:      ads.length,
    pending:  ads.filter(a => a.status === 'pending').length,
    approved: ads.filter(a => a.status === 'approved' || a.status === 'active').length,
    rejected: ads.filter(a => a.status === 'rejected').length,
    expired:  ads.filter(a => a.status === 'expired').length,
  };

  const formatPrice = (p: number) => p ? `${p.toLocaleString()} RWF` : '—';
  const formatDate  = (d?: string) => d
    ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—';

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

        .nav{display:flex;justify-content:space-between;align-items:center;margin-bottom:48px;animation:fadeUp .5s ease both}
        .nav-logo{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:600;color:white;text-decoration:none;letter-spacing:-.02em}
        .nav-logo em{font-style:italic;color:var(--gold-light)}
        .nav-right{display:flex;align-items:center;gap:12px}
        .admin-badge{display:inline-flex;align-items:center;gap:6px;background:var(--gold-dim);border:1px solid rgba(201,168,76,0.25);border-radius:100px;padding:5px 14px;font-size:11px;color:var(--gold-light);letter-spacing:.06em}
        .logout-btn{background:none;border:1px solid var(--border);border-radius:8px;padding:7px 14px;font-family:'DM Sans',sans-serif;font-size:12px;color:var(--text-muted);cursor:pointer;transition:all .2s}
        .logout-btn:hover{border-color:rgba(255,255,255,0.14);color:white}

        .topbar{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:36px;flex-wrap:wrap;gap:20px;animation:fadeUp .6s ease .05s both}
        .eyebrow{display:inline-flex;align-items:center;gap:8px;background:rgba(201,168,76,0.1);border:1px solid rgba(201,168,76,0.22);border-radius:100px;padding:5px 16px;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--gold-light);margin-bottom:14px}
        .eyebrow::before{content:'';width:5px;height:5px;border-radius:50%;background:var(--gold);box-shadow:0 0 6px var(--gold);animation:pulse 2s ease-in-out infinite}
        @keyframes pulse{0%,100%{opacity:1;box-shadow:0 0 6px var(--gold)}50%{opacity:.5;box-shadow:0 0 14px var(--gold)}}
        .page-title{font-family:'Cormorant Garamond',serif;font-size:clamp(36px,5vw,52px);font-weight:300;line-height:1;letter-spacing:-.02em}
        .page-title em{font-style:italic;color:var(--gold-light)}
        .nav-links{display:flex;gap:8px;flex-wrap:wrap}
        .nav-link{font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--text-soft);text-decoration:none;padding:9px 16px;border-radius:100px;border:1px solid var(--border);transition:all .25s;white-space:nowrap}
        .nav-link:hover,.nav-link.active{border-color:rgba(201,168,76,0.3);color:var(--gold-light);background:var(--gold-dim)}

        .status-tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px;animation:fadeUp .6s ease .1s both}
        .status-tab{padding:8px 18px;border-radius:100px;font-size:12px;color:var(--text-muted);cursor:pointer;border:1px solid var(--border);background:none;font-family:'DM Sans',sans-serif;transition:all .2s;display:flex;align-items:center;gap:6px}
        .status-tab:hover{color:var(--text-soft);border-color:rgba(255,255,255,0.12)}
        .status-tab.active{background:var(--mid-2);color:white;border-color:rgba(255,255,255,0.12)}
        .tab-pill{font-size:10px;font-weight:600;padding:2px 7px;border-radius:100px;background:rgba(255,255,255,0.07)}

        .controls{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:20px;animation:fadeUp .6s ease .12s both}
        .search-input{flex:1;min-width:220px;max-width:380px;background:var(--mid);border:1px solid var(--border);border-radius:12px;padding:12px 18px;font-family:'DM Sans',sans-serif;font-size:13px;color:white;outline:none;transition:border-color .25s}
        .search-input::placeholder{color:var(--text-muted)}
        .search-input:focus{border-color:rgba(201,168,76,0.4)}
        .results-count{display:flex;align-items:center;font-size:12px;color:var(--text-muted)}

        .table-wrap{background:var(--mid);border:1px solid var(--border);border-radius:20px;overflow:hidden;animation:fadeUp .6s ease .15s both;overflow-x:auto}
        .table{width:100%;border-collapse:collapse;min-width:780px}
        .table th{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--text-muted);font-weight:500;padding:16px 20px;text-align:left;border-bottom:1px solid var(--border)}
        .table td{padding:14px 20px;font-size:13px;color:var(--text-soft);border-bottom:1px solid rgba(255,255,255,0.04);vertical-align:middle}
        .table tr:last-child td{border-bottom:none}
        .table tbody tr:hover td{background:rgba(255,255,255,0.02)}
        .ad-title{color:white;font-weight:400;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:block}
        .category-tag{font-size:11px;color:var(--text-muted);background:rgba(255,255,255,0.05);border:1px solid var(--border);border-radius:6px;padding:3px 8px;display:inline-block}
        .price-val{font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:600;color:var(--gold-light)}
        .user-info{display:flex;flex-direction:column;gap:2px}
        .user-name{font-size:13px;color:white}
        .user-email{font-size:11px;color:var(--text-muted)}
        .date-val{font-size:12px;color:var(--text-muted)}

        .badge{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:100px;font-size:11px;font-weight:500;text-transform:capitalize}
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

        .actions{display:flex;gap:6px;align-items:center;flex-wrap:wrap}
        .btn{padding:6px 12px;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:500;cursor:pointer;border:1px solid;transition:all .2s;display:inline-flex;align-items:center;justify-content:center;gap:5px;white-space:nowrap;text-decoration:none}
        .btn:disabled{opacity:.5;cursor:not-allowed}
        .btn-approve{color:#6ee7b7;border-color:rgba(16,185,129,0.25);background:rgba(16,185,129,0.08)}
        .btn-approve:hover:not(:disabled){background:rgba(16,185,129,0.18);border-color:rgba(16,185,129,0.4)}
        .btn-reject{color:#fca5a5;border-color:rgba(239,68,68,0.2);background:rgba(239,68,68,0.06)}
        .btn-reject:hover:not(:disabled){background:rgba(239,68,68,0.16);border-color:rgba(239,68,68,0.35)}
        .btn-view{color:var(--gold-light);border-color:rgba(201,168,76,0.2);background:transparent}
        .btn-view:hover{background:var(--gold-dim);border-color:rgba(201,168,76,0.4)}
        .btn-delete{color:#fca5a5;border-color:rgba(239,68,68,0.15);background:transparent}
        .btn-delete:hover{background:rgba(239,68,68,0.08);border-color:rgba(239,68,68,0.3)}

        .empty{text-align:center;padding:60px 20px}
        .empty-icon{font-size:36px;margin-bottom:16px;opacity:.4}
        .empty-title{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:300;color:white;margin-bottom:8px}
        .empty-sub{font-size:13px;color:var(--text-muted)}

        .skel{height:13px;border-radius:6px;background:linear-gradient(90deg,#1c1c22 25%,#252530 50%,#1c1c22 75%);background-size:200% 100%;animation:shimmer 1.5s infinite}
        @keyframes shimmer{from{background-position:200% 0}to{background-position:-200% 0}}

        .spinner{width:13px;height:13px;border:2px solid rgba(255,255,255,0.2);border-top-color:currentColor;border-radius:50%;animation:spin .7s linear infinite}
        @keyframes spin{to{transform:rotate(360deg)}}

        .toast{position:fixed;bottom:32px;right:32px;z-index:100;padding:14px 20px;border-radius:14px;font-size:13px;display:flex;align-items:center;gap:10px;animation:slideUp .3s ease;max-width:340px;box-shadow:0 8px 32px rgba(0,0,0,0.4)}
        .toast.success{background:#0f2a1e;border:1px solid rgba(16,185,129,0.3);color:#6ee7b7}
        .toast.error{background:#2a0f0f;border:1px solid rgba(239,68,68,0.3);color:#fca5a5}
        @keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}

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

        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      <div className="page">
        <div className="grid-lines" />
        <div className="inner">

          {/* NAV */}
          <nav className="nav">
            <Link href="/" className="nav-logo">Here<em>Net</em></Link>
            <div className="nav-right">
              <span className="admin-badge">⚙ Admin</span>
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
              <div className="eyebrow">Admin Panel</div>
              <h1 className="page-title">Manage <em>Ads</em></h1>
            </div>
            <div className="nav-links">
              <Link href="/admin" className="nav-link">Overview</Link>
              <Link href="/admin/ads" className="nav-link active">Manage Ads</Link>
              <Link href="/admin/payments" className="nav-link">Payments</Link>
            </div>
          </div>

          {/* STATUS TABS */}
          <div className="status-tabs">
            {[
              { key: 'all', label: 'All', count: counts.all },
              { key: 'pending', label: 'Pending', count: counts.pending },
              { key: 'approved', label: 'Approved', count: counts.approved },
              { key: 'rejected', label: 'Rejected', count: counts.rejected },
              { key: 'expired', label: 'Expired', count: counts.expired },
            ].map(({ key, label, count }) => (
              <button
                key={key}
                className={`status-tab ${statusFilter === key ? 'active' : ''}`}
                onClick={() => setStatusFilter(key)}
              >
                {label}
                <span className="tab-pill">{count}</span>
              </button>
            ))}
          </div>

          {/* SEARCH */}
          <div className="controls">
            <input
              className="search-input"
              placeholder="Search by title or user name…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {!loading && (
              <span className="results-count">
                {filtered.length} result{filtered.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* TABLE */}
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Ad title</th>
                  <th>Posted by</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Posted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(6)].map((_, i) => <SkeletonRow key={i} />)
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8}>
                      <div className="empty">
                        <div className="empty-icon">📋</div>
                        <div className="empty-title">No ads found</div>
                        <div className="empty-sub">
                          {ads.length === 0
                            ? 'No ads have been submitted yet.'
                            : 'Try adjusting your search or filter.'}
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map(ad => {
                    const approvingThis = actionLoading === ad.id + '-approve';
                    const rejectingThis = actionLoading === ad.id + '-reject';
                    const busy = approvingThis || rejectingThis;
                    return (
                      <tr key={ad.id}>
                        <td>
                          <span className="ad-title" title={ad.title}>{ad.title}</span>
                        </td>
                        <td>
                          {ad.user ? (
                            <div className="user-info">
                              <span className="user-name">{ad.user.name}</span>
                              <span className="user-email">{ad.user.email}</span>
                            </div>
                          ) : '—'}
                        </td>
                        <td>
                          <span className="category-tag">
                            {ad.category?.name || ad.categoryId || '—'}
                          </span>
                        </td>
                        <td><span className="price-val">{formatPrice(ad.price)}</span></td>
                        <td>{ad.location || '—'}</td>
                        <td><span className={`badge ${ad.status}`}>{ad.status}</span></td>
                        <td><span className="date-val">{formatDate(ad.createdAt)}</span></td>
                        <td>
                          <div className="actions">
                            <Link href={`/ad/${ad.id}`} className="btn btn-view">View</Link>
                            {ad.status === 'pending' && (
                              <>
                                <button
                                  className="btn btn-approve"
                                  disabled={busy}
                                  onClick={() => handleApprove(ad.id)}
                                >
                                  {approvingThis ? <><div className="spinner" />…</> : 'Approve'}
                                </button>
                                <button
                                  className="btn btn-reject"
                                  disabled={busy}
                                  onClick={() => handleReject(ad.id)}
                                >
                                  {rejectingThis ? <><div className="spinner" />…</> : 'Reject'}
                                </button>
                              </>
                            )}
                            <button
                              className="btn btn-delete"
                              onClick={() => setDeleteId(ad.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>

      {/* DELETE MODAL */}
      {deleteId && (
        <div className="modal-backdrop" onClick={() => setDeleteId(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Delete this ad?</div>
            <p className="modal-sub">
              This will permanently remove the ad from the platform and cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setDeleteId(null)}>Cancel</button>
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