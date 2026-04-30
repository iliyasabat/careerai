import React from 'react';
import { Calendar, MoreHorizontal } from 'lucide-react';

const ApplicationCard = ({ application }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center text-xs font-bold">
            {application.company[0]}
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-slate-900 truncate">{application.company}</h4>
            <p className="text-[10px] font-medium text-slate-500 truncate">{application.role}</p>
          </div>
        </div>
        <button className="text-slate-300 hover:text-slate-600 transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {application.notes && (
        <p className="text-[11px] text-slate-500 line-clamp-2 mt-2 bg-slate-50 p-2 rounded-lg italic">
          "{application.notes}"
        </p>
      )}

      <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
          <Calendar className="w-3 h-3" />
          {application.date}
        </div>
        <div className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">
          {application.days_since}d ago
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;
