'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePathname, useRouter } from 'next/navigation';
import { Hammer, Lock, ShoppingBag, Users, ArrowLeftRight } from 'lucide-react';

const navItems = [
  { key: 'mine', href: '/', icon: Hammer },
  { key: 'safes', href: '/safes', icon: Lock },
  { key: 'shop', href: '/shop', icon: ShoppingBag },
  { key: 'exchange', href: '/exchange', icon: ArrowLeftRight },
  { key: 'team', href: '/team', icon: Users },
];

export function BottomNav() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 bg-navy-900 border-t border-navy-700 z-50">
        <div className="flex items-center justify-around max-w-lg mx-auto py-2 pb-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.key} className="flex flex-col items-center gap-1 py-2 px-4 text-gray-400">
                <Icon className="w-6 h-6" />
                <span className="text-xs">...</span>
              </div>
            );
          })}
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-navy-900/95 backdrop-blur-xl border-t border-navy-700 z-50">
      <div className="flex items-center justify-around max-w-lg mx-auto py-2 pb-6 safe-area-bottom">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <button
              key={item.key}
              onClick={() => router.push(item.href)}
              className={`
                flex flex-col items-center gap-1 py-2 px-4
                transition-colors duration-200
                ${isActive ? 'text-gold-500' : 'text-gray-400 hover:text-gold-400'}
              `}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'scale-110' : ''} transition-transform`} />
              <span className="text-xs font-medium">
                {t(`nav.${item.key}`)}
              </span>
              {isActive && (
                <div className="absolute bottom-1 w-1 h-1 bg-gold-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
