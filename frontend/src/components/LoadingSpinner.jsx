import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 'md', text }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 w-full h-full min-h-[200px]">
      <Loader2 className={`${sizes[size]} text-primary animate-spin mb-4`} />
      {text && <p className="text-slate-500 font-medium animate-pulse">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
