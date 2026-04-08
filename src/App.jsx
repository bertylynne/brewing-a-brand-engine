import { useState } from 'react';
import Stepper from './components/Stepper';
import Step1Welcome from './steps/Step1Welcome';
import Step2Identity from './steps/Step2Identity';
import Step3Branch from './steps/Step3Branch';
import Step4Services from './steps/Step4Services';
import Step5Finalize from './steps/Step5Finalize';
import './index.css';

const DEFAULT_DATA = {
  heroText: `Welcome to our premier barbershop and salon — where craftsmanship meets style. Our team of experienced professionals is dedicated to delivering exceptional cuts, styles, and grooming services tailored to you. Whether you're here for a classic fade, a fresh trim, or a full beauty treatment, we've got you covered. Walk in, sit back, and leave looking your absolute best.`,
  heroImage: null,
  heroImageName: null,
  businessType: null,
  services: null,
};

export default function App() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(DEFAULT_DATA);

  const goNext = () => setStep((s) => Math.min(s + 1, 5));
  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  const stepProps = { onNext: goNext, onBack: goBack, data, setData };

  return (
    <div className="min-h-svh bg-[#0a0a0a] flex flex-col">
      {/* Stepper — hidden on step 1 */}
      {step > 1 && <Stepper current={step} />}

      {/* Step content */}
      <div className="flex-1 overflow-y-auto">
        <div key={step} className="animate-fade-up">
          {step === 1 && <Step1Welcome {...stepProps} />}
          {step === 2 && <Step2Identity {...stepProps} />}
          {step === 3 && <Step3Branch {...stepProps} />}
          {step === 4 && <Step4Services {...stepProps} />}
          {step === 5 && <Step5Finalize {...stepProps} />}
        </div>
      </div>

      {/* Footer */}
      {step > 1 && (
        <div className="py-3 border-t border-[#111] text-center">
          <p className="text-[10px] text-[#2a2a2a] tracking-widest uppercase">
            CBA Solutions · Client Portal
          </p>
        </div>
      )}
    </div>
  );
}
