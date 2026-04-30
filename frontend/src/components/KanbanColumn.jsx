import React from 'react';
import { Plus, MoreVertical } from 'lucide-react';
import ApplicationCard from './ApplicationCard';

const KanbanColumn = ({ title, color, applications = [], onAdd }) => {
  const getHeaderStyle = (c) => {
    switch (c) {
      case 'slate': return 'bg-slate-100 text-slate-700';
      case 'blue': return 'bg-blue-50 text-blue-700';
      case 'amber': return 'bg-amber-50 text-amber-700';
      case 'emerald': return 'bg-emerald-50 text-emerald-700';
      case 'red': return 'bg-red-50 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="flex-1 min-w-[280px] bg-slate-50/50 rounded-2xl p-4 flex flex-col h-full border border-slate-100">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">{title}</h3>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getHeaderStyle(color)}`}>
            {applications.length}
          </span>
        </div>
        <button 
          onClick={onAdd}
          className="p-1 hover:bg-slate-200 rounded transition-colors text-slate-400"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto min-h-[500px]">
        {applications.length > 0 ? (
          applications.map((app) => (
            <ApplicationCard key={app.id} application={app} />
          ))
        ) : (
          <div className="h-32 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center p-4 text-center">
            <span className="text-xs text-slate-400 font-medium">No applications here yet</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
