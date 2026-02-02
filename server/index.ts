import dotenv from 'dotenv';
import path from 'path';
import express from 'express';
import multer from 'multer';
import crypto from 'crypto';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  exchangeCodeForShortLivedToken,
  exchangeForLongLivedToken,
  fetchUserPages,
  fetchInstagramBusinessAccountId,
  getCreatorInsights,
  getDashboardData,
  InstagramInsightsResponse
} from '../services/instagramService';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config();

const app = express();
app.use(express.json());
const upload = multer({ storage: multer.memoryStorage() });

const MODEL_ID = 'gemini-2.0-flash';

const FB_APP_ID = process.env.FB_APP_ID;
const FB_APP_SECRET = process.env.FB_APP_SECRET;
const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const APP_URL = process.env.APP_URL || 'http://localhost:3000';
const REDIRECT_URI = `${APP_URL}/api/auth/instagram/callback`;

const OAUTH_SCOPES = [
  'instagram_basic',
  'instagram_manage_insights',
  'pages_show_list'
];

const oauthStates = new Set<string>();

const buildPrompt = () => {
  return `Return ONLY valid JSON with this structure:
{
  "captions": [{"start": 0, "text": "..."}],
  "socialAssets": {"description": "...", "hashtags": ["#tag1", "#tag2"]},
  "reachAudit": {"engagementScore": 0, "improvements": ["..."]}
}
Rules:
- captions: cinematic beats, max 5 words per line, start is seconds (number).
- socialAssets: optimized for current trends.
- reachAudit: engagementScore 1-100 based ONLY on the first 3 seconds. Provide 3-5 improvements.
- JSON only, no markdown or extra text.`;
};

const parseJsonFromText = (text: string) => {
  try {
    return JSON.parse(text);
  } catch {
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
      return null;
    }
    const slice = text.slice(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(slice);
    } catch {
      return null;
    }
  }
};

let instagramConnection: {
  longLivedUserToken: string;
  pageId: string;
  pageAccessToken: string;
  igUserId: string;
  expiresIn: number;
} | null = null;

let latestInsights: InstagramInsightsResponse | null = null;

app.get('/api/auth/instagram/login', (req, res) => {
  if (!FB_APP_ID || !FB_APP_SECRET) {
    return res.status(500).json({ error: 'Missing FB_APP_ID or FB_APP_SECRET.' });
  }

  const state = crypto.randomBytes(16).toString('hex');
  oauthStates.add(state);

  const authUrl = new URL(`https://www.facebook.com/v19.0/dialog/oauth`);
  authUrl.searchParams.set('client_id', FB_APP_ID);
  authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', OAUTH_SCOPES.join(','));
  authUrl.searchParams.set('state', state);

  return res.redirect(authUrl.toString());
});

app.get('/api/auth/instagram/callback', async (req, res) => {
  try {
    if (!FB_APP_ID || !FB_APP_SECRET) {
      return res.status(500).json({ error: 'Missing FB_APP_ID or FB_APP_SECRET.' });
    }

    const code = String(req.query.code || '');
    const state = String(req.query.state || '');

    if (!code || !state || !oauthStates.has(state)) {
      return res.status(400).json({ error: 'Invalid OAuth state or code.' });
    }

    oauthStates.delete(state);

    const shortLivedToken = await exchangeCodeForShortLivedToken({
      code,
      redirectUri: REDIRECT_URI,
      appId: FB_APP_ID,
      appSecret: FB_APP_SECRET
    });

    const longLived = await exchangeForLongLivedToken({
      shortLivedToken,
      appId: FB_APP_ID,
      appSecret: FB_APP_SECRET
    });

    const pages = await fetchUserPages(longLived.access_token);

    let connectedPage = null as null | {
      id: string;
      access_token: string;
    };
    let igUserId: string | null = null;

    for (const page of pages) {
      const candidateIgId = await fetchInstagramBusinessAccountId({
        pageId: page.id,
        pageAccessToken: page.access_token
      });

      if (candidateIgId) {
        connectedPage = {
          id: page.id,
          access_token: page.access_token
        };
        igUserId = candidateIgId;
        break;
      }
    }

    if (!connectedPage || !igUserId) {
      return res
        .status(404)
        .json({ error: 'No Instagram business account found on linked pages.' });
    }

    instagramConnection = {
      longLivedUserToken: longLived.access_token,
      pageId: connectedPage.id,
      pageAccessToken: connectedPage.access_token,
      igUserId,
      expiresIn: longLived.expires_in
    };

    latestInsights = null;

    return res.redirect(`${APP_URL}/dashboard?ig=connected`);
  } catch (error) {
    console.error('Instagram OAuth callback failed:', error);
    return res.status(500).json({ error: 'Instagram OAuth failed.' });
  }
});

app.get('/api/instagram/status', (req, res) => {
  if (!instagramConnection) {
    return res.status(200).json({ connected: false });
  }

  return res.status(200).json({
    connected: true,
    igUserId: instagramConnection.igUserId
  });
});

app.get('/api/instagram/insights', async (req, res) => {
  try {
    if (!instagramConnection) {
      return res.status(401).json({ error: 'Instagram not connected.' });
    }

    const { igUserId, pageAccessToken } = instagramConnection;
    const insights = await getCreatorInsights(igUserId, pageAccessToken);
    latestInsights = insights;

    return res.status(200).json({
      connected: true,
      insights
    });
  } catch (error) {
    console.error('Instagram insights fetch failed:', error);
    return res.status(500).json({ error: 'Failed to fetch Instagram insights.' });
  }
});

app.get('/api/dashboard', async (req, res) => {
  try {
    const dashboardData = await getDashboardData({
      accessToken: INSTAGRAM_ACCESS_TOKEN
    });

    return res.status(200).json(dashboardData);
  } catch (error) {
    console.error('Dashboard data fetch failed:', error);
    return res.status(500).json({ error: 'Failed to fetch dashboard data.' });
  }
});

app.post('/api/analyze', upload.single('video'), async (req, res) => {
  try {
    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.API_KEY ||
      process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'Missing Gemini API key.' });
    }

    const file = req.file;

    if (!file) {
      return res
        .status(400)
        .json({ error: "No video file provided. Use form field 'video'." });
    }

    if (!file.mimetype.startsWith('video/')) {
      return res
        .status(415)
        .json({ error: 'Unsupported file type. Please upload a video.' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: MODEL_ID,
      systemInstruction:
        'You are a Viral Content Architect. Analyze the video and return a structured JSON response.',
      generationConfig: {
        responseMimeType: 'application/json'
      }
    });

    const videoBase64 = file.buffer.toString('base64');
    const result = await model.generateContent([
      { text: buildPrompt() },
      {
        inlineData: {
          data: videoBase64,
          mimeType: file.mimetype
        }
      }
    ]);

    const text = result.response.text();

    const data = parseJsonFromText(text);

    if (!data) {
      return res
        .status(502)
        .json({ error: 'Gemini returned an invalid JSON response.', raw: text });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Video analysis failed:', error);
    return res.status(500).json({ error: 'Video analysis failed.' });
  }
});

// Serve static files from the built frontend
app.use(express.static(path.join(__dirname, '../dist')));

// Serve React app for all other routes (must be last)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const port = process.env.PORT || process.env.API_PORT || 3001;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
