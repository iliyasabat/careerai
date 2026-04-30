import React from 'react';
import { ExternalLink, PlayCircle, BookOpen, GraduationCap } from 'lucide-react';

const CourseCard = ({ course }) => {
  const getPlatformIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case 'youtube': return <PlayCircle className="text-red-500 w-4 h-4" />;
      case 'udemy': return <GraduationCap className="text-orange-500 w-4 h-4" />;
      case 'docs': return <BookOpen className="text-blue-500 w-4 h-4" />;
      default: return <GraduationCap className="text-primary w-4 h-4" />;
    }
  };

  const getPlatformBg = (platform) => {
    switch (platform.toLowerCase()) {
      case 'youtube': return 'bg-red-50 text-red-700';
      case 'udemy': return 'bg-orange-50 text-orange-700';
      case 'docs': return 'bg-blue-50 text-blue-700';
      default: return 'bg-primary-light text-primary';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 transition-all hover:border-primary group">
      <div className="flex justify-between items-start mb-3">
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${getPlatformBg(course.platform)}`}>
          {getPlatformIcon(course.platform)}
          {course.platform}
        </span>
        {course.free ? (
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">FREE</span>
        ) : (
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold text-amber-600">PAID</span>
            {course.rating && <span className="text-[10px] font-medium text-slate-400">· {course.rating}★</span>}
          </div>
        )}
      </div>

      <h4 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors line-clamp-1">{course.title}</h4>
      <p className="text-xs text-slate-500 mb-4">{course.instructor} · {course.duration}</p>
      
      <a 
        href={course.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-primary-light hover:text-primary hover:border-primary-light transition-all"
      >
        Open Resource <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
};

export default CourseCard;
