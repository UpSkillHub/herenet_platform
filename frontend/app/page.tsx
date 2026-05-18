'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/ads')
      .then(res => res.json())
      .then(data => {
        setAds(data.slice(0, 8));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Helper function to get image URL from ad
  const getAdImage = (ad: any) => {
    // Check if ad has images array and it's not empty
    if (ad.images && Array.isArray(ad.images) && ad.images.length > 0) {
      return ad.images[0]; // Return first image
    }
    
    // Fallback to placeholder if no images
    const imgIds = [26, 48, 96, 160, 180, 200, 250, 290];
    const imgId = ad.id ? imgIds[ad.id % imgIds.length] : 96;
    return `https://picsum.photos/id/${imgId}/800/600`;
  };

  const categories = [
    { name: 'Products', icon: '📦', count: '4,200+' },
    { name: 'Services', icon: '🛠️', count: '1,800+' },
    { name: 'Jobs', icon: '💼', count: '920+' },
    { name: 'Real Estate', icon: '🏠', count: '650+' },
    { name: 'Vehicles', icon: '🚗', count: '430+' },
    { name: 'Business Opportunities', icon: '📈', count: '310+' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

        :root {
          --gold: #C9A84C;
          --gold-light: #E8C97A;
          --gold-dim: rgba(201,168,76,0.12);
          --dark: #0A0A0C;
          --dark-2: #111114;
          --mid: #1C1C22;
          --text-muted: rgba(255,255,255,0.45);
          --text-soft: rgba(255,255,255,0.75);
        }

        html { scroll-behavior: smooth; }

        body {
          font-family: 'DM Sans', sans-serif;
          background: var(--dark);
          color: white;
          overflow-x: hidden;
        }

        /* ── HERO ── */
        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .hero-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.28;
          filter: saturate(0.6) brightness(0.7);
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,168,76,0.08) 0%, transparent 70%),
            linear-gradient(180deg,
              rgba(10,10,12,0.55) 0%,
              rgba(10,10,12,0.3) 40%,
              rgba(10,10,12,0.88) 100%
            );
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          animation: orbDrift 12s ease-in-out infinite alternate;
        }
        .orb-1 { width: 500px; height: 500px; background: rgba(201,168,76,0.07); top: -100px; left: -100px; animation-delay: 0s; }
        .orb-2 { width: 400px; height: 400px; background: rgba(100,120,255,0.06); bottom: -50px; right: -80px; animation-delay: -4s; }
        .orb-3 { width: 300px; height: 300px; background: rgba(201,168,76,0.05); top: 40%; left: 60%; animation-delay: -8s; }

        @keyframes orbDrift {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(30px, -20px) scale(1.08); }
        }

        .grid-lines {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px);
          background-size: 80px 80px;
          pointer-events: none;
        }

        .hero-content {
          position: relative;
          z-index: 10;
          text-align: center;
          padding: 0 24px;
          max-width: 860px;
          margin: 0 auto;
        }

        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(201,168,76,0.1);
          border: 1px solid rgba(201,168,76,0.25);
          border-radius: 100px;
          padding: 6px 18px;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--gold-light);
          margin-bottom: 32px;
          animation: fadeUp 0.8s ease both;
        }

        .hero-eyebrow::before {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--gold);
          box-shadow: 0 0 8px var(--gold);
        }

        .hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(52px, 9vw, 96px);
          font-weight: 300;
          line-height: 0.95;
          letter-spacing: -0.02em;
          color: white;
          animation: fadeUp 0.9s ease 0.1s both;
        }

        .hero-title em {
          font-style: italic;
          color: var(--gold-light);
        }

        .hero-sub {
          margin-top: 24px;
          font-size: 17px;
          font-weight: 300;
          color: var(--text-soft);
          max-width: 480px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.65;
          animation: fadeUp 1s ease 0.2s both;
        }

        /* Search */
        .search-wrap {
          margin-top: 44px;
          animation: fadeUp 1s ease 0.35s both;
        }

        .search-bar {
          display: flex;
          align-items: center;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 100px;
          padding: 6px 6px 6px 28px;
          backdrop-filter: blur(20px);
          max-width: 640px;
          margin: 0 auto;
          transition: border-color 0.3s, background 0.3s;
        }

        .search-bar:focus-within {
          border-color: rgba(201,168,76,0.45);
          background: rgba(255,255,255,0.09);
        }

        .search-bar input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          color: white;
          min-width: 0;
        }

        .search-bar input::placeholder { color: rgba(255,255,255,0.38); }

        .search-divider {
          width: 1px;
          height: 22px;
          background: rgba(255,255,255,0.15);
          margin: 0 16px;
          flex-shrink: 0;
        }

        .search-loc {
          background: transparent;
          border: none;
          outline: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: rgba(255,255,255,0.6);
          width: 130px;
          min-width: 0;
        }

        .search-btn {
          background: linear-gradient(135deg, var(--gold), #a07830);
          color: white;
          border: none;
          border-radius: 100px;
          padding: 13px 30px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          letter-spacing: 0.04em;
          transition: transform 0.2s, box-shadow 0.2s;
          white-space: nowrap;
        }

        .search-btn:hover {
          transform: scale(1.04);
          box-shadow: 0 0 24px rgba(201,168,76,0.4);
        }

        /* Stats */
        .stats {
          margin-top: 52px;
          display: flex;
          gap: 40px;
          justify-content: center;
          animation: fadeUp 1s ease 0.5s both;
        }

        .stat-item { text-align: center; }

        .stat-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px;
          font-weight: 600;
          color: var(--gold-light);
          line-height: 1;
        }

        .stat-label {
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-top: 4px;
        }

        .stat-sep {
          width: 1px;
          background: rgba(255,255,255,0.1);
          align-self: stretch;
        }

        /* Post CTA */
        .post-cta-wrap {
          position: relative;
          z-index: 10;
          display: flex;
          justify-content: center;
          margin-top: -28px;
          padding: 0 24px;
        }

        .post-cta {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: white;
          color: var(--dark);
          text-decoration: none;
          padding: 18px 44px;
          border-radius: 100px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 0.02em;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1);
          transition: transform 0.25s, box-shadow 0.25s;
        }

        .post-cta:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.15);
        }

        .post-cta-arrow {
          width: 30px;
          height: 30px;
          background: var(--dark);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          transition: transform 0.25s;
        }

        .post-cta:hover .post-cta-arrow { transform: translateX(3px); }

        /* New Arrivals */
        .section {
          max-width: 1280px;
          margin: 0 auto;
          padding: 80px 32px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 40px;
        }

        .section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 38px;
          font-weight: 400;
          color: white;
          letter-spacing: -0.02em;
        }

        .section-link {
          font-size: 13px;
          color: var(--gold-light);
          text-decoration: none;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: gap 0.2s;
        }

        .section-link:hover { gap: 10px; }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        @media (max-width: 1024px) {
          .cards-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 640px) {
          .cards-grid { grid-template-columns: repeat(2, 1fr); }
        }

        .ad-card {
          background: var(--mid);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          overflow: hidden;
          text-decoration: none;
          color: white;
          transition: transform 0.4s cubic-bezier(.25,.8,.25,1), border-color 0.3s, box-shadow 0.4s;
          display: block;
          animation: fadeUp 0.5s ease both;
        }

        .ad-card:hover {
          transform: translateY(-8px);
          border-color: rgba(201,168,76,0.25);
          box-shadow: 0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,168,76,0.1);
        }

        .card-img {
          height: 200px;
          background: #222228;
          overflow: hidden;
          position: relative;
        }

        .card-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
          filter: saturate(0.85);
        }

        .ad-card:hover .card-img img { transform: scale(1.06); }

        .card-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          background: rgba(10,10,12,0.75);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.8);
          padding: 4px 10px;
          border-radius: 100px;
        }

        .card-featured-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: rgba(201,168,76,0.2);
          border: 1px solid rgba(201,168,76,0.4);
          color: var(--gold-light);
          padding: 4px 10px;
          border-radius: 100px;
        }

        .card-body { padding: 20px; }

        .card-title {
          font-size: 14px;
          font-weight: 500;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          color: rgba(255,255,255,0.9);
        }

        .card-price {
          font-family: 'Cormorant Garamond', serif;
          font-size: 24px;
          font-weight: 600;
          color: var(--gold-light);
          margin-top: 8px;
          line-height: 1;
        }

        .card-price-unit {
          font-size: 14px;
          font-weight: 400;
          color: var(--text-muted);
        }

        .card-location {
          font-size: 12px;
          color: var(--text-muted);
          margin-top: 8px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* Skeletons */
        .skeleton {
          background: var(--mid);
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.05);
        }

        .skel-img {
          height: 200px;
          background: linear-gradient(90deg, #1c1c22 25%, #26262e 50%, #1c1c22 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }

        .skel-body { padding: 20px; }

        .skel-line {
          height: 13px;
          border-radius: 6px;
          background: linear-gradient(90deg, #1c1c22 25%, #26262e 50%, #1c1c22 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
          margin-bottom: 10px;
        }

        .skel-line.short { width: 60%; }

        @keyframes shimmer {
          from { background-position: 200% 0; }
          to   { background-position: -200% 0; }
        }

        /* Categories */
        .cat-section {
          background: var(--dark-2);
          border-top: 1px solid rgba(255,255,255,0.05);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .cat-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: rgba(255,255,255,0.05);
          overflow: hidden;
          border-radius: 20px;
        }

        @media (max-width: 768px) {
          .cat-grid { grid-template-columns: repeat(2, 1fr); }
        }

        .cat-card {
          background: var(--dark-2);
          padding: 44px 36px;
          display: flex;
          align-items: center;
          gap: 20px;
          cursor: pointer;
          transition: background 0.3s;
          position: relative;
          overflow: hidden;
        }

        .cat-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--gold-dim), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .cat-card:hover::before { opacity: 1; }

        .cat-icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          flex-shrink: 0;
          transition: border-color 0.3s;
        }

        .cat-card:hover .cat-icon { border-color: rgba(201,168,76,0.3); }

        .cat-info { position: relative; z-index: 1; }

        .cat-name {
          font-size: 16px;
          font-weight: 500;
          color: white;
        }

        .cat-count {
          font-size: 12px;
          color: var(--text-muted);
          margin-top: 3px;
        }

        /* Final CTA */
        .final-cta {
          background: var(--dark);
          padding: 100px 24px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .final-cta::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%);
          pointer-events: none;
        }

        .final-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(36px, 5vw, 60px);
          font-weight: 300;
          line-height: 1.1;
          color: white;
          position: relative;
        }

        .final-title em {
          font-style: italic;
          color: var(--gold-light);
        }

        .final-btn {
          margin-top: 40px;
          display: inline-flex;
          align-items: center;
          gap: 14px;
          background: linear-gradient(135deg, var(--gold), #8a6020);
          color: white;
          text-decoration: none;
          padding: 18px 52px;
          border-radius: 100px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 500;
          letter-spacing: 0.04em;
          box-shadow: 0 12px 40px rgba(201,168,76,0.25);
          transition: transform 0.25s, box-shadow 0.25s;
        }

        .final-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 60px rgba(201,168,76,0.35);
        }

        .price-tag {
          font-size: 11px;
          background: rgba(255,255,255,0.2);
          padding: 4px 12px;
          border-radius: 100px;
          letter-spacing: 0.06em;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── HERO ── */}
      <div className="hero">
        <video className="hero-video" autoPlay muted loop playsInline>
          <source src="/videos/herenet.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay" />
        <div className="grid-lines" />
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        <div className="hero-content">
          <div className="hero-eyebrow">Rwanda's Premier Marketplace</div>

          <h1 className="hero-title">
            Declutter.<br />
            <em>Discover.</em><br />
            Connect.
          </h1>

          <p className="hero-sub">
            Products, services, jobs &amp; opportunities — all in one elegant platform built for Rwanda.
          </p>

          <div className="search-wrap">
            <Link href="/search">
              <div className="search-bar">
                <input type="text" placeholder="Search anything in Rwanda…" />
                <div className="search-divider" />
                <input type="text" className="search-loc" placeholder="Kigali, Musanze…" />
                <button className="search-btn">Search</button>
              </div>
            </Link>
          </div>

          <div className="stats">
            <div className="stat-item">
              <div className="stat-num">12K+</div>
              <div className="stat-label">Active Listings</div>
            </div>
            <div className="stat-sep" />
            <div className="stat-item">
              <div className="stat-num">8.4K</div>
              <div className="stat-label">Verified Sellers</div>
            </div>
            <div className="stat-sep" />
            <div className="stat-item">
              <div className="stat-num">30+</div>
              <div className="stat-label">Districts Covered</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── POST CTA ── */}
      <div className="post-cta-wrap">
        <Link href="/post-ad" className="post-cta">
          Post Your Ad Now
          <span className="post-cta-arrow">→</span>
        </Link>
      </div>

      {/* ── NEW ARRIVALS ── */}
      <div className="section">
        <div className="section-header">
          <h2 className="section-title">New Arrivals</h2>
          <Link href="/categories" className="section-link">View All →</Link>
        </div>

        {loading ? (
          <div className="cards-grid">
            {[...Array(8)].map((_, i) => (
              <div className="skeleton" key={i}>
                <div className="skel-img" />
                <div className="skel-body">
                  <div className="skel-line" />
                  <div className="skel-line short" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="cards-grid">
            {ads.map((ad: any, index: number) => (
              <Link
                href={`/ad/${ad.id}`}
                key={ad.id}
                className="ad-card"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <div className="card-img">
                  <img
                    src={getAdImage(ad)}
                    alt={ad.title}
                    loading="lazy"
                    onError={(e) => {
                      // If image fails to load, use fallback
                      const imgIds = [26, 48, 96, 160, 180, 200, 250, 290];
                      const imgId = ad.id ? imgIds[ad.id % imgIds.length] : 96;
                      (e.target as HTMLImageElement).src = `https://picsum.photos/id/${imgId}/800/600`;
                    }}
                  />
                  <span className="card-badge">Verified</span>
                  {ad.isFeatured && (
                    <span className="card-featured-badge">Featured</span>
                  )}
                </div>
                <div className="card-body">
                  <div className="card-title">{ad.title}</div>
                  <div className="card-price">
                    {ad.price.toLocaleString()}{' '}
                    <span className="card-price-unit">RWF</span>
                  </div>
                  <div className="card-location">📍 {ad.location || 'Rwanda'}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ── CATEGORIES ── */}
      <div className="cat-section">
        <div className="section">
          <div className="section-header">
            <h2 className="section-title">Browse Categories</h2>
          </div>
          <div className="cat-grid">
            {categories.map((cat) => (
              <div key={cat.name} className="cat-card">
                <div className="cat-icon">{cat.icon}</div>
                <div className="cat-info">
                  <div className="cat-name">{cat.name}</div>
                  <div className="cat-count">{cat.count} listings</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FINAL CTA ── */}
      <div className="final-cta">
        <p className="final-title">
          Ready to sell or hire<br />in <em>Rwanda?</em>
        </p>
        <Link href="/post-ad" className="final-btn">
          Post Your First Ad
          <span className="price-tag">Only 100 RWF</span>
        </Link>
      </div>
    </>
  );
}