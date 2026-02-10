import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, Routes, Route } from 'react-router-dom';
import { ViewState } from '../../types';
import { useUserProfile } from '../../contexts/UserProfileContext';
import { BusinessDashboard } from '../business/BusinessDashboard';
import Dashboard from '../Dashboard';
import ScriptAnalyzer from '../ScriptAnalyzer';
import IdeaGenerator from '../IdeaGenerator';
import VideoStudio from '../VideoStudio';
import {
  LayoutDashboard,
  FileText,
  Lightbulb,
  Settings,
  ChevronRight,
  Clapperboard,
  Users,
  Shuffle
} from '../ui/Icons';
import { Layout } from '../layout';
import { AudienceLab } from './AudienceLab';
import { NarrativeLab } from '../../pages/NarrativeLab';

export const DashboardShell: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userProfile, isBusiness } = useUserProfile();
  const [currentView, setCurrentView] = useState<ViewState>(
    ViewState.DASHBOARD
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const routeView = useMemo(() => {
    if (location.pathname.startsWith('/dashboard/audience-lab')) {
      return ViewState.AUDIENCE_LAB;
    }
    if (location.pathname.startsWith('/dashboard/narrative-lab')) {
      return ViewState.NARRATIVE_LAB;
    }
    return ViewState.DASHBOARD;
  }, [location.pathname]);

  useEffect(() => {
    setCurrentView(routeView);
  }, [routeView]);

  // Redirect business users to business dashboard
  useEffect(() => {
    if (isBusiness && !location.pathname.startsWith('/dashboard/brand')) {
      navigate('/dashboard/brand/hub');
    }
  }, [isBusiness, location.pathname, navigate]);

  // If user is business, render business dashboard
  if (isBusiness) {
    return (
      <Routes>
        <Route path="brand/*" element={<BusinessDashboard />} />
        <Route path="*" element={<BusinessDashboard />} />
      </Routes>
    );
  }

  const NavItem = ({
    view,
    label,
    icon: Icon,
    href
  }: {
    view: ViewState;
    label: string;
    icon: React.FC<any>;
    href?: string;
  }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        if (href) {
          navigate(href);
        } else if (location.pathname.startsWith('/dashboard/audience-lab')) {
          navigate('/dashboard');
        }
      }}
      className={`w-full flex items-center px-4 py-2.5 text-sm font-medium transition-colors mb-1 rounded-sm ${
        currentView === view
          ? 'bg-indigo-50 text-indigo-700'
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <Icon
        className={`w-4 h-4 mr-3 ${
          currentView === view ? 'text-indigo-600' : 'text-slate-400'
        }`}
      />
      {label}
      {currentView === view && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
      )}
    </button>
  );

  return (
    <Layout className="bg-white">
      <div className="flex h-screen bg-white overflow-hidden">
        <aside
          className={`${
            sidebarOpen ? 'w-64' : 'w-16'
          } flex-shrink-0 border-r border-slate-200 bg-white transition-all duration-300 flex flex-col`}
        >
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
              {sidebarOpen && (
                <span className="font-bold text-[#1A1A40] text-lg tracking-tight">
                  Prolytic
                </span>
              )}
            </div>
          </div>

          <nav className="flex-1 p-4">
            <div className="mb-2 px-4">
              {sidebarOpen && (
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 mt-2">
                  Platform
                </p>
              )}
            </div>
            <NavItem
              view={ViewState.DASHBOARD}
              label={sidebarOpen ? 'Dashboard' : ''}
              icon={LayoutDashboard}
            />
            <NavItem
              view={ViewState.SCRIPT_ANALYZER}
              label={sidebarOpen ? 'Script Analyzer' : ''}
              icon={FileText}
            />
            <NavItem
              view={ViewState.IDEA_GENERATOR}
              label={sidebarOpen ? 'Idea Generator' : ''}
              icon={Lightbulb}
            />
            <NavItem
              view={ViewState.VIDEO_STUDIO}
              label={sidebarOpen ? 'Video Studio' : ''}
              icon={Clapperboard}
            />
            <NavItem
              view={ViewState.AUDIENCE_LAB}
              label={sidebarOpen ? 'Audience Lab' : ''}
              icon={Users}
              href="/dashboard/audience-lab"
            />
            <NavItem
              view={ViewState.NARRATIVE_LAB}
              label={sidebarOpen ? 'Narrative Doctor' : ''}
              icon={Shuffle}
              href="/dashboard/narrative-lab"
            />
          </nav>

          <div className="p-4 border-t border-slate-100">
            <button className="w-full flex items-center px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              <Settings className="w-4 h-4 mr-3 text-slate-400" />
              {sidebarOpen && 'Settings'}
            </button>
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 flex-shrink-0">
            <div className="flex items-center text-sm text-slate-500">
              <span className="hover:text-slate-800 cursor-pointer transition-colors">
                Workspace
              </span>
              <ChevronRight className="w-4 h-4 mx-2" />
              <span className="font-medium text-slate-900">
                {currentView === ViewState.DASHBOARD && 'Overview'}
                {currentView === ViewState.SCRIPT_ANALYZER && 'Script Analysis'}
                {currentView === ViewState.IDEA_GENERATOR && 'Idea Generation'}
                {currentView === ViewState.VIDEO_STUDIO && 'Video Studio'}
                {currentView === ViewState.AUDIENCE_LAB && 'Audience Lab'}
                {currentView === ViewState.NARRATIVE_LAB && 'Narrative Doctor'}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-medium text-xs">
                JD
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto bg-white">
            {currentView === ViewState.DASHBOARD && <Dashboard />}
            {currentView === ViewState.SCRIPT_ANALYZER && <ScriptAnalyzer />}
            {currentView === ViewState.IDEA_GENERATOR && <IdeaGenerator />}
            {currentView === ViewState.VIDEO_STUDIO && <VideoStudio />}
            {currentView === ViewState.AUDIENCE_LAB && <AudienceLab />}
            {currentView === ViewState.NARRATIVE_LAB && <NarrativeLab />}
          </main>
        </div>
      </div>
    </Layout>
  );
};
