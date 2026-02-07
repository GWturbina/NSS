'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, ChevronLeft, ChevronRight, Check, Star } from 'lucide-react';

interface RoadmapModalProps {
  onClose: () => void;
}

const LEVELS = [
  { id: 0, emoji: '🔐', price: 0, nstPerTap: 0.1, nstBonus: 0, cgtBonus: 10, gwtBonus: 5, unlocks: ['safes'] },
  { id: 1, emoji: '🪓', price: 0.0015, nstPerTap: 0.2, nstBonus: 50, cgtBonus: 5, gwtBonus: 5, unlocks: ['partner_10'] },
  { id: 2, emoji: '🔍', price: 0.003, nstPerTap: 0.4, nstBonus: 100, cgtBonus: 5, gwtBonus: 5, unlocks: [] },
  { id: 3, emoji: '🛒', price: 0.006, nstPerTap: 0.6, nstBonus: 200, cgtBonus: 10, gwtBonus: 10, unlocks: [] },
  { id: 4, emoji: '⚙️', price: 0.012, nstPerTap: 1.0, nstBonus: 400, cgtBonus: 15, gwtBonus: 15, unlocks: ['automation', 'academy'] },
  { id: 5, emoji: '💎', price: 0.024, nstPerTap: 1.5, nstBonus: 800, cgtBonus: 35, gwtBonus: 35, unlocks: ['gem_cutting'] },
  { id: 6, emoji: '💍', price: 0.048, nstPerTap: 2.0, nstBonus: 1500, cgtBonus: 75, gwtBonus: 75, unlocks: ['jewelry'] },
  { id: 7, emoji: '🏗️', price: 0.096, nstPerTap: 3.0, nstBonus: 3000, cgtBonus: 150, gwtBonus: 150, unlocks: ['square_meters', 'p2p'] },
  { id: 8, emoji: '🏠', price: 0.192, nstPerTap: 4.0, nstBonus: 6000, cgtBonus: 300, gwtBonus: 300, unlocks: ['construction'] },
  { id: 9, emoji: '🌍', price: 0.384, nstPerTap: 6.0, nstBonus: 12000, cgtBonus: 600, gwtBonus: 600, unlocks: ['own_home'] },
  { id: 10, emoji: '🏘️', price: 0.768, nstPerTap: 8.0, nstBonus: 25000, cgtBonus: 1200, gwtBonus: 1200, unlocks: ['village'] },
  { id: 11, emoji: '🏨', price: 1.536, nstPerTap: 12.0, nstBonus: 50000, cgtBonus: 2400, gwtBonus: 2400, unlocks: ['resort', 'millionaire'] },
  { id: 12, emoji: '🏰', price: 3.072, nstPerTap: 16.0, nstBonus: 100000, cgtBonus: 4500, gwtBonus: 4500, unlocks: ['empire', 'pension'] },
];

export function RoadmapModal({ onClose }: RoadmapModalProps) {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const level = LEVELS[currentIndex];

  const goNext = () => {
    if (currentIndex < LEVELS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gradient-to-b from-navy-700 to-navy-900 rounded-2xl w-full max-w-md border border-navy-600 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-navy-600">
          <h2 className="text-lg font-bold text-white">{t('roadmap.title')}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-1 py-3 overflow-x-auto px-4">
          {LEVELS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`
                w-2 h-2 rounded-full transition-all flex-shrink-0
                ${i === currentIndex ? 'w-6 bg-gold-500' : 'bg-navy-600 hover:bg-navy-500'}
              `}
            />
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Level Header */}
          <div className="text-center mb-6">
            <div className="text-6xl mb-3">{level.emoji}</div>
            <h3 className="text-xl font-bold text-white">
              {t(`levels.${level.id}.name`)}
            </h3>
            <p className="text-gray-400 text-sm">
              {t(`levels.${level.id}.tool`)}
            </p>
          </div>

          {/* Price */}
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-gold-400">
              {level.price > 0 ? `${level.price} BNB` : 'БЕСПЛАТНО'}
            </div>
            {level.price > 0 && (
              <div className="text-gray-500">~${(level.price * 650).toFixed(0)} USD</div>
            )}
          </div>

          {/* Benefits */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between p-3 bg-navy-800 rounded-xl">
              <span className="text-gray-400">NST за тап</span>
              <span className="font-bold text-white">{level.nstPerTap}</span>
            </div>
            <div className="flex justify-between p-3 bg-navy-800 rounded-xl">
              <span className="text-gray-400">Бонус NST</span>
              <span className="font-bold text-cyan-400">+{level.nstBonus}</span>
            </div>
            <div className="flex justify-between p-3 bg-navy-800 rounded-xl">
              <span className="text-gray-400">Бонус CGT</span>
              <span className="font-bold text-pink-400">+{level.cgtBonus}</span>
            </div>
            <div className="flex justify-between p-3 bg-navy-800 rounded-xl">
              <span className="text-gray-400">Бонус GWT</span>
              <span className="font-bold text-purple-400">+{level.gwtBonus}</span>
            </div>
          </div>

          {/* Unlocks */}
          {level.unlocks.length > 0 && (
            <div className="mb-6">
              <div className="text-sm text-gray-400 mb-2">{t('roadmap.unlocks')}:</div>
              <div className="flex flex-wrap gap-2">
                {level.unlocks.map(unlock => (
                  <div key={unlock} className="px-3 py-1 bg-gold-500/20 text-gold-400 rounded-full text-sm">
                    {t(`roadmap.unlock_${unlock}`)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between p-4 border-t border-navy-600">
          <button
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="p-2 rounded-xl bg-navy-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <span className="text-gray-400">
            {currentIndex + 1} / {LEVELS.length}
          </span>
          
          <button
            onClick={goNext}
            disabled={currentIndex === LEVELS.length - 1}
            className="p-2 rounded-xl bg-navy-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
