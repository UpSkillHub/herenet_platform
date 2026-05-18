'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import api from '@/lib/api';

interface Ad {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  status: string;
  isFeatured: boolean;
  createdAt: string;
  expiryDate?: string;
  userId: number;
  categoryId: number;
}

export default function AdDetail() {
  const params = useParams();
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);
  const [contactShown, setContactShown] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAd();
  }, [params.id]);

  const fetchAd = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/ads/${params.id}`);
      setAd(res.data);
    } catch (err: any) {
      console.error('Error fetching ad:', err);
      setError('Failed to load ad. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getImages = (): string[] => {
    if (ad?.images && Array.isArray(ad.images) && ad.images.length > 0) {
      return ad.images;
    }
    // Fallback images for demo
    const fallbackImages = [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200',
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=1200',
      'https://images.unsplash.com/photo-1503602642458-232111445657?w=1200',
    ];
    const imgId = ad ? (ad.id % fallbackImages.length) : 0;
    return [fallbackImages[imgId]];
  };

  const images = getImages();
  const currentImage = images[currentImageIndex] || images[0];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  const shareOnWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=Check out this ad on HereNet!`, '_blank');
  };

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
        
        .page { min-height:100vh; padding:60px 24px 100px; position:relative; }
        
        .grid-lines { 
          position:fixed; inset:0; 
          background-image:linear-gradient(rgba(201,168,76,0.025) 1px,transparent 1px),
                           linear-gradient(90deg,rgba(201,168,76,0.025) 1px,transparent 1px); 
          background-size:80px 80px; pointer-events:none; z-index:0; 
        }
        
        .inner { max-width:1100px; margin:0 auto; position:relative; z-index:1; }
        
        .breadcrumb { 
          display:flex; align-items:center; gap:8px; margin-bottom:40px; 
          animation:fadeUp .6s ease both; 
        }
        
        .breadcrumb a { 
          font-size:12px; letter-spacing:.06em; text-transform:uppercase; 
          color:var(--text-muted); text-decoration:none; transition:color .2s; 
        }
        
        .breadcrumb a:hover { color:var(--gold-light); }
        .breadcrumb-sep { font-size:10px; color:var(--text-muted); }
        .breadcrumb-current { 
          font-size:12px; letter-spacing:.06em; text-transform:uppercase; 
          color:var(--text-soft); 
        }
        
        .layout { display:grid; grid-template-columns:1fr 340px; gap:32px; align-items:start; }
        @media(max-width:860px){.layout{grid-template-columns:1fr}}
        
        .left { animation:fadeUp .7s ease .05s both; }
        
        .gallery-container { margin-bottom:32px; }
        
        .img-wrap { 
          position: relative;
          border-radius:20px; 
          overflow:hidden; 
          height:420px; 
          background:var(--mid-2); 
        }
        
        .img-wrap img { 
          width:100%; 
          height:100%; 
          object-fit:cover; 
          filter:saturate(.85);
        }
        
        .gallery-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0,0,0,0.6);
          color: white;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 50%;
          width: 44px;
          height: 44px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          transition: all 0.2s;
          z-index: 2;
        }
        
        .gallery-nav:hover {
          background: var(--gold);
          border-color: var(--gold);
        }
        
        .gallery-nav.prev { left: 16px; }
        .gallery-nav.next { right: 16px; }
        
        .image-counter {
          position: absolute;
          bottom: 16px;
          right: 16px;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(8px);
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 13px;
          color: white;
          z-index: 2;
          font-weight: 500;
        }
        
        .thumb-gallery {
          display: flex;
          gap: 10px;
          margin-top: 12px;
          overflow-x: auto;
          padding-bottom: 8px;
        }
        
        .thumb {
          width: 80px;
          height: 80px;
          border-radius: 10px;
          overflow: hidden;
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        
        .thumb.active {
          border-color: var(--gold);
        }
        
        .thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .thumb:hover:not(.active) {
          border-color: rgba(201,168,76,0.4);
          transform: scale(1.05);
        }
        
        .img-badges { 
          position:absolute; 
          top:16px; 
          left:16px; 
          display:flex; 
          gap:8px; 
          flex-wrap:wrap;
          z-index: 2;
        }
        
        .img-badge { 
          font-size:10px; 
          letter-spacing:.1em; 
          text-transform:uppercase; 
          padding:5px 12px; 
          border-radius:100px; 
          backdrop-filter:blur(10px); 
          font-weight:500; 
          display:inline-flex; 
          align-items:center; 
          gap:4px; 
        }
        
        .img-badge::before { 
          content:''; 
          width:4px; 
          height:4px; 
          border-radius:50%; 
          background:currentColor; 
        }
        
        .img-badge.verified { 
          background:rgba(16,185,129,0.18); 
          border:1px solid rgba(16,185,129,0.3); 
          color:#6ee7b7; 
        }
        
        .img-badge.featured { 
          background:rgba(201,168,76,0.2); 
          border:1px solid rgba(201,168,76,0.4); 
          color:var(--gold-light); 
        }
        
        .error-message {
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.3);
          color: #fca5a5;
          padding: 16px 20px;
          border-radius: 12px;
          text-align: center;
          margin-bottom: 20px;
        }
        
        .ad-category { 
          font-size:10px; 
          letter-spacing:.18em; 
          text-transform:uppercase; 
          color:var(--gold-light); 
          margin-bottom:10px; 
        }
        
        .ad-title { 
          font-family:'Cormorant Garamond',serif; 
          font-size:clamp(32px,5vw,48px); 
          font-weight:300; 
          line-height:1.05; 
          letter-spacing:-.02em; 
          color:white; 
          margin-bottom:16px; 
        }
        
        .ad-meta { 
          display:flex; 
          flex-wrap:wrap; 
          gap:16px; 
          margin-bottom:28px; 
        }
        
        .ad-meta-item { 
          display:flex; 
          align-items:center; 
          gap:6px; 
          font-size:13px; 
          color:var(--text-soft); 
        }
        
        .divider { height:1px; background:var(--border); margin:28px 0; }
        
        .desc-title { 
          font-family:'Cormorant Garamond',serif; 
          font-size:22px; 
          font-weight:400; 
          color:white; 
          margin-bottom:12px; 
        }
        
        .desc-body { 
          font-size:14px; 
          font-weight:300; 
          line-height:1.75; 
          color:var(--text-soft); 
          white-space:pre-wrap; 
        }
        
        .skel-img { 
          height:420px; 
          border-radius:20px; 
          background:linear-gradient(90deg,#1c1c22 25%,#252530 50%,#1c1c22 75%); 
          background-size:200% 100%; 
          animation:shimmer 1.5s infinite; 
          margin-bottom:32px; 
        }
        
        .skel-line { 
          height:14px; 
          border-radius:6px; 
          background:linear-gradient(90deg,#1c1c22 25%,#252530 50%,#1c1c22 75%); 
          background-size:200% 100%; 
          animation:shimmer 1.5s infinite; 
          margin-bottom:12px; 
        }
        
        .sidebar { 
          position:sticky; 
          top:88px; 
          display:flex; 
          flex-direction:column; 
          gap:16px; 
          animation:fadeUp .7s ease .1s both; 
        }
        
        .price-card { 
          background:var(--mid); 
          border:1px solid var(--border); 
          border-radius:20px; 
          padding:28px; 
          position:relative; 
          overflow:hidden; 
        }
        
        .price-card::before { 
          content:''; 
          position:absolute; 
          top:0; left:0; right:0; 
          height:1px; 
          background:linear-gradient(90deg,transparent,var(--gold),transparent); 
          opacity:.6; 
        }
        
        .price-label { 
          font-size:10px; 
          letter-spacing:.14em; 
          text-transform:uppercase; 
          color:var(--text-muted); 
          margin-bottom:6px; 
        }
        
        .price-amount { 
          font-family:'Cormorant Garamond',serif; 
          font-size:48px; 
          font-weight:600; 
          color:var(--gold-light); 
          line-height:1; 
        }
        
        .price-unit { font-size:16px; font-weight:300; color:var(--text-muted); }
        .price-sub { font-size:12px; color:var(--text-muted); margin-top:8px; }
        
        .contact-card { 
          background:var(--mid); 
          border:1px solid var(--border); 
          border-radius:20px; 
          padding:24px; 
        }
        
        .contact-title { 
          font-family:'Cormorant Garamond',serif; 
          font-size:20px; 
          font-weight:400; 
          color:white; 
          margin-bottom:16px; 
        }
        
        .contact-btn { 
          display:block; 
          width:100%; 
          text-align:center; 
          background:linear-gradient(135deg,var(--gold),#8a6020); 
          color:white; 
          border:none; 
          border-radius:12px; 
          padding:15px; 
          font-family:'DM Sans',sans-serif; 
          font-size:14px; 
          font-weight:500; 
          letter-spacing:.04em; 
          cursor:pointer; 
          box-shadow:0 8px 28px rgba(201,168,76,0.2); 
          transition:transform .2s,box-shadow .2s; 
          margin-bottom:12px; 
          text-decoration:none; 
        }
        
        .contact-btn:hover { 
          transform:translateY(-2px); 
          box-shadow:0 14px 40px rgba(201,168,76,0.32); 
        }
        
        .contact-phone { 
          display:block; 
          text-align:center; 
          font-family:'Cormorant Garamond',serif; 
          font-size:22px; 
          font-weight:600; 
          color:var(--gold-light); 
          letter-spacing:.04em; 
          margin-top:12px; 
        }
        
        .share-card { 
          background:var(--mid); 
          border:1px solid var(--border); 
          border-radius:20px; 
          padding:20px 24px; 
        }
        
        .share-title { 
          font-size:11px; 
          letter-spacing:.12em; 
          text-transform:uppercase; 
          color:var(--text-muted); 
          margin-bottom:14px; 
        }
        
        .share-btns { display:flex; gap:10px; }
        
        .share-btn { 
          flex:1; 
          text-align:center; 
          background:var(--mid-2); 
          border:1px solid var(--border); 
          border-radius:10px; 
          padding:10px; 
          font-size:12px; 
          color:var(--text-soft); 
          cursor:pointer; 
          font-family:'DM Sans',sans-serif; 
          transition:all .2s; 
        }
        
        .share-btn:hover { 
          border-color:rgba(201,168,76,0.3); 
          color:var(--gold-light); 
          background:var(--gold-dim); 
        }
        
        .safety-card { 
          background:rgba(201,168,76,0.04); 
          border:1px solid rgba(201,168,76,0.12); 
          border-radius:16px; 
          padding:18px 20px; 
        }
        
        .safety-title { 
          font-size:11px; 
          letter-spacing:.1em; 
          text-transform:uppercase; 
          color:var(--gold-light); 
          margin-bottom:10px; 
        }
        
        .safety-tips { 
          list-style:none; 
          padding:0; 
          margin:0; 
          display:flex; 
          flex-direction:column; 
          gap:7px; 
        }
        
        .safety-tips li { 
          font-size:12px; 
          color:var(--text-muted); 
          display:flex; 
          align-items:center; 
          gap:8px; 
          line-height:1.4; 
        }
        
        .safety-tips li::before { 
          content:'✓'; 
          color:var(--gold); 
          font-size:10px; 
          flex-shrink:0; 
        }
        
        @keyframes shimmer { 
          from{background-position:200% 0} 
          to{background-position:-200% 0} 
        }
        
        @keyframes fadeUp { 
          from{opacity:0;transform:translateY(18px)} 
          to{opacity:1;transform:translateY(0)} 
        }
      `}</style>

      <div className="page">
        <div className="grid-lines" />
        <div className="inner">
          {/* Breadcrumb */}
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span className="breadcrumb-sep">›</span>
            <Link href="/search">Listings</Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-current">{loading ? '…' : ad?.title?.slice(0, 30)}</span>
          </div>

          <div className="layout">
            {/* LEFT */}
            <div className="left">
              {loading ? (
                <>
                  <div className="skel-img" />
                  <div className="skel-line" style={{ width: '40%' }} />
                  <div className="skel-line" style={{ width: '80%', height: 40 }} />
                  <div className="skel-line" style={{ width: '60%' }} />
                  <div className="skel-line" />
                  <div className="skel-line" />
                  <div className="skel-line" style={{ width: '75%' }} />
                </>
              ) : error ? (
                <div className="error-message">
                  ⚠️ {error}
                  <button 
                    onClick={fetchAd}
                    style={{ 
                      marginTop: 12, 
                      background: 'var(--gold)', 
                      border: 'none', 
                      padding: '8px 16px', 
                      borderRadius: 8, 
                      color: 'white', 
                      cursor: 'pointer',
                      display: 'inline-block'
                    }}
                  >
                    Try Again
                  </button>
                </div>
              ) : !ad ? (
                <div style={{ textAlign: 'center', padding: 80, color: 'var(--text-muted)' }}>
                  Ad not found or has been removed.
                </div>
              ) : (
                <>
                  {/* Image Gallery */}
                  <div className="gallery-container">
                    <div className="img-wrap">
                      <img 
                        src={currentImage} 
                        alt={ad.title}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200';
                        }}
                      />
                      
                      {images.length > 1 && (
                        <>
                          <button className="gallery-nav prev" onClick={prevImage} aria-label="Previous image">
                            ‹
                          </button>
                          <button className="gallery-nav next" onClick={nextImage} aria-label="Next image">
                            ›
                          </button>
                          <div className="image-counter">
                            {currentImageIndex + 1} / {images.length}
                          </div>
                        </>
                      )}
                      
                      <div className="img-badges">
                        <span className="img-badge verified">✓ Verified</span>
                        {ad.isFeatured && <span className="img-badge featured">⭐ Featured</span>}
                      </div>
                    </div>

                    {/* Thumbnails */}
                    {images.length > 1 && (
                      <div className="thumb-gallery">
                        {images.map((img: string, idx: number) => (
                          <div 
                            key={idx}
                            className={`thumb ${currentImageIndex === idx ? 'active' : ''}`}
                            onClick={() => setCurrentImageIndex(idx)}
                          >
                            <img src={img} alt={`Thumbnail ${idx + 1}`} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="ad-category">Category #{ad.categoryId}</div>
                  <h1 className="ad-title">{ad.title}</h1>

                  <div className="ad-meta">
                    <span className="ad-meta-item">📍 {ad.location || 'Rwanda'}</span>
                    <span className="ad-meta-item">
                      🕐 {ad.expiryDate ? `Expires ${new Date(ad.expiryDate).toLocaleDateString()}` : 'Active'}
                    </span>
                    <span className="ad-meta-item">🏷️ {ad.status}</span>
                  </div>

                  <div className="divider" />

                  <div className="desc-title">About this listing</div>
                  <div className="desc-body">
                    {ad.description || 'No description provided by the seller.'}
                  </div>
                </>
              )}
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="sidebar">
              {/* Price */}
              <div className="price-card">
                <div className="price-label">Listed Price</div>
                <div className="price-amount">
                  {loading ? '—' : (ad?.price || 0).toLocaleString()}
                  <span className="price-unit"> RWF</span>
                </div>
                <div className="price-sub">Price negotiable · contact seller</div>
              </div>

              {/* Contact */}
              <div className="contact-card">
                <div className="contact-title">Contact Seller</div>
                {contactShown ? (
                  <a className="contact-phone" href="tel:+250798750913">+250 798 750 913</a>
                ) : (
                  <button className="contact-btn" onClick={() => setContactShown(true)}>
                    📞 Show Phone Number
                  </button>
                )}
                <button
                  className="contact-btn"
                  style={{ marginTop: 10, background: 'var(--mid-2)', border: '1px solid var(--border)', boxShadow: 'none', color: 'var(--text-soft)' }}
                >
                  💬 Send Message
                </button>
              </div>

              {/* Share */}
              <div className="share-card">
                <div className="share-title">Share this listing</div>
                <div className="share-btns">
                  <button className="share-btn" onClick={copyToClipboard}>
                    📋 Copy
                  </button>
                  <button className="share-btn" onClick={shareOnWhatsApp}>
                    📱 WhatsApp
                  </button>
                  <button className="share-btn" onClick={shareOnTwitter}>
                    🐦 Twitter
                  </button>
                </div>
              </div>

              {/* Safety tips */}
              <div className="safety-card">
                <div className="safety-title">Safety Tips</div>
                <ul className="safety-tips">
                  <li>Meet in a safe, public place</li>
                  <li>Never pay before inspecting item</li>
                  <li>Verify seller identity before paying</li>
                  <li>Report suspicious listings to us</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}