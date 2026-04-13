import { useState, useEffect } from 'react';
import Stepper          from './components/Stepper';
import Step1Welcome     from './steps/Step1Welcome';
import Step2Blueprint   from './steps/StepBlueprint';
import Step3Identity    from './steps/Step2Identity';
import Step4Operations  from './steps/Step4Operations';
import Step5Services    from './steps/Step4Services';
import Step6Staff       from './steps/Step5Staff';
import Step7Finalize    from './steps/Step5Finalize';
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

// Build a URL-safe slug from a business name
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
  // ── Identity
  businessName:  '',
  bizId:         '',           // auto-generated slug; overridden by ?biz_id= URL param
  address:       null,
  phone:         null,
  rating:        null,
  reviewCount:   null,

  // ── Brand Content (Step 2)
  heroText:      DEFAULT_HERO,
  heroImage:     null,
  heroImageName: null,
  logo:          null,
  logoName:      null,
  tagline:       '',
  brandPhotos:   [],
  socialLinks:   { facebook: '', instagram: '', others: [] }, // [{ id, label, url }]
  paymentMethods: [],  // e.g. ['Visa','Cash','Apple Pay']

  // ── Design Preferences (Step 3)
  brandColors:   { primary: '#c9a227', secondary: '#152232', accent: '#e8705a' },
  customDesign:  { enabled: false, urls: ['', '', ''], vibeNotes: '' },
  fontKit:       null,  // set by admin: 'architect' | 'heritage' | 'serenity' | 'technical'

  // ── Operations (Step 4)
  businessHours: DEFAULT_HOURS,

  // ── Category (Step 5)
  businessType:      null,
  serviceCategories: null,

  // ── Services (Step 6)
  selectedServices: [],

  // ── Team (Step 7)
  staff:   [],
  hiring:  { active: false, roles: [], description: '' },
};

export default function App() {
  const [step, setStep]     = useState(1);
  const [data, setData]     = useState(DEFAULT_DATA);
  const [isAdmin, setIsAdmin] = useState(false);

  // Read ?biz_id= from URL on mount — takes precedence over slug
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bizId  = params.get('biz_id');
    if (bizId) setData((prev) => ({ ...prev, bizId }));
  }, []);

  // Memory wipe: whenever the vibe (fontKit) changes, immediately overwrite heroText
  // so the Identity step always arrives pre-filled with the correct vibe copy.
  useEffect(() => {
    const copy = VIBE_COPY[data.fontKit];
    if (copy) setData((prev) => ({ ...prev, heroText: copy }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.fontKit]);

  const goNext = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  // Called by DiscoveryPanel
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

  const stepProps = { onNext: goNext, onBack: goBack, data, setData, isAdmin };

  return (
    <div className="min-h-svh flex flex-col" style={{ background: 'var(--bg-base)' }}>
      {step > 1 && <Stepper current={step} />}

      <div className="flex-1 overflow-y-auto">
        <div key={step} className="animate-fade-up">
          {step === 1 && <Step1Welcome    {...stepProps} onDiscovery={handleDiscovery} onAdminUnlock={() => setIsAdmin(true)} />}
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
    </div>
  );
}
