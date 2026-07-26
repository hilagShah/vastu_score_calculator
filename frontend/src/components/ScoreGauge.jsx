import React, { useEffect, useState } from 'react';

const ScoreGauge = ({ score }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Smooth counter animation
    const duration = 1600;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing out cubic for smooth count
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(easedProgress * score));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [score]);

  // SVG parameters
  const radius = 70;
  const strokeWidth = 12;
  const circumference = Math.PI * radius; // Semi-circle circumference
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  // Verdict evaluation
  let ratingText = '';
  let scoreColor = '';

  if (score >= 80) {
    ratingText = 'Excellent Vastu Harmony';
    scoreColor = '#15803d'; // Green 700
  } else if (score >= 60) {
    ratingText = 'Good Vastu Harmony';
    scoreColor = '#4338ca'; // Indigo 700
  } else if (score >= 40) {
    ratingText = 'Moderate Harmony';
    scoreColor = '#b45309'; // Amber 700
  } else {
    ratingText = 'Significant Defects Found';
    scoreColor = '#be123c'; // Rose 700
  }

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <div className="relative w-48 sm:w-60 h-28 sm:h-36">
        <svg viewBox="0 0 160 100" className="w-full h-full relative z-10">
          <defs>
            <linearGradient id="gaugeGradientLight" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="35%" stopColor="#f59e0b" />
              <stop offset="65%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>

          {/* Background Arc */}
          <path
            d="M 15,90 A 70,70 0 0,1 145,90"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Colored Gauge Arc */}
          <path
            d="M 15,90 A 70,70 0 0,1 145,90"
            fill="none"
            stroke="url(#gaugeGradientLight)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.1s ease-out' }}
          />

          {/* Score Text */}
          <text
            x="80"
            y="72"
            textAnchor="middle"
            className="font-extrabold font-display select-none"
            style={{ fontSize: '34px', letterSpacing: '-0.03em', fill: scoreColor }}
          >
            {animatedScore}
          </text>
          <text
            x="80"
            y="90"
            textAnchor="middle"
            className="font-bold uppercase tracking-widest select-none"
            style={{ fontSize: '7px', fill: '#64748b' }}
          >
            Vastu Score
          </text>
        </svg>
      </div>

      <div 
        className="text-center mt-2 font-bold text-base tracking-tight font-display"
        style={{ color: scoreColor }}
      >
        {ratingText}
      </div>
    </div>
  );
};

export default ScoreGauge;
