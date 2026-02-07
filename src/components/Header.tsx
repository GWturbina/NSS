'use client';

import { useState, useEffect } from 'react';
import { Map, Wallet } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSwitcher } from './LanguageSwitcher';

interface HeaderProps {
  onRoadmapClick?: () => void;
}

export function Header({ onRoadmapClick }: HeaderProps) {
  const [mounted, setMounted] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    // Check if wallet was previously connected
    const saved = localStorage.getItem('nss_wallet');
    if (saved) setWalletAddress(saved);
  }, []);

  const connectWallet = async () => {
    // Здесь будет реальное подключение через ethers.js
    alert('Подключение кошелька будет доступно после деплоя контрактов.\n\nСейчас это демо-версия.');
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (!mounted) {
    return (
      <header className="sticky top-0 z-40 bg-navy-900/95 backdrop-blur-xl border-b border-navy-700">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💎</span>
            <span className="font-bold text-white">NSS</span>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 bg-navy-900/95 backdrop-blur-xl border-b border-navy-700">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">💎</span>
          <span className="font-bold text-white">NSS</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Roadmap */}
          {onRoadmapClick && (
            <button
              onClick={onRoadmapClick}
              className="p-2 rounded-xl bg-navy-700 hover:bg-navy-600 text-gold-400 transition-colors"
            >
              <Map className="w-5 h-5" />
            </button>
          )}

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Wallet */}
          <button
            onClick={connectWallet}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gold-500 text-navy-900 font-medium hover:bg-gold-400 transition-colors"
          >
            <Wallet className="w-4 h-4" />
            {walletAddress ? (
              <span className="text-sm">{formatAddress(walletAddress)}</span>
            ) : (
              <span className="text-sm hidden sm:inline">Войти</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
