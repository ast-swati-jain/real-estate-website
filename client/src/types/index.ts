export type PropertyType = 'Apartment' | 'Villa' | 'Commercial' | 'Penthouse' | 'Townhouse' | 'Studio';

export type PropertyStatus = 'For Sale' | 'For Rent' | 'Under Offer' | 'Sold' | 'Rented';

export type LeadStatus = 'New' | 'Contacted' | 'Interested' | 'Negotiation' | 'Converted' | 'Lost';

export type LeadPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type LeadSource = 'Website Enquiry' | 'Schedule Tour' | 'Direct Call' | 'Walk-in' | 'Referral';

export interface Location {
  address: string;
  city: string;
  state: string;
  zipCode?: string;
  country?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Specifications {
  bedrooms: number;
  bathrooms: number;
  areaSqFt: number;
  parkingSpaces: number;
  yearBuilt: number;
}

export interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  formattedPrice?: string;
  propertyType: PropertyType;
  status: PropertyStatus;
  location: Location;
  specifications: Specifications;
  images: string[];
  featuredImage: string;
  amenities: string[];
  featured: boolean;
  isAvailable: boolean;
  viewsCount: number;
  agent?: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface FollowUp {
  _id?: string;
  note: string;
  followUpDate: string;
  scheduledTime?: string;
  type: 'Call' | 'Email' | 'Meeting' | 'Site Visit' | 'Note';
  status: 'Pending' | 'Completed' | 'Cancelled';
  addedBy?: string;
  addedByName: string;
  createdAt?: string;
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  property?: Property | string | null;
  propertyName?: string;
  propertyPrice?: number;
  status: LeadStatus;
  priority: LeadPriority;
  source: LeadSource;
  preferredContactMethod: 'Email' | 'Phone' | 'WhatsApp';
  assignedAgent?: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  } | null;
  followUps: FollowUp[];
  nextFollowUpDate?: string | null;
  conversionValue?: number;
  closedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'agent';
  phone?: string;
  avatar?: string;
}

export interface DashboardMetrics {
  totalProperties: number;
  totalLeads: number;
  activeEnquiries: number;
  convertedLeads: number;
  lostLeads: number;
  conversionRate: number;
  totalRevenue: number;
}

export interface StatusCountItem {
  name: LeadStatus;
  value: number;
  color: string;
}

export interface MonthlyTrendItem {
  month: string;
  leads: number;
  converted: number;
}

export interface PropertyTypeCountItem {
  type: PropertyType;
  count: number;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  leadsByStatus: StatusCountItem[];
  leadsByPropertyType: PropertyTypeCountItem[];
  monthlyTrends: MonthlyTrendItem[];
  recentLeads: Lead[];
  upcomingFollowUps: Lead[];
}

export interface PropertyFilterParams {
  search?: string;
  city?: string;
  propertyType?: string;
  status?: string;
  minPrice?: number | string;
  maxPrice?: number | string;
  bedrooms?: number | string;
  featured?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
}

