import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Table as TableIcon,
  Kanban,
  Phone,
  Mail,
  Calendar,
  Clock,
  CheckCircle,
  MessageSquare,
  ArrowRight,
  MoreVertical,
  ChevronRight,
  Trash2,
  X,
  ExternalLink,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { leadService, propertyService } from '../../services/api';
import { Lead, LeadStatus, Property } from '../../types';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

export const CrmLeadsPage: React.FC = () => {
  const { showToast } = useToast();
  const { user } = useAuth();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Modal states
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New follow-up state inside modal
  const [followUpNote, setFollowUpNote] = useState('');
  const [followUpType, setFollowUpType] = useState('Call');
  const [nextFollowUpDate, setNextFollowUpDate] = useState('');
  const [isSubmittingFollowUp, setIsSubmittingFollowUp] = useState(false);

  // Add Manual Lead Form State
  const [newLeadForm, setNewLeadForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    propertyId: '',
    preferredContactMethod: 'Phone',
    source: 'Walk-in',
    priority: 'Medium'
  });

  const statuses: LeadStatus[] = ['New', 'Contacted', 'Interested', 'Negotiation', 'Converted', 'Lost'];

  const statusColors: Record<LeadStatus, { bg: string; text: string; border: string }> = {
    New: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    Contacted: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
    Interested: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    Negotiation: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
    Converted: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    Lost: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' }
  };

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (statusFilter !== 'All') params.status = statusFilter;
      if (priorityFilter !== 'All') params.priority = priorityFilter;

      const res = await leadService.getLeads(params);
      if (res.success) {
        setLeads(res.data);
      }
    } catch (error) {
      console.error('Failed to load leads:', error);
      showToast('Error loading leads', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [searchTerm, statusFilter, priorityFilter]);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const res = await propertyService.getProperties({ limit: 50 });
        if (res.success) setProperties(res.data);
      } catch (err) {
        console.error('Failed to load properties for dropdown:', err);
      }
    };
    loadProperties();
  }, []);

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    try {
      const res = await leadService.updateStatus(leadId, { status: newStatus });
      if (res.success) {
        if (newStatus === 'Converted') {
          confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
          showToast(`Deal Converted! Congratulations! 🎉`);
        } else {
          showToast(`Lead status updated to ${newStatus}`);
        }
        // Update local state
        setLeads((prev) =>
          prev.map((l) => (l._id === leadId ? res.data : l))
        );
        if (selectedLead && selectedLead._id === leadId) {
          setSelectedLead(res.data);
        }
      }
    } catch (error) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleAddFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !followUpNote.trim()) return;

    setIsSubmittingFollowUp(true);
    try {
      const res = await leadService.addFollowUp(selectedLead._id, {
        note: followUpNote,
        type: followUpType,
        status: 'Completed',
        nextFollowUpDate: nextFollowUpDate || undefined
      });

      if (res.success) {
        showToast('Follow-up activity recorded');
        setFollowUpNote('');
        setNextFollowUpDate('');
        setSelectedLead(res.data);
        setLeads((prev) => prev.map((l) => (l._id === res.data._id ? res.data : l)));
      }
    } catch (error) {
      showToast('Failed to log follow-up note', 'error');
    } finally {
      setIsSubmittingFollowUp(false);
    }
  };

  const handleCreateManualLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadForm.name.trim() || !newLeadForm.email.trim() || !newLeadForm.phone.trim()) {
      showToast('Please fill in required fields', 'error');
      return;
    }

    try {
      const res = await leadService.submitEnquiry({
        name: newLeadForm.name,
        email: newLeadForm.email,
        phone: newLeadForm.phone,
        message: newLeadForm.message || 'Walk-in or direct phone lead recorded by agency.',
        propertyId: newLeadForm.propertyId || undefined,
        preferredContactMethod: newLeadForm.preferredContactMethod,
        source: newLeadForm.source
      });

      if (res.success) {
        showToast('New lead added to CRM pipeline!');
        setIsAddModalOpen(false);
        setNewLeadForm({
          name: '',
          email: '',
          phone: '',
          message: '',
          propertyId: '',
          preferredContactMethod: 'Phone',
          source: 'Walk-in',
          priority: 'Medium'
        });
        fetchLeads();
      }
    } catch (error) {
      showToast('Failed to create lead', 'error');
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      const res = await leadService.deleteLead(leadId);
      if (res.success) {
        showToast('Lead deleted');
        setLeads((prev) => prev.filter((l) => l._id !== leadId));
        if (selectedLead && selectedLead._id === leadId) {
          setIsDetailModalOpen(false);
          setSelectedLead(null);
        }
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Delete failed', 'error');
    }
  };

  const openLeadDetail = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Strip */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by client name, email, phone, or property..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Right Action buttons: View Switcher & + Add Lead */}
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="inline-flex p-1 rounded-xl bg-slate-100 text-xs font-bold">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                  viewMode === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Table</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('kanban')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                  viewMode === 'kanban' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Kanban className="w-3.5 h-3.5" />
                <span>Pipeline Board</span>
              </button>
            </div>

            {/* + Add Manual Lead Button */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-600/25 transition"
            >
              <Plus className="w-4 h-4" />
              <span>New Lead</span>
            </button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3">
          {/* Status filter pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-bold uppercase text-[10px] mr-1">Status:</span>
            {['All', ...statuses].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                  statusFilter === st
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Priority filter */}
          <div className="flex items-center gap-1.5 text-xs ml-auto">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-medium bg-white"
            >
              <option value="All">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content: Table or Kanban Board */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-9 h-9 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : leads.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-300 text-center space-y-3">
          <Users className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No leads match your criteria</h3>
          <p className="text-xs text-slate-500">
            Submit a test inquiry through the website or click "+ New Lead" to create one.
          </p>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Client Contact</th>
                  <th className="py-3.5 px-4">Interested Property</th>
                  <th className="py-3.5 px-4">Pipeline Status</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Follow-ups</th>
                  <th className="py-3.5 px-4">Enquiry Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {leads.map((lead) => {
                  const pill = statusColors[lead.status] || { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' };
                  return (
                    <tr key={lead._id} className="hover:bg-slate-50/80 transition">
                      <td className="py-4 px-4 font-semibold text-slate-900">
                        <div className="text-sm font-bold text-slate-900">{lead.name}</div>
                        <div className="text-[11px] text-slate-500">{lead.email}</div>
                        <div className="text-[11px] text-brand-600 font-mono mt-0.5">{lead.phone}</div>
                      </td>

                      <td className="py-4 px-4 max-w-xs">
                        {lead.propertyName ? (
                          <div className="space-y-0.5">
                            <span className="font-semibold text-slate-800 line-clamp-1">
                              {lead.propertyName}
                            </span>
                            {lead.propertyPrice ? (
                              <span className="text-[11px] text-slate-500">
                                ${lead.propertyPrice.toLocaleString()}
                              </span>
                            ) : null}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">General Brokerage Inquiry</span>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead._id, e.target.value as LeadStatus)}
                          className={`text-xs font-bold px-2.5 py-1 rounded-full border ${pill.bg} ${pill.text} ${pill.border} focus:outline-none cursor-pointer`}
                        >
                          {statuses.map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </td>

                      <td className="py-4 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          lead.priority === 'Urgent'
                            ? 'bg-rose-100 text-rose-800'
                            : lead.priority === 'High'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {lead.priority}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <button
                          onClick={() => openLeadDetail(lead)}
                          className="flex items-center gap-1.5 text-xs text-brand-600 hover:text-brand-700 font-semibold"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>{lead.followUps ? lead.followUps.length : 0} logs</span>
                        </button>
                      </td>

                      <td className="py-4 px-4 text-slate-500 text-[11px]">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openLeadDetail(lead)}
                            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-brand-600 text-white font-bold text-xs transition shadow-sm"
                          >
                            Details &amp; Notes
                          </button>
                          {user?.role === 'admin' && (
                            <button
                              onClick={() => handleDeleteLead(lead._id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                              title="Delete Lead"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* KANBAN PIPELINE BOARD VIEW (Horizontal Swipe on Mobile & Grid on Desktop) */
        <div className="flex md:grid md:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory">
          {statuses.map((columnStatus) => {
            const columnLeads = leads.filter((l) => l.status === columnStatus);
            const pill = statusColors[columnStatus];

            return (
              <div
                key={columnStatus}
                className="bg-slate-100/90 rounded-2xl p-3 border border-slate-200/80 flex flex-col h-[620px] sm:h-[720px] min-w-[285px] sm:min-w-[320px] md:min-w-0 shrink-0 snap-center"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      columnStatus === 'New' ? 'bg-blue-500' :
                      columnStatus === 'Contacted' ? 'bg-cyan-500' :
                      columnStatus === 'Interested' ? 'bg-amber-500' :
                      columnStatus === 'Negotiation' ? 'bg-orange-500' :
                      columnStatus === 'Converted' ? 'bg-emerald-500' : 'bg-rose-500'
                    }`} />
                    <span className="font-bold text-slate-800 text-xs uppercase tracking-wider">{columnStatus}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-600 shadow-xs">
                    {columnLeads.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {columnLeads.map((lead) => (
                    <div
                      key={lead._id}
                      onClick={() => openLeadDetail(lead)}
                      className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition cursor-pointer space-y-2 group"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-bold text-slate-900 text-xs group-hover:text-brand-600 transition truncate">
                          {lead.name}
                        </h4>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          lead.priority === 'Urgent' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {lead.priority}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {lead.propertyName || 'General Inquiry'}
                      </p>

                      <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-100">
                        <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                        <span className="font-semibold text-brand-600">{lead.followUps.length} follow-ups</span>
                      </div>

                      {/* Quick Move Forward Arrow */}
                      <div className="pt-1 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead._id, e.target.value as LeadStatus)}
                          className="text-[10px] font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5"
                        >
                          {statuses.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* LEAD DETAIL & FOLLOW-UP MANAGEMENT DRAWER / MODAL */}
      {isDetailModalOpen && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold">
                  {selectedLead.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{selectedLead.name}</h3>
                  <p className="text-xs text-slate-400">{selectedLead.email} • {selectedLead.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body Scrollable */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Status Transition Bar */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                  Pipeline Progression
                </label>
                <div className="grid grid-cols-6 gap-1 bg-slate-100 p-1 rounded-xl">
                  {statuses.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(selectedLead._id, st)}
                      className={`py-1.5 rounded-lg font-bold text-[10px] transition text-center ${
                        selectedLead.status === st
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact & Interested Property Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                  <span className="font-bold text-slate-400 uppercase text-[10px]">Client Information</span>
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900 text-sm">{selectedLead.name}</div>
                    <div className="text-slate-600 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <a href={`mailto:${selectedLead.email}`} className="text-brand-600 hover:underline">
                        {selectedLead.email}
                      </a>
                    </div>
                    <div className="text-slate-600 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <a href={`tel:${selectedLead.phone}`} className="hover:underline">
                        {selectedLead.phone}
                      </a>
                    </div>
                    <div className="text-slate-500 text-[11px] pt-1">
                      Preferred: <span className="font-semibold text-slate-800">{selectedLead.preferredContactMethod}</span> • Source: {selectedLead.source}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-brand-50/60 rounded-2xl border border-brand-100 space-y-2">
                  <span className="font-bold text-brand-600 uppercase text-[10px]">Target Property</span>
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900 text-sm">
                      {selectedLead.propertyName || 'General Inquiry'}
                    </div>
                    {selectedLead.propertyPrice ? (
                      <div className="text-xs font-bold text-brand-700">
                        ${selectedLead.propertyPrice.toLocaleString()}
                      </div>
                    ) : null}
                    <div className="text-[11px] text-slate-500 pt-1">
                      Received: {new Date(selectedLead.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Inquiry Message */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                <span className="font-bold text-slate-400 uppercase text-[10px]">Customer Message</span>
                <p className="text-slate-700 leading-relaxed italic">
                  "{selectedLead.message}"
                </p>
              </div>

              {/* Follow-up Note Form */}
              <form onSubmit={handleAddFollowUp} className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-xs">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-brand-600" />
                  <span>Log Follow-up Interaction</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <select
                      value={followUpType}
                      onChange={(e) => setFollowUpType(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                    >
                      <option value="Call">Phone Call</option>
                      <option value="Email">Email Follow-up</option>
                      <option value="Meeting">Office Meeting</option>
                      <option value="Site Visit">Property Walkthrough</option>
                      <option value="Note">Internal Note</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="date"
                      value={nextFollowUpDate}
                      onChange={(e) => setNextFollowUpDate(e.target.value)}
                      placeholder="Next follow-up reminder date"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-600"
                    />
                  </div>
                </div>

                <textarea
                  rows={2}
                  required
                  placeholder="Enter interaction details (e.g. Spoke with buyer regarding cash offer, sent floor plans...)"
                  value={followUpNote}
                  onChange={(e) => setFollowUpNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                />

                <button
                  type="submit"
                  disabled={isSubmittingFollowUp}
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs transition shadow-sm"
                >
                  {isSubmittingFollowUp ? 'Logging Note...' : 'Save Follow-up Note'}
                </button>
              </form>

              {/* Chronological History Timeline */}
              <div className="space-y-3">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Activity History Timeline ({selectedLead.followUps ? selectedLead.followUps.length : 0})</span>
                </span>

                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {(selectedLead.followUps || []).map((fu, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 shrink-0 font-bold text-[10px]">
                        {fu.type === 'Call' ? <Phone className="w-3 h-3 text-blue-500" /> :
                         fu.type === 'Email' ? <Mail className="w-3 h-3 text-purple-500" /> :
                         fu.type === 'Site Visit' ? <Calendar className="w-3 h-3 text-emerald-500" /> :
                         <MessageSquare className="w-3 h-3 text-amber-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span className="font-semibold text-slate-800">{fu.addedByName || 'Agent'}</span>
                          <span>{new Date(fu.followUpDate || fu.createdAt || Date.now()).toLocaleString()}</span>
                        </div>
                        <p className="text-slate-700 mt-0.5 leading-relaxed">{fu.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD MANUAL LEAD MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Add Manual Lead</h3>
                <p className="text-xs text-slate-400">Record a walk-in, phone call or off-line inquiry</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManualLead} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Thomas Wayne"
                  value={newLeadForm.name}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="thomas@wayne.com"
                    value={newLeadForm.email}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={newLeadForm.phone}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Interested Property</label>
                <select
                  value={newLeadForm.propertyId}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, propertyId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                >
                  <option value="">General Inquiry (No specific property)</option>
                  {properties.map((p) => (
                    <option key={p._id} value={p._id}>{p.title} (${p.price.toLocaleString()})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Inquiry Source</label>
                  <select
                    value={newLeadForm.source}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, source: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option value="Walk-in">Walk-in Office Visit</option>
                    <option value="Direct Call">Direct Phone Call</option>
                    <option value="Referral">Client Referral</option>
                    <option value="Schedule Tour">Private Tour Request</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={newLeadForm.priority}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, priority: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notes / Requirement</label>
                <textarea
                  rows={2}
                  value={newLeadForm.message}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, message: e.target.value })}
                  placeholder="Notes from consultation..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold"
                >
                  Create Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

