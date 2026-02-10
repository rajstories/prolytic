export type ShadowComment = {
  time: number;
  persona: 'Gen Z' | 'Tech Bro' | 'Boomer' | 'Busy Mom';
  text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
};

export const SHADOW_SCENARIOS: Record<string, ShadowComment[]> = {
  'tech-demo': [
    { time: 2, persona: 'Gen Z', text: 'Ugh, intro is too long. 💀', sentiment: 'negative' },
    { time: 5, persona: 'Tech Bro', text: 'Wait, is that the M3 chip? Nice.', sentiment: 'positive' },
    { time: 9, persona: 'Gen Z', text: 'Show the performance delta already.', sentiment: 'neutral' },
    { time: 12, persona: 'Boomer', text: 'Can you speak slower? I missed that.', sentiment: 'neutral' },
    { time: 16, persona: 'Tech Bro', text: 'That benchmark graph is clean.', sentiment: 'positive' }
  ],
  'lifestyle-demo': [
    { time: 3, persona: 'Gen Z', text: 'Vibe is good, but make it faster.', sentiment: 'neutral' },
    { time: 7, persona: 'Busy Mom', text: 'Show the result again, please.', sentiment: 'neutral' },
    { time: 11, persona: 'Boomer', text: 'What brand is that? Too quick.', sentiment: 'negative' },
    { time: 14, persona: 'Gen Z', text: 'Okay, now I get it.', sentiment: 'positive' }
  ]
};
