'use client';

import { useState, useCallback } from 'react';

interface StoneProps {
  onTap: () => void;
  disabled?: boolean;
  stoneImage?: string;
}

interface TapEffect {
  id: number;
  x: number;
  y: number;
}

interface RewardPopup {
  id: number;
  x: number;
  y: number;
}

export function Stone({ onTap, disabled = false, stoneImage }: StoneProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [tapEffects, setTapEffects] = useState<TapEffect[]>([]);
  const [rewards, setRewards] = useState<RewardPopup[]>([]);

  const handleTap = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;

    // Get tap position
    let clientX: number, clientY: number;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Add tap effect
    const tapId = Date.now();
    setTapEffects(prev => [...prev, { id: tapId, x, y }]);
    setTimeout(() => {
      setTapEffects(prev => prev.filter(t => t.id !== tapId));
    }, 500);

    // Add reward popup
    const rewardId = Date.now() + Math.random();
    setRewards(prev => [...prev, { id: rewardId, x, y: y - 20 }]);
    setTimeout(() => {
      setRewards(prev => prev.filter(r => r.id !== rewardId));
    }, 800);

    // Trigger tap
    onTap();
  }, [onTap, disabled]);

  return (
    <div className="relative">
      {/* Glow effect behind stone */}
      <div 
        className={`
          absolute inset-0 rounded-full blur-3xl transition-opacity duration-300
          bg-gradient-to-r from-gold-500/30 to-orange-500/30
          ${isPressed ? 'opacity-100 scale-110' : 'opacity-50'}
        `}
        style={{ transform: 'scale(1.2)' }}
      />

      {/* Stone */}
      <button
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        onTouchStart={() => setIsPressed(true)}
        onTouchEnd={() => setIsPressed(false)}
        onClick={handleTap}
        disabled={disabled}
        className={`
          relative w-56 h-56 rounded-full
          bg-gradient-to-br from-gold-400 via-gold-500 to-orange-500
          shadow-2xl shadow-gold-500/30
          flex items-center justify-center
          transition-all duration-100
          ${isPressed ? 'scale-95' : 'scale-100 hover:scale-105'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          select-none
        `}
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        {/* Inner gradient */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-gold-300 via-gold-400 to-orange-400 opacity-80" />
        
        {/* Stone image or emoji */}
        <div className="relative z-10">
          {stoneImage ? (
            <img src={stoneImage} alt="Stone" className="w-24 h-24 object-contain" />
          ) : (
            <span className="text-6xl">💎</span>
          )}
        </div>

        {/* Tap effects (ripples) */}
        {tapEffects.map(effect => (
          <div
            key={effect.id}
            className="absolute pointer-events-none"
            style={{ left: effect.x, top: effect.y }}
          >
            <div className="w-8 h-8 -ml-4 -mt-4 rounded-full bg-white/40 animate-ping" />
          </div>
        ))}
      </button>

      {/* Reward popups */}
      {rewards.map(reward => (
        <div
          key={reward.id}
          className="absolute pointer-events-none animate-reward text-gold-400 font-bold text-lg"
          style={{ left: reward.x - 20, top: reward.y }}
        >
          +NST
        </div>
      ))}
    </div>
  );
}
