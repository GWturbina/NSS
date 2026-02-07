'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Stone } from '@/components/Stone';
import { EnergyBar } from '@/components/EnergyBar';
import { RoadmapModal } from '@/components/RoadmapModal';
import { useTelegramSafe } from '@/components/TelegramProvider';

const LEVELS = [
  { id: 0, emoji: '🔐', name: 'Регистрация', nstPerTap: 0.1 },
  { id: 1, emoji: '🪓', name: 'Лопата', nstPerTap: 0.2 },
  { id: 2, emoji: '🔍', name: 'Сито', nstPerTap: 0.4 },
  { id: 3, emoji: '🛒', name: 'Тачка', nstPerTap: 0.6 },
  { id: 4, emoji: '⚙️', name: 'Авто-Шахта', nstPerTap: 1.0 },
  { id: 5, emoji: '💎', name: 'Огранка', nstPerTap: 1.5 },
  { id: 6, emoji: '💍', name: 'Ювелирка', nstPerTap: 2.0 },
  { id: 7, emoji: '🏗️', name: 'Участок', nstPerTap: 3.0 },
  { id: 8, emoji: '🏠', name: 'Стройка', nstPerTap: 4.0 },
  { id: 9, emoji: '🌍', name: 'Территория', nstPerTap: 6.0 },
  { id: 10, emoji: '🏘️', name: 'Посёлок', nstPerTap: 8.0 },
  { id: 11, emoji: '🏨', name: 'Курорт', nstPerTap: 12.0 },
  { id: 12, emoji: '🏰', name: 'Империя', nstPerTap: 16.0 },
];

const MAX_ENERGY = 500;
const ENERGY_REGEN_INTERVAL = 10000; // 10 секунд на 1 энергию

export default function HomePage() {
  const { t } = useTranslation();
  const telegram = useTelegramSafe();
  const [mounted, setMounted] = useState(false);
  
  // Game State
  const [nstBalance, setNstBalance] = useState(0);
  const [pendingNst, setPendingNst] = useState(0);
  const [energy, setEnergy] = useState(MAX_ENERGY);
  const [level, setLevel] = useState(0);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showRoadmap, setShowRoadmap] = useState(false);
  
  // Expiration timer for pending NST (30 minutes)
  const [expirationTime, setExpirationTime] = useState<number | null>(null);

  // Load saved state
  useEffect(() => {
    setMounted(true);
    
    const savedNst = localStorage.getItem('nss_balance');
    const savedEnergy = localStorage.getItem('nss_energy');
    const savedLevel = localStorage.getItem('nss_level');
    const savedRegistered = localStorage.getItem('nss_registered');
    const savedPending = localStorage.getItem('nss_pending');
    const savedExpiration = localStorage.getItem('nss_expiration');
    
    if (savedNst) setNstBalance(parseFloat(savedNst));
    if (savedEnergy) setEnergy(parseInt(savedEnergy));
    if (savedLevel) setLevel(parseInt(savedLevel));
    if (savedRegistered) setIsRegistered(savedRegistered === 'true');
    if (savedPending) setPendingNst(parseFloat(savedPending));
    if (savedExpiration) setExpirationTime(parseInt(savedExpiration));
    
    // Show roadmap on first visit
    if (!localStorage.getItem('nss_visited')) {
      setShowRoadmap(true);
      localStorage.setItem('nss_visited', 'true');
    }
  }, []);

  // Save state on change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('nss_balance', nstBalance.toString());
      localStorage.setItem('nss_energy', energy.toString());
      localStorage.setItem('nss_level', level.toString());
      localStorage.setItem('nss_pending', pendingNst.toString());
      if (expirationTime) {
        localStorage.setItem('nss_expiration', expirationTime.toString());
      }
    }
  }, [nstBalance, energy, level, pendingNst, expirationTime, mounted]);

  // Energy regeneration
  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy(prev => Math.min(prev + 1, MAX_ENERGY));
    }, ENERGY_REGEN_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // Check expiration
  useEffect(() => {
    if (!expirationTime || isRegistered) return;
    
    const interval = setInterval(() => {
      if (Date.now() > expirationTime) {
        // Токены испарились
        setPendingNst(0);
        setExpirationTime(null);
        localStorage.removeItem('nss_pending');
        localStorage.removeItem('nss_expiration');
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [expirationTime, isRegistered]);

  const handleTap = useCallback(() => {
    if (energy <= 0) return;
    
    const nstEarned = LEVELS[level].nstPerTap;
    
    setEnergy(prev => prev - 1);
    
    if (isRegistered) {
      // Зарегистрирован — токены сразу в баланс
      setNstBalance(prev => prev + nstEarned);
    } else {
      // Не зарегистрирован — в pending с таймером
      setPendingNst(prev => prev + nstEarned);
      
      // Устанавливаем/обновляем таймер испарения (30 минут)
      setExpirationTime(Date.now() + 30 * 60 * 1000);
    }

    // Вибрация — через Telegram API или браузер
    if (telegram?.hapticFeedback) {
      telegram.hapticFeedback('light');
    } else if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  }, [energy, level, isRegistered, telegram]);

  const handleRegister = () => {
    setIsRegistered(true);
    localStorage.setItem('nss_registered', 'true');
    
    // Переносим pending в баланс
    if (pendingNst > 0) {
      setNstBalance(prev => prev + pendingNst);
      setPendingNst(0);
      setExpirationTime(null);
      localStorage.removeItem('nss_pending');
      localStorage.removeItem('nss_expiration');
    }

    // Уведомление в Telegram
    if (telegram?.hapticFeedback) {
      telegram.hapticFeedback('success');
    }
  };

  const currentLevel = LEVELS[level];
  const timeUntilExpiration = expirationTime ? Math.max(0, expirationTime - Date.now()) : 0;
  const minutesLeft = Math.floor(timeUntilExpiration / 60000);
  const secondsLeft = Math.floor((timeUntilExpiration % 60000) / 1000);

  // Имя пользователя из Telegram или Guest
  const userName = telegram?.firstName || 'Шахтёр';

  if (!mounted) {
    return <div className="min-h-screen bg-navy-900" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header onRoadmapClick={() => setShowRoadmap(true)} />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-24">
        {/* Welcome message for Telegram users */}
        {telegram?.isInTelegram && telegram?.firstName && (
          <p className="text-gold-400 text-sm mb-2">
            👋 Привет, {telegram.firstName}!
          </p>
        )}

        {/* Balance Display */}
        <div className="text-center mb-6">
          <p className="text-gray-400 text-sm mb-1">{t('game.your_balance')}</p>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600">
            {nstBalance.toFixed(1)} NST
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {currentLevel.nstPerTap} NST {t('game.per_tap')}
          </p>
        </div>

        {/* Pending Warning */}
        {!isRegistered && pendingNst > 0 && (
          <div className="w-full max-w-xs mb-4">
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 text-center">
              <p className="text-red-400 text-sm font-medium">
                ⚠️ {pendingNst.toFixed(1)} NST {t('pending.will_expire')}
              </p>
              <p className="text-red-300 text-xs mt-1">
                {t('pending.time_left')}: {minutesLeft}:{secondsLeft.toString().padStart(2, '0')}
              </p>
            </div>
          </div>
        )}

        {/* Stone */}
        <div className="mb-8">
          <Stone onTap={handleTap} disabled={energy <= 0} />
        </div>

        {/* Energy Bar */}
        <div className="w-full max-w-xs">
          <EnergyBar current={energy} max={MAX_ENERGY} />
        </div>

        {/* Register Button */}
        {!isRegistered && (
          <button
            onClick={handleRegister}
            className="mt-6 px-8 py-3 bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 rounded-xl font-bold hover:from-gold-400 hover:to-gold-300 transition-all shadow-lg shadow-gold-500/25"
          >
            🔓 {t('common.register_free')}
          </button>
        )}

        {/* Current Level */}
        <div className="mt-6 flex items-center gap-2 text-gray-400">
          <span className="text-2xl">{currentLevel.emoji}</span>
          <span>{currentLevel.name}</span>
        </div>
      </main>

      <BottomNav />
      
      {showRoadmap && (
        <RoadmapModal onClose={() => setShowRoadmap(false)} />
      )}
    </div>
  );
}
