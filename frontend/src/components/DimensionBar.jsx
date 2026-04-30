import React, { useEffect, useState } from 'react';

const DimensionBar = ({ label, score, max }) => {
  const percentage = (score / max) * 100;
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(percentage), 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  const getColorClass = (pct) => {
    if (pct > 75) return 'bg-success';
    if (pct >= 50) return 'bg-warning';
    return 'bg-danger';
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="text-xs font-mono text-slate-500">{score} / {max}</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-[width] duration-700 ease-out ${getColorClass(percentage)}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
};

export default DimensionBar;
