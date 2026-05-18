'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

export default function Search() {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAds();
  }, [searchTerm, categoryFilter, locationFilter, sortBy]);

  const fetchAds = async () => {
    setLoading(true);
    setError('');
    try {
      const params: any = {};
      if (searchTerm) params.search = searchTerm;
      if (categoryFilter) params.categoryId = getCategoryId(categoryFilter);
      if (locationFilter) params.location = locationFilter;
      if (sortBy) params.sort = sortBy;
      
      const res = await api.get('/ads', { params });
      setAds(res.data || []);
    } catch (err: any) {
      console.error(err);
      if (err?.message?.includes('Network') || !err.response) {
        setError('Cannot connect to server. Make sure backend is running on port 5000.');
      } else {
        setError('Failed to load listings. Please try again.');
      }
      setAds([]);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryId = (categoryName: string): string => {
    const categoryMap: { [key: string]: string } = {
      'Products': '1',
      'Services': '2',
      'Jobs': '3',
      'Real Estate': '4',
      'Vehicles': '5',
    };
    return categoryMap[categoryName] || '';
  };

  const getAdImage = (ad: any, index: number): string => {
    if (ad.images && Array.isArray(ad.images) && ad.images.length > 0) {
      return ad.images[0];
    }
    const fallbackImages = [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800',
      'https://images.unsplash.com/photo-1503602642458-232111445657?w=800',
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800',
      'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800',
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
    ];
    return fallbackImages[index % fallbackImages.length];
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

        :root {
          --gold: #C9A84C;
          --gold-light: #E8C97A;
          --gold-dim: rgba(201,168,76,0.12);
          --dark: #0A0A0C;
          --dark-2: #111114;
          --mid: #1C1C22;
          --mid-2: #222228;
          --text-muted: rgba(255,255,255,0.38);
          --text-soft: rgba(255,255,255,0.65);
          --border: rgba(255,255,255,0.07);
        }

        * {
          box-sizing: border-box;
        }

        body {
          font-family: 'DM Sans', sans-serif;
          background: var(--dark);
          color: white;
          margin: 0;
        }

        /* ── PAGE ── */
        .search-page {
          min-height: 100vh;
          background: var(--dark);
          padding: 64px 24px 100px;
          position: relative;
          overflow: hidden;
        }

        .search-page::before {
          content: '';
          position: fixed;
          top: -150px;
          left: 50%;
          transform: translateX(-50%);
          width: 700px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(ellipse, rgba(201,168,76,0.05) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .grid-lines {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(201,168,76,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.025) 1px, transparent 1px);
          background-size: 80px 80px;
          pointer-events: none;
          z-index: 0;
        }

        .search-inner {
          max-width: 1280px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        /* ── HEADER ── */
        .search-header {
          margin-bottom: 48px;
          animation: fadeUp 0.7s ease both;
        }

        .search-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(201,168,76,0.1);
          border: 1px solid rgba(201,168,76,0.22);
          border-radius: 100px;
          padding: 5px 16px;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--gold-light);
          margin-bottom: 20px;
        }

        .search-eyebrow::before {
          content: '';
          width: 5px; height: 5px;
          border-radius: 50%;
          background: var(--gold);
          box-shadow: 0 0 6px var(--gold);
        }

        .search-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(38px, 6vw, 64px);
          font-weight: 300;
          line-height: 1;
          letter-spacing: -0.02em;
          color: white;
        }

        .search-title em {
          font-style: italic;
          color: var(--gold-light);
        }

        /* ── FILTER BAR ── */
        .filter-bar {
          background: var(--mid);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 20px;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
          margin-bottom: 48px;
          animation: fadeUp 0.7s ease 0.1s both;
        }

        .filter-bar:focus-within {
          border-color: rgba(201,168,76,0.2);
        }

        .filter-input-wrap {
          position: relative;
          flex: 1;
          min-width: 240px;
        }

        .filter-icon {
          position: absolute;
          left: 18px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 15px;
          opacity: 0.4;
          pointer-events: none;
        }

        .filter-input,
        .filter-select {
          width: 100%;
          background: var(--mid-2);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 14px 18px 14px 44px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 300;
          color: white;
          outline: none;
          transition: border-color 0.25s, background 0.25s;
          -webkit-appearance: none;
          appearance: none;
        }

        .filter-input::placeholder { color: rgba(255,255,255,0.3); }

        .filter-input:focus,
        .filter-select:focus {
          border-color: rgba(201,168,76,0.4);
          background: #28282f;
        }

        .filter-select-wrap {
          position: relative;
          min-width: 180px;
        }

        .filter-select-wrap .filter-icon {
          left: 14px;
        }

        .filter-select-wrap .filter-select {
          padding-left: 40px;
          cursor: pointer;
        }

        .filter-select-wrap::after {
          content: '▾';
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 11px;
          color: var(--text-muted);
          pointer-events: none;
        }

        .filter-select option { background: #1c1c22; }

        .filter-divider {
          width: 1px;
          height: 36px;
          background: rgba(255,255,255,0.08);
          flex-shrink: 0;
        }

        /* ── RESULTS META ── */
        .results-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
          animation: fadeUp 0.7s ease 0.15s both;
        }

        .results-count {
          font-size: 13px;
          color: var(--text-muted);
          letter-spacing: 0.04em;
        }

        .results-count strong {
          color: var(--gold-light);
          font-weight: 500;
        }

        /* ── CARDS GRID ── */
        .ads-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
        }

        @media (max-width: 1100px) { .ads-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px)  { .ads-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px)  { .ads-grid { grid-template-columns: 1fr; } }

        .ad-card {
          background: var(--mid);
          border: 1px solid var(--border);
          border-radius: 18px;
          overflow: hidden;
          text-decoration: none;
          color: white;
          display: block;
          transition: transform 0.35s cubic-bezier(.25,.8,.25,1), border-color 0.3s, box-shadow 0.35s;
          animation: fadeUp 0.5s ease both;
        }

        .ad-card:hover {
          transform: translateY(-6px);
          border-color: rgba(201,168,76,0.22);
          box-shadow: 0 20px 50px rgba(0,0,0,0.55), 0 0 0 1px rgba(201,168,76,0.08);
        }

        .card-img {
          height: 196px;
          background: var(--mid-2);
          overflow: hidden;
          position: relative;
        }

        .card-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.55s ease;
          filter: saturate(0.82);
        }

        .ad-card:hover .card-img img { transform: scale(1.06); }

        .card-status {
          position: absolute;
          top: 12px;
          left: 12px;
          font-size: 9px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 100px;
          backdrop-filter: blur(8px);
          font-weight: 500;
        }

        .card-status.active {
          background: rgba(16,185,129,0.18);
          border: 1px solid rgba(16,185,129,0.3);
          color: #6ee7b7;
        }

        .card-status.pending {
          background: rgba(201,168,76,0.18);
          border: 1px solid rgba(201,168,76,0.3);
          color: var(--gold-light);
        }

        .card-body { padding: 18px 20px 20px; }

        .card-title {
          font-size: 14px;
          font-weight: 400;
          line-height: 1.45;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          color: rgba(255,255,255,0.88);
        }

        .card-price {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px;
          font-weight: 600;
          color: var(--gold-light);
          margin-top: 10px;
          line-height: 1;
        }

        .card-price-unit {
          font-size: 13px;
          font-weight: 300;
          color: var(--text-muted);
        }

        .card-location {
          font-size: 12px;
          color: var(--text-muted);
          margin-top: 8px;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        /* ── EMPTY STATE ── */
        .empty-state {
          text-align: center;
          padding: 100px 24px;
          animation: fadeUp 0.6s ease both;
        }

        .empty-icon {
          font-size: 52px;
          margin-bottom: 20px;
          opacity: 0.4;
        }

        .empty-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 32px;
          font-weight: 300;
          color: rgba(255,255,255,0.5);
        }

        .empty-sub {
          font-size: 14px;
          color: var(--text-muted);
          margin-top: 8px;
        }

        /* ── SKELETONS ── */
        .skeleton-card {
          background: var(--mid);
          border: 1px solid var(--border);
          border-radius: 18px;
          overflow: hidden;
        }

        .skel-img {
          height: 196px;
          background: linear-gradient(90deg, #1c1c22 25%, #252530 50%, #1c1c22 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        .skel-body { padding: 18px 20px 20px; }

        .skel-line {
          height: 12px;
          border-radius: 6px;
          background: linear-gradient(90deg, #1c1c22 25%, #252530 50%, #1c1c22 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          margin-bottom: 10px;
        }

        .skel-line.w-3-4 { width: 75%; }
        .skel-line.w-1-2 { width: 50%; }
        .skel-line.w-1-3 { width: 35%; }

        @keyframes shimmer {
          from { background-position: 200% 0; }
          to   { background-position: -200% 0; }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="search-page">
        <div className="grid-lines" />

        <div className="search-inner">

          {/* Header */}
          <div className="search-header">
            <div className="search-eyebrow">Rwanda Marketplace</div>
            <h1 className="search-title">
              Find <em>Anything</em><br />in Rwanda
            </h1>
          </div>

          {/* Filter Bar */}
          <div className="filter-bar">
            <div className="filter-input-wrap">
              <span className="filter-icon">🔍</span>
              <input
                type="text"
                className="filter-input"
                placeholder="Search phones, jobs, cars…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-divider" />

            <div className="filter-select-wrap">
              <span className="filter-icon">◈</span>
              <select
                className="filter-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="Products">Products</option>
                <option value="Services">Services</option>
                <option value="Jobs">Jobs</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Vehicles">Vehicles</option>
              </select>
            </div>

            <div className="filter-input-wrap" style={{ minWidth: 0, flex: '0 0 200px' }}>
              <span className="filter-icon">📍</span>
              <input
                type="text"
                className="filter-input"
                placeholder="Kigali, Musanze…"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </div>

            <div className="filter-divider" />

            <div className="filter-select-wrap">
              <span className="filter-icon">↕</span>
              <select
                className="filter-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="latest">Latest</option>
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
              </select>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{ color: '#ff6b6b', textAlign: 'center', marginBottom: '30px', padding: '12px', background: 'rgba(255,107,107,0.1)', borderRadius: '12px' }}>
              {error}
            </div>
          )}

          {/* Results meta */}
          {!loading && ads.length > 0 && (
            <div className="results-meta">
              <p className="results-count">
                <strong>{ads.length}</strong> listing{ads.length !== 1 ? 's' : ''} found
              </p>
            </div>
          )}

          {/* Results */}
          {loading ? (
            <div className="ads-grid">
              {[...Array(8)].map((_, i) => (
                <div className="skeleton-card" key={i}>
                  <div className="skel-img" />
                  <div className="skel-body">
                    <div className="skel-line w-3-4" />
                    <div className="skel-line w-1-2" />
                    <div className="skel-line w-1-3" style={{ marginTop: 14 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : ads.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <p className="empty-title">No listings found</p>
              <p className="empty-sub">Try different keywords or broaden your filters</p>
            </div>
          ) : (
            <div className="ads-grid">
              {ads.map((ad: any, index: number) => (
                <Link
                  key={ad.id}
                  href={`/ad/${ad.id}`}
                  className="ad-card"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <div className="card-img">
                    <img
                      src={getAdImage(ad, index)}
                      alt={ad.title}
                      loading="lazy"
                      onError={(e) => {
                        const fallback = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800';
                        (e.target as HTMLImageElement).src = fallback;
                      }}
                    />
                    <span className={`card-status ${ad.status === 'active' ? 'active' : 'pending'}`}>
                      {ad.status === 'active' ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                  <div className="card-body">
                    <div className="card-title">{ad.title}</div>
                    <div className="card-price">
                      {ad.price?.toLocaleString() || '0'}{' '}
                      <span className="card-price-unit">RWF</span>
                    </div>
                    <div className="card-location">📍 {ad.location || 'Rwanda'}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}