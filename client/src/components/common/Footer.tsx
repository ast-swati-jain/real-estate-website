import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-900">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                Estate<span className="text-brand-500">Pro</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Empowering luxury real estate buyers, sellers, and modern brokerage teams with high-performance listings and integrated lead management CRM.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified MLS Real Estate Partner &amp; Certified Agency</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/properties" className="hover:text-white transition-colors">
                  All Properties
                </Link>
              </li>
              <li>
                <Link to="/properties?propertyType=Penthouse" className="hover:text-white transition-colors">
                  Penthouses
                </Link>
              </li>
              <li>
                <Link to="/properties?propertyType=Villa" className="hover:text-white transition-colors">
                  Luxury Villas
                </Link>
              </li>
              <li>
                <Link to="/properties?propertyType=Commercial" className="hover:text-white transition-colors">
                  Commercial Offices
                </Link>
              </li>
              <li>
                <Link to="/properties?status=For+Rent" className="hover:text-white transition-colors">
                  Rental Residences
                </Link>
              </li>
            </ul>
          </div>

          {/* CRM & Agents */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Business & CRM</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/crm/login" className="hover:text-white transition-colors">
                  Brokerage Login
                </Link>
              </li>
              <li>
                <Link to="/crm" className="hover:text-white transition-colors">
                  Lead Management CRM
                </Link>
              </li>
              <li>
                <Link to="/crm/leads" className="hover:text-white transition-colors">
                  Pipeline &amp; Enquiries
                </Link>
              </li>
              <li>
                <Link to="/crm/analytics" className="hover:text-white transition-colors">
                  Sales Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Contact Agency</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0" />
                <span>432 Park Avenue, New York, NY</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                <span>+1 (555) 234-5678</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                <span>concierge@estatepro.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} EstatePro Platform Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-white cursor-pointer transition">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition">Terms of Service</span>
            <span className="hover:text-white cursor-pointer transition">Equal Housing Opportunity</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

