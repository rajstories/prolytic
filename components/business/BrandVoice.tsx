import React, { useState, useEffect } from 'react';
import { useUserProfile } from '../../contexts/UserProfileContext';
import { Mic, Check } from '../ui/Icons';

type BrandVoiceData = {
  voiceAttributes: string[];
  sampleContent: string;
  wordsToAvoid: string;
};

export const BrandVoice: React.FC = () => {
  const { userProfile, updateProfile } = useUserProfile();
  const [voiceAttributes, setVoiceAttributes] = useState<string[]>(userProfile.brandVoice || []);
  const [sampleContent, setSampleContent] = useState('');
  const [wordsToAvoid, setWordsToAvoid] = useState('');
  const [saved, setSaved] = useState(false);

  const availableAttributes = [
    'Professional',
    'Friendly',
    'Bold',
    'Playful',
    'Luxurious',
    'Edgy',
    'Warm',
    'Authoritative',
    'Casual',
    'Sophisticated'
  ];

  useEffect(() => {
    // Load saved brand voice from localStorage
    const savedVoice = localStorage.getItem('prolytic:brand-voice');
    if (savedVoice) {
      try {
        const parsed = JSON.parse(savedVoice);
        setSampleContent(parsed.sampleContent || '');
        setWordsToAvoid(parsed.wordsToAvoid || '');
      } catch (e) {
        console.error('Failed to load brand voice:', e);
      }
    }
  }, []);

  const toggleAttribute = (attr: string) => {
    setVoiceAttributes(prev => 
      prev.includes(attr) 
        ? prev.filter(a => a !== attr)
        : prev.length < 3 ? [...prev, attr] : prev
    );
  };

  const handleSave = () => {
    // Save to UserProfile context
    updateProfile({ brandVoice: voiceAttributes });

    // Save extended data to localStorage
    const brandVoiceData: BrandVoiceData = {
      voiceAttributes,
      sampleContent,
      wordsToAvoid
    };
    localStorage.setItem('prolytic:brand-voice', JSON.stringify(brandVoiceData));

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Brand Voice</h2>
        <p className="text-slate-600 mt-2">Define your brand's tone and personality for consistent AI outputs</p>
      </header>

      <div className="space-y-6">
        {/* Voice Attributes */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Voice Attributes <span className="text-sm text-slate-500 font-normal">(Select up to 3)</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {availableAttributes.map(attr => {
              const isSelected = voiceAttributes.includes(attr);
              return (
                <button
                  key={attr}
                  onClick={() => toggleAttribute(attr)}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{attr}</span>
                    {isSelected && <Check className="w-4 h-4 ml-2" />}
                  </div>
                </button>
              );
            })}
          </div>
          {voiceAttributes.length === 3 && (
            <p className="text-xs text-amber-600 mt-3">Maximum of 3 attributes selected</p>
          )}
        </div>

        {/* Sample Content */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Sample Content</h3>
          <p className="text-sm text-slate-600 mb-4">
            Paste a sample of content that represents your brand voice. AI will reference this tone.
          </p>
          <textarea
            value={sampleContent}
            onChange={(e) => setSampleContent(e.target.value)}
            placeholder="Example: 'We help ambitious founders build products that matter. No fluff, just actionable insights delivered weekly.'"
            rows={6}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          />
        </div>

        {/* Words to Avoid */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Words to Avoid</h3>
          <p className="text-sm text-slate-600 mb-4">
            List words or phrases your brand never uses (comma-separated)
          </p>
          <input
            type="text"
            value={wordsToAvoid}
            onChange={(e) => setWordsToAvoid(e.target.value)}
            placeholder="e.g., cheap, discount, revolutionary, game-changer"
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          />
        </div>

        {/* Current Profile Summary */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-3">
            <Mic className="w-5 h-5 inline mr-2 text-emerald-600" />
            Current Brand Voice
          </h3>
          {voiceAttributes.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm text-slate-700">
                <span className="font-medium">Tone:</span> {voiceAttributes.join(', ')}
              </p>
              {sampleContent && (
                <p className="text-sm text-slate-700">
                  <span className="font-medium">Sample:</span> "{sampleContent.substring(0, 100)}..."
                </p>
              )}
              {wordsToAvoid && (
                <p className="text-sm text-slate-700">
                  <span className="font-medium">Avoiding:</span> {wordsToAvoid}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-600">No brand voice defined yet. Select attributes above to get started.</p>
          )}
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={voiceAttributes.length === 0}
          className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
            saved
              ? 'bg-emerald-600 text-white'
              : 'bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed'
          }`}
        >
          {saved ? (
            <>
              <Check className="w-5 h-5" />
              Saved Successfully!
            </>
          ) : (
            <>
              <Mic className="w-5 h-5" />
              Save Brand Voice
            </>
          )}
        </button>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Pro Tip:</strong> Your brand voice will be automatically injected into all AI-generated content (campaigns, ads, etc.) to maintain consistency.
          </p>
        </div>
      </div>
    </div>
  );
};
