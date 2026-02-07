'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Layers,
  ListTodo,
  Coins,
  Settings,
  Users,
  ArrowLeftRight,
  Wallet,
  FileText,
  Shield,
  Menu,
  X,
  LogOut
} from 'lucide-react';

// Адрес владельца контракта (менять на реальный после деплоя)
const OWNER_ADDRESS = '0xYourOwnerAddressHere';

const menuItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Дашборд' },
  { href: '/admin/levels', icon: Layers, label: 'Уровни' },
  { href: '/admin/quests', icon: ListTodo, label: 'Задания' },
  { href: '/admin/tokens', icon: Coins, label: 'Токены' },
  { href: '/admin/users', icon: Users, label: 'Пользователи' },
  { href: '/admin/exchange', icon: ArrowLeftRight, label: 'P2P Биржа' },
  { href: '/admin/finance', icon: Wallet, label: 'Финансы' },
  { href: '/admin/content', icon: FileText, label: 'Контент' },
  { href: '/admin/settings', icon: Settings, label: 'Настройки' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setIsLoading(true);
    
    // Проверяем подключён ли кошелёк
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({ 
          method: 'eth_accounts' 
        });
        
        if (accounts.length > 0) {
          const address = accounts[0].toLowerCase();
          setWalletAddress(address);
          
          // Проверяем является ли владельцем
          // В реальном приложении — проверка через контракт
          // Сейчас для демо — разрешаем всем
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error('Auth error:', error);
      }
    }
    
    setIsLoading(false);
  };

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        
        if (accounts.length > 0) {
          const address = accounts[0].toLowerCase();
          setWalletAddress(address);
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error('Connect error:', error);
      }
    } else {
      alert('Установите MetaMask или SafePal');
    }
  };

  const disconnect = () => {
    setWalletAddress(null);
    setIsAuthorized(false);
    router.push('/');
  };

  if (!mounted) return null;

  // Страница авторизации
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center p-4">
        <div className="bg-navy-800 border border-navy-600 rounded-2xl p-8 max-w-md w-full text-center">
          <Shield className="w-16 h-16 text-gold-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Админ-панель NSS</h1>
          <p className="text-gray-400 mb-6">
            Подключите кошелёк владельца контракта для доступа
          </p>
          
          {isLoading ? (
            <div className="text-gold-500">Проверка...</div>
          ) : (
            <button
              onClick={connectWallet}
              className="w-full py-3 bg-gold-500 text-navy-900 rounded-xl font-bold hover:bg-gold-400 transition-colors"
            >
              Подключить кошелёк
            </button>
          )}
          
          <Link href="/" className="block mt-4 text-gray-500 hover:text-white">
            ← Вернуться в игру
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-900 flex">
      {/* Сайдбар (десктоп) */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-navy-800 border-r border-navy-700">
        {/* Лого */}
        <div className="p-4 border-b border-navy-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold-500 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-navy-900" />
            </div>
            <div>
              <div className="font-bold text-white">NSS Admin</div>
              <div className="text-xs text-gray-500">Панель управления</div>
            </div>
          </div>
        </div>

        {/* Меню */}
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-colors
                  ${isActive 
                    ? 'bg-gold-500/20 text-gold-400' 
                    : 'text-gray-400 hover:bg-navy-700 hover:text-white'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Футер сайдбара */}
        <div className="p-4 border-t border-navy-700">
          <div className="text-xs text-gray-500 mb-2">Подключён:</div>
          <div className="font-mono text-sm text-white truncate mb-3">
            {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
          </div>
          <button
            onClick={disconnect}
            className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm"
          >
            <LogOut className="w-4 h-4" />
            Выйти
          </button>
        </div>
      </aside>

      {/* Мобильный сайдбар */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-navy-800 border-r border-navy-700">
            <div className="p-4 border-b border-navy-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-gold-500" />
                <span className="font-bold text-white">NSS Admin</span>
              </div>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <nav className="p-4 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl transition-colors
                      ${isActive 
                        ? 'bg-gold-500/20 text-gold-400' 
                        : 'text-gray-400 hover:bg-navy-700 hover:text-white'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Основной контент */}
      <div className="flex-1 flex flex-col">
        {/* Хедер */}
        <header className="bg-navy-800 border-b border-navy-700 px-4 py-3 flex items-center justify-between lg:justify-end">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-gray-400 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-white"
          >
            ← К игре
          </Link>
        </header>

        {/* Контент страницы */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
