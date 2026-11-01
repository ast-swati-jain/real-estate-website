import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  MapPin,
  DollarSign,
  Building,
  Bed,
  ArrowUpDown,
  Grid,
  List,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { PropertyCard } from '../../components/website/PropertyCard';
import { EnquiryModal } from '../../components/website/EnquiryModal';
import { propertyService } from '../../services/api';
import { Property, PropertyType } from '../../types';

export const ListingsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [properties, setProperties] = useState<Property[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // Filters state from URL or defaults
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('propertyType') || '');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [bedrooms, setBedrooms] = useState(searchParams.get('bedrooms') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || '-createdAt');

  // UI state
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedPropertyForEnquiry, setSelectedPropertyForEnquiry] = useState<Property | null>(null);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);

  const propertyTypes: PropertyType[] = ['Apartment', 'Villa', 'Commercial', 'Penthouse', 'Townhouse', 'Studio'];

  // Load metadata (cities)
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const res = await propertyService.getPropertyMeta();
        if (res.success && res.data.cities) {
          setCities(res.data.cities);
        }
      } catch (err) {
        console.error('Failed to load cities:', err);
      }
    };
    fetchMeta();
  }, []);

  // Fetch properties whenever filter states or page change
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const queryParams: any = {
          page: currentPage,
          limit: 9,
          sort
        };

        if (search.trim()) queryParams.search = search.trim();
        if (selectedCity && selectedCity !== 'All') queryParams.city = selectedCity;
        if (selectedType && selectedType !== 'All') queryParams.propertyType = selectedType;
        if (selectedStatus && selectedStatus !== 'All') queryParams.status = selectedStatus;
        if (minPrice) queryParams.minPrice = minPrice;
        if (maxPrice) queryParams.maxPrice = maxPrice;
        if (bedrooms && bedrooms !== 'All') queryParams.bedrooms = bedrooms;

        const res = await propertyService.getProperties(queryParams);
        if (res.success) {
          setProperties(res.data);
          setTotalCount(res.total);
          setTotalPages(res.totalPages);
        }
      } catch (error) {
        console.error('Failed to fetch properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [search, selectedCity, selectedType, selectedStatus, minPrice, maxPrice, bedrooms, sort, currentPage]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCity('');
    setSelectedType('');
    setSelectedStatus('');
    setMinPrice('');
    setMaxPrice('');
    setBedrooms('');
    setSort('-createdAt');
    setCurrentPage(1);
    setSearchParams({});
  };

  const handleOpenEnquiry = (property: Property) => {
    setSelectedPropertyForEnquiry(property);
    setIsEnquiryModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Search &amp; Explore</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Explore Property Listings
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Discover {totalCount} residences across prime metropolitan and coastal destinations.
          </p>
        </div>

        {/* Top Search Bar & Filter Controls Strip */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search by title, location, neighborhood, or keyword..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Sort Dropdown */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-48">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500/30 bg-white"
                >
                  <option value="-createdAt">Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="popular">Most Viewed</option>
                  <option value="area_desc">Largest Area (SqFt)</option>
                </select>
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="lg:hidden flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>

              {/* Reset Filters */}
              {(selectedCity || selectedType || selectedStatus || minPrice || maxPrice || bedrooms || search) && (
                <button
                  onClick={handleResetFilters}
                  className="px-3 py-2.5 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1 transition"
                  title="Clear all filters"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Property Type Tabs (Responsive Scrollable on all devices) */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => {
                setSelectedType('');
                setCurrentPage(1);
              }}
              className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                !selectedType ? 'bg-brand-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Types
            </button>
            {propertyTypes.map((type) => (
              <button
                key={type}
                onClick={() => {
                  setSelectedType(type === selectedType ? '' : type);
                  setCurrentPage(1);
                }}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedType === type
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Layout: Sidebar Filters + Property Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6 sticky top-28">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Filter className="w-4 h-4 text-brand-600" />
                  <span>Filter Properties</span>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-brand-600 hover:underline font-semibold"
                >
                  Clear All
                </button>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Listing Status
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {['All', 'For Sale', 'For Rent'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        setSelectedStatus(st === 'All' ? '' : st);
                        setCurrentPage(1);
                      }}
                      className={`py-2 px-1 rounded-lg text-xs font-semibold text-center transition ${
                        (st === 'All' && !selectedStatus) || selectedStatus === st
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* City Location */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  City / Location
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <select
                    value={selectedCity}
                    onChange={(e) => {
                      setSelectedCity(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/30 bg-white"
                  >
                    <option value="">All Locations</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Price Range ($)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <input
                      type="number"
                      placeholder="Min Price"
                      value={minPrice}
                      onChange={(e) => {
                        setMinPrice(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Max Price"
                      value={maxPrice}
                      onChange={(e) => {
                        setMaxPrice(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                    />
                  </div>
                </div>
              </div>

              {/* Bedrooms Filter */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Bedrooms
                </label>
                <div className="grid grid-cols-5 gap-1">
                  {['All', '1', '2', '3', '4+'].map((bed) => {
                    const bedVal = bed === '4+' ? '4' : bed === 'All' ? '' : bed;
                    const isSelected = (!bedrooms && bed === 'All') || bedrooms === bedVal;
                    return (
                      <button
                        key={bed}
                        type="button"
                        onClick={() => {
                          setBedrooms(bedVal);
                          setCurrentPage(1);
                        }}
                        className={`py-1.5 rounded-lg text-xs font-semibold text-center transition ${
                          isSelected
                            ? 'bg-brand-600 text-white'
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        {bed}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Property Type Filter (Vertical) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Property Category
                </label>
                <div className="space-y-1">
                  {propertyTypes.map((type) => (
                    <label
                      key={type}
                      className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-50"
                    >
                      <input
                        type="radio"
                        name="propertyTypeRadio"
                        checked={selectedType === type}
                        onChange={() => {
                          setSelectedType(type === selectedType ? '' : type);
                          setCurrentPage(1);
                        }}
                        className="text-brand-600 focus:ring-brand-500 rounded"
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Filter Slide-over Drawer */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden flex animate-in fade-in">
              <div
                className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
                onClick={() => setMobileFilterOpen(false)}
              />
              <div className="relative ml-auto w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl z-10 flex flex-col">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                    <Filter className="w-4 h-4 text-brand-600" />
                    <span>Filter Properties</span>
                  </div>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-5 overflow-y-auto flex-1 space-y-6 text-xs">
                  {/* Status */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Listing Status
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {['All', 'For Sale', 'For Rent'].map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => {
                            setSelectedStatus(st === 'All' ? '' : st);
                            setCurrentPage(1);
                          }}
                          className={`py-2 px-1 rounded-lg font-semibold text-center transition ${
                            (st === 'All' && !selectedStatus) || selectedStatus === st
                              ? 'bg-slate-900 text-white shadow-sm'
                              : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      City / Location
                    </label>
                    <select
                      value={selectedCity}
                      onChange={(e) => {
                        setSelectedCity(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                    >
                      <option value="">All Locations</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Price Range ($)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="Min Price"
                        value={minPrice}
                        onChange={(e) => {
                          setMinPrice(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                      <input
                        type="number"
                        placeholder="Max Price"
                        value={maxPrice}
                        onChange={(e) => {
                          setMaxPrice(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>
                  </div>

                  {/* Bedrooms */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Bedrooms
                    </label>
                    <div className="grid grid-cols-5 gap-1">
                      {['All', '1', '2', '3', '4+'].map((bed) => {
                        const bedVal = bed === '4+' ? '4' : bed === 'All' ? '' : bed;
                        const isSelected = (!bedrooms && bed === 'All') || bedrooms === bedVal;
                        return (
                          <button
                            key={bed}
                            type="button"
                            onClick={() => {
                              setBedrooms(bedVal);
                              setCurrentPage(1);
                            }}
                            className={`py-2 rounded-lg text-xs font-semibold text-center transition ${
                              isSelected
                                ? 'bg-brand-600 text-white'
                                : 'bg-slate-50 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {bed}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-slate-100 flex gap-2">
                  <button
                    onClick={handleResetFilters}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md"
                  >
                    Show ({totalCount}) Results
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Properties Grid Container */}
          <main className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200 animate-pulse space-y-4">
                    <div className="w-full aspect-[16/10] bg-slate-200 rounded-xl" />
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-4 bg-slate-200 rounded w-1/2" />
                    <div className="h-8 bg-slate-100 rounded" />
                  </div>
                ))}
              </div>
            ) : properties.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((property) => (
                    <PropertyCard
                      key={property._id}
                      property={property}
                      onEnquireClick={handleOpenEnquiry}
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition"
                    >
                      Previous
                    </button>
                    <div className="flex items-center gap-1">
                      {[...Array(totalPages)].map((_, idx) => {
                        const pageNum = idx + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-9 h-9 rounded-xl text-xs font-bold transition ${
                              currentPage === pageNum
                                ? 'bg-brand-600 text-white shadow-sm'
                                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-4">
                <Building className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="text-lg font-bold text-slate-800">No properties match your filter criteria</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try broadening your search query or reset the price and bedroom filters to explore more listings.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-brand-600 transition"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Lead Enquiry Modal */}
      <EnquiryModal
        property={selectedPropertyForEnquiry}
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
      />
    </div>
  );
};

