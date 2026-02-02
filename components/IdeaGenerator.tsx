import React, { useState } from 'react';
import { generateVideoIdeas } from '../services/geminiService';
import { VideoIdea } from '../types';
import { Loader, Lightbulb } from './ui/Icons';

const IdeaGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [ideas, setIdeas] = useState<VideoIdea[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const results = await generateVideoIdeas(topic);
      setIdeas(results);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <header className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Idea Generator</h2>
        <p className="text-sm text-slate-500 mt-1">Brainstorm high-performing video concepts in seconds.</p>
      </header>

      <div className="flex gap-4 mb-10">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a niche or topic (e.g. 'Minimalist Desk Setup', 'Coding Interviews')"
          className="flex-1 p-3 text-sm text-slate-900 bg-white border border-slate-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full"
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
        />
        <button
          onClick={handleGenerate}
          disabled={loading || !topic}
          className="bg-indigo-600 text-white px-6 py-3 rounded-sm text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center"
        >
          {loading ? <Loader className="mr-2" /> : <Lightbulb className="mr-2" />}
          Generate Ideas
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {ideas.map((idea, index) => (
          <div key={index} className="bg-white p-6 border border-slate-200 rounded-sm hover:border-indigo-200 transition-colors group">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                {idea.title}
              </h3>
              <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-sm font-medium border border-green-100">
                {idea.estimatedViews} views
              </span>
            </div>
            <p className="text-slate-600 text-sm mb-4 leading-relaxed">
              {idea.logline}
            </p>
            <div className="flex items-center text-xs text-slate-500 font-medium bg-slate-50 px-3 py-2 rounded-sm w-fit">
              Target: <span className="text-slate-700 ml-1">{idea.targetAudience}</span>
            </div>
          </div>
        ))}
        
        {ideas.length === 0 && !loading && (
           <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-sm">
             <p className="text-slate-400 text-sm">Enter a topic above to generate concepts.</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default IdeaGenerator;