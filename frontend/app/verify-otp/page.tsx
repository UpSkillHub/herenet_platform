'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';

export default function VerifyOtpPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  // Pre-fill email if passed as query param: /verify-otp?email=user@example.com
  const [email, setEmail]     = useState(searchParams.get('email') || '');
  const [otp, setOtp]         = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError]     = useState('');
  const [otpResent, setOtpResent] = useState(false);
  const [success, setSuccess] = useState(false);

  // ── OTP box helpers ──
  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    setError('');
    if (val && i < 5) document.getElementById(`otp-${i + 1}`)?.focus();
  };

  const handleOtpKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0)
      document.getElementById(`otp-${i - 1}`)?.focus();
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (text.length === 6) {
      setOtp(text.split(''));
      document.getElementById('otp-5')?.focus();
    }
  };

  const otpCode   = otp.join('');
  const otpFilled = otpCode.length === 6;

  // ── Verify ──
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError('Please enter your email address.'); return; }
    if (!otpFilled) { setError('Please enter the full 6-digit code.'); return; }

    setLoading(true);
    setError('');
    try {
      // ✅ Uses shared api instance — no raw axios, no hardcoded URL
      const res = await api.post('/auth/verify-otp', { email, otp: otpCode });

      if (res.data?.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user || {}));
      }

      setSuccess(true);
      setTimeout(() => router.replace('/dashboard'), 2000);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        'Invalid or expired OTP. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Resend ──
  const handleResend = async () => {
    if (!email) { setError('Enter your email first.'); return; }
    setResending(true);
    setError('');
    setOtpResent(false);
    try {
      await api.post('/auth/resend-otp', { email });
      setOtpResent(true);
      setOtp(['', '', '', '', '', '']);
      setTimeout(() => document.getElementById('otp-0')?.focus(), 50);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        'Failed to resend OTP. Please try again.'
      );
    } finally {
      setResending(false);
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

        .page{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 24px;position:relative}

        /* GRID BG */
        .grid-bg{position:fixed;inset:0;background-image:linear-gradient(rgba(201,168,76,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.025) 1px,transparent 1px);background-size:80px 80px;pointer-events:none;z-index:0}
        .orb{position:fixed;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(201,168,76,0.06) 0%,transparent 70%);top:-150px;right:-150px;filter:blur(60px);pointer-events:none;z-index:0}

        /* CARD */
        .card{width:100%;max-width:440px;position:relative;z-index:1;animation:fadeUp .7s ease both}

        /* LOGO */
        .logo{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:600;color:white;letter-spacing:-.02em;text-decoration:none;display:block;text-align:center;margin-bottom:36px}
        .logo em{font-style:italic;color:var(--gold-light)}

        /* EYEBROW */
        .eyebrow{display:inline-flex;align-items:center;gap:8px;background:rgba(201,168,76,0.1);border:1px solid rgba(201,168,76,0.22);border-radius:100px;padding:5px 14px;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--gold-light);margin-bottom:14px}
        .eyebrow::before{content:'';width:5px;height:5px;border-radius:50%;background:var(--gold);box-shadow:0 0 6px var(--gold);animation:pulse 2s ease-in-out infinite}
        @keyframes pulse{0%,100%{opacity:1;box-shadow:0 0 6px var(--gold)}50%{opacity:.5;box-shadow:0 0 14px var(--gold)}}

        .form-title{font-family:'Cormorant Garamond',serif;font-size:clamp(34px,5vw,46px);font-weight:300;line-height:1;letter-spacing:-.02em;margin-bottom:8px}
        .form-title em{font-style:italic;color:var(--gold-light)}
        .form-sub{font-size:13px;font-weight:300;color:var(--text-muted);margin-bottom:32px;line-height:1.6}
        .form-sub strong{color:var(--text-soft);font-weight:400}

        /* EMAIL FIELD */
        .field{margin-bottom:20px}
        .field-label{display:block;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--text-muted);margin-bottom:8px;font-weight:500}
        .field-input{width:100%;background:var(--mid-2);border:1px solid var(--border);border-radius:12px;padding:14px 18px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:300;color:white;outline:none;transition:border-color .25s,background .25s}
        .field-input::placeholder{color:rgba(255,255,255,0.2)}
        .field-input:focus{border-color:rgba(201,168,76,0.45);background:#26262d}

        /* OTP BOXES */
        .otp-label{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--text-muted);margin-bottom:12px;font-weight:500;display:block}
        .otp-row{display:flex;gap:10px;justify-content:center;margin-bottom:8px}
        .otp-box{width:56px;height:66px;background:var(--mid-2);border:1px solid var(--border);border-radius:14px;font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:600;color:var(--gold-light);text-align:center;outline:none;caret-color:var(--gold);transition:border-color .25s,background .25s,transform .15s}
        .otp-box:focus{border-color:rgba(201,168,76,0.5);background:#26262d;transform:scale(1.05)}
        .otp-box.filled{border-color:rgba(201,168,76,0.3)}
        @media(max-width:380px){.otp-box{width:44px;height:54px;font-size:26px}}

        /* MESSAGES */
        .msg{border-radius:12px;padding:12px 16px;font-size:13px;margin-bottom:18px;display:flex;align-items:flex-start;gap:8px;line-height:1.5}
        .msg.error{background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);color:#fca5a5}
        .msg.info{background:rgba(201,168,76,0.06);border:1px solid rgba(201,168,76,0.18);color:var(--gold-light)}

        /* OTP ACTIONS */
        .otp-actions{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;margin-top:6px}
        .back-btn{background:none;border:none;color:var(--text-muted);font-family:'DM Sans',sans-serif;font-size:13px;cursor:pointer;padding:0;transition:color .2s;display:flex;align-items:center;gap:4px}
        .back-btn:hover{color:var(--text-soft)}
        .resend-btn{background:none;border:none;color:var(--gold-light);font-family:'DM Sans',sans-serif;font-size:13px;cursor:pointer;padding:0;transition:color .2s}
        .resend-btn:hover:not(:disabled){color:white}
        .resend-btn:disabled{opacity:.5;cursor:not-allowed}

        /* SUBMIT */
        .submit-btn{width:100%;background:linear-gradient(135deg,var(--gold),#8a6020);color:white;border:none;border-radius:12px;padding:17px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;letter-spacing:.04em;cursor:pointer;box-shadow:0 8px 28px rgba(201,168,76,0.22);transition:transform .2s,box-shadow .2s,opacity .2s;display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:20px}
        .submit-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 14px 40px rgba(201,168,76,0.35)}
        .submit-btn:disabled{opacity:.6;cursor:not-allowed}
        .spinner{width:16px;height:16px;border:2px solid rgba(255,255,255,0.25);border-top-color:white;border-radius:50%;animation:spin .7s linear infinite}
        @keyframes spin{to{transform:rotate(360deg)}}

        /* SUCCESS */
        .success-screen{text-align:center;padding:20px 0}
        .success-icon{width:72px;height:72px;border-radius:50%;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);display:flex;align-items:center;justify-content:center;font-size:32px;margin:0 auto 24px;animation:popIn .5s ease both}
        @keyframes popIn{from{transform:scale(0.5);opacity:0}to{transform:scale(1);opacity:1}}
        .success-title{font-family:'Cormorant Garamond',serif;font-size:36px;font-weight:300;color:white;margin-bottom:10px}
        .success-title em{font-style:italic;color:#6ee7b7}
        .success-sub{font-size:14px;color:var(--text-muted);margin-bottom:28px;line-height:1.6}
        .redirect-bar{height:3px;background:var(--border);border-radius:2px;overflow:hidden;margin-bottom:6px}
        .redirect-fill{height:100%;background:linear-gradient(90deg,var(--gold),#6ee7b7);border-radius:2px;animation:fillBar 2s linear forwards}
        @keyframes fillBar{from{width:0%}to{width:100%}}
        .redirect-note{font-size:12px;color:var(--text-muted);text-align:center}

        .form-footer{text-align:center;font-size:13px;color:var(--text-muted)}
        .form-footer a{color:var(--gold-light);text-decoration:none;font-weight:500;transition:color .2s}
        .form-footer a:hover{color:white}

        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      <div className="page">
        <div className="grid-bg" />
        <div className="orb" />

        <div className="card">
          <Link href="/" className="logo">Here<em>Net</em></Link>

          {success ? (
            /* ── SUCCESS STATE ── */
            <div className="success-screen">
              <div className="success-icon">✓</div>
              <h1 className="success-title">Email <em>verified!</em></h1>
              <p className="success-sub">
                Your account is now active.<br />
                Redirecting you to your dashboard…
              </p>
              <div className="redirect-bar">
                <div className="redirect-fill" />
              </div>
              <p className="redirect-note">Redirecting in 2 seconds…</p>
            </div>
          ) : (
            /* ── VERIFY FORM ── */
            <>
              <div className="eyebrow">Email verification</div>
              <h1 className="form-title">Check your <em>inbox</em></h1>
              <p className="form-sub">
                {email
                  ? <>We sent a 6-digit code to <strong>{email}</strong>. It expires in 10 minutes.</>
                  : <>Enter your email and the 6-digit code we sent you.</>}
              </p>

              {error    && <div className="msg error"><span>✕</span><span>{error}</span></div>}
              {otpResent && <div className="msg info"><span>📨</span><span>A new OTP has been sent to your email.</span></div>}

              <form onSubmit={handleVerify}>
                {/* Only show email field if not pre-filled from query param */}
                {!searchParams.get('email') && (
                  <div className="field">
                    <label className="field-label">Email address</label>
                    <input
                      type="email"
                      required
                      className="field-input"
                      placeholder="you@email.com"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setError(''); }}
                    />
                  </div>
                )}

                <span className="otp-label">6-digit code</span>
                <div className="otp-row" onPaste={handleOtpPaste}>
                  {otp.map((d, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      className={`otp-box${d ? ' filled' : ''}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={d}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKey(i, e)}
                      autoFocus={i === 0}
                    />
                  ))}
                </div>

                <div className="otp-actions">
                  <Link href="/register" className="back-btn">← Back to register</Link>
                  <button
                    type="button"
                    className="resend-btn"
                    disabled={resending}
                    onClick={handleResend}
                  >
                    {resending ? 'Sending…' : 'Resend code'}
                  </button>
                </div>

                <button
                  type="submit"
                  className="submit-btn"
                  disabled={loading || !otpFilled}
                >
                  {loading
                    ? <><div className="spinner" />Verifying…</>
                    : 'Verify & Continue →'}
                </button>
              </form>

              <div className="form-footer">
                Already verified? <Link href="/login">Sign in →</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}