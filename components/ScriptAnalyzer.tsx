import React, { useState, useRef } from 'react';
import { 
  AreaChart, Area, ResponsiveContainer, XAxis, Tooltip
} from 'recharts';
import { ScriptAnalysisResult } from '../types';
import { useApiKey } from '../contexts/ApiKeyContext';
import { useUserProfile } from '../contexts/UserProfileContext';
import { ApiKeyModal } from './ApiKeyModal';
import { useDashboardData } from './dashboard/DashboardDataContext';
import { DEMO_RESULT as FALLBACK_DEMO_RESULT, retentionMockData as FALLBACK_RETENTION } from '../services/mockData';
import { Loader, TrendingUp, Film, Upload, Activity, Zap, X, Eye, Sun, MessageSquare } from './ui/Icons';

const AnalysisSkeleton: React.FC = () => (
  <div className="space-y-4 animate-pulse">
    <div className="bg-white p-6 rounded-lg border border-slate-200">
      <div className="h-3 w-28 bg-slate-200 rounded mb-3"></div>
      <div className="h-6 w-40 bg-slate-200 rounded"></div>
    </div>
    <div className="bg-white p-6 rounded-lg border border-slate-200 space-y-3">
      <div className="h-3 w-36 bg-slate-200 rounded"></div>
      <div className="h-4 w-full bg-slate-200 rounded"></div>
      <div className="h-4 w-5/6 bg-slate-200 rounded"></div>
      <div className="h-4 w-4/6 bg-slate-200 rounded"></div>
    </div>
    <div className="bg-white p-6 rounded-lg border border-slate-200 space-y-3">
      <div className="h-3 w-32 bg-slate-200 rounded"></div>
      <div className="h-4 w-full bg-slate-200 rounded"></div>
      <div className="h-4 w-5/6 bg-slate-200 rounded"></div>
    </div>
  </div>
);

const ScriptAnalyzer: React.FC = () => {
  const { data: dashboardData, loading: dashboardLoading } = useDashboardData();
  const [script, setScript] = useState('');
  const [analysis, setAnalysis] = useState<ScriptAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const { headers, triggerKeyModal, showKeyModal, closeKeyModal, apiKey, setApiKey } = useApiKey();
  const { userProfile } = useUserProfile();
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const demoResult = dashboardData?.demoResult ?? FALLBACK_DEMO_RESULT;
  const retentionMockData =
    dashboardData?.retentionMockData ?? FALLBACK_RETENTION;

  const handleAnalyze = async () => {
    if (!script.trim()) return;
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/script', {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          script,
          niche: userProfile.niche,
          goal: userProfile.goal,
          struggle: userProfile.struggle,
          videoLength: userProfile.videoLength
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
        throw new Error(data.error || 'Analysis failed');
      }

      setAnalysis(data);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
    
    // Simple text file handling for demonstration
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'text/plain' || file.name.endsWith('.md'))) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setScript(event.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  const clearWorkspace = () => {
    setScript('');
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="p-6 h-full flex flex-col min-h-0 bg-white">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        
        {/* Left Panel: Video Workspace */}
        <div className="flex flex-col bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center">
            <h3 className="text-slate-900 font-semibold flex items-center gap-2.5">
              <Film className="w-4 h-4 text-indigo-600" />
              Video Workspace
            </h3>
            {script && (
              <button onClick={clearWorkspace} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div className="flex-1 flex flex-col p-6 bg-white relative">
            <div 
              className={`flex-1 relative flex flex-col rounded-lg transition-all duration-200 ${
                !script ? 'border-2 border-dashed border-slate-200 hover:border-indigo-300 hover:bg-slate-50' : 'border border-slate-200'
              } ${isDragging ? 'border-indigo-500 bg-indigo-50' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !script && textareaRef.current?.focus()}
            >
              {!script && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-6 text-center">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center mb-4 text-indigo-600">
                    <Upload className="w-6 h-6" />
                  </div>
                  <h4 className="text-slate-900 font-medium mb-1">Drag & drop video script</h4>
                  <p className="text-slate-500 text-sm max-w-[240px]">
                    Upload a .txt or .md file, or paste your video concept directly.
                  </p>
                </div>
              )}
              
              <textarea
                ref={textareaRef}
                className={`w-full h-full p-6 bg-transparent resize-none focus:outline-none focus:ring-0 text-slate-800 text-sm leading-relaxed font-mono ${!script ? 'absolute inset-0 z-10' : ''}`}
                placeholder=""
                value={script}
                onChange={(e) => setScript(e.target.value)}
              />
            </div>

            <div className="mt-6">
              <button
                onClick={handleAnalyze}
                disabled={loading || !script.trim()}
                className="w-full bg-slate-900 text-white font-medium py-3.5 px-6 rounded-[6px] shadow-sm hover:shadow-md hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.99] flex items-center justify-center gap-2.5"
              >
                {loading ? (
                  <Loader className="w-5 h-5" />
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-indigo-300" />
                    Cinematic Analysis
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel: Intelligence Dashboard */}
        <div className="flex flex-col bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-white">
            <h3 className="text-slate-900 font-semibold flex items-center gap-2.5">
              <Activity className="w-4 h-4 text-indigo-600" />
              Intelligence Dashboard
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto bg-slate-50/30 p-6">
            {!analysis && !loading && !dashboardLoading && (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
                  <TrendingUp className="w-8 h-8 opacity-20 text-slate-900" />
                </div>
                <h3 className="text-slate-900 font-medium mb-1">Intelligence Dashboard</h3>
                <p className="text-sm text-slate-500 mb-6 text-center max-w-xs">
                  Run an analysis to see Viral Potential, Reach Metrics, and AI recommendations.
                </p>
                <button 
                  onClick={() => setAnalysis(demoResult)}
                  className="text-indigo-600 text-sm font-medium hover:text-indigo-700 hover:bg-indigo-50 px-4 py-2 rounded-md transition-colors"
                >
                  Load Demo Data
                </button>
              </div>
            )}

            {(loading || dashboardLoading) && (
              <div className="h-full flex flex-col items-center justify-center">
                {loading ? (
                  <>
                    <Loader className="w-8 h-8 text-indigo-600 mb-4" />
                    <p className="text-sm font-medium text-slate-600">
                      Generating intelligence report...
                    </p>
                  </>
                ) : (
                  <AnalysisSkeleton />
                )}
              </div>
            )}

            {error && (
              <div className="h-full flex flex-col items-center justify-center text-red-500">
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {analysis && (
              <div className="space-y-6 animate-fade-in">
                {/* Score Card */}
                <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Viral Potential</h4>
                    <p className="text-3xl font-bold text-slate-900">{analysis.score}<span className="text-lg text-slate-400 font-normal">/100</span></p>
                  </div>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 ${
                    analysis.score >= 80 ? 'border-green-500 text-green-600 bg-green-50' : 
                    analysis.score >= 60 ? 'border-yellow-500 text-yellow-600 bg-yellow-50' : 'border-red-500 text-red-600 bg-red-50'
                  }`}>
                    <span className="text-xl font-bold">{analysis.score}</span>
                  </div>
                </div>

                {/* Reach Analysis Section */}
                <div>
                  <h4 className="text-base font-semibold text-slate-900 mb-4 flex items-center">
                    Reach Analysis
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                    {/* Retention - Success Green */}
                    <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-lg">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-emerald-100 rounded-md text-emerald-700">
                          <Eye className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-2">
                             <h5 className="text-sm font-semibold text-emerald-900">Audience Retention</h5>
                             <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">{analysis.reachAnalysis?.retentionScore || 0}% Score</span>
                          </div>
                          <p className="text-sm text-emerald-800 leading-relaxed mb-4">
                            {analysis.reachAnalysis?.retentionInsight}
                          </p>
                          {/* Muted Retention Chart */}
                           <div className="h-24 w-full bg-emerald-50/50 rounded-md overflow-hidden">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={retentionMockData}>
                                <defs>
                                  <linearGradient id="retentionGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <Tooltip cursor={false} contentStyle={{display: 'none'}} />
                                <Area type="monotone" dataKey="value" stroke="#059669" strokeWidth={2} fill="url(#retentionGradient)" />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Visuals/Lighting - Warning Amber */}
                    <div className="bg-amber-50 border border-amber-100 p-5 rounded-lg">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-amber-100 rounded-md text-amber-700">
                          <Sun className="w-5 h-5" />
                        </div>
                        <div>
                          <h5 className="text-sm font-semibold text-amber-900 mb-1">Visual & Lighting</h5>
                          <p className="text-sm text-amber-800 leading-relaxed">
                            {analysis.reachAnalysis?.lightingSuggestions}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Captions - Informative Blue */}
                    <div className="bg-blue-50 border border-blue-100 p-5 rounded-lg">
                      <div className="flex items-start gap-4">
                         <div className="p-2 bg-blue-100 rounded-md text-blue-700">
                          <MessageSquare className="w-5 h-5" />
                        </div>
                        <div>
                          <h5 className="text-sm font-semibold text-blue-900 mb-1">Caption Strategy</h5>
                          <p className="text-sm text-blue-800 leading-relaxed">
                            {analysis.reachAnalysis?.captionTips}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-6">
                  <h4 className="text-base font-semibold text-slate-900 mb-4">Detailed Metrics</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                      <h5 className="text-sm font-semibold text-slate-900 mb-3 flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-2"></span> Hook Analysis
                      </h5>
                      <p className="text-sm text-slate-600 leading-relaxed">{analysis.hookStrength}</p>
                    </div>
                    
                    <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                      <h5 className="text-sm font-semibold text-slate-900 mb-3 flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-2"></span> Pacing & Flow
                      </h5>
                      <p className="text-sm text-slate-600 leading-relaxed">{analysis.pacing}</p>
                    </div>

                    <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                      <h5 className="text-sm font-semibold text-slate-900 mb-3 flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-2"></span> Predicted Engagement
                      </h5>
                      <p className="text-sm text-slate-600 leading-relaxed">{analysis.viralPotential}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-lg p-5 text-white">
                  <h5 className="text-sm font-semibold mb-3">Optimization Actions</h5>
                  <ul className="space-y-2">
                    {analysis.keyImprovements.map((imp, idx) => (
                      <li key={idx} className="flex items-start text-sm text-slate-300">
                        <span className="text-indigo-400 mr-2 font-bold">•</span>
                        {imp}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ApiKeyModal 
        isOpen={showKeyModal}
        onClose={closeKeyModal}
        onSubmit={setApiKey}
        currentKey={apiKey}
      />
    </div>
  );
};

export default ScriptAnalyzer;
