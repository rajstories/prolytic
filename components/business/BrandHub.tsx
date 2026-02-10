import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '../../contexts/UserProfileContext';
import { Megaphone, Film, Mic, TrendingUp } from '../ui/Icons';

export const BrandHub: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile } = useUserProfile();

  const quickActions = [
    {
      title: 'New Campaign',
      description: 'Generate a complete content marketing campaign with AI strategy',
      icon: Megaphone,
      accent: '#2563EB',
      bg: '#EFF6FF',
      path: '/dashboard/brand/campaign',
    },
    {
      title: 'Create Ad',
      description: 'Generate high-conversion video ad scripts for any platform',
      icon: Film,
      accent: '#7C3AED',
      bg: '#F5F3FF',
      path: '/dashboard/brand/ad',
    },
    {
      title: 'Define Voice',
      description: 'Set your brand tone, personality and messaging guidelines',
      icon: Mic,
      accent: '#0D9488',
      bg: '#F0FDFA',
      path: '/dashboard/brand/voice',
    },
  ];

  const stats = [
    { label: 'Campaigns Created', value: '0', icon: Megaphone, accent: '#2563EB', bg: '#EFF6FF' },
    { label: 'Ads Generated', value: '0', icon: Film, accent: '#7C3AED', bg: '#F5F3FF' },
    { label: 'Content Pieces', value: '0', icon: TrendingUp, accent: '#0D9488', bg: '#F0FDFA' },
  ];

  const profileFields = [
    { label: 'Company', value: userProfile.companyName },
    { label: 'Offer Type', value: userProfile.offer?.replace('-', ' ') },
    { label: 'Target Audience', value: userProfile.audience },
    { label: 'Brand Voice', value: userProfile.brandVoice?.join(', ') },
    { label: 'Content Budget', value: userProfile.contentBudget },
    { label: 'Active Platforms', value: userProfile.platforms?.join(', ') },
  ];

  return (
    <div className="px-10 py-10 max-w-[1200px] mx-auto">
      {/* ── Header ────────────────────────────────────────────── */}
      <div className="mb-10">
        <h1 className="text-[2rem] font-bold tracking-tight text-slate-900">
          Welcome back{userProfile.companyName ? `, ${userProfile.companyName}` : ''}
        </h1>
        <p className="text-[15px] text-slate-500 mt-1">Your AI-powered brand marketing workspace</p>
      </div>

      {/* ── Brand Profile ─────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-7 mb-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[15px] font-semibold text-slate-900 tracking-tight">Brand Profile</h2>
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Overview</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-5">
          {profileFields.map((f) => (
            <div key={f.label}>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">{f.label}</p>
              <p className="text-[14px] font-semibold text-slate-900 capitalize">{f.value || '—'}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Stats ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex items-center justify-between"
            >
              <div>
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">{s.label}</p>
                <p className="text-3xl font-bold text-slate-900 tracking-tight">{s.value}</p>
              </div>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: s.bg }}
              >
                <Icon className="w-5 h-5" style={{ color: s.accent }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Quick Actions ─────────────────────────────────────── */}
      <div className="mb-10">
        <h2 className="text-[15px] font-semibold text-slate-900 tracking-tight mb-5">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.title}
                onClick={() => navigate(action.path)}
                className="group text-left bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: action.bg }}
                >
                  <Icon className="w-5 h-5" style={{ color: action.accent }} />
                </div>
                <h3 className="text-[15px] font-semibold text-slate-900 mb-1 group-hover:text-slate-700 transition-colors">
                  {action.title}
                </h3>
                <p className="text-[13px] text-slate-400 leading-relaxed">{action.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Recent Activity ───────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-7 shadow-sm">
        <h2 className="text-[15px] font-semibold text-slate-900 tracking-tight mb-6">Recent Activity</h2>
        <div className="flex flex-col items-center justify-center py-14">
          <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-4">
            <TrendingUp className="w-5 h-5 text-slate-300" />
          </div>
          <p className="text-[13px] text-slate-400 text-center">
            No activity yet. Create your first campaign to get started.
          </p>
        </div>
      </div>
    </div>
  );
};
