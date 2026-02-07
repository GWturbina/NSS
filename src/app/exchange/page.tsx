'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeftRight,
  ArrowDown,
  ExternalLink,
  Users,
  Clock,
  AlertTriangle,
  Plus,
  X
} from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';

const PANCAKESWAP_URL = 'https://pancakeswap.finance/swap';
const USDT_ADDRESS = '0x9e5AAC1Ba1a2e6aEd6b32689DFcF62A509Ca96f3';

interface P2POrder {
  id: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  total: number;
  seller: string;
  createdAt: string;
}

const DEMO_ORDERS: P2POrder[] = [
  { id: '1', type: 'sell', amount: 0.5, price: 650, total: 325, seller: '0x1234...5678', createdAt: '14:32' },
  { id: '2', type: 'sell', amount: 1.0, price: 648, total: 648, seller: '0xabcd...efgh', createdAt: '12:15' },
  { id: '3', type: 'buy', amount: 0.2, price: 652, total: 130.4, seller: '0x9876...5432', createdAt: '11:45' },
];

export default function ExchangePage() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'swap' | 'p2p'>('swap');
  const [isRegistered, setIsRegistered] = useState(false);
  
  // Swap
  const [fromAmount, setFromAmount] = useState('');
  const [fromToken, setFromToken] = useState<'BNB' | 'USDT'>('BNB');
  const bnbPrice = 650;

  // P2P
  const [orders, setOrders] = useState<P2POrder[]>(DEMO_ORDERS);
  const [showCreate, setShowCreate] = useState(false);
  const [viewType, setViewType] = useState<'buy' | 'sell'>('buy');
  const [newOrder, setNewOrder] = useState({ type: 'sell' as 'buy' | 'sell', amount: '', price: '650' });

  useEffect(() => {
    setMounted(true);
    setIsRegistered(localStorage.getItem('nss_registered') === 'true');
  }, []);

  const toAmount = fromAmount 
    ? fromToken === 'BNB' 
      ? (parseFloat(fromAmount) * bnbPrice).toFixed(2)
      : (parseFloat(fromAmount) / bnbPrice).toFixed(6)
    : '';

  const swapTokens = () => {
    setFromToken(f => f === 'BNB' ? 'USDT' : 'BNB');
    setFromAmount(toAmount);
  };

  const openPancakeSwap = () => {
    const input = fromToken === 'BNB' ? 'BNB' : USDT_ADDRESS;
    const output = fromToken === 'BNB' ? USDT_ADDRESS : 'BNB';
    window.open(`${PANCAKESWAP_URL}?inputCurrency=${input}&outputCurrency=${output}&chain=opbnb`, '_blank');
  };

  const createOrder = () => {
    if (!newOrder.amount || !newOrder.price) return;
    const order: P2POrder = {
      id: Date.now().toString(),
      type: newOrder.type,
      amount: parseFloat(newOrder.amount),
      price: parseFloat(newOrder.price),
      total: parseFloat(newOrder.amount) * parseFloat(newOrder.price),
      seller: '0xYour...Addr',
      createdAt: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    };
    setOrders([order, ...orders]);
    setShowCreate(false);
    setNewOrder({ type: 'sell', amount: '', price: '650' });
  };

  if (!mounted) return <div className="min-h-screen bg-navy-900" />;

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="p-4 pt-8">
        <h1 className="text-2xl font-bold text-white mb-1">Обмен</h1>
        <p className="text-gray-400 text-sm">BNB ↔ USDT</p>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-6">
        <div className="flex bg-navy-800 rounded-xl p-1">
          <button
            onClick={() => setActiveTab('swap')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'swap' ? 'bg-gold-500 text-navy-900' : 'text-gray-400'
            }`}
          >
            <ArrowLeftRight className="w-4 h-4" />
            PancakeSwap
          </button>
          <button
            onClick={() => setActiveTab('p2p')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'p2p' ? 'bg-gold-500 text-navy-900' : 'text-gray-400'
            }`}
          >
            <Users className="w-4 h-4" />
            P2P
          </button>
        </div>
      </div>

      {/* === SWAP TAB === */}
      {activeTab === 'swap' && (
        <div className="px-4">
          <div className="bg-navy-800 border border-navy-600 rounded-2xl p-6">
            {/* From */}
            <div className="mb-2">
              <label className="text-sm text-gray-400 mb-2 block">Отдаёте</label>
              <div className="flex gap-3">
                <input
                  type="number"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  placeholder="0.0"
                  className="flex-1 px-4 py-3 bg-navy-700 border border-navy-600 rounded-xl text-white text-xl font-bold focus:border-gold-500 outline-none"
                />
                <div className="px-4 py-3 bg-navy-700 border border-navy-600 rounded-xl text-white font-bold min-w-[100px] text-center">
                  {fromToken}
                </div>
              </div>
            </div>

            {/* Swap button */}
            <div className="flex justify-center my-4">
              <button onClick={swapTokens} className="p-3 bg-navy-700 rounded-xl text-gold-500 hover:bg-navy-600">
                <ArrowDown className="w-5 h-5" />
              </button>
            </div>

            {/* To */}
            <div className="mb-6">
              <label className="text-sm text-gray-400 mb-2 block">Получаете</label>
              <div className="flex gap-3">
                <div className="flex-1 px-4 py-3 bg-navy-700 border border-navy-600 rounded-xl text-white text-xl font-bold">
                  {toAmount || '0.0'}
                </div>
                <div className="px-4 py-3 bg-navy-700 border border-navy-600 rounded-xl text-white font-bold min-w-[100px] text-center">
                  {fromToken === 'BNB' ? 'USDT' : 'BNB'}
                </div>
              </div>
            </div>

            {/* Rate */}
            <div className="p-3 bg-navy-700 rounded-xl mb-6 text-center">
              <span className="text-gray-400">1 BNB ≈ </span>
              <span className="text-white font-bold">${bnbPrice} USDT</span>
            </div>

            {/* Button */}
            <button
              onClick={openPancakeSwap}
              className="w-full py-4 bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              Обменять на PancakeSwap
              <ExternalLink className="w-5 h-5" />
            </button>

            <p className="text-center text-gray-500 text-xs mt-4">
              Откроется официальный сайт PancakeSwap
            </p>
          </div>

          {/* Info */}
          <div className="mt-4 p-4 bg-navy-800 border border-navy-600 rounded-xl">
            <h4 className="font-bold text-white mb-2">💡 Что такое PancakeSwap?</h4>
            <p className="text-gray-400 text-sm">
              Децентрализованная биржа для обмена криптовалют напрямую из кошелька. Безопасно, быстро, без посредников.
            </p>
          </div>
        </div>
      )}

      {/* === P2P TAB === */}
      {activeTab === 'p2p' && (
        <div className="px-4">
          {/* Club only */}
          {!isRegistered && (
            <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-yellow-400">Только для партнёров клуба</div>
                <div className="text-sm text-yellow-400/70">
                  P2P обмен доступен после регистрации
                </div>
              </div>
            </div>
          )}

          {/* Create order */}
          {isRegistered && (
            <button
              onClick={() => setShowCreate(true)}
              className="w-full mb-4 py-3 bg-gold-500 text-navy-900 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Создать ордер
            </button>
          )}

          {/* View type */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setViewType('buy')}
              className={`flex-1 py-2 rounded-xl font-medium border transition-colors ${
                viewType === 'buy'
                  ? 'bg-green-500/20 text-green-400 border-green-500/50'
                  : 'bg-navy-800 text-gray-400 border-navy-600'
              }`}
            >
              Купить BNB
            </button>
            <button
              onClick={() => setViewType('sell')}
              className={`flex-1 py-2 rounded-xl font-medium border transition-colors ${
                viewType === 'sell'
                  ? 'bg-red-500/20 text-red-400 border-red-500/50'
                  : 'bg-navy-800 text-gray-400 border-navy-600'
              }`}
            >
              Продать BNB
            </button>
          </div>

          {/* Orders */}
          <div className="space-y-3">
            {orders
              .filter(o => o.type === (viewType === 'buy' ? 'sell' : 'buy'))
              .map(order => (
                <div key={order.id} className="bg-navy-800 border border-navy-600 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-mono text-white">{order.seller}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />{order.createdAt}
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      order.type === 'sell' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {order.type === 'sell' ? 'Продаёт' : 'Покупает'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                    <div>
                      <div className="text-xs text-gray-500">Кол-во</div>
                      <div className="font-bold text-white">{order.amount} BNB</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Цена</div>
                      <div className="font-bold text-gold-400">${order.price}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Сумма</div>
                      <div className="font-bold text-white">${order.total}</div>
                    </div>
                  </div>

                  <button
                    disabled={!isRegistered}
                    className={`w-full py-2 rounded-xl font-medium ${
                      isRegistered
                        ? viewType === 'buy'
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                        : 'bg-navy-700 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {viewType === 'buy' ? 'Купить' : 'Продать'}
                  </button>
                </div>
              ))}

            {orders.filter(o => o.type === (viewType === 'buy' ? 'sell' : 'buy')).length === 0 && (
              <div className="text-center py-8 text-gray-500">Нет активных ордеров</div>
            )}
          </div>

          {/* How it works */}
          <div className="mt-6 p-4 bg-navy-800 border border-navy-600 rounded-xl">
            <h4 className="font-bold text-white mb-3">🔐 Как работает P2P?</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p>1. Продавец создаёт ордер и блокирует BNB</p>
              <p>2. Покупатель переводит USDT продавцу</p>
              <p>3. Продавец подтверждает получение</p>
              <p>4. BNB автоматически переводится покупателю</p>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center"
          onClick={() => setShowCreate(false)}>
          <div className="bg-navy-800 rounded-t-3xl sm:rounded-2xl p-6 w-full max-w-md border-t border-navy-600 sm:border"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Создать ордер</h3>
              <button onClick={() => setShowCreate(false)}><X className="w-6 h-6 text-gray-400" /></button>
            </div>

            {/* Type */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setNewOrder(o => ({ ...o, type: 'sell' }))}
                className={`flex-1 py-2 rounded-xl font-medium ${
                  newOrder.type === 'sell' ? 'bg-red-500 text-white' : 'bg-navy-700 text-gray-400'
                }`}
              >
                Продать BNB
              </button>
              <button
                onClick={() => setNewOrder(o => ({ ...o, type: 'buy' }))}
                className={`flex-1 py-2 rounded-xl font-medium ${
                  newOrder.type === 'buy' ? 'bg-green-500 text-white' : 'bg-navy-700 text-gray-400'
                }`}
              >
                Купить BNB
              </button>
            </div>

            {/* Amount */}
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-1">Количество BNB</label>
              <input
                type="number"
                value={newOrder.amount}
                onChange={(e) => setNewOrder(o => ({ ...o, amount: e.target.value }))}
                placeholder="0.0"
                className="w-full px-4 py-3 bg-navy-700 border border-navy-600 rounded-xl text-white"
              />
            </div>

            {/* Price */}
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-1">Цена за 1 BNB (USDT)</label>
              <input
                type="number"
                value={newOrder.price}
                onChange={(e) => setNewOrder(o => ({ ...o, price: e.target.value }))}
                className="w-full px-4 py-3 bg-navy-700 border border-navy-600 rounded-xl text-white"
              />
            </div>

            {/* Total */}
            {newOrder.amount && newOrder.price && (
              <div className="p-3 bg-navy-700 rounded-xl mb-4 flex justify-between">
                <span className="text-gray-400">Итого</span>
                <span className="font-bold text-gold-400">
                  ${(parseFloat(newOrder.amount) * parseFloat(newOrder.price)).toFixed(2)} USDT
                </span>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button onClick={() => setShowCreate(false)}
                className="flex-1 py-3 bg-navy-700 text-gray-400 rounded-xl">Отмена</button>
              <button onClick={createOrder}
                className="flex-1 py-3 bg-gold-500 text-navy-900 rounded-xl font-bold">Создать</button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
