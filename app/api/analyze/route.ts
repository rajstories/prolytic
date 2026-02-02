import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";

type VideoAnalysisResponse = {
  captions: Array<{ start: number; text: string }>;
  socialAssets: { description: string; hashtags: string[] };
  reachAudit: { engagementScore: number; improvements: string[] };
};

const MODEL_ID = "gemini-2.0-flash";

const toBase64 = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer).toString("base64");
};

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

export async function POST(req: Request) {
  try {
    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.API_KEY ||
      process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return Response.json({ error: "Missing Gemini API key." }, { status: 500 });
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
    const model = genAI.getGenerativeModel({
      model: MODEL_ID,
      systemInstruction: "You are a Viral Content Architect. Analyze the video and return a structured JSON response."
    });

    const videoBase64 = await toBase64(file);
    const result = await model.generateContent([
      { text: buildPrompt() },
      {
        inlineData: {
          data: videoBase64,
          mimeType: file.type
        }
      }
    ]);

    const text = result.response.text();

    let data: VideoAnalysisResponse | null = null;
    try {
      data = JSON.parse(text) as VideoAnalysisResponse;
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
    return Response.json({ error: "Video analysis failed." }, { status: 500 });
  }
}
