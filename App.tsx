import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { LandingPage } from './components/landing/LandingPage';
import { DashboardShell } from './components/dashboard/DashboardShell';
import { DashboardDataProvider } from './components/dashboard/DashboardDataContext';
import { UserProfileProvider } from './contexts/UserProfileContext';
import { ApiKeyProvider } from './contexts/ApiKeyContext';
import { DocsPage } from './pages/DocsPage';
import { Onboarding } from './pages/Onboarding';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <UserProfileProvider>
        <ApiKeyProvider>
          <DashboardDataProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/docs" element={<DocsPage />} />
              <Route path="/dashboard/*" element={<DashboardShell />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </DashboardDataProvider>
        </ApiKeyProvider>
      </UserProfileProvider>
    </BrowserRouter>
  );
};

export default App;
