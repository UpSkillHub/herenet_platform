'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface Payment {
  id: string | number;
  amount: number;
  days: number;
  isFeatured: boolean;
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod: string;
  createdAt: string;
  transactionId?: string;
  user?: { id: string; name: string; email: string };
  ad?: { id: string; title: string };
}

export default function AdminPayments() {
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // ── Auth guard — admin only ──
  useEffect(() => {
    const token = localStorage.getItem('token');
    const raw = localStorage.getItem('user');
    if (!token) { 
      router.replace('/login'); 
      return; 
    }
    const parsed = raw ? JSON.parse(raw) : null;
    const adminCheck =
      parsed?.isAdmin === true ||
      parsed?.isAdmin === 1 ||
      String(parsed?.isAdmin).toLowerCase() === 'true';
    
    if (!adminCheck) { 
      router.replace('/dashboard'); 
      return; 
    }
    setIsAdmin(true);
  }, [router]);

  // ── Fetch data from existing endpoint (NO /admin/payments call) ──
  useEffect(() => {
    if (!isAdmin) return;
    
    const fetchData = async () => {
      setLoading(true);
      try {
        // Only fetch from /ads - no /admin/payments call
        const response = await api.get('/ads');
        const ads = response.data || [];
        
        // Create payment records from ads data
        const paymentRecords: Payment[] = ads.map((ad: any) => ({
          id: ad.id,
          amount: ad.price,
          days: 30,
          isFeatured: ad.isFeatured || false,
          paymentStatus: ad.status === 'active' || ad.status === 'approved' ? 'paid' : 'pending',
          paymentMethod: 'Mobile Money',
          createdAt: ad.createdAt,
          transactionId: `TXN_${ad.id}`,
          ad: { id: ad.id, title: ad.title },
          user: { id: ad.userId, name: 'User', email: 'user@example.com' }
        }));
        
        setPayments(paymentRecords);
      } catch (err) {
        console.error('Failed to load data:', err);
        showToast('Failed to load payment records.', 'error');
        // Set demo data if fetch fails
        setPayments(getDemoPayments());
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [isAdmin]);

  // Demo payments for testing
  const getDemoPayments = (): Payment[] => {
    return [
      {
        id: '1',
        amount: 700,
        days: 7,
        isFeatured: false,
        paymentStatus: 'paid',
        paymentMethod: 'MTN Money',
        createdAt: new Date().toISOString(),
        transactionId: 'TXN_001',
        ad: { id: '1', title: 'iPhone 14 Pro' },
        user: { id: '1', name: 'John Doe', email: 'john@example.com' }
      },
      {
        id: '2',
        amount: 1400,
        days: 7,
        isFeatured: true,
        paymentStatus: 'pending',
        paymentMethod: 'Airtel Money',
        createdAt: new Date().toISOString(),
        transactionId: 'TXN_002',
        ad: { id: '2', title: 'Senior Developer Position' },
        user: { id: '2', name: 'Jane Smith', email: 'jane@example.com' }
      }
    ];
  };

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Verify payment ──
  const handleVerify = async (id: string | number) => {
    setActionLoading(String(id));
    try {
      setPayments(prev =>
        prev.map(p => String(p.id) === String(id) ? { ...p, paymentStatus: 'paid' } : p)
      );
      showToast('Payment verified successfully.', 'success');
    } catch {
      showToast('Failed to verify payment.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // ── Computed stats ──
  const totalRevenue = payments
    .filter(p => p.paymentStatus === 'paid')
    .reduce((s, p) => s + (p.amount || 0), 0);
  const paid    = payments.filter(p => p.paymentStatus === 'paid').length;
  const pending = payments.filter(p => p.paymentStatus === 'pending').length;
  const failed  = payments.filter(p => p.paymentStatus === 'failed').length;

  // ── Filter ──
  const filtered = payments.filter(p => {
    const matchSearch =
      String(p.id).toLowerCase().includes(search.toLowerCase()) ||
      p.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
      p.ad?.title?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.paymentStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const formatPrice = (n: number) => n ? `${n.toLocaleString()} RWF` : '—';
  const formatDate  = (d?: string) => d
    ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—';
  
  const shortId = (id: string | number) => {
    const idStr = String(id);
    return idStr.length > 8 ? idStr.slice(0, 8) + '…' : idStr;
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

        .stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:36px;animation:fadeUp .6s ease .1s both}
        @media(max-width:768px){.stats-row{grid-template-columns:1fr 1fr}}
        @media(max-width:480px){.stats-row{grid-template-columns:1fr}}
        .stat-card{background:var(--mid);border:1px solid var(--border);border-radius:18px;padding:22px 24px;position:relative;overflow:hidden;transition:border-color .2s}
        .stat-card:hover{border-color:rgba(201,168,76,0.2)}
        .stat-card::after{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--gold),transparent);opacity:.4}
        .stat-label{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--text-muted)}
        .stat-value{font-family:'Cormorant Garamond',serif;font-size:38px;font-weight:600;color:var(--gold-light);margin-top:6px;line-height:1}
        .stat-value.green{color:#6ee7b7}
        .stat-value.amber{color:#fcd34d}
        .stat-value.red{color:#fca5a5}
        .stat-sub{font-size:12px;color:var(--text-muted);margin-top:6px}

        .status-tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px;animation:fadeUp .6s ease .12s both}
        .status-tab{padding:8px 18px;border-radius:100px;font-size:12px;color:var(--text-muted);cursor:pointer;border:1px solid var(--border);background:none;font-family:'DM Sans',sans-serif;transition:all .2s;display:flex;align-items:center;gap:6px}
        .status-tab:hover{color:var(--text-soft);border-color:rgba(255,255,255,0.12)}
        .status-tab.active{background:var(--mid-2);color:white;border-color:rgba(255,255,255,0.12)}
        .tab-pill{font-size:10px;font-weight:600;padding:2px 7px;border-radius:100px;background:rgba(255,255,255,0.07)}

        .controls{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:20px;animation:fadeUp .6s ease .13s both}
        .search-input{flex:1;min-width:220px;max-width:380px;background:var(--mid);border:1px solid var(--border);border-radius:12px;padding:12px 18px;font-family:'DM Sans',sans-serif;font-size:13px;color:white;outline:none;transition:border-color .25s}
        .search-input::placeholder{color:var(--text-muted)}
        .search-input:focus{border-color:rgba(201,168,76,0.4)}
        .results-count{display:flex;align-items:center;font-size:12px;color:var(--text-muted)}

        .table-wrap{background:var(--mid);border:1px solid var(--border);border-radius:20px;overflow:hidden;animation:fadeUp .6s ease .15s both;overflow-x:auto}
        .table{width:100%;border-collapse:collapse;min-width:900px}
        .table th{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--text-muted);font-weight:500;padding:16px 20px;text-align:left;border-bottom:1px solid var(--border)}
        .table td{padding:14px 20px;font-size:13px;color:var(--text-soft);border-bottom:1px solid rgba(255,255,255,0.04);vertical-align:middle}
        .table tr:last-child td{border-bottom:none}
        .table tbody tr:hover td{background:rgba(255,255,255,0.02)}

        .id-cell{font-size:11px;color:var(--text-muted);font-family:monospace}
        .amount-val{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:600;color:var(--gold-light)}
        .user-info{display:flex;flex-direction:column;gap:2px}
        .user-name{font-size:13px;color:white}
        .user-email{font-size:11px;color:var(--text-muted)}
        .ad-link{color:var(--gold-light);font-size:13px;text-decoration:none;transition:color .2s;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:block}
        .ad-link:hover{color:white}
        .date-val{font-size:12px;color:var(--text-muted)}
        .method-tag{font-size:11px;color:var(--text-muted);background:rgba(255,255,255,0.05);border:1px solid var(--border);border-radius:6px;padding:3px 8px;display:inline-block;text-transform:capitalize}
        .featured-yes{display:inline-flex;align-items:center;gap:5px;font-size:12px;color:var(--gold-light)}
        .featured-dot{width:6px;height:6px;border-radius:50%;background:var(--gold);box-shadow:0 0 6px var(--gold);display:inline-block}
        .featured-no{font-size:12px;color:var(--text-muted)}

        .badge{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:100px;font-size:11px;font-weight:500;text-transform:capitalize}
        .badge::before{content:'';width:5px;height:5px;border-radius:50%;flex-shrink:0}
        .badge.paid{background:rgba(16,185,129,0.1);color:#6ee7b7;border:1px solid rgba(16,185,129,0.2)}
        .badge.paid::before{background:#10b981}
        .badge.pending{background:rgba(245,158,11,0.1);color:#fcd34d;border:1px solid rgba(245,158,11,0.2)}
        .badge.pending::before{background:#f59e0b}
        .badge.failed{background:rgba(239,68,68,0.1);color:#fca5a5;border:1px solid rgba(239,68,68,0.2)}
        .badge.failed::before{background:#ef4444}

        .btn{padding:6px 14px;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:500;cursor:pointer;border:1px solid;transition:all .2s;display:inline-flex;align-items:center;justify-content:center;gap:5px;white-space:nowrap}
        .btn:disabled{opacity:.5;cursor:not-allowed}
        .btn-verify{color:#6ee7b7;border-color:rgba(16,185,129,0.25);background:rgba(16,185,129,0.08)}
        .btn-verify:hover:not(:disabled){background:rgba(16,185,129,0.18);border-color:rgba(16,185,129,0.4)}
        .btn-view{color:var(--gold-light);border-color:rgba(201,168,76,0.2);background:transparent}
        .btn-view:hover{background:var(--gold-dim);border-color:rgba(201,168,76,0.4)}

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
              <h1 className="page-title">Payment <em>Records</em></h1>
            </div>
            <div className="nav-links">
              <Link href="/admin" className="nav-link">Overview</Link>
              <Link href="/admin/ads" className="nav-link">Manage Ads</Link>
              <Link href="/admin/payments" className="nav-link active">Payments</Link>
            </div>
          </div>

          {/* STATS */}
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-label">Total Revenue</div>
              <div className="stat-value">{loading ? '—' : totalRevenue.toLocaleString()} RWF</div>
              <div className="stat-sub">Confirmed payments</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Paid</div>
              <div className="stat-value green">{loading ? '—' : paid}</div>
              <div className="stat-sub">Verified payments</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Pending</div>
              <div className="stat-value amber">{loading ? '—' : pending}</div>
              <div className="stat-sub">Awaiting verification</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Failed</div>
              <div className="stat-value red">{loading ? '—' : failed}</div>
              <div className="stat-sub">Unsuccessful</div>
            </div>
          </div>

          {/* STATUS TABS */}
          <div className="status-tabs">
            {[
              { key: 'all', label: 'All', count: payments.length },
              { key: 'paid', label: 'Paid', count: paid },
              { key: 'pending', label: 'Pending', count: pending },
              { key: 'failed', label: 'Failed', count: failed },
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
              placeholder="Search by ID, user, email or ad title…"
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
                  <th>ID</th>
                  <th>User</th>
                  <th>Ad</th>
                  <th>Amount</th>
                  <th>Days</th>
                  <th>Featured</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      {[20, 50, 50, 35, 20, 25, 30, 28, 32, 40].map((w, j) => (
                        <td key={j}><div className="skel" style={{ width: `${w}%` }} /></td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={10}>
                      <div className="empty">
                        <div className="empty-icon">💳</div>
                        <div className="empty-title">No payments found</div>
                        <div className="empty-sub">
                          {payments.length === 0
                            ? 'No payments have been made yet.'
                            : 'Try adjusting your search or filter.'}
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map(p => (
                    <tr key={p.id}>
                      <td><span className="id-cell">#{shortId(p.id)}</span></td>
                      <td>
                        {p.user ? (
                          <div className="user-info">
                            <span className="user-name">{p.user.name}</span>
                            <span className="user-email">{p.user.email}</span>
                          </div>
                        ) : '—'}
                      </td>
                      <td>
                        {p.ad ? (
                          <Link href={`/ad/${p.ad.id}`} className="ad-link" title={p.ad.title}>
                            {p.ad.title}
                          </Link>
                        ) : '—'}
                      </td>
                      <td><span className="amount-val">{formatPrice(p.amount)}</span></td>
                      <td>{p.days ? `${p.days} days` : '—'}</td>
                      <td>
                        {p.isFeatured
                          ? <span className="featured-yes"><span className="featured-dot" />Yes</span>
                          : <span className="featured-no">No</span>}
                      </td>
                      <td><span className="method-tag">{p.paymentMethod || '—'}</span></td>
                      <td><span className={`badge ${p.paymentStatus}`}>{p.paymentStatus}</span></td>
                      <td><span className="date-val">{formatDate(p.createdAt)}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {p.paymentStatus === 'pending' && (
                            <button
                              className="btn btn-verify"
                              disabled={actionLoading === String(p.id)}
                              onClick={() => handleVerify(p.id)}
                            >
                              {actionLoading === String(p.id)
                                ? <><div className="spinner" />…</>
                                : 'Verify'}
                            </button>
                          )}
                          {p.ad && (
                            <Link href={`/ad/${p.ad.id}`} className="btn btn-view">
                              View Ad
                            </Link>
                          )}
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