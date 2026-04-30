import React from 'react';
import { 
  RadialBarChart, 
  RadialBar, 
  ResponsiveContainer 
} from 'recharts';

const ScoreGauge = ({ score = 0, size = 'lg' }) => {
  const data = [
    { name: 'score', value: score, fill: '#6366F1' },
    { name: 'background', value: 100, fill: '#F1F5F9' }
  ];

  const dimensions = size === 'lg' ? 240 : 120;
  const innerRadius = size === 'lg' ? '70%' : '60%';
  const barSize = size === 'lg' ? 12 : 6;

  return (
    <div className="relative flex items-center justify-center" style={{ width: dimensions, height: dimensions }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart 
          cx="50%" 
          cy="50%" 
          innerRadius={innerRadius} 
          outerRadius="100%" 
          barSize={barSize} 
          data={data}
          startAngle={90}
          endAngle={450}
        >
          <RadialBar
            minAngle={15}
            background
            clockWise
            dataKey="value"
            cornerRadius={barSize / 2}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
        <span className={`font-mono font-bold text-slate-900 ${size === 'lg' ? 'text-5xl' : 'text-2xl'}`}>
          {score}
        </span>
        {size === 'lg' && <span className="text-sm font-medium text-slate-400 mt-1 uppercase tracking-wider">ATS Score</span>}
      </div>
    </div>
  );
};

export default ScoreGauge;
