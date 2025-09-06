"use client";
import React, { useState, useEffect } from 'react';

interface StatsCounterProps {
  targetValue: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

export const StatsCounter: React.FC<StatsCounterProps> = ({ 
  targetValue, 
  duration = 2000, 
  suffix = "", 
  className = "" 
}) => {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    if (targetValue === 0) return;

    const increment = targetValue / (duration / 50);
    const timer = setInterval(() => {
      setCurrentValue(prev => {
        const nextValue = prev + increment;
        if (nextValue >= targetValue) {
          clearInterval(timer);
          return targetValue;
        }
        return nextValue;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [targetValue, duration]);

  const formatNumber = (num: number) => {
    const rounded = Math.floor(num);
    if (rounded >= 1000) {
      return `${(rounded / 1000).toFixed(1)}k`;
    }
    return rounded.toString();
  };

  return (
    <span className={className}>
      {formatNumber(currentValue)}{suffix}
    </span>
  );
};
