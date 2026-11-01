import axios from 'axios';
import { PropertyFilterParams } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add JWT token to outgoing private requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Services
export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },
  register: async (userData: { name: string; email: string; password: string; role?: string; phone?: string }) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
};

// Property Services
export const propertyService = {
  getProperties: async (params?: PropertyFilterParams) => {
    const res = await api.get('/properties', { params });
    return res.data;
  },
  getFeaturedProperties: async () => {
    const res = await api.get('/properties/featured');
    return res.data;
  },
  getPropertyById: async (id: string) => {
    const res = await api.get(`/properties/${id}`);
    return res.data;
  },
  getPropertyMeta: async () => {
    const res = await api.get('/properties/meta/cities');
    return res.data;
  },
  createProperty: async (propertyData: any) => {
    const res = await api.post('/properties', propertyData);
    return res.data;
  },
  updateProperty: async (id: string, propertyData: any) => {
    const res = await api.put(`/properties/${id}`, propertyData);
    return res.data;
  },
  deleteProperty: async (id: string) => {
    const res = await api.delete(`/properties/${id}`);
    return res.data;
  },
};

// Lead & CRM Services
export const leadService = {
  // Public enquiry form
  submitEnquiry: async (enquiryData: {
    name: string;
    email: string;
    phone: string;
    message?: string;
    propertyId?: string;
    preferredContactMethod?: string;
    source?: string;
  }) => {
    const res = await api.post('/leads', enquiryData);
    return res.data;
  },
  // Private CRM list
  getLeads: async (params?: {
    search?: string;
    status?: string;
    priority?: string;
    source?: string;
    propertyId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
    sort?: string;
  }) => {
    const res = await api.get('/leads', { params });
    return res.data;
  },
  getLeadById: async (id: string) => {
    const res = await api.get(`/leads/${id}`);
    return res.data;
  },
  updateStatus: async (id: string, payload: { status: string; note?: string; conversionValue?: number }) => {
    const res = await api.put(`/leads/${id}/status`, payload);
    return res.data;
  },
  addFollowUp: async (id: string, followUpData: {
    note: string;
    followUpDate?: string;
    scheduledTime?: string;
    type?: string;
    status?: string;
    nextFollowUpDate?: string;
  }) => {
    const res = await api.post(`/leads/${id}/follow-ups`, followUpData);
    return res.data;
  },
  updateLead: async (id: string, data: any) => {
    const res = await api.put(`/leads/${id}`, data);
    return res.data;
  },
  deleteLead: async (id: string) => {
    const res = await api.delete(`/leads/${id}`);
    return res.data;
  },
};

// Analytics Services
export const analyticsService = {
  getDashboardStats: async () => {
    const res = await api.get('/analytics/dashboard');
    return res.data;
  },
};

export default api;
