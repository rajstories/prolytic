import React, { useMemo } from 'react';
import { TimestampedWord } from '../types';

interface CaptionOverlayProps {
  videoTime: number;
  captions: TimestampedWord[];
}

/**
 * Hormozi-style real-time caption overlay.
 *
 * – Shows a sliding window of words around the currently-spoken word.
 * – The active word pops to 120 % scale and turns yellow (or green if emphasis).
 * – Everything else stays white with a subtle text-stroke.
 */
export const CaptionOverlay: React.FC<CaptionOverlayProps> = ({
  videoTime,
  captions
}) => {
  // ─── Active word index ──────────────────────────────────────────
  const activeIndex = useMemo(() => {
    // Find the word currently being spoken
    const idx = captions.findIndex(
      (c) => videoTime >= c.start && videoTime <= c.end
    );
    if (idx !== -1) return idx;

    // If between words, snap to the nearest upcoming word
    for (let i = 0; i < captions.length; i++) {
      if (captions[i].start > videoTime) {
        // Only snap if the gap is tiny (< 0.25 s) — feels more natural
        if (captions[i].start - videoTime < 0.25 && i > 0) return i - 1;
        return -1;
      }
    }
    return -1;
  }, [videoTime, captions]);

  // ─── Sliding window (phrase of ~5 words around active) ──────────
  const WINDOW = 2; // words on each side
  const phrase = useMemo(() => {
    if (activeIndex === -1) {
      // Find the closest upcoming cluster
      const nextIdx = captions.findIndex((c) => c.start > videoTime);
      if (nextIdx === -1 && captions.length > 0) {
        // Past the end — show last few words
        const start = Math.max(0, captions.length - (WINDOW * 2 + 1));
        return captions.slice(start);
      }
      if (nextIdx !== -1 && captions[nextIdx].start - videoTime < 1.0) {
        // About to speak — show upcoming words
        const start = Math.max(0, nextIdx - WINDOW);
        const end = Math.min(captions.length, nextIdx + WINDOW + 1);
        return captions.slice(start, end);
      }
      return [];
    }
    const start = Math.max(0, activeIndex - WINDOW);
    const end = Math.min(captions.length, activeIndex + WINDOW + 1);
    return captions.slice(start, end);
  }, [activeIndex, captions, videoTime]);

  if (phrase.length === 0) return null;

  return (
    <div className="absolute bottom-16 left-0 right-0 text-center pointer-events-none z-50 px-4">
      <div className="inline-block bg-black/60 px-5 py-3 rounded-xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1">
          {phrase.map((word, i) => {
            const isActive =
              videoTime >= word.start && videoTime <= word.end;
            const isEmphasis = word.emphasis;

            return (
              <span
                key={`${word.word}-${word.start}-${i}`}
                className={`
                  inline-block transition-all duration-100 ease-out
                  ${isActive
                    ? isEmphasis
                      ? 'text-green-400 scale-125 drop-shadow-[0_0_12px_rgba(74,222,128,0.7)]'
                      : 'text-yellow-300 scale-115 drop-shadow-[0_0_8px_rgba(253,224,71,0.5)]'
                    : 'text-white scale-100'
                  }
                `}
                style={{
                  fontFamily: "'Montserrat', 'Impact', 'Arial Black', sans-serif",
                  fontWeight: 900,
                  fontSize: isActive ? '2rem' : '1.65rem',
                  lineHeight: 1.2,
                  WebkitTextStroke: isActive ? '0px' : '1px rgba(0,0,0,0.6)',
                  textShadow: isActive
                    ? 'none'
                    : '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.6)',
                  transform: isActive ? 'scale(1.2)' : 'scale(1)',
                  transition: 'all 100ms ease-out',
                }}
              >
                {word.word}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};
