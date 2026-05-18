'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

type Step = 'register' | 'otp' | 'success';

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirm: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('register');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [otpResent, setOtpResent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const [form, setForm] = useState<FormData>({
    name: '', email: '', phone: '', password: '', confirm: '',
  });

  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const setFormField = (field: keyof FormData, val: string) => {
    setError('');
    setForm(prev => ({ ...prev, [field]: val }));
  };

  // ── Password strength ──
  const getPwStrength = (pw: string) => {
    if (pw.length === 0) return 0;
    if (pw.length < 6) return 1;
    if (pw.length < 10) return 2;
    return 3;
  };
  const pwStrength = getPwStrength(form.password);
  const pwStrengthLabel = ['', 'Too short', 'Could be stronger', 'Strong password ✓'];
  const pwStrengthColors = ['', '#ef4444', '#f59e0b', '#10b981'];

  // ── OTP input helpers ──
  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) {
      const nextInput = document.getElementById(`otp-${i + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      const prevInput = document.getElementById(`otp-${i - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (text.length === 6) {
      setOtp(text.split(''));
      const lastInput = document.getElementById('otp-5');
      if (lastInput) lastInput.focus();
    }
  };

  // ── REGISTER ──
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      setStep('otp');
      setCountdown(60); // Start 60 second countdown
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        'Registration failed. This email may already be registered.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ── VERIFY OTP ──
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) { 
      setError('Please enter the full 6-digit code.'); 
      return; 
    }

    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/verify-otp', { email: form.email, otp: code });

      if (res.data?.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user || {}));
      }
      setStep('success');
      setTimeout(() => router.replace('/dashboard'), 2000);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        'Invalid OTP. Please check and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ── RESEND OTP ──
  const handleResend = async () => {
    if (countdown > 0) return;
    
    setError('');
    setOtpResent(false);
    setLoading(true);
    try {
      await api.post('/auth/resend-otp', { email: form.email });
      setOtpResent(true);
      setOtp(['', '', '', '', '', '']);
      setCountdown(60);
      setTimeout(() => {
        const firstInput = document.getElementById('otp-0');
        if (firstInput) firstInput.focus();
      }, 50);
    } catch (err: any) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const otpFilled = otp.join('').length === 6;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

        :root {
          --gold: #C9A84C; --gold-light: #E8C97A; --gold-dim: rgba(201,168,76,0.12);
          --dark: #0A0A0C; --mid: #1C1C22; --mid-2: #222228;
          --text-muted: rgba(255,255,255,0.38); --text-soft: rgba(255,255,255,0.65);
          --border: rgba(255,255,255,0.07);
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: var(--dark); color: white; min-height: 100vh; }

        .auth-root { min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; }
        @media (max-width: 768px) { .auth-root { grid-template-columns: 1fr; } .auth-panel { display: none !important; } }

        /* ── LEFT PANEL ── */
        .auth-panel { position: relative; background: var(--mid); overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; padding: 56px; }
        .panel-video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.2; filter: saturate(0.5) brightness(0.6); }
        .panel-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(10,10,12,0.3) 0%, rgba(10,10,12,0.88) 100%); }
        .grid-lines-panel { position: absolute; inset: 0; background-image: linear-gradient(rgba(201,168,76,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.05) 1px, transparent 1px); background-size: 60px 60px; pointer-events: none; }
        .orb-panel { position: absolute; width: 350px; height: 350px; border-radius: 50%; background: radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%); bottom: -80px; right: -80px; filter: blur(50px); pointer-events: none; }
        .panel-top, .panel-bottom { position: relative; z-index: 1; }
        .panel-logo { font-family: 'Cormorant Garamond', serif; font-size: 30px; font-weight: 600; color: white; letter-spacing: -0.02em; text-decoration: none; display: block; margin-bottom: 44px; }
        .panel-logo em { font-style: italic; color: var(--gold-light); }

        .steps-label { font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 20px; }
        .steps-list { display: flex; flex-direction: column; }
        .step-item { display: flex; align-items: flex-start; gap: 14px; padding: 18px 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .step-item:last-child { border-bottom: none; }
        .step-num { width: 30px; height: 30px; border-radius: 50%; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 500; color: var(--text-muted); flex-shrink: 0; transition: all 0.4s; }
        .step-item.active .step-num { border-color: var(--gold); background: var(--gold-dim); color: var(--gold-light); box-shadow: 0 0 14px rgba(201,168,76,0.25); }
        .step-item.done .step-num { border-color: rgba(110,231,183,0.4); background: rgba(110,231,183,0.08); color: #6ee7b7; }
        .step-info { padding-top: 5px; }
        .step-title { font-size: 14px; color: var(--text-muted); transition: color 0.3s; }
        .step-item.active .step-title { color: white; font-weight: 400; }
        .step-item.done .step-title { color: #6ee7b7; }
        .step-desc { font-size: 12px; color: var(--text-muted); margin-top: 3px; line-height: 1.5; }

        .panel-tagline { font-family: 'Cormorant Garamond', serif; font-size: clamp(22px, 2.8vw, 32px); font-weight: 300; color: white; line-height: 1.2; letter-spacing: -0.02em; margin-bottom: 10px; }
        .panel-tagline em { font-style: italic; color: var(--gold-light); }
        .panel-note { font-size: 13px; font-weight: 300; color: var(--text-muted); margin-top: 8px; line-height: 1.6; }
        .panel-note strong { color: var(--gold-light); font-weight: 400; }

        /* ── RIGHT FORM ── */
        .auth-form-side { display: flex; flex-direction: column; justify-content: center; padding: 56px 64px; position: relative; overflow: hidden; }
        @media (max-width: 540px) { .auth-form-side { padding: 40px 24px; } }

        .form-inner { max-width: 420px; width: 100%; position: relative; z-index: 1; animation: fadeUp 0.7s ease both; }

        .mobile-logo { display: none; font-family: 'Cormorant Garamond', serif; font-size: 26px; font-weight: 600; color: white; letter-spacing: -0.02em; text-decoration: none; margin-bottom: 32px; }
        .mobile-logo em { font-style: italic; color: var(--gold-light); }
        @media (max-width: 768px) { .mobile-logo { display: block; } }

        .form-eyebrow { display: inline-flex; align-items: center; gap: 8px; background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.22); border-radius: 100px; padding: 5px 14px; font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--gold-light); margin-bottom: 12px; }
        .form-eyebrow::before { content: ''; width: 5px; height: 5px; border-radius: 50%; background: var(--gold); box-shadow: 0 0 6px var(--gold); animation: pulse 2s ease-in-out infinite; }
        @keyframes pulse { 0%,100%{opacity:1;box-shadow:0 0 6px var(--gold)}50%{opacity:.5;box-shadow:0 0 14px var(--gold)} }

        .form-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(32px, 4vw, 44px); font-weight: 300; line-height: 1; letter-spacing: -0.02em; color: white; margin-bottom: 6px; }
        .form-title em { font-style: italic; color: var(--gold-light); }
        .form-sub { font-size: 13px; font-weight: 300; color: var(--text-muted); margin-bottom: 26px; line-height: 1.6; }
        .form-sub strong { color: rgba(255,255,255,0.65); font-weight: 400; }

        .field { margin-bottom: 14px; }
        .field-label { display: block; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 7px; font-weight: 500; }
        .field-wrap { position: relative; }
        .field-input { width: 100%; background: var(--mid-2); border: 1px solid var(--border); border-radius: 12px; padding: 14px 18px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 300; color: white; outline: none; transition: border-color 0.25s, background 0.25s; }
        .field-input::placeholder { color: rgba(255,255,255,0.2); }
        .field-input:focus { border-color: rgba(201,168,76,0.45); background: #26262d; }
        .field-input.with-icon { padding-right: 48px; }
        .field-input.error-field { border-color: rgba(239,68,68,0.4); }

        .pw-strength { display: flex; gap: 4px; margin-top: 6px; }
        .pw-bar { flex: 1; height: 3px; border-radius: 2px; background: rgba(255,255,255,0.08); transition: background 0.3s; }
        .pw-hint { font-size: 11px; color: var(--text-muted); margin-top: 5px; transition: color 0.3s; }

        .pw-toggle { position: absolute; right: 13px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: 15px; color: var(--text-muted); padding: 4px; transition: color 0.2s; line-height: 1; }
        .pw-toggle:hover { color: var(--text-soft); }

        .fields-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media (max-width: 480px) { .fields-row { grid-template-columns: 1fr; } }

        .msg { border-radius: 12px; padding: 12px 16px; font-size: 13px; margin-bottom: 16px; display: flex; align-items: flex-start; gap: 8px; line-height: 1.5; }
        .msg.error { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); color: #fca5a5; }
        .msg.success { background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.2); color: #6ee7b7; }
        .msg.info { background: rgba(201,168,76,0.06); border: 1px solid rgba(201,168,76,0.18); color: var(--gold-light); }

        .submit-btn { width: 100%; background: linear-gradient(135deg, var(--gold), #8a6020); color: white; border: none; border-radius: 12px; padding: 17px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; letter-spacing: 0.04em; cursor: pointer; box-shadow: 0 8px 28px rgba(201,168,76,0.22); transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s; display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 8px; margin-bottom: 18px; }
        .submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 40px rgba(201,168,76,0.35); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.25); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .divider { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
        .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }
        .divider span { font-size: 11px; color: var(--text-muted); letter-spacing: 0.08em; text-transform: uppercase; }

        .google-btn { width: 100%; background: var(--mid-2); border: 1px solid var(--border); border-radius: 12px; padding: 13px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 400; color: var(--text-soft); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: border-color 0.25s, background 0.25s, color 0.25s; margin-bottom: 24px; }
        .google-btn:hover { border-color: rgba(255,255,255,0.14); background: #26262d; color: white; }

        .terms-note { font-size: 11px; color: var(--text-muted); text-align: center; line-height: 1.6; margin-bottom: 6px; }
        .terms-note a { color: var(--gold-light); text-decoration: none; transition: color 0.2s; }
        .terms-note a:hover { color: white; }

        .form-footer { text-align: center; font-size: 13px; color: var(--text-muted); margin-top: 20px; }
        .form-footer a { color: var(--gold-light); text-decoration: none; font-weight: 500; transition: color 0.2s; }
        .form-footer a:hover { color: white; }

        .otp-row { display: flex; gap: 10px; justify-content: center; margin: 24px 0; }
        .otp-box { width: 54px; height: 64px; background: var(--mid-2); border: 1px solid var(--border); border-radius: 14px; font-family: 'Cormorant Garamond', serif; font-size: 30px; font-weight: 600; color: var(--gold-light); text-align: center; outline: none; caret-color: var(--gold); transition: border-color 0.25s, background 0.25s, transform 0.15s; }
        .otp-box:focus { border-color: rgba(201,168,76,0.5); background: #26262d; transform: scale(1.05); }
        .otp-box.filled { border-color: rgba(201,168,76,0.3); }

        .otp-actions { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .resend-btn { background: none; border: none; color: var(--gold-light); font-family: 'DM Sans', sans-serif; font-size: 13px; cursor: pointer; padding: 0; transition: color 0.2s; opacity: ${countdown > 0 ? 0.5 : 1}; }
        .resend-btn:hover { color: white; }
        .countdown-text { font-size: 12px; color: var(--text-muted); margin-left: 8px; }
        .back-btn { background: none; border: none; color: var(--text-muted); font-family: 'DM Sans', sans-serif; font-size: 13px; cursor: pointer; padding: 0; transition: color 0.2s; display: flex; align-items: center; gap: 4px; }
        .back-btn:hover { color: var(--text-soft); }

        .success-screen { text-align: center; padding: 20px 0; }
        .success-icon { width: 72px; height: 72px; border-radius: 50%; background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); display: flex; align-items: center; justify-content: center; font-size: 32px; margin: 0 auto 24px; animation: popIn 0.5s ease both; }
        @keyframes popIn { from{transform:scale(0.5);opacity:0}to{transform:scale(1);opacity:1} }
        .success-title { font-family: 'Cormorant Garamond', serif; font-size: 36px; font-weight: 300; color: white; margin-bottom: 10px; }
        .success-title em { font-style: italic; color: #6ee7b7; }
        .success-sub { font-size: 14px; color: var(--text-muted); margin-bottom: 28px; line-height: 1.6; }
        .redirect-bar { height: 3px; background: var(--border); border-radius: 2px; overflow: hidden; margin-bottom: 6px; }
        .redirect-fill { height: 100%; background: linear-gradient(90deg, var(--gold), #6ee7b7); border-radius: 2px; animation: fillBar 2s linear forwards; }
        @keyframes fillBar { from{width:0%}to{width:100%} }
        .redirect-note { font-size: 12px; color: var(--text-muted); text-align: center; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="auth-root">

        {/* ── LEFT PANEL ── */}
        <div className="auth-panel">
          <video className="panel-video" autoPlay muted loop playsInline>
            <source src="/stock-footage-e-commerce-marketplaces-online-places-to-buy-or-sell-products-on-the-internet.mp4" type="video/mp4" />
          </video>
          <div className="panel-overlay" />
          <div className="grid-lines-panel" />
          <div className="orb-panel" />

          <div className="panel-top">
            <Link href="/" className="panel-logo">Here<em>Net</em></Link>
            <div className="steps-label">How it works</div>
            <div className="steps-list">
              <div className={`step-item ${step === 'register' ? 'active' : step === 'otp' || step === 'success' ? 'done' : ''}`}>
                <div className="step-num">{step !== 'register' && step !== 'otp' && step !== 'success' ? '1' : step === 'register' ? '1' : '✓'}</div>
                <div className="step-info">
                  <div className="step-title">Create your account</div>
                  <div className="step-desc">Enter your name, email &amp; phone</div>
                </div>
              </div>
              <div className={`step-item ${step === 'otp' ? 'active' : step === 'success' ? 'done' : ''}`}>
                <div className="step-num">{step === 'success' ? '✓' : '2'}</div>
                <div className="step-info">
                  <div className="step-title">Verify your email</div>
                  <div className="step-desc">Enter the OTP sent to your inbox</div>
                </div>
              </div>
              <div className={`step-item ${step === 'success' ? 'active' : ''}`}>
                <div className="step-num">3</div>
                <div className="step-info">
                  <div className="step-title">Start posting ads</div>
                  <div className="step-desc">Reach thousands of buyers across Rwanda</div>
                </div>
              </div>
            </div>
          </div>

          <div className="panel-bottom">
            <p className="panel-tagline">Post your first ad for <em>only 100 RWF</em></p>
            <p className="panel-note">
              Featured listings from <strong>200 RWF/day</strong><br />
              Reach <strong>12,000+ active buyers</strong> across 30+ districts
            </p>
          </div>
        </div>

        {/* ── RIGHT FORM ── */}
        <div className="auth-form-side">
          <div className="form-inner">

            <Link href="/" className="mobile-logo">Here<em>Net</em></Link>

            {/* ── STEP 1: REGISTER ── */}
            {step === 'register' && (
              <>
                <div className="form-eyebrow">Join HereNet</div>
                <h1 className="form-title">Create <em>account</em></h1>
                <p className="form-sub">Free to join · Start posting ads today</p>

                {error && (
                  <div className="msg error">
                    <span>✕</span><span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleRegister}>
                  <div className="field">
                    <label className="field-label">Full name</label>
                    <input
                      type="text" required
                      className="field-input"
                      placeholder="Jean Pierre Uwimana"
                      value={form.name}
                      onChange={e => setFormField('name', e.target.value)}
                    />
                  </div>

                  <div className="field">
                    <label className="field-label">Email address</label>
                    <input
                      type="email" required
                      className="field-input"
                      placeholder="you@email.com"
                      value={form.email}
                      onChange={e => setFormField('email', e.target.value)}
                    />
                  </div>

                  <div className="field">
                    <label className="field-label">Phone number</label>
                    <input
                      type="tel" required
                      className="field-input"
                      placeholder="+250 7XX XXX XXX"
                      value={form.phone}
                      onChange={e => setFormField('phone', e.target.value)}
                    />
                  </div>

                  <div className="fields-row">
                    <div className="field">
                      <label className="field-label">Password</label>
                      <div className="field-wrap">
                        <input
                          type={showPw ? 'text' : 'password'}
                          required minLength={8}
                          className="field-input with-icon"
                          placeholder="Min. 8 chars"
                          value={form.password}
                          onChange={e => setFormField('password', e.target.value)}
                        />
                        <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)}>
                          {showPw ? '🙈' : '👁'}
                        </button>
                      </div>
                      {form.password.length > 0 && (
                        <>
                          <div className="pw-strength">
                            <div className="pw-bar" style={{ background: pwStrength >= 1 ? pwStrengthColors[pwStrength] : undefined }} />
                            <div className="pw-bar" style={{ background: pwStrength >= 2 ? pwStrengthColors[pwStrength] : undefined }} />
                            <div className="pw-bar" style={{ background: pwStrength >= 3 ? pwStrengthColors[pwStrength] : undefined }} />
                          </div>
                          <div className="pw-hint" style={{ color: pwStrengthColors[pwStrength] }}>
                            {pwStrengthLabel[pwStrength]}
                          </div>
                        </>
                      )}
                    </div>

                    <div className="field">
                      <label className="field-label">Confirm password</label>
                      <div className="field-wrap">
                        <input
                          type={showConfirm ? 'text' : 'password'}
                          required
                          className={`field-input with-icon ${form.confirm && form.confirm !== form.password ? 'error-field' : ''}`}
                          placeholder="Repeat password"
                          value={form.confirm}
                          onChange={e => setFormField('confirm', e.target.value)}
                        />
                        <button type="button" className="pw-toggle" onClick={() => setShowConfirm(!showConfirm)}>
                          {showConfirm ? '🙈' : '👁'}
                        </button>
                      </div>
                      {form.confirm && form.confirm !== form.password && (
                        <div className="pw-hint" style={{ color: '#fca5a5' }}>Passwords do not match</div>
                      )}
                    </div>
                  </div>

                  <p className="terms-note">
                    By creating an account you agree to our{' '}
                    <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                  </p>

                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={loading || (!!form.confirm && form.confirm !== form.password)}
                  >
                    {loading
                      ? <><div className="spinner" />Creating account…</>
                      : 'Create Account →'}
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
                  Already have an account? <Link href="/login">Sign in →</Link>
                </div>
              </>
            )}

            {/* ── STEP 2: OTP ── */}
            {step === 'otp' && (
              <>
                <div className="form-eyebrow">Email verification</div>
                <h1 className="form-title">Check your <em>inbox</em></h1>
                <p className="form-sub">
                  We sent a 6-digit code to <strong>{form.email}</strong>.
                  It expires in 10 minutes.
                </p>

                {error && (
                  <div className="msg error">
                    <span>✕</span><span>{error}</span>
                  </div>
                )}
                {otpResent && (
                  <div className="msg info">
                    <span>📨</span>
                    <span>A new OTP has been sent to your email.</span>
                  </div>
                )}

                <form onSubmit={handleVerify}>
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
                    <button
                      type="button"
                      className="back-btn"
                      onClick={() => { setStep('register'); setError(''); setOtpResent(false); }}
                    >
                      ← Back
                    </button>
                    <button type="button" className="resend-btn" onClick={handleResend} disabled={countdown > 0}>
                      Resend code
                      {countdown > 0 && <span className="countdown-text">({countdown}s)</span>}
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
              </>
            )}

            {/* ── STEP 3: SUCCESS ── */}
            {step === 'success' && (
              <div className="success-screen">
                <div className="success-icon">✓</div>
                <h1 className="success-title">You&apos;re <em>verified!</em></h1>
                <p className="success-sub">
                  Your account has been created and verified.<br />
                  Redirecting you to your dashboard…
                </p>
                <div className="redirect-bar">
                  <div className="redirect-fill" />
                </div>
                <p className="redirect-note">Redirecting in 2 seconds…</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}