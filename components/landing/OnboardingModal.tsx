import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  TrendingUp,
  Zap,
  DollarSign,
  Gamepad2,
  Coffee,
  Laptop,
  BookOpen,
  Briefcase,
  Instagram,
  Check,
  ChevronRight
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose
}) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    goal: '',
    niche: ''
  });

  if (!isOpen) return null;

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const updateData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const goToDashboard = () => {
    onClose();
    navigate('/dashboard');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-brand-navy/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        <div className="h-1.5 w-full bg-slate-100 shrink-0">
          <div
            className="h-full bg-brand-blue transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-brand-navy transition-colors p-2 z-10"
        >
          <X size={20} />
        </button>

        <div className="p-8 md:p-10 overflow-y-auto flex flex-col flex-1">
          {step === 1 && (
            <div className="flex-1 flex flex-col animate-in slide-in-from-right-8 fade-in duration-300">
              <div className="mb-8">
                <span className="text-sm font-bold text-brand-blue uppercase tracking-wider mb-2 block">
                  Step 1 of 4
                </span>
                <h2 className="text-3xl font-bold text-brand-navy mb-3">
                  Welcome to the Director's Chair.
                </h2>
                <p className="text-brand-slate text-lg">
                  Let's get your workspace ready. What should we call you?
                </p>
              </div>

              <div className="space-y-6 flex-1">
                <div>
                  <label className="block text-sm font-semibold text-brand-navy mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateData('name', e.target.value)}
                    className="w-full px-4 py-3.5 rounded-lg border border-slate-200 bg-white focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all text-brand-navy text-lg placeholder:text-slate-400"
                    placeholder="Jane Doe"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-navy mb-2">
                    Work Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateData('email', e.target.value)}
                    className="w-full px-4 py-3.5 rounded-lg border border-slate-200 bg-white focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all text-brand-navy text-lg placeholder:text-slate-400"
                    placeholder="jane@company.com"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleNext}
                  disabled={!formData.name || !formData.email}
                  className="px-8 py-3.5 bg-brand-blue text-white font-bold rounded-lg hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Continue <ChevronRight size={18} strokeWidth={3} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex-1 flex flex-col animate-in slide-in-from-right-8 fade-in duration-300">
              <div className="mb-8">
                <span className="text-sm font-bold text-brand-blue uppercase tracking-wider mb-2 block">
                  Step 2 of 4
                </span>
                <h2 className="text-3xl font-bold text-brand-navy mb-3">
                  What's your primary goal?
                </h2>
                <p className="text-brand-slate text-lg">
                  We'll personalize your experience.
                </p>
              </div>

              <div className="flex flex-col gap-4 flex-1">
                {[
                  {
                    id: 'growth',
                    label: 'Growth',
                    desc: 'Grow my audience faster',
                    icon: <TrendingUp size={24} />
                  },
                  {
                    id: 'speed',
                    label: 'Editing Speed',
                    desc: 'Create content 10x faster',
                    icon: <Zap size={24} />
                  },
                  {
                    id: 'monetization',
                    label: 'Monetization',
                    desc: 'Turn views into revenue',
                    icon: <DollarSign size={24} />
                  }
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      updateData('goal', option.id);
                      handleNext();
                    }}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-md flex items-center gap-5 group ${
                      formData.goal === option.id
                        ? 'border-brand-blue bg-blue-50/50'
                        : 'border-slate-100 bg-white hover:border-blue-200'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        formData.goal === option.id
                          ? 'bg-blue-100 text-brand-blue'
                          : 'bg-slate-50 text-brand-navy group-hover:bg-blue-50 group-hover:text-brand-blue'
                      }`}
                    >
                      {option.icon}
                    </div>

                    <div className="flex flex-col">
                      <span
                        className={`font-bold text-lg ${
                          formData.goal === option.id
                            ? 'text-brand-blue'
                            : 'text-brand-navy'
                        }`}
                      >
                        {option.label}
                      </span>
                      <span className="text-slate-500 text-sm font-medium">
                        {option.desc}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-8 flex justify-end w-full">
                <button
                  onClick={handleNext}
                  className="w-full bg-blue-300/50 text-blue-600/50 font-bold py-3.5 rounded-lg cursor-not-allowed"
                  disabled
                  style={{ display: formData.goal ? 'none' : 'block' }}
                >
                  Continue <span className="ml-1">→</span>
                </button>
                {formData.goal && (
                  <button
                    onClick={handleNext}
                    className="w-full bg-brand-blue text-white font-bold py-3.5 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                  >
                    Continue <ChevronRight size={18} strokeWidth={3} />
                  </button>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex-1 flex flex-col animate-in slide-in-from-right-8 fade-in duration-300">
              <div className="mb-8">
                <span className="text-sm font-bold text-brand-blue uppercase tracking-wider mb-2 block">
                  Step 3 of 4
                </span>
                <h2 className="text-3xl font-bold text-brand-navy mb-3">
                  What is your niche?
                </h2>
                <p className="text-brand-slate text-lg">
                  Training the model on your industry style.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 flex-1 content-start">
                {[
                  { id: 'gaming', label: 'Gaming', icon: <Gamepad2 size={24} /> },
                  {
                    id: 'lifestyle',
                    label: 'Lifestyle',
                    icon: <Coffee size={24} />
                  },
                  { id: 'tech', label: 'Tech & AI', icon: <Laptop size={24} /> },
                  { id: 'edu', label: 'Education', icon: <BookOpen size={24} /> },
                  { id: 'biz', label: 'Business', icon: <Briefcase size={24} /> },
                  { id: 'other', label: 'Other', icon: <TrendingUp size={24} /> }
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      updateData('niche', option.id);
                      handleNext();
                    }}
                    className={`p-4 rounded-xl border-2 text-left transition-all duration-200 flex flex-col items-center justify-center gap-2 aspect-square ${
                      formData.niche === option.id
                        ? 'border-brand-blue bg-blue-50/50 text-brand-blue'
                        : 'border-slate-100 bg-white text-slate-500 hover:border-blue-200 hover:text-brand-navy hover:shadow-md'
                    }`}
                  >
                    {option.icon}
                    <span className="font-semibold">{option.label}</span>
                  </button>
                ))}
              </div>

              <div className="mt-8 flex justify-between items-center">
                <button
                  onClick={handleBack}
                  className="text-slate-400 font-semibold hover:text-brand-navy"
                >
                  Back
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="flex-1 flex flex-col text-center animate-in slide-in-from-right-8 fade-in duration-300 justify-center">
              <div className="w-16 h-16 bg-brand-blue/10 text-brand-blue rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Check size={32} strokeWidth={4} />
              </div>
              <h2 className="text-3xl font-bold text-brand-navy mb-4">
                You're all set, {formData.name.split(' ')[0]}.
              </h2>
              <p className="text-brand-slate text-lg max-w-md mx-auto mb-8">
                Before we enter the workspace, let's run a quick AI audit on your
                current reach potential.
              </p>

              <button
                onClick={() => {
                  onClose();
                  window.location.href = '/dashboard';
                }}
                className="w-full max-w-sm mx-auto group relative flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-tr from-[#FFB648] via-[#E1306C] to-[#833AB4] text-white font-bold text-lg rounded-xl hover:shadow-xl hover:shadow-pink-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Instagram size={24} />
                <span>Connect Instagram</span>
              </button>

              <button
                onClick={goToDashboard}
                className="mt-6 text-slate-400 font-medium hover:text-brand-navy text-sm"
              >
                Skip for now, take me to the editor
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
