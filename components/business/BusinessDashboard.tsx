import React from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Megaphone, Film, Mic } from '../ui/Icons';
import { useUserProfile } from '../../contexts/UserProfileContext';
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
  { id: 'voice', label: 'Brand Voice', icon: Mic, path: '/dashboard/brand/voice' },
];

export const BusinessDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateProfile } = useUserProfile();

  const activeTab = tabs.find((tab) => location.pathname.startsWith(tab.path))?.id || 'hub';

  const handleSwitchToCreator = () => {
    updateProfile({ userType: 'youtube' });
    navigate('/dashboard');
  };

  return (
    <div className="flex h-screen bg-white">
      {/* ── Sidebar ────────────────────────────────────────────── */}
      <aside className="w-[260px] flex-shrink-0 border-r border-slate-200/80 bg-white flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="flex-shrink-0"
            >
              <rect x="4" y="10" width="6" height="10" rx="2" fill="#1A1A40" />
              <rect x="14" y="4" width="6" height="16" rx="2" fill="#0D9488" />
            </svg>
            <span className="font-bold text-[#1A1A40] text-lg tracking-tight">Prolytic</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 pt-6 space-y-0.5">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.16em] px-3 mb-3">
            Workspace
          </p>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-[18px] h-[18px] ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Switch to Creator */}
        <div className="p-3 border-t border-slate-100">
          <button
            onClick={handleSwitchToCreator}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
              <path d="M16 3h5v5" />
              <path d="M8 3H3v5" />
              <path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3" />
              <path d="m15 9 6-6" />
            </svg>
            Switch to Creator View
          </button>
        </div>
      </aside>

      {/* ── Main Content ───────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto bg-white">
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
