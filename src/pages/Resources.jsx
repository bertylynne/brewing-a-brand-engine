import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { ArrowRight, RefreshCw } from 'lucide-react';

// ── Industry tag colours ───────────────────────────────────────────────────────
const INDUSTRY_META = {
  Digital:      { dot: '#63b3ed', bg: 'rgba(99,179,237,0.10)',  border: 'rgba(99,179,237,0.30)'  },
  Wellness:     { dot: '#8FAF6A', bg: 'rgba(143,175,106,0.10)', border: 'rgba(143,175,106,0.30)' },
  Barber:       { dot: '#C5A059', bg: 'rgba(197,160,89,0.10)',  border: 'rgba(197,160,89,0.30)'  },
  Nonprofit:    { dot: '#A78BFA', bg: 'rgba(167,139,250,0.10)', border: 'rgba(167,139,250,0.30)' },
  Hospitality:  { dot: '#64CCF1', bg: 'rgba(100,204,241,0.10)', border: 'rgba(100,204,241,0.30)' },
  Construction: { dot: '#E8705A', bg: 'rgba(232,112,90,0.10)',  border: 'rgba(232,112,90,0.30)'  },
};

const getIndustryMeta = (tag) =>
  INDUSTRY_META[tag] || { dot: '#94a3b8', bg: 'rgba(148,163,184,0.10)', border: 'rgba(148,163,184,0.30)' };

// ── IndustryTag pill ──────────────────────────────────────────────────────────
function IndustryTag({ label }) {
  const meta = getIndustryMeta(label);
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
      style={{ background: meta.bg, border: `1px solid ${meta.border}`, color: meta.dot }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: meta.dot }} />
      {label}
    </span>
  );
}

// ── PostCard ──────────────────────────────────────────────────────────────────
function PostCard({ post }) {
  return (
    <article
      className="group flex flex-col rounded-2xl border overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
      style={{
        background:  '#FFFFFF',
        borderColor: 'rgba(44,62,80,0.09)',
        boxShadow:   '0 2px 8px rgba(44,62,80,0.06)',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(44,62,80,0.12)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(44,62,80,0.06)'; }}
    >
      {/* Image placeholder */}
      <div
        className="h-44 flex-shrink-0 flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #F5F0E8 0%, #EDE8DC 100%)' }}
      >
        <span
          className="text-[10px] font-bold uppercase tracking-widest"
          style={{ color: '#B0BEC9' }}
        >
          CBA Solutions
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {post.industry_tag && <IndustryTag label={post.industry_tag} />}

        <h2
          className="text-sm font-black leading-snug"
          style={{ color: '#2C3E50', fontFamily: "'Montserrat', sans-serif" }}
        >
          {post.title}
        </h2>

        {post.excerpt && (
          <p
            className="text-xs leading-relaxed flex-1"
            style={{ color: '#7A8FA6' }}
          >
            {post.excerpt}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-3 border-t" style={{ borderColor: 'rgba(44,62,80,0.07)' }}>
          <span className="text-[10px] font-medium" style={{ color: '#B0BEC9' }}>
            {post.date}
          </span>
          <span
            className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider transition-all duration-150 group-hover:gap-2"
            style={{ color: '#64CCF1' }}
          >
            Read more <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </article>
  );
}

// ── Skeleton card (loading state) ─────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(44,62,80,0.07)', background: '#fff' }}>
      <div className="h-44 animate-pulse" style={{ background: '#F5F0E8' }} />
      <div className="p-5 flex flex-col gap-3">
        <div className="h-5 w-20 rounded-full animate-pulse" style={{ background: '#EDE8DC' }} />
        <div className="h-4 w-full rounded animate-pulse" style={{ background: '#EDE8DC' }} />
        <div className="h-4 w-3/4 rounded animate-pulse" style={{ background: '#EDE8DC' }} />
        <div className="h-3 w-full rounded animate-pulse mt-1" style={{ background: '#F5F0E8' }} />
        <div className="h-3 w-5/6 rounded animate-pulse" style={{ background: '#F5F0E8' }} />
      </div>
    </div>
  );
}

// ── Resources page ────────────────────────────────────────────────────────────
export default function Resources() {
  const [posts,   setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    async function fetchPublished() {
      setLoading(true);
      setError(null);

      const { data, error: dbErr } = await supabase
        .from('posts')
        .select('id, title, excerpt, industry_tag, date, status')
        .eq('status', 'Published')
        .order('date', { ascending: false });

      if (dbErr) {
        console.error('[Resources] Supabase fetch error:', dbErr);
        setError(dbErr.message);
      } else {
        console.log('[Resources] Fetched', data.length, 'published posts');
        setPosts(data);
      }
      setLoading(false);
    }

    fetchPublished();
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{ background: '#F5F0E8', fontFamily: "'Inter', sans-serif" }}
    >
      {/* Header */}
      <header style={{ background: '#2C3E50' }}>
        <div className="max-w-6xl mx-auto px-6 py-14">
          <p
            className="text-[10px] font-bold uppercase tracking-[0.25em] mb-3"
            style={{ color: '#64CCF1' }}
          >
            CBA Solutions · Resources
          </p>
          <h1
            className="text-3xl font-black tracking-tight leading-none mb-3"
            style={{ color: '#F5F0E8', fontFamily: "'Montserrat', sans-serif" }}
          >
            Insights &amp; Guides
          </h1>
          <p className="text-sm max-w-xl" style={{ color: '#7A8FA6' }}>
            Practical advice for small business owners on branding, web design, and growing your digital presence.
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">

        {/* Error state */}
        {error && (
          <div
            className="flex items-center gap-3 rounded-xl px-5 py-4 mb-8 text-sm"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#dc2626' }}
          >
            <span className="font-bold">Could not load posts:</span> {error}
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Loaded: posts */}
        {!loading && posts.length > 0 && (
          <>
            <p
              className="text-[10px] font-bold uppercase tracking-widest mb-6"
              style={{ color: '#B0BEC9' }}
            >
              {posts.length} article{posts.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </>
        )}

        {/* Loaded: empty */}
        {!loading && posts.length === 0 && !error && (
          <div className="flex flex-col items-center gap-3 py-24 text-center">
            <RefreshCw className="w-8 h-8" style={{ color: '#B0BEC9' }} />
            <p className="text-sm font-semibold" style={{ color: '#7A8FA6' }}>No published posts yet</p>
            <p className="text-xs" style={{ color: '#B0BEC9' }}>
              Use the Newsroom to import and publish content.
            </p>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t py-6" style={{ borderColor: 'rgba(44,62,80,0.10)' }}>
        <p className="text-center text-[10px] uppercase tracking-widest font-medium" style={{ color: '#B0BEC9' }}>
          CBA Solutions · All rights reserved
        </p>
      </footer>
    </div>
  );
}
