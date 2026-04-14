import { useState, useRef, useEffect, useCallback } from 'react';
import {
  FileText, Inbox, LayoutGrid, Upload, ChevronDown, Check,
  AlertCircle, X, Plus, Search, Filter, ArrowUpDown,
  Image as ImageIcon, Newspaper, Code2, Download, RefreshCw, Eye, EyeOff,
  Database, Copy, CheckCheck, Images, Loader2, Link2,
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// ─────────────────────────────────────────────────────────────────────────────
// NEWSROOM DATABASE — raw fetch wrapper
// NO automatic background requests. Every network call is explicit.
// Uses the Supabase REST API directly via fetch so the SDK auth layer
// never fires a token/session request on its own.
// ─────────────────────────────────────────────────────────────────────────────
const SB_URL = 'https://bjxgqbgjtzbgzdprtepd.supabase.co';
const SB_KEY = 'sb_publishable_5mY9p11tWx6znT3h2zMr2A_1J19xwEr';
const SB_HEADERS = {
  'apikey':        SB_KEY,
  'Authorization': `Bearer ${SB_KEY}`,
  'Content-Type':  'application/json',
  'Prefer':        'return=representation',
};

// Minimal db shim — same call style as supabase-js but pure fetch underneath
const db = {
  from: (table) => ({
    select: (cols = '*') => ({
      eq:    (col, val) => ({
        limit: (n) => _get(`${table}?${col}=eq.${encodeURIComponent(val)}&limit=${n}&select=${encodeURIComponent(cols)}`),
        single: ()    => _getSingle(`${table}?${col}=eq.${encodeURIComponent(val)}&select=${encodeURIComponent(cols)}&limit=1`),
        then:  (resolve) => _get(`${table}?${col}=eq.${encodeURIComponent(val)}&select=${encodeURIComponent(cols)}`).then(resolve),
      }),
      order: (col, opts = {}) => ({
        limit: (n) => _get(`${table}?order=${col}.${opts.ascending ? 'asc' : 'desc'}&limit=${n}&select=${encodeURIComponent(cols)}`),
        then:  (resolve) => _get(`${table}?order=${col}.${opts.ascending ? 'asc' : 'desc'}&select=${encodeURIComponent(cols)}`).then(resolve),
      }),
      then: (resolve) => _get(`${table}?select=${encodeURIComponent(cols)}`).then(resolve),
    }),
    update: (body) => ({
      eq: (col, val) => ({
        select: (_cols = '*') => _patch(`${table}?${col}=eq.${encodeURIComponent(val)}`, body),
        then:   (resolve)     => _patch(`${table}?${col}=eq.${encodeURIComponent(val)}`, body).then(resolve),
      }),
    }),
    insert: (body) => ({
      select: (_cols = '*') => ({
        single: () => _post(table, Array.isArray(body) ? body[0] : body),
        then:   (resolve) => _post(table, body).then(resolve),
      }),
      then: (resolve) => _post(table, body).then(resolve),
    }),
  }),
  storage: createClient(SB_URL, SB_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  }).storage,
};

async function _get(path) {
  try {
    const res  = await fetch(`${SB_URL}/rest/v1/${path}`, { headers: SB_HEADERS });
    const data = await res.json();
    if (!res.ok) return { data: null, error: { code: String(res.status), message: data?.message ?? res.statusText, status: res.status, details: data?.details ?? null, hint: data?.hint ?? null } };
    return { data, error: null };
  } catch (e) {
    return { data: null, error: { code: 'FETCH_ERR', message: String(e), status: null, details: null, hint: null } };
  }
}

async function _getSingle(path) {
  const { data, error } = await _get(path);
  if (error) return { data: null, error };
  const row = Array.isArray(data) ? data[0] ?? null : data;
  return { data: row, error: row ? null : { code: 'PGRST116', message: 'No rows found', status: 404, details: null, hint: null } };
}

async function _patch(path, body) {
  try {
    const res  = await fetch(`${SB_URL}/rest/v1/${path}`, { method: 'PATCH', headers: SB_HEADERS, body: JSON.stringify(body) });
    const data = await res.json();
    if (!res.ok) return { data: null, error: { code: String(res.status), message: data?.message ?? res.statusText, status: res.status, details: data?.details ?? null, hint: data?.hint ?? null } };
    return { data: Array.isArray(data) ? data : [data], error: null };
  } catch (e) {
    return { data: null, error: { code: 'FETCH_ERR', message: String(e), status: null, details: null, hint: null } };
  }
}

async function _post(path, body) {
  try {
    const res  = await fetch(`${SB_URL}/rest/v1/${path}`, { method: 'POST', headers: { ...SB_HEADERS, 'Prefer': 'return=representation' }, body: JSON.stringify(body) });
    const data = await res.json();
    if (!res.ok) return { data: null, error: { code: String(res.status), message: data?.message ?? res.statusText, status: res.status, details: data?.details ?? null, hint: data?.hint ?? null } };
    const row = Array.isArray(data) ? data[0] ?? null : data;
    return { data: row, error: null };
  } catch (e) {
    return { data: null, error: { code: 'FETCH_ERR', message: String(e), status: null, details: null, hint: null } };
  }
}

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

// No seed data — all posts come exclusively from Supabase

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
  // DB stores 'Published'/'Draft' (capitalised); normalise for comparison
  const published = value?.toLowerCase() === 'published';
  return (
    <button
      type="button"
      onClick={() => onChange(published ? 'Draft' : 'Published')}
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

// ── Storage helpers ───────────────────────────────────────────────────────────
const BUCKET = 'post-images';

// Uses anonClient so Storage RLS sees the anon role (same as DB inserts)
async function uploadToStorage(file, folder = 'posts') {
  const ext  = file.name.split('.').pop().toLowerCase();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  console.log('[Storage] Uploading to bucket:', BUCKET, '| path:', path);
  const { data: uploadData, error: uploadErr } = await db.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true, cacheControl: '3600' });
  if (uploadErr) {
    console.error('[Storage] Upload failed:', JSON.stringify(uploadErr));
    throw new Error(uploadErr.message || 'Storage upload failed');
  }
  console.log('[Storage] Upload OK:', uploadData);
  const { data: urlData } = db.storage.from(BUCKET).getPublicUrl(path);
  console.log('[Storage] Public URL:', urlData.publicUrl);
  return urlData.publicUrl;
}

// ── Newsroom toast ────────────────────────────────────────────────────────────
function NewsroomToast({ message, sub, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3500);
    return () => clearTimeout(t);
  }, [onDismiss]);
  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl"
      style={{
        background: SLATE,
        border: `1px solid ${BRASS}50`,
        boxShadow: `0 8px 32px rgba(0,0,0,0.35), 0 0 0 1px ${BRASS}20`,
        minWidth: '260px',
      }}
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: `${BRASS}20` }}
      >
        <span style={{ fontSize: '16px' }}>☕</span>
      </div>
      <div className="flex-1">
        <p className="text-sm font-black" style={{ color: BRASS, fontFamily: "'Montserrat', sans-serif" }}>
          {message}
        </p>
        {sub && <p className="text-[10px] mt-0.5" style={{ color: SLATE_FAINT }}>{sub}</p>}
      </div>
      <button onClick={onDismiss} style={{ color: SLATE_FAINT }}>
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ── Hero image cell ───────────────────────────────────────────────────────────
function HeroCell({ post, onHeroUpload }) {
  const fileRef             = useRef();
  const [busy, setBusy]     = useState(false);
  const [uploadErr, setErr] = useState(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setErr(null);
    try {
      const url = await uploadToStorage(file, 'posts');
      await onHeroUpload(post.id, url);   // parent handles DB write + toast
    } catch (err) {
      const msg = err?.message || String(err);
      console.error('[HeroCell] upload failed:', msg);
      setErr(msg);
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  };

  return (
    <div className="flex items-center gap-3 flex-shrink-0">
      {/* Thumbnail */}
      <div
        className="relative rounded-lg overflow-hidden border flex-shrink-0"
        style={{
          width: '64px', height: '44px',
          borderColor: uploadErr ? 'rgba(239,68,68,0.5)' : post.featured_image ? `${BRASS}50` : BORDER,
          background:  post.featured_image ? 'transparent' : PARCHMENT2,
        }}
      >
        {post.featured_image
          ? <img src={post.featured_image} alt="" className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-4 h-4" style={{ color: SLATE_FAINT }} />
            </div>
        }
        {busy && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(44,62,80,0.55)' }}>
            <Loader2 className="w-4 h-4 text-white animate-spin" />
          </div>
        )}
      </div>

      {/* Upload Hero button */}
      <div className="flex flex-col gap-1">
        <button
          type="button"
          disabled={busy}
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-50 whitespace-nowrap"
          style={{
            background:  uploadErr ? 'rgba(239,68,68,0.08)' : `${SIGNAL}12`,
            color:       uploadErr ? '#ef4444' : SIGNAL_DIM,
            border:      `1px solid ${uploadErr ? 'rgba(239,68,68,0.3)' : `${SIGNAL}30`}`,
          }}
          onMouseEnter={e => { if (!busy && !uploadErr) e.currentTarget.style.background = `${SIGNAL}22`; }}
          onMouseLeave={e => { e.currentTarget.style.background = uploadErr ? 'rgba(239,68,68,0.08)' : `${SIGNAL}12`; }}
        >
          {busy
            ? <Loader2 className="w-3 h-3 animate-spin" />
            : uploadErr
              ? <AlertCircle className="w-3 h-3" />
              : <Upload className="w-3 h-3" />}
          {busy ? 'Uploading…' : uploadErr ? 'Retry' : post.featured_image ? 'Replace Hero' : 'Upload Hero'}
        </button>
        {uploadErr && (
          <p
            className="text-[8px] font-mono leading-tight max-w-[110px] truncate"
            style={{ color: '#ef4444' }}
            title={uploadErr}
          >
            {uploadErr}
          </p>
        )}
      </div>

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}

// ── Post row ──────────────────────────────────────────────────────────────────
function PostRow({ post, onUpdate, onSaveUrl }) {
  const [libUrl,   setLibUrl]   = useState('');
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [saveErr,  setSaveErr]  = useState(null);

  const handleSaveLink = async () => {
    const trimmed = libUrl.trim();
    if (!trimmed) return;
    setSaving(true);
    setSaveErr(null);
    setSaved(false);

    // Direct PATCH — no SDK, no background requests
    const { error } = await _patch(
      `posts?id=eq.${encodeURIComponent(post.id)}`,
      { featured_image: trimmed }
    );

    if (error) {
      setSaveErr({ code: error.code ?? 'ERR', message: error.message ?? 'Unknown error', table: 'posts', status: error.status ?? null });
    } else {
      setSaved(true);
      setLibUrl('');
      setTimeout(() => setSaved(false), 3000);
      await onSaveUrl(post.id, trimmed);
    }
    setSaving(false);
  };

  return (
    <div
      className="flex flex-col gap-0 rounded-xl border overflow-hidden transition-all duration-150"
      style={{ background: WHITE, borderColor: BORDER, boxShadow: '0 1px 3px rgba(44,62,80,0.06)' }}
    >
      {/* ── Main info row ── */}
      <div className="flex items-center gap-4 px-5 py-3">
        {/* Hero thumbnail */}
        <HeroCell post={post} onHeroUpload={onSaveUrl} />

        {/* Title + Date + Client */}
        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-bold leading-tight truncate"
            style={{ color: SLATE, fontFamily: "'Montserrat', sans-serif" }}
          >
            {post.title}
          </p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <p className="text-[10px] font-medium" style={{ color: SLATE_MUTED }}>
              {fmtDate(post.date)}
              {!post.featured_image && (
                <span className="ml-2 text-[9px] font-bold uppercase tracking-wider" style={{ color: '#f59e0b' }}>
                  · No hero
                </span>
              )}
            </p>
            {post.client_name ? (
              <span
                className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: `${BRASS}18`, color: BRASS_DIM, border: `1px solid ${BRASS}35` }}
              >
                {post.client_name}
              </span>
            ) : (
              <span
                className="text-[9px] px-1.5 py-0.5 rounded-full"
                style={{ background: PARCHMENT2, color: SLATE_FAINT, border: `1px solid ${BORDER}` }}
              >
                No client
              </span>
            )}
          </div>
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

        {/* Published dot */}
        <div
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: post.status === 'Published' ? BRASS : PARCHMENT2 }}
          title={post.status}
        />
      </div>

      {/* ── Library Image URL row ── */}
      <div
        className="flex flex-col gap-1.5 px-5 py-2.5"
        style={{ borderTop: `1px solid ${BORDER}`, background: PARCHMENT }}
      >
        <div className="flex items-center gap-2">
          {/* Label */}
          <span
            className="text-[9px] font-black uppercase tracking-widest flex-shrink-0"
            style={{ color: SLATE_FAINT, minWidth: '108px' }}
          >
            Library Image URL
          </span>

          {/* Input */}
          <input
            type="url"
            value={libUrl}
            onChange={(e) => { setLibUrl(e.target.value); setSaveErr(null); setSaved(false); }}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSaveLink(); }}
            placeholder="Paste URL from Image Library…"
            className="flex-1 rounded-lg border px-2.5 py-1.5 text-[11px] outline-none transition-colors min-w-0"
            style={{
              background:  WHITE,
              borderColor: saveErr ? 'rgba(239,68,68,0.45)' : saved ? 'rgba(74,222,128,0.45)' : `${SIGNAL}25`,
              color:       SLATE,
              fontFamily:  "'JetBrains Mono','Courier New',monospace",
            }}
            onFocus={(e) => { e.target.style.borderColor = saveErr ? 'rgba(239,68,68,0.5)' : `${SIGNAL}60`; }}
            onBlur={(e)  => { e.target.style.borderColor = saveErr ? 'rgba(239,68,68,0.45)' : saved ? 'rgba(74,222,128,0.45)' : `${SIGNAL}25`; }}
          />

          {/* Save Link button */}
          <button
            type="button"
            disabled={!libUrl.trim() || saving}
            onClick={handleSaveLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: saved    ? 'rgba(74,222,128,0.12)'
                         : saveErr ? 'rgba(239,68,68,0.10)'
                         : `${BRASS}18`,
              color:      saved    ? '#15803d'
                         : saveErr ? '#dc2626'
                         : BRASS_DIM,
              border: `1px solid ${saved ? 'rgba(74,222,128,0.4)' : saveErr ? 'rgba(239,68,68,0.35)' : `${BRASS}40`}`,
            }}
          >
            {saving  ? <><Loader2   className="w-3 h-3 animate-spin" /> Saving…</>
            : saved   ? <><CheckCheck className="w-3 h-3" /> Saved!</>
            :            <><Link2     className="w-3 h-3" /> Save Link</>}
          </button>
        </div>

        {/* Inline error */}
        {saveErr && (
          <p className="text-[9px] font-mono px-1 leading-tight" style={{ color: '#dc2626' }}>
            ✗ table:<strong>{saveErr.table}</strong> · code:{saveErr.code} · status:{saveErr.status ?? '—'} · {saveErr.message}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Import Dock ───────────────────────────────────────────────────────────────
function ImportDock({ onImportSuccess }) {
  const [raw,     setRaw]     = useState('');
  const [error,   setError]   = useState(null);
  const [success, setSuccess] = useState(null);
  const [saving,  setSaving]  = useState(false);
  const [preview, setPreview] = useState(null); // parsed + normalised rows before save

  // Parse JSON into preview (no DB call yet)
  // id is intentionally excluded — Supabase auto-generates it
  const handleParse = () => {
    setError(null);
    setSuccess(null);
    setPreview(null);
    if (!raw.trim()) { setError('Paste JSON data first.'); return; }
    try {
      const parsed = JSON.parse(raw);
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      const normalised = arr.map((p) => ({
        // Only these six columns — no id, no created_at, nothing else
        title:        p.title        || p.name         || 'Untitled Post',
        content:      p.content      || p.body         || p.text        || null,
        excerpt:      p.excerpt      || p.summary      || p.description || null,
        date:         p.date         || p.published_at || new Date().toISOString().slice(0, 10),
        industry_tag: p.industry_tag || p.industry     || p.tag         || p.category || null,
        status:       p.status       || 'Draft',
      }));
      setPreview(normalised);
    } catch {
      setError('Invalid JSON — check your syntax and try again.');
    }
  };

  const handleSave = async () => {
    if (!preview || preview.length === 0) return;
    setSaving(true);
    setError(null);
    setSuccess(null);

    const { error: insertErr } = await db
      .from('posts')
      .insert(preview);

    if (insertErr) {
      setError(`[posts] code:${insertErr.code ?? 'ERR'} · ${insertErr.message}`);
      setSaving(false);
      return;
    }

    setSuccess(`${preview.length} post${preview.length !== 1 ? 's' : ''} saved to Supabase.`);
    setRaw('');
    setPreview(null);
    setSaving(false);
    onImportSuccess?.();
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
          <p className="text-[10px]" style={{ color: SLATE_MUTED }}>Paste JSON → parse → save to Supabase posts table</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[9px] font-mono px-2 py-0.5 rounded border" style={{ borderColor: `${SIGNAL}30`, color: SIGNAL, background: `${SIGNAL}0a` }}>
            JSON → DB
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col gap-4">
        {/* Schema hint */}
        <div className="rounded-xl border px-3.5 py-3" style={{ borderColor: BORDER2, background: PARCHMENT }}>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: SLATE_MUTED }}>DB schema (posts table)</p>
          <pre className="text-[10px] font-mono leading-relaxed overflow-x-auto" style={{ color: SLATE2 }}>{`[{
  "title":        "Post Title",          // required
  "content":      "Full body text…",     // optional
  "excerpt":      "Short summary…",      // optional
  "date":         "2025-01-15",          // YYYY-MM-DD
  "industry_tag": "barber",             // optional
  "status":       "published"           // published | draft
}]`}</pre>
        </div>

        {/* Textarea */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: SLATE_MUTED }}>
            Paste Post Data (JSON)
          </label>
          <textarea
            value={raw}
            onChange={(e) => { setRaw(e.target.value); setError(null); setSuccess(null); setPreview(null); }}
            rows={8}
            placeholder={`[\n  {\n    "title": "My Post",\n    "content": "Full article body here...",\n    "excerpt": "Short summary.",\n    "date": "2025-06-01",\n    "industry_tag": "digital",\n    "status": "draft"\n  }\n]`}
            className="w-full rounded-xl border px-4 py-3 text-xs font-mono leading-relaxed resize-none outline-none transition-colors"
            style={{
              background:  PARCHMENT,
              borderColor: error ? 'rgba(239,68,68,0.4)' : `${SIGNAL}25`,
              color:       SLATE,
              fontFamily:  "'JetBrains Mono', 'Courier New', monospace",
            }}
            onFocus={(e) => { e.target.style.borderColor = `${SIGNAL}60`; }}
            onBlur={(e)  => { e.target.style.borderColor = error ? 'rgba(239,68,68,0.4)' : `${SIGNAL}25`; }}
          />
        </div>

        {/* Parse preview */}
        {preview && (
          <div
            className="rounded-xl border overflow-hidden"
            style={{ borderColor: `${SIGNAL}25`, background: `${SIGNAL}05` }}
          >
            <div className="flex items-center gap-2 px-4 py-2.5 border-b" style={{ borderColor: `${SIGNAL}20` }}>
              <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: SIGNAL }} />
              <span className="text-[11px] font-bold" style={{ color: SIGNAL_DIM }}>
                {preview.length} record{preview.length !== 1 ? 's' : ''} parsed — ready to save
              </span>
            </div>
            <div className="px-4 py-2 flex flex-col gap-1 max-h-40 overflow-y-auto">
              {preview.map((p, i) => (
                <div key={i} className="flex items-center gap-2 py-1 border-b last:border-0" style={{ borderColor: `${SIGNAL}10` }}>
                  <span className="text-[9px] font-bold w-5 text-right flex-shrink-0" style={{ color: SIGNAL_DIM }}>{i + 1}</span>
                  <span className="flex-1 text-[11px] font-semibold truncate" style={{ color: SLATE }}>{p.title}</span>
                  <span className="text-[9px] font-mono flex-shrink-0" style={{ color: SLATE_FAINT }}>{p.industry_tag || '—'}</span>
                  <span
                    className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full flex-shrink-0"
                    style={{
                      background: p.status === 'published' ? `${SIGNAL}15` : PARCHMENT2,
                      color:      p.status === 'published' ? SIGNAL_DIM : SLATE_FAINT,
                    }}
                  >
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            className="rounded-xl px-4 py-3 text-xs font-mono"
            style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.25)', color: '#dc2626' }}
          >
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="font-bold">Save failed</span>
            </div>
            <p className="break-all">{error}</p>
          </div>
        )}
        {success && (
          <div
            className="flex items-center gap-3 rounded-xl px-4 py-3.5"
            style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.3)' }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(74,222,128,0.15)' }}
            >
              <Check className="w-4 h-4" style={{ color: '#4ade80' }} />
            </div>
            <div>
              <p className="text-xs font-bold" style={{ color: '#4ade80' }}>{success}</p>
              <p className="text-[10px] mt-0.5" style={{ color: '#86efac' }}>
                Post Manager has been refreshed with the latest data from Supabase.
              </p>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleParse}
            disabled={!raw.trim()}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background:  preview ? PARCHMENT2 : SIGNAL,
              color:       preview ? SLATE2     : WHITE,
              boxShadow:   preview ? 'none'     : `0 4px 14px ${SIGNAL}40`,
              border:      preview ? `1px solid ${BORDER}` : 'none',
            }}
          >
            <Code2 className="w-4 h-4" />
            {preview ? 'Re-Parse' : 'Parse Data'}
          </button>
          {preview && preview.length > 0 && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: BRASS, color: WHITE, boxShadow: `0 4px 14px ${BRASS}40` }}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
              {saving ? 'Saving…' : `Save ${preview.length} to DB`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── CopyButton ────────────────────────────────────────────────────────────────
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={handle}
      title="Copy URL"
      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex-shrink-0"
      style={{
        background: copied ? 'rgba(74,222,128,0.12)' : PARCHMENT2,
        color:      copied ? '#4ade80' : SLATE_MUTED,
        border:     `1px solid ${copied ? 'rgba(74,222,128,0.3)' : BORDER}`,
      }}
    >
      {copied ? <CheckCheck className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

// ── Image Library ─────────────────────────────────────────────────────────────
function ImageLibrary() {
  const [assets,   setAssets]   = useState([]);   // { id, file, localUrl, remoteUrl, name, uploading, error }
  const [loading,  setLoading]  = useState(false);
  const [fetchErr, setFetchErr] = useState(null);
  const dropRef  = useRef();
  const fileRef  = useRef();

  // Load existing assets from storage on mount
  const loadAssets = useCallback(async () => {
    setLoading(true);
    setFetchErr(null);
    const { data, error } = await db.storage
      .from(BUCKET)
      .list('library', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });

    if (error) {
      console.error('[ImageLibrary] list error:', error);
      setFetchErr(error.message);
    } else {
      const mapped = (data || [])
        .filter(f => f.name !== '.emptyFolderPlaceholder')
        .map(f => {
          const { data: urlData } = db.storage.from(BUCKET).getPublicUrl(`library/${f.name}`);
          return { id: f.id || f.name, name: f.name, remoteUrl: urlData.publicUrl, uploading: false, error: null };
        });
      setAssets(mapped);
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadAssets(); }, [loadAssets]);

  const uploadFiles = async (files) => {
    const newEntries = Array.from(files).map(file => ({
      id:        `local-${Date.now()}-${Math.random()}`,
      name:      file.name,
      localUrl:  URL.createObjectURL(file),
      remoteUrl: null,
      uploading: true,
      error:     null,
      _file:     file,
    }));

    setAssets(prev => [...newEntries, ...prev]);

    for (const entry of newEntries) {
      try {
        const url = await uploadToStorage(entry._file, 'library');
        setAssets(prev => prev.map(a =>
          a.id === entry.id ? { ...a, remoteUrl: url, uploading: false } : a
        ));
      } catch (err) {
        const msg = err?.message || String(err);
        console.error('[ImageLibrary] upload error:', msg);
        setAssets(prev => prev.map(a =>
          a.id === entry.id ? { ...a, uploading: false, error: msg } : a
        ));
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.style.borderColor = BORDER;
    const files = e.dataTransfer.files;
    if (files.length) uploadFiles(files);
  };

  const hasAssets = assets.length > 0;

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      {/* Header card */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ borderColor: `${BRASS}30`, background: WHITE, boxShadow: '0 2px 12px rgba(197,160,89,0.08)' }}
      >
        <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: `${BRASS}20`, background: `${BRASS}06` }}>
          <Images className="w-4 h-4 flex-shrink-0" style={{ color: BRASS }} />
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: SLATE }}>Image Library</p>
            <p className="text-[10px]" style={{ color: SLATE_MUTED }}>
              Upload photos · copy public URLs · use as inline <code className="font-mono">&lt;img&gt;</code> tags in post content
            </p>
          </div>
          <button
            onClick={loadAssets}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-50"
            style={{ background: PARCHMENT, color: SLATE2, border: `1px solid ${BORDER}` }}
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white transition-all"
            style={{ background: BRASS, boxShadow: `0 2px 10px ${BRASS}35` }}
            onMouseEnter={e => e.currentTarget.style.background = BRASS_DIM}
            onMouseLeave={e => e.currentTarget.style.background = BRASS}
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Photos
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={e => { if (e.target.files?.length) uploadFiles(e.target.files); e.target.value = ''; }}
          />
        </div>

        {/* Drop zone */}
        <div
          ref={dropRef}
          onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = BRASS; }}
          onDragLeave={e => { e.currentTarget.style.borderColor = 'transparent'; }}
          onDrop={handleDrop}
          className="mx-5 my-4 rounded-xl border-2 border-dashed flex items-center justify-center gap-3 py-6 transition-colors cursor-pointer"
          style={{ borderColor: `${BRASS}30`, background: `${BRASS}04` }}
          onClick={() => fileRef.current?.click()}
        >
          <Upload className="w-4 h-4" style={{ color: BRASS_DIM }} />
          <span className="text-xs font-semibold" style={{ color: SLATE_MUTED }}>
            Drag &amp; drop images here, or click to browse
          </span>
        </div>
      </div>

      {/* Error */}
      {fetchErr && (
        <div
          className="rounded-xl px-4 py-3 text-xs flex items-start gap-2"
          style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.25)', color: '#dc2626' }}
        >
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Could not list storage assets: {fetchErr}</p>
            <p className="mt-1 text-[10px]" style={{ color: '#b45309' }}>
              Make sure the <code className="font-mono">newsroom-assets</code> bucket exists in Supabase Storage and has public read + anon insert policies.
            </p>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center gap-3 py-12" style={{ color: SLATE_MUTED }}>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Loading library…</span>
        </div>
      )}

      {/* Asset grid */}
      {!loading && hasAssets && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {assets.map(asset => (
            <div
              key={asset.id}
              className="rounded-xl border overflow-hidden flex flex-col"
              style={{ background: WHITE, borderColor: asset.error ? 'rgba(239,68,68,0.3)' : BORDER, boxShadow: '0 1px 4px rgba(44,62,80,0.07)' }}
            >
              {/* Thumbnail */}
              <div className="relative h-32 flex-shrink-0" style={{ background: PARCHMENT2 }}>
                {(asset.localUrl || asset.remoteUrl) && (
                  <img
                    src={asset.localUrl || asset.remoteUrl}
                    alt={asset.name}
                    className="w-full h-full object-cover"
                  />
                )}
                {asset.uploading && (
                  <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(245,240,232,0.75)' }}>
                    <Loader2 className="w-5 h-5 animate-spin" style={{ color: BRASS }} />
                  </div>
                )}
                {asset.error && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-2" style={{ background: 'rgba(239,68,68,0.08)' }}>
                    <AlertCircle className="w-4 h-4" style={{ color: '#dc2626' }} />
                    <span className="text-[9px] text-center font-semibold leading-tight" style={{ color: '#dc2626' }}>
                      {asset.error}
                    </span>
                  </div>
                )}
              </div>

              {/* Meta + URL */}
              <div className="p-2.5 flex flex-col gap-2">
                <p className="text-[10px] font-semibold truncate" style={{ color: SLATE2 }} title={asset.name}>
                  {asset.name}
                </p>
                {asset.remoteUrl && !asset.uploading && (
                  <>
                    <p
                      className="text-[9px] font-mono truncate rounded px-1.5 py-1"
                      style={{ background: PARCHMENT, color: SLATE_MUTED, border: `1px solid ${BORDER2}` }}
                      title={asset.remoteUrl}
                    >
                      {asset.remoteUrl}
                    </p>
                    <CopyButton text={asset.remoteUrl} />
                  </>
                )}
                {asset.uploading && (
                  <p className="text-[9px] font-semibold" style={{ color: BRASS_DIM }}>Uploading…</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && !hasAssets && !fetchErr && (
        <div className="flex flex-col items-center gap-3 py-16 rounded-2xl border border-dashed" style={{ borderColor: `${BRASS}20` }}>
          <Images className="w-8 h-8" style={{ color: SLATE_FAINT }} />
          <div className="text-center">
            <p className="text-sm font-semibold" style={{ color: SLATE2 }}>No images yet</p>
            <p className="text-xs mt-1" style={{ color: SLATE_MUTED }}>Upload photos above to build your library.</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Create Post Form ──────────────────────────────────────────────────────────
function CreatePostForm({ onSuccess, onCancel }) {
  const today = new Date().toISOString().slice(0, 10);

  const [title,       setTitle]       = useState('');
  const [content,     setContent]     = useState('');
  const [excerpt,     setExcerpt]     = useState('');
  const [date,        setDate]        = useState(today);
  const [industryTag, setIndustryTag] = useState('');
  const [status,      setStatus]      = useState('Published');
  const [clientId,    setClientId]    = useState('');
  const [saving,      setSaving]      = useState(false);
  const [error,       setError]       = useState(null);

  // Fetch clients list on mount
  const [clients,      setClients]      = useState([]);
  const [clientsLoading, setClientsLoading] = useState(true);
  useEffect(() => {
    (async () => {
      const { data } = await _get('clients?select=id,name&order=name.asc');
      setClients(data || []);
      setClientsLoading(false);
    })();
  }, []);

  const resetForm = () => {
    setTitle(''); setContent(''); setExcerpt('');
    setDate(today); setIndustryTag(''); setStatus('Published');
    setClientId(''); setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) { setError('Title is required.'); return; }
    setSaving(true);
    setError(null);

    const payload = {
      title:        title.trim(),
      content:      content.trim()  || null,
      excerpt:      excerpt.trim()  || null,
      date:         date            || new Date().toISOString().slice(0, 10),
      industry_tag: industryTag     || null,
      status:       status,
      client_id:    clientId        || null,
    };

    const { data, error: insertErr } = await _post('posts', payload);

    if (insertErr) {
      setError(`[posts] code:${insertErr.code ?? 'ERR'} · ${insertErr.message}`);
      setSaving(false);
      return;
    }

    resetForm();
    setSaving(false);
    onSuccess?.(data);
  };

  const published = status === 'Published';

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">

        {/* Card */}
        <div
          className="rounded-2xl border overflow-hidden"
          style={{ borderColor: `${SIGNAL}30`, background: WHITE, boxShadow: '0 2px 12px rgba(100,204,241,0.08)' }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-5 py-4 border-b"
            style={{ borderColor: `${SIGNAL}20`, background: `${SIGNAL}06` }}
          >
            <FileText className="w-4 h-4 flex-shrink-0" style={{ color: SIGNAL }} />
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: SLATE }}>New Post</p>
              <p className="text-[10px]" style={{ color: SLATE_MUTED }}>Saved directly to the Supabase posts table</p>
            </div>
            <span
              className="text-[9px] font-mono px-2 py-0.5 rounded border"
              style={{ borderColor: `${SIGNAL}30`, color: SIGNAL, background: `${SIGNAL}0a` }}
            >
              6 fields · no id
            </span>
          </div>

          <div className="p-5 flex flex-col gap-4">

            {/* Title */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: SLATE_MUTED }}>
                Title <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => { setTitle(e.target.value); setError(null); }}
                placeholder="Enter post title…"
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors"
                style={{ background: PARCHMENT, borderColor: `${SIGNAL}25`, color: SLATE }}
                onFocus={(e) => { e.target.style.borderColor = `${SIGNAL}60`; }}
                onBlur={(e)  => { e.target.style.borderColor = `${SIGNAL}25`; }}
                autoFocus
              />
            </div>

            {/* Date + Industry row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: SLATE_MUTED }}>
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors"
                  style={{ background: PARCHMENT, borderColor: `${SIGNAL}25`, color: SLATE }}
                  onFocus={(e) => { e.target.style.borderColor = `${SIGNAL}60`; }}
                  onBlur={(e)  => { e.target.style.borderColor = `${SIGNAL}25`; }}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: SLATE_MUTED }}>
                  Industry Tag
                </label>
                <IndustryDropdown value={industryTag} onChange={setIndustryTag} />
              </div>
            </div>

            {/* Assign to Client */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: SLATE_MUTED }}>
                Assign to Client <span style={{ color: SLATE_FAINT }}>(optional)</span>
              </label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                disabled={clientsLoading}
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors appearance-none"
                style={{ background: PARCHMENT, borderColor: `${BRASS}30`, color: clientId ? SLATE : SLATE_FAINT }}
                onFocus={(e) => { e.target.style.borderColor = `${BRASS}70`; }}
                onBlur={(e)  => { e.target.style.borderColor = `${BRASS}30`; }}
              >
                <option value="">
                  {clientsLoading ? 'Loading clients…' : clients.length === 0 ? 'No clients found' : '— No client —'}
                </option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="flex items-center gap-4">
              <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: SLATE_MUTED }}>
                Status
              </label>
              <button
                type="button"
                onClick={() => setStatus(published ? 'Draft' : 'Published')}
                className="flex items-center gap-2 select-none"
              >
                <div
                  className="relative rounded-full transition-all duration-200"
                  style={{ background: published ? SIGNAL : SLATE_FAINT, width: '36px', height: '20px' }}
                >
                  <span
                    className="absolute top-[3px] w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-all duration-200"
                    style={{ left: published ? '17px' : '3px' }}
                  />
                </div>
                <span
                  className="text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: published ? SIGNAL_DIM : SLATE_FAINT }}
                >
                  {published ? 'Published' : 'Draft'}
                </span>
              </button>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: SLATE_MUTED }}>
                Excerpt <span style={{ color: SLATE_FAINT }}>(optional)</span>
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                placeholder="Short summary shown in cards and listings…"
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none resize-none transition-colors leading-relaxed"
                style={{ background: PARCHMENT, borderColor: `${SIGNAL}25`, color: SLATE }}
                onFocus={(e) => { e.target.style.borderColor = `${SIGNAL}60`; }}
                onBlur={(e)  => { e.target.style.borderColor = `${SIGNAL}25`; }}
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: SLATE_MUTED }}>
                Content <span style={{ color: SLATE_FAINT }}>(optional)</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={7}
                placeholder="Full article body…"
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none resize-none transition-colors leading-relaxed"
                style={{ background: PARCHMENT, borderColor: `${SIGNAL}25`, color: SLATE }}
                onFocus={(e) => { e.target.style.borderColor = `${SIGNAL}60`; }}
                onBlur={(e)  => { e.target.style.borderColor = `${SIGNAL}25`; }}
              />
            </div>

            {/* Error */}
            {error && (
              <div
                className="flex items-start gap-2 rounded-xl px-4 py-3 text-xs"
                style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.25)', color: '#dc2626' }}
              >
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                <span className="font-mono">{error}</span>
              </div>
            )}

            {/* Payload preview — always visible so user can confirm what's being sent */}
            <div
              className="rounded-xl border px-3.5 py-3"
              style={{ borderColor: BORDER2, background: PARCHMENT }}
            >
              <p className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: SLATE_FAINT }}>
                Payload preview (no id)
              </p>
              <pre className="text-[9px] font-mono leading-relaxed overflow-x-auto" style={{ color: SLATE_MUTED }}>
{JSON.stringify({
  title:        title.trim()    || '…',
  content:      content.trim()  || null,
  excerpt:      excerpt.trim()  || null,
  date:         /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : new Date().toISOString().slice(0,10),
  industry_tag: industryTag     || null,
  status,
  client_id:    clientId        || null,
}, null, 2)}
              </pre>
            </div>

          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => { resetForm(); onCancel(); }}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all"
            style={{ background: PARCHMENT2, color: SLATE2, border: `1px solid ${BORDER}` }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!title.trim() || saving}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold uppercase tracking-wider text-white transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: SIGNAL, boxShadow: `0 4px 14px ${SIGNAL}40` }}
            onMouseEnter={(e) => { if (!saving && title.trim()) e.currentTarget.style.background = SIGNAL_DIM; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = SIGNAL; }}
          >
            {saving
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
              : <><Download className="w-4 h-4" /> Save to Database</>
            }
          </button>
        </div>

      </form>
    </div>
  );
}

// ── Sidebar nav ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'all',     label: 'All Posts',     icon: LayoutGrid },
  { id: 'drafts',  label: 'Drafts',        icon: FileText   },
  { id: 'library', label: 'Image Library', icon: Images     },
  { id: 'import',  label: 'Import Dock',   icon: Inbox      },
  { id: 'audit',   label: 'DB Audit',      icon: Database   },
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

// ── DB Audit panel (temporary) ────────────────────────────────────────────────
function DbAudit({ localPosts }) {
  const [rows,    setRows]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [source,  setSource]  = useState('local'); // 'local' | 'db'

  const fetchDb = async () => {
    setLoading(true);
    setError(null);
    try {
      // SELECT only — no insert, no update. Order by id (always exists).
      const { data, error: e } = await db
        .from('posts')
        .select('*')
        .order('id', { ascending: false })
        .limit(100);
      if (e) {
        setError(`posts table error: ${e.message}`);
        setSource('local');
      } else {
        setRows({ table: 'posts', rows: data });
        setSource('db');
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch on mount
  useEffect(() => { fetchDb(); }, []);

  // Extract first paragraph from a text block (split on double newline or first sentence-end)
  const firstParagraph = (text) => {
    if (!text) return null;
    const blocks = String(text).split(/\n\n+/);
    return blocks[0].trim().slice(0, 400);
  };

  const displayRows = source === 'db' && rows?.rows
    ? rows.rows
    : localPosts;

  const sourceLabel = source === 'db'
    ? `Live DB · table: "${rows?.table}"`
    : 'Local state (in-memory seed data)';

  // Try to derive title + body from whatever shape the row has
  const getTitle = (r) =>
    r.title || r.service_name || r.full_name || r.name || '(no title field)';

  const getBody = (r) =>
    r.body || r.content || r.excerpt || r.description ||
    r.bio_content || r.bio || r.heroText || r.hero_text || null;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div
        className="rounded-2xl border overflow-hidden mb-6"
        style={{ borderColor: `${BRASS}30`, background: WHITE, boxShadow: '0 2px 12px rgba(197,160,89,0.08)' }}
      >
        <div
          className="flex items-center gap-3 px-5 py-4 border-b"
          style={{ borderColor: `${BRASS}20`, background: `${BRASS}06` }}
        >
          <Database className="w-4 h-4 flex-shrink-0" style={{ color: BRASS }} />
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: SLATE }}>Content Audit</p>
            <p className="text-[10px]" style={{ color: SLATE_MUTED }}>
              Temporary verification view · Title + First Paragraph
            </p>
          </div>
          <span
            className="text-[9px] font-mono px-2 py-1 rounded border"
            style={{ borderColor: `${BRASS}30`, color: BRASS_DIM, background: `${BRASS}0a` }}
          >
            {sourceLabel}
          </span>
          <button
            onClick={fetchDb}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-50"
            style={{ background: PARCHMENT, color: SLATE2, border: `1px solid ${BORDER}` }}
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 px-5 py-3 text-xs border-b" style={{ borderColor: `${BRASS}15`, color: '#b45309', background: '#fffbeb' }}>
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="px-5 py-2 border-b flex items-center gap-3" style={{ borderColor: BORDER2, background: PARCHMENT }}>
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: SLATE_MUTED }}>
            {displayRows?.length ?? 0} records
          </span>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setSource('local')}
              className="text-[10px] font-semibold px-2.5 py-1 rounded-lg transition-all"
              style={{
                background: source === 'local' ? `${SIGNAL}15` : 'transparent',
                color:      source === 'local' ? SIGNAL_DIM : SLATE_MUTED,
                border: `1px solid ${source === 'local' ? `${SIGNAL}30` : 'transparent'}`,
              }}
            >
              Local
            </button>
            <button
              onClick={() => { if (rows) setSource('db'); else fetchDb(); }}
              className="text-[10px] font-semibold px-2.5 py-1 rounded-lg transition-all"
              style={{
                background: source === 'db' ? `${BRASS}15` : 'transparent',
                color:      source === 'db' ? BRASS_DIM : SLATE_MUTED,
                border: `1px solid ${source === 'db' ? `${BRASS}30` : 'transparent'}`,
              }}
            >
              DB
            </button>
          </div>
        </div>
      </div>

      {/* Row list */}
      {loading ? (
        <div className="flex items-center justify-center py-16 gap-3" style={{ color: SLATE_MUTED }}>
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span className="text-sm">Fetching from database…</span>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {(displayRows || []).map((row, i) => {
            const title = getTitle(row);
            const body  = getBody(row);
            const para  = firstParagraph(body);
            return (
              <div
                key={row.id || i}
                className="rounded-xl border overflow-hidden"
                style={{ background: WHITE, borderColor: BORDER, boxShadow: '0 1px 3px rgba(44,62,80,0.06)' }}
              >
                {/* Row header */}
                <div
                  className="flex items-center gap-3 px-4 py-3 border-b"
                  style={{ borderColor: BORDER2, background: PARCHMENT }}
                >
                  <span
                    className="text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: `${BRASS}15`, color: BRASS_DIM }}
                  >
                    {i + 1}
                  </span>
                  <p
                    className="flex-1 text-sm font-bold leading-tight"
                    style={{ color: SLATE, fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {title}
                  </p>
                  {row.status && (
                    <span
                      className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{
                        background: row.status === 'published' ? `${SIGNAL}15` : PARCHMENT2,
                        color:      row.status === 'published' ? SIGNAL_DIM : SLATE_FAINT,
                        border:     `1px solid ${row.status === 'published' ? `${SIGNAL}30` : BORDER}`,
                      }}
                    >
                      {row.status}
                    </span>
                  )}
                  {row.date && (
                    <span className="text-[10px]" style={{ color: SLATE_FAINT }}>{fmtDate(row.date)}</span>
                  )}
                </div>

                {/* First paragraph */}
                <div className="px-4 py-3">
                  {para ? (
                    <p className="text-xs leading-relaxed" style={{ color: SLATE2 }}>
                      {para}
                      {body && body.length > 400 && (
                        <span style={{ color: SLATE_FAINT }}> …</span>
                      )}
                    </p>
                  ) : (
                    <p className="text-xs italic" style={{ color: SLATE_FAINT }}>
                      No body content — only metadata fields found on this record.
                    </p>
                  )}
                </div>

                {/* Field inventory */}
                <div className="px-4 pb-3 flex flex-wrap gap-1.5">
                  {Object.keys(row).filter(k => row[k] != null && row[k] !== '').map((k) => (
                    <span
                      key={k}
                      className="text-[9px] font-mono px-1.5 py-0.5 rounded"
                      style={{ background: PARCHMENT2, color: SLATE_MUTED }}
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Normalise a DB posts row → local post shape ────────────────────────────────
// Accepts any column shape so manually-added rows with nulls or missing fields
// still render correctly. No field is required except id.
function dbRowToPost(row) {
  return {
    id:             row.id,
    title:          row.title          || row.name || 'Untitled',
    date:           row.date           || row.published_at?.slice(0, 10) || row.created_at?.slice(0, 10) || '',
    industry:       row.industry_tag   || row.industry || '',
    status:         row.status         || 'Published',
    content:        row.content        || row.body || null,
    excerpt:        row.excerpt        || row.summary || null,
    featured_image: row.featured_image || row.hero_image || row.image_url || null,
    client_id:      row.client_id      || null,
    client_name:    row.clients?.name  || row.client_name || null,
  };
}

// ── Main Newsroom ─────────────────────────────────────────────────────────────
export default function Newsroom() {
  const [posts,      setPosts]      = useState([]);
  const [dbLoading,  setDbLoading]  = useState(true);
  const [dbError,    setDbError]    = useState(null);
  const [activeNav,  setActiveNav]  = useState('all');
  const [search,     setSearch]     = useState('');
  const [filterInd,  setFilterInd]  = useState('');
  const [sortField,  setSortField]  = useState('date');
  const [sortDir,    setSortDir]    = useState('desc');
  const [showFilter, setShowFilter] = useState(false);
  const [toast,      setToast]      = useState(null); // { message, sub }

  const fireToast = useCallback((message, sub) => setToast({ message, sub }), []);
  const clearToast = useCallback(() => setToast(null), []);

  // ── Connection handshake ─────────────────────────────────────────────────
  const SUPABASE_URL = SB_URL;
  const [handshake, setHandshake] = useState(null); // null | 'success' | 'failure' | 'rls'

  useEffect(() => {
    (async () => {
      const { data, error } = await _get(
        `posts?title=eq.${encodeURIComponent('CONNECTION_TEST_BEE_IN_HIVE')}&select=id,title&limit=1`
      );
      if (error) {
        const isRls = error.code === '42501' || String(error.code) === '403' || (error.message || '').toLowerCase().includes('policy');
        setHandshake(isRls ? 'rls' : 'failure');
      } else if (data && data.length > 0) {
        setHandshake('success');
      } else {
        setHandshake('failure');
      }
    })();
  }, []);
  // ─────────────────────────────────────────────────────────────────────────

  // PAGE LOAD: SELECT * FROM posts — pure fetch, zero background SDK requests
  const loadPostsFromDb = useCallback(async () => {
    setDbLoading(true);
    setDbError(null);

    const { data, error } = await _get('posts?select=*,clients(id,name)&order=id.desc');

    if (error) {
      const diagnosis =
        String(error.code) === '42P01' || (error.message || '').includes('does not exist')
          ? 'TABLE NOT FOUND — confirm table is named exactly "posts" (lowercase) in Supabase.'
          : String(error.code) === '42501' || String(error.status) === '403' || (error.message || '').toLowerCase().includes('policy')
          ? 'PERMISSION DENIED — RLS is blocking SELECT. Disable RLS on the posts table in Supabase.'
          : 'SELECT failed.';

      const fullError = { diagnosis, code: error.code ?? null, message: error.message ?? null,
        details: error.details ?? null, hint: error.hint ?? null, status: error.status ?? null };
      console.error('[Newsroom] SELECT error:', fullError);
      setDbError(JSON.stringify(fullError, null, 2));
    } else {
      const rows = (data || []).map(dbRowToPost);
      console.log('[Newsroom] ✅', rows.length, 'posts loaded. IDs:', rows.map(r => r.id));
      setPosts(rows);
    }

    setDbLoading(false);
  }, []);

  // On mount: SELECT only — zero inserts triggered here
  useEffect(() => {
    loadPostsFromDb();
  }, [loadPostsFromDb]);

  // Update a single field on a post — pure PATCH, no SDK
  const updatePost = async (id, field, value) => {
    setPosts((prev) => prev.map((p) => p.id === id ? { ...p, [field]: value } : p));
    const dbField = field === 'industry' ? 'industry_tag' : field;
    const { error } = await _patch(`posts?id=eq.${encodeURIComponent(id)}`, { [dbField]: value });
    if (error) {
      console.error(`[Newsroom] updatePost failed:`, JSON.stringify(error));
      loadPostsFromDb();
    }
  };

  // Save Link — UPDATE featured_image column for a specific post ID
  const handleHeroUpload = async (postId, publicUrl) => {
    if (!postId) { fireToast('Error', 'No post ID — cannot save.'); return; }

    // Optimistic update
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, featured_image: publicUrl } : p));

    // PATCH posts?id=eq.<postId>  { featured_image: url }
    const { data: rows, error } = await _patch(
      `posts?id=eq.${encodeURIComponent(postId)}`,
      { featured_image: publicUrl }
    );

    if (error) {
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, featured_image: null } : p));
      fireToast('Save failed', `[posts] code:${error.code} · ${error.message}`);
      return;
    }

    const saved = Array.isArray(rows) ? rows[0] : rows;
    if (saved?.featured_image === publicUrl) {
      fireToast('Image Saved!', 'featured_image updated in database.');
    } else {
      fireToast('Image Saved!', 'Update sent — refreshing list.');
    }
    await loadPostsFromDb();
  };

  // Called by ImportDock after a successful DB insert — refreshes the list
  const handleImportSuccess = async () => {
    await loadPostsFromDb();
    setActiveNav('all'); // switch back to the list view
  };

  // ── Filtering ──────────────────────────────────────────────────────────
  let visible = [...posts];
  if (activeNav === 'drafts') visible = visible.filter((p) => p.status === 'Draft' || p.status === 'draft');
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
    all:     posts.length,
    drafts:  posts.filter((p) => p.status === 'Draft' || p.status === 'draft').length,
    library: null,
    import:  null,
    audit:   null,
  };

  const publishedCount = posts.filter((p) => p.status === 'Published' || p.status === 'published').length;

  return (
    <div
      className="flex h-screen w-screen overflow-hidden"
      style={{ background: PARCHMENT, fontFamily: "'Inter', sans-serif" }}
    >
      {/* Sidebar */}
      <Sidebar active={activeNav} onNav={setActiveNav} counts={counts} />

      {/* Main canvas */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* ── Connection info bar — always visible ── */}
        <div
          className="flex items-center gap-4 px-5 py-2 flex-shrink-0 flex-wrap"
          style={{ background: '#1e1e2e', borderBottom: `2px solid ${BRASS}60` }}
        >
          <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: BRASS }}>DB Connection</span>
          <span className="flex items-center gap-1.5 text-[11px] font-mono" style={{ color: '#cdd6f4' }}>
            <span style={{ color: '#6c7086' }}>URL:</span>
            <span style={{ color: '#cba6f7', userSelect: 'all' }}>{SUPABASE_URL}</span>
          </span>
          <span className="flex items-center gap-1.5 text-[11px] font-mono" style={{ color: '#cdd6f4' }}>
            <span style={{ color: '#6c7086' }}>TABLE:</span>
            <span style={{ color: '#a6e3a1', userSelect: 'all' }}>posts</span>
          </span>
          {handshake === 'success' && (
            <span className="ml-auto text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: 'rgba(166,227,161,0.15)', color: '#a6e3a1', border: '1px solid rgba(166,227,161,0.3)' }}>
              ✓ Handshake OK
            </span>
          )}
          {(handshake === 'failure' || handshake === 'rls') && (
            <span className="ml-auto text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: 'rgba(243,139,168,0.15)', color: '#f38ba8', border: '1px solid rgba(243,139,168,0.3)' }}>
              ✗ Handshake Failed
            </span>
          )}
          {handshake === null && (
            <span className="ml-auto text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: 'rgba(203,166,247,0.12)', color: '#cba6f7', border: '1px solid rgba(203,166,247,0.25)' }}>
              Checking…
            </span>
          )}
        </div>
        {/* ───────────────────────────────────────── */}

        {/* ── Handshake banner ── */}
        {handshake === 'success' && (
          <div
            className="flex items-center justify-center gap-3 px-6 py-3 text-sm font-bold tracking-wider text-center flex-shrink-0"
            style={{ background: 'rgba(74,222,128,0.12)', borderBottom: '1px solid rgba(74,222,128,0.35)', color: '#15803d', fontFamily: "'Montserrat', sans-serif" }}
          >
            <CheckCheck className="w-4 h-4 flex-shrink-0" />
            HANDSHAKE SUCCESSFUL — WE ARE IN THE RIGHT HOUSE.
          </div>
        )}
        {(handshake === 'failure' || handshake === 'rls') && (
          <div
            className="flex flex-col items-center justify-center gap-1 px-6 py-3 text-center flex-shrink-0"
            style={{ background: 'rgba(239,68,68,0.08)', borderBottom: '1px solid rgba(239,68,68,0.3)' }}
          >
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#dc2626', fontFamily: "'Montserrat', sans-serif" }}>
              {handshake === 'rls'
                ? '✗ RLS ERROR — ROW BLOCKED. WRONG PROJECT OR RLS STILL ENABLED.'
                : '✗ TEST ROW NOT FOUND — CONNECTED TO WRONG PROJECT OR ROW MISSING.'}
            </p>
            <p className="text-[11px] font-mono" style={{ color: '#7f1d1d' }}>
              Current Supabase URL in code: <span className="font-bold">{SUPABASE_URL}</span>
            </p>
          </div>
        )}
        {/* ────────────────────── */}

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
              {activeNav === 'all'     ? 'All Posts'     :
               activeNav === 'drafts'  ? 'Drafts'        :
               activeNav === 'library' ? 'Image Library' :
               activeNav === 'audit'   ? 'DB Audit'      :
               activeNav === 'create'  ? 'New Post'      : 'Import Dock'}
            </h1>
            <p className="text-[11px] mt-0.5 flex items-center gap-2" style={{ color: SLATE_MUTED }}>
              {activeNav === 'import'  ? 'Paste JSON → parse → save to Supabase posts table' :
               activeNav === 'library' ? 'Upload photos · get public URLs · use as inline images in posts' :
               activeNav === 'audit'   ? 'Verify title + first paragraph of all records' :
               activeNav === 'create'  ? 'Fill in the fields below — no id sent, Supabase handles it' :
               `${visible.length} post${visible.length !== 1 ? 's' : ''} · ${publishedCount} published`}
              {activeNav !== 'import' && activeNav !== 'audit' && activeNav !== 'library' && activeNav !== 'create' && (
                <span
                  className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{
                    background: dbLoading ? PARCHMENT2 : dbError ? 'rgba(239,68,68,0.1)' : `${SIGNAL}15`,
                    color:      dbLoading ? SLATE_FAINT : dbError ? '#dc2626'             : SIGNAL_DIM,
                    border:     `1px solid ${dbLoading ? BORDER : dbError ? 'rgba(239,68,68,0.3)' : `${SIGNAL}30`}`,
                  }}
                >
                  {dbLoading ? 'Loading…' : dbError ? 'DB Error' : 'Live DB'}
                </span>
              )}
            </p>
          </div>

          {/* Stats pills */}
          {activeNav !== 'import' && activeNav !== 'audit' && activeNav !== 'library' && activeNav !== 'create' && (
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

          {/* New Post button — shown on list views only */}
          {activeNav !== 'import' && activeNav !== 'audit' && activeNav !== 'library' && activeNav !== 'create' && (
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white transition-all active:scale-95"
              style={{ background: SIGNAL, boxShadow: `0 2px 10px ${SIGNAL}35` }}
              onMouseEnter={(e) => { e.currentTarget.style.background = SIGNAL_DIM; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = SIGNAL; }}
              onClick={() => setActiveNav('create')}
            >
              <Plus className="w-3.5 h-3.5" />
              New Post
            </button>
          )}
        </header>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">

            {/* ── CREATE POST view ─────────────────────────────── */}
            {activeNav === 'create' && (
              <CreatePostForm
                onSuccess={async (newRow) => {
                  await loadPostsFromDb();
                  setActiveNav('all');
                  fireToast('Order Received!', newRow?.title ? `"${newRow.title}" saved to the Gazette.` : 'Post saved to the Gazette.');
                }}
                onCancel={() => setActiveNav('all')}
              />
            )}

            {/* ── IMAGE LIBRARY view ───────────────────────────── */}
            {activeNav === 'library' && (
              <ImageLibrary />
            )}

            {/* ── DB AUDIT view ────────────────────────────────── */}
            {activeNav === 'audit' && (
              <DbAudit localPosts={posts} />
            )}

            {/* ── IMPORT DOCK view ─────────────────────────────── */}
            {activeNav === 'import' && (
              <div className="max-w-2xl mx-auto">
                <ImportDock onImportSuccess={handleImportSuccess} />
              </div>
            )}

            {/* ── POST LIST view ───────────────────────────────── */}
            {activeNav !== 'import' && activeNav !== 'audit' && activeNav !== 'library' && activeNav !== 'create' && (
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
                  <div style={{ width: '72px', flexShrink: 0 }}>
                    <span className="text-[9px] font-bold uppercase tracking-widest">Hero</span>
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
                {dbLoading ? (
                  /* Loading skeleton */
                  <div className="flex flex-col gap-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 px-5 py-3 rounded-xl border animate-pulse"
                        style={{ background: WHITE, borderColor: BORDER, height: '66px' }}
                      >
                        <div className="rounded-lg flex-shrink-0" style={{ width: '64px', height: '44px', background: PARCHMENT2 }} />
                        <div className="flex-1 flex flex-col gap-2">
                          <div className="rounded" style={{ height: '12px', width: '55%', background: PARCHMENT2 }} />
                          <div className="rounded" style={{ height: '10px', width: '30%', background: PARCHMENT2 }} />
                        </div>
                        <div className="rounded-lg flex-shrink-0" style={{ width: '100px', height: '28px', background: PARCHMENT2 }} />
                        <div className="rounded-full flex-shrink-0" style={{ width: '80px', height: '20px', background: PARCHMENT2 }} />
                      </div>
                    ))}
                  </div>
                ) : dbError ? (
                  /* DB error state — full JSON error object displayed verbatim */
                  <div
                    className="rounded-xl overflow-hidden"
                    style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.25)' }}
                  >
                    <div className="flex items-center gap-3 px-5 py-3 border-b" style={{ borderColor: 'rgba(239,68,68,0.2)' }}>
                      <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#dc2626' }} />
                      <p className="text-sm font-bold flex-1" style={{ color: '#dc2626' }}>
                        Supabase SELECT failed — full error below
                      </p>
                      <button
                        onClick={loadPostsFromDb}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex-shrink-0"
                        style={{ background: 'rgba(239,68,68,0.12)', color: '#dc2626', border: '1px solid rgba(239,68,68,0.3)' }}
                      >
                        <RefreshCw className="w-3 h-3" />
                        Retry
                      </button>
                    </div>
                    {/* Full raw JSON so the exact error is visible without opening DevTools */}
                    <pre
                      className="px-5 py-4 text-xs font-mono leading-relaxed overflow-x-auto select-all whitespace-pre-wrap"
                      style={{ color: '#b45309', background: '#1e1e2e' }}
                    >
                      {dbError}
                    </pre>
                    <div className="px-5 py-3 border-t text-[10px]" style={{ borderColor: 'rgba(239,68,68,0.15)', color: '#7f1d1d' }}>
                      Table: <code className="font-mono">posts</code> · Query: <code className="font-mono">SELECT * ORDER BY id DESC</code> · RLS must be DISABLED in Supabase → Table Editor → posts → RLS
                    </div>
                  </div>
                ) : visible.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {visible.map((post) => (
                      <PostRow key={post.id} post={post} onUpdate={updatePost} onSaveUrl={handleHeroUpload} />
                    ))}
                  </div>
                ) : (
                  <div
                    className="flex flex-col items-center gap-4 py-16 rounded-2xl border border-dashed"
                    style={{ borderColor: `${SIGNAL}20`, background: `${SIGNAL}04` }}
                  >
                    <FileText className="w-8 h-8" style={{ color: SLATE_FAINT }} />
                    <div className="text-center">
                      <p className="text-sm font-semibold" style={{ color: SLATE2 }}>
                        {search ? 'No posts match that search' : filterInd ? 'No posts for that industry' : 'No posts returned from database'}
                      </p>
                      <p className="text-xs mt-1" style={{ color: SLATE_MUTED }}>
                        {search
                          ? 'Try a different search term'
                          : filterInd
                          ? 'Clear the industry filter to see all posts'
                          : 'The query ran without error but returned 0 rows — check the table name and permissions in Supabase'}
                      </p>
                    </div>
                    {/* Diagnostic readout — only shown when there's genuinely no data */}
                    {!search && !filterInd && (
                      <div
                        className="rounded-xl border px-4 py-3 text-left max-w-sm w-full"
                        style={{ borderColor: BORDER, background: WHITE }}
                      >
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: SLATE_FAINT }}>Diagnostics</p>
                        <div className="flex flex-col gap-1 text-[11px] font-mono" style={{ color: SLATE_MUTED }}>
                          <span>table: <span style={{ color: SLATE }}>posts</span></span>
                          <span>query: <span style={{ color: SLATE }}>SELECT * ORDER BY id DESC</span></span>
                          <span>rows in state: <span style={{ color: SLATE }}>{posts.length}</span></span>
                          <span>db error: <span style={{ color: posts.length === 0 ? '#f59e0b' : '#4ade80' }}>{dbError || 'none'}</span></span>
                        </div>
                        <button
                          onClick={loadPostsFromDb}
                          className="mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                          style={{ background: `${SIGNAL}12`, color: SIGNAL_DIM, border: `1px solid ${SIGNAL}30` }}
                        >
                          <RefreshCw className="w-3 h-3" />
                          Retry fetch
                        </button>
                      </div>
                    )}
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

      {/* ── "Image Brewed!" toast ─────────────────────────────── */}
      {toast && (
        <NewsroomToast
          message={toast.message}
          sub={toast.sub}
          onDismiss={clearToast}
        />
      )}
    </div>
  );
}
