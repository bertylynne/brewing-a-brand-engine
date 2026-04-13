import { useState, useEffect, useCallback } from 'react';
import Stepper          from './components/Stepper';
import Step1Welcome     from './steps/Step1Welcome';
import Step2Blueprint   from './steps/StepBlueprint';
import Step3Identity    from './steps/Step2Identity';
import Step4Operations  from './steps/Step4Operations';
import Step5Services    from './steps/Step4Services';
import Step6Staff       from './steps/Step5Staff';
import Step7Finalize    from './steps/Step5Finalize';
import Newsroom         from './pages/Newsroom';
import Resources        from './pages/Resources';
import { CheckCircle2, X } from 'lucide-react';
import './index.css';

const TOTAL_STEPS = 7;

const DEFAULT_HERO = `Welcome to our premier barbershop and salon — where craftsmanship meets style. Our team of experienced professionals is dedicated to delivering exceptional cuts, styles, and grooming services tailored to you. Whether you're here for a classic fade, a fresh trim, or a full beauty treatment, we've got you covered. Walk in, sit back, and leave looking your absolute best.`;

// Vibe → opening statement map (single source of truth, shared with Step3Identity)
export const VIBE_COPY = {
  heritage:  `Steeped in tradition, defined by excellence. We specialise in timeless cuts and classic shaves for the modern gentleman — where every visit is a ritual and every detail is intentional.`,
  architect: `Precision-cut. Future-forward. We redefine the urban aesthetic with sharp lines and technical mastery — a space engineered for the professional who demands both performance and style.`,
  serenity:  `A sanctuary for style. Discover organic beauty and sophisticated hair artistry in a space designed for tranquility — where your comfort is the craft and every detail is curated just for you.`,
  technical: `Bold style for everyone. We blend technical expertise with creative vision to deliver a personalised experience — structured, inclusive, and built around what makes you feel your best.`,
};

export function slugify(name) {
  return (name || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const DEFAULT_HOURS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday']
  .reduce((acc, day) => ({
    ...acc,
    [day]: { open: '09:00', close: '18:00', closed: false },
  }), {});

const DEFAULT_DATA = {
  businessName:  '',
  bizId:         '',
  address:       null,
  phone:         null,
  rating:        null,
  reviewCount:   null,
  heroText:      DEFAULT_HERO,
  heroImage:     null,
  heroImageName: null,
  logo:          null,
  logoName:      null,
  tagline:       '',
  brandPhotos:   [],
  socialLinks:   { facebook: '', instagram: '', others: [] },
  paymentMethods: [],
  brandColors:   { primary: '#c9a227', secondary: '#152232', accent: '#e8705a' },
  customDesign:  { enabled: false, urls: ['', '', ''], vibeNotes: '' },
  fontKit:       null,
  businessHours: DEFAULT_HOURS,
  businessType:      null,
  serviceCategories: null,
  selectedServices: [],
  staff: [
    { id:301, name:'Silas Vance',           title:'Master Barber',   photo:null, photoName:null, bookingStyle:'digital', bookingLink:'https://sqy.re/silas',      bio:'Specializing in precision fades and architectural hair design with 15 years of industry experience.', instagram:'silas_cuts',    contactEmail:'', contactPhone:'', portfolioAccess:true  },
    { id:302, name:'Elena Rossi',           title:'Lead Colorist',   photo:null, photoName:null, bookingStyle:'digital', bookingLink:'https://vagaro.com/elena',   bio:'Expert in balayage and corrective color theory. Crafting bespoke tones for the modern individual.',  instagram:'elena_colors', contactEmail:'', contactPhone:'', portfolioAccess:true  },
    { id:303, name:'Marcus "Pops" Miller',  title:'Senior Barber',   photo:null, photoName:null, bookingStyle:'walkin',  bookingLink:'',                           bio:'Old school techniques for the modern man. 30 years at the chair.',                                     instagram:'',             contactEmail:'', contactPhone:'', portfolioAccess:false },
    { id:304, name:'Jordan Reed',           title:'Junior Barber',   photo:null, photoName:null, bookingStyle:'build',   bookingLink:'',                           bio:'Fading specialist and beard grooming expert.',                                                        instagram:'',             contactEmail:'', contactPhone:'', portfolioAccess:false },
    { id:305, name:'Sarah Chen',            title:'Esthetician',     photo:null, photoName:null, bookingStyle:'hybrid',  bookingLink:'',                           bio:'Specializing in high-performance skincare and traditional straight-shave facials.',                   instagram:'',             contactEmail:'', contactPhone:'', portfolioAccess:false },
  ],
  hiring: { active: false, roles: [], description: '' },
};

// ── Toast component ────────────────────────────────────────────────────────────
function Toast({ message, subtext, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4500);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-up"
      style={{ maxWidth: '360px', width: 'calc(100vw - 2.5rem)' }}
    >
      <div
        className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border shadow-2xl"
        style={{
          background: 'var(--bg-card)',
          borderColor: 'rgba(74,222,128,0.35)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(74,222,128,0.1)',
        }}
      >
        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(74,222,128,0.15)' }}>
          <CheckCircle2 className="w-4 h-4" style={{ color: '#4ade80' }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold leading-tight" style={{ color: '#4ade80' }}>{message}</p>
          {subtext && <p className="text-[10px] mt-0.5 truncate" style={{ color: 'var(--text-faint)' }}>{subtext}</p>}
        </div>
        <button
          onClick={onDismiss}
          className="flex-shrink-0 transition-colors"
          style={{ color: 'var(--text-faint)' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-faint)'; }}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ── App ────────────────────────────────────────────────────────────────────────
export default function App() {
  // Check for ?page= param on mount — drives top-level page routing
  const [page] = useState(() => new URLSearchParams(window.location.search).get('page'));

  const [step,    setStep]    = useState(1);
  const [data,    setData]    = useState(DEFAULT_DATA);
  // isAdmin lives in App state — persists across ALL step navigation for the session.
  // Only resets on full page reload. Unlocked once via POPS2026 on Step 1.
  const [isAdmin, setIsAdmin] = useState(false);
  const [toast,   setToast]   = useState(null); // { message, subtext }

  // ── Page routing ───────────────────────────────────────────────────────────
  if (page === 'newsroom')   return <Newsroom />;
  if (page === 'resources')  return <Resources />;

  const showToast = useCallback((message, subtext) => {
    setToast({ message, subtext });
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  // Read ?biz_id= from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bizId  = params.get('biz_id');
    if (bizId) setData((prev) => ({ ...prev, bizId }));
  }, []);

  // Memory wipe: when vibe (fontKit) changes, overwrite heroText immediately
  useEffect(() => {
    const copy = VIBE_COPY[data.fontKit];
    if (copy) setData((prev) => ({ ...prev, heroText: copy }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.fontKit]);

  const goNext   = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const goBack   = () => setStep((s) => Math.max(s - 1, 1));
  // Unrestricted: jump to any step (1–7) instantly
  const goToStep = (n) => setStep(Math.min(Math.max(n, 1), TOTAL_STEPS));

  const handleDiscovery = (json) => {
    const type = (json.type || '').toLowerCase();
    const businessType = (type === 'barbershop' || type === 'salon') ? type : null;
    const heroText = json.businessName
      ? `Welcome to ${json.businessName} — where craftsmanship meets style. Our experienced team delivers exceptional cuts, styles, and grooming services tailored just for you. Whether you need a classic fade, a fresh trim, or a full beauty treatment, we have you covered. Walk in, sit back, and leave looking your absolute best.`
      : DEFAULT_HERO;
    setData((prev) => ({
      ...prev,
      heroText,
      businessName:  json.businessName || prev.businessName,
      bizId:         prev.bizId || slugify(json.businessName),
      businessType:  businessType || prev.businessType,
      address:       json.address     || prev.address,
      phone:         json.phone       || prev.phone,
      rating:        json.rating      != null ? json.rating      : prev.rating,
      reviewCount:   json.reviewCount != null ? json.reviewCount : prev.reviewCount,
      serviceCategories: businessType !== prev.businessType ? null : prev.serviceCategories,
    }));
  };

  // Called by ProjectLoader — merges loaded DB data into state, jumps to Step 2, shows toast
  const handleProjectLoad = useCallback((projectData) => {
    setData((prev) => ({
      ...prev,
      ...projectData,
      businessHours: projectData.businessHours || prev.businessHours,
    }));
    setStep(2);
    showToast(
      `Project: ${projectData.bizId} — Loaded`,
      projectData.businessName ? `Resumed for ${projectData.businessName}` : 'All saved data restored'
    );
  }, [showToast]);

  const stepProps = { onNext: goNext, onBack: goBack, data, setData, isAdmin };

  return (
    <div className="min-h-svh flex flex-col" style={{ background: 'var(--bg-base)' }}>
      {step > 1 && (
        <Stepper current={step} onNavigate={goToStep} />
      )}

      <div className="flex-1 overflow-y-auto">
        <div key={step} className="animate-fade-up">
          {step === 1 && (
            <Step1Welcome
              {...stepProps}
              onDiscovery={handleDiscovery}
              onAdminUnlock={() => setIsAdmin(true)}
              onProjectLoad={handleProjectLoad}
            />
          )}
          {step === 2 && <Step2Blueprint  {...stepProps} />}
          {step === 3 && <Step3Identity   {...stepProps} />}
          {step === 4 && <Step4Operations {...stepProps} />}
          {step === 5 && <Step5Services   {...stepProps} />}
          {step === 6 && <Step6Staff      {...stepProps} />}
          {step === 7 && <Step7Finalize   {...stepProps} />}
        </div>
      </div>

      {step > 1 && (
        <div className="py-3 border-t text-center flex items-center justify-center gap-3" style={{ borderColor: 'var(--border-sub)' }}>
          <p className="text-[10px] tracking-widest uppercase font-medium" style={{ color: 'var(--text-faint)' }}>
            CBA Solutions · Client Portal
          </p>
          {isAdmin && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border"
              style={{ borderColor: 'rgba(201,162,39,0.4)', background: 'rgba(201,162,39,0.1)', color: 'var(--gold)' }}>
              ★ Master Mode
            </span>
          )}
        </div>
      )}

      {/* Global toast */}
      {toast && (
        <Toast
          message={toast.message}
          subtext={toast.subtext}
          onDismiss={dismissToast}
        />
      )}
    </div>
  );
}
