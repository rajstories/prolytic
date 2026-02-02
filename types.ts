export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  SCRIPT_ANALYZER = 'SCRIPT_ANALYZER',
  IDEA_GENERATOR = 'IDEA_GENERATOR',
  VIDEO_STUDIO = 'VIDEO_STUDIO'
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

export interface VideoSocialAssets {
  description: string;
  hashtags: string[];
}

export interface VideoReachAudit {
  engagementScore: number;
  improvements: string[];
}

export interface VideoAnalysisResult {
  captions: VideoCaption[];
  socialAssets: VideoSocialAssets;
  reachAudit: VideoReachAudit;
}
