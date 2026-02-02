import React, { useState } from 'react';

type DocTab = {
  id: 'tokenization' | 'semantic' | 'predictive';
  label: string;
  description: string;
  code: React.ReactNode;
};

const tabs: DocTab[] = [
  {
    id: 'tokenization',
    label: 'Video Tokenization',
    description: 'Frame-by-frame embeddings mapped into a unified token stream.',
    code: (
      <>
        <div className="text-slate-400">// Tokenize multimodal inputs</div>
        <div>
          <span className="text-blue-400">const</span>{' '}
          <span className="text-slate-100">tokens</span>{' '}
          <span className="text-blue-400">=</span>{' '}
          <span className="text-slate-100">await</span>{' '}
          <span className="text-slate-100">gemini</span>
          <span className="text-blue-400">.</span>
          <span className="text-slate-100">tokenize</span>
          <span className="text-slate-100">(</span>
          <span className="text-slate-100">{`{`}</span>
          <span className="text-slate-100"> video, audio, metadata </span>
          <span className="text-slate-100">{`}`}</span>
          <span className="text-slate-100">)</span>
          <span className="text-blue-400">;</span>
        </div>
        <div>
          <span className="text-blue-400">const</span>{' '}
          <span className="text-slate-100">segments</span>{' '}
          <span className="text-blue-400">=</span>{' '}
          <span className="text-slate-100">tokens</span>
          <span className="text-blue-400">.</span>
          <span className="text-slate-100">chunk</span>
          <span className="text-slate-100">(</span>
          <span className="text-emerald-300">240</span>
          <span className="text-slate-100">)</span>
          <span className="text-blue-400">;</span>
        </div>
        <div className="text-slate-400">// Align with frames + audio beats</div>
        <div>
          <span className="text-blue-400">return</span>{' '}
          <span className="text-slate-100">alignTimeline</span>
          <span className="text-slate-100">(</span>
          <span className="text-slate-100">segments</span>
          <span className="text-slate-100">)</span>
          <span className="text-blue-400">;</span>
        </div>
      </>
    )
  },
  {
    id: 'semantic',
    label: 'Semantic Analysis',
    description: 'Narrative-level reasoning across visuals, dialogue, and tone.',
    code: (
      <>
        <div className="text-slate-400">
          // 1M+ token context window allows full narrative arc analysis.
        </div>
        <div>
          <span className="text-blue-400">const</span>{' '}
          <span className="text-slate-100">analysis</span>{' '}
          <span className="text-blue-400">=</span>{' '}
          <span className="text-slate-100">await</span>{' '}
          <span className="text-slate-100">gemini</span>
          <span className="text-blue-400">.</span>
          <span className="text-slate-100">reason</span>
          <span className="text-slate-100">(</span>
          <span className="text-slate-100">{`{`}</span>
          <span className="text-slate-100"> timeline, tone, pacing </span>
          <span className="text-slate-100">{`}`}</span>
          <span className="text-slate-100">)</span>
          <span className="text-blue-400">;</span>
        </div>
        <div>
          <span className="text-blue-400">const</span>{' '}
          <span className="text-slate-100">insights</span>{' '}
          <span className="text-blue-400">=</span>{' '}
          <span className="text-slate-100">analysis</span>
          <span className="text-blue-400">.</span>
          <span className="text-slate-100">map</span>
          <span className="text-slate-100">(</span>
          <span className="text-slate-100">detectRetentionDrops</span>
          <span className="text-slate-100">)</span>
          <span className="text-blue-400">;</span>
        </div>
        <div>
          <span className="text-blue-400">return</span>{' '}
          <span className="text-slate-100">summarize</span>
          <span className="text-slate-100">(</span>
          <span className="text-slate-100">insights</span>
          <span className="text-slate-100">)</span>
          <span className="text-blue-400">;</span>
        </div>
      </>
    )
  },
  {
    id: 'predictive',
    label: 'Predictive JSON',
    description: 'Production-ready outputs for UI, captions, and KPI layers.',
    code: (
      <>
        <div className="text-slate-400">// JSON contract consumed by UI</div>
        <div>
          <span className="text-blue-400">type</span>{' '}
          <span className="text-slate-100">PredictiveOutput</span>{' '}
          <span className="text-blue-400">=</span>{' '}
          <span className="text-slate-100">{`{`}</span>
        </div>
        <div className="pl-6">
          <span className="text-slate-100">viralityScore</span>
          <span className="text-blue-400">:</span>{' '}
          <span className="text-slate-100">number</span>
          <span className="text-blue-400">;</span>
        </div>
        <div className="pl-6">
          <span className="text-slate-100">hookStrength</span>
          <span className="text-blue-400">:</span>{' '}
          <span className="text-slate-100">string</span>
          <span className="text-blue-400">;</span>
        </div>
        <div>
          <span className="text-slate-100">{`}`}</span>
        </div>
        <div className="mt-4 text-slate-400">// Example output</div>
        <div>
          <span className="text-slate-100">{'{ '}</span>
          <span className="text-emerald-300">"viralityScore"</span>
          <span className="text-blue-400">:</span>{' '}
          <span className="text-emerald-300">92</span>
          <span className="text-slate-100">, </span>
          <span className="text-emerald-300">"hookStrength"</span>
          <span className="text-blue-400">:</span>{' '}
          <span className="text-emerald-300">"High"</span>
          <span className="text-slate-100">{' }'}</span>
        </div>
      </>
    )
  }
];

export const Architecture: React.FC = () => {
  const [active, setActive] = useState<DocTab['id']>('tokenization');
  const activeTab = tabs.find((tab) => tab.id === active) ?? tabs[0];

  return (
    <section className="py-24 md:py-32 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-300 mb-4">
            Documentation
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Built on the World&apos;s Most Advanced Multimodal Model.
          </h2>
          <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
            Prolytic leverages Gemini 2.0 Flash to process video, audio, and cultural
            context simultaneously—delivering frame-accurate retention data in
            milliseconds.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={`w-full text-left rounded-xl border px-5 py-4 transition-all ${
                  active === tab.id
                    ? 'border-blue-400/60 bg-slate-800/60 shadow-lg shadow-blue-500/10'
                    : 'border-slate-700/70 bg-slate-900/60 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-white">{tab.label}</h3>
                  <span
                    className={`text-xs uppercase tracking-[0.2em] ${
                      active === tab.id ? 'text-blue-300' : 'text-slate-500'
                    }`}
                  >
                    {active === tab.id ? 'Active' : 'Select'}
                  </span>
                </div>
                <p className="text-sm text-slate-400 mt-2">{tab.description}</p>
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-700/70 bg-slate-950/60 shadow-2xl shadow-slate-950/40 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/70">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400/80"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-400/80"></span>
                <span className="w-3 h-3 rounded-full bg-green-400/80"></span>
              </div>
              <span className="text-xs text-slate-500 font-mono">prolytic.ts</span>
            </div>
            <div className="p-6 text-sm md:text-base font-mono leading-relaxed">
              <div className="text-slate-500 mb-3">// {activeTab.label}</div>
              <pre className="whitespace-pre-wrap text-slate-100">{activeTab.code}</pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
