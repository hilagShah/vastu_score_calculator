import React from 'react';
import { Check } from 'lucide-react';

const StepProgressBar = ({ currentStep }) => {
  const steps = [
    { number: 1, label: 'Owner Info', shortLabel: 'Owner' },
    { number: 2, label: 'Room Zones', shortLabel: 'Rooms' },
    { number: 3, label: 'Property Config', shortLabel: 'Config' },
  ];

  return (
    <div className="w-full mb-12 sm:mb-10 px-1 sm:px-0">
      <div className="relative flex items-center justify-between w-full">
        {/* Track Line Background */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 rounded-full z-0" />
        
        {/* Active Track Line */}
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-600 rounded-full z-0 transition-all duration-500 ease-in-out"
          style={{ 
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`
          }}
        />

        {/* Step Nodes */}
        {steps.map((step) => {
          const isCompleted = step.number < currentStep;
          const isActive = step.number === currentStep;
          
          return (
            <div key={step.number} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-indigo-600 text-white shadow-indigo-sm' 
                    : isActive 
                    ? 'bg-white border-2 border-indigo-600 text-indigo-600 shadow-md scale-110' 
                    : 'bg-white border border-slate-300 text-slate-400'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
                ) : (
                  step.number
                )}
              </div>

              {/* Responsive Step Label */}
              <span 
                className={`absolute top-10 sm:top-12 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap transition-colors duration-200 ${
                  isActive 
                    ? 'text-indigo-600 font-bold' 
                    : isCompleted 
                    ? 'text-slate-800' 
                    : 'text-slate-400'
                }`}
              >
                <span className="inline sm:hidden">{step.shortLabel}</span>
                <span className="hidden sm:inline">{step.label}</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepProgressBar;
