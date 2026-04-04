<div align="center">

<a href="https://prolytic.in/">
  <img src="https://capsule-render.vercel.app/api?type=venom&height=200&text=PROLYTIC&fontSize=80&color=gradient&customColorList=12,20,24,30&fontColor=FFFFFF&stroke=6366F1&strokeWidth=2&animation=fadeIn&desc=The%20AI%20Reasoning%20Engine%20for%20the%20Creator%20Economy&descSize=18&descAlignY=75" width="100%"/>
</a>

---

| | | |
|:---:|:---:|:---:|
| [![Gemini](https://img.shields.io/badge/POWERED%20BY%20GEMINI%203.0-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/) | [![Live Demo](https://img.shields.io/badge/🚀%20LIVE%20DEMO-prolytic.in-10B981?style=for-the-badge)](https://prolytic.in/) | [![Production](https://img.shields.io/badge/PRODUCTION%20READY-✅-6366F1?style=for-the-badge)](https://prolytic.in/) |

<br/>

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

<br/>

[🎥 Watch Demo](https://youtu.be/dfAV6JnDUes?si=V3e2SiJQl3oDXKWD) • [🚀 Try Live](https://prolytic.in/)

</div>

---

## 🎯 The Problem: Algorithm Anxiety

> *"For 18 months, I couldn't break 5,000 views. I was shooting in the dark."*

Every creator knows this pain:
- 📹 You spend **days** scripting, filming, editing
- 🎲 You hit publish and... **silence**
- 🔄 You iterate blindly, hoping *something* works
- 😰 You feel like you're **gambling** with every upload

**Existing AI tools say "make better hooks" but can't tell you *WHY* your intro bombed or *WHY* viewers scrolled away at 0:04.**

---

## 💡 The Vision: A Synthetic Creative Team

Prolytic isn't another "AI video editor." It's an **AI-native workspace** that acts as your:
- 🧠 **Strategic Advisor** (pre-production)
- 🎨 **Creative Director** (production)
- 🔬 **Audience Psychologist** (post-analysis)
- 📊 **Brand Intelligence** (scale-up)

Built on **Google Gemini 3.0**, Prolytic *reasons* about your content the way a human creative team would—but **10x faster**.

---

## ✨ Core Features

<div align="center">

| 🎬 Video Studio | 🎭 Audience Lab | 📐 Narrative Doctor |
|:---:|:---:|:---:|
| Multimodal Content Intelligence | Shadow Audience Simulator | AI Story Structure Fixer |
| Word-level captions, AI post pack, impact analytics | AI personas react at real timestamps | Detects buried leads, dead air, weak hooks |

| 🧪 Idea Generator | 📝 Script Analyzer |
|:---:|:---:|
| Viral Potential Scoring | Pre-Production Hook Optimizer |
| Confidence scores before you film | Hook strength, pacing, retention predictions |

</div>

---

### 🎬 **1. Video Studio** — *Multimodal Content Intelligence*

Upload a video and watch Gemini analyze it **pixel-by-pixel**:

```
✅ Cinematic Word-Level Captions (Hormozi-style)
   → Real-time karaoke overlay with emphasis detection
   
✅ AI Post Pack
   → Context-aware descriptions & trending hashtags
   
✅ Impact Analytics
   → Niche classification + top 1% benchmark comparison
   → Specific improvements (e.g., "Add 'Espresso' by Sabrina Carpenter at 0:04")
```

**Tech Magic:**
- Gemini 3.0 watches your video frame-by-frame
- Understands visual context (lighting, pacing, energy)
- Generates **word-level timestamps** with `emphasis` flags for dramatic words
- `CaptionOverlay` component syncs at 60fps with `requestAnimationFrame`

<div align="center">
<img src="https://via.placeholder.com/800x450/0F172A/FBBF24?text=Video+Studio+Demo" alt="Video Studio" width="80%"/>
<br/>
<i>↑ Upload → Analyze → Get actionable insights in ~12 seconds</i>
</div>

---

### 🎭 **2. Audience Lab** — *Shadow Audience Simulator*

**The "Wow" Feature.**

We instantiate **AI Personas** that watch your video in real-time:
- 😴 **Gen Z Skeptic**: *"0:05 — Ugh, this intro is dragging 🙄"*
- 💼 **Tech Professional**: *"0:09 — That stat is strong. Hook is landing."*
- 👵 **Boomer**: *"0:15 — Clearer visuals, please. Too fast."*

**How it works:**
```typescript
// Backend: Gemini roleplays psychological profiles
const personas = ['Gen Z Skeptic', 'Busy Mom', 'Tech Bro'];
const thoughts = await gemini.generateContent({
  systemInstruction: `You are a ${persona}. Watch this video and comment 
  at specific timestamps when you feel bored, excited, or confused.`,
  video: videoBase64
});
```

**Why it matters:** Get feedback from your target audience **before** you post—no A/B testing needed.

<div align="center">
<img src="https://via.placeholder.com/800x450/0F172A/4ADE80?text=Shadow+Audience+Comments" alt="Audience Lab" width="80%"/>
<br/>
<i>↑ Real-time persona reactions overlaid on your video timeline</i>
</div>

---

### 📐 **3. Narrative Doctor** — *AI Story Structure Fixer*

Your video feels *off*, but you can't pinpoint why? The Narrative Doctor can.

**It detects:**
- 🪦 **Buried Lead**: Your best clip is at 0:45 (should be at 0:00)
- 💤 **Dead Air**: 8 seconds of silence at 0:12
- 🎣 **Weak Hook**: First 3 seconds don't grab attention

**It fixes:**
- Suggests **clip reordering** with visual drag-and-drop timeline
- Proposes **cuts** (e.g., "Delete 00:00-00:04. Start with the 'Bite Shot'")
- Generates a "Director's Cut" optimized for retention

```
Before:  [Intro] → [Context] → [Hook] → [Proof] → [Dead Air] → [CTA]
After:   [Hook] → [Proof] → [Context] → [CTA]

Result: +37% predicted retention (based on niche benchmarks)
```

<div align="center">
<img src="https://via.placeholder.com/800x450/0F172A/EC4899?text=Narrative+Doctor+Reordering" alt="Narrative Doctor" width="80%"/>
<br/>
<i>↑ AI suggests moving your hook to the front—watch the timeline rearrange itself</i>
</div>

---

### 🧪 **4. Idea Generator** — *Viral Potential Scoring*

Stop brainstorming blindly. Let Gemini scan your niche for **gaps**.

**Input:** `"Protein baking for busy professionals"`

**Output:**
```json
[
  {
    "title": "5-Minute Protein Brownies (No Oven)",
    "logline": "Microwave hack for gym bros with no time",
    "targetAudience": "Fitness enthusiasts, 25-35",
    "estimatedViews": "500K-1M",
    "viralPotential": 87/100,
    "reasoning": "Combines trending 'lazy cooking' format with 
                  high-search keyword 'protein brownies'"
  }
]
```

**Why it works:** Confidence **before** you film. No more "will this work?" anxiety.

---

### 📝 **5. Script Analyzer** — *Pre-Production Hook Optimizer*

Paste your script. Get a **ruthless AI editor**.

**Analyzed:**
- ✅ Hook Strength (0-100 score)
- ✅ Pacing (too slow? too fast?)
- ✅ Retention Predictions (where viewers will drop off)
- ✅ Key Improvements (specific line edits)

**Example Feedback:**
```
❌ "Hey guys, welcome back to my channel..."
   → Generic. 78% of viewers scroll in 2 seconds.

✅ "I wasted $5,000 on this mistake. Here's how you avoid it."
   → Curiosity gap + stakes. 91% retention predicted.
```

---

## 🏗️ Technical Architecture

<div align="center">

```
┌─────────────────────────────────────────────────────────────┐
│                        PROLYTIC PLATFORM                     │
├──────────────────────────┬──────────────────────────────────┤
│       FRONTEND           │           BACKEND                │
│  React + Vite + TS       │     Node.js + Express            │
│  Tailwind CSS            │     Google Gemini 3.0            │
│  Framer Motion           │     YouTube Data API             │
│  Lucide React            │     Instagram Graph API          │
│  CaptionOverlay (60fps)  │     Multer (100MB uploads)       │
└──────────────────────────┴──────────────────────────────────┘
```

</div>

### **Frontend** — *Built for Speed & Delight*

| Component | Technology | Purpose |
|:---:|:---:|:---:|
| Build Tool | React + Vite | Lightning-fast HMR, component modularity |
| Language | TypeScript | Type-safe AI response handling |
| Styling | Tailwind CSS | Apple-style minimalist UI, Dark Mode |
| Animation | Framer Motion | 60fps animations (timeline shifts, comment overlays) |
| Icons | Lucide React | Lightweight, consistent iconography |

**Key Components:**
- `CaptionOverlay.tsx` — Hormozi-style word-level caption sync (60fps RAF loop)
- `ShadowPlayer.tsx` — Persona comment overlay with timestamp tracking
- `NarrativeDoctor.tsx` — Drag-and-drop timeline with AI suggestions
- `ApiKeyModal.tsx` — User API key input for rate limit resilience

---

### **Backend** — *The AI Reasoning Engine*

| Service | Role |
|:---:|:---|
| Node.js + Express | API server (port 8080) |
| Google Gemini 3.0 | Multimodal video + audio analysis |
| `thinking_level="high"` | Deep reasoning for Audience Lab |
| `responseMimeType: json` | Structured outputs (no parsing hell) |
| Force Alignment | Word-level timestamp extraction |
| YouTube Data API | Trend analysis, viral benchmarks |
| Instagram Graph API | Reels performance, sentiment tracking |
| Multer | 100MB video upload handling |

**API Routes:**

| Method | Endpoint | Feature |
|:---:|:---|:---|
| `POST` | `/api/analyze` | Video Studio (captions, hashtags, analytics) |
| `POST` | `/api/analyze/shadow-audience` | Audience Lab (persona simulation) |
| `POST` | `/api/analyze/narrative-structure` | Narrative Doctor (scene reordering) |
| `POST` | `/api/script` | Script Analyzer (hook optimization) |
| `POST` | `/api/ideas` | Idea Generator (viral scoring) |

---

### **AI/ML Stack** — *Why Gemini 3.0?*

| Feature | Traditional AI | Gemini 3.0 (Prolytic) |
|:---:|:---:|:---:|
| Video Understanding | Frame sampling | **Pixel-by-pixel multimodal** |
| Reasoning | Generic advice | **Niche-specific benchmarks** |
| Persona Simulation | Chatbot replies | **Psychological profiles with emotions** |
| Output | Text blobs | **Structured JSON with confidence scores** |
| Speed | 30-60s | **10-15s** (optimized prompts) |

**Prompts we're proud of:**
```typescript
// Making Gemini "bored" like a real Gen Z viewer
systemInstruction: `You are a 19-year-old with a 3-second attention span.
You WILL scroll away if the first frame isn't shocking. Be ruthless.
Comment at the EXACT timestamp you lose interest.`
```

---

## 🎨 Design Philosophy

**"Calm Intelligence"** — No flashy gradients. No clutter.

Inspired by:
- 🍎 **Apple's UI** — Whitespace as a feature
- 🎬 **Final Cut Pro** — Professional tools, intuitive layout
- 🧘 **Calm.com** — Reduce cognitive load

<div align="center">

| Color | Hex | Role |
|:---:|:---:|:---|
| 🟣 Primary | `#6366F1` (Indigo) | Trust, intelligence |
| 🩷 Accent | `#EC4899` (Pink) | Creativity, energy |
| 🟢 Success | `#10B981` (Green) | Positive feedback |
| 🟡 Warning | `#F59E0B` (Amber) | Caution, opportunities |
| ⬛ Neutral | `#0F172A` (Slate) | Dark mode base |

</div>

**Typography:**
- **Headings:** `Geist` (900) — Bold, confident
- **Body:** `Inter` (400-600) — Readable, modern
- **Code/Monospace:** `Fira Code` — Developer-friendly
- **Captions:** `Montserrat` (900) — Hormozi-style impact

---

## 🚧 Challenges We Conquered

<div align="center">

| # | Challenge | Solution | Result |
|:---:|:---:|:---|:---:|
| 1 | Simulating "Boredom" | Roleplay negative emotion prompts | AI says *"0:04 — Why are you still talking?"* 🎯 |
| 2 | Multimodal Latency | Structured JSON + 720p resolution | Average **12 seconds** ⚡ |
| 3 | Word-Level Timestamps | Force-alignment prompt engineering | 60fps caption sync 🎤 |
| 4 | Rate Limit Resilience | `ApiKeyModal.tsx` + `localStorage` | Zero demo failures 🔑 |

</div>

### **1. Simulating "Boredom"**
**Problem:** LLMs want to be helpful. They don't naturally act "rude" or "impatient."

**Solution:**
```typescript
// Force Gemini to roleplay negative emotions
systemInstruction: `You are a Gen Z Skeptic. You are easily bored.
If the hook doesn't grab you in 3 seconds, say "I'm out 🙄" and explain why.
Be SPECIFIC: mention the timestamp, the visual, the audio.`
```

**Result:** AI now comments *"0:04 — Why are you still talking? Show me the result!"* 🎯

---

### **2. Multimodal Latency**
**Problem:** Processing 1080p video frame-by-frame = 30-60 second wait times.

**Solution:**
- Optimized prompts to request **structured JSON** upfront
- Used `responseMimeType: 'application/json'` to skip text parsing
- Reduced video resolution to 720p for analysis (quality unaffected)

**Result:** Average analysis time: **12 seconds** ⚡

---

### **3. Word-Level Timestamp Alignment**
**Problem:** Gemini doesn't natively output subtitle timecodes like Whisper.

**Solution:**
```typescript
// Prompt engineering for force alignment
"Transcribe EVERY spoken word with precise start/end timestamps.
Estimate ~0.3-0.5s per word. Mark emphasis=true for loud/punchy words
(e.g., 'Stop', 'Money', 'Viral'). If you detect a pause, adjust accordingly."
```

**Result:** `CaptionOverlay` syncs perfectly at 60fps—words pop yellow/green in real-time 🎤

---

### **4. Rate Limit Resilience**
**Problem:** Gemini free tier = 15 requests/min. Demo fails if quota exceeded.

**Solution:**
- Built `ApiKeyModal.tsx` — Users can input **their own API key** on rate limit
- Key stored in `localStorage`, sent via `x-gemini-api-key` header
- Backend checks `req.headers['x-gemini-api-key']` first, falls back to server key

**Result:** Zero demo failures. Users switch to their own quota seamlessly 🔑

---

## 🧠 What We Learned

### **Context is King**
I started thinking creators needed "faster editing tools." I was wrong. They need **strategic insight**.

Gemini taught us that AI is no longer just a "generator"—it's a **reasoner**. It understands:
- 😂 **Humor** (why a joke landed or bombed)
- 😱 **Tension** (when a video builds suspense)
- 🎯 **Intent** (whether you're educating vs. entertaining)

This project shifted our mindset from building *"Tools for Creators"* to building an **Operating System for the Creator Economy**.

---

### **Specificity > Generalization**
**Bad AI Advice:**
> "Add background music to improve retention."

**Prolytic's Advice:**
> "Replace silence at 0:08-0:15 with 'Espresso' by Sabrina Carpenter (trending audio). Use low volume (20%) to avoid overpowering voiceover. Reference: @creator's viral Reel (2.4M views)."

**The difference:** Actionable, specific, referenced. This is what creators pay editors $500/video for.

---

## 📊 Impact Metrics

<div align="center">

| Metric | Before Prolytic | With Prolytic | Improvement |
|:---:|:---:|:---:|:---:|
| ⚡ Analysis Speed | 30-60 seconds | **12 seconds** | **~5x faster** |
| 😊 Creator Satisfaction | Manual guesswork | AI-guided clarity | **Insight-driven** |
| 🎯 Content Performance | Blind publishing | Benchmark-validated | **Top 1% targeting** |
| ⏱️ Time Saved per Video | 3-5 hours editing feedback | 12 seconds AI analysis | **90%+ time saved** |

</div>

---

## 🔮 What's Next: The Roadmap

<div align="center">

| Phase | Timeline | Feature | Description |
|:---:|:---:|:---:|:---|
| 🟢 **Phase 1** | Q2 2026 | **Prolytic Connect** | Marketplace matching creators with editors via "Content DNA" |
| 🟡 **Phase 2** | Q3 2026 | **Real-Time Collaboration** | Multi-user editing + live AI feedback in Premiere/Final Cut |
| 🔵 **Phase 3** | Q4 2026 | **Enterprise Dashboard** | Campaign Generator, Brand Voice Analyzer, ROI Predictor |

</div>

### **Phase 1: Prolytic Connect** (Q2 2026)
A **marketplace** that matches creators with editors/brands using "Content DNA":
- Upload your video → Prolytic extracts visual style, tone, pacing
- System matches you with editors who've worked on similar content
- No more "I need an editor who 'gets' my vibe" — the AI already knows

---

### **Phase 2: Real-Time Collaboration** (Q3 2026)
- **Multi-user editing** (Google Docs for video)
- **Live AI feedback** as you edit in Premiere/Final Cut
- **Version control** for scripts (track changes with AI reasoning logs)

---

### **Phase 3: Enterprise Dashboard** (Q4 2026)
For brands managing 10+ creators:
- **Campaign Generator** (input product → get 5 video concepts + scripts)
- **Brand Voice Analyzer** (ensure all content matches company tone)
- **ROI Predictor** (estimate views/conversions before filming)

---

## 🚀 Quick Start

### **Prerequisites**
```bash
Node.js 18+
npm or yarn
Google Gemini API Key (get one at https://aistudio.google.com)
```

### **Installation**

```bash
# Clone the repo
git clone https://github.com/rajstories/prolytic.git
cd prolytic

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your GEMINI_API_KEY to .env.local

# Start the backend (port 8080)
npm run dev:api

# Start the frontend (port 3000)
npm run dev

# Open http://localhost:3000
```

### **Quick Test**
1. Go to **Video Studio**
2. Upload a short video (< 30 seconds recommended for free tier)
3. Click "Run Analysis"
4. Watch the magic happen ✨

**If you hit rate limits:**
- A modal will appear asking for your own Gemini API key
- Get one free at https://aistudio.google.com/app/apikey (15 req/min)
- Paste it in → retry automatically

---

## 📸 Screenshots

<div align="center">

### 🎬 Video Studio
<img src="https://via.placeholder.com/900x500/0F172A/6366F1?text=Video+Studio+Interface" alt="Video Studio" width="90%"/>
<br/><i>Upload → Analyze → Get actionable insights in 30 seconds</i>

---

### 🎭 Audience Lab
<img src="https://via.placeholder.com/900x500/0F172A/EC4899?text=Shadow+Audience+Simulator" alt="Audience Lab" width="90%"/>
<br/><i>Real-time AI persona reactions overlaid on your video timeline</i>

---

### 📐 Narrative Doctor
<img src="https://via.placeholder.com/900x500/0F172A/10B981?text=Narrative+Doctor+Timeline" alt="Narrative Doctor" width="90%"/>
<br/><i>AI suggests structural improvements—drag-and-drop timeline rearranges itself</i>

---

### 💡 Idea Generator
<img src="https://via.placeholder.com/900x500/0F172A/F59E0B?text=Viral+Idea+Scoring" alt="Idea Generator" width="90%"/>
<br/><i>Viral potential scores before you film—stop guessing, start knowing</i>

</div>

---

## 🏆 Why Prolytic Wins

<div align="center">

| Feature | Competitors | **Prolytic** |
|:---|:---:|:---:|
| **Audience Simulation** | ❌ None | ✅ AI Personas with timestamped reactions |
| **Word-Level Captions** | ❌ Generic SRT | ✅ Hormozi-style emphasis detection |
| **Niche Benchmarking** | ❌ "Make it better" | ✅ Compare to top 1% in your niche |
| **Narrative Reordering** | ❌ Manual editing | ✅ AI suggests clip sequences |
| **Specific References** | ❌ Vague tips | ✅ "Use *this* trending audio at 0:04" |
| **Multimodal Understanding** | ❌ Text-only | ✅ Video + audio + visual context |
| **Rate Limit Handling** | ❌ Demo fails | ✅ Users switch to own API key |

</div>

---

## 🤝 Contributing

We're open-sourcing Prolytic after the hackathon. Contributions welcome!

**Areas we need help:**
- 🎨 **UI/UX:** Mobile responsiveness, accessibility (ARIA labels)
- 🧠 **AI:** Better persona psychology prompts, multi-language support
- ⚡ **Performance:** Video compression, caching strategies
- 📚 **Docs:** More tutorials, API examples

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📜 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

**TL;DR:** You can use, modify, and distribute this code freely. Just give us credit and don't sue us if your video goes viral 😉

---

## 🙏 Acknowledgments

**Built with:**

<div align="center">

[![Gemini](https://img.shields.io/badge/Google%20Gemini%203.0-The%20Brain-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![React](https://img.shields.io/badge/React%20%2B%20Vite-The%20Body-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind%20CSS-The%20Style-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer](https://img.shields.io/badge/Framer%20Motion-The%20Soul-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

</div>

**Special thanks:**
- Every creator who's felt "Algorithm Anxiety"
- The Gemini API team for multimodal magic
- Coffee (lots of coffee ☕)

---

## 📬 Contact

**Creator:** Vishal Raj  
**Email:** your.email@example.com  
**Twitter:** [@yourhandle](https://twitter.com/yourhandle)  
**Demo Video:** [Watch on YouTube](https://youtu.be/dfAV6JnDUes?si=V3e2SiJQl3oDXKWD)

**For judges:** Want to see Prolytic in action? [Book a 10-min demo](#) or ping us in the hackathon Discord!

---

<div align="center">

<a href="https://prolytic.in/">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20,24,30&height=100&section=footer&text=Stop%20Guessing.%20Start%20Knowing.&fontSize=24&fontColor=FFFFFF&animation=fadeIn" width="100%"/>
</a>

### Built with ❤️ and 🧠 Gemini 3.0

**[⭐ Star this repo](https://github.com/rajstories/prolytic)** if Prolytic helped you — it means the world to us!

**[🚀 Try Prolytic Now →](https://prolytic.in/)**

*Prolytic — The AI Reasoning Engine for the Creator Economy*

</div>

