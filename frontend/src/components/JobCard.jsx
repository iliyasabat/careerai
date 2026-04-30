import React from 'react';
import { MapPin, Briefcase, Clock, ChevronRight, Bookmark } from 'lucide-react';
import MatchBadge from './MatchBadge';

const JobCard = ({ job }) => {
  const getModeColor = (mode) => {
    switch (mode) {
      case 'Remote': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Hybrid': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Onsite': return 'bg-blue-50 text-blue-700 border-blue-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <div className="group bg-white border border-slate-200 rounded-xl p-6 transition-all duration-200 hover:shadow-md hover:-translate-y-1 relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center text-xl font-bold font-display group-hover:scale-110 transition-transform">
            {job.company[0]}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">{job.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-medium text-slate-600">{job.company}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {job.location}
              </span>
            </div>
          </div>
        </div>
        <button className="text-slate-300 hover:text-amber-400 transition-colors">
          <Bookmark className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getModeColor(job.mode)}`}>
          {job.mode}
        </span>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium border border-slate-200 bg-slate-50 text-slate-600">
          {job.salary}
        </span>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium border border-slate-200 bg-slate-50 text-slate-600">
          {job.experience}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-6">
        {job.skills_required.slice(0, 4).map((skill, idx) => (
          <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium uppercase tracking-wider">
            {skill}
          </span>
        ))}
        {job.skills_required.length > 4 && (
          <span className="px-2 py-0.5 bg-slate-50 text-slate-400 rounded text-[10px] font-medium">
            +{job.skills_required.length - 4} more
          </span>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Clock className="w-3.5 h-3.5" />
          {job.posted}
        </div>
        <div className="flex items-center gap-4">
          <MatchBadge score={job.match_score} />
          <button className="text-primary hover:translate-x-1 transition-transform p-1">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
