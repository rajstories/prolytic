import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '../contexts/UserProfileContext';
import { ArrowLeft, BarChart3, Brain, Lightbulb, Megaphone, Target } from 'lucide-react';

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

const steps = {
  identity: 'identity',
  deepDive: 'deepDive',
  magic: 'magic',
} as const;

type StepKey = (typeof steps)[keyof typeof steps];

/* ─── EASE for all framer motion ─────────────────────────────── */
const ease = [0.22, 1, 0.36, 1];

/* ─── Right‑panel images per context ─────────────────────────── */
const heroImages = {
  identity: [
    'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=640&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=640&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551434678-e076c223a692?w=640&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=640&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=640&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=640&q=80&auto=format&fit=crop',
  ],
  youtube: [
    'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=640&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=640&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=640&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=640&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=640&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=640&q=80&auto=format&fit=crop',
  ],
  instagram: [
    'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=640&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=640&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1585247226801-bc613c441316?w=640&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=640&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=640&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=640&q=80&auto=format&fit=crop',
  ],
  business: [
    'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=640&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=640&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=640&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=640&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=640&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551434678-e076c223a692?w=640&q=80&auto=format&fit=crop',
  ],
};

/* ─── Testimonials (real avatar photos) ──────────────────────── */
const testimonials = {
  youtube: {
    quote:
      'Prolytic completely changed how I approach content. My average retention jumped from 42% to 71% — the script analyzer alone is worth it.',
    author: 'Sarah Chen',
    role: 'Tech YouTuber · 250K subs',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&auto=format&fit=crop',
  },
  instagram: {
    quote:
      "I stopped guessing and started strategizing. Prolytic's AI turned my random posting into a growth engine — 5K to 50K in 8 weeks.",
    author: 'Marcus Rivera',
    role: 'Lifestyle Creator',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&auto=format&fit=crop',
  },
  business: {
    quote:
      'Our content planning went from 2 weeks to 2 hours. The campaign builder thinks like a strategist, not a template.',
    author: 'Jennifer Park',
    role: 'CMO, TechFlow SaaS',
    avatar:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&auto=format&fit=crop',
  },
};

/* ─── Magic‑step feature cards ───────────────────────────────── */
const featureCards = [
  { icon: Lightbulb, title: 'Generate viral ideas', gradient: 'from-amber-600/80 to-orange-700/80', img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&q=80&auto=format&fit=crop' },
  { icon: Brain, title: 'Analyze your scripts', gradient: 'from-violet-600/80 to-purple-700/80', img: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&q=80&auto=format&fit=crop' },
  { icon: Target, title: 'Simulate your audience', gradient: 'from-sky-600/80 to-blue-700/80', img: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&q=80&auto=format&fit=crop' },
  { icon: Megaphone, title: 'Build campaigns', gradient: 'from-emerald-600/80 to-green-700/80', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80&auto=format&fit=crop' },
  { icon: BarChart3, title: 'Track performance', gradient: 'from-rose-600/80 to-pink-700/80', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80&auto=format&fit=crop' },
];

/* ─── Stepper labels ─────────────────────────────────────────── */
const progressSteps = [
  { key: 'identity', label: 'PROFILE' },
  { key: 'deepDive', label: 'STRATEGY' },
  { key: 'magic', label: 'LAUNCH' },
];

/* ═════════════════════════════════════════════════════════════════
   COMPONENT
   ═════════════════════════════════════════════════════════════════ */
export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { updateProfile } = useUserProfile();
  const [step, setStep] = useState<StepKey>(steps.identity);
  const [state, setState] = useState<OnboardingState>({ userType: '' });

  const set = (patch: Partial<OnboardingState>) =>
    setState((p) => ({ ...p, ...patch }));

  const goNext = (s: StepKey) => setStep(s);

  const saveAndExit = () => {
    updateProfile({ ...state, completedAt: new Date().toISOString() });
    setTimeout(() => navigate('/dashboard'), 2400);
  };

  const stepIdx = step === 'identity' ? 0 : step === 'deepDive' ? 1 : 2;
  const identityOk = state.userType !== '';

  const testimonial =
    state.userType && state.userType !== ''
      ? testimonials[state.userType as keyof typeof testimonials]
      : testimonials.youtube;

  const images =
    state.userType && state.userType !== ''
      ? heroImages[state.userType as keyof typeof heroImages]
      : heroImages.identity;

  /* ── Chip‑style classes (Wispr‑like) ──────────────────────── */
  const chip =
    'inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-medium tracking-wide transition-all cursor-pointer select-none';
  const chipOn = 'bg-[#1a1a2e] text-white shadow-lg shadow-slate-900/10';
  const chipOff =
    'bg-white text-[#1a1a2e] border border-[#e2ddd5] hover:border-[#1a1a2e]/30 hover:shadow-sm';
  const label = 'text-[15px] font-semibold text-[#1a1a2e] tracking-tight mb-3';

  /* ── Deep dive content ────────────────────────────────────── */
  const deepDiveContent = useMemo(() => {
    if (state.userType === 'youtube') {
      return (
        <div className="space-y-10">
          <div>
            <p className={label}>What's your niche?</p>
            <div className="flex flex-wrap gap-2.5">
              {[
                { l: '🎮 Gaming', v: 'gaming' },
                { l: '💻 Tech', v: 'tech' },
                { l: '🎬 Lifestyle', v: 'lifestyle' },
                { l: '🍳 Cooking', v: 'cooking' },
                { l: '📚 Education', v: 'education' },
                { l: '💪 Fitness', v: 'fitness' },
              ].map((o) => (
                <button key={o.v} className={`${chip} ${state.niche === o.v ? chipOn : chipOff}`} onClick={() => set({ niche: o.v })}>
                  {o.l}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className={label}>What's your biggest struggle?</p>
            <div className="flex flex-wrap gap-2.5">
              {[
                { l: '📉 Low CTR', v: 'ctr' },
                { l: '⏳ Retention drops', v: 'retention' },
                { l: '💡 Running out of ideas', v: 'ideation' },
              ].map((o) => (
                <button key={o.v} className={`${chip} ${state.struggle === o.v ? chipOn : chipOff}`} onClick={() => set({ struggle: o.v })}>
                  {o.l}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className={label}>Average video length</p>
            <div className="flex flex-wrap gap-2.5">
              {['< 60s', '1-5 min', '10+ min'].map((o) => (
                <button key={o} className={`${chip} ${state.videoLength === o ? chipOn : chipOff}`} onClick={() => set({ videoLength: o })}>
                  {o}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className={label}>Subscriber count</p>
            <div className="flex flex-wrap gap-2.5">
              {['< 1K', '1-10K', '10-100K', '100K+'].map((o) => (
                <button key={o} className={`${chip} ${state.subscribers === o ? chipOn : chipOff}`} onClick={() => set({ subscribers: o })}>
                  {o}
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
            <p className={label}>Content style</p>
            <div className="flex flex-wrap gap-2.5">
              {[
                { l: '🎙 Talking Head', v: 'talking-head' },
                { l: '✨ Aesthetic', v: 'aesthetic' },
                { l: '🎭 Skits', v: 'skits' },
                { l: '📹 Vlogs', v: 'vlogs' },
              ].map((o) => (
                <button key={o.v} className={`${chip} ${state.style === o.v ? chipOn : chipOff}`} onClick={() => set({ style: o.v })}>
                  {o.l}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className={label}>Primary goal</p>
            <div className="flex flex-wrap gap-2.5">
              {[
                { l: '🚀 Viral Reach', v: 'viral-reach' },
                { l: '❤️ Community', v: 'community' },
                { l: '💰 Monetization', v: 'monetization' },
              ].map((o) => (
                <button key={o.v} className={`${chip} ${state.goal === o.v ? chipOn : chipOff}`} onClick={() => set({ goal: o.v })}>
                  {o.l}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className={label}>Average Reel views</p>
            <div className="flex flex-wrap gap-2.5">
              {['< 1K', '1-10K', '10-100K', '100K+'].map((o) => (
                <button key={o} className={`${chip} ${state.reelViews === o ? chipOn : chipOff}`} onClick={() => set({ reelViews: o })}>
                  {o}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className={label}>Post frequency</p>
            <div className="flex flex-wrap gap-2.5">
              {['Daily', '3-5x week', 'Weekly', 'Sporadic'].map((o) => (
                <button key={o} className={`${chip} ${state.postFrequency === o ? chipOn : chipOff}`} onClick={() => set({ postFrequency: o })}>
                  {o}
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
            <p className={label}>Company name</p>
            <input
              value={state.companyName || ''}
              onChange={(e) => set({ companyName: e.target.value })}
              placeholder="e.g. Acme Inc."
              className="w-full rounded-xl border border-[#e2ddd5] bg-white px-4 py-3 text-sm text-[#1a1a2e] placeholder:text-[#a09d93] focus:outline-none focus:border-[#1a1a2e] focus:ring-2 focus:ring-[#1a1a2e]/5 transition"
            />
          </div>
          <div>
            <p className={label}>What are you selling?</p>
            <div className="flex flex-wrap gap-2.5">
              {[
                { l: '🖥 SaaS', v: 'saas' },
                { l: '📦 Physical Product', v: 'physical-product' },
                { l: '🤝 Service', v: 'service' },
              ].map((o) => (
                <button key={o.v} className={`${chip} ${state.offer === o.v ? chipOn : chipOff}`} onClick={() => set({ offer: o.v })}>
                  {o.l}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className={label}>
              Brand voice <span className="text-[#a09d93] font-normal">(pick 1-2)</span>
            </p>
            <div className="flex flex-wrap gap-2.5">
              {['Professional', 'Casual', 'Edgy', 'Luxury'].map((o) => {
                const on = state.brandVoice?.includes(o) || false;
                return (
                  <button
                    key={o}
                    className={`${chip} ${on ? chipOn : chipOff}`}
                    onClick={() => {
                      const c = state.brandVoice || [];
                      set({ brandVoice: c.includes(o) ? c.filter((v) => v !== o) : [...c, o] });
                    }}
                  >
                    {o}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <p className={label}>Target audience</p>
            <input
              value={state.audience || ''}
              onChange={(e) => set({ audience: e.target.value })}
              placeholder="e.g. mid-market SaaS founders"
              className="w-full rounded-xl border border-[#e2ddd5] bg-white px-4 py-3 text-sm text-[#1a1a2e] placeholder:text-[#a09d93] focus:outline-none focus:border-[#1a1a2e] focus:ring-2 focus:ring-[#1a1a2e]/5 transition"
            />
          </div>
          <div>
            <p className={label}>Monthly content budget</p>
            <div className="flex flex-wrap gap-2.5">
              {['Bootstrap', '$1-5K', '$5-25K', '$25K+'].map((o) => (
                <button key={o} className={`${chip} ${state.contentBudget === o ? chipOn : chipOff}`} onClick={() => set({ contentBudget: o })}>
                  {o}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className={label}>Active platforms</p>
            <div className="flex flex-wrap gap-2.5">
              {['Instagram', 'YouTube', 'TikTok', 'LinkedIn'].map((o) => {
                const on = state.platforms?.includes(o) || false;
                return (
                  <button
                    key={o}
                    className={`${chip} ${on ? chipOn : chipOff}`}
                    onClick={() => {
                      const c = state.platforms || [];
                      set({ platforms: c.includes(o) ? c.filter((p) => p !== o) : [...c, o] });
                    }}
                  >
                    {o}
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
    if (state.userType === 'youtube')
      return Boolean(state.niche && state.struggle && state.videoLength && state.subscribers);
    if (state.userType === 'instagram')
      return Boolean(state.style && state.goal && state.reelViews && state.postFrequency);
    if (state.userType === 'business')
      return Boolean(
        state.companyName && state.offer && state.audience && state.brandVoice?.length && state.contentBudget && state.platforms?.length,
      );
    return false;
  }, [state]);

  const canContinue = step === steps.identity ? identityOk : readyForMagic;

  /* ═══════════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen flex" style={{ background: '#faf8f5' }}>
      {/* ── Top stepper ────────────────────────────────────────── */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-0 px-6 py-4 ${step === steps.magic ? 'hidden' : ''}`}
        style={{ background: 'rgba(250,248,245,0.85)', backdropFilter: 'blur(12px)' }}
      >
        {progressSteps.map((s, i) => {
          const done = i < stepIdx;
          const active = i === stepIdx;
          return (
            <React.Fragment key={s.key}>
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                    done || active ? 'bg-[#1a1a2e] text-white' : 'bg-[#e2ddd5] text-[#a09d93]'
                  }`}
                >
                  {done ? '✓' : i + 1}
                </div>
                <span
                  className={`text-[11px] font-semibold tracking-[0.14em] transition-colors ${
                    active || done ? 'text-[#1a1a2e]' : 'text-[#a09d93]'
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < progressSteps.length - 1 && (
                <div className={`w-16 h-px mx-3 transition-colors ${i < stepIdx ? 'bg-[#1a1a2e]' : 'bg-[#e2ddd5]'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* ── LEFT PANEL ─────────────────────────────────────────── */}
      <div className={`w-full lg:w-[48%] min-h-screen flex flex-col ${step === steps.magic ? 'hidden' : ''}`} style={{ background: '#faf8f5' }}>
        <div className="flex-1 flex flex-col px-8 lg:px-16 pt-24 pb-10 max-w-[540px] mx-auto w-full">
          {/* Back */}
          {step === steps.deepDive && (
            <motion.button
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => goNext(steps.identity)}
              className="self-start mb-10 flex items-center gap-2 text-[#a09d93] hover:text-[#1a1a2e] transition group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              <span className="text-[13px] font-medium tracking-wide">Back</span>
            </motion.button>
          )}

          {/* Questions */}
          <div className="flex-1 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {/* ── STEP 1 ──────────────────────────────────────── */}
              {step === steps.identity && (
                <motion.div
                  key="identity"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.45, ease }}
                  className="space-y-10"
                >
                  <div>
                    <h1
                      className="text-[2.5rem] lg:text-[3.1rem] font-bold leading-[1.08] tracking-tight"
                      style={{ color: '#1a1a2e' }}
                    >
                      How do you
                      <br />
                      create content?
                    </h1>
                    <p className="mt-4 text-[15px] leading-relaxed" style={{ color: '#6b6966' }}>
                      Pick the option that best describes you.
                      <br className="hidden lg:block" /> We'll tailor everything from here.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {[
                      { label: 'YouTube Creator', value: 'youtube', emoji: '📺', desc: 'Long-form, Shorts, podcasts' },
                      { label: 'Instagram Creator', value: 'instagram', emoji: '📸', desc: 'Reels, stories, carousels' },
                      { label: 'Business / Brand', value: 'business', emoji: '🏢', desc: 'Marketing, campaigns, ads' },
                    ].map((o) => (
                      <button
                        key={o.value}
                        onClick={() => set({ userType: o.value as UserType })}
                        className={`w-full flex items-center gap-5 rounded-2xl px-6 py-5 text-left transition-all border-2 ${
                          state.userType === o.value
                            ? 'bg-[#1a1a2e] text-white border-[#1a1a2e] shadow-xl shadow-slate-900/10'
                            : 'bg-white text-[#1a1a2e] border-[#e2ddd5] hover:border-[#1a1a2e]/20 hover:shadow-md'
                        }`}
                      >
                        <span className="text-3xl">{o.emoji}</span>
                        <div>
                          <span className="text-[15px] font-semibold block">{o.label}</span>
                          <span
                            className={`text-[13px] mt-0.5 block ${
                              state.userType === o.value ? 'text-white/60' : 'text-[#a09d93]'
                            }`}
                          >
                            {o.desc}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ── STEP 2 ──────────────────────────────────────── */}
              {step === steps.deepDive && (
                <motion.div
                  key="deepDive"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.45, ease }}
                  className="space-y-8"
                >
                  <div>
                    <h1
                      className="text-[2.5rem] lg:text-[3.1rem] font-bold leading-[1.08] tracking-tight"
                      style={{ color: '#1a1a2e' }}
                    >
                      Which of these
                      <br />
                      sound like you?
                    </h1>
                    <p className="mt-4 text-[15px] leading-relaxed" style={{ color: '#6b6966' }}>
                      Pick what feels right — we'll calibrate your AI workspace.
                    </p>
                  </div>
                  <div className="max-h-[52vh] overflow-y-auto pr-2 custom-scrollbar">{deepDiveContent}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Continue */}
          {step !== steps.magic && (
            <div className="pt-6 pb-2">
              <button
                disabled={!canContinue}
                onClick={() => {
                  if (step === steps.identity) {
                    goNext(steps.deepDive);
                    return;
                  }
                  localStorage.setItem('prolytic:onboarding', JSON.stringify(state));
                  goNext(steps.magic);
                  saveAndExit();
                }}
                className="rounded-xl px-8 py-4 text-[15px] font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  background: canContinue ? '#1a1a2e' : '#d4d0c8',
                  color: canContinue ? '#fff' : '#8a8780',
                }}
              >
                Continue
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT PANEL ────────────────────────────────────────── */}
      <div className={`hidden lg:w-[52%] min-h-screen relative overflow-hidden ${step === steps.magic ? '' : 'lg:block'}`} style={{ background: '#f0ece4' }}>
        <AnimatePresence mode="wait">
          {/* ── Identity / Deep dive visual ────────────────────── */}
          {step !== steps.magic && (
            <motion.div
              key={`visual-${step}-${state.userType}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-12"
            >
              {/* Dot pattern */}
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: 'radial-gradient(circle at 1px 1px, #1a1a2e 1px, transparent 0)',
                  backgroundSize: '32px 32px',
                }}
              />

              {/* Image grid — Wispr‑style floating cards */}
              <div className="relative w-full max-w-lg mb-10">
                <div className="grid grid-cols-3 gap-3 auto-rows-[120px]">
                  {images.slice(0, 6).map((src, i) => (
                    <motion.div
                      key={src}
                      initial={{ opacity: 0, y: 20, scale: 0.92 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.08 + i * 0.07, duration: 0.6, ease }}
                      className={`rounded-2xl overflow-hidden shadow-lg ${i === 1 ? 'row-span-2' : ''} ${
                        i === 4 ? 'col-span-2' : ''
                      }`}
                    >
                      <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Testimonial card */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="bg-white rounded-3xl p-8 max-w-md shadow-xl shadow-black/5 relative border border-[#e8e4db]"
              >
                <div className="absolute -top-7 left-1/2 -translate-x-1/2">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="w-14 h-14 rounded-full object-cover ring-4 ring-white shadow-lg"
                  />
                </div>

                <p
                  className="text-center text-[15px] leading-[1.75] font-medium mt-4 mb-5"
                  style={{ color: '#1a1a2e', fontFamily: 'Georgia, "Times New Roman", serif' }}
                >
                  "{testimonial.quote}"
                </p>

                <p className="text-center text-[13px] font-medium" style={{ color: '#a09d93' }}>
                  — {testimonial.author}, {testimonial.role}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ══════════════════════════════════════════════════════════
          FULL‑SCREEN MAGIC / LAUNCH — Wispr "Personalizing" style
          ══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {step === steps.magic && (
          <motion.div
            key="magic-fullscreen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
            style={{ background: '#faf8f5' }}
          >
            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7, ease }}
              className="text-[2rem] md:text-[2.6rem] font-bold tracking-tight text-center mb-12 relative z-10"
              style={{ color: '#1a1a2e' }}
            >
              Personalizing Prolytic for you…
            </motion.h2>

            {/* Sliding carousel — edge‑to‑edge */}
            <div className="relative w-full overflow-hidden">
              {/* Fade edges */}
              <div className="absolute left-0 top-0 bottom-0 w-32 z-10" style={{ background: 'linear-gradient(to right, #faf8f5, transparent)' }} />
              <div className="absolute right-0 top-0 bottom-0 w-32 z-10" style={{ background: 'linear-gradient(to left, #faf8f5, transparent)' }} />

              <motion.div
                className="flex gap-5 px-8"
                animate={{ x: ['0%', '-50%'] }}
                transition={{ duration: 20, ease: 'linear', repeat: Infinity }}
              >
                {/* Double the cards for seamless loop */}
                {[...featureCards, ...featureCards].map((f, i) => (
                  <motion.div
                    key={`${f.title}-${i}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + (i % featureCards.length) * 0.1, duration: 0.7, ease }}
                    className="w-[220px] md:w-[260px] flex-shrink-0 rounded-3xl overflow-hidden relative aspect-[3/4] shadow-xl shadow-black/10"
                  >
                    <img src={f.img} alt="" className="w-full h-full object-cover" loading="lazy" />
                    <div className={`absolute inset-0 bg-gradient-to-t ${f.gradient}`} />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p
                        className="text-white text-[1.15rem] md:text-[1.35rem] font-bold leading-snug"
                        style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                      >
                        {f.title}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Audio wave / loading indicator */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="mt-12 flex items-center justify-center"
            >
              <div className="flex items-center gap-[3px] bg-[#1a1a2e] rounded-full px-5 py-3">
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                  <motion.div
                    key={i}
                    className="w-[3px] rounded-full bg-white"
                    animate={{
                      height: ['8px', `${14 + Math.random() * 10}px`, '8px'],
                    }}
                    transition={{
                      duration: 0.6 + Math.random() * 0.4,
                      repeat: Infinity,
                      delay: i * 0.08,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
