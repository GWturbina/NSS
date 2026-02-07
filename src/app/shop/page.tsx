'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Lock, Zap, Gift, Star } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';

const LEVELS = [
  { id: 0, emoji: '🔐', name: 'Регистрация', tool: 'Сейф', price: 0, nstPerTap: 0.1, nstBonus: 0, cgtBonus: 10, gwtBonus: 5 },
  { id: 1, emoji: '🪓', name: 'Копатель', tool: 'Лопата', price: 0.0015, nstPerTap: 0.2, nstBonus: 50, cgtBonus: 5, gwtBonus: 5 },
  { id: 2, emoji: '🔍', name: 'Просеиватель', tool: 'Сито', price: 0.003, nstPerTap: 0.4, nstBonus: 100, cgtBonus: 5, gwtBonus: 5 },
  { id: 3, emoji: '🛒', name: 'Возчик', tool: 'Тачка', price: 0.006, nstPerTap: 0.6, nstBonus: 200, cgtBonus: 10, gwtBonus: 10 },
  { id: 4, emoji: '⚙️', name: 'Оператор', tool: 'Авто-Шахта', price: 0.012, nstPerTap: 1.0, nstBonus: 400, cgtBonus: 15, gwtBonus: 15 },
  { id: 5, emoji: '💎', name: 'Огранщик', tool: 'Огранка', price: 0.024, nstPerTap: 1.5, nstBonus: 800, cgtBonus: 35, gwtBonus: 35 },
  { id: 6, emoji: '💍', name: 'Ювелир', tool: 'Ювелирка', price: 0.048, nstPerTap: 2.0, nstBonus: 1500, cgtBonus: 75, gwtBonus: 75 },
  { id: 7, emoji: '🏗️', name: 'Строитель', tool: 'Участок', price: 0.096, nstPerTap: 3.0, nstBonus: 3000, cgtBonus: 150, gwtBonus: 150 },
  { id: 8, emoji: '🏠', name: 'Застройщик', tool: 'Стройка', price: 0.192, nstPerTap: 4.0, nstBonus: 6000, cgtBonus: 300, gwtBonus: 300 },
  { id: 9, emoji: '🌍', name: 'Землевладелец', tool: 'Территория', price: 0.384, nstPerTap: 6.0, nstBonus: 12000, cgtBonus: 600, gwtBonus: 600 },
  { id: 10, emoji: '🏘️', name: 'Мэр', tool: 'Посёлок', price: 0.768, nstPerTap: 8.0, nstBonus: 25000, cgtBonus: 1200, gwtBonus: 1200 },
  { id: 11, emoji: '🏨', name: 'Губернатор', tool: 'Курорт', price: 1.536, nstPerTap: 12.0, nstBonus: 50000, cgtBonus: 2400, gwtBonus: 2400 },
  { id: 12, emoji: '🏰', name: 'Император', tool: 'Империя', price: 3.072, nstPerTap: 16.0, nstBonus: 100000, cgtBonus: 4500, gwtBonus: 4500 },
];

export default function ShopPage() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState<typeof LEVELS[0] | null>(null);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('nss_level');
    if (saved) setCurrentLevel(parseInt(saved));
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-navy-900" />;
  }

  const handleBuy = (level: typeof LEVELS[0]) => {
    // Здесь будет реальная транзакция через контракт
    alert(`Покупка: ${level.tool} за ${level.price} BNB\n\nЭто демо. В реальной версии будет транзакция.`);
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="p-4 pt-8">
        <h1 className="text-2xl font-bold text-white mb-1">{t('shop.title')}</h1>
        <p className="text-gray-400 text-sm">Прокачай свои инструменты</p>
      </div>

      {/* Current Level Card */}
      <div className="px-4 mb-6">
        <div className="bg-gradient-to-r from-navy-700 to-navy-800 border border-gold-500/30 rounded-2xl p-4">
          <div className="flex items-center gap-4">
            <div className="text-5xl">{LEVELS[currentLevel].emoji}</div>
            <div className="flex-1">
              <div className="text-gold-400 text-sm">{t('shop.current_level')}</div>
              <div className="text-xl font-bold text-white">{LEVELS[currentLevel].name}</div>
              <div className="text-gray-400 text-sm">{LEVELS[currentLevel].tool}</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gold-400">{LEVELS[currentLevel].nstPerTap}</div>
              <div className="text-xs text-gray-400">NST/тап</div>
            </div>
          </div>
        </div>
      </div>

      {/* Levels List */}
      <div className="px-4 space-y-3">
        {LEVELS.map((level) => {
          const isPurchased = level.id <= currentLevel;
          const isNext = level.id === currentLevel + 1;
          const isLocked = level.id > currentLevel + 1;

          return (
            <div
              key={level.id}
              onClick={() => !isLocked && setSelectedLevel(level)}
              className={`
                rounded-xl p-4 cursor-pointer transition-all
                ${isPurchased ? 'bg-green-500/10 border border-green-500/30' : ''}
                ${isNext ? 'bg-gold-500/10 border border-gold-500/50 hover:border-gold-400' : ''}
                ${isLocked ? 'bg-navy-800/50 border border-navy-700 opacity-50' : ''}
                ${!isPurchased && !isNext && !isLocked ? 'bg-navy-800 border border-navy-600' : ''}
              `}
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl">{level.emoji}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{level.name}</span>
                    {isPurchased && <Check className="w-4 h-4 text-green-400" />}
                    {isLocked && <Lock className="w-4 h-4 text-gray-500" />}
                    {isNext && <Star className="w-4 h-4 text-gold-400" />}
                  </div>
                  <div className="text-sm text-gray-400">{level.tool}</div>
                </div>
                <div className="text-right">
                  {level.price > 0 ? (
                    <>
                      <div className={`font-bold ${isNext ? 'text-gold-400' : 'text-white'}`}>
                        {level.price} BNB
                      </div>
                      <div className="text-xs text-gray-500">~${(level.price * 650).toFixed(0)}</div>
                    </>
                  ) : (
                    <div className="text-green-400 font-bold">БЕСПЛАТНО</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Level Detail Modal */}
      {selectedLevel && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center"
          onClick={() => setSelectedLevel(null)}
        >
          <div 
            className="bg-navy-800 rounded-t-3xl sm:rounded-2xl p-6 w-full max-w-md border-t border-navy-600 sm:border"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="text-center mb-6">
              <div className="text-6xl mb-3">{selectedLevel.emoji}</div>
              <h2 className="text-2xl font-bold text-white">{selectedLevel.name}</h2>
              <p className="text-gray-400">{selectedLevel.tool}</p>
            </div>

            {/* Benefits */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between p-3 bg-navy-700 rounded-xl">
                <span className="text-gray-400 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-gold-500" /> NST за тап
                </span>
                <span className="font-bold text-white">{selectedLevel.nstPerTap}</span>
              </div>
              <div className="flex justify-between p-3 bg-navy-700 rounded-xl">
                <span className="text-gray-400 flex items-center gap-2">
                  <Gift className="w-4 h-4 text-cyan-500" /> Бонус NST
                </span>
                <span className="font-bold text-cyan-400">+{selectedLevel.nstBonus}</span>
              </div>
              <div className="flex justify-between p-3 bg-navy-700 rounded-xl">
                <span className="text-gray-400 flex items-center gap-2">
                  <Gift className="w-4 h-4 text-pink-500" /> Бонус CGT
                </span>
                <span className="font-bold text-pink-400">+{selectedLevel.cgtBonus}</span>
              </div>
              <div className="flex justify-between p-3 bg-navy-700 rounded-xl">
                <span className="text-gray-400 flex items-center gap-2">
                  <Gift className="w-4 h-4 text-purple-500" /> Бонус GWT
                </span>
                <span className="font-bold text-purple-400">+{selectedLevel.gwtBonus}</span>
              </div>
            </div>

            {/* Price */}
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-gold-400">
                {selectedLevel.price > 0 ? `${selectedLevel.price} BNB` : 'БЕСПЛАТНО'}
              </div>
              {selectedLevel.price > 0 && (
                <div className="text-gray-500">≈ ${(selectedLevel.price * 650).toFixed(0)} USD</div>
              )}
            </div>

            {/* Action Button */}
            {selectedLevel.id <= currentLevel ? (
              <div className="py-3 text-center text-green-400 font-bold">
                ✓ Уже куплено
              </div>
            ) : selectedLevel.id === currentLevel + 1 ? (
              <button
                onClick={() => handleBuy(selectedLevel)}
                className="w-full py-4 bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 rounded-xl font-bold hover:from-gold-400 hover:to-gold-300 transition-all"
              >
                Купить за {selectedLevel.price} BNB
              </button>
            ) : (
              <div className="py-3 text-center text-gray-500">
                🔒 Сначала купите предыдущий уровень
              </div>
            )}

            <button
              onClick={() => setSelectedLevel(null)}
              className="w-full mt-3 py-2 text-gray-400 hover:text-white"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
