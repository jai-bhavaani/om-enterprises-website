import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminProvider, useAdmin } from './AdminContext';
import { AdminLayout } from './AdminLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProjectsManager } from './pages/ProjectsManager';
import { MediaManager } from './pages/MediaManager';
import { HeroManager } from './pages/HeroManager';
import { TeamManager } from './pages/TeamManager';
import { MessagesManager } from './pages/MessagesManager';
import { ContentManager } from './pages/ContentManager';

const ProtectedAdminShell: React.FC = () => {
  const { isAuthenticated, isLoading } = useAdmin();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-safety border-t-transparent rounded-full animate-spin"></div>
          <span className="font-mono text-xs text-concrete uppercase tracking-widest">
            Verifying Admin Session...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/projects" element={<ProjectsManager />} />
        <Route path="/media" element={<MediaManager />} />
        <Route path="/hero" element={<HeroManager />} />
        <Route path="/team" element={<TeamManager />} />
        <Route path="/messages" element={<MessagesManager />} />
        <Route path="/content" element={<ContentManager />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export const AdminRoutes: React.FC = () => {
  return (
    <AdminProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={<ProtectedAdminShell />} />
      </Routes>
    </AdminProvider>
  );
};
