import React from 'react';

const EmptyState = ({ icon: Icon, title, subtitle, action }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center py-20 bg-white border border-dashed border-slate-200 rounded-3xl">
      {Icon && (
        <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-6">
          <Icon className="w-8 h-8" />
        </div>
      )}
      <h3 className="text-xl font-display font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 max-w-sm mb-8">{subtitle}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-sm"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
