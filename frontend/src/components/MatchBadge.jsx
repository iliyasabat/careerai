import React from 'react';

const MatchBadge = ({ score }) => {
  const getStyle = (s) => {
    if (s > 75) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (s >= 50) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-red-50 text-red-600 border-red-200';
  };

  return (
    <div className={`px-4 py-1.5 rounded-full text-xs font-bold border font-mono ${getStyle(score)}`}>
      {score}% Match
    </div>
  );
};

export default MatchBadge;
