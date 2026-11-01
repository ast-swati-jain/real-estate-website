import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, DollarSign, Home, ArrowRight, ShieldCheck, Award, Users } from 'lucide-react';

interface HeroSectionProps {
  cities: string[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({ cities }) => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState('All');
  const [selectedCity, setSelectedCity] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [status, setStatus] = useState('For Sale');

  const propertyTypes = ['All', 'Villa', 'Penthouse', 'Apartment', 'Townhouse', 'Commercial'];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (selectedType && selectedType !== 'All') params.append('propertyType', selectedType);
    if (selectedCity && selectedCity !== 'All') params.append('city', selectedCity);
    if (budgetRange) {
      if (budgetRange === 'under-1m') params.append('maxPrice', '1000000');
      else if (budgetRange === '1m-3m') {
        params.append('minPrice', '1000000');
        params.append('maxPrice', '3000000');
      } else if (budgetRange === '3m-5m') {
        params.append('minPrice', '3000000');
        params.append('maxPrice', '5000000');
      } else if (budgetRange === '5m-plus') {
        params.append('minPrice', '5000000');
      }
    }
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="relative min-h-[640px] lg:min-h-[700px] flex items-center justify-center bg-slate-950 overflow-hidden">
      {/* Background Photography with Modern Blur Gradients */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80"
          alt="Luxury Architecture"
          className="w-full h-full object-cover opacity-35 scale-105 transform animate-pulse duration-[10000ms]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="max-w-3xl space-y-6">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-brand-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Over 240+ Exclusive Luxury Listings Available</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
            Discover Exceptional Properties Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-blue-300 to-indigo-200">Extraordinary Lives</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            From iconic Manhattan penthouses to coastal California estates, explore curated architectural residences with our intelligent real estate and CRM platform.
          </p>

          {/* Search Box Card */}
          <div className="pt-4">
            <div className="bg-white/95 backdrop-blur-xl p-4 sm:p-6 rounded-3xl shadow-2xl border border-white/20 text-slate-900">
              {/* Buy / Rent Switch & Types */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="inline-flex p-1 rounded-xl bg-slate-100/90 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setStatus('For Sale')}
                    className={`px-4 py-1.5 rounded-lg transition ${
                      status === 'For Sale' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Buy
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('For Rent')}
                    className={`px-4 py-1.5 rounded-lg transition ${
                      status === 'For Rent' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Rent
                  </button>
                </div>

                {/* Property Type Pills */}
                <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto">
                  {propertyTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSelectedType(type)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                        selectedType === type
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Grid */}
              <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
                {/* City Location */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Location / City
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-brand-500 absolute left-3.5 top-3.5" />
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 bg-white font-medium"
                    >
                      <option value="">All Locations</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Budget Range */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Price Range
                  </label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-emerald-500 absolute left-3.5 top-3.5" />
                    <select
                      value={budgetRange}
                      onChange={(e) => setBudgetRange(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 bg-white font-medium"
                    >
                      <option value="">Any Budget</option>
                      <option value="under-1m">Under $1,000,000</option>
                      <option value="1m-3m">$1,000,000 - $3,000,000</option>
                      <option value="3m-5m">$3,000,000 - $5,000,000</option>
                      <option value="5m-plus">$5,000,000+</option>
                    </select>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-600/30 transition duration-200 h-[42px]"
                  >
                    <Search className="w-4 h-4" />
                    <span>Search Listings</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Social Proof Badges */}
          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-400" />
              <span>Certified Luxury Agents</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>#1 Brokerage Excellence Award</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>10,000+ Happy Homeowners</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
