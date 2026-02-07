'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Coins,
  TrendingUp,
  Activity,
  ArrowUp,
  ArrowDown,
  Layers,
  Zap
} from 'lucide-react';

// Демо данные (в реальном приложении — из контракта)
const DEMO_STATS = {
  totalUsers: 1247,
  activeToday: 342,
  totalTaps: 8_456_721,
  totalNST: 845_672.1,
  burnedNST: 125_430.5,
  totalBNB: 12.45,
  todayRegistrations: 23,
  todayPurchases: 8,
};

const DEMO_LEVEL_STATS = [
  { level: 0, count: 1247, name: 'Регистрация' },
  { level: 1, count: 423, name: 'Лопата' },
  { level: 2, count: 234, name: 'Сито' },
  { level: 3, count: 156, name: 'Тачка' },
  { level: 4, count: 89, name: 'Авто-Шахта' },
  { level: 5, count: 45, name: 'Огранка' },
  { level: 6, count: 23, name: 'Ювелирка' },
  { level: 7, count: 12, name: 'Участок' },
  { level: 8, count: 6, name: 'Стройка' },
  { level: 9, count: 3, name: 'Территория' },
  { level: 10, count: 1, name: 'Посёлок' },
  { level: 11, count: 0, name: 'Курорт' },
  { level: 12, count: 0, name: 'Империя' },
];

const DEMO_RECENT = [
  { type: 'register', address: '0x1234...5678', time: '5 мин назад' },
  { type: 'purchase', address: '0xabcd...efgh', level: 3, time: '12 мин назад' },
  { type: 'register', address: '0x9876...5432', time: '18 мин назад' },
  { type: 'purchase', address: '0xfedc...ba98', level: 1, time: '25 мин назад' },
  { type: 'register', address: '0x5555...6666', time: '32 мин назад' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(DEMO_STATS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // В реальном приложении — загрузка данных из контракта
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Дашборд</h1>

      {/* Основные метрики */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Всего пользователей"
          value={stats.totalUsers.toLocaleString()}
          change={`+${stats.todayRegistrations} сегодня`}
          positive
        />
        <StatCard
          icon={Activity}
          label="Активных сегодня"
          value={stats.activeToday.toLocaleString()}
          change={`${((stats.activeToday / stats.totalUsers) * 100).toFixed(1)}%`}
          positive
        />
        <StatCard
          icon={Zap}
          label="Всего тапов"
          value={stats.totalTaps.toLocaleString()}
          change="+12.5% за неделю"
          positive
        />
        <StatCard
          icon={Coins}
          label="Эмитировано NST"
          value={stats.totalNST.toLocaleString()}
          change={`🔥 ${stats.burnedNST.toLocaleString()} сожжено`}
          neutral
        />
      </div>

      {/* Финансы */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-navy-800 border border-navy-600 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">💰 Финансы</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Баланс контракта</span>
              <span className="text-2xl font-bold text-gold-400">{stats.totalBNB} BNB</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">~USD</span>
              <span className="text-xl text-white">${(stats.totalBNB * 650).toLocaleString()}</span>
            </div>
            <div className="border-t border-navy-600 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Покупок сегодня</span>
                <span className="text-green-400">+{stats.todayPurchases}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-navy-800 border border-navy-600 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">📊 Распределение по уровням</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {DEMO_LEVEL_STATS.map((level) => (
              <div key={level.level} className="flex items-center gap-3">
                <div className="w-8 text-gray-500 text-sm">{level.level}</div>
                <div className="flex-1">
                  <div className="h-4 bg-navy-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gold-500 rounded-full"
                      style={{ width: `${(level.count / DEMO_LEVEL_STATS[0].count) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="w-16 text-right text-white text-sm">{level.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Последние события */}
      <div className="bg-navy-800 border border-navy-600 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">🔔 Последние события</h3>
        <div className="space-y-3">
          {DEMO_RECENT.map((event, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 bg-navy-700 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${event.type === 'register' ? 'bg-green-500' : 'bg-gold-500'}`} />
                <span className="font-mono text-white">{event.address}</span>
                <span className="text-gray-400">
                  {event.type === 'register' ? 'зарегистрировался' : `купил уровень ${event.level}`}
                </span>
              </div>
              <span className="text-gray-500 text-sm">{event.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  change,
  positive,
  neutral
}: {
  icon: any;
  label: string;
  value: string;
  change: string;
  positive?: boolean;
  neutral?: boolean;
}) {
  return (
    <div className="bg-navy-800 border border-navy-600 rounded-xl p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-navy-700 rounded-lg">
          <Icon className="w-5 h-5 text-gold-500" />
        </div>
        <span className="text-gray-400 text-sm">{label}</span>
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className={`text-sm ${neutral ? 'text-gray-400' : positive ? 'text-green-400' : 'text-red-400'}`}>
        {!neutral && (positive ? <ArrowUp className="w-3 h-3 inline" /> : <ArrowDown className="w-3 h-3 inline" />)}
        {' '}{change}
      </div>
    </div>
  );
}
