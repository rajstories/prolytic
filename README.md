<div align="center">
  <br />

  <h1>✨ Prolytic</h1>

  <h3>The AI-Native Workspace for Viral Video Intelligence</h3>

  <p>
    Built for the <strong>Google Gemini Hackathon 2026</strong>
  </p>

  <p>
    <a href="https://prolytic-demo.vercel.app"><strong>Live Demo</strong></a> ·
    <a href="https://github.com/yourusername/prolytic/issues"><strong>Report Bug</strong></a> ·
    <a href="https://github.com/yourusername/prolytic/pulls"><strong>Request Feature</strong></a>
  </p>

</div>

<div align="center">

![Gemini 2.0 Flash](https://img.shields.io/badge/AI-Gemini%202.0%20Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

</div>

<br />

<img width="1280" height="709" alt="Prolytic UI Preview" src="https://github.com/user-attachments/assets/381446c7-56f7-44a1-bb0e-ad30018887ab" />

<br />

---

## 🚨 The Problem

Modern creators are stuck on a **content treadmill**. Publishing consistently is easy. Publishing *strategically* is not.

| 😤 Editing Fatigue | ❓ The Guesswork Gap | 📉 Algorithm Opacity |
| :-- | :-- | :-- |
| Hormozi-style captions demand **hours of manual keyframing** per clip. | Creators only learn a video failed **after it’s posted**. | Metrics explain *what* happened, not **why**. |

The result: wasted effort, creative burnout, and blind iteration.

---

## 🚀 The Solution: Prolytic

**Prolytic** is an AI creative director that lives entirely in your browser.

Instead of treating video as audio-plus-text, Prolytic uses **Gemini 2.0 Flash’s multimodal intelligence** to *watch* the video itself.

It analyzes visual pacing, emotional tone, and narrative structure to:

1. **Auto-Edit**  
   Generate frame-perfect cinematic captions aligned with on-screen energy.

2. **Predict Reach**  
   Score a clip’s **Virality Potential (0–100)** before it’s posted.

3. **Audit Content**  
   Deliver actionable, data-backed feedback instantly.

---

## ⚡ Technical Architecture  
### The “Gemini Flex” Pipeline

Prolytic bypasses traditional speech-to-text bottlenecks by sending **native video tokens** directly to Gemini.

```ts
// 1. Multimodal Tokenization
// Video is treated as a sequence of visual tokens, not a static file.
const videoParts = [
  {
    inlineData: {
      mimeType: "video/mp4",
      data: Buffer.from(
        fs.readFileSync("viral-clip.mp4")
      ).toString("base64"),
    },
  },
];

// 2. Structured "Director" Prompt
// Gemini is forced to return strict JSON for deterministic rendering.
const result = await model.generateContent([
  "Analyze this video for retention beats. Return JSON with 'captions' and 'viralityScore'.",
  ...videoParts,
]);

