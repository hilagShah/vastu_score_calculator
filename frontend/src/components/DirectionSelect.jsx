import React from 'react';
import { Compass } from 'lucide-react';

const DirectionSelect = ({ label, value, onChange }) => {
  const directions = [
    { name: 'North-West', key: 'NW', short: 'NW' },
    { name: 'North', key: 'N', short: 'N' },
    { name: 'North-East', key: 'NE', short: 'NE' },
    { name: 'West', key: 'W', short: 'W' },
    { name: 'CENTER', key: 'center', disabled: true },
    { name: 'East', key: 'E', short: 'E' },
    { name: 'South-West', key: 'SW', short: 'SW' },
    { name: 'South', key: 'S', short: 'S' },
    { name: 'South-East', key: 'SE', short: 'SE' },
  ];

  return (
    <div className="flex flex-col gap-2.5 w-full">
      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
        {label}
      </label>
      <div className="grid grid-cols-3 gap-2 sm:gap-2.5 w-full max-w-[280px] sm:max-w-xs mx-auto">
        {directions.map((dir, idx) => {
          if (dir.disabled) {
            return (
              <div 
                key={idx}
                className="aspect-square flex items-center justify-center rounded-xl bg-slate-100 border border-slate-200 text-slate-400"
              >
                <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500/60 animate-spin-slow" />
              </div>
            );
          }

          const isSelected = value === dir.key;

          return (
            <button
              key={dir.key}
              type="button"
              onClick={() => onChange(dir.key)}
              className={`aspect-square flex flex-col items-center justify-center gap-0.5 sm:gap-1 p-1.5 sm:p-2 rounded-xl transition-all duration-200 transform active:scale-95 cursor-pointer border ${
                isSelected 
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-indigo-sm font-semibold scale-[1.02]' 
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              <span className={`text-sm sm:text-base font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                {dir.short}
              </span>
              <span className={`text-[8px] sm:text-[9px] font-medium tracking-wide truncate max-w-full ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                {dir.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DirectionSelect;
