import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Bed,
  Bath,
  Maximize2,
  Calendar,
  Car,
  MapPin,
  Sparkles,
  Share2,
  Heart,
  Eye,
  CheckCircle,
  Calculator,
  Phone,
  Mail,
  ArrowLeft,
  Building,
  ShieldCheck,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { propertyService, leadService } from '../../services/api';
import { Property } from '../../types';
import { useToast } from '../../context/ToastContext';

export const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Enquiry Form State on page
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    preferredContactMethod: 'Email',
    source: 'Schedule Tour'
  });
  const [isSubmittingEnquiry, setIsSubmittingEnquiry] = useState(false);
  const [enquirySent, setEnquirySent] = useState(false);

  // Mortgage Calculator State
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTermYears, setLoanTermYears] = useState(30);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await propertyService.getPropertyById(id);
        if (res.success) {
          setProperty(res.data);
          setEnquiryForm((prev) => ({
            ...prev,
            message: `Hi, I am interested in scheduling a private walkthrough for "${res.data.title}". Please send available time slots.`
          }));
        }
      } catch (error) {
        console.error('Failed to load property details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-500">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-slate-50 py-20 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-slate-200">
          <Building className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-900">Property Not Found</h2>
          <p className="text-xs text-slate-500 mt-1 mb-6">The listing you requested might have been sold or removed.</p>
          <Link
            to="/properties"
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-brand-600 transition"
          >
            Back to Listings
          </Link>
        </div>
      </div>
    );
  }

  const images = property.images && property.images.length > 0
    ? property.images
    : [property.featuredImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'];

  // Calculate Mortgage Payment
  const propertyPrice = property.price;
  const downPaymentAmount = (propertyPrice * downPaymentPercent) / 100;
  const loanPrincipal = propertyPrice - downPaymentAmount;
  const monthlyInterestRate = interestRate / 100 / 12;
  const numberOfPayments = loanTermYears * 12;
  const estimatedMonthlyMortgage =
    monthlyInterestRate > 0
      ? (loanPrincipal * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments))) /
        (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)
      : loanPrincipal / numberOfPayments;

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryForm.name.trim() || !enquiryForm.email.trim() || !enquiryForm.phone.trim()) {
      showToast('Please fill in your name, email, and phone number', 'error');
      return;
    }

    setIsSubmittingEnquiry(true);
    try {
      const res = await leadService.submitEnquiry({
        name: enquiryForm.name,
        email: enquiryForm.email,
        phone: enquiryForm.phone,
        message: enquiryForm.message,
        propertyId: property._id,
        preferredContactMethod: enquiryForm.preferredContactMethod,
        source: enquiryForm.source
      });

      if (res.success) {
        setEnquirySent(true);
        confetti({
          particleCount: 75,
          spread: 60,
          origin: { y: 0.7 }
        });
        showToast('Enquiry received! Our agent will contact you shortly.');
      } else {
        showToast(res.message || 'Failed to submit enquiry', 'error');
      }
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Error submitting enquiry', 'error');
    } finally {
      setIsSubmittingEnquiry(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-brand-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to all properties</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span>{property.viewsCount} views</span>
            </span>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="space-y-3">
          {/* Main Large Viewer (Responsive aspect ratio) */}
          <div className="relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-[16/8] rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 border border-slate-200/60 shadow-md">
            <img
              src={images[activeImageIndex]}
              alt={property.title}
              className="w-full h-full object-cover transition-all duration-500"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />

            {/* Badges on image */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                property.status === 'For Sale' ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'
              }`}>
                {property.status}
              </span>
              <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-md text-slate-900">
                {property.propertyType}
              </span>
            </div>
          </div>

          {/* Thumbnails row */}
          {images.length > 1 && (
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-none">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 sm:w-24 h-14 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                    activeImageIndex === idx
                      ? 'border-brand-600 ring-2 ring-brand-500/30'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Details & Inquiry Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Property Specs, Description, Amenities, Mortgage */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header info */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {property.title}
                  </h1>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mt-1.5">
                    <MapPin className="w-4 h-4 text-brand-500 shrink-0" />
                    <span>{property.location.address}, {property.location.city}, {property.location.state} {property.location.zipCode}</span>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-3xl sm:text-4xl font-extrabold text-brand-600 tracking-tight">
                    ${property.price.toLocaleString()}
                  </div>
                  {property.status === 'For Rent' && (
                    <span className="text-xs text-slate-500 font-semibold">/ month</span>
                  )}
                </div>
              </div>

              {/* Key Specs Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-100">
                <div className="p-3 bg-slate-50 rounded-2xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                    <Bed className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-bold uppercase">Bedrooms</div>
                    <div className="text-base font-bold text-slate-900">{property.specifications.bedrooms} Beds</div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Bath className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-bold uppercase">Bathrooms</div>
                    <div className="text-base font-bold text-slate-900">{property.specifications.bathrooms} Baths</div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-bold uppercase">Total Area</div>
                    <div className="text-base font-bold text-slate-900">{property.specifications.areaSqFt.toLocaleString()} sqft</div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-bold uppercase">Year Built</div>
                    <div className="text-base font-bold text-slate-900">{property.specifications.yearBuilt}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Property Overview / Description */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900">About This Residence</h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Amenities Grid */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Features &amp; Luxury Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {property.amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs font-semibold text-slate-700"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mortgage & Financing Estimator */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Monthly Mortgage Estimator</h3>
                    <p className="text-xs text-slate-500">Calculate estimated monthly principal &amp; interest payments.</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-extrabold text-slate-900">
                    ${Math.round(estimatedMonthlyMortgage).toLocaleString()}
                    <span className="text-xs font-medium text-slate-500">/mo</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Down Payment: {downPaymentPercent}% (${Math.round(downPaymentAmount).toLocaleString()})
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    step="5"
                    value={downPaymentPercent}
                    onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                    className="w-full accent-brand-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Interest Rate: {interestRate}%
                  </label>
                  <input
                    type="range"
                    min="3.0"
                    max="10.0"
                    step="0.25"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full accent-brand-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Loan Term: {loanTermYears} Years
                  </label>
                  <select
                    value={loanTermYears}
                    onChange={(e) => setLoanTermYears(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                  >
                    <option value={15}>15 Years Fixed</option>
                    <option value={30}>30 Years Fixed</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Direct Lead Enquiry Card & Assigned Agent */}
          <div className="lg:col-span-1 space-y-6">
            {/* Sticky Lead Capture Card */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-lg sticky top-28 space-y-5">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600">
                  Instant Response
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  Schedule Private Tour
                </h3>
                <p className="text-xs text-slate-500">
                  Submit your details below and our listing advisor will confirm availability.
                </p>
              </div>

              {enquirySent ? (
                <div className="p-6 bg-emerald-50 rounded-2xl text-center space-y-3 border border-emerald-100">
                  <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-emerald-950 text-sm">Tour Request Submitted!</h4>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    Thank you. A specialist assigned to {property.title} will connect with you via {enquiryForm.preferredContactMethod}.
                  </p>
                  <button
                    onClick={() => setEnquirySent(false)}
                    className="text-xs font-bold text-emerald-900 underline pt-1"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleEnquirySubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Robert Langdon"
                      value={enquiryForm.name}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="robert@example.com"
                      value={enquiryForm.email}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 000-0000"
                      value={enquiryForm.phone}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Preferred Contact
                    </label>
                    <select
                      value={enquiryForm.preferredContactMethod}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, preferredContactMethod: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                    >
                      <option value="Email">Email</option>
                      <option value="Phone">Phone</option>
                      <option value="WhatsApp">WhatsApp</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Message
                    </label>
                    <textarea
                      rows={2}
                      value={enquiryForm.message}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/30 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingEnquiry}
                    className="w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-brand-600/30 transition disabled:opacity-50"
                  >
                    {isSubmittingEnquiry ? (
                      <span>Sending Request...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Request Walkthrough / Pricing</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Verified Listing Guarantee */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Verified Listing • 100% Confidential Representation</span>
              </div>
            </div>

            {/* Listing Agent Profile Box */}
            {property.agent && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
                <img
                  src={property.agent.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                  alt={property.agent.name}
                  className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-slate-200"
                />
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Listing Specialist
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 truncate">{property.agent.name}</h4>
                  <p className="text-xs text-brand-600 truncate">{property.agent.email}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

