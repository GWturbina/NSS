'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Check, Globe } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  // Placeholder while hydrating to avoid mismatch
  if (!mounted) {
    return (
      <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-navy-700 border border-navy-600">
        <Globe className="w-4 h-4 text-gold-500" />
        <span className="text-lg">🌐</span>
        <ChevronDown className="w-4 h-4" />
      </button>
    );
  }

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem('nss_language', code);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-navy-700 hover:bg-navy-600 text-white border border-navy-600 hover:border-gold-500 transition-all"
      >
        <Globe className="w-4 h-4 text-gold-500" />
        <span className="text-lg">{currentLang.flag}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute right-0 mt-2 w-48 rounded-xl overflow-hidden z-50 bg-navy-800 border border-navy-600 shadow-lg">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
                  ${lang.code === i18n.language
                    ? 'bg-gold-500/20 text-gold-400'
                    : 'text-white hover:bg-navy-700'
                  }
                `}
              >
                <span className="text-xl">{lang.flag}</span>
                <span className="flex-1">{lang.name}</span>
                {lang.code === i18n.language && (
                  <Check className="w-4 h-4 text-gold-500" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
