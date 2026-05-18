'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  isAdmin: boolean;
  status: 'active' | 'blocked';
  createdAt: string;
}

export default function ManageUsers() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // ── Auth guard — admin only ──
  useEffect(() => {
    const token = localStorage.getItem('token');
    const raw = localStorage.getItem('user');
    if (!token) { router.replace('/login'); return; }
    
    const parsed = raw ? JSON.parse(raw) : null;
    const adminCheck = parsed?.isAdmin === true || parsed?.isAdmin === 1 || String(parsed?.isAdmin).toLowerCase() === 'true';
    
    if (!adminCheck) { router.replace('/dashboard'); return; }
    setIsAdmin(true);
  }, [router]);

  // ── Fetch users from existing endpoint ──
  useEffect(() => {
    if (!isAdmin) return;
    
    const fetchUsers = async () => {
      try {
        // Since there's no /admin/users endpoint, we'll use demo data
        // In production, create a GET /api/admin/users endpoint
        const demoUsers: User[] = [
          {
            id: 1,
            name: 'Admin User',
            email: 'admin@herenet.com',
            phone: '+250 788 000 000',
            isAdmin: true,
            status: 'active',
            createdAt: new Date().toISOString()
          },
          {
            id: 2,
            name: 'John Doe',
            email: 'john@gmail.com',
            phone: '+250 788 000 001',
            isAdmin: false,
            status: 'active',
            createdAt: new Date().toISOString()
          },
          {
            id: 3,
            name: 'Jane Smith',
            email: 'jane@example.com',
            phone: '+250 788 000 002',
            isAdmin: false,
            status: 'active',
            createdAt: new Date().toISOString()
          }
        ];
        
        setUsers(demoUsers);
      } catch (err) {
        console.error('Failed to load users:', err);
        showToast('Failed to load users', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [isAdmin]);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleBlockUser = async (userId: number) => {
    setActionLoading(userId);
    try {
      // In production, call API: await api.put(`/admin/users/${userId}/block`);
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, status: u.status === 'active' ? 'blocked' : 'active' } : u
      ));
      showToast('User status updated successfully', 'success');
    } catch {
      showToast('Failed to update user status', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = users.filter(user =>
    user.name?.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        :root {
          --gold:#C9A84C;--gold-light:#E8C97A;--gold-dim:rgba(201,168,76,0.12);
          --dark:#0A0A0C;--dark-2:#111114;--mid:#1C1C22;--mid-2:#222228;
          --text-muted:rgba(255,255,255,0.38);--text-soft:rgba(255,255,255,0.65);--border:rgba(255,255,255,0.07);
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

        .controls{margin-bottom:20px;animation:fadeUp .6s ease .1s both}
        .search-input{width:100%;max-width:360px;background:var(--mid);border:1px solid var(--border);border-radius:12px;padding:12px 18px;font-family:'DM Sans',sans-serif;font-size:13px;color:white;outline:none;transition:border-color .25s}
        .search-input::placeholder{color:var(--text-muted)}
        .search-input:focus{border-color:rgba(201,168,76,0.4)}

        .table-wrap{background:var(--mid);border:1px solid var(--border);border-radius:20px;overflow:hidden;animation:fadeUp .6s ease .14s both;overflow-x:auto}
        .table{width:100%;border-collapse:collapse;min-width:700px}
        .table th{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--text-muted);font-weight:500;padding:16px 20px;text-align:left;border-bottom:1px solid var(--border)}
        .table td{padding:14px 20px;font-size:13px;color:var(--text-soft);border-bottom:1px solid rgba(255,255,255,0.04);vertical-align:middle}
        .table tr:last-child td{border-bottom:none}
        .table tbody tr:hover td{background:rgba(255,255,255,0.02)}
        
        .font-medium{font-weight:500;color:white}
        .badge{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:100px;font-size:11px;font-weight:500}
        .badge::before{content:'';width:5px;height:5px;border-radius:50%;flex-shrink:0}
        .badge.active{background:rgba(16,185,129,0.1);color:#6ee7b7;border:1px solid rgba(16,185,129,0.2)}
        .badge.active::before{background:#10b981}
        .badge.blocked{background:rgba(239,68,68,0.1);color:#fca5a5;border:1px solid rgba(239,68,68,0.2)}
        .badge.blocked::before{background:#ef4444}

        .btn-block{background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);color:#fca5a5;border-radius:8px;padding:6px 14px;font-size:11px;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all .2s}
        .btn-block:hover{background:rgba(239,68,68,0.18);border-color:rgba(239,68,68,0.35)}
        .btn-unblock{background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);color:#6ee7b7;border-radius:8px;padding:6px 14px;font-size:11px;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all .2s}
        .btn-unblock:hover{background:rgba(16,185,129,0.18);border-color:rgba(16,185,129,0.35)}

        .skel-line{height:13px;border-radius:6px;background:linear-gradient(90deg,#1c1c22 25%,#252530 50%,#1c1c22 75%);background-size:200% 100%;animation:shimmer 1.5s infinite}
        @keyframes shimmer{from{background-position:200% 0}to{background-position:-200% 0}}

        .toast{position:fixed;bottom:32px;right:32px;z-index:100;padding:12px 20px;border-radius:12px;font-size:13px;display:flex;align-items:center;gap:10px;animation:slideUp .3s ease}
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

          <div className="topbar">
            <div>
              <div className="eyebrow">Admin Panel</div>
              <h1 className="page-title">Manage <em>Users</em></h1>
            </div>
            <div className="nav-links">
              <Link href="/admin" className="nav-link">📊 Overview</Link>
              <Link href="/admin/ads" className="nav-link">📋 Manage Ads</Link>
              <Link href="/admin/users" className="nav-link active">👥 Manage Users</Link>
              <Link href="/admin/payments" className="nav-link">💳 Payments</Link>
            </div>
          </div>

          <div className="controls">
            <input
              className="search-input"
              placeholder="Search by name or email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      <td><div className="skel-line" style={{ width: '65%' }} /></td>
                      <td><div className="skel-line" style={{ width: '78%' }} /></td>
                      <td><div className="skel-line" style={{ width: '55%' }} /></td>
                      <td><div className="skel-line" style={{ width: '40%' }} /></td>
                      <td><div className="skel-line" style={{ width: '30%' }} /></td>
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                      No users found
                    </td>
                  </tr>
                ) : (
                  filtered.map((user) => (
                    <tr key={user.id}>
                      <td className="font-medium">{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone || '—'}</td>
                      <td>
                        <span className={`badge ${user.status || 'active'}`}>
                          {user.status || 'active'}
                        </span>
                      </td>
                      <td>
                        <button
                          className={user.status === 'blocked' ? 'btn-unblock' : 'btn-block'}
                          onClick={() => handleBlockUser(user.id)}
                          disabled={actionLoading === user.id}
                        >
                          {actionLoading === user.id ? '...' : (user.status === 'blocked' ? 'Unblock' : 'Block')}
                        </button>
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
          <span>{toast.type === 'success' ? '✓' : '⚠️'}</span>
          <span>{toast.msg}</span>
        </div>
      )}
    </>
  );
}