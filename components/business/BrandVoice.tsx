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
    'Sophisticated',
  ];

  useEffect(() => {
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
    setVoiceAttributes((prev) =>
      prev.includes(attr) ? prev.filter((a) => a !== attr) : prev.length < 3 ? [...prev, attr] : prev,
    );
  };

  const handleSave = () => {
    updateProfile({ brandVoice: voiceAttributes });
    const brandVoiceData: BrandVoiceData = { voiceAttributes, sampleContent, wordsToAvoid };
    localStorage.setItem('prolytic:brand-voice', JSON.stringify(brandVoiceData));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="px-10 py-10 max-w-[900px] mx-auto">
      <header className="mb-10">
        <h2 className="text-[2rem] font-bold tracking-tight text-slate-900">Brand Voice</h2>
        <p className="text-[15px] text-slate-500 mt-1">Define your brand's tone and personality for consistent AI outputs</p>
      </header>

      <div className="space-y-6">
        {/* Voice Attributes */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-7 shadow-sm">
          <h3 className="text-[15px] font-semibold text-slate-900 mb-1 tracking-tight">
            Voice Attributes
          </h3>
          <p className="text-[12px] text-slate-400 mb-5">Select up to 3 attributes that define your brand</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
            {availableAttributes.map((attr) => {
              const isSelected = voiceAttributes.includes(attr);
              return (
                <button
                  key={attr}
                  onClick={() => toggleAttribute(attr)}
                  className={`px-4 py-3 rounded-xl text-[13px] font-medium transition-all ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>{attr}</span>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>
                </button>
              );
            })}
          </div>
          {voiceAttributes.length === 3 && (
            <p className="text-[11px] text-amber-600 font-medium mt-3">Maximum of 3 attributes selected</p>
          )}
        </div>

        {/* Sample Content */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-7 shadow-sm">
          <h3 className="text-[15px] font-semibold text-slate-900 mb-1 tracking-tight">Sample Content</h3>
          <p className="text-[12px] text-slate-400 mb-4">
            Paste content that represents your brand voice. AI will reference this tone.
          </p>
          <textarea
            value={sampleContent}
            onChange={(e) => setSampleContent(e.target.value)}
            placeholder="Example: 'We help ambitious founders build products that matter. No fluff, just actionable insights delivered weekly.'"
            rows={5}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-[14px] text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition resize-none"
          />
        </div>

        {/* Words to Avoid */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-7 shadow-sm">
          <h3 className="text-[15px] font-semibold text-slate-900 mb-1 tracking-tight">Words to Avoid</h3>
          <p className="text-[12px] text-slate-400 mb-4">
            List words or phrases your brand never uses (comma-separated)
          </p>
          <input
            type="text"
            value={wordsToAvoid}
            onChange={(e) => setWordsToAvoid(e.target.value)}
            placeholder="e.g., cheap, discount, revolutionary, game-changer"
            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-[14px] text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition"
          />
        </div>

        {/* Current Profile Summary */}
        <div className="bg-slate-50/80 rounded-2xl border border-slate-200/80 p-7">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
              <Mic className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-[15px] font-semibold text-slate-900 tracking-tight">Current Brand Voice</h3>
          </div>
          {voiceAttributes.length > 0 ? (
            <div className="space-y-2">
              <p className="text-[13px] text-slate-600">
                <span className="font-semibold text-slate-900">Tone:</span> {voiceAttributes.join(', ')}
              </p>
              {sampleContent && (
                <p className="text-[13px] text-slate-600">
                  <span className="font-semibold text-slate-900">Sample:</span> "{sampleContent.substring(0, 100)}…"
                </p>
              )}
              {wordsToAvoid && (
                <p className="text-[13px] text-slate-600">
                  <span className="font-semibold text-slate-900">Avoiding:</span> {wordsToAvoid}
                </p>
              )}
            </div>
          ) : (
            <p className="text-[13px] text-slate-400">No brand voice defined yet. Select attributes above to get started.</p>
          )}
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={voiceAttributes.length === 0}
          className={`w-full py-3.5 rounded-xl text-[14px] font-semibold transition-all flex items-center justify-center gap-2 shadow-sm ${
            saved
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed'
          }`}
        >
          {saved ? (
            <>
              <Check className="w-4 h-4" />
              Saved Successfully
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" />
              Save Brand Voice
            </>
          )}
        </button>

        <div className="bg-blue-50/80 border border-blue-200/80 rounded-xl p-5">
          <p className="text-[13px] text-blue-700 leading-relaxed">
            <span className="font-semibold">Pro Tip:</span> Your brand voice will be automatically injected into all AI-generated content (campaigns, ads, etc.) to maintain consistency.
          </p>
        </div>
      </div>
    </div>
  );
};
