import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HomePage } from './pages/website/HomePage';
import { ListingsPage } from './pages/website/ListingsPage';
import { PropertyDetailPage } from './pages/website/PropertyDetailPage';
import { CrmLoginPage } from './pages/crm/CrmLoginPage';
import { CrmLayout } from './components/crm/CrmLayout';
import { CrmDashboardPage } from './pages/crm/CrmDashboardPage';
import { CrmLeadsPage } from './pages/crm/CrmLeadsPage';
import { CrmPropertiesPage } from './pages/crm/CrmPropertiesPage';
import { CrmAnalyticsPage } from './pages/crm/CrmAnalyticsPage';
import { useAuth } from './context/AuthContext';

// Protected Route Component for CRM
const ProtectedCrmRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/crm/login" replace />;
  }

  return <CrmLayout />;
};

// Website Public Shell with Navbar and Footer
const WebsiteLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Real Estate Portal */}
      <Route element={<WebsiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/properties" element={<ListingsPage />} />
        <Route path="/properties/:id" element={<PropertyDetailPage />} />
      </Route>

      {/* CRM Authentication */}
      <Route path="/crm/login" element={<CrmLoginPage />} />

      {/* Protected CRM Application */}
      <Route path="/crm" element={<ProtectedCrmRoute />}>
        <Route index element={<CrmDashboardPage />} />
        <Route path="leads" element={<CrmLeadsPage />} />
        <Route path="properties" element={<CrmPropertiesPage />} />
        <Route path="analytics" element={<CrmAnalyticsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;

