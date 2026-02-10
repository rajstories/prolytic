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
      description: 'Generate a complete content marketing campaign',
      icon: Megaphone,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      path: '/dashboard/brand/campaign'
    },
    {
      title: 'Create Ad',
      description: 'Generate high-conversion video ad scripts',
      icon: Film,
      color: 'bg-purple-50 text-purple-600 border-purple-200',
      path: '/dashboard/brand/ad'
    },
    {
      title: 'Define Voice',
      description: 'Set your brand tone and personality',
      icon: Mic,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      path: '/dashboard/brand/voice'
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome back{userProfile.companyName ? `, ${userProfile.companyName}` : ''}!
        </h1>
        <p className="text-slate-600 mt-2">
          Your AI-powered brand marketing workspace
        </p>
      </div>

      {/* Brand Profile Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Brand Profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-xs text-slate-500 mb-1">Company</p>
            <p className="text-sm font-medium text-slate-900">{userProfile.companyName || 'Not set'}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Offer Type</p>
            <p className="text-sm font-medium text-slate-900 capitalize">{userProfile.offer?.replace('-', ' ') || 'Not set'}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Target Audience</p>
            <p className="text-sm font-medium text-slate-900">{userProfile.audience || 'Not set'}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Brand Voice</p>
            <p className="text-sm font-medium text-slate-900">
              {userProfile.brandVoice?.join(', ') || 'Not set'}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Content Budget</p>
            <p className="text-sm font-medium text-slate-900">{userProfile.contentBudget || 'Not set'}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Active Platforms</p>
            <p className="text-sm font-medium text-slate-900">
              {userProfile.platforms?.join(', ') || 'Not set'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 mb-1">Campaigns Created</p>
              <p className="text-2xl font-bold text-slate-900">0</p>
            </div>
            <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center">
              <Megaphone className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 mb-1">Ads Generated</p>
              <p className="text-2xl font-bold text-slate-900">0</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Film className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 mb-1">Content Pieces</p>
              <p className="text-2xl font-bold text-slate-900">0</p>
            </div>
            <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.title}
                onClick={() => navigate(action.path)}
                className={`text-left p-6 rounded-xl border transition-all hover:shadow-md ${action.color}`}
              >
                <Icon className="w-8 h-8 mb-3" />
                <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                <p className="text-sm opacity-80">{action.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h2>
        <div className="text-center py-12">
          <p className="text-slate-400 text-sm">No activity yet. Start by creating your first campaign!</p>
        </div>
      </div>
    </div>
  );
};
