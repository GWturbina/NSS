'use client';

import { useState, useEffect } from 'react';
import {
  ArrowLeftRight,
  Settings,
  AlertTriangle,
  Check,
  X,
  Eye,
  Clock,
  TrendingUp
} from 'lucide-react';

interface Order {
  id: string;
  type: 'buy' | 'sell';
  token: 'nst' | 'cgt' | 'gwt';
  amount: number;
  price: number;
  total: number;
  seller: string;
  buyer?: string;
  status: 'open' | 'completed' | 'cancelled' | 'dispute';
  createdAt: string;
}

const DEMO_ORDERS: Order[] = [
  { id: '1', type: 'sell', token: 'nst', amount: 1000, price: 0.00001, total: 0.01, seller: '0x1234...5678', status: 'open', createdAt: '2024-01-15 14:32' },
  { id: '2', type: 'sell', token: 'cgt', amount: 50, price: 0.001, total: 0.05, seller: '0xabcd...efgh', buyer: '0x9999...1111', status: 'completed', createdAt: '2024-01-15 12:15' },
  { id: '3', type: 'sell', token: 'gwt', amount: 10, price: 0.01, total: 0.1, seller: '0x5555...6666', buyer: '0x7777...8888', status: 'dispute', createdAt: '2024-01-15 10:45' },
];

export default function AdminExchange() {
  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState<Order[]>(DEMO_ORDERS);
  const [filter, setFilter] = useState<string>('all');
  const [settings, setSettings] = useState({
    enabled: true,
    commission: 1,
    minOrder: 0.001,
    maxOrder: 10,
    nstRate: 0.00001,
    cgtRate: 0.001,
    gwtRate: 0.01,
  });

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('nss_admin_exchange_settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const saveSettings = () => {
    localStorage.setItem('nss_admin_exchange_settings', JSON.stringify(settings));
    alert('Настройки сохранены!');
  };

  const resolveDispute = (orderId: string, action: 'refund' | 'complete') => {
    if (confirm(`${action === 'refund' ? 'Вернуть средства продавцу' : 'Завершить сделку в пользу покупателя'}?`)) {
      setOrders(prev => prev.map(o => 
        o.id === orderId 
          ? { ...o, status: action === 'refund' ? 'cancelled' : 'completed' } 
          : o
      ));
    }
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter);

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">P2P Биржа</h1>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-navy-800 border border-navy-600 rounded-xl p-4">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <ArrowLeftRight className="w-4 h-4" />
            <span className="text-sm">Всего ордеров</span>
          </div>
          <div className="text-2xl font-bold text-white">{orders.length}</div>
        </div>
        <div className="bg-navy-800 border border-navy-600 rounded-xl p-4">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Открытых</span>
          </div>
          <div className="text-2xl font-bold text-gold-400">
            {orders.filter(o => o.status === 'open').length}
          </div>
        </div>
        <div className="bg-navy-800 border border-navy-600 rounded-xl p-4">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Check className="w-4 h-4" />
            <span className="text-sm">Завершённых</span>
          </div>
          <div className="text-2xl font-bold text-green-400">
            {orders.filter(o => o.status === 'completed').length}
          </div>
        </div>
        <div className="bg-navy-800 border border-navy-600 rounded-xl p-4">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm">Споров</span>
          </div>
          <div className="text-2xl font-bold text-red-400">
            {orders.filter(o => o.status === 'dispute').length}
          </div>
        </div>
      </div>

      {/* Настройки */}
      <div className="bg-navy-800 border border-navy-600 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Настройки P2P
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Вкл/Выкл */}
          <div className="p-4 bg-navy-700 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">P2P биржа</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enabled}
                  onChange={(e) => setSettings(s => ({ ...s, enabled: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-navy-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>
            <div className={`text-sm mt-1 ${settings.enabled ? 'text-green-400' : 'text-red-400'}`}>
              {settings.enabled ? 'Включена' : 'Выключена'}
            </div>
          </div>

          {/* Комиссия */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Комиссия (%)</label>
            <input
              type="number"
              step="0.1"
              value={settings.commission}
              onChange={(e) => setSettings(s => ({ ...s, commission: parseFloat(e.target.value) || 0 }))}
              className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white"
            />
          </div>

          {/* Мин. ордер */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Мин. ордер (BNB)</label>
            <input
              type="number"
              step="0.001"
              value={settings.minOrder}
              onChange={(e) => setSettings(s => ({ ...s, minOrder: parseFloat(e.target.value) || 0 }))}
              className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white"
            />
          </div>

          {/* Макс. ордер */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Макс. ордер (BNB)</label>
            <input
              type="number"
              step="0.1"
              value={settings.maxOrder}
              onChange={(e) => setSettings(s => ({ ...s, maxOrder: parseFloat(e.target.value) || 0 }))}
              className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white"
            />
          </div>
        </div>

        {/* Рекомендуемые курсы */}
        <h4 className="text-white font-medium mb-3">Рекомендуемые курсы (BNB за 1 токен)</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">💎 NST/BNB</label>
            <input
              type="number"
              step="0.000001"
              value={settings.nstRate}
              onChange={(e) => setSettings(s => ({ ...s, nstRate: parseFloat(e.target.value) || 0 }))}
              className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">🎁 CGT/BNB</label>
            <input
              type="number"
              step="0.0001"
              value={settings.cgtRate}
              onChange={(e) => setSettings(s => ({ ...s, cgtRate: parseFloat(e.target.value) || 0 }))}
              className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">🌐 GWT/BNB</label>
            <input
              type="number"
              step="0.001"
              value={settings.gwtRate}
              onChange={(e) => setSettings(s => ({ ...s, gwtRate: parseFloat(e.target.value) || 0 }))}
              className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white"
            />
          </div>
        </div>

        <button
          onClick={saveSettings}
          className="px-6 py-2 bg-gold-500 text-navy-900 rounded-xl font-bold hover:bg-gold-400 transition-colors"
        >
          Сохранить настройки
        </button>
      </div>

      {/* Фильтры */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'all', label: 'Все' },
          { id: 'open', label: 'Открытые' },
          { id: 'completed', label: 'Завершённые' },
          { id: 'cancelled', label: 'Отменённые' },
          { id: 'dispute', label: '⚠️ Споры' },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-xl transition-colors ${
              filter === f.id 
                ? 'bg-gold-500 text-navy-900' 
                : 'bg-navy-700 text-gray-400 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Список ордеров */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Нет ордеров</div>
        ) : (
          filteredOrders.map(order => (
            <div
              key={order.id}
              className={`bg-navy-800 border rounded-xl p-4 ${
                order.status === 'dispute' ? 'border-red-500/50' : 'border-navy-600'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${
                    order.token === 'nst' ? 'bg-cyan-500/20' :
                    order.token === 'cgt' ? 'bg-pink-500/20' : 'bg-purple-500/20'
                  }`}>
                    <span className="text-2xl">
                      {order.token === 'nst' ? '💎' : order.token === 'cgt' ? '🎁' : '🌐'}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        order.type === 'sell' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                      }`}>
                        {order.type === 'sell' ? 'Продажа' : 'Покупка'}
                      </span>
                      <span className="font-bold text-white">
                        {order.amount.toLocaleString()} {order.token.toUpperCase()}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        order.status === 'open' ? 'bg-gold-500/20 text-gold-400' :
                        order.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        order.status === 'dispute' ? 'bg-red-500/20 text-red-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {order.status === 'open' ? 'Открыт' :
                         order.status === 'completed' ? 'Завершён' :
                         order.status === 'dispute' ? 'Спор' : 'Отменён'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      Цена: {order.price} BNB/{order.token.toUpperCase()} • 
                      Сумма: {order.total} BNB
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Продавец: {order.seller}
                      {order.buyer && ` • Покупатель: ${order.buyer}`}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">{order.createdAt}</div>
                  </div>
                </div>

                {order.status === 'dispute' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => resolveDispute(order.id, 'refund')}
                      className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30"
                    >
                      Вернуть продавцу
                    </button>
                    <button
                      onClick={() => resolveDispute(order.id, 'complete')}
                      className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm hover:bg-green-500/30"
                    >
                      В пользу покупателя
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
