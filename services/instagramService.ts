import { DEMO_RESULT, retentionMockData } from './mockData';

const GRAPH_API_VERSION = 'v19.0';
const GRAPH_API_BASE = `https://graph.facebook.com/${GRAPH_API_VERSION}`;
const DEMO_MODE = false;

const dashboardMockStats = {
  followers_count: 128540,
  reach: 96420,
  impressions: 184320
};

export type InstagramUserSummary = {
  id: string;
  username: string;
  followers_count: number;
  media_count: number;
};

export type InstagramInsights = {
  impressions: number | null;
  reach: number | null;
  profile_views: number | null;
  period: string;
};

export type InstagramInsightsResponse = {
  user: InstagramUserSummary;
  insights: InstagramInsights;
};

const buildUrl = (path: string, params: Record<string, string>) => {
  const url = new URL(`${GRAPH_API_BASE}${path}`);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  return url.toString();
};

const fetchJson = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data?.error?.message || 'Instagram API request failed.';
    throw new Error(errorMessage);
  }

  return data as T;
};

export const exchangeCodeForShortLivedToken = async ({
  code,
  redirectUri,
  appId,
  appSecret
}: {
  code: string;
  redirectUri: string;
  appId: string;
  appSecret: string;
}) => {
  const url = buildUrl('/oauth/access_token', {
    client_id: appId,
    redirect_uri: redirectUri,
    client_secret: appSecret,
    code
  });

  const data = await fetchJson<{ access_token: string }>(url);
  return data.access_token;
};

export const exchangeForLongLivedToken = async ({
  shortLivedToken,
  appId,
  appSecret
}: {
  shortLivedToken: string;
  appId: string;
  appSecret: string;
}) => {
  const url = buildUrl('/oauth/access_token', {
    grant_type: 'fb_exchange_token',
    client_id: appId,
    client_secret: appSecret,
    fb_exchange_token: shortLivedToken
  });

  const data = await fetchJson<{ access_token: string; expires_in: number }>(url);
  return data;
};

export const fetchUserPages = async (accessToken: string) => {
  const url = buildUrl('/me/accounts', {
    access_token: accessToken
  });

  const data = await fetchJson<{ data: Array<{ id: string; name: string; access_token: string }> }>(
    url
  );

  return data.data || [];
};

export const fetchInstagramBusinessAccountId = async ({
  pageId,
  pageAccessToken
}: {
  pageId: string;
  pageAccessToken: string;
}) => {
  const url = buildUrl(`/${pageId}`, {
    fields: 'instagram_business_account',
    access_token: pageAccessToken
  });

  const data = await fetchJson<{ instagram_business_account?: { id: string } }>(url);
  return data.instagram_business_account?.id ?? null;
};

export const getCreatorInsights = async (
  igUserId: string,
  accessToken: string
): Promise<InstagramInsightsResponse> => {
  const userUrl = buildUrl(`/${igUserId}`, {
    fields: 'followers_count,media_count,username',
    access_token: accessToken
  });

  const insightsUrl = buildUrl(`/${igUserId}/insights`, {
    metric: 'impressions,reach,profile_views',
    period: 'day',
    access_token: accessToken
  });

  const [user, insights] = await Promise.all([
    fetchJson<InstagramUserSummary>(userUrl),
    fetchJson<{ data: Array<{ name: string; values: Array<{ value: number }> }> }>(insightsUrl)
  ]);

  const metrics = new Map(
    insights.data.map((entry) => [entry.name, entry.values?.[0]?.value ?? null])
  );

  return {
    user,
    insights: {
      impressions: metrics.get('impressions') ?? null,
      reach: metrics.get('reach') ?? null,
      profile_views: metrics.get('profile_views') ?? null,
      period: 'day'
    }
  };
};

export type DashboardData = {
  source: 'live' | 'demo';
  user: InstagramUserSummary;
  insights: InstagramInsights;
  retentionMockData: typeof retentionMockData;
  demoResult: typeof DEMO_RESULT;
};

export const getDashboardData = async ({
  accessToken
}: {
  accessToken?: string;
}): Promise<DashboardData> => {
  if (DEMO_MODE) {
    return {
      source: 'demo',
      user: {
        id: 'demo',
        username: 'prolytic_demo',
        followers_count: dashboardMockStats.followers_count,
        media_count: 0
      },
      insights: {
        impressions: dashboardMockStats.impressions,
        reach: dashboardMockStats.reach,
        profile_views: null,
        period: 'day'
      },
      retentionMockData,
      demoResult: DEMO_RESULT
    };
  }

  try {
    if (!accessToken) {
      throw new Error('Missing Instagram access token.');
    }

    const pages = await fetchUserPages(accessToken);
    if (!pages.length) {
      throw new Error('No Facebook pages found.');
    }

    let igUserId: string | null = null;
    let pageAccessToken: string | null = null;

    for (const page of pages) {
      const candidateId = await fetchInstagramBusinessAccountId({
        pageId: page.id,
        pageAccessToken: page.access_token
      });
      if (candidateId) {
        igUserId = candidateId;
        pageAccessToken = page.access_token;
        break;
      }
    }

    if (!igUserId || !pageAccessToken) {
      throw new Error('No Instagram business account connected.');
    }

    const insights = await getCreatorInsights(igUserId, pageAccessToken);

    return {
      source: 'live',
      user: insights.user,
      insights: insights.insights,
      retentionMockData,
      demoResult: DEMO_RESULT
    };
  } catch {
    return {
      source: 'demo',
      user: {
        id: 'demo',
        username: 'prolytic_demo',
        followers_count: dashboardMockStats.followers_count,
        media_count: 0
      },
      insights: {
        impressions: dashboardMockStats.impressions,
        reach: dashboardMockStats.reach,
        profile_views: null,
        period: 'day'
      },
      retentionMockData,
      demoResult: DEMO_RESULT
    };
  }
};
