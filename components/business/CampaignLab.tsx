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
  demoMode?: boolean;
};

const buildFallbackCampaign = (campaignName: string, goal: string): CampaignResult => ({
  campaignName,
  strategy: `Demo strategy generated due to temporary API quota limits. Focus on ${goal} with a tight 7-day posting cadence and a clear CTA in each asset.`,
  contentPillars: ['Hook-first storytelling', 'Social proof clips', 'Offer clarity'],
  posts: [
    {
      platform: 'Instagram',
      format: 'Reel',
      hook: 'You are losing viewers in the first 3 seconds.',
      script: 'Open with outcome, then one proof point, then CTA.',
      hashtags: ['#creator', '#marketing', '#growth'],
      bestTimeToPost: 'Tue 6:30 PM',
      estimatedReach: '8-12K'
    },
    {
      platform: 'YouTube',
      format: 'Short',
      hook: 'One edit that doubled retention.',
      script: 'Before/after cut comparison with timestamp callouts.',
      hashtags: ['#shorts', '#retention', '#contentstrategy'],
      bestTimeToPost: 'Thu 5:00 PM',
      estimatedReach: '12-18K'
    }
  ],
  timeline: [
    { week: 1, focus: 'Launch', deliverables: ['2 Reels', '1 Short', 'CTA test'] },
    { week: 2, focus: 'Optimize', deliverables: ['Hook A/B test', 'Caption rewrite'] }
  ],
  kpis: [
    { metric: 'Reach', target: '50K impressions' },
    { metric: 'Saves', target: '2.5% save rate' }
  ],
  demoMode: true
});

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
        setResult(buildFallbackCampaign(campaignName, goal));
        setError('Live provider hit rate limits. Showing high-quality demo strategy.');
        return;
      }

      if (response.status === 403) {
        triggerKeyModal();
        setError('API key is invalid or suspended. Please enter a new valid key.');
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || 'Campaign generation failed');
      }

      setResult(data);
    } catch (err) {
      console.error(err);
      setResult(buildFallbackCampaign(campaignName, goal));
      setError('Network/provider issue detected. Showing demo strategy.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-10 py-10 max-w-[1200px] mx-auto">
      <header className="mb-10">
        <h2 className="text-[2rem] font-bold tracking-tight text-slate-900">Campaign Lab</h2>
        <p className="text-[15px] text-slate-500 mt-1">Generate complete content marketing campaigns with AI</p>
      </header>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-[13px] text-red-600 font-medium">{error}</p>
        </div>
      )}

      {result?.demoMode && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-[13px] text-amber-700 font-medium">Demo Mode enabled for reliability: live quota fallback is active.</p>
        </div>
      )}

      {/* Input Form */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-7 mb-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">
              Campaign Name
            </label>
            <input
              type="text"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              placeholder="e.g., Q1 Product Launch"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-[14px] text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">
              Campaign Goal
            </label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value as any)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-[14px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition appearance-none bg-white"
            >
              <option value="awareness">Brand Awareness</option>
              <option value="leads">Lead Generation</option>
              <option value="sales">Direct Sales</option>
              <option value="installs">App Installs</option>
            </select>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-100">
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">Product/Service</p>
            <p className="text-[14px] font-semibold text-slate-900 capitalize">{userProfile.offer?.replace('-', ' ') || '—'}</p>
          </div>
          <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-100">
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">Target Audience</p>
            <p className="text-[14px] font-semibold text-slate-900">{userProfile.audience || '—'}</p>
          </div>
          <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-100">
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">Platforms</p>
            <p className="text-[14px] font-semibold text-slate-900">{userProfile.platforms?.join(', ') || '—'}</p>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !campaignName.trim()}
          className="mt-6 w-full bg-slate-900 text-white py-3.5 rounded-xl text-[14px] font-semibold hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          {loading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Generating Campaign…
            </>
          ) : (
            <>
              <Megaphone className="w-4 h-4" />
              Generate Campaign
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Strategy Overview */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-7 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">{result.campaignName}</h3>
            <p className="text-[14px] text-slate-500 leading-relaxed mb-5">{result.strategy}</p>
            <div>
              <h4 className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-3">Content Pillars</h4>
              <div className="flex flex-wrap gap-2">
                {result.contentPillars.map((pillar, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-slate-900 text-white rounded-full text-[12px] font-medium">
                    {pillar}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Posts */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-7 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-5 tracking-tight">Content Posts</h3>
            <div className="space-y-4">
              {result.posts.map((post, idx) => (
                <div key={idx} className="border border-slate-200/80 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-slate-900 text-white rounded-full text-[11px] font-semibold">
                        {post.platform}
                      </span>
                      <span className="text-[13px] text-slate-500">{post.format}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">{post.bestTimeToPost}</span>
                  </div>
                  <p className="text-[14px] font-semibold text-slate-900 mb-2">Hook: {post.hook}</p>
                  <p className="text-[13px] text-slate-500 mb-3 leading-relaxed">{post.script}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {post.hashtags.map((tag, i) => (
                        <span key={i} className="text-[11px] text-blue-600 font-medium">{tag}</span>
                      ))}
                    </div>
                    <span className="text-[11px] text-emerald-600 font-semibold">Est. {post.estimatedReach} reach</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-7 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-5 tracking-tight">4-Week Timeline</h3>
            <div className="space-y-4">
              {result.timeline.map((week, idx) => (
                <div key={idx} className="flex gap-5 items-start">
                  <div className="flex-shrink-0 w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center">
                    <span className="text-sm font-bold text-white">W{week.week}</span>
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className="text-[14px] font-semibold text-slate-900 mb-1">{week.focus}</p>
                    <ul className="text-[13px] text-slate-500 space-y-0.5">
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
          <div className="bg-white rounded-2xl border border-slate-200/80 p-7 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-5 tracking-tight">Key Performance Indicators</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.kpis.map((kpi, idx) => (
                <div key={idx} className="p-4 bg-slate-50/80 rounded-xl border border-slate-100">
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">{kpi.metric}</p>
                  <p className="text-lg font-bold text-slate-900">{kpi.target}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!result && !loading && (
        <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-slate-200 rounded-2xl">
          <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-4">
            <Megaphone className="w-5 h-5 text-slate-300" />
          </div>
          <p className="text-[13px] text-slate-400">Enter campaign details above to generate your marketing plan</p>
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
