import React, { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Upload } from '../ui/Icons';
import { useApiKey } from '../../contexts/ApiKeyContext';
import { useUserProfile } from '../../contexts/UserProfileContext';
import { ApiKeyModal } from '../ApiKeyModal';
import { useAudienceSimulation } from '../../hooks/useAudienceSimulation';
import { SHADOW_SCENARIOS, ShadowComment } from '../../lib/shadow-data';

const personaOptions = ['Gen Z', 'Boomer', 'Tech Bro'] as const;

type Persona = (typeof personaOptions)[number];

const placeholderVideo =
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4';

const personaBorder: Record<string, string> = {
  'Gen Z': 'border-pink-400',
  'Boomer': 'border-amber-400',
  'Tech Bro': 'border-cyan-400',
  'Busy Mom': 'border-emerald-400'
};

export const AudienceLab: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [selectedPersonas, setSelectedPersonas] = useState<Persona[]>([...personaOptions]);
  const [videoContext, setVideoContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>(placeholderVideo);
  const [scenarioId, setScenarioId] = useState('tech-demo');
  const [liveComments, setLiveComments] = useState<ShadowComment[]>([]);

  const { headers, triggerKeyModal, showKeyModal, closeKeyModal, apiKey, setApiKey } = useApiKey();
  const { userProfile } = useUserProfile();

  const { activeComments } = useAudienceSimulation({
    videoRef,
    selectedPersonas,
    scenarioId,
    overrideComments: liveComments
  });

  const togglePersona = (persona: Persona) => {
    setSelectedPersonas((prev) =>
      prev.includes(persona) ? prev.filter((p) => p !== persona) : [...prev, persona]
    );
  };

  const canRun = selectedPersonas.length > 0 && !loading;

  const handleFileUpload = (file: File | null) => {
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setError(null);
    }
  };

  const runSimulation = async () => {
    if (!canRun) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/analyze/shadow-audience', {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          videoContext: videoContext || 'Short product demo for creators.',
          personas: selectedPersonas,
          niche: userProfile.niche,
          audience: userProfile.audience
        })
      });

      const data = await response.json();

      if (response.status === 429 || response.status === 403) {
        triggerKeyModal();
        setError(response.status === 403 
          ? 'API key is invalid or suspended. Please enter a new valid key.' 
          : 'Rate limit exceeded. Please add your own API key.');
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || 'Shadow Audience simulation failed.');
      }

      const normalized: ShadowComment[] = data.map((item: any) => ({
        time: item.timestamp,
        persona: item.persona as ShadowComment['persona'],
        text: item.comment,
        sentiment: item.sentiment
      }));

      setLiveComments(normalized);
      setScenarioId('live');
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        await videoRef.current.play();
      }
    } catch (err) {
      setLiveComments([]);
      setScenarioId(
        videoContext.toLowerCase().includes('lifestyle') ? 'lifestyle-demo' : 'tech-demo'
      );
      setError(err instanceof Error ? err.message : 'Simulation failed.');
    } finally {
      setLoading(false);
    }
  };

  const personaLabels = useMemo(
    () => selectedPersonas.join(', ') || 'No personas selected',
    [selectedPersonas]
  );

  return (
    <div className="p-8">
      <div className="rounded-3xl border border-slate-200 bg-white text-slate-900 p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Shadow Audience Simulator</h2>
            <p className="text-sm text-slate-500 mt-2">
              Simulate how distinct AI personas react in real time as your video plays.
            </p>
          </div>
          <div className="text-xs uppercase tracking-[0.3em] text-blue-600 font-semibold">
            Audience Lab
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="space-y-6"
          >
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-900 mb-3">Upload Video</p>
              <label className="border border-dashed border-slate-200 rounded-xl p-5 text-center text-slate-500 bg-white block cursor-pointer hover:border-blue-300 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mx-auto mb-3 text-blue-600">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-sm">
                  {videoFile ? videoFile.name : 'Click or drop a video here'}
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  {videoFile ? 'Video uploaded successfully' : 'MP4, MOV, or use text context below'}
                </p>
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files?.[0] || null)}
                />
              </label>
              {videoFile && (
                <button
                  onClick={() => {
                    setVideoFile(null);
                    setVideoUrl(placeholderVideo);
                  }}
                  className="mt-2 text-xs text-red-600 hover:text-red-700"
                >
                  Remove video
                </button>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-900 mb-3">Select Personas</p>
              <div className="space-y-3">
                {personaOptions.map((persona) => (
                  <label
                    key={persona}
                    className="flex items-center gap-3 text-sm text-slate-700"
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 bg-white text-blue-600"
                      checked={selectedPersonas.includes(persona)}
                      onChange={() => togglePersona(persona)}
                    />
                    {persona}
                  </label>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-4">Active: {personaLabels}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-900 mb-3">Video Context</p>
              <textarea
                value={videoContext}
                onChange={(event) => setVideoContext(event.target.value)}
                placeholder="Describe the video in one or two sentences."
                className="w-full min-h-[100px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>

            <button
              onClick={runSimulation}
              disabled={!canRun}
              className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Running Simulation…' : 'Run Simulation'}
            </button>

            {error && <p className="text-sm text-red-500">{error}</p>}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.05 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Shadow Player</p>
                <h3 className="text-lg font-semibold text-slate-900">Live Persona Commentary</h3>
              </div>
              <span className="text-xs text-slate-500">
                {(liveComments.length ? liveComments : SHADOW_SCENARIOS[scenarioId] || []).length} events
              </span>
            </div>
            <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <video
                ref={videoRef}
                src={videoUrl}
                controls
                className="w-full h-auto bg-black"
              />
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute right-4 top-4 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-600 shadow-sm">
                  Demo Mode
                </div>
                <div className="absolute right-6 top-6 flex flex-col gap-3">
                  <AnimatePresence mode="popLayout">
                    {activeComments.map((comment) => (
                      <motion.div
                        key={`${comment.persona}-${comment.time}`}
                        initial={{ opacity: 0, x: 80 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 80 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className={`max-w-xs rounded-xl border-l-4 ${
                          personaBorder[comment.persona] ?? 'border-slate-500'
                        } bg-white/90 px-4 py-3 text-sm text-slate-900 shadow-xl backdrop-blur`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs uppercase tracking-wide text-slate-500">
                            {comment.persona}
                          </span>
                          <span className="text-[10px] text-slate-500">{comment.time}s</span>
                        </div>
                        <p className="leading-relaxed">{comment.text}</p>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
              Overlay updates trigger as the playhead crosses persona timestamps.
            </div>
          </motion.div>
        </div>
      </div>

      <ApiKeyModal 
        isOpen={showKeyModal}
        onClose={closeKeyModal}
        onSubmit={setApiKey}
      />
    </div>
  );
};
