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

      if (response.status === 429) {
        triggerKeyModal();
        setError('Rate limit exceeded. Please add your own API key.');
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
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Ad Creator</h2>
        <p className="text-slate-600 mt-2">Generate high-conversion video ad scripts with AI</p>
      </header>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Input Form */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Product/Service Description
            </label>
            <textarea
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              placeholder="Describe your product, its benefits, and unique selling points..."
              rows={4}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Ad Format
              </label>
              <select
                value={adFormat}
                onChange={(e) => setAdFormat(e.target.value as any)}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="story">Instagram/Facebook Story Ad</option>
                <option value="reel">Instagram Reel / TikTok Ad</option>
                <option value="preroll">YouTube Pre-roll Ad</option>
                <option value="carousel">Carousel Ad</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Call-to-Action
              </label>
              <select
                value={cta}
                onChange={(e) => setCta(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="Shop Now">Shop Now</option>
                <option value="Learn More">Learn More</option>
                <option value="Sign Up">Sign Up</option>
                <option value="Download">Download</option>
                <option value="Get Started">Get Started</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-slate-500 mb-1">Brand Voice</p>
              <p className="font-medium text-slate-900">{userProfile.brandVoice?.join(', ') || 'Not set'}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-slate-500 mb-1">Company</p>
              <p className="font-medium text-slate-900">{userProfile.companyName || 'Not set'}</p>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !productDescription.trim()}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5" />
                Generating Ad Scripts...
              </>
            ) : (
              <>
                <Film className="w-5 h-5" />
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {result.scripts.map((script, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="mb-4">
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
                    {script.version}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">HOOK (0-3 seconds)</p>
                    <p className="text-sm font-medium text-slate-900">{script.hook}</p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 mb-1">BODY</p>
                    <p className="text-sm text-slate-700">{script.body}</p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 mb-1">CALL-TO-ACTION</p>
                    <p className="text-sm font-medium text-slate-900">{script.cta}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">MUSIC SUGGESTION</p>
                    <p className="text-sm text-slate-700">{script.musicSuggestion}</p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 mb-1">VISUAL DIRECTION</p>
                    <p className="text-sm text-slate-700">{script.visualDirection}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Copy Variants */}
          {result.copyVariants && result.copyVariants.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Copy Variants for A/B Testing</h3>
              <div className="space-y-3">
                {result.copyVariants.map((variant, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-700">{variant}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!result && !loading && (
        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
          <Film className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-400">Describe your product to generate ad scripts</p>
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
