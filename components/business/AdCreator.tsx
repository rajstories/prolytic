import React, { useState } from 'react';
import { useUserProfile } from '../../contexts/UserProfileContext';
import { useApiKey } from '../../contexts/ApiKeyContext';
import { ApiKeyModal } from '../ApiKeyModal';
import { Loader, Film } from '../ui/Icons';

type AdScript = {
  version: string;
  hook: string;
  body: string;
  cta: string;
  musicSuggestion: string;
  visualDirection: string;
};

type AdResult = {
  scripts: AdScript[];
  copyVariants: string[];
};

export const AdCreator: React.FC = () => {
  const [productDescription, setProductDescription] = useState('');
  const [adFormat, setAdFormat] = useState<'story' | 'reel' | 'preroll' | 'carousel'>('reel');
  const [cta, setCta] = useState('Shop Now');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AdResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { userProfile } = useUserProfile();
  const { headers, triggerKeyModal, showKeyModal, closeKeyModal, apiKey, setApiKey } = useApiKey();

  const handleGenerate = async () => {
    if (!productDescription.trim()) {
      setError('Please describe your product/service');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ad-script', {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          productDescription,
          adFormat,
          cta,
          brandVoice: userProfile.brandVoice?.join(', ') || 'Professional',
          companyName: userProfile.companyName
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
        throw new Error(data.error || 'Ad generation failed');
      }

      setResult(data);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Ad generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-10 py-10 max-w-[1200px] mx-auto">
      <header className="mb-10">
        <h2 className="text-[2rem] font-bold tracking-tight text-slate-900">Ad Creator</h2>
        <p className="text-[15px] text-slate-500 mt-1">Generate high-conversion video ad scripts with AI</p>
      </header>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-[13px] text-red-600 font-medium">{error}</p>
        </div>
      )}

      {/* Input Form */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-7 mb-8 shadow-sm">
        <div className="space-y-6">
          <div>
            <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">
              Product/Service Description
            </label>
            <textarea
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              placeholder="Describe your product, its benefits, and unique selling points..."
              rows={4}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-[14px] text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">
                Ad Format
              </label>
              <select
                value={adFormat}
                onChange={(e) => setAdFormat(e.target.value as any)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-[14px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition appearance-none bg-white"
              >
                <option value="story">Instagram/Facebook Story Ad</option>
                <option value="reel">Instagram Reel / TikTok Ad</option>
                <option value="preroll">YouTube Pre-roll Ad</option>
                <option value="carousel">Carousel Ad</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">
                Call-to-Action
              </label>
              <select
                value={cta}
                onChange={(e) => setCta(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-[14px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition appearance-none bg-white"
              >
                <option value="Shop Now">Shop Now</option>
                <option value="Learn More">Learn More</option>
                <option value="Sign Up">Sign Up</option>
                <option value="Download">Download</option>
                <option value="Get Started">Get Started</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-100">
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">Brand Voice</p>
              <p className="text-[14px] font-semibold text-slate-900">{userProfile.brandVoice?.join(', ') || '—'}</p>
            </div>
            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-100">
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">Company</p>
              <p className="text-[14px] font-semibold text-slate-900">{userProfile.companyName || '—'}</p>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !productDescription.trim()}
            className="w-full bg-slate-900 text-white py-3.5 rounded-xl text-[14px] font-semibold hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Generating Ad Scripts…
              </>
            ) : (
              <>
                <Film className="w-4 h-4" />
                Generate Ad Scripts
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Scripts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {result.scripts.map((script, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
                <div className="mb-4">
                  <span className="px-3 py-1 bg-slate-900 text-white rounded-full text-[11px] font-semibold">
                    {script.version}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Hook (0-3s)</p>
                    <p className="text-[13px] font-semibold text-slate-900">{script.hook}</p>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Body</p>
                    <p className="text-[13px] text-slate-600 leading-relaxed">{script.body}</p>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Call-to-Action</p>
                    <p className="text-[13px] font-semibold text-slate-900">{script.cta}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Music Suggestion</p>
                    <p className="text-[13px] text-slate-600">{script.musicSuggestion}</p>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Visual Direction</p>
                    <p className="text-[13px] text-slate-600">{script.visualDirection}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Copy Variants */}
          {result.copyVariants && result.copyVariants.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-7 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4 tracking-tight">Copy Variants for A/B Testing</h3>
              <div className="space-y-3">
                {result.copyVariants.map((variant, idx) => (
                  <div key={idx} className="p-4 bg-slate-50/80 rounded-xl border border-slate-100">
                    <p className="text-[13px] text-slate-600 leading-relaxed">{variant}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!result && !loading && (
        <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-slate-200 rounded-2xl">
          <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-4">
            <Film className="w-5 h-5 text-slate-300" />
          </div>
          <p className="text-[13px] text-slate-400">Describe your product to generate ad scripts</p>
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
