import React, { useState } from 'react';
import { useUserProfile } from '../../contexts/UserProfileContext';
import { useApiKey } from '../../contexts/ApiKeyContext';
import { ApiKeyModal } from '../ApiKeyModal';
import { Loader, Megaphone } from '../ui/Icons';

type CampaignPost = {
  platform: string;
  format: string;
  hook: string;
  script: string;
  hashtags: string[];
  bestTimeToPost: string;
  estimatedReach: string;
};

type CampaignResult = {
  campaignName: string;
  strategy: string;
  contentPillars: string[];
  posts: CampaignPost[];
  timeline: Array<{ week: number; focus: string; deliverables: string[] }>;
  kpis: Array<{ metric: string; target: string }>;
};

export const CampaignLab: React.FC = () => {
  const [campaignName, setCampaignName] = useState('');
  const [goal, setGoal] = useState<'awareness' | 'leads' | 'sales' | 'installs'>('awareness');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CampaignResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { userProfile } = useUserProfile();
  const { headers, triggerKeyModal, showKeyModal, closeKeyModal, apiKey, setApiKey } = useApiKey();

  const handleGenerate = async () => {
    if (!campaignName.trim()) {
      setError('Please enter a campaign name');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/campaign', {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          campaignName,
          product: userProfile.offer || 'product',
          goal,
          audience: userProfile.audience || 'general audience',
          budget: userProfile.contentBudget || 'medium',
          platforms: userProfile.platforms || ['Instagram'],
          brandVoice: userProfile.brandVoice?.join(', ') || 'Professional',
          companyName: userProfile.companyName
        })
      });

      const data = await response.json();

      if (response.status === 429) {
        triggerKeyModal();
        setError('Rate limit exceeded. Please add your own API key.');
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || 'Campaign generation failed');
      }

      setResult(data);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Campaign generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Campaign Lab</h2>
        <p className="text-slate-600 mt-2">Generate complete content marketing campaigns with AI</p>
      </header>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Input Form */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Campaign Name
            </label>
            <input
              type="text"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              placeholder="e.g., Q1 Product Launch"
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Campaign Goal
            </label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value as any)}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="awareness">Brand Awareness</option>
              <option value="leads">Lead Generation</option>
              <option value="sales">Direct Sales</option>
              <option value="installs">App Installs</option>
            </select>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-slate-500 mb-1">Product/Service</p>
            <p className="font-medium text-slate-900 capitalize">{userProfile.offer?.replace('-', ' ') || 'Not set'}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-slate-500 mb-1">Target Audience</p>
            <p className="font-medium text-slate-900">{userProfile.audience || 'Not set'}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-slate-500 mb-1">Platforms</p>
            <p className="font-medium text-slate-900">{userProfile.platforms?.join(', ') || 'Not set'}</p>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !campaignName.trim()}
          className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5" />
              Generating Campaign...
            </>
          ) : (
            <>
              <Megaphone className="w-5 h-5" />
              Generate Campaign
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Strategy Overview */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">{result.campaignName}</h3>
            <p className="text-slate-600 mb-4">{result.strategy}</p>
            <div>
              <h4 className="font-medium text-slate-900 mb-2">Content Pillars:</h4>
              <div className="flex flex-wrap gap-2">
                {result.contentPillars.map((pillar, idx) => (
                  <span key={idx} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm">
                    {pillar}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Posts */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Content Posts</h3>
            <div className="space-y-4">
              {result.posts.map((post, idx) => (
                <div key={idx} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
                        {post.platform}
                      </span>
                      <span className="text-sm text-slate-600">{post.format}</span>
                    </div>
                    <span className="text-xs text-slate-500">{post.bestTimeToPost}</span>
                  </div>
                  <p className="font-medium text-slate-900 mb-2">Hook: {post.hook}</p>
                  <p className="text-sm text-slate-600 mb-3">{post.script}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {post.hashtags.map((tag, i) => (
                        <span key={i} className="text-xs text-indigo-600">{tag}</span>
                      ))}
                    </div>
                    <span className="text-xs text-emerald-600 font-medium">Est. {post.estimatedReach} reach</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">4-Week Timeline</h3>
            <div className="space-y-3">
              {result.timeline.map((week, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0 w-16 h-16 bg-indigo-50 rounded-lg flex items-center justify-center">
                    <span className="text-lg font-bold text-indigo-600">W{week.week}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 mb-1">{week.focus}</p>
                    <ul className="text-sm text-slate-600 space-y-1">
                      {week.deliverables.map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* KPIs */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Key Performance Indicators</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.kpis.map((kpi, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-600 mb-1">{kpi.metric}</p>
                  <p className="text-lg font-semibold text-slate-900">{kpi.target}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!result && !loading && (
        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
          <Megaphone className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-400">Enter campaign details above to generate your marketing plan</p>
        </div>
      )}

      <ApiKeyModal 
        isOpen={showKeyModal}
        onClose={closeKeyModal}
        onSubmit={setApiKey}
        currentKey={apiKey}
      />
    </div>
  );
};
