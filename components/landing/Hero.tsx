import React from 'react';
import { TrendingUp, CheckCircle2, ChevronRight, Zap } from 'lucide-react';

interface HeroProps {
  onOpenModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenModal }) => {
  return (
    <section className="pt-24 pb-32 md:pt-32 md:pb-40 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-6xl mx-auto text-center mb-24">
          <h1 className="font-display text-5xl md:text-7xl font-black text-brand-navy tracking-tighter leading-[1.1] mb-8 text-balance">
            Get Cinematic Captions and{' '}
            <span className="text-brand-blue relative inline-block whitespace-nowrap">
              Viral Reach
              <svg
                className="absolute w-full h-3 -bottom-1 left-0 text-blue-100 -z-10"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 5 Q 50 10 100 5"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                />
              </svg>
            </span>{' '}
            in One Click.
          </h1>
          <p className="text-xl md:text-2xl text-brand-slate max-w-3xl mx-auto mb-12 leading-relaxed font-light">
            The only AI-native workspace that predicts your video's retention and
            automates professional-grade captions.
          </p>

          <div className="max-w-lg mx-auto relative flex flex-col items-center">
            <button
              onClick={onOpenModal}
              className="w-full md:w-auto px-10 py-5 bg-brand-blue hover:bg-blue-700 text-white font-bold text-xl rounded-xl transition-all shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
            >
              Build Your First Viral Clip{' '}
              <ChevronRight size={24} strokeWidth={3} />
            </button>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-slate-500">
              <span className="flex items-center gap-2">
                <div className="bg-green-100 p-0.5 rounded-full">
                  <CheckCircle2 size={14} className="text-green-600" />
                </div>
                No credit card required
              </span>
              <span className="flex items-center gap-2">
                <div className="bg-green-100 p-0.5 rounded-full">
                  <CheckCircle2 size={14} className="text-green-600" />
                </div>
                14-day free trial
              </span>
            </div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto mb-24">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-50/50 blur-3xl rounded-[100px] -z-10"></div>

          <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-2xl shadow-slate-300/50 bg-brand-navy aspect-[16/10] md:aspect-[21/9] flex group">
            <div className="relative w-1/2 h-full overflow-hidden border-r border-white/10 bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop"
                alt="Raw footage"
                className="absolute inset-0 w-full h-full object-cover grayscale opacity-50"
              />
              <div className="absolute top-8 left-8 bg-black/40 backdrop-blur-md text-white/60 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest border border-white/10 z-10 font-mono">
                RAW INPUT
              </div>
              <div className="absolute bottom-12 left-8 right-8 h-16 flex items-center gap-1.5 opacity-20 z-10">
                {[...Array(25)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 bg-white rounded-full transition-all duration-1000"
                    style={{ height: `${30 + Math.random() * 70}%` }}
                  ></div>
                ))}
              </div>
            </div>

            <div className="relative w-1/2 h-full overflow-hidden bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop"
                alt="Processed footage"
                className="absolute inset-0 w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

              <div className="absolute top-8 right-8 bg-brand-blue text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-xl shadow-blue-900/50 flex items-center gap-2 z-10 tracking-wide">
                <Zap size={14} fill="currentColor" /> PROLYTIC ENHANCED
              </div>

              <div className="absolute inset-0 flex items-center justify-center z-10 px-8">
                <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl text-center leading-[0.9]">
                  Maximum <br />
                  <span className="text-brand-blue">Retention</span>
                </h2>
              </div>

              <div className="absolute bottom-10 right-10 bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl w-56 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 z-10 shadow-2xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-white/80 font-bold uppercase tracking-wider">
                    Virality Score
                  </span>
                  <span className="text-sm text-green-400 font-black">98</span>
                </div>
                <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-brand-blue to-green-400 w-[98%]"></div>
                </div>
                <div className="mt-4 flex items-center gap-2.5">
                  <div className="p-1 rounded-full bg-green-500/20 text-green-400">
                    <TrendingUp size={14} strokeWidth={3} />
                  </div>
                  <span className="text-xs font-bold text-white">+450% Reach</span>
                </div>
              </div>
            </div>

            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/20 z-20 hidden md:block">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center cursor-col-resize hover:scale-110 transition-transform">
                <div className="flex gap-1">
                  <div className="w-0.5 h-4 bg-slate-300"></div>
                  <div className="w-0.5 h-4 bg-slate-300"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8">
          <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-10">
            Trusted by teams at
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 hover:opacity-100 transition-opacity duration-500 grayscale">
            <span className="text-2xl font-black text-brand-navy tracking-tight">
              Google
            </span>
            <span className="text-2xl font-black text-brand-navy tracking-tighter">
              Meta
            </span>
            <span className="text-2xl font-black text-brand-navy tracking-widest">
              Adobe
            </span>
            <span className="text-2xl font-black text-brand-navy tracking-wide">
              NETFLIX
            </span>
            <span className="text-2xl font-black text-brand-navy italic">
              Spotify
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
