export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  SCRIPT_ANALYZER = 'SCRIPT_ANALYZER',
  IDEA_GENERATOR = 'IDEA_GENERATOR',
  VIDEO_STUDIO = 'VIDEO_STUDIO',
  AUDIENCE_LAB = 'AUDIENCE_LAB',
  NARRATIVE_LAB = 'NARRATIVE_LAB'
}

export interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface ReachAnalysis {
  retentionScore: number;
  retentionInsight: string;
  lightingSuggestions: string;
  captionTips: string;
}

export interface ScriptAnalysisResult {
  score: number;
  hookStrength: string;
  pacing: string;
  viralPotential: string;
  keyImprovements: string[];
  reachAnalysis: ReachAnalysis;
}

export interface VideoIdea {
  title: string;
  logline: string;
  targetAudience: string;
  estimatedViews: string;
}

export interface VideoCaption {
  start: number;
  text: string;
}

/** Word-level timestamped caption for Hormozi-style overlay */
export interface TimestampedWord {
  word: string;
  start: number;
  end: number;
  emphasis: boolean;
}

export interface VideoSocialAssets {
  description: string;
  hashtags: string[];
}

export interface VideoReachAudit {
  score: number;
  niche: string;
  viral_references: Array<{
    title: string;
    views: string;
    why_it_worked: string;
    link: string;
  }>;
  actionable_improvements: Array<{
    type: 'audio' | 'pacing' | 'visual' | 'hook' | 'structure';
    suggestion: string;
    specific_asset?: string;
    specific_instruction?: string;
    reference_timestamp?: string;
    impact?: string;
  }>;
}

export interface VideoAnalysisResult {
  captions: VideoCaption[];
  wordCaptions: TimestampedWord[];
  socialAssets: VideoSocialAssets;
  reachAudit: VideoReachAudit;
}
