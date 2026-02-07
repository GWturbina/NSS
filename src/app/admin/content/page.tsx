'use client';

import { useState, useEffect } from 'react';
import {
  FileText,
  Image as ImageIcon,
  Upload,
  Save,
  Trash2,
  Eye,
  Globe
} from 'lucide-react';

export default function AdminContent() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'texts' | 'media' | 'stone'>('texts');
  const [stoneImage, setStoneImage] = useState<string | null>(null);
  const [backgrounds, setBackgrounds] = useState<{[key: string]: string}>({});

  const [texts, setTexts] = useState({
    welcome: {
      en: 'Welcome to NSS!',
      uk: 'Ласкаво просимо до NSS!',
      ru: 'Добро пожаловать в NSS!',
    },
    description: {
      en: 'Mine stones. Build your future.',
      uk: 'Добувай камені. Будуй майбутнє.',
      ru: 'Добывай камни. Строй будущее.',
    },
    about: {
      en: 'NSS is a tap-to-earn game integrated with GlobalWay ecosystem.',
      uk: 'NSS — це гра tap-to-earn, інтегрована з екосистемою GlobalWay.',
      ru: 'NSS — это игра tap-to-earn, интегрированная в экосистему GlobalWay.',
    },
  });

  useEffect(() => {
    setMounted(true);
    // Load saved content
    const savedStone = localStorage.getItem('nss_admin_stone');
    const savedBg = localStorage.getItem('nss_admin_backgrounds');
    const savedTexts = localStorage.getItem('nss_admin_texts');
    
    if (savedStone) setStoneImage(savedStone);
    if (savedBg) setBackgrounds(JSON.parse(savedBg));
    if (savedTexts) setTexts(JSON.parse(savedTexts));
  }, []);

  const handleImageUpload = (type: 'stone' | string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      if (type === 'stone') {
        setStoneImage(url);
        localStorage.setItem('nss_admin_stone', url);
      } else {
        setBackgrounds(prev => {
          const updated = { ...prev, [type]: url };
          localStorage.setItem('nss_admin_backgrounds', JSON.stringify(updated));
          return updated;
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const saveTexts = () => {
    localStorage.setItem('nss_admin_texts', JSON.stringify(texts));
    alert('Тексты сохранены!');
  };

  const updateText = (key: string, lang: string, value: string) => {
    setTexts(prev => ({
      ...prev,
      [key]: { ...prev[key as keyof typeof prev], [lang]: value }
    }));
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Управление контентом</h1>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { id: 'texts', label: 'Тексты', icon: FileText },
          { id: 'media', label: 'Фоны', icon: ImageIcon },
          { id: 'stone', label: 'Камень', icon: Globe },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                activeTab === tab.id
                  ? 'bg-gold-500 text-navy-900'
                  : 'bg-navy-700 text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Texts Tab */}
      {activeTab === 'texts' && (
        <div className="space-y-6">
          {Object.entries(texts).map(([key, values]) => (
            <div key={key} className="bg-navy-800 border border-navy-600 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 capitalize">{key}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">🇬🇧 English</label>
                  <textarea
                    value={values.en}
                    onChange={(e) => updateText(key, 'en', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">🇺🇦 Українська</label>
                  <textarea
                    value={values.uk}
                    onChange={(e) => updateText(key, 'uk', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">🇷🇺 Русский</label>
                  <textarea
                    value={values.ru}
                    onChange={(e) => updateText(key, 'ru', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white resize-none"
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={saveTexts}
            className="flex items-center gap-2 px-6 py-3 bg-gold-500 text-navy-900 rounded-xl font-bold hover:bg-gold-400 transition-colors"
          >
            <Save className="w-4 h-4" />
            Сохранить тексты
          </button>
        </div>
      )}

      {/* Media Tab */}
      {activeTab === 'media' && (
        <div className="space-y-4">
          {[
            { id: 'main', label: 'Главная страница' },
            { id: 'safes', label: 'Страница сейфов' },
            { id: 'shop', label: 'Магазин' },
            { id: 'team', label: 'Команда' },
            { id: 'expedition', label: 'Экспедиция' },
          ].map(page => (
            <div key={page.id} className="bg-navy-800 border border-navy-600 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-24 h-16 bg-navy-700 rounded-lg overflow-hidden flex items-center justify-center">
                    {backgrounds[page.id] ? (
                      <img src={backgrounds[page.id]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-white">{page.label}</div>
                    <div className="text-sm text-gray-500">
                      {backgrounds[page.id] ? 'Загружен' : 'Не загружен'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 px-4 py-2 bg-navy-700 text-gray-400 rounded-lg cursor-pointer hover:text-white">
                    <Upload className="w-4 h-4" />
                    Загрузить
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleImageUpload(page.id, e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                  {backgrounds[page.id] && (
                    <button
                      onClick={() => {
                        setBackgrounds(prev => {
                          const updated = { ...prev };
                          delete updated[page.id];
                          localStorage.setItem('nss_admin_backgrounds', JSON.stringify(updated));
                          return updated;
                        });
                      }}
                      className="p-2 bg-navy-700 text-red-400 rounded-lg hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stone Tab */}
      {activeTab === 'stone' && (
        <div className="bg-navy-800 border border-navy-600 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Камень для тапания</h3>
          
          <div className="flex flex-col items-center gap-6">
            {/* Preview */}
            <div className="relative">
              <div className="w-56 h-56 rounded-full bg-gradient-to-br from-gold-400 via-gold-500 to-orange-500 shadow-2xl shadow-gold-500/30 flex items-center justify-center overflow-hidden">
                {stoneImage ? (
                  <img src={stoneImage} alt="Stone" className="w-32 h-32 object-contain" />
                ) : (
                  <span className="text-6xl">💎</span>
                )}
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-navy-700 rounded-full text-xs text-gray-400">
                Предпросмотр
              </div>
            </div>

            {/* Upload */}
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 px-6 py-3 bg-gold-500 text-navy-900 rounded-xl font-bold cursor-pointer hover:bg-gold-400 transition-colors">
                <Upload className="w-5 h-5" />
                Загрузить картинку камня
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleImageUpload('stone', e.target.files[0]);
                    }
                  }}
                />
              </label>
              {stoneImage && (
                <button
                  onClick={() => {
                    setStoneImage(null);
                    localStorage.removeItem('nss_admin_stone');
                  }}
                  className="px-4 py-3 bg-navy-700 text-red-400 rounded-xl hover:bg-red-500/20"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>

            <p className="text-gray-500 text-sm text-center max-w-md">
              Рекомендуемый размер: 256×256 пикселей. Поддерживаемые форматы: PNG, SVG, WEBP.
              Прозрачный фон будет отображаться поверх градиента.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
