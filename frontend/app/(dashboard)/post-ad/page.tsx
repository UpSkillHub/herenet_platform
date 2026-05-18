'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

type Step = 'form' | 'payment' | 'success';

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  uploading: boolean;
  uploaded: boolean;
  url?: string;
  error?: string;
}

const CATEGORIES = [
  { id: '1', name: 'Products', icon: '📦' },
  { id: '2', name: 'Services', icon: '🔧' },
  { id: '3', name: 'Jobs', icon: '💼' },
  { id: '4', name: 'Real Estate', icon: '🏠' },
  { id: '5', name: 'Vehicles', icon: '🚗' },
  { id: '6', name: 'Electronics', icon: '📱' },
  { id: '7', name: 'Furniture', icon: '🛋️' },
  { id: '8', name: 'Clothing', icon: '👕' },
];

const MAX_IMAGES = 6;
const MAX_SIZE_MB = 5;
const ACCEPT_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export default function PostAd() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: 0,
    categoryId: '1',
    location: '',
    days: 7,
    isFeatured: false,
  });

  const [images, setImages] = useState<ImageFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const [step, setStep] = useState<Step>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [adId, setAdId] = useState<string | null>(null); // ✅ This is properly declared
  const [user, setUser] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalCost = (form.isFeatured ? 200 : 100) * form.days;

  // Get user data
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  // ── Add images ──────────────────────────────────────────
  const addImages = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files);
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) return;

    const valid = arr.slice(0, remaining).filter(f => {
      if (!ACCEPT_TYPES.includes(f.type)) {
        setError(`${f.name} is not a supported image type.`);
        return false;
      }
      if (f.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`${f.name} exceeds ${MAX_SIZE_MB}MB limit.`);
        return false;
      }
      return true;
    });

    const newImages: ImageFile[] = valid.map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
      uploading: false,
      uploaded: false,
    }));

    setImages(prev => [...prev, ...newImages]);
    setError('');
  }, [images.length]);

  // ── Remove image ────────────────────────────────────────
  const removeImage = (id: string) => {
    setImages(prev => {
      const img = prev.find(i => i.id === id);
      if (img) URL.revokeObjectURL(img.preview);
      return prev.filter(i => i.id !== id);
    });
  };

  // ── Reorder (move left/right) ───────────────────────────
  const moveImage = (id: string, dir: -1 | 1) => {
    setImages(prev => {
      const idx = prev.findIndex(i => i.id === id);
      const next = idx + dir;
      if (next < 0 || next >= prev.length) return prev;
      const arr = [...prev];
      [arr[idx], arr[next]] = [arr[next], arr[idx]];
      return arr;
    });
  };

  // ── Drag and drop handlers ──────────────────────────────
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) {
      addImages(e.dataTransfer.files);
    }
  };

  // ── Create ad after successful payment ──────────────────
  const createAd = async (transactionId?: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please log in to continue.');

      const formData = new FormData();
      formData.append('title', form.title.trim());
      formData.append('description', form.description.trim() || '');
      formData.append('price', form.price.toString());
      formData.append('categoryId', form.categoryId);
      formData.append('location', form.location.trim());
      formData.append('days', form.days.toString());
      formData.append('isFeatured', form.isFeatured.toString());
      if (transactionId) {
        formData.append('transactionId', transactionId);
      }

      // Append images
      images.forEach((img) => {
        formData.append('images', img.file);
      });

      console.log('📤 Sending ad with', images.length, 'images');

      const adRes = await api.post('/ads', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('✅ Ad created successfully:', adRes.data);
      setAdId(adRes.data?.id || null); // ✅ setAdId is now used
      setStep('success');
    } catch (err: any) {
      console.error('Error creating ad:', err);
      throw err;
    }
  };

  // ── STEP 1: form submit ──────────────────────────────────
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setStep('payment');
  };

// ── STEP 2: Flutterwave Payment ────────────────
const handlePayment = async (method: string) => {
  setSelectedMethod(method);
  setLoading(true);
  setError('');

  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Please log in to continue.');

    // Get user info
    const userStr = localStorage.getItem('user');
    const currentUser = userStr ? JSON.parse(userStr) : null;

    if (!currentUser || !currentUser.email) {
      throw new Error('User information missing. Please log in again.');
    }

    // Wait for Flutterwave to be available
    const waitForFlutterwave = (maxRetries = 10, delay = 500): Promise<void> => {
      return new Promise((resolve, reject) => {
        let retries = 0;
        
        const checkFlutterwave = () => {
          // Check for FlutterwaveCheckout or FlutterwavePay
          if (typeof window !== 'undefined' && 
              ((window as any).FlutterwaveCheckout || (window as any).FlutterwavePay)) {
            resolve();
          } else if (retries >= maxRetries) {
            reject(new Error('Flutterwave failed to load'));
          } else {
            retries++;
            setTimeout(checkFlutterwave, delay);
          }
        };
        
        checkFlutterwave();
      });
    };

    await waitForFlutterwave();

    // Generate unique transaction reference
    const tx_ref = `HERENET_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Map payment method
    const getPaymentOptions = () => {
      switch(method) {
        case 'MTN': return 'mobilemoneyrwanda';
        case 'Airtel': return 'mobilemoneyrwanda';
        case 'Visa': return 'card';
        default: return 'card';
      }
    };

    // Use FlutterwaveCheckout (simpler API)
    const paymentConfig = {
      public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY,
      tx_ref: tx_ref,
      amount: totalCost,
      currency: 'RWF',
      payment_options: getPaymentOptions(),
      customer: {
        email: currentUser.email,
        phone_number: currentUser.phone || '0798750913',
        name: currentUser.name || 'Customer',
      },
      customizations: {
        title: 'Ad Payment - HereNet',
        description: `Payment for ad: ${form.title.substring(0, 50)}`,
        logo: 'https://herenet.rw/logo.png',
      },
      callback: async (response: any) => {
        console.log('Payment callback:', response);
        
        if (response.status === 'successful') {
          try {
            await createAd(response.transaction_id);
          } catch (err) {
            console.error('Ad creation failed:', err);
            setError('Payment successful but failed to create ad. Please contact support.');
          }
        } else {
          setError('Payment failed. Please try again.');
        }
        setLoading(false);
      },
      onclose: () => {
        console.log('Payment modal closed');
        setLoading(false);
        if (!error) {
          setError('Payment was cancelled.');
        }
      },
    };

    // Initialize Flutterwave checkout
    const Flutterwave = (window as any).FlutterwaveCheckout;
    if (Flutterwave) {
      Flutterwave(paymentConfig);
    } else {
      throw new Error('Flutterwave not available');
    }

  } catch (err: any) {
    console.error('🔴 Payment Error:', err);
    
    let msg = 'Unable to process payment. Please try again.';
    if (err?.message) msg = err.message;
    setError(msg);
    setLoading(false);
  }
};

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

        :root {
          --gold:#C9A84C; --gold-light:#E8C97A; --gold-dim:rgba(201,168,76,0.12);
          --dark:#0A0A0C; --dark-2:#111114; --mid:#1C1C22; --mid-2:#222228;
          --text-muted:rgba(255,255,255,0.38); --text-soft:rgba(255,255,255,0.65);
          --border:rgba(255,255,255,0.07);
        }

        *{box-sizing:border-box}
        body{font-family:'DM Sans',sans-serif;background:var(--dark);color:white;margin:0}

        .post-page{min-height:100vh;background:var(--dark);padding:64px 24px 100px;position:relative;overflow:hidden}
        .grid-lines{position:fixed;inset:0;background-image:linear-gradient(rgba(201,168,76,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,.025) 1px,transparent 1px);background-size:80px 80px;pointer-events:none;z-index:0}
        .post-page::before{content:'';position:fixed;top:-100px;left:50%;transform:translateX(-50%);width:700px;height:500px;border-radius:50%;background:radial-gradient(ellipse,rgba(201,168,76,.06) 0%,transparent 70%);pointer-events:none;z-index:0}
        .post-inner{max-width:640px;margin:0 auto;position:relative;z-index:1}

        .post-header{margin-bottom:44px;animation:fadeUp .7s ease both}
        .post-eyebrow{display:inline-flex;align-items:center;gap:8px;background:rgba(201,168,76,.1);border:1px solid rgba(201,168,76,.22);border-radius:100px;padding:5px 16px;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--gold-light);margin-bottom:18px}
        .post-eyebrow::before{content:'';width:5px;height:5px;border-radius:50%;background:var(--gold);box-shadow:0 0 6px var(--gold)}
        .post-title{font-family:'Cormorant Garamond',serif;font-size:clamp(38px,6vw,58px);font-weight:300;line-height:1;letter-spacing:-.02em}
        .post-title em{font-style:italic;color:var(--gold-light)}
        .post-sub{font-size:14px;font-weight:300;color:var(--text-muted);margin-top:10px}

        .step-indicator{display:flex;align-items:center;margin-bottom:40px;animation:fadeUp .7s ease .05s both}
        .step-dot{display:flex;align-items:center;gap:10px;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--text-muted);transition:color .3s}
        .step-dot.active{color:var(--gold-light)}.step-dot.done{color:#6ee7b7}
        .step-circle{width:28px;height:28px;border-radius:50%;border:1px solid rgba(255,255,255,.12);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:500;transition:all .3s}
        .step-dot.active .step-circle{border-color:var(--gold);background:var(--gold-dim);color:var(--gold-light)}
        .step-dot.done .step-circle{border-color:rgba(110,231,183,.4);background:rgba(110,231,183,.08);color:#6ee7b7}
        .step-line{flex:1;height:1px;background:rgba(255,255,255,.08);margin:0 16px}

        .msg-box{border-radius:14px;padding:14px 18px;font-size:14px;margin-bottom:20px;display:flex;align-items:flex-start;gap:10px;line-height:1.5}
        .msg-box.error{background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.25);color:#fca5a5}

        .post-card{background:var(--mid);border:1px solid var(--border);border-radius:24px;padding:40px;animation:fadeUp .7s ease .1s both}
        @media(max-width:480px){.post-card{padding:24px 20px}}

        .field{margin-bottom:24px}
        .field-label{display:block;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--text-muted);margin-bottom:8px;font-weight:500}
        .field-input,.field-select,.field-textarea{width:100%;background:var(--mid-2);border:1px solid rgba(255,255,255,.07);border-radius:14px;padding:15px 20px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:300;color:white;outline:none;transition:border-color .25s,background .25s;-webkit-appearance:none;appearance:none}
        .field-input::placeholder,.field-textarea::placeholder{color:rgba(255,255,255,.25)}
        .field-input:focus,.field-select:focus,.field-textarea:focus{border-color:rgba(201,168,76,.4);background:#26262d}
        .field-textarea{resize:vertical;min-height:110px;line-height:1.6}
        .field-select-wrap{position:relative}
        .field-select-wrap::after{content:'▾';position:absolute;right:20px;top:50%;transform:translateY(-50%);font-size:11px;color:var(--text-muted);pointer-events:none}
        .field-select option{background:#1c1c22}
        .field-row{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px}
        @media(max-width:480px){.field-row{grid-template-columns:1fr}}

        .img-section{margin-bottom:24px}
        .img-dropzone{border:2px dashed rgba(255,255,255,.1);border-radius:18px;padding:36px 24px;text-align:center;cursor:pointer;transition:border-color .25s,background .25s;position:relative;background:var(--mid-2)}
        .img-dropzone:hover,.img-dropzone.dragging{border-color:rgba(201,168,76,.45);background:rgba(201,168,76,.04)}
        .img-dropzone.dragging{border-style:solid}
        .dz-icon{font-size:36px;margin-bottom:12px;display:block;opacity:.6}
        .dz-title{font-size:14px;font-weight:400;color:var(--text-soft);margin-bottom:4px}
        .dz-sub{font-size:12px;color:var(--text-muted)}
        .dz-btn{display:inline-flex;align-items:center;gap:6px;margin-top:14px;background:linear-gradient(135deg,var(--gold),#8a6020);color:white;border:none;border-radius:100px;padding:9px 22px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;cursor:pointer;transition:transform .2s,box-shadow .2s}
        .dz-btn:hover{transform:scale(1.04);box-shadow:0 4px 20px rgba(201,168,76,.3)}

        .img-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:14px}
        @media(max-width:480px){.img-grid{grid-template-columns:repeat(2,1fr)}}
        .img-thumb{position:relative;aspect-ratio:4/3;border-radius:12px;overflow:hidden;background:var(--mid-2);border:1px solid var(--border);transition:border-color .2s}
        .img-thumb.cover{border-color:rgba(201,168,76,.5);box-shadow:0 0 0 2px rgba(201,168,76,.2)}
        .img-thumb img{width:100%;height:100%;object-fit:cover;display:block}
        .img-overlay{position:absolute;inset:0;background:rgba(0,0,0,.55);opacity:0;transition:opacity .2s;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px}
        .img-thumb:hover .img-overlay{opacity:1}
        .img-ctrl-row{display:flex;gap:6px}
        .img-ctrl-btn{width:30px;height:30px;border-radius:50%;border:none;cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center;transition:background .2s,transform .15s;background:rgba(255,255,255,.15);color:white}
        .img-ctrl-btn:hover{background:rgba(255,255,255,.28);transform:scale(1.1)}
        .img-ctrl-btn.del{background:rgba(239,68,68,.25);color:#fca5a5}
        .img-ctrl-btn.del:hover{background:rgba(239,68,68,.5)}
        .cover-badge{position:absolute;top:8px;left:8px;background:rgba(201,168,76,.85);color:white;font-size:9px;letter-spacing:.1em;text-transform:uppercase;padding:3px 8px;border-radius:100px;font-weight:600}
        .img-uploading{position:absolute;inset:0;background:rgba(10,10,12,.7);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px}
        .mini-spinner{width:22px;height:22px;border:2px solid rgba(255,255,255,.15);border-top-color:var(--gold);border-radius:50%;animation:spin .7s linear infinite}
        .img-error-badge{position:absolute;bottom:6px;left:6px;right:6px;background:rgba(239,68,68,.85);color:white;font-size:10px;padding:3px 6px;border-radius:6px;text-align:center}
        .img-counter{font-size:11px;color:var(--text-muted);margin-top:8px;text-align:center}
        .img-counter span{color:var(--gold-light)}

        .featured-toggle{display:flex;align-items:center;gap:14px;background:var(--mid-2);border:1px solid rgba(255,255,255,.07);border-radius:14px;padding:16px 20px;cursor:pointer;transition:border-color .25s;user-select:none}
        .featured-toggle.on{border-color:rgba(201,168,76,.35);background:rgba(201,168,76,.05)}
        .toggle-switch{width:40px;height:22px;border-radius:11px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.12);position:relative;flex-shrink:0;transition:background .25s,border-color .25s}
        .featured-toggle.on .toggle-switch{background:rgba(201,168,76,.3);border-color:var(--gold)}
        .toggle-knob{position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:rgba(255,255,255,.4);transition:transform .25s,background .25s}
        .featured-toggle.on .toggle-knob{transform:translateX(18px);background:var(--gold-light)}
        .toggle-label{font-size:13px;font-weight:400;color:var(--text-soft)}
        .toggle-sub{font-size:11px;color:var(--text-muted);margin-top:2px}

        .cost-box{background:var(--mid-2);border:1px solid rgba(201,168,76,.2);border-radius:18px;padding:28px 32px;text-align:center;margin-bottom:28px;position:relative;overflow:hidden}
        .cost-box::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--gold),transparent);opacity:.6}
        .cost-label{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--text-muted);margin-bottom:8px}
        .cost-amount{font-family:'Cormorant Garamond',serif;font-size:56px;font-weight:600;color:var(--gold-light);line-height:1}
        .cost-unit{font-size:18px;font-weight:300;color:var(--text-muted)}
        .cost-breakdown{font-size:12px;color:var(--text-muted);margin-top:10px}

        .btn-primary{width:100%;background:linear-gradient(135deg,var(--gold),#8a6020);color:white;border:none;border-radius:14px;padding:18px;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:500;letter-spacing:.04em;cursor:pointer;box-shadow:0 8px 28px rgba(201,168,76,.22);transition:transform .2s,box-shadow .2s;display:flex;align-items:center;justify-content:center;gap:10px}
        .btn-primary:hover{transform:translateY(-2px);box-shadow:0 14px 40px rgba(201,168,76,.35)}
        .btn-primary:active{transform:scale(.99)}
        .card-divider{height:1px;background:rgba(255,255,255,.06);margin:28px 0}

        .payment-section-title{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--text-muted);margin-bottom:16px}
        .payment-methods{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:28px}
        @media(max-width:480px){.payment-methods{grid-template-columns:1fr}}
        .pay-btn{background:var(--mid-2);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:24px 16px;cursor:pointer;text-align:center;transition:border-color .25s,background .25s,transform .2s}
        .pay-btn:hover{transform:translateY(-3px)}
        .pay-btn.mtn:hover{border-color:rgba(255,180,0,.45);background:rgba(255,180,0,.05)}
        .pay-btn.airtel:hover{border-color:rgba(220,38,38,.45);background:rgba(220,38,38,.05)}
        .pay-btn.visa:hover{border-color:rgba(99,102,241,.45);background:rgba(99,102,241,.05)}
        .pay-btn.selected.mtn{border-color:rgba(255,180,0,.6);background:rgba(255,180,0,.08)}
        .pay-btn.selected.airtel{border-color:rgba(220,38,38,.6);background:rgba(220,38,38,.08)}
        .pay-btn.selected.visa{border-color:rgba(99,102,241,.6);background:rgba(99,102,241,.08)}
        .pay-btn:disabled{opacity:.5;pointer-events:none}
        .pay-icon{font-size:28px;margin-bottom:10px;display:block}
        .pay-name{font-size:13px;font-weight:500;color:rgba(255,255,255,.85);display:block}
        .pay-sub{font-size:11px;color:var(--text-muted);margin-top:4px;display:block}

        .processing{display:flex;flex-direction:column;align-items:center;gap:12px;padding:24px;text-align:center}
        .spinner{width:36px;height:36px;border:3px solid rgba(255,255,255,.08);border-top-color:var(--gold);border-radius:50%;animation:spin .8s linear infinite}
        @keyframes spin{to{transform:rotate(360deg)}}
        .processing-text{font-size:14px;color:var(--text-soft)}
        .processing-sub{font-size:12px;color:var(--text-muted)}
        .progress-wrap{width:100%;height:3px;background:rgba(255,255,255,.06);border-radius:2px;overflow:hidden;margin-top:8px}
        .progress-fill{height:100%;background:linear-gradient(90deg,var(--gold),var(--gold-light));border-radius:2px;animation:progress 1.5s ease-in-out infinite}
        @keyframes progress{0%{width:0%;margin-left:0}50%{width:60%;margin-left:20%}100%{width:0%;margin-left:100%}}

        .back-btn{background:none;border:none;color:var(--text-muted);font-family:'DM Sans',sans-serif;font-size:13px;cursor:pointer;display:flex;align-items:center;gap:6px;transition:color .2s;margin-top:20px;padding:0}
        .back-btn:hover{color:white}

        .success-screen{text-align:center;padding:20px 0;animation:fadeUp .6s ease both}
        .success-icon{width:80px;height:80px;border-radius:50%;background:rgba(16,185,129,.1);border:1px solid rgba(16,185,129,.3);display:flex;align-items:center;justify-content:center;font-size:36px;margin:0 auto 24px;animation:popIn .5s ease both}
        @keyframes popIn{from{transform:scale(.5);opacity:0}to{transform:scale(1);opacity:1}}
        .success-title{font-family:'Cormorant Garamond',serif;font-size:40px;font-weight:300;margin-bottom:12px}
        .success-title em{font-style:italic;color:#6ee7b7}
        .success-sub{font-size:14px;color:var(--text-muted);line-height:1.7;margin-bottom:28px}
        .success-meta{background:var(--mid-2);border:1px solid var(--border);border-radius:16px;padding:20px 24px;margin-bottom:28px;text-align:left;display:flex;flex-direction:column;gap:12px}
        .meta-row{display:flex;justify-content:space-between;align-items:center;font-size:13px}
        .meta-label{color:var(--text-muted)}.meta-value{color:rgba(255,255,255,.88)}
        .meta-value.gold{color:var(--gold-light);font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:600}
        .meta-value.green{color:#6ee7b7}
        .success-actions{display:flex;gap:12px}
        .btn-outline{flex:1;background:var(--mid-2);border:1px solid var(--border);color:var(--text-soft);border-radius:14px;padding:15px;font-family:'DM Sans',sans-serif;font-size:14px;cursor:pointer;transition:all .2s;text-align:center;text-decoration:none;display:flex;align-items:center;justify-content:center}
        .btn-outline:hover{border-color:rgba(255,255,255,.14);color:white}
        .btn-gold{flex:1;background:linear-gradient(135deg,var(--gold),#8a6020);color:white;border:none;border-radius:14px;padding:15px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;cursor:pointer;transition:transform .2s;text-decoration:none;display:flex;align-items:center;justify-content:center}
        .btn-gold:hover{transform:translateY(-2px)}

        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPT_TYPES.join(',')}
        multiple
        style={{ display: 'none' }}
        onChange={e => e.target.files && addImages(e.target.files)}
      />

      <div className="post-page">
        <div className="grid-lines" />
        <div className="post-inner">
          <div className="post-header">
            <div className="post-eyebrow">Rwanda Marketplace</div>
            <h1 className="post-title">Post Your <em>Ad</em></h1>
            <p className="post-sub">Reach thousands of buyers across Rwanda</p>
          </div>

          {step !== 'success' && (
            <div className="step-indicator">
              <div className={`step-dot ${step === 'form' ? 'active' : 'done'}`}>
                <div className="step-circle">{step === 'payment' ? '✓' : '1'}</div>
                Ad Details
              </div>
              <div className="step-line" />
              <div className={`step-dot ${step === 'payment' ? 'active' : ''}`}>
                <div className="step-circle">2</div>
                Payment
              </div>
            </div>
          )}

          {error && (
            <div className="msg-box error">
              ⚠️ {error}
            </div>
          )}

          {step === 'form' && (
            <div className="post-card">
              <form onSubmit={handleSubmitForm}>
                <div className="field">
                  <label className="field-label">Ad Title</label>
                  <input type="text" required className="field-input"
                    placeholder="e.g. iPhone 16 Pro – Excellent Condition"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                  />
                </div>

                <div className="field">
                  <label className="field-label">Description</label>
                  <textarea className="field-textarea"
                    placeholder="Describe your item, service or opportunity…"
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                <div className="img-section">
                  <label className="field-label">
                    Photos
                    <span style={{ color: 'var(--text-muted)', fontWeight: 300, textTransform: 'none', letterSpacing: 0, marginLeft: 8 }}>
                      (optional · up to {MAX_IMAGES} images · max {MAX_SIZE_MB}MB each)
                    </span>
                  </label>

                  {images.length < MAX_IMAGES && (
                    <div
                      className={`img-dropzone ${dragging ? 'dragging' : ''}`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <span className="dz-icon">🖼️</span>
                      <div className="dz-title">
                        {dragging ? 'Drop images here' : 'Drag & drop photos here'}
                      </div>
                      <div className="dz-sub">JPG, PNG, WEBP · Max {MAX_SIZE_MB}MB each</div>
                      <button type="button" className="dz-btn">📁 Browse Files</button>
                    </div>
                  )}

                  {images.length > 0 && (
                    <>
                      <div className="img-grid">
                        {images.map((img, idx) => (
                          <div key={img.id} className={`img-thumb ${idx === 0 ? 'cover' : ''}`}>
                            <img src={img.preview} alt={`Photo ${idx + 1}`} />
                            {idx === 0 && <span className="cover-badge">Cover</span>}
                            {img.uploading && (
                              <div className="img-uploading">
                                <div className="mini-spinner" />
                                <span style={{ fontSize: 11, color: 'rgba(255,255,255,.7)' }}>Uploading…</span>
                              </div>
                            )}
                            {img.error && <div className="img-error-badge">{img.error}</div>}
                            {!img.uploading && (
                              <div className="img-overlay">
                                <div className="img-ctrl-row">
                                  {idx > 0 && (
                                    <button type="button" className="img-ctrl-btn" onClick={() => moveImage(img.id, -1)}>←</button>
                                  )}
                                  {idx < images.length - 1 && (
                                    <button type="button" className="img-ctrl-btn" onClick={() => moveImage(img.id, 1)}>→</button>
                                  )}
                                  <button type="button" className="img-ctrl-btn del" onClick={() => removeImage(img.id)}>✕</button>
                                </div>
                                {idx > 0 && <div style={{ fontSize: 10, color: 'rgba(255,255,255,.6)' }}>Set as cover: move to first</div>}
                              </div>
                            )}
                          </div>
                        ))}
                        {images.length < MAX_IMAGES && (
                          <div className="img-thumb" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 6, border: '2px dashed rgba(255,255,255,.1)', background: 'transparent' }} onClick={() => fileInputRef.current?.click()}>
                            <span style={{ fontSize: 24, opacity: .4 }}>+</span>
                            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Add more</span>
                          </div>
                        )}
                      </div>
                      <div className="img-counter"><span>{images.length}</span> / {MAX_IMAGES} photos · First photo is the cover image</div>
                    </>
                  )}
                </div>

                <div className="field-row">
                  <div>
                    <label className="field-label">Price (RWF)</label>
                    <input type="number" min="0" required className="field-input"
                      placeholder="0"
                      value={form.price || ''}
                      onChange={e => setForm({ ...form, price: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <label className="field-label">Category</label>
                    <div className="field-select-wrap">
                      <select className="field-select" value={form.categoryId}
                        onChange={e => setForm({ ...form, categoryId: e.target.value })}>
                        {CATEGORIES.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="field-row">
                  <div>
                    <label className="field-label">Location</label>
                    <input type="text" required className="field-input"
                      placeholder="Kigali, Musanze…"
                      value={form.location}
                      onChange={e => setForm({ ...form, location: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="field-label">Days to Run</label>
                    <input type="number" min="1" required className="field-input"
                      value={form.days}
                      onChange={e => setForm({ ...form, days: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="field-label">Boost Visibility</label>
                  <div className={`featured-toggle ${form.isFeatured ? 'on' : ''}`}
                    onClick={() => setForm({ ...form, isFeatured: !form.isFeatured })}>
                    <div className="toggle-switch"><div className="toggle-knob" /></div>
                    <div>
                      <div className="toggle-label">Feature on Homepage</div>
                      <div className="toggle-sub">+200 RWF / day — appear at the top of results</div>
                    </div>
                  </div>
                </div>

                <div className="card-divider" />

                <div className="cost-box">
                  <div className="cost-label">Total Cost</div>
                  <div className="cost-amount">
                    {totalCost.toLocaleString()}<span className="cost-unit"> RWF</span>
                  </div>
                  <div className="cost-breakdown">
                    {form.days} day{form.days !== 1 ? 's' : ''} × {form.isFeatured ? '200' : '100'} RWF
                    {form.isFeatured ? ' (Featured)' : ' (Standard)'}
                    {images.length > 0 && ` · ${images.length} photo${images.length !== 1 ? 's' : ''}`}
                  </div>
                </div>

                <button type="submit" className="btn-primary">
                  Continue to Payment <span>→</span>
                </button>
              </form>
            </div>
          )}

          {step === 'payment' && (
            <div className="post-card">
              <div className="cost-box" style={{ marginBottom: 32 }}>
                <div className="cost-label">Amount to Pay</div>
                <div className="cost-amount">
                  {totalCost.toLocaleString()}<span className="cost-unit"> RWF</span>
                </div>
                <div className="cost-breakdown">
                  {form.days} days · {form.isFeatured ? 'Featured' : 'Standard'}
                  {images.length > 0 && ` · ${images.length} photo${images.length !== 1 ? 's' : ''}`}
                </div>
              </div>

              {loading ? (
                <div className="processing">
                  <div className="spinner" />
                  <div className="processing-text">
                    Processing {selectedMethod} payment…
                  </div>
                  <div className="processing-sub">Please wait, do not close this page</div>
                  <div className="progress-wrap"><div className="progress-fill" /></div>
                </div>
              ) : (
                <>
                  <div className="payment-section-title">Choose Payment Method</div>
                  <div className="payment-methods">
                    {[
                      { id: 'MTN', icon: '📱', name: 'MTN Money', sub: 'Mobile payment', cls: 'mtn' },
                      { id: 'Airtel', icon: '📲', name: 'Airtel Money', sub: 'Mobile payment', cls: 'airtel' },
                      { id: 'Visa', icon: '💳', name: 'Visa Card', sub: 'Credit / Debit', cls: 'visa' },
                    ].map(m => (
                      <button key={m.id}
                        className={`pay-btn ${m.cls} ${selectedMethod === m.id ? 'selected' : ''}`}
                        onClick={() => handlePayment(m.id)}
                        disabled={loading}>
                        <span className="pay-icon">{m.icon}</span>
                        <span className="pay-name">{m.name}</span>
                        <span className="pay-sub">{m.sub}</span>
                      </button>
                    ))}
                  </div>
                  <button className="back-btn" onClick={() => { setStep('form'); setError(''); }}>
                    ← Back to ad details
                  </button>
                </>
              )}
            </div>
          )}

          {step === 'success' && (
            <div className="post-card">
              <div className="success-screen">
                <div className="success-icon">✓</div>
                <h2 className="success-title">Ad <em>Submitted!</em></h2>
                <p className="success-sub">
                  Your payment was successful and your ad has been submitted for review.
                  An admin will approve it shortly.
                </p>
                <div className="success-meta">
                  <div className="meta-row">
                    <span className="meta-label">Payment method</span>
                    <span className="meta-value">{selectedMethod}</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label">Amount paid</span>
                    <span className="meta-value gold">{totalCost.toLocaleString()} RWF</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label">Duration</span>
                    <span className="meta-value">{form.days} day{form.days !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label">Plan</span>
                    <span className="meta-value">{form.isFeatured ? '⭐ Featured' : 'Standard'}</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label">Photos</span>
                    <span className="meta-value">{images.length} uploaded</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label">Status</span>
                    <span className="meta-value green">● Pending approval</span>
                  </div>
                </div>
                <div className="success-actions">
                  <button className="btn-outline" onClick={() => {
                    setForm({ title: '', description: '', price: 0, categoryId: '1', location: '', days: 7, isFeatured: false });
                    setImages([]); setStep('form'); setError(''); setSelectedMethod('');
                  }}>
                    Post Another Ad
                  </button>
                  <a href="/dashboard" className="btn-gold">Go to Dashboard →</a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}