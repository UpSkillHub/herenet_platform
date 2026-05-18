'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface Job {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  status: string;
  isFeatured: boolean;
  createdAt: string;
  expiryDate: string;
  userId: number;
  categoryId: number;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, full-time, part-time, remote
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await api.get('/ads?categoryId=3'); // Category ID 3 is Jobs
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getJobImage = (job: Job) => {
    if (job.images && Array.isArray(job.images) && job.images.length > 0) {
      return job.images[0];
    }
    // Fallback job-themed images
    const jobImages = [
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
      'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
      'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800',
      'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800',
    ];
    return jobImages[job.id % jobImages.length];
  };

  const getJobType = (job: Job) => {
    // You can add logic based on job description or title
    if (job.title.toLowerCase().includes('remote')) return 'remote';
    if (job.title.toLowerCase().includes('part')) return 'part-time';
    return 'full-time';
  };

  const filteredJobs = jobs.filter(job => {
    if (filter !== 'all' && getJobType(job) !== filter) return false;
    if (locationFilter && !job.location.toLowerCase().includes(locationFilter.toLowerCase())) return false;
    return true;
  });

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
          --mid-2: #222228;
          --text-muted: rgba(255,255,255,0.45);
          --text-soft: rgba(255,255,255,0.75);
          --border: rgba(255,255,255,0.07);
        }

        * { box-sizing: border-box; }

        body {
          font-family: 'DM Sans', sans-serif;
          background: var(--dark);
          color: white;
          margin: 0;
        }

        .page {
          min-height: 100vh;
          background: var(--dark);
          padding: 64px 24px 100px;
          position: relative;
        }

        .grid-lines {
          position: fixed;
          inset: 0;
          background-image: linear-gradient(rgba(201,168,76,0.025) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(201,168,76,0.025) 1px, transparent 1px);
          background-size: 80px 80px;
          pointer-events: none;
          z-index: 0;
        }

        .container {
          max-width: 1280px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        /* Header */
        .header {
          margin-bottom: 48px;
          animation: fadeUp 0.7s ease both;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 24px;
        }

        .breadcrumb a {
          font-size: 12px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--text-muted);
          text-decoration: none;
          transition: color 0.2s;
        }

        .breadcrumb a:hover {
          color: var(--gold-light);
        }

        .breadcrumb-sep {
          font-size: 10px;
          color: var(--text-muted);
        }

        .breadcrumb-current {
          font-size: 12px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--text-soft);
        }

        .title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(42px, 6vw, 64px);
          font-weight: 300;
          line-height: 1.05;
          letter-spacing: -0.02em;
          color: white;
          margin-bottom: 16px;
        }

        .title em {
          font-style: italic;
          color: var(--gold-light);
        }

        .subtitle {
          font-size: 16px;
          font-weight: 300;
          color: var(--text-soft);
          max-width: 600px;
          line-height: 1.6;
        }

        /* Filters */
        .filters {
          background: var(--mid);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 20px 24px;
          margin-bottom: 40px;
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          align-items: center;
          justify-content: space-between;
          animation: fadeUp 0.7s ease 0.05s both;
        }

        .filter-group {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .filter-btn {
          background: var(--mid-2);
          border: 1px solid var(--border);
          border-radius: 100px;
          padding: 8px 20px;
          font-size: 13px;
          font-weight: 500;
          color: var(--text-soft);
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-btn:hover {
          border-color: rgba(201,168,76,0.3);
          color: var(--gold-light);
        }

        .filter-btn.active {
          background: linear-gradient(135deg, var(--gold), #8a6020);
          border-color: transparent;
          color: white;
        }

        .location-input {
          background: var(--mid-2);
          border: 1px solid var(--border);
          border-radius: 100px;
          padding: 8px 20px;
          font-size: 13px;
          color: white;
          outline: none;
          width: 200px;
        }

        .location-input::placeholder {
          color: var(--text-muted);
        }

        .location-input:focus {
          border-color: rgba(201,168,76,0.4);
        }

        .results-count {
          font-size: 13px;
          color: var(--text-muted);
        }

        /* Jobs Grid */
        .jobs-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        @media (max-width: 1024px) {
          .jobs-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .jobs-grid {
            grid-template-columns: 1fr;
          }
        }

        .job-card {
          background: var(--mid);
          border: 1px solid var(--border);
          border-radius: 20px;
          overflow: hidden;
          text-decoration: none;
          color: white;
          transition: transform 0.3s, border-color 0.3s, box-shadow 0.3s;
          animation: fadeUp 0.6s ease both;
        }

        .job-card:hover {
          transform: translateY(-6px);
          border-color: rgba(201,168,76,0.25);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }

        .card-image {
          height: 200px;
          background: var(--mid-2);
          overflow: hidden;
          position: relative;
        }

        .card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s;
        }

        .job-card:hover .card-image img {
          transform: scale(1.05);
        }

        .job-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          background: rgba(10, 10, 12, 0.8);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 4px 12px;
          border-radius: 100px;
          font-weight: 500;
        }

        .featured-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: rgba(201, 168, 76, 0.2);
          border: 1px solid rgba(201, 168, 76, 0.4);
          color: var(--gold-light);
          padding: 4px 12px;
          border-radius: 100px;
        }

        .job-type {
          position: absolute;
          bottom: 12px;
          left: 12px;
          font-size: 10px;
          background: rgba(0, 0, 0, 0.7);
          padding: 4px 10px;
          border-radius: 100px;
          text-transform: uppercase;
          font-weight: 600;
        }

        .job-type.full-time { background: rgba(16, 185, 129, 0.2); color: #6ee7b7; }
        .job-type.part-time { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
        .job-type.remote { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }

        .card-content {
          padding: 20px;
        }

        .job-title {
          font-size: 16px;
          font-weight: 600;
          line-height: 1.4;
          margin-bottom: 8px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .job-salary {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 600;
          color: var(--gold-light);
          margin: 8px 0;
        }

        .job-salary small {
          font-size: 13px;
          font-weight: 400;
          color: var(--text-muted);
        }

        .job-location {
          font-size: 12px;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 8px;
        }

        .job-description {
          font-size: 13px;
          color: var(--text-soft);
          line-height: 1.5;
          margin-top: 12px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 80px 24px;
          background: var(--mid);
          border: 1px solid var(--border);
          border-radius: 24px;
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: 20px;
          opacity: 0.5;
        }

        .empty-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px;
          font-weight: 400;
          margin-bottom: 12px;
        }

        .empty-text {
          font-size: 14px;
          color: var(--text-muted);
          margin-bottom: 24px;
        }

        .post-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, var(--gold), #8a6020);
          color: white;
          text-decoration: none;
          padding: 12px 28px;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 500;
          transition: transform 0.2s;
        }

        .post-btn:hover {
          transform: translateY(-2px);
        }

        /* Skeletons */
        .skeleton-card {
          background: var(--mid);
          border: 1px solid var(--border);
          border-radius: 20px;
          overflow: hidden;
        }

        .skeleton-img {
          height: 200px;
          background: linear-gradient(90deg, #1c1c22 25%, #26262e 50%, #1c1c22 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }

        .skeleton-content {
          padding: 20px;
        }

        .skeleton-line {
          height: 14px;
          background: linear-gradient(90deg, #1c1c22 25%, #26262e 50%, #1c1c22 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 6px;
          margin-bottom: 12px;
        }

        .skeleton-line.short {
          width: 60%;
        }

        @keyframes shimmer {
          from { background-position: 200% 0; }
          to { background-position: -200% 0; }
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="page">
        <div className="grid-lines" />
        <div className="container">
          {/* Breadcrumb */}
          <div className="header">
            <div className="breadcrumb">
              <Link href="/">Home</Link>
              <span className="breadcrumb-sep">›</span>
              <span className="breadcrumb-current">Jobs</span>
            </div>
            <h1 className="title">
              Find Your <em>Dream Job</em>
            </h1>
            <p className="subtitle">
              Discover thousands of job opportunities across Rwanda. From entry-level to executive positions.
            </p>
          </div>

          {/* Filters */}
          <div className="filters">
            <div className="filter-group">
              <button
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All Jobs
              </button>
              <button
                className={`filter-btn ${filter === 'full-time' ? 'active' : ''}`}
                onClick={() => setFilter('full-time')}
              >
                Full Time
              </button>
              <button
                className={`filter-btn ${filter === 'part-time' ? 'active' : ''}`}
                onClick={() => setFilter('part-time')}
              >
                Part Time
              </button>
              <button
                className={`filter-btn ${filter === 'remote' ? 'active' : ''}`}
                onClick={() => setFilter('remote')}
              >
                Remote
              </button>
            </div>
            <div>
              <input
                type="text"
                className="location-input"
                placeholder="📍 Filter by location..."
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </div>
          </div>

          {/* Results count */}
          {!loading && (
            <div className="results-count" style={{ marginBottom: 20 }}>
              Found {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''}
            </div>
          )}

          {/* Jobs Grid */}
          {loading ? (
            <div className="jobs-grid">
              {[...Array(6)].map((_, i) => (
                <div className="skeleton-card" key={i}>
                  <div className="skeleton-img" />
                  <div className="skeleton-content">
                    <div className="skeleton-line" />
                    <div className="skeleton-line short" />
                    <div className="skeleton-line" style={{ width: '80%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h2 className="empty-title">No jobs found</h2>
              <p className="empty-text">
                {locationFilter
                  ? `No jobs found in "${locationFilter}". Try a different location.`
                  : "No jobs available at the moment. Be the first to post one!"}
              </p>
              <Link href="/post-ad" className="post-btn">
                Post a Job → 
              </Link>
            </div>
          ) : (
            <div className="jobs-grid">
              {filteredJobs.map((job, index) => {
                const jobType = getJobType(job);
                return (
                  <Link href={`/ad/${job.id}`} key={job.id} className="job-card">
                    <div className="card-image">
                      <img
                        src={getJobImage(job)}
                        alt={job.title}
                        loading="lazy"
                        onError={(e) => {
                          const fallbackImages = [
                            'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
                            'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800',
                          ];
                          (e.target as HTMLImageElement).src = fallbackImages[job.id % fallbackImages.length];
                        }}
                      />
                      <span className="job-badge">✓ Verified</span>
                      {job.isFeatured && (
                        <span className="featured-badge">⭐ Featured</span>
                      )}
                      <span className={`job-type ${jobType}`}>
                        {jobType === 'full-time' && 'Full Time'}
                        {jobType === 'part-time' && 'Part Time'}
                        {jobType === 'remote' && 'Remote'}
                      </span>
                    </div>
                    <div className="card-content">
                      <h3 className="job-title">{job.title}</h3>
                      <div className="job-salary">
                        {job.price.toLocaleString()} <small>RWF/month</small>
                      </div>
                      <div className="job-location">
                        📍 {job.location || 'Rwanda'}
                      </div>
                      <div className="job-description">
                        {job.description?.slice(0, 100)}...
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}