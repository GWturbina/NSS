'use client';

import { useTranslation } from 'react-i18next';
import { Zap } from 'lucide-react';

interface EnergyBarProps {
  current: number;
  max: number;
}

export function EnergyBar({ current, max }: EnergyBarProps) {
  const { t } = useTranslation();
  const percentage = (current / max) * 100;
  
  // Color based on energy level
  const getColor = () => {
    if (percentage > 50) return 'from-cyan-400 to-blue-500';
    if (percentage > 25) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-red-600';
  };

  // Calculate time to full
  const energyNeeded = max - current;
  const secondsToFull = energyNeeded * 10; // 10 seconds per energy
  const minutesToFull = Math.floor(secondsToFull / 60);
  const remainingSeconds = secondsToFull % 60;

  return (
    <div className="w-full">
      {/* Label */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-gray-400">
          <Zap className="w-4 h-4 text-gold-500" />
          <span className="text-sm">{t('game.energy')}</span>
        </div>
        <div className="text-white font-bold">
          {current} <span className="text-gray-500 font-normal">/ {max}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-3 bg-navy-700 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${getColor()} transition-all duration-300 rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Time to full */}
      {current < max && (
        <div className="text-xs text-gray-500 mt-1 text-right">
          {t('game.full_in')}: {minutesToFull}:{remainingSeconds.toString().padStart(2, '0')}
        </div>
      )}
    </div>
  );
}
