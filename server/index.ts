import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import multer from 'multer';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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

// Helper to get API key from user header or fallback to server key
const getApiKey = (req: express.Request): string | undefined => {
  const userApiKey = req.headers['x-gemini-api-key'] as string;
  return userApiKey || process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.GOOGLE_API_KEY;
};

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
  "wordCaptions": [
    {"word": "Wait", "start": 0.5, "end": 0.9, "emphasis": true},
    {"word": "don't", "start": 0.9, "end": 1.2, "emphasis": false},
    {"word": "scroll!", "start": 1.2, "end": 1.8, "emphasis": true}
  ],
  "socialAssets": {"description": "...", "hashtags": ["#tag1", "#tag2"]},
  "reachAudit": {
    "score": 65,
    "niche": "High-Protein Baking",
    "viral_references": [
      {
        "title": "3-Ingredient Protein Muffins",
        "views": "2.4M",
        "why_it_worked": "Used a 'Texture Tear' shot in the first 0.5 seconds.",
        "link": "https://instagram.com/..."
      }
    ],
    "actionable_improvements": [
      {
        "type": "audio",
        "suggestion": "Replace silence with trending audio",
        "specific_asset": "Track: 'Espresso' - Sabrina Carpenter (Low Volume)",
        "impact": "High Retention"
      },
      {
        "type": "pacing",
        "suggestion": "Cut the intro",
        "specific_instruction": "Delete 00:00-00:04. Start immediately with the 'Bite Shot'.",
        "reference_timestamp": "00:04"
      }
    ]
  }
}
Rules:
- captions: cinematic beats, max 5 words per line, start is seconds (number).
- wordCaptions: CRITICAL - transcribe EVERY spoken word with precise start/end timestamps (seconds as decimals). Mark emphasis=true for loud, punchy, or high-pitch words (e.g. "Stop", "Money", "Viral", "Now"). If you detect a pause, adjust timestamps accordingly. Estimate word durations at ~0.3-0.5s per word, faster for short words, slower for emphasized words.
- socialAssets: optimized for current trends.
- reachAudit: classify niche, compare to top 1% in niche, and output specific assets and references.
- If you lack real internet access, simulate realistic viral references.
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

// Video Idea Generator endpoint
app.post('/api/ideas', async (req, res) => {
  try {
    const apiKey = getApiKey(req);

    if (!apiKey) {
      return res.status(500).json({ error: 'Missing Gemini API key.' });
    }

    const { topic, niche, audience, videoLength, subscribers, count = 5 } = req.body as {
      topic: string;
      niche?: string;
      audience?: string;
      videoLength?: string;
      subscribers?: string;
      count?: number;
    };

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required.' });
    }

    // Build contextual system instruction
    let contextualPrompt = 'You are a Viral Content Strategist specializing in YouTube and Instagram content.';
    
    if (niche) {
      contextualPrompt += ` Your specialty is ${niche} content.`;
    }
    
    if (audience) {
      contextualPrompt += ` Target audience: ${audience}.`;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: MODEL_ID,
      systemInstruction: contextualPrompt,
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'object',
          properties: {
            ideas: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  logline: { type: 'string' },
                  targetAudience: { type: 'string' },
                  viralScore: { type: 'number' },
                  estimatedViews: { type: 'string' },
                  reasoning: { type: 'string' },
                  hook: { type: 'string' }
                },
                required: ['title', 'logline', 'viralScore', 'reasoning']
              }
            }
          },
          required: ['ideas']
        }
      }
    });

    // Build detailed prompt
    let promptText = `Generate ${count} viral video ideas for: "${topic}"\n\n`;
    
    if (niche) {
      promptText += `Niche: ${niche}\n`;
    }
    
    if (audience) {
      promptText += `Target Audience: ${audience}\n`;
    }
    
    if (videoLength) {
      promptText += `Video Format: ${videoLength}\n`;
    }
    
    if (subscribers) {
      promptText += `Current Subscriber Count: ${subscribers}\n`;
    }

    promptText += `\nEach idea must include:
- title: Catchy, click-worthy title
- logline: 1-2 sentence pitch
- targetAudience: Specific demographic who will watch
- viralScore: 0-100 score based on current trends
- estimatedViews: Realistic view prediction
- reasoning: Why this will perform well (2-3 sentences)
- hook: Compelling first 3 seconds

Base recommendations on actual ${niche || 'creator'} trends and proven viral formats.`;

    const result = await model.generateContent([{ text: promptText }]);
    const text = result.response.text();
    const parsed = parseJsonFromText(text);

    if (!parsed || !parsed.ideas || !Array.isArray(parsed.ideas)) {
      return res.status(502).json({ 
        error: 'Failed to parse Gemini response.', 
        raw: text 
      });
    }

    res.json(parsed.ideas);

  } catch (error: any) {
    console.error('Idea generation failed:', error);
    
    if (error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('Too Many Requests')) {
      return res.status(429).json({ 
        error: 'API rate limit exceeded. Please wait a moment and try again, or add your own API key.',
        rateLimitExceeded: true
      });
    }
    
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Idea generation failed.' 
    });
  }
});

// Script Analyzer endpoint
app.post('/api/script', async (req, res) => {
  try {
    const apiKey = getApiKey(req);

    if (!apiKey) {
      return res.status(500).json({ error: 'Missing Gemini API key.' });
    }

    const { script, niche, goal, struggle, videoLength } = req.body as {
      script: string;
      niche?: string;
      goal?: string;
      struggle?: string;
      videoLength?: string;
    };

    if (!script) {
      return res.status(400).json({ error: 'Script is required.' });
    }

    // Build contextual system instruction
    let contextualPrompt = 'You are an Elite Script Analyst and Content Coach.';
    
    if (niche) {
      contextualPrompt += ` You specialize in ${niche} content.`;
    }
    
    if (struggle) {
      contextualPrompt += ` The creator's biggest struggle is ${struggle}.`;
    }
    
    if (goal) {
      contextualPrompt += ` Their goal is ${goal}.`;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: MODEL_ID,
      systemInstruction: contextualPrompt,
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'object',
          properties: {
            hookStrength: { type: 'number' },
            hookAnalysis: { type: 'string' },
            pacing: { type: 'string' },
            retentionPrediction: { type: 'number' },
            dropOffPoints: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  timestamp: { type: 'string' },
                  reason: { type: 'string' },
                  severity: { type: 'string' }
                }
              }
            },
            improvements: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  type: { type: 'string' },
                  suggestion: { type: 'string' },
                  impact: { type: 'string' },
                  example: { type: 'string' }
                }
              }
            },
            overallScore: { type: 'number' }
          },
          required: ['hookStrength', 'hookAnalysis', 'retentionPrediction', 'improvements', 'overallScore']
        }
      }
    });

    // Build detailed prompt
    let promptText = `Analyze this ${videoLength || 'video'} script ruthlessly:\n\n"${script}"\n\n`;
    
    if (niche) {
      promptText += `This is for a ${niche} audience. Compare to top 1% in this niche.\n`;
    }
    
    if (struggle) {
      promptText += `Focus especially on fixing: ${struggle}\n`;
    }

    promptText += `\nProvide:
1. hookStrength (0-100): Rate the first 3 seconds
2. hookAnalysis: Detailed critique of the opening
3. pacing: Overall pacing assessment
4. retentionPrediction (0-100): Predicted average retention %
5. dropOffPoints: Array of specific moments where viewers will leave (timestamp, reason, severity: low/medium/high)
6. improvements: 3-5 SPECIFIC, actionable fixes (not generic advice). Each must include type, suggestion, impact, and a concrete example
7. overallScore (0-100): Overall script quality

Be brutally honest. Reference actual ${niche || 'viral'} scripts that work.`;

    const result = await model.generateContent([{ text: promptText }]);
    const text = result.response.text();
    const parsed = parseJsonFromText(text);

    if (!parsed || typeof parsed.overallScore !== 'number') {
      return res.status(502).json({ 
        error: 'Failed to parse Gemini response.', 
        raw: text 
      });
    }

    res.json(parsed);

  } catch (error: any) {
    console.error('Script analysis failed:', error);
    
    if (error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('Too Many Requests')) {
      return res.status(429).json({ 
        error: 'API rate limit exceeded. Please wait a moment and try again, or add your own API key.',
        rateLimitExceeded: true
      });
    }
    
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Script analysis failed.' 
    });
  }
});

// Campaign Generator endpoint
app.post('/api/campaign', async (req, res) => {
  try {
    const apiKey = getApiKey(req);

    if (!apiKey) {
      return res.status(500).json({ error: 'Missing Gemini API key.' });
    }

    const { campaignName, product, goal, audience, budget, platforms, brandVoice, companyName } = req.body as {
      campaignName: string;
      product?: string;
      goal?: string;
      audience?: string;
      budget?: string;
      platforms?: string[];
      brandVoice?: string;
      companyName?: string;
    };

    if (!campaignName) {
      return res.status(400).json({ error: 'Campaign name is required.' });
    }

    const systemInstruction = `You are a Brand Strategist and Performance Marketer. Brand voice: ${brandVoice || 'Professional'}. Generate complete, actionable content marketing campaigns.`;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: MODEL_ID,
      systemInstruction,
      generationConfig: {
        responseMimeType: 'application/json'
      }
    });

    let promptText = `Generate a complete content marketing campaign:\n\n`;
    promptText += `Campaign Name: ${campaignName}\n`;
    promptText += `Product/Service: ${product || 'product'}\n`;
    promptText += `Goal: ${goal || 'awareness'}\n`;
    promptText += `Target Audience: ${audience || 'general'}\n`;
    promptText += `Budget Tier: ${budget || 'medium'}\n`;
    promptText += `Platforms: ${platforms?.join(', ') || 'Instagram'}\n`;
    if (companyName) promptText += `Company: ${companyName}\n`;

    promptText += `\nGenerate JSON with this structure:
{
  "campaignName": "${campaignName}",
  "strategy": "2-3 sentence overview",
  "contentPillars": ["pillar1", "pillar2", "pillar3"],
  "posts": [
    {
      "platform": "Instagram",
      "format": "Reel",
      "hook": "compelling hook",
      "script": "full script",
      "hashtags": ["#tag1", "#tag2"],
      "bestTimeToPost": "Mon 6PM",
      "estimatedReach": "10-15K"
    }
  ],
  "timeline": [
    {
      "week": 1,
      "focus": "Launch & Awareness",
      "deliverables": ["deliverable1", "deliverable2"]
    }
  ],
  "kpis": [
    {
      "metric": "Reach",
      "target": "50K impressions"
    }
  ]
}

Generate 5-7 posts across the specified platforms. Make the campaign specific to ${goal} goal and ${audience} audience.`;

    const result = await model.generateContent([{ text: promptText }]);
    const text = result.response.text();
    const parsed = parseJsonFromText(text);

    if (!parsed || !parsed.posts) {
      return res.status(502).json({ 
        error: 'Failed to parse campaign response.', 
        raw: text 
      });
    }

    res.json(parsed);

  } catch (error: any) {
    console.error('Campaign generation failed:', error);
    
    if (error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('Too Many Requests')) {
      return res.status(429).json({ 
        error: 'API rate limit exceeded. Please add your own API key.',
        rateLimitExceeded: true
      });
    }
    
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Campaign generation failed.' 
    });
  }
});

// Ad Script Generator endpoint
app.post('/api/ad-script', async (req, res) => {
  try {
    const apiKey = getApiKey(req);

    if (!apiKey) {
      return res.status(500).json({ error: 'Missing Gemini API key.' });
    }

    const { productDescription, adFormat, cta, brandVoice, companyName } = req.body as {
      productDescription: string;
      adFormat?: string;
      cta?: string;
      brandVoice?: string;
      companyName?: string;
    };

    if (!productDescription) {
      return res.status(400).json({ error: 'Product description is required.' });
    }

    const systemInstruction = `You are a Direct Response Ad Creator. Brand voice: ${brandVoice || 'Professional'}. Create high-conversion ad scripts.`;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: MODEL_ID,
      systemInstruction,
      generationConfig: {
        responseMimeType: 'application/json'
      }
    });

    let promptText = `Generate 3 video ad script variations:\n\n`;
    promptText += `Product: ${productDescription}\n`;
    promptText += `Format: ${adFormat || 'reel'}\n`;
    promptText += `CTA: ${cta || 'Shop Now'}\n`;
    if (companyName) promptText += `Company: ${companyName}\n`;

    promptText += `\nGenerate JSON with this structure:
{
  "scripts": [
    {
      "version": "Emotional Hook",
      "hook": "First 3 seconds hook",
      "body": "Main script body",
      "cta": "Call to action line",
      "musicSuggestion": "Music recommendation",
      "visualDirection": "Visual guidance"
    },
    {
      "version": "Problem-Solution",
      "hook": "...",
      "body": "...",
      "cta": "...",
      "musicSuggestion": "...",
      "visualDirection": "..."
    },
    {
      "version": "Social Proof",
      "hook": "...",
      "body": "...",
      "cta": "...",
      "musicSuggestion": "...",
      "visualDirection": "..."
    }
  ],
  "copyVariants": ["variant1", "variant2", "variant3"]
}

Make scripts specific to ${adFormat} format and ${brandVoice} tone.`;

    const result = await model.generateContent([{ text: promptText }]);
    const text = result.response.text();
    const parsed = parseJsonFromText(text);

    if (!parsed || !parsed.scripts) {
      return res.status(502).json({ 
        error: 'Failed to parse ad script response.', 
        raw: text 
      });
    }

    res.json(parsed);

  } catch (error: any) {
    console.error('Ad script generation failed:', error);
    
    if (error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('Too Many Requests')) {
      return res.status(429).json({ 
        error: 'API rate limit exceeded. Please add your own API key.',
        rateLimitExceeded: true
      });
    }
    
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Ad script generation failed.' 
    });
  }
});

app.post('/api/analyze', upload.single('video'), async (req, res) => {
  try {
    const apiKey = getApiKey(req);

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
        'You are a Viral Content Strategist and Subtitle Timing Specialist. Analyze the input video frames and audio. Classify the niche, compare against the top 1% in that niche, and return structured improvements with specific assets and references. CRITICALLY: Transcribe every spoken word with precise word-level timestamps (start/end in seconds). Flag emphasis words (loud, punchy, high-pitch) as emphasis=true.',
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
  } catch (error: any) {
    console.error('Video analysis failed:', error);
    
    // Handle rate limit errors specifically
    if (error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('Too Many Requests')) {
      return res.status(429).json({ 
        error: 'API rate limit exceeded. Please wait a moment and try again, or use a smaller video.',
        rateLimitExceeded: true
      });
    }
    
    return res.status(500).json({ 
      error: error?.message || 'Video analysis failed.' 
    });
  }
});

app.post('/api/analyze/shadow-audience', async (req, res) => {
  const fallback = [
    {
      timestamp: 4,
      persona: 'Gen Z Skeptic',
      comment: 'Intro is too slow. I might bounce.',
      sentiment: 'negative'
    },
    {
      timestamp: 9,
      persona: 'Tech Bro',
      comment: 'That stat is strong. Hook is landing.',
      sentiment: 'positive'
    },
    {
      timestamp: 15,
      persona: 'Boomer',
      comment: 'Clearer visuals, please. The pacing feels fast.',
      sentiment: 'neutral'
    }
  ];

  try {
    const apiKey = getApiKey(req);

    if (!apiKey) {
      return res.status(200).json(fallback);
    }

    const { videoContext, personas, niche, audience } = req.body as {
      videoContext?: string;
      personas?: string[];
      niche?: string;
      audience?: string;
    };

    const personaList = Array.isArray(personas) ? personas.join(', ') : 'Gen Z';
    const context = videoContext || 'Short product demo for creators.';

    // Build contextual system instruction
    let systemInstruction = `You are a Viewer Psychology Simulator. Simulate the internal monologue of these personas: ${personaList}.`;
    
    if (niche) {
      systemInstruction += ` The video is in the ${niche} niche.`;
    }
    
    if (audience) {
      systemInstruction += ` Target audience: ${audience}.`;
    }
    
    systemInstruction += ` Return a JSON array of timestamped reactions while they watch the video. Each item must include timestamp (number seconds), persona, comment, and sentiment (positive|negative|neutral). Make reactions specific to the ${niche || 'creator'} context. Return JSON only.`;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: MODEL_ID,
      systemInstruction
    });

    let promptText = `Video context: ${context}`;
    
    if (niche) {
      promptText += `\nNiche: ${niche}`;
    }
    
    if (audience) {
      promptText += `\nTarget Audience: ${audience}`;
    }
    
    promptText += `\nReturn the JSON array now with ${personaList} personas reacting.`;

    const result = await model.generateContent([
      {
        text: promptText
      }
    ]);

    const text = result.response.text();
    const parsed = parseJsonFromText(text);

    if (!parsed || !Array.isArray(parsed)) {
      return res.status(200).json(fallback);
    }

    return res.status(200).json(parsed);
  } catch (error: any) {
    console.error('Shadow audience simulation failed:', error);
    
    // Check for rate limit errors
    if (error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('rate limit')) {
      return res.status(429).json({ 
        error: 'API rate limit exceeded. Please wait or use your own API key.',
        rateLimitExceeded: true 
      });
    }
    
    // For other errors, return fallback demo data
    return res.status(200).json(fallback);
  }
});

// Narrative Structure Analysis endpoint
app.post('/api/analyze/narrative-structure', upload.single('video'), async (req, res) => {
  try {
    const apiKey = getApiKey(req);

    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API key not configured.' });
    }

    // Get video from multer or base64 from body
    let videoBase64: string;
    let videoMimeType: string;

    if (req.file) {
      videoBase64 = req.file.buffer.toString('base64');
      videoMimeType = req.file.mimetype;
    } else if (req.body.videoBase64) {
      videoBase64 = req.body.videoBase64;
      videoMimeType = req.body.videoMimeType || 'video/mp4';
    } else {
      return res.status(400).json({ 
        error: 'No video provided. Upload a video file or provide videoBase64.' 
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: MODEL_ID,
      systemInstruction: `You are a Professional Video Editor and Narrative Architect.
Your expertise is in analyzing story structure, pacing, and emotional flow.
You identify narrative problems and provide actionable solutions to fix them.`
    });

    const prompt = `
Analyze this video's narrative structure with the precision of a professional editor.

YOUR TASKS:
1. SCENE DETECTION: Identify distinct scenes/clips in the video
   - Label each scene clearly (e.g., "Intro", "Hook", "Context", "Proof", "CTA")
   - Classify energy level: boring (low energy, slow pacing), exciting (high energy, engaging), neutral (transitional)
   - Note timestamp (in seconds) where each scene starts

2. PROBLEM IDENTIFICATION: Detect narrative issues
   - "Buried Lead": Most exciting content appears too late in the video
   - "Weak Hook": First 3 seconds don't grab attention
   - "Dead Air": Segments with no dialogue, action, or visual interest
   - "Pacing Issues": Energy drops or uneven flow

3. SOLUTION GENERATION: Create a reorder plan
   - Specify which clips should move where (from index → to index)
   - Explain WHY each move improves the narrative

4. REASONING: Provide step-by-step logic

Return ONLY valid JSON (no markdown):
{
  "clips": [
    {
      "id": "clip1",
      "label": "Intro",
      "type": "boring",
      "timestamp": 0,
      "duration": 5
    }
  ],
  "problems": ["Buried Lead at 0:45..."],
  "reorderPlan": [
    {
      "from": 2,
      "to": 0,
      "clipId": "clip3",
      "reason": "Move the hook to the beginning."
    }
  ],
  "reasoning": [
    "Step 1: Analyzing opening sequence...",
    "Step 2: Detected energy drop at 0:30...",
    "Strategy: Front-load excitement."
  ]
}`;

    const result = await model.generateContent([
      { text: prompt },
      {
        inlineData: {
          data: videoBase64,
          mimeType: videoMimeType
        }
      }
    ]);

    const responseText = result.response.text();
    const analysis = parseJsonFromText(responseText);

    if (!analysis) {
      return res.status(502).json({ 
        error: 'Failed to parse Gemini response.', 
        raw: responseText 
      });
    }

    res.json(analysis);

  } catch (error: any) {
    console.error('Narrative analysis failed:', error);
    
    // Handle rate limit errors specifically
    if (error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('Too Many Requests')) {
      return res.status(429).json({ 
        error: 'API rate limit exceeded. Please wait a moment and try again, or use a smaller video.',
        rateLimitExceeded: true
      });
    }
    
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Narrative analysis failed.' 
    });
  }
});

app.post('/api/analyze/narrative-structure', async (req, res) => {
  try {
    const mock = {
      clips: [
        { id: 'clip3', label: 'Hook', type: 'exciting' },
        { id: 'clip2', label: 'Context', type: 'neutral' },
        { id: 'clip4', label: 'Proof', type: 'neutral' },
        { id: 'clip6', label: 'CTA', type: 'exciting' }
      ],
      reasoning: [
        'Scanning Narrative Structure...',
        "Detected: 'Buried Lead' in clip order.",
        "Strategy: Move 'Hook' to 0:00.",
        "Strategy: Delete 'Dead Air'."
      ],
      problems: ['Hook appears at 00:18 (too late)', 'Dead Air between 00:24-00:28'],
      reorderPlan: [
        { clipId: 'clip3', from: 3, to: 1, reason: 'Surface hook immediately' },
        { clipId: 'clip5', from: 5, to: -1, reason: 'Remove dead air' }
      ]
    };

    return res.status(200).json(mock);
  } catch (error) {
    console.error('Narrative analysis failed:', error);
    return res.status(200).json({
      clips: [
        { id: 'clip3', label: 'Hook', type: 'exciting' },
        { id: 'clip2', label: 'Context', type: 'neutral' },
        { id: 'clip4', label: 'Proof', type: 'neutral' },
        { id: 'clip6', label: 'CTA', type: 'exciting' }
      ],
      reasoning: [
        'Fallback demo applied.',
        "Detected: 'Buried Lead' in clip order.",
        "Strategy: Move 'Hook' to 0:00.",
        "Strategy: Delete 'Dead Air'."
      ]
    });
  }
});

// Serve static files from the built frontend
app.use(express.static(path.join(__dirname, '../dist')));

// Serve React app for all other routes (must be last)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const port = Number(process.env.PORT) || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`);
});
