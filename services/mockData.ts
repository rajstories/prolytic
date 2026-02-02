import { ScriptAnalysisResult } from '../types';

export const retentionMockData = [
  { time: '0s', value: 100 },
  { time: '10s', value: 92 },
  { time: '20s', value: 85 },
  { time: '30s', value: 82 },
  { time: '40s', value: 78 },
  { time: '50s', value: 75 },
  { time: '60s', value: 70 }
];

export const DEMO_RESULT: ScriptAnalysisResult = {
  score: 88,
  hookStrength:
    'Strong visual hook with immediate conflict introduction. The first 3 seconds effectively grab attention.',
  pacing:
    'Fast-paced with excellent rhythm. Transitions are smooth and keep the viewer engaged.',
  viralPotential:
    'High. The relatable topic combined with the controversy in the second act suggests high shareability.',
  keyImprovements: [
    'Consider adding captions for the silent intro segment.',
    'The ending call-to-action could be more direct.',
    'Color grading in the B-roll feels slightly inconsistent.'
  ],
  reachAnalysis: {
    retentionScore: 92,
    retentionInsight:
      'The mystery element introduced at 0:15 keeps viewers watching until the reveal at the end.',
    lightingSuggestions:
      'Main subject lighting is slightly underexposed. Consider a rim light to separate from the background.',
    captionTips:
      'Use kinetic typography for key statistics to increase retention during the data segment.'
  }
};
