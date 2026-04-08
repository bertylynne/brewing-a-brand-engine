import { useState } from 'react';
import Stepper from './components/Stepper';
import Step1Welcome  from './steps/Step1Welcome';
import Step2Identity from './steps/Step2Identity';
import Step3Branch   from './steps/Step3Branch';
import Step4Services from './steps/Step4Services';
import Step5Staff    from './steps/Step5Staff';
import Step6Finalize from './steps/Step5Finalize';
import './index.css';

const DEFAULT_HERO = `Welcome to our premier barbershop and salon — where craftsmanship meets style. Our team of experienced professionals is dedicated to delivering exceptional cuts, styles, and grooming services tailored to you. Whether you're here for a classic fade, a fresh trim, or a full beauty treatment, we've got you covered. Walk in, sit back, and leave looking your absolute best.`;

const DEFAULT_DATA = {
  heroText:          DEFAULT_HERO,
  heroImage:         null,
  heroImageName:     null,
  logo:              null,
  logoName:          null,
  tagline:           '',
  businessType:      null,
  serviceCategories: null,
  staff:             [],
  hiring:            { active: false, roles: [], description: '' },
  // Discovery extras
  businessName:  null,
  address:       null,
  phone:         null,
  rating:        null,
  reviewCount:   null,
};

export default function App() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(DEFAULT_DATA);

  const goNext = () => setStep((s) => Math.min(s + 1, 6));
  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  // Called by DiscoveryPanel when the user hits "Apply"
  const handleDiscovery = (json) => {
    const type = (json.type || '').toLowerCase();
    const businessType = (type === 'barbershop' || type === 'salon') ? type : null;

    // Build a personalized hero text if a name was provided
    const heroText = json.businessName
      ? `Welcome to ${json.businessName} — where craftsmanship meets style. Our experienced team delivers exceptional cuts, styles, and grooming services tailored just for you. Whether you need a classic fade, a fresh trim, or a full beauty treatment, we have you covered. Walk in, sit back, and leave looking your absolute best.`
      : DEFAULT_HERO;

    setData((prev) => ({
      ...prev,
      heroText,
      businessName: json.businessName || prev.businessName,
      businessType: businessType || prev.businessType,
      address:      json.address      || prev.address,
      phone:        json.phone        || prev.phone,
      rating:       json.rating       != null ? json.rating      : prev.rating,
      reviewCount:  json.reviewCount  != null ? json.reviewCount : prev.reviewCount,
      // Reset service categories when business type changes
      serviceCategories: businessType !== prev.businessType ? null : prev.serviceCategories,
    }));
  };

  const stepProps = { onNext: goNext, onBack: goBack, data, setData };

  return (
    <div className="min-h-svh flex flex-col" style={{ background: 'var(--bg-base)' }}>
      {/* Stepper — hidden on step 1 */}
      {step > 1 && <Stepper current={step} />}

      {/* Step content */}
      <div className="flex-1 overflow-y-auto">
        <div key={step} className="animate-fade-up">
          {step === 1 && <Step1Welcome  {...stepProps} onDiscovery={handleDiscovery} />}
          {step === 2 && <Step2Identity {...stepProps} />}
          {step === 3 && <Step3Branch   {...stepProps} />}
          {step === 4 && <Step4Services {...stepProps} />}
          {step === 5 && <Step5Staff    {...stepProps} />}
          {step === 6 && <Step6Finalize {...stepProps} />}
        </div>
      </div>

      {/* Footer */}
      {step > 1 && (
        <div className="py-3 border-t text-center" style={{ borderColor: 'var(--border-sub)' }}>
          <p className="text-[10px] tracking-widest uppercase font-medium" style={{ color: 'var(--text-faint)' }}>
            CBA Solutions · Client Portal
          </p>
        </div>
      )}
    </div>
  );
}
