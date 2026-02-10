import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '../contexts/UserProfileContext';

type UserType = 'youtube' | 'instagram' | 'business' | '';

type OnboardingState = {
  userType: UserType;
  name?: string;
  email?: string;
  niche?: string;
  struggle?: string;
  style?: string;
  goal?: string;
  offer?: string;
  audience?: string;
  videoLength?: string;
  subscribers?: string;
  reelViews?: string;
  postFrequency?: string;
  companyName?: string;
  brandVoice?: string[];
  contentBudget?: string;
  platforms?: string[];
};

const cardBase =
  'w-full text-left rounded-2xl border border-slate-200 bg-white px-6 py-5 text-slate-900 transition hover:border-blue-300 hover:bg-blue-50/60';
const cardSelected =
  'border-blue-400 bg-blue-50 ring-2 ring-blue-500/25 shadow-sm';

const steps = {
  identity: 'identity',
  deepDive: 'deepDive',
  magic: 'magic'
} as const;

type StepKey = (typeof steps)[keyof typeof steps];

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { updateProfile } = useUserProfile();
  const [step, setStep] = useState<StepKey>(steps.identity);
  const [state, setState] = useState<OnboardingState>({ userType: '' });

  const updateState = (patch: Partial<OnboardingState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  };

  const goNext = (nextStep: StepKey) => {
    setStep(nextStep);
  };

  const saveAndExit = () => {
    // Save to UserProfileContext
    updateProfile({
      ...state,
      completedAt: new Date().toISOString()
    });
    
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  const isIdentityComplete = state.userType !== '';

  const deepDiveContent = useMemo(() => {
    if (state.userType === 'youtube') {
      return (
        <div className="space-y-10">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">What&apos;s your Niche?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Tech', 'Lifestyle', 'Gaming', 'Cooking', 'Education', 'Fitness'].map((option) => (
                  <button
                    key={option}
                    className={`${cardBase} ${
                      state.niche === option.toLowerCase() ? cardSelected : ''
                    }`}
                    aria-pressed={state.niche === option.toLowerCase()}
                    onClick={() => updateState({ niche: option.toLowerCase() })}
                  >
                  <div className="text-lg font-semibold">{option}</div>
                  <div className="text-xs text-slate-500 mt-2">Primary channel focus</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">What&apos;s your current struggle?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['CTR', 'Retention', 'Ideation'].map((option) => (
                  <button
                    key={option}
                    className={`${cardBase} ${
                      state.struggle === option.toLowerCase() ? cardSelected : ''
                    }`}
                    aria-pressed={state.struggle === option.toLowerCase()}
                    onClick={() => updateState({ struggle: option.toLowerCase() })}
                  >
                  <div className="text-lg font-semibold">{option}</div>
                  <div className="text-xs text-slate-500 mt-2">Biggest friction point</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Average video length?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['< 60s', '1-5 min', '10+ min'].map((option) => (
                  <button
                    key={option}
                    className={`${cardBase} ${
                      state.videoLength === option ? cardSelected : ''
                    }`}
                    aria-pressed={state.videoLength === option}
                    onClick={() => updateState({ videoLength: option })}
                  >
                  <div className="text-lg font-semibold">{option}</div>
                  <div className="text-xs text-slate-500 mt-2">Typical format</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Subscriber count?</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['< 1K', '1-10K', '10-100K', '100K+'].map((option) => (
                  <button
                    key={option}
                    className={`${cardBase} ${
                      state.subscribers === option ? cardSelected : ''
                    }`}
                    aria-pressed={state.subscribers === option}
                    onClick={() => updateState({ subscribers: option })}
                  >
                  <div className="text-lg font-semibold">{option}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (state.userType === 'instagram') {
      return (
        <div className="space-y-10">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">What&apos;s your content style?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Talking Head', 'Aesthetic', 'Skits', 'Vlogs'].map((option) => (
                  <button
                    key={option}
                    className={`${cardBase} ${
                      state.style === option.toLowerCase() ? cardSelected : ''
                    }`}
                    aria-pressed={state.style === option.toLowerCase()}
                    onClick={() => updateState({ style: option.toLowerCase() })}
                  >
                  <div className="text-lg font-semibold">{option}</div>
                  <div className="text-xs text-slate-500 mt-2">Signature format</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Goal?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Viral Reach', 'Community', 'Monetization'].map((option) => (
                  <button
                    key={option}
                    className={`${cardBase} ${
                      state.goal === option.toLowerCase().replace(' ', '-')
                        ? cardSelected
                        : ''
                    }`}
                    aria-pressed={state.goal === option.toLowerCase().replace(' ', '-')}
                    onClick={() => updateState({ goal: option.toLowerCase().replace(' ', '-') })}
                  >
                  <div className="text-lg font-semibold">{option}</div>
                  <div className="text-xs text-slate-500 mt-2">Primary outcome</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Average Reel views?</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['< 1K', '1-10K', '10-100K', '100K+'].map((option) => (
                  <button
                    key={option}
                    className={`${cardBase} ${
                      state.reelViews === option ? cardSelected : ''
                    }`}
                    aria-pressed={state.reelViews === option}
                    onClick={() => updateState({ reelViews: option })}
                  >
                  <div className="text-lg font-semibold">{option}</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Post frequency?</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Daily', '3-5x week', 'Weekly', 'Sporadic'].map((option) => (
                  <button
                    key={option}
                    className={`${cardBase} ${
                      state.postFrequency === option ? cardSelected : ''
                    }`}
                    aria-pressed={state.postFrequency === option}
                    onClick={() => updateState({ postFrequency: option })}
                  >
                  <div className="text-lg font-semibold">{option}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (state.userType === 'business') {
      return (
        <div className="space-y-10">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Company Name</h2>
            <input
              value={state.companyName || ''}
              onChange={(event) => updateState({ companyName: event.target.value })}
              placeholder="e.g., Acme Inc."
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">What are you selling?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['SaaS', 'Physical Product', 'Service'].map((option) => (
                  <button
                    key={option}
                    className={`${cardBase} ${
                      state.offer === option.toLowerCase().replace(' ', '-')
                        ? cardSelected
                        : ''
                    }`}
                    aria-pressed={state.offer === option.toLowerCase().replace(' ', '-')}
                    onClick={() => updateState({ offer: option.toLowerCase().replace(' ', '-') })}
                  >
                  <div className="text-lg font-semibold">{option}</div>
                  <div className="text-xs text-slate-500 mt-2">Offer category</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Brand Voice</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Professional', 'Casual', 'Edgy', 'Luxury'].map((option) => {
                const selected = state.brandVoice?.includes(option) || false;
                return (
                  <button
                    key={option}
                    className={`${cardBase} ${selected ? cardSelected : ''}`}
                    aria-pressed={selected}
                    onClick={() => {
                      const current = state.brandVoice || [];
                      const updated = current.includes(option)
                        ? current.filter(v => v !== option)
                        : [...current, option];
                      updateState({ brandVoice: updated });
                    }}
                  >
                    <div className="text-lg font-semibold">{option}</div>
                    <div className="text-xs text-slate-500 mt-2">Select 1-2</div>
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Target Audience</h2>
            <input
              value={state.audience || ''}
              onChange={(event) => updateState({ audience: event.target.value })}
              placeholder="e.g., mid-market SaaS founders"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Monthly content budget?</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Bootstrap', '$1-5K', '$5-25K', '$25K+'].map((option) => (
                  <button
                    key={option}
                    className={`${cardBase} ${
                      state.contentBudget === option ? cardSelected : ''
                    }`}
                    aria-pressed={state.contentBudget === option}
                    onClick={() => updateState({ contentBudget: option })}
                  >
                  <div className="text-lg font-semibold">{option}</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Active platforms?</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Instagram', 'YouTube', 'TikTok', 'LinkedIn'].map((option) => {
                const selected = state.platforms?.includes(option) || false;
                return (
                  <button
                    key={option}
                    className={`${cardBase} ${selected ? cardSelected : ''}`}
                    aria-pressed={selected}
                    onClick={() => {
                      const current = state.platforms || [];
                      const updated = current.includes(option)
                        ? current.filter(p => p !== option)
                        : [...current, option];
                      updateState({ platforms: updated });
                    }}
                  >
                    <div className="text-lg font-semibold">{option}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    return null;
  }, [state]);

  const readyForMagic = useMemo(() => {
    if (state.userType === 'youtube') {
      return Boolean(state.niche && state.struggle && state.videoLength && state.subscribers);
    }
    if (state.userType === 'instagram') {
      return Boolean(state.style && state.goal && state.reelViews && state.postFrequency);
    }
    if (state.userType === 'business') {
      return Boolean(state.companyName && state.offer && state.audience && state.brandVoice?.length && state.contentBudget && state.platforms?.length);
    }
    return false;
  }, [state]);

  return (
    <div className="min-h-screen bg-white text-slate-900 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-4xl">
        <AnimatePresence mode="wait">
          {step === steps.identity && (
            <motion.div
              key="identity"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="space-y-8"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-blue-600 font-semibold">
                  Smart Strategy Onboarding
                </p>
                <h1 className="text-3xl md:text-4xl font-semibold mt-4">
                  First, how do you identify?
                </h1>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'Creator (YouTube)', value: 'youtube' },
                  { label: 'Creator (Instagram)', value: 'instagram' },
                  { label: 'Business / Brand', value: 'business' }
                ].map((option) => (
                  <button
                    key={option.value}
                    className={`${cardBase} ${
                      state.userType === option.value ? cardSelected : ''
                    }`}
                    aria-pressed={state.userType === option.value}
                    onClick={() => updateState({ userType: option.value as UserType })}
                  >
                    <div className="text-lg font-semibold">{option.label}</div>
                    <div className="text-xs text-slate-500 mt-2">Select your primary mode</div>
                  </button>
                ))}
              </div>
              <div className="flex justify-end">
                <button
                  disabled={!isIdentityComplete}
                  onClick={() => goNext(steps.deepDive)}
                  className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-40"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          )}

          {step === steps.deepDive && (
            <motion.div
              key="deepDive"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="space-y-8"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-blue-600 font-semibold">
                  Deep Dive
                </p>
                <h1 className="text-3xl md:text-4xl font-semibold mt-4">
                  Let&apos;s calibrate your strategy.
                </h1>
              </div>
              {deepDiveContent}
              <div className="flex justify-between">
                <button
                  onClick={() => goNext(steps.identity)}
                  className="rounded-xl border border-slate-200 px-6 py-3 text-sm text-slate-600 hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  disabled={!readyForMagic}
                  onClick={() => {
                    localStorage.setItem('prolytic:onboarding', JSON.stringify(state));
                    goNext(steps.magic);
                    saveAndExit();
                  }}
                  className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-40"
                >
                  Initialize Strategy
                </button>
              </div>
            </motion.div>
          )}

          {step === steps.magic && (
            <motion.div
              key="magic"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="text-center space-y-6"
            >
              <div className="text-xs uppercase tracking-[0.35em] text-blue-600 font-semibold">
                Magic Setup
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold text-slate-900">Initializing AI Strategy...</h1>
              <div className="w-20 h-20 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mx-auto" />
              <p className="text-sm text-slate-500">
                Calibrating narrative heuristics and retention benchmarks.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
