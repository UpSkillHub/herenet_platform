'use client';
import Link from 'next/link';

const categories = [
  { name: "Products", icon: "📱", count: "1,284", desc: "Electronics, fashion & more", slug: "products" },
  { name: "Services", icon: "🔧", count: "892", desc: "Professionals at your door", slug: "services" },
  { name: "Jobs", icon: "💼", count: "347", desc: "Opportunities across Rwanda", slug: "jobs" },
  { name: "Real Estate", icon: "🏠", count: "156", desc: "Buy, rent or lease", slug: "real-estate" },
  { name: "Vehicles", icon: "🚗", count: "421", desc: "Cars, motos & more", slug: "vehicles" },
  { name: "Business Opportunities", icon: "📈", count: "98", desc: "Invest & grow", slug: "business" },
];

export default function Categories() {
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
          --text-muted: rgba(255,255,255,0.45);
          --text-soft: rgba(255,255,255,0.75);
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

        .page {
          min-height: 100vh;
          background: var(--dark);
          padding: 80px 24px 100px;
          position: relative;
          overflow: hidden;
        }

        /* Ambient background */
        .page::before {
          content: '';
          position: fixed;
          top: -200px;
          left: 50%;
          transform: translateX(-50%);
          width: 700px;
          height: 700px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%);
          pointer-events: none;
        }

        .grid-lines {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(201,168,76,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.03) 1px, transparent 1px);
          background-size: 80px 80px;
          pointer-events: none;
          z-index: 0;
        }

        .inner {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        /* Header */
        .page-header {
          text-align: center;
          margin-bottom: 64px;
          animation: fadeUp 0.7s ease both;
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(201,168,76,0.1);
          border: 1px solid rgba(201,168,76,0.25);
          border-radius: 100px;
          padding: 5px 16px;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--gold-light);
          margin-bottom: 24px;
        }

        .eyebrow::before {
          content: '';
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--gold);
          box-shadow: 0 0 6px var(--gold);
        }

        .page-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(42px, 7vw, 72px);
          font-weight: 300;
          line-height: 1;
          letter-spacing: -0.02em;
          color: white;
        }

        .page-title em {
          font-style: italic;
          color: var(--gold-light);
        }

        .page-sub {
          margin-top: 16px;
          font-size: 16px;
          font-weight: 300;
          color: var(--text-muted);
          letter-spacing: 0.02em;
        }

        /* Grid */
        .cat-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: rgba(255,255,255,0.05);
          border-radius: 24px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.06);
        }

        @media (max-width: 768px) {
          .cat-grid { 
            grid-template-columns: repeat(2, 1fr); 
          }
        }

        @media (max-width: 480px) {
          .cat-grid { 
            grid-template-columns: 1fr; 
          }
        }

        .cat-card {
          background: var(--mid);
          padding: 48px 40px;
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: white;
          position: relative;
          overflow: hidden;
          transition: background 0.35s;
          animation: fadeUp 0.6s ease both;
        }

        .cat-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--gold-dim), transparent 60%);
          opacity: 0;
          transition: opacity 0.35s;
        }

        .cat-card:hover { 
          background: #222228; 
        }
        
        .cat-card:hover::before { 
          opacity: 1; 
        }

        /* Gold accent line on hover */
        .cat-card::after {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(180deg, transparent, var(--gold), transparent);
          opacity: 0;
          transition: opacity 0.35s;
        }

        .cat-card:hover::after { 
          opacity: 1; 
        }

        .cat-icon-wrap {
          width: 60px;
          height: 60px;
          border-radius: 16px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          margin-bottom: 24px;
          transition: border-color 0.35s, transform 0.35s;
          position: relative;
          z-index: 1;
        }

        .cat-card:hover .cat-icon-wrap {
          border-color: rgba(201,168,76,0.35);
          transform: scale(1.08);
        }

        .cat-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px;
          font-weight: 400;
          letter-spacing: -0.01em;
          color: white;
          position: relative;
          z-index: 1;
          transition: color 0.3s;
        }

        .cat-card:hover .cat-name { 
          color: var(--gold-light); 
        }

        .cat-desc {
          font-size: 13px;
          font-weight: 300;
          color: var(--text-muted);
          margin-top: 6px;
          position: relative;
          z-index: 1;
        }

        .cat-count {
          margin-top: 20px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--gold-light);
          position: relative;
          z-index: 1;
          opacity: 0.7;
          transition: opacity 0.3s;
        }

        .cat-card:hover .cat-count { 
          opacity: 1; 
        }

        .cat-count::before {
          content: '';
          width: 18px;
          height: 1px;
          background: var(--gold);
        }

        /* Arrow */
        .cat-arrow {
          position: absolute;
          bottom: 24px;
          right: 28px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          color: var(--text-muted);
          opacity: 0;
          transform: translateX(-6px);
          transition: opacity 0.3s, transform 0.3s, border-color 0.3s;
          z-index: 1;
        }

        .cat-card:hover .cat-arrow {
          opacity: 1;
          transform: translateX(0);
          border-color: rgba(201,168,76,0.35);
          color: var(--gold-light);
        }

        @keyframes fadeUp {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
      `}</style>

      <div className="page">
        <div className="grid-lines" />

        <div className="inner">
          {/* Header */}
          <div className="page-header">
            <div className="eyebrow">Explore by Category</div>
            <h1 className="page-title">
              Browse <em>Everything</em><br />in Rwanda
            </h1>
            <p className="page-sub">Find what you need across all categories</p>
          </div>

          {/* Category Grid */}
          <div className="cat-grid">
            {categories.map((category, index) => (
              <Link
                key={category.name}
                href={`/search?category=${category.slug}`}
                className="cat-card"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="cat-icon-wrap">{category.icon}</div>
                <div className="cat-name">{category.name}</div>
                <div className="cat-desc">{category.desc}</div>
                <div className="cat-count">{category.count} listings</div>
                <div className="cat-arrow">→</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}