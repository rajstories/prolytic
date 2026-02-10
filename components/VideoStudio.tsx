import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, X, MessageSquare, Hash, Activity } from './ui/Icons';
import { analyzeVideo } from '../services/videoAnalysisService';
import { VideoAnalysisResult, VideoCaption, TimestampedWord } from '../types';
import { ImpactAnalytics } from './ImpactAnalytics';
import { ApiKeyModal } from './ApiKeyModal';
import { CaptionOverlay } from './CaptionOverlay';
import { useApiKey } from '../contexts/ApiKeyContext';
import { useUserProfile } from '../contexts/UserProfileContext';

const VideoStudio: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [analysis, setAnalysis] = useState<VideoAnalysisResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [hashtagsText, setHashtagsText] = useState('');
  const [videoTime, setVideoTime] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { apiKey, setApiKey, showKeyModal, triggerKeyModal, closeKeyModal } = useApiKey();
  const { userProfile } = useUserProfile();

  // Sync videoTime with the <video> element's currentTime (~60fps)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let rafId: number;
    const tick = () => {
      setVideoTime(video.currentTime);
      rafId = requestAnimationFrame(tick);
    };

    const onPlay = () => { rafId = requestAnimationFrame(tick); };
    const onPause = () => { cancelAnimationFrame(rafId); setVideoTime(video.currentTime); };
    const onSeeked = () => { setVideoTime(video.currentTime); };

    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('seeked', onSeeked);

    // If already playing when analysis finishes
    if (!video.paused) onPlay();

    return () => {
      cancelAnimationFrame(rafId);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('seeked', onSeeked);
    };
  }, [analysis]); // re-attach when analysis arrives

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      handleFileSelection(file);
    }
  };

  const handleFileSelection = (file: File) => {
    setVideoFile(file);
    setAnalysis(null);
    setError(null);
    setDescription('');
    setHashtagsText('');
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const clearVideo = () => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setVideoFile(null);
    setVideoUrl(null);
    setAnalysis(null);
    setError(null);
    setDescription('');
    setHashtagsText('');
    setIsProcessing(false);
  };

  const handleAnalyze = async () => {
    if (!videoFile || isProcessing) return;
    setIsProcessing(true);
    setError(null);
    try {
      const result = await analyzeVideo(videoFile, apiKey);
      setAnalysis(result);
      setDescription(result.socialAssets.description);
      setHashtagsText(result.socialAssets.hashtags.join(' '));
    } catch (err) {
      let message = err instanceof Error ? err.message : 'Video analysis failed.';
      
      // Check if it's a rate limit or invalid key error
      if (message.includes('rate limit') || message.includes('429') || message.includes('Too Many Requests') || message.includes('403') || message.includes('suspended') || message.includes('Permission denied')) {
        setError(message.includes('403') || message.includes('suspended') 
          ? 'API key is invalid or suspended. Please enter a new valid key.'
          : message);
        triggerKeyModal();
        return;
      }
      
      setError(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTimestamp = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="p-6 bg-white">
      <div className="grid grid-cols-1 gap-6">
        
        {/* Left Pane: The Stage */}
        <div className="flex flex-col bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden relative group min-h-[420px]">
          
          {videoUrl ? (
             <div className="relative w-full h-full bg-slate-950 flex items-center justify-center">
                <video 
                  ref={videoRef}
                  src={videoUrl} 
                  controls 
                  className="w-full max-h-full object-contain" 
                />
                {analysis?.wordCaptions?.length ? (
                  <CaptionOverlay videoTime={videoTime} captions={analysis.wordCaptions} />
                ) : null}
                <button 
                  onClick={clearVideo}
                  className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-4 right-4">
                  <button
                    onClick={handleAnalyze}
                    disabled={!videoFile || isProcessing}
                    className="bg-indigo-600 text-white text-xs font-semibold px-4 py-2 rounded-sm shadow-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <span className="inline-block h-3 w-3 border-2 border-white/60 border-t-white rounded-full animate-spin"></span>
                        Analyzing
                      </>
                    ) : (
                      'Run Analysis'
                    )}
                  </button>
                </div>
             </div>
          ) : (
            <div 
              className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed transition-all duration-200 m-4 rounded-lg bg-slate-50
                ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40'}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 border border-slate-200 shadow-sm">
                <Upload className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-slate-900 font-semibold text-lg mb-2">Upload Video Source</h3>
              <p className="text-slate-500 text-sm mb-6 max-w-md text-center">
                Drag and drop your raw video file here, or click to browse. 
                Supports MP4, MOV, and AVI up to 2GB.
              </p>
              <button className="bg-indigo-600 text-white text-sm font-medium px-6 py-2.5 rounded-sm hover:bg-indigo-700 transition-colors">
                Select File
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="video/*" 
                onChange={handleFileInputChange} 
              />
            </div>
          )}
          
          {/* Stage Label */}
          <div className="absolute top-0 left-0 px-6 py-4 pointer-events-none">
            <span className="text-slate-700 font-medium text-sm bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border border-slate-200">
              The Stage
            </span>
          </div>
        </div>

        {/* Right Pane: Intelligence Hub */}
        <div className="flex flex-col bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center">
            <h3 className="text-slate-900 font-semibold flex items-center gap-2.5">
              <Activity className="w-4 h-4 text-indigo-600" />
              Intelligence Hub
            </h3>
          </div>

          <div className="bg-slate-50 p-6 space-y-6">
            {error && (
              <div className="text-sm text-red-700 bg-red-50 border border-red-100 px-4 py-3 rounded-sm">
                {error}
              </div>
            )}
            
            {/* Card 1: Cinematic Captions */}
            <div className="bg-white p-5 rounded-sm border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-slate-500" />
                  Cinematic Captions
                </h4>
                <button
                  onClick={handleAnalyze}
                  disabled={!videoFile || isProcessing}
                  className="text-xs text-indigo-600 font-medium hover:text-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Analyzing…' : 'Generate'}
                </button>
              </div>
              <div className="space-y-3">
                {analysis?.captions?.length ? (
                  analysis.captions.map((caption, idx) => (
                    <div
                      key={`${caption.start}-${idx}`}
                      className="flex gap-3 items-start p-2 rounded-sm hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                    >
                      <span className="text-xs font-mono text-slate-400 mt-1">
                        [{formatTimestamp(caption.start)}]
                      </span>
                      <p className="text-sm text-slate-700 leading-snug">{caption.text}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-xs text-slate-400 italic">
                    {videoFile ? 'Run analysis to generate captions.' : 'Upload a video to begin.'}
                  </div>
                )}
              </div>
            </div>

            {/* Card 2: AI Post Pack */}
            <div className="bg-white p-5 rounded-sm border border-slate-200 shadow-sm">
              <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-4">
                <Hash className="w-4 h-4 text-slate-500" />
                AI Post Pack
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1.5 block">Description</label>
                  <textarea 
                    className="w-full p-3 text-sm text-slate-900 bg-white border border-slate-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none h-24"
                    placeholder="Generative description will appear here..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1.5 block">Recommended Hashtags</label>
                  <textarea
                    className="w-full p-3 text-sm text-slate-900 bg-white border border-slate-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none h-20"
                    placeholder="#Viral #Creator #Shorts"
                    value={hashtagsText}
                    onChange={(e) => setHashtagsText(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Card 3: Impact Analytics */}
            <div className="bg-white p-5 rounded-sm border border-slate-200 shadow-sm">
              <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-slate-500" />
                Impact Analytics
              </h4>
              <ImpactAnalytics audit={analysis?.reachAudit ?? null} loading={isProcessing} />
            </div>

          </div>
        </div>

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

export default VideoStudio;
