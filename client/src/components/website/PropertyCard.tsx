import React from 'react';
import { Link } from 'react-router-dom';
import { Bed, Bath, Maximize2, MapPin, Sparkles, ArrowUpRight } from 'lucide-react';
import { Property } from '../../types';

interface PropertyCardProps {
  property: Property;
  onEnquireClick?: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onEnquireClick }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const mainImage = property.featuredImage || property.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={mainImage}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm ${
              property.status === 'For Sale'
                ? 'bg-emerald-600 text-white'
                : property.status === 'For Rent'
                ? 'bg-blue-600 text-white'
                : 'bg-amber-600 text-white'
            }`}>
              {property.status}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-md text-slate-800 shadow-sm">
              {property.propertyType}
            </span>
          </div>

          {property.featured && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-400 text-amber-950 shadow-sm">
              <Sparkles className="w-3 h-3 fill-amber-950" />
              <span>Featured</span>
            </span>
          )}
        </div>

        {/* Price Tag Overlay at bottom */}
        <div className="absolute bottom-3 left-3 right-3 flex items-baseline justify-between text-white pointer-events-none">
          <div>
            <span className="text-2xl font-extrabold tracking-tight drop-shadow-md">
              {formatPrice(property.price)}
            </span>
            {property.status === 'For Rent' && (
              <span className="text-xs font-medium text-slate-200"> /month</span>
            )}
          </div>
        </div>
      </div>

      {/* Details Container */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-brand-500 shrink-0" />
            <span className="truncate">{property.location.city}, {property.location.state}</span>
          </div>

          {/* Title */}
          <Link to={`/properties/${property._id}`}>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1">
              {property.title}
            </h3>
          </Link>

          {/* Address */}
          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
            {property.location.address}
          </p>
        </div>

        {/* Specifications row */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
          {property.specifications.bedrooms > 0 && (
            <div className="flex items-center gap-1.5">
              <Bed className="w-4 h-4 text-slate-400" />
              <span>{property.specifications.bedrooms} Beds</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Bath className="w-4 h-4 text-slate-400" />
            <span>{property.specifications.bathrooms} Baths</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Maximize2 className="w-4 h-4 text-slate-400" />
            <span>{property.specifications.areaSqFt.toLocaleString()} sqft</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center gap-2">
          <Link
            to={`/properties/${property._id}`}
            className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-100 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
          >
            <span>View Details</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>

          {onEnquireClick && (
            <button
              onClick={() => onEnquireClick(property)}
              className="py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold transition shadow-sm"
            >
              Enquire
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

