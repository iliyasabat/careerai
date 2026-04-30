import React from 'react';
import { Check, X } from 'lucide-react';

const SkillPill = ({ skill, variant = 'neutral', index = 0 }) => {
  const variants = {
    have: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    missing: 'bg-red-50 text-red-600 border-red-200',
    neutral: 'bg-slate-100 text-slate-600 border-slate-200'
  };

  return (
    <div 
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${variants[variant]} animate-slide-up transition-all hover:scale-105`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {variant === 'have' && <Check className="w-3 h-3" />}
      {variant === 'missing' && <X className="w-3 h-3" />}
      {skill}
    </div>
  );
};

export default SkillPill;
