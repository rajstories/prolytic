import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Megaphone, Film, Calendar, Mic, Settings as SettingsIcon } from '../ui/Icons';
import { BrandHub } from './BrandHub';
import { CampaignLab } from './CampaignLab';
import { AdCreator } from './AdCreator';
import { BrandVoice } from './BrandVoice';

type TabConfig = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
};

const tabs: TabConfig[] = [
  { id: 'hub', label: 'Brand Hub', icon: LayoutDashboard, path: '/dashboard/brand/hub' },
  { id: 'campaign', label: 'Campaign Lab', icon: Megaphone, path: '/dashboard/brand/campaign' },
  { id: 'ad', label: 'Ad Creator', icon: Film, path: '/dashboard/brand/ad' },
  { id: 'voice', label: 'Brand Voice', icon: Mic, path: '/dashboard/brand/voice' }
];

export const BusinessDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const activeTab = tabs.find(tab => location.pathname.startsWith(tab.path))?.id || 'hub';

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-xl font-bold text-slate-900">Prolytic</h1>
          <p className="text-xs text-slate-500 mt-1">Business Dashboard</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <SettingsIcon className="w-5 h-5" />
            Switch to Creator View
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="hub" element={<BrandHub />} />
          <Route path="campaign" element={<CampaignLab />} />
          <Route path="ad" element={<AdCreator />} />
          <Route path="voice" element={<BrandVoice />} />
          <Route path="*" element={<Navigate to="/dashboard/brand/hub" replace />} />
        </Routes>
      </main>
    </div>
  );
};
