import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Compass, Award, Star, CheckCircle2, ChevronRight, PhoneCall } from 'lucide-react';
import { HeroSection } from '../../components/website/HeroSection';
import { PropertyCard } from '../../components/website/PropertyCard';
import { EnquiryModal } from '../../components/website/EnquiryModal';
import { propertyService } from '../../services/api';
import { Property } from '../../types';

export const HomePage: React.FC = () => {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPropertyForEnquiry, setSelectedPropertyForEnquiry] = useState<Property | null>(null);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, metaRes] = await Promise.all([
          propertyService.getFeaturedProperties(),
          propertyService.getPropertyMeta()
        ]);

        if (featuredRes.success) {
          setFeaturedProperties(featuredRes.data);
        }
        if (metaRes.success && metaRes.data.cities) {
          setCities(metaRes.data.cities);
        }
      } catch (error) {
        console.error('Failed to load homepage data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOpenEnquiry = (property?: Property) => {
    setSelectedPropertyForEnquiry(property || null);
    setIsEnquiryModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1. Hero Section */}
      <HeroSection cities={cities} />

      {/* 2. Key Metrics Bar */}
      <section className="bg-white border-y border-slate-200/80 py-8 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">$4.8B+</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gross Transaction Volume</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-brand-600 tracking-tight">1,250+</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Luxury Properties Closed</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">99.4%</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Client Satisfaction Rate</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-500 tracking-tight">15+</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Years Industry Leadership</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Properties Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Curated Portfolio</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Featured Luxury Listings
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-2 max-w-xl">
              Hand-picked architectural landmarks, waterfront estates, and premier sky penthouses currently available on the market.
            </p>
          </div>

          <Link
            to="/properties"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-brand-600 text-white text-sm font-semibold transition duration-200 self-start md:self-auto shadow-sm"
          >
            <span>View All Listings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Loading State or Properties Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200 animate-pulse space-y-4">
                <div className="w-full aspect-[16/10] bg-slate-200 rounded-xl" />
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-200 rounded w-1/2" />
                <div className="h-8 bg-slate-100 rounded" />
              </div>
            ))}
          </div>
        ) : featuredProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
                onEnquireClick={handleOpenEnquiry}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 p-8">
            <Compass className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No featured properties found</h3>
            <p className="text-xs text-slate-500 mt-1">Check back soon or explore our complete catalog.</p>
          </div>
        )}
      </section>

      {/* 4. Why EstatePro Showcase */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-400">
              The EstatePro Standard
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Why Discerning Clients &amp; Investors Choose Us
            </h2>
            <p className="text-sm text-slate-400">
              We merge architectural exclusivity with institutional-grade transaction management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/60 p-8 rounded-2xl border border-slate-700/60 space-y-4 hover:border-brand-500/50 transition">
              <div className="w-12 h-12 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Curated Architectural Roster</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Every property on EstatePro undergoes rigorous physical verification, title audit, and architectural styling assessment prior to listing.
              </p>
            </div>

            <div className="bg-slate-800/60 p-8 rounded-2xl border border-slate-700/60 space-y-4 hover:border-brand-500/50 transition">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">White-Glove VIP Representation</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Direct access to top 1% brokerage advisors, private off-market previews, bespoke legal escrow assistance, and discreet closing management.
              </p>
            </div>

            <div className="bg-slate-800/60 p-8 rounded-2xl border border-slate-700/60 space-y-4 hover:border-brand-500/50 transition">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Centralized Lead &amp; Deal CRM</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Real-time inquiry dispatching, automated timeline logging, client follow-up scheduling, and comprehensive sales funnel tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Client Testimonials */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-14 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600">Client Reviews</span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Trusted by Homeowners &amp; Executives</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              quote: "The Skyline Penthouse purchase was seamless. The advisor coordinated every private viewing and escrow milestone in record time.",
              author: "Marcus Sterling",
              role: "Private Equity Managing Director",
              location: "New York, NY",
              stars: 5
            },
            {
              quote: "EstatePro's CRM and team responded to my waterfront villa inquiry within 15 minutes with complete yacht dock depth surveys.",
              author: "Elena Rostova",
              role: "Biotech Founder",
              location: "Miami, FL",
              stars: 5
            },
            {
              quote: "Selling our Beverly Hills estate through EstatePro set a neighborhood per-square-foot record. Truly an unparalleled service.",
              author: "Julian & Diane Vance",
              role: "Architectural Collectors",
              location: "Los Angeles, CA",
              stars: 5
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex gap-1 text-amber-400">
                  {[...Array(item.stars)].map((_, s) => (
                    <Star key={s} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-700 italic leading-relaxed">
                  "{item.quote}"
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{item.author}</h4>
                  <p className="text-xs text-slate-500">{item.role}</p>
                </div>
                <span className="text-[11px] font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                  {item.location}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Lead Capture CTA Banner */}
      <section className="bg-gradient-to-r from-brand-700 via-brand-600 to-indigo-700 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Find Your Next Landmark Property?
          </h2>
          <p className="text-base text-brand-100 max-w-2xl mx-auto">
            Speak directly with our senior luxury advisors to discuss your acquisitions, custom architectural requirements, or private portfolio dispositions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => handleOpenEnquiry()}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-slate-900 font-bold text-sm hover:bg-slate-100 transition shadow-lg"
            >
              Request a Consultation
            </button>
            <a
              href="tel:+15552345678"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm flex items-center justify-center gap-2 transition"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call (555) 234-5678</span>
            </a>
          </div>
        </div>
      </section>

      {/* Enquiry Form Modal */}
      <EnquiryModal
        property={selectedPropertyForEnquiry}
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
      />
    </div>
  );
};

