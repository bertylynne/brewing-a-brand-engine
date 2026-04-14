import { useState, useEffect } from 'react';
import { Phone, Loader2, AlertCircle } from 'lucide-react';

// ── Supabase REST fetch (same pattern as Newsroom — no SDK, no auto-requests) ──
const SB_URL = 'https://bjxgqbgjtzbgzdprtepd.supabase.co';
const SB_KEY = 'sb_publishable_5mY9p11tWx6znT3h2zMr2A_1J19xwEr';
const SB_HEADERS = {
  apikey:        SB_KEY,
  Authorization: `Bearer ${SB_KEY}`,
  'Content-Type': 'application/json',
};

async function fetchClient(id) {
  const res  = await fetch(
    `${SB_URL}/rest/v1/clients?id=eq.${encodeURIComponent(id)}&select=*&limit=1`,
    { headers: SB_HEADERS }
  );
  const json = await res.json();
  if (!res.ok) return { data: null, error: json };
  return { data: json[0] ?? null, error: null };
}

// ── Colour helpers ─────────────────────────────────────────────────────────────

/** Pick a readable foreground (black or white) for a given hex background */
function contrastColor(hex) {
  if (!hex) return '#ffffff';
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  // Perceived luminance (WCAG formula)
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.55 ? '#111111' : '#ffffff';
}

/** Format a raw phone string for display: (555) 867-5309 */
function fmtPhone(raw) {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 10) {
    return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits[0] === '1') {
    return `+1 (${digits.slice(1,4)}) ${digits.slice(4,7)}-${digits.slice(7)}`;
  }
  return raw;
}

// ── Loading screen ─────────────────────────────────────────────────────────────
function BrewingScreen() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-6"
      style={{ background: '#0e1a26' }}
    >
      {/* Animated dots */}
      <div className="flex gap-2">
        {[0, 0.18, 0.36].map((d, i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full animate-pulse"
            style={{ background: '#c9a227', animationDelay: `${d}s` }}
          />
        ))}
      </div>
      <p
        className="text-sm font-bold uppercase tracking-[0.3em]"
        style={{ color: '#c9a227', fontFamily: "'Montserrat', sans-serif" }}
      >
        Brewing your brand…
      </p>
    </div>
  );
}

// ── Error screen ───────────────────────────────────────────────────────────────
function ErrorScreen({ message, clientId }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center"
      style={{ background: '#0e1a26' }}
    >
      <AlertCircle className="w-8 h-8" style={{ color: '#f87171' }} />
      <p className="text-sm font-bold" style={{ color: '#f87171' }}>
        Could not load salon
      </p>
      <p className="text-xs font-mono max-w-xs break-all" style={{ color: '#64748b' }}>
        {message || 'Unknown error'}
      </p>
      {clientId && (
        <p className="text-[10px]" style={{ color: '#475569' }}>
          Requested ID: <span className="font-mono">{clientId}</span>
        </p>
      )}
    </div>
  );
}

// ── Hero section ───────────────────────────────────────────────────────────────
function Hero({ client }) {
  const colors      = client.brand_colors || {};
  const primary     = colors.primary   || '#1a1a2e';
  const secondary   = colors.secondary || '#c9a227';
  const accent      = colors.accent    || '#e8705a';

  const bgColor     = primary;
  const fgColor     = contrastColor(primary);
  const btnBg       = secondary;
  const btnFg       = contrastColor(secondary);

  const name        = client.name             || 'Untitled Salon';
  const phone       = client.phone            || null;
  const vibe        = client.vibe             || client.tagline || client.business_type || null;
  const logoUrl     = client.logo_url         || null;
  const subdomain   = client.subdomain_prefix || null;
  const phoneDisplay = fmtPhone(phone);

  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center relative overflow-hidden"
      style={{ background: bgColor }}
    >
      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% 30%, ${secondary}18 0%, transparent 70%)`,
        }}
      />

      {/* Corner marks */}
      {[
        'top-5 left-5 border-t border-l',
        'top-5 right-5 border-t border-r',
        'bottom-5 left-5 border-b border-l',
        'bottom-5 right-5 border-b border-r',
      ].map((cls) => (
        <div
          key={cls}
          className={`absolute w-6 h-6 ${cls}`}
          style={{ borderColor: `${secondary}40` }}
        />
      ))}

      <div className="relative z-10 flex flex-col items-center gap-6 max-w-lg w-full">

        {/* Logo */}
        {logoUrl && (
          <div
            className="w-20 h-20 rounded-2xl overflow-hidden border-2 flex items-center justify-center"
            style={{ borderColor: `${secondary}50`, background: `${secondary}10` }}
          >
            <img src={logoUrl} alt={name} className="w-full h-full object-contain p-2" />
          </div>
        )}

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="h-px w-10" style={{ background: `${secondary}60` }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: secondary }} />
          <div className="h-px w-10" style={{ background: `${secondary}60` }} />
        </div>

        {/* Business name */}
        <h1
          className="text-4xl sm:text-5xl font-black leading-tight tracking-tight"
          style={{ color: fgColor, fontFamily: "'Montserrat', sans-serif" }}
        >
          {name}
        </h1>

        {/* Vibe / tagline */}
        {vibe && (
          <p
            className="text-base font-medium italic max-w-sm leading-relaxed"
            style={{ color: `${fgColor}99` }}
          >
            "{vibe}"
          </p>
        )}

        {/* Brand colour swatches */}
        {(colors.primary || colors.secondary || colors.accent) && (
          <div className="flex items-center gap-2">
            {[colors.primary, colors.secondary, colors.accent].filter(Boolean).map((c, i) => (
              <div
                key={i}
                className="w-5 h-5 rounded-full border-2"
                style={{ background: c, borderColor: `${fgColor}25` }}
                title={c}
              />
            ))}
          </div>
        )}

        {/* Call Now button */}
        {phone ? (
          <a
            href={`tel:${phone.replace(/\D/g, '')}`}
            className="flex items-center justify-center gap-3 px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest transition-all duration-200 hover:scale-[1.03] active:scale-95"
            style={{
              background:  btnBg,
              color:       btnFg,
              boxShadow:   `0 6px 28px ${secondary}55`,
              fontFamily:  "'Montserrat', sans-serif",
            }}
          >
            <Phone className="w-4 h-4" />
            Call Now · {phoneDisplay}
          </a>
        ) : (
          <div
            className="px-6 py-3 rounded-full text-xs font-mono"
            style={{ color: `${fgColor}40`, border: `1px solid ${fgColor}15` }}
          >
            No phone on file
          </div>
        )}

        {/* Subdomain hint */}
        {subdomain && (
          <p
            className="text-[10px] font-mono tracking-widest"
            style={{ color: `${secondary}55` }}
          >
            {subdomain}.{window.location.hostname}
          </p>
        )}

      </div>
    </section>
  );
}

// ── Main export ────────────────────────────────────────────────────────────────
export default function MasterTemplate() {
  const clientId = new URLSearchParams(window.location.search).get('id');

  const [client,  setClient]  = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!clientId) {
      setError('No salon ID in URL. Add ?id=<client_id> to the address bar.');
      setLoading(false);
      return;
    }
    (async () => {
      const { data, error: fetchErr } = await fetchClient(clientId);
      if (fetchErr) {
        setError(fetchErr.message || JSON.stringify(fetchErr));
      } else if (!data) {
        setError(`No salon found with ID: ${clientId}`);
      } else {
        setClient(data);
      }
      setLoading(false);
    })();
  }, [clientId]);

  if (loading) return <BrewingScreen />;
  if (error)   return <ErrorScreen message={error} clientId={clientId} />;
  return <Hero client={client} />;
}
