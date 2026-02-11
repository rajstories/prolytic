import { VideoAnalysisResult } from "../types";

type ApiError = {
  error?: string;
};

export const analyzeVideo = async (file: File, apiKey?: string): Promise<VideoAnalysisResult> => {
  const formData = new FormData();
  formData.append("video", file);

  const headers: HeadersInit = {};
  if (apiKey) {
    headers['x-gemini-api-key'] = apiKey;
  }

  const response = await fetch("/api/analyze", {
    method: "POST",
    body: formData,
    headers
  });

  if (!response.ok) {
    let message = "Video analysis failed.";
    if (response.status === 404) {
      throw new Error("API route not found. Start the backend API server and verify Vite proxy '/api' -> ':8080'.");
    }
    try {
      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? ((await response.json()) as ApiError)
        : null;
      if (data?.error) {
        message = data.error;
      }
    } catch {
      // Ignore JSON parse errors for non-JSON responses
    }
    throw new Error(message);
  }

  return (await response.json()) as VideoAnalysisResult;
};
