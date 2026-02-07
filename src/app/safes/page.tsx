'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Lock, Unlock, TrendingUp, Coins, Gift } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';

export default function SafesPage() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  // Данные сейфов (будут из контракта)
  const safes = {
    nst: { balance: 125.5, locked: false, icon: '💎' },
    cgt: { balance: 10, locked: !isRegistered, icon: '🎁' },
    gwt: { balance: 5, locked: !isRegistered, icon: '🪙' },
  };

  useEffect(() => {
    setMounted(true);
    // Проверка регистрации из localStorage (потом из контракта)
    const reg = localStorage.getItem('nss_registered');
    setIsRegistered(reg === 'true');
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-navy-900" />;
  }

  const totalValue = safes.nst.balance * 0.001 + safes.cgt.balance * 0.01 + safes.gwt.balance * 0.05;

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="p-4 pt-8">
        <h1 className="text-2xl font-bold text-white mb-1">{t('safes.title')}</h1>
        <p className="text-gray-400 text-sm">Твои токены в безопасности</p>
      </div>

      {/* Total Value Card */}
      <div className="px-4 mb-6">
        <div className="bg-gradient-to-r from-gold-600 to-gold-400 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-navy-900" />
            <span className="text-navy-900 font-medium">{t('safes.total_value')}</span>
          </div>
          <div className="text-3xl font-bold text-navy-900">
            ~{totalValue.toFixed(4)} BNB
          </div>
          <div className="text-navy-800 text-sm mt-1">
            ≈ ${(totalValue * 650).toFixed(2)} USD
          </div>
        </div>
      </div>

      {/* Safes List */}
      <div className="px-4 space-y-4">
        {/* NST Safe */}
        <div className="bg-navy-800 border border-navy-600 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-navy-700 rounded-xl flex items-center justify-center text-2xl">
                {safes.nst.icon}
              </div>
              <div>
                <div className="font-bold text-white">NST Token</div>
                <div className="text-sm text-gray-400">Natural Stone Token</div>
              </div>
            </div>
            <Unlock className="w-5 h-5 text-green-400" />
          </div>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-2xl font-bold text-white">{safes.nst.balance}</div>
              <div className="text-sm text-gray-400">≈ ${(safes.nst.balance * 0.001 * 650).toFixed(2)}</div>
            </div>
            <button className="px-4 py-2 bg-gold-500 text-navy-900 rounded-xl font-medium hover:bg-gold-400 transition-colors">
              Вывести
            </button>
          </div>
        </div>

        {/* CGT Safe */}
        <div className={`bg-navy-800 border rounded-2xl p-4 ${safes.cgt.locked ? 'border-red-500/30' : 'border-navy-600'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-navy-700 rounded-xl flex items-center justify-center text-2xl">
                {safes.cgt.icon}
              </div>
              <div>
                <div className="font-bold text-white">CGT Token</div>
                <div className="text-sm text-gray-400">CardGift Token</div>
              </div>
            </div>
            {safes.cgt.locked ? (
              <Lock className="w-5 h-5 text-red-400" />
            ) : (
              <Unlock className="w-5 h-5 text-green-400" />
            )}
          </div>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-2xl font-bold text-white">{safes.cgt.balance}</div>
              <div className="text-sm text-gray-400">≈ ${(safes.cgt.balance * 0.01 * 650).toFixed(2)}</div>
            </div>
            {safes.cgt.locked ? (
              <div className="px-4 py-2 bg-red-500/20 text-red-400 rounded-xl text-sm">
                🔒 Заблокировано
              </div>
            ) : (
              <button className="px-4 py-2 bg-gold-500 text-navy-900 rounded-xl font-medium hover:bg-gold-400 transition-colors">
                Вывести
              </button>
            )}
          </div>
          {safes.cgt.locked && (
            <div className="mt-3 text-sm text-red-400 bg-red-500/10 rounded-lg p-2">
              Зарегистрируйся чтобы разблокировать
            </div>
          )}
        </div>

        {/* GWT Safe */}
        <div className={`bg-navy-800 border rounded-2xl p-4 ${safes.gwt.locked ? 'border-red-500/30' : 'border-navy-600'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-navy-700 rounded-xl flex items-center justify-center text-2xl">
                {safes.gwt.icon}
              </div>
              <div>
                <div className="font-bold text-white">GWT Token</div>
                <div className="text-sm text-gray-400">GlobalWay Token</div>
              </div>
            </div>
            {safes.gwt.locked ? (
              <Lock className="w-5 h-5 text-red-400" />
            ) : (
              <Unlock className="w-5 h-5 text-green-400" />
            )}
          </div>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-2xl font-bold text-white">{safes.gwt.balance}</div>
              <div className="text-sm text-gray-400">≈ ${(safes.gwt.balance * 0.05 * 650).toFixed(2)}</div>
            </div>
            {safes.gwt.locked ? (
              <div className="px-4 py-2 bg-red-500/20 text-red-400 rounded-xl text-sm">
                🔒 Заблокировано
              </div>
            ) : (
              <button className="px-4 py-2 bg-gold-500 text-navy-900 rounded-xl font-medium hover:bg-gold-400 transition-colors">
                Вывести
              </button>
            )}
          </div>
          {safes.gwt.locked && (
            <div className="mt-3 text-sm text-red-400 bg-red-500/10 rounded-lg p-2">
              Зарегистрируйся чтобы разблокировать
            </div>
          )}
        </div>
      </div>

      {/* Register Button if not registered */}
      {!isRegistered && (
        <div className="px-4 mt-6">
          <button 
            onClick={() => {
              setIsRegistered(true);
              localStorage.setItem('nss_registered', 'true');
            }}
            className="w-full py-4 bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 rounded-2xl font-bold text-lg hover:from-gold-400 hover:to-gold-300 transition-all"
          >
            🔓 Зарегистрироваться БЕСПЛАТНО
          </button>
          <p className="text-center text-gray-500 text-sm mt-2">
            Разблокируй CGT и GWT сейфы
          </p>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
