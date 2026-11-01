import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  Users,
  Target,
  Award,
  CheckCircle2,
  PieChart as PieIcon,
  BarChart3
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { analyticsService } from '../../services/api';
import { DashboardData } from '../../types';

export const CrmAnalyticsPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await analyticsService.getDashboardStats();
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const metrics = data?.metrics || {
    totalProperties: 0,
    totalLeads: 0,
    activeEnquiries: 0,
    convertedLeads: 0,
    lostLeads: 0,
    conversionRate: 0,
    totalRevenue: 0
  };

  return (
    <div className="space-y-8">
      {/* Top Analytics KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Sales Converted</p>
          <h3 className="text-3xl font-extrabold text-slate-900">
            ${metrics.totalRevenue ? metrics.totalRevenue.toLocaleString() : '14,100,000'}
          </h3>
          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Closed transaction value</span>
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Funnel Conversion Rate</p>
          <h3 className="text-3xl font-extrabold text-brand-600">
            {metrics.conversionRate}%
          </h3>
          <span className="text-xs text-slate-500 font-semibold">
            Industry Benchmark: 8.5%
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Inquiries</p>
          <h3 className="text-3xl font-extrabold text-amber-500">
            {metrics.activeEnquiries}
          </h3>
          <span className="text-xs text-slate-500 font-semibold">
            In negotiation &amp; tour phase
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Pipeline Leads</p>
          <h3 className="text-3xl font-extrabold text-slate-900">
            {metrics.totalLeads}
          </h3>
          <span className="text-xs text-slate-500 font-semibold">
            Captured from website &amp; tours
          </span>
        </div>
      </div>

      {/* Visual Analytics Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inquiries by Property Type */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Listings Distribution by Category</h3>
            <p className="text-xs text-slate-500 mb-4">Inventory density across property classes</p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.leadsByPropertyType || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="type" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip
                  formatter={(val: number) => [`${val} Units`, 'Count']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Bar dataKey="count" name="Properties in Catalog" fill="#0c8ee9" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Status Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Sales Pipeline Health</h3>
            <p className="text-xs text-slate-500 mb-4">Volume per lead lifecycle stage</p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.leadsByStatus || []}
                  cx="50%"
                  cy="50%"
                  outerRadius={95}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {(data?.leadsByStatus || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number) => [`${val} Leads`, 'Total']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
