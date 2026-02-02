import React, { useState, useRef } from 'react';
import { Upload, X, MessageSquare, TrendingUp, Hash, Activity } from './ui/Icons';
import { analyzeVideo } from '../services/videoAnalysisService';
import { VideoAnalysisResult, VideoCaption } from '../types';

const VideoStudio: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [analysis, setAnalysis] = useState<VideoAnalysisResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [hashtagsText, setHashtagsText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      const result = await analyzeVideo(videoFile);
      setAnalysis(result);
      setDescription(result.socialAssets.description);
      setHashtagsText(result.socialAssets.hashtags.join(' '));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Video analysis failed.';
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

  const CinematicCaptionOverlay = ({ captions }: { captions: VideoCaption[] }) => (
    <div className="absolute inset-0 flex items-end justify-center pb-8 pointer-events-none">
      <div
        className="space-y-2 text-center"
        style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}
      >
        {captions.map((caption, idx) => (
          <div
            key={`${caption.start}-${idx}`}
            className="text-white text-lg md:text-2xl font-semibold tracking-[0.2em] uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)] bg-black/35 backdrop-blur-sm px-4 py-2 rounded-md"
          >
            {caption.text}
          </div>
        ))}
      </div>
    </div>
  );

  const ImpactAnalyticsSkeleton = () => (
    <div className="space-y-4 animate-pulse">
      <div className="h-5 w-40 bg-slate-200 rounded-sm"></div>
      <div className="h-10 w-full bg-slate-100 rounded-sm"></div>
      <div className="space-y-2">
        <div className="h-3 w-full bg-slate-100 rounded-sm"></div>
        <div className="h-3 w-5/6 bg-slate-100 rounded-sm"></div>
        <div className="h-3 w-2/3 bg-slate-100 rounded-sm"></div>
      </div>
    </div>
  );

  return (
    <div className="p-6 h-full flex flex-col min-h-0 bg-white">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        
        {/* Left Pane: The Stage */}
        <div className="lg:col-span-2 flex flex-col bg-slate-900 border border-slate-200 rounded-lg shadow-sm overflow-hidden relative group">
          
          {videoUrl ? (
             <div className="relative w-full h-full bg-black flex items-center justify-center">
                <video 
                  src={videoUrl} 
                  controls 
                  className="w-full max-h-full object-contain" 
                />
                {analysis?.captions?.length ? (
                  <CinematicCaptionOverlay captions={analysis.captions} />
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
              className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed transition-all duration-200 m-4 rounded-lg
                ${isDragging ? 'border-indigo-500 bg-slate-800' : 'border-slate-700 bg-slate-900 hover:bg-slate-800'}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 border border-slate-700">
                <Upload className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="text-white font-medium text-lg mb-2">Upload Video Source</h3>
              <p className="text-slate-400 text-sm mb-6 max-w-md text-center">
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
            <span className="text-white/80 font-medium text-sm bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
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

          <div className="flex-1 overflow-y-auto bg-slate-50 p-6 space-y-6">
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
                <TrendingUp className="w-4 h-4 text-slate-500" />
                Impact Analytics
              </h4>
              
              <div className="space-y-4">
                {isProcessing ? (
                  <ImpactAnalyticsSkeleton />
                ) : analysis ? (
                  <>
                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-xs font-medium text-slate-600">Engagement Score (First 3s)</span>
                        <span className="text-sm font-bold text-slate-900">
                          {analysis.reachAudit.engagementScore}/100
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full"
                          style={{
                            width: `${Math.min(100, Math.max(0, analysis.reachAudit.engagementScore))}%`
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-sm border border-slate-100">
                      <p className="text-xs font-semibold text-slate-900 mb-2">Improvements</p>
                      <ul className="space-y-1 text-xs text-slate-600">
                        {analysis.reachAudit.improvements.map((item, idx) => (
                          <li key={`${item}-${idx}`} className="flex items-start gap-2">
                            <span className="text-indigo-500 font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  <div className="text-xs text-slate-400 italic">
                    {videoFile ? 'Run analysis to see impact analytics.' : 'Upload a video to begin.'}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default VideoStudio;
