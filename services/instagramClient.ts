export type InstagramInsights = {
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
};

export type InstagramInsightsResponse = {
  connected: boolean;
  insights: InstagramInsights;
};

export const fetchInstagramInsights = async () => {
  const response = await fetch('/api/instagram/insights');
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    const message = payload?.error || 'Unable to fetch Instagram insights.';
    throw new Error(message);
  }

  return (await response.json()) as InstagramInsightsResponse;
};
