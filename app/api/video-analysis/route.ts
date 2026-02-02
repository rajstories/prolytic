import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";

type VideoAnalysisResult = {
  captions: Array<{ timestamp: string; text: string }>;
  metadata: { hashtags: string[]; description: string };
  audit: { engagementScore: number };
};

const MODEL_ID = "gemini-2.0-flash";

const toBase64 = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer).toString("base64");
};

const buildPrompt = () => {
  return `You are a video analysis assistant. Analyze the provided video and return ONLY valid JSON with the following structure:
{
  "captions": [{"timestamp": "00:00.0", "text": "..."}],
  "metadata": {
    "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6", "#tag7", "#tag8", "#tag9", "#tag10", "#tag11", "#tag12", "#tag13", "#tag14", "#tag15"],
    "description": "High-engagement description under 350 characters."
  },
  "audit": {
    "engagementScore": 0
  }
}
Rules:
- Provide caption timestamps with text that reflect the video content.
- Provide EXACTLY 15 trending hashtags.
- The engagementScore must be 1-100 and based ONLY on the first 3 seconds of the video.
- Return JSON only, no markdown, no commentary.`;
};

export async function POST(req: Request) {
  try {
    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.API_KEY ||
      process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "Missing Gemini API key." },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file =
      (formData.get("video") as File | null) ||
      (formData.get("file") as File | null);

    if (!file) {
      return Response.json(
        { error: "No video file provided. Use form field 'video' or 'file'." },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("video/")) {
      return Response.json(
        { error: "Unsupported file type. Please upload a video." },
        { status: 415 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: MODEL_ID });

    const videoBase64 = await toBase64(file);
    const result = await model.generateContent([
      buildPrompt(),
      {
        inlineData: {
          data: videoBase64,
          mimeType: file.type
        }
      }
    ]);

    const text = result.response.text();

    let data: VideoAnalysisResult | null = null;
    try {
      data = JSON.parse(text) as VideoAnalysisResult;
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", parseError);
    }

    if (!data) {
      return Response.json(
        { error: "Gemini returned an invalid JSON response.", raw: text },
        { status: 502 }
      );
    }

    return Response.json(data, { status: 200 });
  } catch (error) {
    console.error("Video analysis failed:", error);
    return Response.json(
      { error: "Video analysis failed." },
      { status: 500 }
    );
  }
}
