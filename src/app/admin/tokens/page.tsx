'use client';

import { useState, useEffect } from 'react';
import {
  Coins,
  Flame,
  TrendingUp,
  Send,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';

export default function AdminTokens() {
  const [mounted, setMounted] = useState(false);
  const [mintAmount, setMintAmount] = useState('');
  const [mintAddress, setMintAddress] = useState('');
  const [burnAmount, setBurnAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState<'nst' | 'cgt'>('nst');

  // Демо данные (в реальном приложении — из контракта)
  const tokenStats = {
    nst: {
      name: 'NST Token',
      symbol: 'NST',
      totalSupply: 10_000_000_000,
      minted: 845_672,
      burned: 125_430,
      inCirculation: 720_242,
      halvingStage: 1,
      nextHalving: 500_000_000,
    },
    cgt: {
      name: 'CGT Token',
      symbol: 'CGT',
      totalSupply: 1_000_000_000,
      minted: 125_430,
      burned: 12_543,
      inCirculation: 112_887,
    },
    gwt: {
      name: 'GWT Token',
      symbol: 'GWT',
      address: '0x47DB57C849Fce197c812713253042533E9DE88db',
      note: 'Управляется через GlobalWay',
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMint = () => {
    if (!mintAmount || !mintAddress) {
      alert('Заполните все поля');
      return;
    }
    // В реальном приложении — вызов контракта
    alert(`Mint ${mintAmount} ${selectedToken.toUpperCase()} на адрес ${mintAddress}\n\nЭто демо. В реальном приложении будет транзакция.`);
    setMintAmount('');
    setMintAddress('');
  };

  const handleBurn = () => {
    if (!burnAmount) {
      alert('Введите количество');
      return;
    }
    if (confirm(`Сжечь ${burnAmount} ${selectedToken.toUpperCase()}?`)) {
      alert(`Burn ${burnAmount} ${selectedToken.toUpperCase()}\n\nЭто демо. В реальном приложении будет транзакция.`);
      setBurnAmount('');
    }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Управление токенами</h1>

      {/* Выбор токена */}
      <div className="flex gap-3">
        <button
          onClick={() => setSelectedToken('nst')}
          className={`flex-1 p-4 rounded-xl border transition-colors ${
            selectedToken === 'nst'
              ? 'border-gold-500 bg-gold-500/20'
              : 'border-navy-600 bg-navy-800 hover:border-navy-500'
          }`}
        >
          <div className="text-3xl mb-2">💎</div>
          <div className="font-bold text-white">NST Token</div>
          <div className="text-sm text-gray-400">Игровой токен</div>
        </button>
        <button
          onClick={() => setSelectedToken('cgt')}
          className={`flex-1 p-4 rounded-xl border transition-colors ${
            selectedToken === 'cgt'
              ? 'border-gold-500 bg-gold-500/20'
              : 'border-navy-600 bg-navy-800 hover:border-navy-500'
          }`}
        >
          <div className="text-3xl mb-2">🎁</div>
          <div className="font-bold text-white">CGT Token</div>
          <div className="text-sm text-gray-400">Клубный токен</div>
        </button>
        <div className="flex-1 p-4 rounded-xl border border-navy-600 bg-navy-800 opacity-60">
          <div className="text-3xl mb-2">🌐</div>
          <div className="font-bold text-white">GWT Token</div>
          <div className="text-sm text-gray-400">GlobalWay (только просмотр)</div>
        </div>
      </div>

      {/* Статистика выбранного токена */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-navy-800 border border-navy-600 rounded-xl p-4">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Coins className="w-4 h-4" />
            <span className="text-sm">Общая эмиссия</span>
          </div>
          <div className="text-xl font-bold text-white">
            {selectedToken === 'nst' 
              ? tokenStats.nst.totalSupply.toLocaleString() 
              : tokenStats.cgt.totalSupply.toLocaleString()
            }
          </div>
        </div>
        <div className="bg-navy-800 border border-navy-600 rounded-xl p-4">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Эмитировано</span>
          </div>
          <div className="text-xl font-bold text-green-400">
            {selectedToken === 'nst' 
              ? tokenStats.nst.minted.toLocaleString() 
              : tokenStats.cgt.minted.toLocaleString()
            }
          </div>
        </div>
        <div className="bg-navy-800 border border-navy-600 rounded-xl p-4">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Flame className="w-4 h-4" />
            <span className="text-sm">Сожжено</span>
          </div>
          <div className="text-xl font-bold text-red-400">
            {selectedToken === 'nst' 
              ? tokenStats.nst.burned.toLocaleString() 
              : tokenStats.cgt.burned.toLocaleString()
            }
          </div>
        </div>
        <div className="bg-navy-800 border border-navy-600 rounded-xl p-4">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm">В обращении</span>
          </div>
          <div className="text-xl font-bold text-white">
            {selectedToken === 'nst' 
              ? tokenStats.nst.inCirculation.toLocaleString() 
              : tokenStats.cgt.inCirculation.toLocaleString()
            }
          </div>
        </div>
      </div>

      {/* Halving для NST */}
      {selectedToken === 'nst' && (
        <div className="bg-navy-800 border border-navy-600 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">📉 Halving (уполовинивание)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-400 mb-1">Текущий этап</div>
              <div className="text-2xl font-bold text-gold-400">{tokenStats.nst.halvingStage}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">До следующего halving</div>
              <div className="text-2xl font-bold text-white">
                {(tokenStats.nst.nextHalving - tokenStats.nst.minted).toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Прогресс</div>
              <div className="h-4 bg-navy-700 rounded-full overflow-hidden mt-2">
                <div 
                  className="h-full bg-gold-500 rounded-full"
                  style={{ width: `${(tokenStats.nst.minted / tokenStats.nst.nextHalving) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Операции */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mint */}
        <div className="bg-navy-800 border border-navy-600 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Coins className="w-5 h-5 text-green-400" />
            Mint (эмиссия)
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Количество</label>
              <input
                type="number"
                value={mintAmount}
                onChange={(e) => setMintAmount(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Адрес получателя</label>
              <input
                type="text"
                value={mintAddress}
                onChange={(e) => setMintAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white font-mono"
              />
            </div>
            <button
              onClick={handleMint}
              className="w-full py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-400 transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Эмитировать {selectedToken.toUpperCase()}
            </button>
          </div>
        </div>

        {/* Burn */}
        <div className="bg-navy-800 border border-navy-600 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Flame className="w-5 h-5 text-red-400" />
            Burn (сжигание)
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Количество</label>
              <input
                type="number"
                value={burnAmount}
                onChange={(e) => setBurnAmount(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white"
              />
            </div>
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-400">
                  Сжигание токенов необратимо! Токены будут уничтожены навсегда.
                </div>
              </div>
            </div>
            <button
              onClick={handleBurn}
              className="w-full py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-400 transition-colors flex items-center justify-center gap-2"
            >
              <Flame className="w-4 h-4" />
              Сжечь {selectedToken.toUpperCase()}
            </button>
          </div>
        </div>
      </div>

      {/* GWT Info */}
      <div className="bg-navy-800 border border-navy-600 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">🌐 GWT Token (GlobalWay)</h3>
        <div className="text-gray-400 mb-4">
          GWT токен управляется через основной контракт GlobalWay. Здесь доступен только просмотр.
        </div>
        <div className="font-mono text-sm text-gray-500 break-all">
          Адрес: {tokenStats.gwt.address}
        </div>
      </div>
    </div>
  );
}
