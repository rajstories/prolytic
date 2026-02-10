import React, { useMemo, useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Upload } from './ui/Icons';
import { ApiKeyModal } from './ApiKeyModal';
import { useApiKey } from '../contexts/ApiKeyContext';
import { useUserProfile } from '../contexts/UserProfileContext';

export type Clip = {
  id: string;
  label: string;
  type: 'boring' | 'exciting' | 'neutral';
  timestamp?: number;
  duration?: number;
};

const initialClips: Clip[] = [
  { id: 'clip1', label: 'Intro', type: 'boring' },
  { id: 'clip2', label: 'Context', type: 'neutral' },
  { id: 'clip3', label: 'Hook', type: 'exciting' },
  { id: 'clip4', label: 'Proof', type: 'neutral' },
  { id: 'clip5', label: 'Dead Air', type: 'boring' },
  { id: 'clip6', label: 'CTA', type: 'exciting' }
];

const clipTone = (type: Clip['type']) => {
  if (type === 'exciting') return 'bg-emerald-100 border-emerald-200 text-emerald-700';
  if (type === 'boring') return 'bg-rose-100 border-rose-200 text-rose-700';
  return 'bg-slate-100 border-slate-200 text-slate-700';
};

export const NarrativeDoctor: React.FC = () => {
  const [clips, setClips] = useState<Clip[]>(initialClips);
  const [logLines, setLogLines] = useState<string[]>([
    'System ready. Awaiting directive.'
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [useDemo, setUseDemo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { apiKey, setApiKey, showKeyModal, triggerKeyModal, closeKeyModal } = useApiKey();
  const { userProfile } = useUserProfile();

  const rawTimeline = useMemo(() => initialClips, []);

  const runDemo = async () => {
    setUseDemo(true);
    setLogLines([
      'Demo Mode: Analyzing sample structure...',
      "Detected: 'Buried Lead' in clip order.",
    ]);

    await new Promise((resolve) => setTimeout(resolve, 900));
    setLogLines((prev) => [
      ...prev,
      "Strategy: Move 'Hook' to 0:00.",
      "Strategy: Delete 'Dead Air'."
    ]);

    await new Promise((resolve) => setTimeout(resolve, 900));

    const hookClip = clips.find((clip) => clip.label === 'Hook');
    const remaining = clips.filter((clip) => clip.label !== 'Hook' && clip.label !== 'Dead Air');
    const reordered = hookClip ? [hookClip, ...remaining] : remaining;
    setClips(reordered);

    await new Promise((resolve) => setTimeout(resolve, 400));
    setLogLines((prev) => [...prev, "Director's Cut ready."]);
  };

  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
    });
  };

  const handleFixNarrative = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setError(null);

    // If no video uploaded, use demo mode
    if (!videoFile) {
      await runDemo();
      setIsRunning(false);
      return;
    }

    // Real API analysis
    try {
      setLogLines(['Uploading video to analysis engine...']);
      
      const videoBase64 = await toBase64(videoFile);

      setLogLines((prev) => [...prev, 'Running AI narrative analysis...']);

      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (apiKey) {
        headers['x-gemini-api-key'] = apiKey;
      }

      const response = await fetch('/api/analyze/narrative-structure', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          videoBase64,
          videoMimeType: videoFile.type,
          niche: userProfile.niche,
          struggle: userProfile.struggle
        })
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        const errorMsg = payload?.error || 'Narrative analysis failed.';
        
        // Check for rate limit
        if (errorMsg.includes('rate limit') || errorMsg.includes('429') || response.status === 429) {
          setError(errorMsg);
          triggerKeyModal();
          setIsRunning(false);
          return;
        }
        
        throw new Error(errorMsg);
      }

      const data = await response.json();
      
      // Update clips from API response
      if (data.clips && Array.isArray(data.clips)) {
        setClips(data.clips);
      }

      // Update reasoning logs
      if (data.reasoning && Array.isArray(data.reasoning)) {
        setLogLines(data.reasoning);
      }

      // Add problems to log
      if (data.problems && Array.isArray(data.problems)) {
        setLogLines((prev) => [...prev, '', '=== Detected Problems ===', ...data.problems]);
      }

      // Add reorder plan
      if (data.reorderPlan && Array.isArray(data.reorderPlan)) {
        setLogLines((prev) => [
          ...prev,
          '',
          '=== Reorder Plan ===',
          ...data.reorderPlan.map((r: any) => `Move "${r.clipId}" from position ${r.from} to ${r.to}: ${r.reason}`)
        ]);
      }

      setLogLines((prev) => [...prev, '', 'Analysis complete.']);

    } catch (err) {
      console.error('Narrative analysis failed:', err);
      await runDemo();
      setError('Live analysis unavailable. Demo mode applied.');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Narrative Doctor</h2>
          <p className="text-sm text-slate-500 mt-2">
            Upload a video to analyze narrative structure, or run demo mode to see how it works.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {useDemo && (
            <span className="text-xs px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              Demo Mode
            </span>
          )}
          <button
            onClick={handleFixNarrative}
            disabled={isRunning}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50"
          >
            {isRunning ? 'Analyzing…' : videoFile ? 'Analyze Video' : 'Run Demo'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Video Upload Section */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-slate-700 mb-3">Upload Video</label>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-colors"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-4 text-blue-600">
            <Upload className="w-6 h-6" />
          </div>
          <p className="text-sm text-slate-700 font-medium">
            {videoFile ? videoFile.name : 'Click to upload a video'}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            {videoFile ? `${(videoFile.size / 1024 / 1024).toFixed(2)} MB` : 'MP4, MOV, AVI - Max 100MB'}
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setVideoFile(file);
                setUseDemo(false);
                setError(null);
              }
            }}
          />
        </div>
        {videoFile && (
          <button
            onClick={() => {
              setVideoFile(null);
              setClips(initialClips);
              setLogLines(['System ready. Awaiting directive.']);
            }}
            className="mt-2 text-sm text-red-600 hover:text-red-700"
          >
            Remove video
          </button>
        )}
      </div>

      <div className="space-y-8">
        <section>
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Raw Footage</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {rawTimeline.map((clip) => (
              <div
                key={clip.id}
                className={`min-w-[150px] rounded-xl border px-4 py-3 text-sm font-medium ${clipTone(clip.type)}`}
              >
                {clip.label}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Reasoning Engine</h3>
          <div className="rounded-2xl border border-slate-200 bg-slate-950 text-slate-100 p-4 font-mono text-xs space-y-2">
            {logLines.map((line, idx) => (
              <div key={`${line}-${idx}`} className="text-emerald-300">
                {`> ${line}`}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Director&apos;s Cut</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            <AnimatePresence mode="popLayout">
              {clips.map((clip) => (
                <motion.div
                  layoutId={clip.id}
                  key={clip.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className={`min-w-[150px] rounded-xl border px-4 py-3 text-sm font-medium ${clipTone(clip.type)}`}
                >
                  {clip.label}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      </div>

      {/* API Key Modal */}
      <ApiKeyModal 
        isOpen={showKeyModal}
        onClose={closeKeyModal}
        onSubmit={setApiKey}
        currentKey={apiKey}
      />
    </div>
  );
};
