import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Building,
  CheckCircle2,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  DollarSign
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';
import { analyticsService } from '../../services/api';
import { DashboardData } from '../../types';

export const CrmDashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await analyticsService.getDashboardStats();
        if (res.success) {
          setData(res.data);
        }
      } catch (error) {
        console.error('Failed to load dashboard metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
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

  const statusPills: Record<string, string> = {
    New: 'bg-blue-100 text-blue-800 border-blue-200',
    Contacted: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    Interested: 'bg-amber-100 text-amber-800 border-amber-200',
    Negotiation: 'bg-orange-100 text-orange-800 border-orange-200',
    Converted: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Lost: 'bg-rose-100 text-rose-800 border-rose-200'
  };

  return (
    <div className="space-y-8">
      {/* 1. KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Properties */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Properties</p>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{metrics.totalProperties}</h3>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              Active in catalog
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <Building className="w-6 h-6" />
          </div>
        </div>

        {/* Total Leads */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Leads Captured</p>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{metrics.totalLeads}</h3>
            <span className="text-[11px] text-brand-600 font-semibold flex items-center gap-1 mt-1">
              All pipeline stages
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Active Enquiries */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Enquiries</p>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{metrics.activeEnquiries}</h3>
            <span className="text-[11px] text-amber-600 font-semibold flex items-center gap-1 mt-1">
              In progress / follow-up
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Converted Leads */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Converted Leads</p>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{metrics.convertedLeads}</h3>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              {metrics.conversionRate}% Conversion Rate
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 2. Visual Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leads by Pipeline Status (Donut Chart) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Leads by Pipeline Status</h3>
              <p className="text-xs text-slate-500">Breakdown across sales stages</p>
            </div>
            <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
              {metrics.totalLeads} Total
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.leadsByStatus || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {(data?.leadsByStatus || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number) => [`${val} Leads`, 'Count']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Trend Area Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Inquiry &amp; Conversion Trajectory</h3>
              <p className="text-xs text-slate-500">Monthly lead acquisition over last 6 months</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="flex items-center gap-1 text-brand-600">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-500" />
                <span>Leads Inflow</span>
              </span>
              <span className="flex items-center gap-1 text-emerald-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Converted</span>
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.monthlyTrends || []}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0c8ee9" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0c8ee9" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorConverted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="leads" name="New Inquiries" stroke="#0c8ee9" strokeWidth={2.5} fillOpacity={1} fill="url(#colorLeads)" />
                <Area type="monotone" dataKey="converted" name="Converted Deals" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorConverted)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. Recent Leads & Follow-ups Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Inquiries Table */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Customer Inquiries</h3>
              <p className="text-xs text-slate-500">Latest website submissions requiring follow-up</p>
            </div>
            <Link
              to="/crm/leads"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              <span>View All Leads</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3">Client</th>
                  <th className="pb-3">Interested Property</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {(data?.recentLeads || []).map((lead) => (
                  <tr key={lead._id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 font-semibold text-slate-900">
                      <div>{lead.name}</div>
                      <div className="text-[11px] text-slate-400 font-normal">{lead.email}</div>
                    </td>
                    <td className="py-3 max-w-[200px] truncate">
                      {lead.propertyName || 'General Inquiry'}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusPills[lead.status] || 'bg-slate-100'}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        to="/crm/leads"
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-600 font-bold text-[11px] transition"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Scheduled Follow-ups */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Follow-up Reminders</h3>
            <p className="text-xs text-slate-500">Upcoming scheduled calls and site tours</p>
          </div>

          <div className="space-y-3">
            {(data?.upcomingFollowUps || []).length > 0 ? (
              data?.upcomingFollowUps.map((fLead) => (
                <div
                  key={fLead._id}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 space-y-2 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{fLead.name}</span>
                    <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                      {fLead.nextFollowUpDate ? new Date(fLead.nextFollowUpDate).toLocaleDateString() : 'Today'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    Property: {fLead.propertyName || 'Inquiry'}
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href={`tel:${fLead.phone}`}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-brand-600 transition"
                      title="Call"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={`mailto:${fLead.email}`}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-brand-600 transition"
                      title="Email"
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                    <Link
                      to="/crm/leads"
                      className="ml-auto text-[11px] font-bold text-brand-600 hover:underline"
                    >
                      Open Lead →
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                <span>No pending follow-ups scheduled</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

