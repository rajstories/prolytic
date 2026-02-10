import React from 'react';
import { MusicNote, Scissors, Play, Activity } from './ui/Icons';
import { VideoReachAudit } from '../types';

type ImpactAnalyticsProps = {
  audit: VideoReachAudit | null;
  loading: boolean;
};

const iconForType = (type: VideoReachAudit['actionable_improvements'][number]['type']) => {
  switch (type) {
    case 'audio':
      return MusicNote;
    case 'pacing':
    case 'hook':
      return Scissors;
    case 'visual':
    case 'structure':
    default:
      return Activity;
  }
};

export const ImpactAnalytics: React.FC<ImpactAnalyticsProps> = ({ audit, loading }) => {
  if (loading) {
    return (
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
  }

  if (!audit) {
    return (
      <div className="text-xs text-slate-400 italic">
        Upload a video to begin.
      </div>
    );
  }

  const references = audit.viral_references ?? [];
  const improvements = audit.actionable_improvements ?? [];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-600">Viral Benchmark Score</span>
          <span className="text-sm font-bold text-slate-900">{audit.score}/100</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full"
            style={{ width: `${Math.min(100, Math.max(0, audit.score))}%` }}
          ></div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h5 className="text-sm font-semibold text-slate-900">
            What&apos;s Working in {audit.niche}
          </h5>
          <span className="text-xs text-slate-500">Top 1% Benchmarks</span>
        </div>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
          {references.map((ref, idx) => (
            <div
              key={`${ref.title}-${idx}`}
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="h-24 rounded-md bg-gradient-to-br from-slate-100 to-slate-200 mb-3" />
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">{ref.title}</p>
                <span className="text-xs text-slate-500">{ref.views}</span>
              </div>
              <div className="mt-2 text-xs text-slate-600">
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-blue-600">
                  Why it went viral: {ref.why_it_worked}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h5 className="text-sm font-semibold text-slate-900">Specific Fixes</h5>
          <span className="text-xs text-slate-500">Trending in your niche (+400% reach)</span>
        </div>
        <div className="mt-3 space-y-3">
          {improvements.map((item, idx) => {
            const Icon = iconForType(item.type);
            const hasAsset = Boolean(item.specific_asset);
            return (
              <div
                key={`${item.type}-${idx}`}
                className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{item.suggestion}</p>
                      {item.specific_instruction && (
                        <p className="text-xs text-slate-600 mt-1">{item.specific_instruction}</p>
                      )}
                      {item.impact && (
                        <p className="text-xs text-indigo-600 mt-2">Impact: {item.impact}</p>
                      )}
                    </div>
                  </div>
                  {item.reference_timestamp && (
                    <span className="text-xs text-slate-400">{item.reference_timestamp}</span>
                  )}
                </div>
                {hasAsset && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-600">
                    <button className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2 py-1 text-indigo-600">
                      <Play className="w-3 h-3" />
                      Play
                    </button>
                    <span>{item.specific_asset}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
