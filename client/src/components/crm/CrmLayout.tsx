import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Building2,
  LayoutDashboard,
  Users,
  Building,
  BarChart3,
  LogOut,
  ExternalLink,
  Menu,
  X,
  User,
  Shield,
  Bell
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const CrmLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/crm/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/crm', icon: LayoutDashboard },
    { label: 'Leads Pipeline', path: '/crm/leads', icon: Users },
    { label: 'Properties CMS', path: '/crm/properties', icon: Building },
    { label: 'Analytics', path: '/crm/analytics', icon: BarChart3 },
  ];

  const isActive = (path: string) => {
    if (path === '/crm') return location.pathname === '/crm';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800 shrink-0">
        {/* Brand */}
        <div className="h-20 flex items-center gap-3 px-6 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-white tracking-tight">
              Estate<span className="text-brand-400">CRM</span>
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Lead Management
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="p-4 space-y-1.5 flex-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-2">
            Main Management
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                  active
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-6">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-2">
              External Navigation
            </div>
            <Link
              to="/"
              target="_blank"
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
            >
              <div className="flex items-center gap-3">
                <ExternalLink className="w-4 h-4" />
                <span>Public Website</span>
              </div>
              <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">Live</span>
            </Link>
          </div>
        </div>

        {/* User Profile & Sign Out footer */}
        <div className="p-4 border-t border-slate-800">
          <div className="p-3 bg-slate-800/80 rounded-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'}
                alt={user?.name}
                className="w-9 h-9 rounded-xl object-cover shrink-0 border border-slate-700"
              />
              <div className="truncate">
                <div className="text-xs font-bold text-white truncate">{user?.name}</div>
                <div className="text-[10px] font-semibold text-brand-400 uppercase flex items-center gap-1">
                  <Shield className="w-2.5 h-2.5" />
                  <span>{user?.role}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-700/50 transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between shrink-0 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                {location.pathname === '/crm' && 'CRM Executive Dashboard'}
                {location.pathname.startsWith('/crm/leads') && 'Lead Management & Sales Funnel'}
                {location.pathname.startsWith('/crm/properties') && 'Property Catalog Management (CMS)'}
                {location.pathname.startsWith('/crm/analytics') && 'Business Performance & Analytics'}
              </h2>
              <p className="hidden sm:block text-xs text-slate-500">
                Centralized real estate operational platform
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-brand-600 px-3.5 py-2 rounded-xl border border-slate-200 hover:border-brand-200 transition bg-slate-50"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Public Portal</span>
            </Link>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'}
                alt=""
                className="w-8 h-8 rounded-xl object-cover border border-slate-200"
              />
              <span className="hidden md:inline text-xs font-bold text-slate-800">{user?.name}</span>
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 p-4 sm:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar Modal */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative w-64 bg-slate-900 text-slate-300 flex flex-col h-full shadow-2xl z-10">
            <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800">
              <div className="text-lg font-extrabold text-white">
                Estate<span className="text-brand-400">CRM</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-1 flex-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                      active
                        ? 'bg-brand-600 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="p-4 border-t border-slate-800">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-600/20 text-rose-300 text-xs font-bold hover:bg-rose-600 hover:text-white transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

