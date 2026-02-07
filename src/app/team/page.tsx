'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, UserPlus, Copy, Check, TrendingUp, Award, Share2, Send } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { useTelegramSafe } from '@/components/TelegramProvider';

export default function TeamPage() {
  const { t } = useTranslation();
  const telegram = useTelegramSafe();
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'partners' | 'structure'>('partners');

  // Демо данные (будут из контракта)
  // Используем Telegram ID для генерации реф.ссылки, если доступен
  const telegramId = telegram?.telegramId;
  const referralCode = telegramId ? `TG${telegramId}` : 'NSS-ABC123';
  const referralLink = telegramId 
    ? `https://t.me/NSS_Game_Bot?start=${referralCode}`
    : `https://nss.globalway.app/?ref=${referralCode}`;
  
  const stats = {
    totalPartners: 12,
    activePartners: 8,
    totalEarnings: 0.156,
    level1: 2,
    level2: 4,
    level3: 6,
  };

  const partners = [
    { address: '0x1234...5678', level: 1, earnings: 0.003, active: true, date: '2024-01-15' },
    { address: '0xabcd...efgh', level: 1, earnings: 0.006, active: true, date: '2024-01-14' },
    { address: '0x9876...5432', level: 2, earnings: 0.002, active: false, date: '2024-01-13' },
    { address: '0xfedc...ba98', level: 2, earnings: 0.004, active: true, date: '2024-01-12' },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    if (telegram?.hapticFeedback) {
      telegram.hapticFeedback('success');
    }
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLink = () => {
    const text = '💎 Присоединяйся к NSS — добывай камни и зарабатывай!\n\n⛏️ Tap-to-earn игра с реальным доходом\n💰 До 60% от покупок твоей команды';
    
    if (telegram?.shareLink) {
      telegram.shareLink(referralLink, text);
    } else if (navigator.share) {
      navigator.share({ url: referralLink, text });
    } else {
      copyLink();
    }
  };

  if (!mounted) {
    return <div className="min-h-screen bg-navy-900" />;
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="p-4 pt-8">
        <h1 className="text-2xl font-bold text-white mb-1">{t('team.title')}</h1>
        <p className="text-gray-400 text-sm">Твоя партнёрская сеть</p>
      </div>

      {/* Stats Cards */}
      <div className="px-4 grid grid-cols-2 gap-3 mb-6">
        <div className="bg-navy-800 border border-navy-600 rounded-xl p-4">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Users className="w-4 h-4" />
            <span className="text-sm">Партнёров</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.totalPartners}</div>
          <div className="text-xs text-green-400">+{stats.activePartners} активных</div>
        </div>
        <div className="bg-navy-800 border border-navy-600 rounded-xl p-4">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Заработано</span>
          </div>
          <div className="text-2xl font-bold text-gold-400">{stats.totalEarnings} BNB</div>
          <div className="text-xs text-gray-500">≈ ${(stats.totalEarnings * 650).toFixed(0)}</div>
        </div>
      </div>

      {/* Referral Link */}
      <div className="px-4 mb-6">
        <div className="bg-gradient-to-r from-gold-500/20 to-gold-600/10 border border-gold-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <UserPlus className="w-5 h-5 text-gold-400" />
            <span className="font-bold text-white">Пригласи друга</span>
          </div>
          <div className="flex gap-2 mb-3">
            <div className="flex-1 bg-navy-800 rounded-lg px-3 py-2 text-sm text-gray-300 truncate">
              {referralLink}
            </div>
            <button
              onClick={copyLink}
              className={`px-3 py-2 rounded-lg font-medium transition-all ${
                copied 
                  ? 'bg-green-500 text-white' 
                  : 'bg-navy-700 text-gray-300 hover:bg-navy-600'
              }`}
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
          {/* Share Button */}
          <button
            onClick={shareLink}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:from-blue-400 hover:to-cyan-400 transition-all"
          >
            <Send className="w-5 h-5" />
            Поделиться в Telegram
          </button>
          <p className="text-xs text-gold-400/70 mt-3 text-center">
            💰 Получай 10% от всех покупок приглашённых партнёров
          </p>
        </div>
      </div>

      {/* Income Structure */}
      <div className="px-4 mb-6">
        <h3 className="text-lg font-bold text-white mb-3">Структура дохода</h3>
        <div className="bg-navy-800 border border-navy-600 rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">🤝 Личное приглашение</span>
            <span className="font-bold text-gold-400">10%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">👥 Партнёрские (12 уровней)</span>
            <span className="font-bold text-cyan-400">2% × 12 = 24%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">🎯 Клубные</span>
            <span className="font-bold text-purple-400">48%</span>
          </div>
          <div className="border-t border-navy-600 pt-3 flex justify-between items-center">
            <span className="text-white font-medium">Максимум с партнёра</span>
            <span className="font-bold text-green-400 text-lg">до 60%</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-4">
        <div className="flex bg-navy-800 rounded-xl p-1">
          <button
            onClick={() => setActiveTab('partners')}
            className={`flex-1 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'partners' 
                ? 'bg-gold-500 text-navy-900' 
                : 'text-gray-400'
            }`}
          >
            Партнёры
          </button>
          <button
            onClick={() => setActiveTab('structure')}
            className={`flex-1 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'structure' 
                ? 'bg-gold-500 text-navy-900' 
                : 'text-gray-400'
            }`}
          >
            Структура
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4">
        {activeTab === 'partners' ? (
          <div className="space-y-3">
            {partners.length > 0 ? (
              partners.map((partner, i) => (
                <div key={i} className="bg-navy-800 border border-navy-600 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-mono text-white">{partner.address}</div>
                      <div className="text-xs text-gray-500">{partner.date}</div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs ${
                      partner.active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {partner.active ? 'Активен' : 'Неактивен'}
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Линия {partner.level}</span>
                    <span className="text-gold-400">+{partner.earnings} BNB</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">Пока нет партнёров</p>
                <p className="text-sm text-gray-500">Поделись ссылкой и начни зарабатывать</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(level => (
              <div key={level} className="bg-navy-800 border border-navy-600 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-navy-700 rounded-lg flex items-center justify-center text-gold-400 font-bold">
                      {level}
                    </div>
                    <div>
                      <div className="text-white font-medium">Линия {level}</div>
                      <div className="text-xs text-gray-500">2% от покупок</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">{stats[`level${level}` as keyof typeof stats] || 0}</div>
                    <div className="text-xs text-gray-500">партнёров</div>
                  </div>
                </div>
              </div>
            ))}
            <p className="text-center text-gray-500 text-sm py-2">
              ... и ещё 7 уровней глубины
            </p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
