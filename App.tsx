import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { LandingPage } from './components/landing/LandingPage';
import { DashboardShell } from './components/dashboard/DashboardShell';
import { DashboardDataProvider } from './components/dashboard/DashboardDataContext';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <DashboardDataProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard/*" element={<DashboardShell />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </DashboardDataProvider>
    </BrowserRouter>
  );
};

export default App;
