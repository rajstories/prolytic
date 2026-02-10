import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export type ShadowThought = {
  timestamp: number;
  persona: string;
  comment: string;
  sentiment: 'positive' | 'negative' | 'neutral';
};

type ShadowPlayerProps = {
  videoSrc: string;
  thoughts: ShadowThought[];
};

const personaBorder: Record<string, string> = {
  'Gen Z': 'border-pink-400',
  'Boomer': 'border-amber-400',
  'Tech Bro': 'border-cyan-400',
  'Busy Mom': 'border-emerald-400',
  'Gen Z Skeptic': 'border-fuchsia-400'
};

export const ShadowPlayer: React.FC<ShadowPlayerProps> = ({ videoSrc, thoughts }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [currentSecond, setCurrentSecond] = useState(0);

  const sortedThoughts = useMemo(
    () => [...thoughts].sort((a, b) => a.timestamp - b.timestamp),
    [thoughts]
  );

  useEffect(() => {
    setCurrentSecond(0);
  }, [thoughts]);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const nextSecond = Math.floor(videoRef.current.currentTime);
    setCurrentSecond((prev) => (prev === nextSecond ? prev : nextSecond));
  };

  const activeThoughts = sortedThoughts.filter(
    (t) => t.timestamp >= currentSecond && t.timestamp < currentSecond + 1
  );

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <video
        ref={videoRef}
        src={videoSrc}
        controls
        onTimeUpdate={handleTimeUpdate}
        className="w-full h-auto bg-black"
      />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute right-4 top-4 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-600 shadow-sm">
          Demo Mode
        </div>
        <div className="absolute right-6 top-6 flex flex-col gap-3">
          <AnimatePresence mode="popLayout">
            {activeThoughts.map((thought) => (
              <motion.div
                key={`${thought.persona}-${thought.timestamp}`}
                initial={{ opacity: 0, x: 80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 80 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className={`max-w-xs rounded-xl border-l-4 ${
                  personaBorder[thought.persona] ?? 'border-slate-500'
                } bg-white/90 px-4 py-3 text-sm text-slate-900 shadow-xl backdrop-blur`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs uppercase tracking-wide text-slate-500">
                    {thought.persona}
                  </span>
                  <span className="text-[10px] text-slate-500">{thought.timestamp}s</span>
                </div>
                <p className="leading-relaxed">{thought.comment}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
