import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  ChevronRight, 
  Filter, 
  MoreHorizontal, 
  Briefcase,
  LayoutGrid,
  List,
  Target,
  Trophy,
  XCircle,
  Clock,
  Layout,
  Kanban
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import KanbanColumn from '../components/KanbanColumn';
import LoadingSpinner from '../components/LoadingSpinner';
import { getApplications } from '../api';

const TrackerPage = () => {
  const [loading, setLoading] = useState(true);
  const [apps, setApps] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getApplications();
        setApps(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner text="Loading your application board..." />;

  const columns = [
    { id: 'Applied', title: 'Applied', color: 'slate', icon: Target },
    { id: 'Screening', title: 'Screening', color: 'blue', icon: Search },
    { id: 'Interview', title: 'Interview', color: 'amber', icon: Clock },
    { id: 'Offer', title: 'Offer', color: 'emerald', icon: Trophy },
    { id: 'Rejected', title: 'Rejected', color: 'red', icon: XCircle }
  ];

  return (
    <div className="space-y-8 animate-slide-up pb-32">
      <PageHeader 
        title="Application Tracker" 
        subtitle="Manage and track your interview journey across 5 key stages."
        breadcrumb="Tracker"
        action={{ label: 'Add Application', icon: Plus, onClick: () => setShowModal(true) }}
      />

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {columns.map((col) => {
          const count = apps.filter(a => a.status === col.id).length;
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

      {/* Kanban Board */}
      <div className="flex overflow-x-auto gap-6 pb-8 min-h-[600px] scrollbar-hide">
        {columns.map((col) => (
          <KanbanColumn 
            key={col.id}
            title={col.title}
            color={col.color}
            applications={apps.filter(a => a.status === col.id)}
            onAdd={() => setShowModal(true)}
          />
        ))}
      </div>

      {/* Add Modal (Simplified Overlay) */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 transition-all animate-slide-up">
          <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
            <h3 className="text-2xl font-display font-bold text-slate-900 mb-8">Add New Application</h3>
            
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 ml-1">Company</label>
                  <input type="text" placeholder="e.g. Swiggy" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 ml-1">Role</label>
                  <input type="text" placeholder="e.g. SDE-1" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary transition-all" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 ml-1">Current Status</label>
                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-primary transition-all">
                  {columns.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 ml-1">Notes</label>
                <textarea placeholder="Any specific details or deadlines..." className="w-full h-24 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary transition-all resize-none" />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-4 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/20"
                >
                  Add Application
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
