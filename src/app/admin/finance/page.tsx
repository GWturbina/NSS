'use client';

import { useState, useEffect } from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Calendar,
  DollarSign
} from 'lucide-react';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  from?: string;
  to?: string;
  date: string;
  description: string;
}

const DEMO_TRANSACTIONS: Transaction[] = [
  { id: '1', type: 'income', category: 'Покупка уровня', amount: 0.096, from: '0x1234...5678', date: '2024-01-15 14:32', description: 'Уровень 7' },
  { id: '2', type: 'expense', category: 'Партнёрские', amount: 0.0096, to: '0xabcd...efgh', date: '2024-01-15 14:32', description: '10% от 0x1234...5678' },
  { id: '3', type: 'income', category: 'Покупка уровня', amount: 0.012, from: '0x9876...5432', date: '2024-01-15 12:15', description: 'Уровень 4' },
  { id: '4', type: 'expense', category: 'Клубные', amount: 0.00576, to: '0x5555...6666', date: '2024-01-15 12:15', description: '48% матрица' },
  { id: '5', type: 'income', category: 'Покупка уровня', amount: 0.0015, from: '0xfedc...ba98', date: '2024-01-14 18:00', description: 'Уровень 1' },
];

export default function AdminFinance() {
  const [mounted, setMounted] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>(DEMO_TRANSACTIONS);
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'all'>('week');

  // Демо данные
  const stats = {
    contractBalance: 12.45,
    totalIncome: 8.76,
    totalExpenses: 4.21,
    profit: 4.55,
    todayIncome: 0.234,
    todayExpenses: 0.112,
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleWithdraw = () => {
    const amount = prompt('Сколько BNB вывести?');
    if (amount) {
      alert(`Вывод ${amount} BNB\n\nЭто демо. В реальном приложении будет транзакция на кошелёк owner.`);
    }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Финансы</h1>
        <button
          onClick={handleWithdraw}
          className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-navy-900 rounded-xl font-bold hover:bg-gold-400 transition-colors"
        >
          <Download className="w-4 h-4" />
          Вывести BNB
        </button>
      </div>

      {/* Основные показатели */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-gold-500/20 to-gold-600/10 border border-gold-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 text-gold-400 mb-2">
            <Wallet className="w-5 h-5" />
            <span className="text-sm">Баланс контракта</span>
          </div>
          <div className="text-3xl font-bold text-white">{stats.contractBalance} BNB</div>
          <div className="text-sm text-gray-400">~${(stats.contractBalance * 650).toLocaleString()}</div>
        </div>

        <div className="bg-navy-800 border border-navy-600 rounded-xl p-4">
          <div className="flex items-center gap-2 text-green-400 mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm">Всего доходов</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.totalIncome} BNB</div>
          <div className="text-sm text-green-400 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            +{stats.todayIncome} сегодня
          </div>
        </div>

        <div className="bg-navy-800 border border-navy-600 rounded-xl p-4">
          <div className="flex items-center gap-2 text-red-400 mb-2">
            <TrendingDown className="w-5 h-5" />
            <span className="text-sm">Всего расходов</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.totalExpenses} BNB</div>
          <div className="text-sm text-red-400 flex items-center gap-1">
            <ArrowDownRight className="w-3 h-3" />
            -{stats.todayExpenses} сегодня
          </div>
        </div>

        <div className="bg-navy-800 border border-navy-600 rounded-xl p-4">
          <div className="flex items-center gap-2 text-cyan-400 mb-2">
            <DollarSign className="w-5 h-5" />
            <span className="text-sm">Чистая прибыль</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.profit} BNB</div>
          <div className="text-sm text-gray-400">~${(stats.profit * 650).toLocaleString()}</div>
        </div>
      </div>

      {/* Диаграмма распределения */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-navy-800 border border-navy-600 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">📊 Распределение доходов</h3>
          <div className="space-y-3">
            {[
              { label: 'Покупки уровней', percent: 82, color: 'bg-gold-500' },
              { label: 'P2P комиссии', percent: 12, color: 'bg-cyan-500' },
              { label: 'Прочее', percent: 6, color: 'bg-purple-500' },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">{item.label}</span>
                  <span className="text-white">{item.percent}%</span>
                </div>
                <div className="h-2 bg-navy-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${item.color} rounded-full`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-navy-800 border border-navy-600 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">💸 Распределение расходов</h3>
          <div className="space-y-3">
            {[
              { label: 'Партнёрские (10%)', percent: 21, color: 'bg-green-500' },
              { label: 'Структурные (2%×12)', percent: 31, color: 'bg-blue-500' },
              { label: 'Клубные (48%)', percent: 48, color: 'bg-pink-500' },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">{item.label}</span>
                  <span className="text-white">{item.percent}%</span>
                </div>
                <div className="h-2 bg-navy-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${item.color} rounded-full`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* История транзакций */}
      <div className="bg-navy-800 border border-navy-600 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">📜 История транзакций</h3>
          <div className="flex gap-2">
            {(['day', 'week', 'month', 'all'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  period === p
                    ? 'bg-gold-500 text-navy-900'
                    : 'bg-navy-700 text-gray-400 hover:text-white'
                }`}
              >
                {p === 'day' ? 'День' : p === 'week' ? 'Неделя' : p === 'month' ? 'Месяц' : 'Всё'}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {transactions.map(tx => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-3 bg-navy-700 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  tx.type === 'income' ? 'bg-green-500/20' : 'bg-red-500/20'
                }`}>
                  {tx.type === 'income' ? (
                    <ArrowDownRight className="w-4 h-4 text-green-400" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4 text-red-400" />
                  )}
                </div>
                <div>
                  <div className="text-white font-medium">{tx.category}</div>
                  <div className="text-xs text-gray-500">
                    {tx.description} • {tx.from || tx.to}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-bold ${
                  tx.type === 'income' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {tx.type === 'income' ? '+' : '-'}{tx.amount} BNB
                </div>
                <div className="text-xs text-gray-500">{tx.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
