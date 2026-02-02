export const fetchDashboardData = async () => {
  const response = await fetch('/api/dashboard');
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    const message = payload?.error || 'Unable to fetch dashboard data.';
    throw new Error(message);
  }

  return (await response.json()) as DashboardData;
};

export type DashboardData = {
  source: 'live' | 'demo';
  user: {
    id: string;
    username: string;
    followers_count: number;
    media_count: number;
  };
  insights: {
    impressions: number | null;
    reach: number | null;
    profile_views: number | null;
    period: string;
  };
  retentionMockData: Array<{ time: string; value: number }>;
  demoResult: {
    score: number;
    hookStrength: string;
    pacing: string;
    viralPotential: string;
    keyImprovements: string[];
    reachAnalysis: {
      retentionScore: number;
      retentionInsight: string;
      lightingSuggestions: string;
      captionTips: string;
    };
  };
};
