import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Briefcase,
  Target,
  Trophy,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import KanbanColumn from '../components/KanbanColumn';
import LoadingSpinner from '../components/LoadingSpinner';
import { getApplications, addApplication } from '../api';

const COLUMNS = [
  { id: 'Applied',   title: 'Applied',   color: 'slate',   icon: Target },
  { id: 'Screening', title: 'Screening', color: 'blue',    icon: Search },
  { id: 'Interview', title: 'Interview', color: 'amber',   icon: Clock },
  { id: 'Offer',     title: 'Offer',     color: 'emerald', icon: Trophy },
  { id: 'Rejected',  title: 'Rejected',  color: 'red',     icon: XCircle }
];

const emptyForm = {
  company: '',
  role: '',
  status: 'Applied',
  date_applied: new Date().toISOString().slice(0, 10),
  notes: ''
};

const TrackerPage = () => {
  const [loading, setLoading] = useState(true);
  const [apps, setApps] = useState([]);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const loadApps = async () => {
    const res = await getApplications();
    if (res?.error) {
      setError(res.message || 'Failed to load applications');
      setApps([]);
    } else {
      setError('');
      setApps(Array.isArray(res) ? res : []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadApps();
  }, []);

  const updateForm = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleAdd = async () => {
    if (!form.company.trim() || !form.role.trim() || !form.date_applied) {
      setFormError('Company, role, and date are required.');
      return;
    }
    setSaving(true);
    setFormError('');
    const res = await addApplication(form);
    setSaving(false);
    if (res?.error) {
      setFormError(res.message || 'Could not add application.');
      return;
    }
    setShowModal(false);
    setForm(emptyForm);
    await loadApps();
  };

  const closeModal = () => {
    setShowModal(false);
    setForm(emptyForm);
    setFormError('');
  };

  if (loading) return <LoadingSpinner text="Loading your application board..." />;

  return (
    <div className="space-y-8 animate-slide-up pb-32">
      <PageHeader
        title="Application Tracker"
        subtitle="Manage and track your interview journey across 5 stages."
        breadcrumb="Tracker"
        action={{ label: 'Add Application', icon: Plus, onClick: () => setShowModal(true) }}
      />

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-700 font-medium">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {COLUMNS.map((col) => {
          const count = apps.filter((a) => a.status === col.id).length;
          return (
            <div key={col.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm group hover:border-primary/20 transition-all">
              <div className="flex justify-between items-center mb-2">
                <div className={`p-1.5 rounded-lg bg-${col.color}-50 text-${col.color}-700`}>
                  <col.icon className="w-4 h-4" />
                </div>
                <span className="text-xl font-mono font-bold text-slate-900">{count}</span>
              </div>
              <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">{col.title}</h4>
            </div>
          );
        })}
      </div>

      {apps.length === 0 && !error ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-200 rounded-3xl text-center">
          <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-4">
            <Briefcase className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-display font-bold text-slate-900 mb-2">No applications yet</h3>
          <p className="text-sm text-slate-500 max-w-xs mb-6">Add your first application to see it on the kanban board.</p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl font-bold"
          >
            <Plus className="w-4 h-4" /> Add Application
          </button>
        </div>
      ) : (
        <div className="flex overflow-x-auto gap-6 pb-8 min-h-[600px] scrollbar-hide">
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col.id}
              title={col.title}
              color={col.color}
              applications={apps.filter((a) => a.status === col.id)}
              onAdd={() => setShowModal(true)}
            />
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 transition-all animate-slide-up">
          <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
            <h3 className="text-2xl font-display font-bold text-slate-900 mb-8">Add New Application</h3>

            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 ml-1">Company *</label>
                  <input
                    type="text"
                    placeholder="e.g. Swiggy"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary transition-all"
                    value={form.company}
                    onChange={(e) => updateForm('company', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 ml-1">Role *</label>
                  <input
                    type="text"
                    placeholder="e.g. SDE-1"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary transition-all"
                    value={form.role}
                    onChange={(e) => updateForm('role', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 ml-1">Status</label>
                  <select
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-primary transition-all"
                    value={form.status}
                    onChange={(e) => updateForm('status', e.target.value)}
                  >
                    {COLUMNS.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 ml-1">Date Applied *</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary transition-all"
                    value={form.date_applied}
                    onChange={(e) => updateForm('date_applied', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 ml-1">Notes</label>
                <textarea
                  placeholder="Any specific details or deadlines..."
                  className="w-full h-24 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary transition-all resize-none"
                  value={form.notes}
                  onChange={(e) => updateForm('notes', e.target.value)}
                />
              </div>

              {formError && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-700 font-medium">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  onClick={closeModal}
                  disabled={saving}
                  className="flex-1 px-6 py-4 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  disabled={saving}
                  className="flex-1 px-6 py-4 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/20"
                >
                  {saving ? 'Saving…' : 'Add Application'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackerPage;
