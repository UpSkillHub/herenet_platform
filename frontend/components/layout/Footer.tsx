export default function Footer() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

        :root {
          --gold: #C9A84C;
          --gold-light: #E8C97A;
          --dark: #0A0A0C;
          --dark-2: #111114;
          --mid: #1C1C22;
          --text-muted: rgba(255,255,255,0.38);
          --text-soft: rgba(255,255,255,0.65);
        }

        .footer {
          background: var(--dark-2);
          border-top: 1px solid rgba(255,255,255,0.06);
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* Ambient glow */
        .footer::before {
          content: '';
          position: absolute;
          bottom: -100px;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(ellipse, rgba(201,168,76,0.05) 0%, transparent 70%);
          pointer-events: none;
        }

        .footer-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 72px 32px 0;
          position: relative;
          z-index: 1;
        }

        .footer-top {
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr 1fr;
          gap: 48px;
          padding-bottom: 56px;
        }

        @media (max-width: 900px) {
          .footer-top { grid-template-columns: 1fr 1fr; }
        }

        @media (max-width: 540px) {
          .footer-top { grid-template-columns: 1fr; gap: 36px; }
        }

        /* Brand column */
        .footer-brand-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 30px;
          font-weight: 600;
          color: white;
          letter-spacing: -0.02em;
          text-decoration: none;
          display: inline-block;
          margin-bottom: 16px;
        }

        .footer-brand-logo em {
          font-style: italic;
          color: var(--gold-light);
        }

        .footer-brand-desc {
          font-size: 13px;
          font-weight: 300;
          color: var(--text-muted);
          line-height: 1.75;
          max-width: 220px;
        }

        /* Gold divider */
        .footer-brand-line {
          width: 32px;
          height: 1px;
          background: linear-gradient(90deg, var(--gold), transparent);
          margin: 20px 0;
        }

        /* Social icons */
        .footer-socials {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .footer-social-btn {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          color: var(--text-muted);
          text-decoration: none;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
        }

        .footer-social-btn:hover {
          border-color: rgba(201,168,76,0.4);
          color: var(--gold-light);
          background: rgba(201,168,76,0.07);
        }

        /* Link columns */
        .footer-col-title {
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--gold-light);
          margin-bottom: 22px;
          font-weight: 500;
        }

        .footer-links {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 13px;
        }

        .footer-links a {
          font-size: 13px;
          font-weight: 300;
          color: var(--text-soft);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0;
          transition: color 0.2s, gap 0.2s;
          position: relative;
        }

        .footer-links a::before {
          content: '—';
          font-size: 10px;
          color: var(--gold);
          opacity: 0;
          width: 0;
          overflow: hidden;
          transition: opacity 0.2s, width 0.2s;
          margin-right: 0;
        }

        .footer-links a:hover { color: white; gap: 8px; }
        .footer-links a:hover::before { opacity: 1; width: 14px; }

        /* Bottom bar */
        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 24px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        .footer-copy {
          font-size: 12px;
          color: var(--text-muted);
          letter-spacing: 0.04em;
        }

        .footer-copy span {
          color: var(--gold);
        }

        .footer-bottom-links {
          display: flex;
          gap: 24px;
        }

        .footer-bottom-links a {
          font-size: 11px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--text-muted);
          text-decoration: none;
          transition: color 0.2s;
        }

        .footer-bottom-links a:hover { color: var(--gold-light); }
      `}</style>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-top">

            {/* Brand */}
            <div>
              <a href="/" className="footer-brand-logo">
                Here<em>Net</em>
              </a>
              <div className="footer-brand-line" />
              <p className="footer-brand-desc">
                Rwanda's trusted marketplace for products, services, jobs &amp; opportunities.
              </p>
              <div className="footer-socials">
                <a href="#" className="footer-social-btn" aria-label="Twitter">𝕏</a>
                <a href="#" className="footer-social-btn" aria-label="Facebook">f</a>
                <a href="#" className="footer-social-btn" aria-label="Instagram">◻</a>
                <a href="#" className="footer-social-btn" aria-label="LinkedIn">in</a>
              </div>
            </div>

            {/* Platform */}
            <div>
              <div className="footer-col-title">Platform</div>
              <ul className="footer-links">
                <li><a href="/categories">Categories</a></li>
                <li><a href="/search">Search Ads</a></li>
                <li><a href="/post-ad">Post an Ad</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <div className="footer-col-title">Company</div>
              <ul className="footer-links">
                <li><a href="#">About Us</a></li>
                <li><a href="#">How It Works</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Careers</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <div className="footer-col-title">Support</div>
              <ul className="footer-links">
                <li><a href="#">Contact Us</a></li>
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Safety Tips</a></li>
                <li><a href="#">Terms &amp; Privacy</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="footer-bottom">
            <p className="footer-copy">
              © 2026 <span>HereNet</span> Rwanda. All Rights Reserved.
            </p>
            <div className="footer-bottom-links">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}