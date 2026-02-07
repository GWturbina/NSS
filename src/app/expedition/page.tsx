'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Mountain, Users, Trophy, ChevronRight, Lock, Zap } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';

export default function ExpeditionPage() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [selectedMatrix, setSelectedMatrix] = useState<number | null>(null);

  // Матричная структура (2^n мест на каждом уровне)
  const matrices = [
    { level: 1, places: 2, filled: 2, price: 0.0015, reward: 0.0018, status: 'completed' },
    { level: 2, places: 4, filled: 3, price: 0.003, reward: 0.0072, status: 'active' },
    { level: 3, places: 8, filled: 0, price: 0.006, reward: 0.024, status: 'locked' },
    { level: 4, places: 16, filled: 0, price: 0.012, reward: 0.096, status: 'locked' },
    { level: 5, places: 32, filled: 0, price: 0.024, reward: 0.384, status: 'locked' },
    { level: 6, places: 64, filled: 0, price: 0.048, reward: 1.536, status: 'locked' },
    { level: 7, places: 128, filled: 0, price: 0.096, reward: 6.144, status: 'locked' },
    { level: 8, places: 256, filled: 0, price: 0.192, reward: 24.576, status: 'locked' },
    { level: 9, places: 512, filled: 0, price: 0.384, reward: 98.3, status: 'locked' },
    { level: 10, places: 1024, filled: 0, price: 0.768, reward: 393.2, status: 'locked' },
    { level: 11, places: 2048, filled: 0, price: 1.536, reward: 1572.8, status: 'locked' },
    { level: 12, places: 4096, filled: 0, price: 3.072, reward: 6291.4, status: 'locked' },
  ];

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('nss_level');
    if (saved) setCurrentLevel(parseInt(saved));
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-navy-900" />;
  }

  const totalEarned = matrices
    .filter(m => m.status === 'completed')
    .reduce((sum, m) => sum + m.reward, 0);

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="p-4 pt-8">
        <h1 className="text-2xl font-bold text-white mb-1">{t('nav.expedition')}</h1>
        <p className="text-gray-400 text-sm">Клубная матричная программа</p>
      </div>

      {/* Stats */}
      <div className="px-4 grid grid-cols-2 gap-3 mb-6">
        <div className="bg-navy-800 border border-navy-600 rounded-xl p-4">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Mountain className="w-4 h-4" />
            <span className="text-sm">Уровень</span>
          </div>
          <div className="text-2xl font-bold text-white">{currentLevel}/12</div>
        </div>
        <div className="bg-navy-800 border border-navy-600 rounded-xl p-4">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Trophy className="w-4 h-4" />
            <span className="text-sm">Заработано</span>
          </div>
          <div className="text-2xl font-bold text-gold-400">{totalEarned.toFixed(4)}</div>
          <div className="text-xs text-gray-500">BNB</div>
        </div>
      </div>

      {/* Info Card */}
      <div className="px-4 mb-6">
        <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-xl p-4">
          <h3 className="font-bold text-white mb-2">🎯 Как это работает?</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• На каждом уровне ограниченное число мест</li>
            <li>• Места заполняются тобой ИЛИ переливом сверху</li>
            <li>• Когда уровень заполнен — получаешь 48%</li>
            <li>• Клуб помогает заполнять твою структуру</li>
          </ul>
        </div>
      </div>

      {/* Matrix Levels */}
      <div className="px-4 space-y-3">
        <h3 className="text-lg font-bold text-white mb-2">Матричные уровни</h3>
        
        {matrices.map((matrix) => {
          const isCompleted = matrix.status === 'completed';
          const isActive = matrix.status === 'active';
          const isLocked = matrix.status === 'locked';
          const progress = (matrix.filled / matrix.places) * 100;

          return (
            <div
              key={matrix.level}
              onClick={() => !isLocked && setSelectedMatrix(matrix.level)}
              className={`
                rounded-xl p-4 cursor-pointer transition-all
                ${isCompleted ? 'bg-green-500/10 border border-green-500/30' : ''}
                ${isActive ? 'bg-gold-500/10 border border-gold-500/50' : ''}
                ${isLocked ? 'bg-navy-800/50 border border-navy-700 opacity-60' : ''}
              `}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`
                    w-10 h-10 rounded-lg flex items-center justify-center font-bold
                    ${isCompleted ? 'bg-green-500/20 text-green-400' : ''}
                    ${isActive ? 'bg-gold-500/20 text-gold-400' : ''}
                    ${isLocked ? 'bg-navy-700 text-gray-500' : ''}
                  `}>
                    {isLocked ? <Lock className="w-5 h-5" /> : matrix.level}
                  </div>
                  <div>
                    <div className="text-white font-medium">Уровень {matrix.level}</div>
                    <div className="text-xs text-gray-500">{matrix.places} мест</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${isCompleted ? 'text-green-400' : isActive ? 'text-gold-400' : 'text-gray-500'}`}>
                    {matrix.reward} BNB
                  </div>
                  <div className="text-xs text-gray-500">награда</div>
                </div>
              </div>

              {/* Progress Bar */}
              {!isLocked && (
                <div className="relative">
                  <div className="h-2 bg-navy-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all ${isCompleted ? 'bg-green-500' : 'bg-gold-500'}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1 text-xs">
                    <span className="text-gray-500">{matrix.filled}/{matrix.places}</span>
                    <span className={isCompleted ? 'text-green-400' : 'text-gold-400'}>
                      {progress.toFixed(0)}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Level Detail Modal */}
      {selectedMatrix && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center"
          onClick={() => setSelectedMatrix(null)}
        >
          <div 
            className="bg-navy-800 rounded-t-3xl sm:rounded-2xl p-6 w-full max-w-md border-t border-navy-600 sm:border"
            onClick={e => e.stopPropagation()}
          >
            {(() => {
              const matrix = matrices.find(m => m.level === selectedMatrix)!;
              const isCompleted = matrix.status === 'completed';
              const isActive = matrix.status === 'active';
              
              return (
                <>
                  <div className="text-center mb-6">
                    <div className={`
                      w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-3
                      ${isCompleted ? 'bg-green-500/20 text-green-400' : 'bg-gold-500/20 text-gold-400'}
                    `}>
                      {matrix.level}
                    </div>
                    <h2 className="text-xl font-bold text-white">Матрица {matrix.level}</h2>
                    <p className="text-gray-400">{matrix.places} мест в структуре</p>
                  </div>

                  {/* Matrix Visualization */}
                  <div className="bg-navy-700 rounded-xl p-4 mb-6">
                    <div className="grid grid-cols-4 gap-2">
                      {Array.from({ length: Math.min(matrix.places, 16) }).map((_, i) => (
                        <div 
                          key={i}
                          className={`
                            w-full aspect-square rounded-lg flex items-center justify-center
                            ${i < matrix.filled ? 'bg-gold-500 text-navy-900' : 'bg-navy-600 text-gray-500'}
                          `}
                        >
                          {i < matrix.filled ? '✓' : (i + 1)}
                        </div>
                      ))}
                    </div>
                    {matrix.places > 16 && (
                      <p className="text-center text-gray-500 text-sm mt-2">
                        ... и ещё {matrix.places - 16} мест
                      </p>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between p-3 bg-navy-700 rounded-xl">
                      <span className="text-gray-400">Стоимость входа</span>
                      <span className="font-bold text-white">{matrix.price} BNB</span>
                    </div>
                    <div className="flex justify-between p-3 bg-navy-700 rounded-xl">
                      <span className="text-gray-400">Награда (48%)</span>
                      <span className="font-bold text-gold-400">{matrix.reward} BNB</span>
                    </div>
                    <div className="flex justify-between p-3 bg-navy-700 rounded-xl">
                      <span className="text-gray-400">Прогресс</span>
                      <span className="font-bold text-white">{matrix.filled}/{matrix.places}</span>
                    </div>
                  </div>

                  {isCompleted ? (
                    <div className="py-3 text-center text-green-400 font-bold">
                      ✓ Уровень завершён
                    </div>
                  ) : isActive ? (
                    <div className="py-3 text-center text-gold-400">
                      ⏳ Ожидание заполнения...
                    </div>
                  ) : null}

                  <button
                    onClick={() => setSelectedMatrix(null)}
                    className="w-full mt-3 py-3 bg-navy-700 text-gray-400 rounded-xl hover:text-white transition-colors"
                  >
                    Закрыть
                  </button>
                </>
              );
            })()}
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
