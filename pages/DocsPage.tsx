import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DocHero } from '../components/docs/DocHero';
import { CodeBlock } from '../components/docs/CodeBlock';
import { Callout } from '../components/docs/Callout';

const sidebarItems = [
  { id: 'getting-started', label: 'Getting Started' },
  { id: 'core-architecture', label: 'Core Architecture' },
  { id: 'gemini-integration', label: 'Gemini Integration' },
  { id: 'api-reference', label: 'API Reference' }
];

const tocItems = {
  'getting-started': [
    { id: 'intro', label: 'Overview' },
    { id: 'env-setup', label: 'Environment Setup' },
    { id: 'cold-start', label: 'Cold Start' }
  ],
  'core-architecture': [
    { id: 'introduction', label: 'Introduction' },
    { id: 'multimodal-pipeline', label: 'The Multimodal Pipeline' },
    { id: 'why-this-wins', label: 'Why This Wins' }
  ],
  'gemini-integration': [
    { id: 'beyond-text', label: 'Beyond Text' },
    { id: 'prompt-strategy', label: 'Prompt Strategy' },
    { id: 'narrative-arc', label: 'Narrative Arc' }
  ],
  'api-reference': [
    { id: 'typed-interfaces', label: 'Typed Interfaces' },
    { id: 'analyze-video', label: 'analyzeVideo(File)' },
    { id: 'audit-instagram', label: 'auditInstagram(Handle)' }
  ]
} as const;

const GettingStartedSection: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="space-y-10"
    >
      <section id="intro" className="space-y-4">
        <h2 className="text-2xl font-semibold">Zero to Analysis in 60 Seconds.</h2>
        <p className="text-slate-600 leading-relaxed max-w-4xl">
          Prolytic is architected as a local-first, privacy-aware workspace. Getting the
          retention engine running locally requires valid API keys for the Multimodal
          Pipeline.
        </p>
      </section>
      <section id="env-setup" className="space-y-5">
        <h3 className="text-xl font-semibold">Step 1: Environment Setup</h3>
        <CodeBlock filename=".env.local" language="bash">
{`# The Brain (Multimodal)
GOOGLE_GEMINI_API_KEY=AIzaSy...

# The Data Source (Graph API)
INSTAGRAM_CLIENT_ID=8493...
INSTAGRAM_CLIENT_SECRET=...

# The Engine
NEXT_PUBLIC_ANALYSIS_MODE="turbo" # Options: turbo | deep-audit`}
        </CodeBlock>
      </section>
      <section id="cold-start" className="space-y-4">
        <h3 className="text-xl font-semibold">Step 2: The Cold Start</h3>
        <p className="text-slate-600 leading-relaxed max-w-4xl">
          On first run, Prolytic warms up the Gemini context window to stabilize latency and
          calibrate the retention model. After that initial spin-up, analysis requests
          execute at interactive speeds.
        </p>
      </section>
    </motion.section>
  );
};

const GeminiIntegrationSection: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="space-y-10"
    >
      <section id="beyond-text" className="space-y-4">
        <h2 className="text-2xl font-semibold">Beyond Text: Frame-by-Frame Reasoning.</h2>
        <p className="text-slate-600 leading-relaxed max-w-4xl">
          We do not rely on FFmpeg-based transcription pipelines. Prolytic streams Native
          Video Tokens into Gemini 2.0 Flash, preserving motion, composition, and pacing
          signals that never appear in text.
        </p>
      </section>
      <section id="prompt-strategy" className="space-y-5">
        <h3 className="text-xl font-semibold">Prompt Engineering Strategy</h3>
        <CodeBlock filename="schema.ts" language="ts">
          <span className="text-slate-400">
            // We enforce a strict schema to guarantee UI compatibility
          </span>
          {'\n'}
          <span className="text-blue-400">const</span>{' '}
          <span className="text-slate-100">schema</span>{' '}
          <span className="text-blue-400">=</span>{' '}
          <span className="text-slate-100">{`{`}</span>
          {'\n  '}
          <span className="text-slate-100">viralityScore</span>
          <span className="text-blue-400">:</span>{' '}
          <span className="text-slate-100">SchemaType</span>
          <span className="text-blue-400">.</span>
          <span className="text-slate-100">NUMBER</span>
          <span className="text-blue-400">,</span>
          {'\n  '}
          <span className="text-slate-100">pacingAnalysis</span>
          <span className="text-blue-400">:</span>{' '}
          <span className="text-slate-100">{`{`}</span>
          {'\n    '}
          <span className="text-slate-100">deadAir</span>
          <span className="text-blue-400">:</span>{' '}
          <span className="text-slate-100">SchemaType</span>
          <span className="text-blue-400">.</span>
          <span className="text-slate-100">ARRAY</span>
          <span className="text-slate-100">(</span>
          <span className="text-slate-100">Timestamp</span>
          <span className="text-slate-100">)</span>
          <span className="text-blue-400">,</span>
          {'\n    '}
          <span className="text-slate-100">hookStrength</span>
          <span className="text-blue-400">:</span>{' '}
          <span className="text-slate-100">SchemaType</span>
          <span className="text-blue-400">.</span>
          <span className="text-slate-100">STRING</span>
          <span className="text-blue-400">,</span>{' '}
          <span className="text-slate-400">// "High" | "Medium" | "Low"</span>
          {'\n  '}
          <span className="text-slate-100">{`}`}</span>
          <span className="text-blue-400">,</span>
          {'\n  '}
          <span className="text-slate-100">retentionTriggers</span>
          <span className="text-blue-400">:</span>{' '}
          <span className="text-slate-100">SchemaType</span>
          <span className="text-blue-400">.</span>
          <span className="text-slate-100">ARRAY</span>
          <span className="text-slate-100">(</span>
          <span className="text-slate-100">{`{`}</span>
          {'\n    '}
          <span className="text-slate-100">timestamp</span>
          <span className="text-blue-400">:</span>{' '}
          <span className="text-slate-100">SchemaType</span>
          <span className="text-blue-400">.</span>
          <span className="text-slate-100">STRING</span>
          <span className="text-blue-400">,</span>
          {'\n    '}
          <span className="text-slate-100">visualCue</span>
          <span className="text-blue-400">:</span>{' '}
          <span className="text-slate-100">SchemaType</span>
          <span className="text-blue-400">.</span>
          <span className="text-slate-100">STRING</span>
          <span className="text-blue-400">,</span>{' '}
          <span className="text-slate-400">// e.g., "Rapid Zoom", "Face Reveal"</span>
          {'\n  '}
          <span className="text-slate-100">{`}`}</span>
          <span className="text-slate-100">)</span>
          {'\n'}
          <span className="text-slate-100">{`}`}</span>
          <span className="text-blue-400">;</span>
        </CodeBlock>
      </section>
      <section id="narrative-arc" className="space-y-4">
        <Callout title="Pro Tip">
          By utilizing Gemini 2.0 Flash&apos;s 1M+ token window, Prolytic maintains the
          &quot;Narrative Arc&quot; of long-form video, detecting plot holes that snippet-based
          AI misses.
        </Callout>
      </section>
    </motion.section>
  );
};

const ApiReferenceSection: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="space-y-10"
    >
      <section id="typed-interfaces" className="space-y-4">
        <h2 className="text-2xl font-semibold">Typed Interfaces &amp; Server Actions.</h2>
        <p className="text-slate-600 leading-relaxed max-w-4xl">
          Prolytic exposes fully typed Server Actions for direct integration. Every response
          is schema-validated, ensuring downstream UI layers remain deterministic.
        </p>
      </section>
      <section id="analyze-video" className="space-y-5">
        <h3 className="text-xl font-semibold">analyzeVideo(File)</h3>
        <CodeBlock filename="analyzeVideo.ts" language="ts">
{`// Request
const result = await analyzeVideo(file);

// Response
{
  "virality_score": 92,
  "sentiment": "High Energy",
  "captions": [{ "start": 0, "text": "..." }],
  "reach_audit": { "engagementScore": 88 }
}`}
        </CodeBlock>
      </section>
      <section id="audit-instagram" className="space-y-5">
        <h3 className="text-xl font-semibold">auditInstagram(Handle)</h3>
        <p className="text-slate-600 leading-relaxed max-w-4xl">
          We fetch real audience telemetry via the Instagram Graph API and reconcile it
          against model predictions to calibrate performance and credibility.
        </p>
        <CodeBlock filename="auditInstagram.ts" language="ts">
{`const report = await auditInstagram('@creator');

// Returns real follower + reach data to validate predictions
return {
  followers: 128540,
  reach: 96420,
  confidence: "High"
};`}
        </CodeBlock>
      </section>
    </motion.section>
  );
};

export const DocsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('getting-started');

  const renderContent = () => {
    switch (activeSection) {
      case 'getting-started':
        return <GettingStartedSection />;
      case 'gemini-integration':
        return <GeminiIntegrationSection />;
      case 'api-reference':
        return <ApiReferenceSection />;
      case 'core-architecture':
      default:
        return (
          <>
            <DocHero
              title="Engineering the Multimodal Retention Engine"
              subtitle="Prolytic is the first multimodal retention engine built for modern creators. Every frame is interpreted, ranked, and converted into actionable insights that ship directly into your editing workflow."
            />

            <section id="introduction" className="space-y-5">
              <h2 className="text-2xl font-semibold">Introduction</h2>
              <p className="text-slate-600 leading-relaxed max-w-4xl">
                Prolytic is the first multimodal retention engine that treats video, audio,
                and cultural context as a single signal. Instead of guessing performance from
                transcripts, we stream real video tokens directly into Gemini to model viewer
                attention at the frame level.
              </p>
              <Callout title="Pro Tip">
                Prolytic audits your content against millions of viral data points using
                Gemini&apos;s reasoning capabilities.
              </Callout>
            </section>

            <section id="multimodal-pipeline" className="space-y-6">
              <h2 className="text-2xl font-semibold">The Multimodal Pipeline</h2>
              <p className="text-slate-600 leading-relaxed max-w-4xl">
                Prolytic streams video tokens directly to Gemini 2.0 Flash using a
                Frame-to-JSON architecture. Every scene change, pacing shift, and tonal cue
                is captured in a single pass, then compiled into structured JSON that powers
                your dashboards, captions, and highlights.
              </p>
              <CodeBlock filename="pipeline.ts" language="ts">
{`import { gemini } from '@prolytic/gemini';

const frameStream = await captureFrames(video);
const response = await gemini.stream({
  model: 'gemini-2.0-flash',
  input: frameStream,
  output: 'frame-to-json'
});

return response.json();`}
              </CodeBlock>
            </section>

            <section id="why-this-wins" className="space-y-6">
              <h2 className="text-2xl font-semibold">Why This Wins</h2>
              <p className="text-slate-600 leading-relaxed max-w-4xl">
                Native Video Tokenization means Prolytic observes the cues that make content
                shareable: smiles, micro-pauses, scene transitions, and emotional peaks. This
                allows us to compute a Virality Score that traditional speech-to-text tools
                simply cannot reach.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CodeBlock filename="retention-score.ts" language="ts">
{`const viralityScore = await gemini.reason({
  tokens: videoTokens,
  context: 'audience-retention',
  window: 'long-form'
});

return { viralityScore };`}
                </CodeBlock>
                <div className="space-y-4 text-slate-600">
                  <p className="leading-relaxed">
                    Native Multimodal Reasoning: Unlike legacy tools that rely on transcripts,
                    Prolytic "watches" the video pixel-by-pixel to understand visual humor,
                    pacing, and emotional cues.
                  </p>
                  <p className="leading-relaxed">
                    Long-Form Context Awareness: Capable of holding the entire narrative arc
                    in memory to detect plot holes and pacing issues across extended content.
                  </p>
                </div>
              </div>
            </section>
          </>
        );
    }
  };

  const activeToc = tocItems[activeSection as keyof typeof tocItems] ?? [];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10">
          <motion.aside
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="sticky top-20 h-fit space-y-4"
          >
            <div className="text-sm uppercase tracking-[0.35em] text-slate-900 font-bold">
              Documentation
            </div>
            <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition border-l-2 ${
                    activeSection === item.id
                      ? 'bg-blue-500/10 border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </motion.aside>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_220px] gap-10">
            <main className="space-y-12">{renderContent()}</main>

            <motion.aside
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
              className="sticky top-24 h-fit border border-slate-200 rounded-xl p-5 bg-white shadow-sm"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400 font-semibold">
                On this page
              </p>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                {activeToc.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="hover:text-slate-900 transition"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.aside>
          </div>
        </div>
      </div>
    </div>
  );
};
