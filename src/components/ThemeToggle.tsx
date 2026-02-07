'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="p-2 rounded-xl bg-navy-700 border border-navy-600">
        <div className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-xl bg-navy-700 hover:bg-navy-600 border border-navy-600 hover:border-gold-500 transition-all"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-gold-400" />
      ) : (
        <Moon className="w-5 h-5 text-navy-400" />
      )}
    </button>
  );
}
