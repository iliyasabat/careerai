import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PageHeader = ({ title, subtitle, breadcrumb, action }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        {breadcrumb && (
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2 uppercase tracking-widest font-bold">
            <Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-500">{breadcrumb}</span>
          </div>
        )}
        <h1 className="text-3xl font-display font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm"
        >
          {action.icon && <action.icon className="w-4 h-4" />}
          {action.label}
        </button>
      )}
    </div>
  );
};

export default PageHeader;
