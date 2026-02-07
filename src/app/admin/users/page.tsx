'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Eye,
  Ban,
  Gift,
  ChevronDown,
  ChevronUp,
  Copy,
  Check
} from 'lucide-react';

interface User {
  address: string;
  level: number;
  nstBalance: number;
  cgtBalance: number;
  gwtBalance: number;
  totalTaps: number;
  referrals: number;
  earned: number;
  registeredAt: string;
  lastActive: string;
  blocked: boolean;
}

const DEMO_USERS: User[] = [
  { address: '0x1234567890abcdef1234567890abcdef12345678', level: 5, nstBalance: 12500, cgtBalance: 45, gwtBalance: 23, totalTaps: 45000, referrals: 12, earned: 0.45, registeredAt: '2024-01-01', lastActive: '2024-01-15 14:32', blocked: false },
  { address: '0xabcdef1234567890abcdef1234567890abcdef12', level: 3, nstBalance: 5600, cgtBalance: 20, gwtBalance: 10, totalTaps: 18000, referrals: 5, earned: 0.12, registeredAt: '2024-01-05', lastActive: '2024-01-15 12:15', blocked: false },
  { address: '0x9876543210fedcba9876543210fedcba98765432', level: 8, nstBalance: 89000, cgtBalance: 350, gwtBonus: 180, gwtBalance: 180, totalTaps: 156000, referrals: 45, earned: 2.34, registeredAt: '2023-12-15', lastActive: '2024-01-15 16:45', blocked: false },
  { address: '0xfedcba9876543210fedcba9876543210fedcba98', level: 1, nstBalance: 250, cgtBalance: 5, gwtBalance: 5, totalTaps: 1200, referrals: 0, earned: 0, registeredAt: '2024-01-14', lastActive: '2024-01-14 18:00', blocked: true },
];

export default function AdminUsers() {
  const [mounted, setMounted] = useState(false);
  const [users, setUsers] = useState<User[]>(DEMO_USERS);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [giftData, setGiftData] = useState({ nst: 0, cgt: 0, gwt: 0 });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredUsers = users.filter(u => 
    u.address.toLowerCase().includes(search.toLowerCase())
  );

  const toggleBlock = (address: string) => {
    setUsers(prev => prev.map(u => 
      u.address === address ? { ...u, blocked: !u.blocked } : u
    ));
  };

  const sendGift = () => {
    if (!selectedUser) return;
    alert(`Начислено пользователю ${selectedUser.address}:\n${giftData.nst} NST\n${giftData.cgt} CGT\n${giftData.gwt} GWT\n\nЭто демо. В реальном приложении будет транзакция.`);
    setShowGiftModal(false);
    setGiftData({ nst: 0, cgt: 0, gwt: 0 });
  };

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Пользователи</h1>
        <div className="text-gray-400">
          Всего: {users.length} • Активных: {users.filter(u => !u.blocked).length}
        </div>
      </div>

      {/* Поиск */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по адресу кошелька..."
          className="w-full pl-12 pr-4 py-3 bg-navy-800 border border-navy-600 rounded-xl text-white placeholder-gray-500"
        />
      </div>

      {/* Таблица пользователей */}
      <div className="bg-navy-800 border border-navy-600 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-navy-600">
                <th className="text-left p-4 text-gray-400 font-medium">Адрес</th>
                <th className="text-center p-4 text-gray-400 font-medium">Уровень</th>
                <th className="text-right p-4 text-gray-400 font-medium">NST</th>
                <th className="text-right p-4 text-gray-400 font-medium">Рефералы</th>
                <th className="text-right p-4 text-gray-400 font-medium">Заработано</th>
                <th className="text-center p-4 text-gray-400 font-medium">Статус</th>
                <th className="text-center p-4 text-gray-400 font-medium">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr 
                  key={user.address}
                  className={`border-b border-navy-700 hover:bg-navy-700/50 ${user.blocked ? 'opacity-50' : ''}`}
                >
                  <td className="p-4">
                    <button
                      onClick={() => copyAddress(user.address)}
                      className="font-mono text-white hover:text-gold-400 flex items-center gap-2"
                    >
                      {user.address.slice(0, 6)}...{user.address.slice(-4)}
                      <Copy className="w-3 h-3 text-gray-500" />
                    </button>
                    <div className="text-xs text-gray-500 mt-1">
                      {user.lastActive}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className="px-3 py-1 bg-gold-500/20 text-gold-400 rounded-lg font-bold">
                      {user.level}
                    </span>
                  </td>
                  <td className="p-4 text-right text-white">
                    {user.nstBalance.toLocaleString()}
                  </td>
                  <td className="p-4 text-right text-cyan-400">
                    {user.referrals}
                  </td>
                  <td className="p-4 text-right text-green-400">
                    {user.earned} BNB
                  </td>
                  <td className="p-4 text-center">
                    {user.blocked ? (
                      <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">Заблокирован</span>
                    ) : (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">Активен</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="p-2 bg-navy-700 text-gray-400 rounded-lg hover:text-white"
                        title="Подробнее"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowGiftModal(true);
                        }}
                        className="p-2 bg-navy-700 text-gray-400 rounded-lg hover:text-gold-400"
                        title="Начислить токены"
                      >
                        <Gift className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleBlock(user.address)}
                        className={`p-2 rounded-lg ${
                          user.blocked 
                            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                            : 'bg-navy-700 text-gray-400 hover:text-red-400'
                        }`}
                        title={user.blocked ? 'Разблокировать' : 'Заблокировать'}
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Модалка деталей пользователя */}
      {selectedUser && !showGiftModal && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedUser(null)}
        >
          <div 
            className="bg-navy-800 rounded-2xl p-6 max-w-lg w-full border border-navy-600"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-white mb-4">Профиль пользователя</h2>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-400">Адрес</div>
                <div className="font-mono text-white break-all">{selectedUser.address}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-navy-700 rounded-xl">
                  <div className="text-sm text-gray-400">Уровень</div>
                  <div className="text-2xl font-bold text-gold-400">{selectedUser.level}</div>
                </div>
                <div className="p-3 bg-navy-700 rounded-xl">
                  <div className="text-sm text-gray-400">Рефералов</div>
                  <div className="text-2xl font-bold text-cyan-400">{selectedUser.referrals}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-navy-700 rounded-xl text-center">
                  <div className="text-lg font-bold text-white">{selectedUser.nstBalance.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">NST</div>
                </div>
                <div className="p-3 bg-navy-700 rounded-xl text-center">
                  <div className="text-lg font-bold text-pink-400">{selectedUser.cgtBalance}</div>
                  <div className="text-xs text-gray-500">CGT</div>
                </div>
                <div className="p-3 bg-navy-700 rounded-xl text-center">
                  <div className="text-lg font-bold text-purple-400">{selectedUser.gwtBalance}</div>
                  <div className="text-xs text-gray-500">GWT</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Всего тапов:</span>
                  <span className="text-white ml-2">{selectedUser.totalTaps.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-500">Заработано:</span>
                  <span className="text-green-400 ml-2">{selectedUser.earned} BNB</span>
                </div>
                <div>
                  <span className="text-gray-500">Регистрация:</span>
                  <span className="text-white ml-2">{selectedUser.registeredAt}</span>
                </div>
                <div>
                  <span className="text-gray-500">Активность:</span>
                  <span className="text-white ml-2">{selectedUser.lastActive}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setSelectedUser(null)}
                className="flex-1 py-3 bg-navy-700 text-gray-400 rounded-xl hover:text-white transition-colors"
              >
                Закрыть
              </button>
              <button
                onClick={() => setShowGiftModal(true)}
                className="flex-1 py-3 bg-gold-500 text-navy-900 rounded-xl font-bold hover:bg-gold-400 transition-colors"
              >
                Начислить токены
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модалка начисления */}
      {showGiftModal && selectedUser && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowGiftModal(false);
            setGiftData({ nst: 0, cgt: 0, gwt: 0 });
          }}
        >
          <div 
            className="bg-navy-800 rounded-2xl p-6 max-w-md w-full border border-navy-600"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-white mb-4">Начислить токены</h2>
            <div className="text-sm text-gray-400 mb-4">
              Получатель: <span className="font-mono text-white">{selectedUser.address.slice(0, 10)}...</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">💎 NST</label>
                <input
                  type="number"
                  value={giftData.nst}
                  onChange={(e) => setGiftData(d => ({ ...d, nst: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">🎁 CGT</label>
                <input
                  type="number"
                  value={giftData.cgt}
                  onChange={(e) => setGiftData(d => ({ ...d, cgt: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">🌐 GWT</label>
                <input
                  type="number"
                  value={giftData.gwt}
                  onChange={(e) => setGiftData(d => ({ ...d, gwt: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowGiftModal(false);
                  setGiftData({ nst: 0, cgt: 0, gwt: 0 });
                }}
                className="flex-1 py-3 bg-navy-700 text-gray-400 rounded-xl hover:text-white transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={sendGift}
                className="flex-1 py-3 bg-gold-500 text-navy-900 rounded-xl font-bold hover:bg-gold-400 transition-colors"
              >
                Начислить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
