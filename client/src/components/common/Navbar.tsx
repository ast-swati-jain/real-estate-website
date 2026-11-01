import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, LayoutDashboard, Menu, X, User as UserIcon, PhoneCall } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  const isNavActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">
                Estate<span className="text-brand-600">Pro</span>
              </span>
              <span className="hidden sm:block text-[10px] font-semibold tracking-widest uppercase text-slate-400">
                Luxury Real Estate & CRM
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isNavActive('/')
                  ? 'text-brand-600 bg-brand-50/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/properties"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isNavActive('/properties')
                  ? 'text-brand-600 bg-brand-50/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Explore Listings
            </Link>
            <Link
              to="/properties?status=For+Sale"
              className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              Buy
            </Link>
            <Link
              to="/properties?status=For+Rent"
              className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              Rent
            </Link>
          </nav>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="tel:+15552345678"
              className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-brand-600 px-3 py-1.5 rounded-full border border-slate-200 hover:border-brand-200 transition"
            >
              <PhoneCall className="w-3.5 h-3.5 text-brand-600" />
              <span>(555) 234-5678</span>
            </a>

            {isAuthenticated ? (
              <Link
                to="/crm"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-brand-600 transition shadow-md shadow-slate-900/10"
              >
                <LayoutDashboard className="w-4 h-4 text-brand-400" />
                <span>CRM Workspace</span>
                {user?.role && (
                  <span className="text-[10px] bg-white/20 text-white uppercase px-1.5 py-0.5 rounded">
                    {user.role}
                  </span>
                )}
              </Link>
            ) : (
              <Link
                to="/crm/login"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition shadow-md shadow-brand-600/25"
              >
                <UserIcon className="w-4 h-4" />
                <span>CRM Login</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-50"
          >
            Home
          </Link>
          <Link
            to="/properties"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-50"
          >
            Explore Listings
          </Link>
          <Link
            to="/properties?status=For+Sale"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-50"
          >
            Buy Properties
          </Link>
          <Link
            to="/properties?status=For+Rent"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-50"
          >
            Rent Properties
          </Link>

          <div className="pt-4 border-t border-slate-100 space-y-2.5">
            <a
              href="tel:+15552345678"
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:border-brand-300 transition"
            >
              <PhoneCall className="w-3.5 h-3.5 text-brand-600" />
              <span>Call Concierge: (555) 234-5678</span>
            </a>

            {isAuthenticated ? (
              <Link
                to="/crm"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-slate-900 text-white font-semibold text-sm shadow-md"
              >
                <LayoutDashboard className="w-4 h-4 text-brand-400" />
                <span>Open CRM Workspace ({user?.name || user?.role})</span>
              </Link>
            ) : (
              <Link
                to="/crm/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-brand-600 text-white font-semibold text-sm shadow-md shadow-brand-600/20"
              >
                <UserIcon className="w-4 h-4" />
                <span>CRM Team Login</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

