'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0, revenue: 0, users: 0 });
  const [recentAds, setRecentAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Auth check for admin
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token) {
      router.replace('/login');
      return;
    }
    
    if (userStr) {
      const user = JSON.parse(userStr);
      const isAdmin = user.isAdmin === true || user.isAdmin === 1 || String(user.isAdmin).toLowerCase() === 'true';
      if (!isAdmin) {
        router.replace('/dashboard');
        return;
      }
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch all ads
      const adsRes = await api.get('/ads');
      const ads = adsRes.data || [];
      
      // Calculate stats from ads data
      const pending = ads.filter((a: any) => a.status === 'pending').length;
      const approved = ads.filter((a: any) => a.status === 'approved' || a.status === 'active').length;
      const rejected = ads.filter((a: any) => a.status === 'rejected').length;
      
      // Get recent pending ads (last 5)
      const pendingAds = ads.filter((a: any) => a.status === 'pending').slice(0, 5);
      
      // Calculate estimated revenue (from paid ads)
      const paidAds = ads.filter((a: any) => a.isPaid === true || a.status === 'approved');
      const revenue = paidAds.reduce((sum: number, a: any) => sum + (a.price || 0), 0);
      
      setStats({
        total: ads.length,
        pending,
        approved,
        rejected,
        revenue,
        users: 0, // You can fetch users count from a separate endpoint
      });
      
      setRecentAds(ads.slice(0, 10));
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await api.put(`/ads/${id}/approve`);
      // Update local state
      setRecentAds(prev => prev.map(a => a.id === id ? { ...a, status: 'approved' } : a));
      // Refresh stats
      fetchData();
    } catch (err) {
      console.error('Error approving ad:', err);
      alert('Failed to approve ad. Please try again.');
    }
  };

  const handleReject = async (id: number) => {
    try {
      await api.put(`/ads/${id}/reject`);
      // Update local state
      setRecentAds(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' } : a));
      // Refresh stats
      fetchData();
    } catch (err) {
      console.error('Error rejecting ad:', err);
      alert('Failed to reject ad. Please try again.');
    }
  };

  const pendingAds = recentAds.filter(a => a.status === 'pending');

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        :root {
          --gold:#C9A84C;--gold-light:#E8C97A;--gold-dim:rgba(201,168,76,0.12);
          --dark:#0A0A0C;--dark-2:#111114;--mid:#1C1C22;--mid-2:#222228;
          --text-muted:rgba(255,255,255,0.38);--text-soft:rgba(255,255,255,0.65);--border:rgba(255,255,255,0.07);
        }
        body { font-family:'DM Sans',sans-serif; background:var(--dark); color:white; margin:0; }
        .page { min-height:100vh; background:var(--dark); padding:60px 24px 100px; position:relative; }
        .grid-lines { position:fixed; inset:0; background-image:linear-gradient(rgba(201,168,76,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.025) 1px,transparent 1px); background-size:80px 80px; pointer-events:none; z-index:0; }
        .inner { max-width:1280px; margin:0 auto; position:relative; z-index:1; }
        .topbar { display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:48px; flex-wrap:wrap; gap:20px; animation:fadeUp .7s ease both; }
        .eyebrow { display:inline-flex; align-items:center; gap:8px; background:rgba(201,168,76,0.1); border:1px solid rgba(201,168,76,0.22); border-radius:100px; padding:5px 16px; font-size:10px; letter-spacing:.18em; text-transform:uppercase; color:var(--gold-light); margin-bottom:14px; }
        .eyebrow::before { content:''; width:5px; height:5px; border-radius:50%; background:var(--gold); box-shadow:0 0 6px var(--gold); animation:pulse 2s ease-in-out infinite; }
        @keyframes pulse { 0%,100%{opacity:1;box-shadow:0 0 6px var(--gold)} 50%{opacity:.5;box-shadow:0 0 14px var(--gold)} }
        .page-title { font-family:'Cormorant Garamond',serif; font-size:clamp(36px,6vw,58px); font-weight:300; line-height:1; letter-spacing:-.02em; color:white; }
        .page-title em { font-style:italic; color:var(--gold-light); }
        .nav-links { display:flex; gap:12px; flex-wrap:wrap; }
        .nav-link { display:inline-flex; align-items:center; gap:8px; font-size:12px; letter-spacing:.06em; text-transform:uppercase; color:var(--text-soft); text-decoration:none; padding:10px 18px; border-radius:100px; border:1px solid var(--border); transition:border-color .25s,color .25s,background .25s; }
        .nav-link:hover { border-color:rgba(201,168,76,0.3); color:var(--gold-light); background:var(--gold-dim); }
        .nav-link.active { border-color:rgba(201,168,76,0.35); color:var(--gold-light); background:var(--gold-dim); }
        /* Stats */
        .stats-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-bottom:48px; animation:fadeUp .7s ease .08s both; }
        @media(max-width:768px){.stats-grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:480px){.stats-grid{grid-template-columns:1fr}}
        .stat-card { background:var(--mid); border:1px solid var(--border); border-radius:20px; padding:28px 32px; position:relative; overflow:hidden; transition:border-color .3s,box-shadow .3s; cursor:default; }
        .stat-card::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,var(--gold-dim),transparent 60%); opacity:0; transition:opacity .3s; }
        .stat-card:hover { border-color:rgba(201,168,76,0.2); box-shadow:0 12px 40px rgba(0,0,0,0.4); }
        .stat-card:hover::before { opacity:1; }
        .stat-card::after { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,var(--gold),transparent); opacity:0; transition:opacity .3s; }
        .stat-card:hover::after { opacity:1; }
        .stat-icon { font-size:20px; margin-bottom:14px; display:block; position:relative; z-index:1; }
        .stat-label { font-size:10px; letter-spacing:.14em; text-transform:uppercase; color:var(--text-muted); position:relative; z-index:1; }
        .stat-value { font-family:'Cormorant Garamond',serif; font-size:48px; font-weight:600; line-height:1; margin-top:6px; position:relative; z-index:1; }
        .stat-value.gold { color:var(--gold-light); }
        .stat-value.amber { color:#fcd34d; }
        .stat-value.green { color:#6ee7b7; }
        .stat-value.red { color:#fca5a5; }
        .stat-value.blue { color:#93c5fd; }
        .stat-sub { font-size:12px; color:var(--text-muted); margin-top:6px; position:relative; z-index:1; }
        /* Table */
        .section-header { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:20px; animation:fadeUp .7s ease .14s both; }
        .section-title { font-family:'Cormorant Garamond',serif; font-size:32px; font-weight:400; letter-spacing:-.02em; color:white; }
        .section-link { font-size:12px; letter-spacing:.08em; text-transform:uppercase; color:var(--gold-light); text-decoration:none; display:flex; align-items:center; gap:6px; transition:gap .2s; }
        .section-link:hover { gap:10px; }
        .table-wrap { background:var(--mid); border:1px solid var(--border); border-radius:20px; overflow:hidden; animation:fadeUp .7s ease .18s both; }
        .table { width:100%; border-collapse:collapse; }
        .table th { font-size:10px; letter-spacing:.14em; text-transform:uppercase; color:var(--text-muted); font-weight:500; padding:16px 20px; text-align:left; border-bottom:1px solid var(--border); }
        .table td { padding:16px 20px; font-size:13px; color:var(--text-soft); border-bottom:1px solid rgba(255,255,255,0.04); vertical-align:middle; }
        .table tr:last-child td { border-bottom:none; }
        .table tr:hover td { background:rgba(255,255,255,0.02); }
        .ad-title-cell { font-size:14px; font-weight:400; color:rgba(255,255,255,0.88); max-width:200px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .badge { display:inline-flex; align-items:center; gap:5px; font-size:9px; letter-spacing:.1em; text-transform:uppercase; padding:4px 10px; border-radius:100px; font-weight:500; }
        .badge.pending { background:rgba(251,191,36,0.12); border:1px solid rgba(251,191,36,0.25); color:#fcd34d; }
        .badge.approved, .badge.active { background:rgba(16,185,129,0.12); border:1px solid rgba(16,185,129,0.25); color:#6ee7b7; }
        .badge.rejected { background:rgba(239,68,68,0.12); border:1px solid rgba(239,68,68,0.25); color:#fca5a5; }
        .badge.expired { background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:var(--text-muted); }
        .badge::before { content:''; width:4px; height:4px; border-radius:50%; background:currentColor; }
        .action-btns { display:flex; gap:8px; }
        .btn-approve { background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.25); color:#6ee7b7; border-radius:8px; padding:6px 14px; font-size:11px; font-family:'DM Sans',sans-serif; cursor:pointer; transition:background .2s,transform .15s; }
        .btn-approve:hover { background:rgba(16,185,129,0.2); transform:scale(1.03); }
        .btn-reject { background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.2); color:#fca5a5; border-radius:8px; padding:6px 14px; font-size:11px; font-family:'DM Sans',sans-serif; cursor:pointer; transition:background .2s,transform .15s; }
        .btn-reject:hover { background:rgba(239,68,68,0.18); transform:scale(1.03); }
        .error-message { background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); color:#fca5a5; padding:12px 20px; border-radius:12px; margin-bottom:20px; text-align:center; }
        .skel-line { height:14px; border-radius:6px; background:linear-gradient(90deg,#1c1c22 25%,#252530 50%,#1c1c22 75%); background-size:200% 100%; animation:shimmer 1.5s infinite; margin:4px 0; }
        .logout-btn { background:none; border:1px solid var(--border); border-radius:8px; padding:8px 16px; font-family:'DM Sans',sans-serif; font-size:12px; color:var(--text-muted); cursor:pointer; transition:all .2s; margin-left:12px; }
        .logout-btn:hover { border-color:rgba(255,255,255,0.14); color:white; }
        @keyframes shimmer { from{background-position:200% 0} to{background-position:-200% 0} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        .price-cell { font-family:'Cormorant Garamond',serif; font-size:18px; font-weight:600; color:var(--gold-light); }
      `}</style>

      <div className="page">
        <div className="grid-lines" />
        <div className="inner">
          <div className="topbar">
            <div>
              <div className="eyebrow">Admin Panel</div>
              <h1 className="page-title">System <em>Overview</em></h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="nav-links">
                <Link href="/admin" className="nav-link active">📊 Overview</Link>
                <Link href="/admin/ads" className="nav-link">📋 Manage Ads</Link>
                <Link href="/admin/payments" className="nav-link">💳 Payments</Link>
              </div>
              <button
                className="logout-btn"
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  router.replace('/login');
                }}
              >
                Logout
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-icon">📋</span>
              <div className="stat-label">Total Ads</div>
              <div className="stat-value gold">{loading ? '—' : stats.total}</div>
              <div className="stat-sub">All submissions</div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">⏳</span>
              <div className="stat-label">Pending Review</div>
              <div className="stat-value amber">{loading ? '—' : stats.pending}</div>
              <div className="stat-sub">Awaiting approval</div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">✅</span>
              <div className="stat-label">Approved & Live</div>
              <div className="stat-value green">{loading ? '—' : stats.approved}</div>
              <div className="stat-sub">Currently active</div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">❌</span>
              <div className="stat-label">Rejected</div>
              <div className="stat-value red">{loading ? '—' : stats.rejected}</div>
              <div className="stat-sub">Declined ads</div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">💰</span>
              <div className="stat-label">Total Revenue</div>
              <div className="stat-value blue">{loading ? '—' : `${stats.revenue.toLocaleString()} RWF`}</div>
              <div className="stat-sub">Collected from ads</div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">📊</span>
              <div className="stat-label">Approval Rate</div>
              <div className="stat-value gold">
                {loading || stats.total === 0 ? '—' : `${Math.round((stats.approved / stats.total) * 100)}%`}
              </div>
              <div className="stat-sub">Of all submissions</div>
            </div>
          </div>

          {/* Recent Pending Ads */}
          <div className="section-header">
            <h2 className="section-title">Pending Approvals</h2>
            <Link href="/admin/ads" className="section-link">View All →</Link>
          </div>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Ad Title</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(4)].map((_, i) => (
                    <tr key={i}>
                      {[...Array(6)].map((_, j) => (
                        <td key={j}><div className="skel-line" style={{ width: `${65 + (j * 5)}%` }} /></td>
                      ))}
                    </tr>
                  ))
                ) : pendingAds.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>✨ No pending ads! Everything is approved.</td></tr>
                ) : (
                  pendingAds.map((ad: any) => (
                    <tr key={ad.id}>
                      <td><div className="ad-title-cell">{ad.title}</div></td>
                      <td>{ad.categoryId}</td>
                      <td>{ad.location || '—'}</td>
                      <td><span className="price-cell">{(ad.price || 0).toLocaleString()}</span> <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>RWF</span></td>
                      <td><span className={`badge ${ad.status}`}>{ad.status}</span></td>
                      <td>
                        <div className="action-btns">
                          <button className="btn-approve" onClick={() => handleApprove(ad.id)}>✓ Approve</button>
                          <button className="btn-reject" onClick={() => handleReject(ad.id)}>✕ Reject</button>
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
    </>
  );
}