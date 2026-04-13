import { useState, useRef } from 'react';
import {
  FileText, Inbox, LayoutGrid, Upload, ChevronDown, Check,
  AlertCircle, X, Plus, Search, Filter, ArrowUpDown, ExternalLink,
  Image as ImageIcon, Newspaper, Code2, Download, RefreshCw, Eye, EyeOff,
} from 'lucide-react';

// ── Design tokens ─────────────────────────────────────────────────────────────
const PARCHMENT  = '#F5F0E8';
const PARCHMENT2 = '#EDE8DC';
const SLATE      = '#2C3E50';
const SLATE2     = '#3D5166';
const SLATE_MUTED= '#7A8FA6';
const SLATE_FAINT= '#B0BEC9';
const SIGNAL     = '#64CCF1';
const SIGNAL_DIM = '#3DBDE8';
const BRASS      = '#C5A059';
const BRASS_DIM  = '#A8864A';
const WHITE      = '#FFFFFF';
const BORDER     = 'rgba(44,62,80,0.1)';
const BORDER2    = 'rgba(44,62,80,0.06)';

// ── Industry tags ─────────────────────────────────────────────────────────────
const INDUSTRIES = [
  { id: 'construction', label: 'Construction', dot: '#E8705A' },
  { id: 'wellness',     label: 'Wellness',     dot: '#8FAF6A' },
  { id: 'barber',       label: 'Barber',       dot: BRASS     },
  { id: 'nonprofit',    label: 'Nonprofit',    dot: '#A78BFA' },
  { id: 'hospitality',  label: 'Hospitality',  dot: SIGNAL    },
  { id: 'digital',      label: 'Digital',      dot: '#63b3ed' },
];

const getIndustry = (id) => INDUSTRIES.find((i) => i.id === id) || null;

// ── Seed data: 24 posts ───────────────────────────────────────────────────────
let _uid = 100;
const uid = () => _uid++;

const SEED_POSTS = [
  { id:uid(), title:'5 Ways Premium Websites Drive Barbershop Bookings',         date:'2025-11-14', industry:'barber',       status:'published', image:null },
  { id:uid(), title:'From Clippers to Clicks: A Barber\'s Digital Playbook',    date:'2025-11-07', industry:'barber',       status:'published', image:null },
  { id:uid(), title:'The Wellness Brand Blueprint: Building Trust Online',       date:'2025-10-30', industry:'wellness',     status:'published', image:null },
  { id:uid(), title:'Why Spas Need SEO-First Web Design in 2025',                date:'2025-10-22', industry:'wellness',     status:'draft',     image:null },
  { id:uid(), title:'Constructing Your Online Presence: A Contractor\'s Guide',  date:'2025-10-15', industry:'construction', status:'published', image:null },
  { id:uid(), title:'Case Study: Renovating a Trades Company Website',           date:'2025-10-08', industry:'construction', status:'published', image:null },
  { id:uid(), title:'Hospitality in the Age of Google: What Hotels Must Know',   date:'2025-09-29', industry:'hospitality',  status:'published', image:null },
  { id:uid(), title:'Restaurant Websites That Actually Convert Tables',          date:'2025-09-21', industry:'hospitality',  status:'draft',     image:null },
  { id:uid(), title:'Digital Transformation for Nonprofits on a Budget',        date:'2025-09-14', industry:'nonprofit',    status:'published', image:null },
  { id:uid(), title:'Building Donor Trust Through Web Design',                  date:'2025-09-07', industry:'nonprofit',    status:'published', image:null },
  { id:uid(), title:'The SaaS Landing Page Formula That Converts',              date:'2025-08-28', industry:'digital',      status:'published', image:null },
  { id:uid(), title:'UX Lessons from 100 Agency Builds',                       date:'2025-08-20', industry:'digital',      status:'published', image:null },
  { id:uid(), title:'The Fade That Went Viral: Social Media for Barbers',       date:'2025-08-12', industry:'barber',       status:'draft',     image:null },
  { id:uid(), title:'Colour Psychology in Barbershop Branding',                 date:'2025-08-04', industry:'barber',       status:'published', image:null },
  { id:uid(), title:'Nutrition Brand Websites: What Works in 2025',             date:'2025-07-28', industry:'wellness',     status:'published', image:null },
  { id:uid(), title:'Mindfulness Studios and the Minimal Web Aesthetic',        date:'2025-07-20', industry:'wellness',     status:'draft',     image:null },
  { id:uid(), title:'Commercial Landscaping: Winning Bids With a Better Site',  date:'2025-07-13', industry:'construction', status:'published', image:null },
  { id:uid(), title:'Signage Companies and the Power of Visual Web Design',     date:'2025-07-05', industry:'construction', status:'draft',     image:null },
  { id:uid(), title:'Boutique Hotels vs. AirBnB: The Website Edge',             date:'2025-06-27', industry:'hospitality',  status:'published', image:null },
  { id:uid(), title:'Event Catering: How Your Website Books the Room',          date:'2025-06-19', industry:'hospitality',  status:'published', image:null },
  { id:uid(), title:'Grant-Ready: How Web Presence Wins Funding',               date:'2025-06-11', industry:'nonprofit',    status:'draft',     image:null },
  { id:uid(), title:'Community Orgs and Volunteer Recruitment Web Tactics',     date:'2025-06-03', industry:'nonprofit',    status:'published', image:null },
  { id:uid(), title:'API-First Design: Why Your Stack Matters for Growth',      date:'2025-05-26', industry:'digital',      status:'published', image:null },
  { id:uid(), title:'The No-Code vs. Custom Build Debate — Settled',            date:'2025-05-18', industry:'digital',      status:'draft',     image:null },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmtDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][parseInt(m)-1]} ${y}`;
}

// ── Industry tag dropdown ─────────────────────────────────────────────────────
function IndustryDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const current = getIndustry(value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all whitespace-nowrap"
        style={{
          borderColor: current ? `${current.dot}50` : BORDER,
          background:  current ? `${current.dot}0f` : PARCHMENT,
          color:       current ? current.dot : SLATE_MUTED,
          minWidth: '116px',
        }}
      >
        {current && <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: current.dot }} />}
        <span className="flex-1 text-left truncate">{current?.label || 'Tag…'}</span>
        <ChevronDown className="w-3 h-3 flex-shrink-0 opacity-60" />
      </button>

      {open && (
        <div
          className="absolute top-full left-0 mt-1 z-30 rounded-xl border shadow-xl overflow-hidden"
          style={{ borderColor: BORDER, background: WHITE, minWidth: '140px' }}
          onMouseLeave={() => setOpen(false)}
        >
          <div className="p-1">
            {INDUSTRIES.map((ind) => (
              <button
                key={ind.id}
                type="button"
                onClick={() => { onChange(ind.id); setOpen(false); }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors text-left"
                style={{
                  background: value === ind.id ? `${ind.dot}10` : 'transparent',
                  color:      value === ind.id ? ind.dot : SLATE2,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = `${ind.dot}08`; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = value === ind.id ? `${ind.dot}10` : 'transparent'; }}
              >
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: ind.dot }} />
                {ind.label}
                {value === ind.id && <Check className="w-3 h-3 ml-auto" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Status toggle ─────────────────────────────────────────────────────────────
function StatusToggle({ value, onChange }) {
  const published = value === 'published';
  return (
    <button
      type="button"
      onClick={() => onChange(published ? 'draft' : 'published')}
      className="flex items-center gap-2 transition-all select-none"
      title={published ? 'Click to unpublish' : 'Click to publish'}
    >
      <div
        className="relative rounded-full transition-all duration-200 flex-shrink-0"
        style={{ background: published ? SIGNAL : SLATE_FAINT, width: '36px', height: '20px' }}
      >
        <span
          className="absolute top-[3px] w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-all duration-200"
          style={{ left: published ? '17px' : '3px' }}
        />
      </div>
      <span
        className="text-[10px] font-bold uppercase tracking-wider"
        style={{ color: published ? SIGNAL_DIM : SLATE_FAINT, minWidth: '56px' }}
      >
        {published ? 'Published' : 'Draft'}
      </span>
    </button>
  );
}

// ── Image cell ────────────────────────────────────────────────────────────────
function ImageCell({ post, onUpload }) {
  const fileRef = useRef();
  return (
    <div
      onClick={() => fileRef.current?.click()}
      className="relative rounded-lg overflow-hidden border cursor-pointer flex items-center justify-center transition-all group"
      style={{
        width: '56px', height: '36px', flexShrink: 0,
        borderColor: post.image ? `${BRASS}30` : BORDER,
        background:  post.image ? 'transparent' : PARCHMENT2,
      }}
      title="Upload featured image"
    >
      {post.image ? (
        <>
          <img src={post.image} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: 'rgba(0,0,0,0.45)' }}>
            <Upload className="w-3 h-3 text-white" />
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-0.5 group-hover:opacity-80 transition-opacity">
          <ImageIcon className="w-3.5 h-3.5" style={{ color: SLATE_FAINT }} />
        </div>
      )}
      <input ref={fileRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onUpload(post.id, URL.createObjectURL(f));
        }}
      />
    </div>
  );
}

// ── Post row ──────────────────────────────────────────────────────────────────
function PostRow({ post, onUpdate }) {
  return (
    <div
      className="flex items-center gap-4 px-5 py-3.5 rounded-xl border transition-all duration-150 group"
      style={{ background: WHITE, borderColor: BORDER, boxShadow: '0 1px 3px rgba(44,62,80,0.06)' }}
    >
      {/* Image */}
      <ImageCell
        post={post}
        onUpload={(id, url) => onUpdate(id, 'image', url)}
      />

      {/* Title + Date */}
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-bold leading-tight truncate transition-colors group-hover:opacity-80"
          style={{ color: SLATE, fontFamily: "'Montserrat', sans-serif" }}
        >
          {post.title}
        </p>
        <p className="text-[10px] mt-0.5 font-medium" style={{ color: SLATE_MUTED }}>
          {fmtDate(post.date)}
        </p>
      </div>

      {/* Industry tag */}
      <div className="flex-shrink-0">
        <IndustryDropdown
          value={post.industry}
          onChange={(val) => onUpdate(post.id, 'industry', val)}
        />
      </div>

      {/* Status toggle */}
      <div className="flex-shrink-0">
        <StatusToggle
          value={post.status}
          onChange={(val) => onUpdate(post.id, 'status', val)}
        />
      </div>

      {/* Brass dot — published indicator */}
      <div
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ background: post.status === 'published' ? BRASS : PARCHMENT2 }}
        title={post.status === 'published' ? 'Published' : 'Draft'}
      />
    </div>
  );
}

// ── Import Dock ───────────────────────────────────────────────────────────────
function ImportDock({ onImport }) {
  const [raw,     setRaw]     = useState('');
  const [error,   setError]   = useState(null);
  const [success, setSuccess] = useState(null);

  const handleProcess = () => {
    setError(null);
    setSuccess(null);
    if (!raw.trim()) { setError('Paste JSON data first.'); return; }
    try {
      const parsed = JSON.parse(raw);
      const posts = Array.isArray(parsed) ? parsed : [parsed];
      const normalised = posts.map((p, i) => ({
        id:       Date.now() + i,
        title:    p.title    || p.name  || 'Untitled Post',
        date:     p.date     || p.published_at || new Date().toISOString().slice(0,10),
        industry: p.industry || p.tag   || p.category || '',
        status:   p.status   || 'draft',
        image:    p.image    || p.featured_image || null,
      }));
      onImport(normalised);
      setSuccess(`${normalised.length} post${normalised.length !== 1 ? 's' : ''} imported successfully.`);
      setRaw('');
    } catch {
      setError('Invalid JSON. Please check your data format and try again.');
    }
  };

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ borderColor: `${SIGNAL}30`, background: WHITE, boxShadow: '0 2px 12px rgba(100,204,241,0.08)' }}
    >
      {/* Dock header */}
      <div
        className="flex items-center gap-3 px-5 py-4 border-b"
        style={{ borderColor: `${SIGNAL}20`, background: `${SIGNAL}06` }}
      >
        <Inbox className="w-4 h-4 flex-shrink-0" style={{ color: SIGNAL }} />
        <div>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: SLATE }}>Import Dock</p>
          <p className="text-[10px]" style={{ color: SLATE_MUTED }}>Paste structured JSON to bulk-import posts</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[9px] font-mono px-2 py-0.5 rounded border" style={{ borderColor: `${SIGNAL}30`, color: SIGNAL, background: `${SIGNAL}0a` }}>
            JSON
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col gap-4">
        {/* Schema hint */}
        <div className="rounded-xl border px-3.5 py-3" style={{ borderColor: BORDER2, background: PARCHMENT }}>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: SLATE_MUTED }}>Expected schema</p>
          <pre className="text-[10px] font-mono leading-relaxed overflow-x-auto" style={{ color: SLATE2 }}>{`[{
  "title": "Post Title",
  "date": "2025-01-15",
  "industry": "barber",
  "status": "published"
}]`}</pre>
        </div>

        {/* Textarea */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: SLATE_MUTED }}>
            Paste Post Data (JSON)
          </label>
          <textarea
            value={raw}
            onChange={(e) => { setRaw(e.target.value); setError(null); setSuccess(null); }}
            rows={8}
            placeholder={`[\n  {\n    "title": "My Post",\n    "date": "2025-06-01",\n    "industry": "digital",\n    "status": "draft"\n  }\n]`}
            className="w-full rounded-xl border px-4 py-3 text-xs font-mono leading-relaxed resize-none outline-none transition-colors"
            style={{
              background:   PARCHMENT,
              borderColor:  error ? 'rgba(239,68,68,0.4)' : `${SIGNAL}25`,
              color:        SLATE,
              fontFamily:   "'JetBrains Mono', 'Courier New', monospace",
            }}
            onFocus={(e) => { e.target.style.borderColor = `${SIGNAL}60`; }}
            onBlur={(e)  => { e.target.style.borderColor = error ? 'rgba(239,68,68,0.4)' : `${SIGNAL}25`; }}
          />
        </div>

        {/* Feedback */}
        {error && (
          <div className="flex items-center gap-2 text-xs text-red-500 animate-fade-up">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 text-xs font-semibold animate-fade-up" style={{ color: '#4ade80' }}>
            <Check className="w-3.5 h-3.5 flex-shrink-0" />
            {success}
          </div>
        )}

        {/* Process button */}
        <button
          onClick={handleProcess}
          disabled={!raw.trim()}
          className="flex items-center justify-center gap-2.5 py-3 rounded-xl font-bold text-sm uppercase tracking-wider text-white transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: SIGNAL, boxShadow: `0 4px 14px ${SIGNAL}40` }}
          onMouseEnter={(e) => { if (raw.trim()) e.currentTarget.style.background = SIGNAL_DIM; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = SIGNAL; }}
        >
          <Code2 className="w-4 h-4" />
          Process Data
        </button>
      </div>
    </div>
  );
}

// ── Sidebar nav ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'all',    label: 'All Posts',    icon: LayoutGrid },
  { id: 'drafts', label: 'Drafts',       icon: FileText   },
  { id: 'import', label: 'Import Dock',  icon: Inbox      },
];

function Sidebar({ active, onNav, counts }) {
  return (
    <aside
      className="flex flex-col border-r h-full"
      style={{
        width: '220px',
        minWidth: '220px',
        background: WHITE,
        borderColor: BORDER,
      }}
    >
      {/* Brand mark */}
      <div className="px-5 pt-6 pb-5 border-b" style={{ borderColor: BORDER2 }}>
        <div className="flex items-center gap-2.5 mb-0.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: `${SIGNAL}15` }}
          >
            <Newspaper className="w-4 h-4" style={{ color: SIGNAL }} />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest leading-none" style={{ color: SLATE, fontFamily: "'Montserrat', sans-serif" }}>
              Newsroom
            </p>
            <p className="text-[9px] mt-0.5" style={{ color: SLATE_MUTED }}>CBA Content Library</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 p-3 flex-1">
        <p className="text-[9px] font-bold uppercase tracking-[0.18em] px-2 py-2" style={{ color: SLATE_FAINT }}>Library</p>
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          const count    = counts?.[id];
          return (
            <button
              key={id}
              type="button"
              onClick={() => onNav(id)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all duration-150 group"
              style={{
                background: isActive ? `${SIGNAL}12` : 'transparent',
                border:     `1px solid ${isActive ? `${SIGNAL}30` : 'transparent'}`,
              }}
            >
              <Icon
                className="w-3.5 h-3.5 flex-shrink-0 transition-colors"
                style={{ color: isActive ? SIGNAL : SLATE_MUTED }}
              />
              <span
                className="flex-1 text-xs font-semibold uppercase tracking-wider transition-colors"
                style={{ color: isActive ? SIGNAL_DIM : SLATE2, fontFamily: "'Montserrat', sans-serif" }}
              >
                {label}
              </span>
              {count != null && (
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{
                    background: isActive ? `${SIGNAL}20` : PARCHMENT2,
                    color:      isActive ? SIGNAL_DIM : SLATE_MUTED,
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t" style={{ borderColor: BORDER2 }}>
        <p className="text-[9px] leading-relaxed" style={{ color: SLATE_FAINT }}>
          CBA Solutions<br />Internal Use Only
        </p>
      </div>
    </aside>
  );
}

// ── Main Newsroom ─────────────────────────────────────────────────────────────
export default function Newsroom() {
  const [posts,      setPosts]      = useState(SEED_POSTS);
  const [activeNav,  setActiveNav]  = useState('all');
  const [search,     setSearch]     = useState('');
  const [filterInd,  setFilterInd]  = useState('');
  const [sortField,  setSortField]  = useState('date');
  const [sortDir,    setSortDir]    = useState('desc');
  const [showFilter, setShowFilter] = useState(false);

  const updatePost = (id, field, value) => {
    setPosts((prev) => prev.map((p) => p.id === id ? { ...p, [field]: value } : p));
  };

  const importPosts = (newPosts) => {
    setPosts((prev) => [...newPosts, ...prev]);
  };

  // ── Filtering ──────────────────────────────────────────────────────────
  let visible = [...posts];
  if (activeNav === 'drafts') visible = visible.filter((p) => p.status === 'draft');
  if (search.trim()) {
    const q = search.toLowerCase();
    visible = visible.filter((p) => p.title.toLowerCase().includes(q) || p.industry?.includes(q));
  }
  if (filterInd) visible = visible.filter((p) => p.industry === filterInd);

  // Sort
  visible.sort((a, b) => {
    let av = a[sortField] || '', bv = b[sortField] || '';
    if (av < bv) return sortDir === 'asc' ? -1 :  1;
    if (av > bv) return sortDir === 'asc' ?  1 : -1;
    return 0;
  });

  const toggleSort = (field) => {
    if (sortField === field) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const counts = {
    all:    posts.length,
    drafts: posts.filter((p) => p.status === 'draft').length,
    import: null,
  };

  const publishedCount = posts.filter((p) => p.status === 'published').length;

  return (
    <div
      className="flex h-screen w-screen overflow-hidden"
      style={{ background: PARCHMENT, fontFamily: "'Inter', sans-serif" }}
    >
      {/* Sidebar */}
      <Sidebar active={activeNav} onNav={setActiveNav} counts={counts} />

      {/* Main canvas */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <header
          className="flex items-center gap-4 px-6 py-4 border-b flex-shrink-0"
          style={{ background: WHITE, borderColor: BORDER }}
        >
          <div className="flex-1 min-w-0">
            <h1
              className="text-lg font-black tracking-tight leading-none"
              style={{ color: SLATE, fontFamily: "'Montserrat', sans-serif" }}
            >
              {activeNav === 'all'    ? 'All Posts'   :
               activeNav === 'drafts' ? 'Drafts'      : 'Import Dock'}
            </h1>
            <p className="text-[11px] mt-0.5" style={{ color: SLATE_MUTED }}>
              {activeNav === 'import'
                ? 'Bulk-import posts from JSON'
                : `${visible.length} post${visible.length !== 1 ? 's' : ''} · ${publishedCount} published`}
            </p>
          </div>

          {/* Stats pills */}
          {activeNav !== 'import' && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="px-3 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5"
                style={{ borderColor: `${SIGNAL}30`, background: `${SIGNAL}08`, color: SIGNAL_DIM }}>
                <Eye className="w-3 h-3" />
                {publishedCount} live
              </div>
              <div className="px-3 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5"
                style={{ borderColor: BORDER, background: PARCHMENT, color: SLATE_MUTED }}>
                <EyeOff className="w-3 h-3" />
                {counts.drafts} draft
              </div>
            </div>
          )}

          {/* Add post (stub) */}
          {activeNav !== 'import' && (
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white transition-all active:scale-95"
              style={{ background: SIGNAL, boxShadow: `0 2px 10px ${SIGNAL}35` }}
              onMouseEnter={(e) => { e.currentTarget.style.background = SIGNAL_DIM; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = SIGNAL; }}
              onClick={() => {
                setPosts((prev) => [{
                  id: Date.now(), title: 'New Post', date: new Date().toISOString().slice(0,10),
                  industry: '', status: 'draft', image: null,
                }, ...prev]);
              }}
            >
              <Plus className="w-3.5 h-3.5" />
              New Post
            </button>
          )}
        </header>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">

            {/* ── IMPORT DOCK view ─────────────────────────────── */}
            {activeNav === 'import' && (
              <div className="max-w-2xl mx-auto">
                <ImportDock onImport={importPosts} />
              </div>
            )}

            {/* ── POST LIST view ───────────────────────────────── */}
            {activeNav !== 'import' && (
              <>
                {/* Toolbar */}
                <div className="flex items-center gap-3 mb-5">
                  {/* Search */}
                  <div
                    className="flex items-center gap-2 flex-1 max-w-xs rounded-xl border px-3 py-2.5 transition-colors"
                    style={{ background: WHITE, borderColor: BORDER }}
                  >
                    <Search className="w-3.5 h-3.5 flex-shrink-0" style={{ color: SLATE_FAINT }} />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search posts…"
                      className="flex-1 bg-transparent text-xs outline-none"
                      style={{ color: SLATE }}
                    />
                    {search && (
                      <button onClick={() => setSearch('')}>
                        <X className="w-3 h-3" style={{ color: SLATE_FAINT }} />
                      </button>
                    )}
                  </div>

                  {/* Industry filter */}
                  <div className="relative">
                    <button
                      onClick={() => setShowFilter((s) => !s)}
                      className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all"
                      style={{
                        background:  filterInd ? `${BRASS}0f` : WHITE,
                        borderColor: filterInd ? `${BRASS}40` : BORDER,
                        color:       filterInd ? BRASS_DIM   : SLATE2,
                      }}
                    >
                      <Filter className="w-3.5 h-3.5" />
                      {filterInd ? getIndustry(filterInd)?.label : 'Industry'}
                      {filterInd && <X className="w-3 h-3 opacity-60" onClick={(e) => { e.stopPropagation(); setFilterInd(''); }} />}
                    </button>
                    {showFilter && (
                      <div
                        className="absolute top-full left-0 mt-1 z-20 rounded-xl border shadow-xl overflow-hidden"
                        style={{ borderColor: BORDER, background: WHITE, minWidth: '150px' }}
                        onMouseLeave={() => setShowFilter(false)}
                      >
                        <div className="p-1">
                          {INDUSTRIES.map((ind) => (
                            <button key={ind.id} type="button"
                              onClick={() => { setFilterInd(ind.id === filterInd ? '' : ind.id); setShowFilter(false); }}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors text-left"
                              style={{ color: SLATE2 }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = `${ind.dot}08`; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                            >
                              <span className="w-2 h-2 rounded-full" style={{ background: ind.dot }} />
                              {ind.label}
                              {filterInd === ind.id && <Check className="w-3 h-3 ml-auto" style={{ color: BRASS }} />}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sort */}
                  <button
                    onClick={() => toggleSort('date')}
                    className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all"
                    style={{ background: WHITE, borderColor: BORDER, color: SLATE2 }}
                  >
                    <ArrowUpDown className="w-3.5 h-3.5" />
                    {sortDir === 'desc' ? 'Newest' : 'Oldest'}
                  </button>

                  <div className="ml-auto text-xs" style={{ color: SLATE_FAINT }}>
                    {visible.length} result{visible.length !== 1 ? 's' : ''}
                  </div>
                </div>

                {/* Column headers */}
                <div
                  className="flex items-center gap-4 px-5 pb-2 mb-2"
                  style={{ color: SLATE_FAINT }}
                >
                  <div style={{ width: '56px', flexShrink: 0 }}>
                    <span className="text-[9px] font-bold uppercase tracking-widest">Image</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-bold uppercase tracking-widest">Title / Date</span>
                  </div>
                  <div style={{ minWidth: '116px' }}>
                    <span className="text-[9px] font-bold uppercase tracking-widest">Industry</span>
                  </div>
                  <div style={{ minWidth: '110px' }}>
                    <span className="text-[9px] font-bold uppercase tracking-widest">Status</span>
                  </div>
                  <div style={{ width: '8px' }} />
                </div>

                {/* Post rows */}
                {visible.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {visible.map((post) => (
                      <PostRow key={post.id} post={post} onUpdate={updatePost} />
                    ))}
                  </div>
                ) : (
                  <div
                    className="flex flex-col items-center gap-3 py-16 rounded-2xl border border-dashed"
                    style={{ borderColor: `${SIGNAL}20`, background: `${SIGNAL}04` }}
                  >
                    <FileText className="w-8 h-8" style={{ color: SLATE_FAINT }} />
                    <div className="text-center">
                      <p className="text-sm font-semibold" style={{ color: SLATE2 }}>No posts found</p>
                      <p className="text-xs mt-1" style={{ color: SLATE_MUTED }}>
                        {search ? 'Try a different search term' : 'Use the Import Dock or create a new post'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Summary bar */}
                {visible.length > 0 && (
                  <div
                    className="flex items-center justify-between mt-5 pt-4 border-t text-[10px]"
                    style={{ borderColor: BORDER2, color: SLATE_MUTED }}
                  >
                    <span>{posts.length} total · {publishedCount} published · {counts.drafts} draft</span>
                    <div className="flex items-center gap-3">
                      {INDUSTRIES.map((ind) => {
                        const c = posts.filter((p) => p.industry === ind.id).length;
                        if (!c) return null;
                        return (
                          <span key={ind.id} className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: ind.dot }} />
                            {ind.label}: {c}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
