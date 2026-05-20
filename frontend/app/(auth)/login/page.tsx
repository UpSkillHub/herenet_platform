'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const res = await api.post('/auth/login', { email, password });
    const { token, user } = res.data;

    if (!token || !user) {
      throw new Error('Invalid response from server');
    }

    // Persist auth data FIRST, synchronously
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    // Normalize isAdmin — handles true, 1, "true", "1"
    const isAdmin =
      user?.isAdmin === true ||
      user?.isAdmin === 1 ||
      String(user?.isAdmin).toLowerCase() === 'true' ||
      String(user?.isAdmin) === '1';

    // Use replace() so the login page isn't in browser history
    if (isAdmin) {
      router.replace('/admin/dashboard');
    } else {
      router.replace('/dashboard');
    }

  } catch (err: any) {
    const message = err?.response?.data?.message || 'Invalid email or password. Please try again.';
    
    // Check if account is pending approval and OTP was sent
    if (message.includes('pending approval') && message.includes('OTP has been sent')) {
      // Store email for verify-otp page and redirect
      router.replace(`/verify-otp?email=${encodeURIComponent(email)}`);
      return;
    }

    setError(message);
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        :root {
          --gold:#C9A84C; --gold-light:#E8C97A; --gold-dim:rgba(201,168,76,0.12);
          --dark:#0A0A0C; --mid:#1C1C22; --mid-2:#222228;
          --text-muted:rgba(255,255,255,0.38); --text-soft:rgba(255,255,255,0.65);
          --border:rgba(255,255,255,0.07);
        }
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'DM Sans',sans-serif;background:var(--dark);color:white;min-height:100vh}

        .auth-root{min-height:100vh;display:grid;grid-template-columns:1fr 1fr}
        @media(max-width:768px){.auth-root{grid-template-columns:1fr}.auth-panel{display:none!important}}

        /* LEFT PANEL */
        .auth-panel{position:relative;background:var(--mid);overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;padding:56px}
        .panel-video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.2;filter:saturate(.5) brightness(.6)}
        .panel-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,10,12,.3) 0%,rgba(10,10,12,.88) 100%)}
        .grid-panel{position:absolute;inset:0;background-image:linear-gradient(rgba(201,168,76,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,.05) 1px,transparent 1px);background-size:60px 60px;pointer-events:none}
        .orb-panel{position:absolute;width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,rgba(201,168,76,.1) 0%,transparent 70%);top:-100px;left:-100px;filter:blur(50px);pointer-events:none}
        .panel-content{position:relative;z-index:1}
        .panel-logo{font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:600;color:white;letter-spacing:-.02em;text-decoration:none;display:block;margin-bottom:48px}
        .panel-logo em{font-style:italic;color:var(--gold-light)}
        .panel-quote{font-family:'Cormorant Garamond',serif;font-size:clamp(26px,3vw,40px);font-weight:300;line-height:1.15;color:white;letter-spacing:-.02em;margin-bottom:16px}
        .panel-quote em{font-style:italic;color:var(--gold-light)}
        .panel-sub{font-size:14px;font-weight:300;color:var(--text-soft);line-height:1.65;max-width:360px}
        .panel-stats{display:flex;gap:32px;margin-top:36px;padding-top:28px;border-top:1px solid rgba(255,255,255,.08)}
        .panel-stat-num{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:600;color:var(--gold-light);line-height:1}
        .panel-stat-label{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--text-muted);margin-top:4px}

        /* RIGHT FORM */
        .auth-form-side{display:flex;flex-direction:column;justify-content:center;padding:56px 64px;position:relative;overflow:hidden}
        @media(max-width:540px){.auth-form-side{padding:40px 24px}}
        .form-inner{max-width:400px;width:100%;position:relative;z-index:1;animation:fadeUp .7s ease both}

        .mobile-logo{display:none;font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:600;color:white;letter-spacing:-.02em;text-decoration:none;margin-bottom:36px}
        .mobile-logo em{font-style:italic;color:var(--gold-light)}
        @media(max-width:768px){.mobile-logo{display:block}}

        .form-eyebrow{display:inline-flex;align-items:center;gap:8px;background:rgba(201,168,76,.1);border:1px solid rgba(201,168,76,.22);border-radius:100px;padding:5px 14px;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--gold-light);margin-bottom:14px}
        .form-eyebrow::before{content:'';width:5px;height:5px;border-radius:50%;background:var(--gold);box-shadow:0 0 6px var(--gold);animation:pulse 2s ease-in-out infinite}
        @keyframes pulse{0%,100%{opacity:1;box-shadow:0 0 6px var(--gold)}50%{opacity:.5;box-shadow:0 0 14px var(--gold)}}

        .form-title{font-family:'Cormorant Garamond',serif;font-size:clamp(34px,4vw,46px);font-weight:300;line-height:1;letter-spacing:-.02em;color:white;margin-bottom:6px}
        .form-title em{font-style:italic;color:var(--gold-light)}
        .form-sub{font-size:13px;font-weight:300;color:var(--text-muted);margin-bottom:32px;line-height:1.6}

        .field{margin-bottom:18px}
        .field-label{display:block;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--text-muted);margin-bottom:8px;font-weight:500}
        .field-wrap{position:relative}
        .field-input{width:100%;background:var(--mid-2);border:1px solid var(--border);border-radius:12px;padding:15px 20px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:300;color:white;outline:none;transition:border-color .25s,background .25s}
        .field-input::placeholder{color:rgba(255,255,255,.2)}
        .field-input:focus{border-color:rgba(201,168,76,.45);background:#26262d}
        .field-input.with-icon{padding-right:50px}
        .pw-toggle{position:absolute;right:14px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;font-size:16px;color:var(--text-muted);padding:4px;transition:color .2s;line-height:1}
        .pw-toggle:hover{color:var(--text-soft)}

        .forgot-link{display:block;text-align:right;font-size:12px;color:var(--gold-light);text-decoration:none;margin-top:-8px;margin-bottom:24px;transition:color .2s}
        .forgot-link:hover{color:white}

        .error-box{background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.2);border-radius:12px;padding:13px 16px;font-size:13px;color:#fca5a5;margin-bottom:20px;display:flex;align-items:flex-start;gap:8px;line-height:1.5}

        /* Admin hint */
        .admin-hint{display:flex;align-items:center;gap:8px;background:rgba(201,168,76,.06);border:1px solid rgba(201,168,76,.15);border-radius:10px;padding:10px 14px;margin-bottom:20px;font-size:12px;color:var(--text-muted);line-height:1.5}
        .admin-hint strong{color:var(--gold-light);font-weight:400}

        .submit-btn{width:100%;background:linear-gradient(135deg,var(--gold),#8a6020);color:white;border:none;border-radius:12px;padding:17px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;letter-spacing:.04em;cursor:pointer;box-shadow:0 8px 28px rgba(201,168,76,.22);transition:transform .2s,box-shadow .2s,opacity .2s;display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:20px}
        .submit-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 14px 40px rgba(201,168,76,.35)}
        .submit-btn:disabled{opacity:.6;cursor:not-allowed}

        .spinner{width:16px;height:16px;border:2px solid rgba(255,255,255,.25);border-top-color:white;border-radius:50%;animation:spin .7s linear infinite}
        @keyframes spin{to{transform:rotate(360deg)}}

        .divider{display:flex;align-items:center;gap:14px;margin-bottom:18px}
        .divider::before,.divider::after{content:'';flex:1;height:1px;background:var(--border)}
        .divider span{font-size:11px;color:var(--text-muted);letter-spacing:.08em;text-transform:uppercase}

        .google-btn{width:100%;background:var(--mid-2);border:1px solid var(--border);border-radius:12px;padding:14px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:400;color:var(--text-soft);cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;transition:border-color .25s,background .25s,color .25s;margin-bottom:32px}
        .google-btn:hover{border-color:rgba(255,255,255,.14);background:#26262d;color:white}

        .form-footer{text-align:center;font-size:13px;color:var(--text-muted)}
        .form-footer a{color:var(--gold-light);text-decoration:none;font-weight:500;transition:color .2s}
        .form-footer a:hover{color:white}

        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      <div className="auth-root">
        {/* LEFT PANEL - EXACTLY AS YOU HAD */}
        <div className="auth-panel">
          <video className="panel-video" autoPlay muted loop playsInline>
            <source src="/public/videos/herenet.mp4" type="video/mp4" />
          </video>
          <div className="panel-overlay" />
          <div className="grid-panel" />
          <div className="orb-panel" />
          <div className="panel-content">
            <Link href="/" className="panel-logo">Here<em>Net</em></Link>
            <p className="panel-quote">Rwanda's most <em>elegant</em><br />marketplace platform.</p>
            <p className="panel-sub">Post products, services, jobs & opportunities. Connect with thousands of buyers and sellers across Rwanda.</p>
            <div className="panel-stats">
              <div><div className="panel-stat-num">12K+</div><div className="panel-stat-label">Listings</div></div>
              <div><div className="panel-stat-num">8.4K</div><div className="panel-stat-label">Sellers</div></div>
              <div><div className="panel-stat-num">30+</div><div className="panel-stat-label">Districts</div></div>
            </div>
          </div>
        </div>

        {/* RIGHT FORM - EXACTLY AS YOU HAD */}
        <div className="auth-form-side">
          <div className="form-inner">
            <Link href="/" className="mobile-logo">Here<em>Net</em></Link>

            <div className="form-eyebrow">Welcome back</div>
            <h1 className="form-title">Sign <em>in</em></h1>
            <p className="form-sub">Admins are automatically redirected to the admin panel</p>

            <div className="admin-hint">
              🛡️ <span><strong>Admin accounts</strong> redirect to the Admin Dashboard · Regular users go to their Dashboard</span>
            </div>

            {error && <div className="error-box"><span>✕</span><span>{error}</span></div>}

            <form onSubmit={handleLogin}>
              <div className="field">
                <label className="field-label">Email address</label>
                <input
                  type="email" required
                  className="field-input"
                  placeholder="you@email.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                />
              </div>

              <div className="field">
                <label className="field-label">Password</label>
                <div className="field-wrap">
                  <input
                    type={showPw ? 'text' : 'password'} required
                    className="field-input with-icon"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(''); }}
                  />
                  <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)}>
                    {showPw ? '🙈' : '👁'}
                  </button>
                </div>
              </div>

              <a href="#" className="forgot-link">Forgot password?</a>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? <><div className="spinner" />Signing in…</> : 'Sign In →'}
              </button>
            </form>

            <div className="divider"><span>or</span></div>

            <button className="google-btn">
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Continue with Google
            </button>

            <div className="form-footer">
              Don't have an account? <Link href="/register">Create one free →</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}