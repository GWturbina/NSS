'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Save,
  Upload,
  Image as ImageIcon,
  RefreshCw,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Eye
} from 'lucide-react';

// Дефолтные данные уровней
const DEFAULT_LEVELS = [
  { id: 0, emoji: '🔐', name: { en: 'Registration', uk: 'Реєстрація', ru: 'Регистрация' }, tool: { en: 'Safe', uk: 'Сейф', ru: 'Сейф' }, price: 0, nstPerTap: 0.1, nstBonus: 0, cgtBonus: 10, gwtBonus: 5 },
  { id: 1, emoji: '🪓', name: { en: 'Digger', uk: 'Копач', ru: 'Копатель' }, tool: { en: 'Shovel', uk: 'Лопата', ru: 'Лопата' }, price: 0.0015, nstPerTap: 0.2, nstBonus: 50, cgtBonus: 5, gwtBonus: 5 },
  { id: 2, emoji: '🔍', name: { en: 'Sifter', uk: 'Просіювач', ru: 'Просеиватель' }, tool: { en: 'Sieve', uk: 'Сито', ru: 'Сито' }, price: 0.003, nstPerTap: 0.4, nstBonus: 100, cgtBonus: 5, gwtBonus: 5 },
  { id: 3, emoji: '🛒', name: { en: 'Hauler', uk: 'Возій', ru: 'Возчик' }, tool: { en: 'Wheelbarrow', uk: 'Тачка', ru: 'Тачка' }, price: 0.006, nstPerTap: 0.6, nstBonus: 200, cgtBonus: 10, gwtBonus: 10 },
  { id: 4, emoji: '⚙️', name: { en: 'Operator', uk: 'Оператор', ru: 'Оператор' }, tool: { en: 'Auto-Mine', uk: 'Авто-Шахта', ru: 'Авто-Шахта' }, price: 0.012, nstPerTap: 1.0, nstBonus: 400, cgtBonus: 15, gwtBonus: 15 },
  { id: 5, emoji: '💎', name: { en: 'Cutter', uk: 'Огранник', ru: 'Огранщик' }, tool: { en: 'Gem Cutting', uk: 'Огранка', ru: 'Огранка' }, price: 0.024, nstPerTap: 1.5, nstBonus: 800, cgtBonus: 35, gwtBonus: 35 },
  { id: 6, emoji: '💍', name: { en: 'Jeweler', uk: 'Ювелір', ru: 'Ювелир' }, tool: { en: 'Jewelry', uk: 'Ювелірка', ru: 'Ювелирка' }, price: 0.048, nstPerTap: 2.0, nstBonus: 1500, cgtBonus: 75, gwtBonus: 75 },
  { id: 7, emoji: '🏗️', name: { en: 'Builder', uk: 'Будівельник', ru: 'Строитель' }, tool: { en: 'Land Plot', uk: 'Ділянка', ru: 'Участок' }, price: 0.096, nstPerTap: 3.0, nstBonus: 3000, cgtBonus: 150, gwtBonus: 150 },
  { id: 8, emoji: '🏠', name: { en: 'Developer', uk: 'Забудовник', ru: 'Застройщик' }, tool: { en: 'Construction', uk: 'Будівництво', ru: 'Стройка' }, price: 0.192, nstPerTap: 4.0, nstBonus: 6000, cgtBonus: 300, gwtBonus: 300 },
  { id: 9, emoji: '🌍', name: { en: 'Landowner', uk: 'Землевласник', ru: 'Землевладелец' }, tool: { en: 'Territory', uk: 'Територія', ru: 'Территория' }, price: 0.384, nstPerTap: 6.0, nstBonus: 12000, cgtBonus: 600, gwtBonus: 600 },
  { id: 10, emoji: '🏘️', name: { en: 'Mayor', uk: 'Мер', ru: 'Мэр' }, tool: { en: 'Village', uk: 'Селище', ru: 'Посёлок' }, price: 0.768, nstPerTap: 8.0, nstBonus: 25000, cgtBonus: 1200, gwtBonus: 1200 },
  { id: 11, emoji: '🏨', name: { en: 'Governor', uk: 'Губернатор', ru: 'Губернатор' }, tool: { en: 'Resort', uk: 'Курорт', ru: 'Курорт' }, price: 1.536, nstPerTap: 12.0, nstBonus: 50000, cgtBonus: 2400, gwtBonus: 2400 },
  { id: 12, emoji: '🏰', name: { en: 'Emperor', uk: 'Імператор', ru: 'Император' }, tool: { en: 'Empire', uk: 'Імперія', ru: 'Империя' }, price: 3.072, nstPerTap: 16.0, nstBonus: 100000, cgtBonus: 4500, gwtBonus: 4500 },
];

interface LevelData {
  id: number;
  emoji: string;
  name: { en: string; uk: string; ru: string };
  tool: { en: string; uk: string; ru: string };
  description?: { en: string; uk: string; ru: string };
  price: number;
  nstPerTap: number;
  nstBonus: number;
  cgtBonus: number;
  gwtBonus: number;
  iconUrl?: string;
  backgroundUrl?: string;
  active: boolean;
}

export default function AdminLevels() {
  const [levels, setLevels] = useState<LevelData[]>([]);
  const [expandedLevel, setExpandedLevel] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [previewLevel, setPreviewLevel] = useState<number | null>(null);

  useEffect(() => {
    // Загружаем из localStorage или используем дефолт
    const saved = localStorage.getItem('nss_admin_levels');
    if (saved) {
      setLevels(JSON.parse(saved));
    } else {
      setLevels(DEFAULT_LEVELS.map(l => ({ ...l, active: true })));
    }
  }, []);

  const updateLevel = (id: number, field: string, value: any) => {
    setLevels(prev => prev.map(level => {
      if (level.id !== id) return level;
      
      // Для вложенных полей (name.ru, tool.en и т.д.)
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return {
          ...level,
          [parent]: {
            ...(level as any)[parent],
            [child]: value
          }
        };
      }
      
      return { ...level, [field]: value };
    }));
  };

  const handleImageUpload = (levelId: number, type: 'icon' | 'background', file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      updateLevel(levelId, type === 'icon' ? 'iconUrl' : 'backgroundUrl', url);
    };
    reader.readAsDataURL(file);
  };

  const saveAll = async () => {
    setSaving(true);
    
    // Сохраняем в localStorage (в реальном приложении — в контракт/базу)
    localStorage.setItem('nss_admin_levels', JSON.stringify(levels));
    
    // Имитация задержки
    await new Promise(r => setTimeout(r, 500));
    
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const resetToDefault = () => {
    if (confirm('Сбросить все уровни к настройкам по умолчанию?')) {
      setLevels(DEFAULT_LEVELS.map(l => ({ ...l, active: true })));
      localStorage.removeItem('nss_admin_levels');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Управление уровнями</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={resetToDefault}
            className="flex items-center gap-2 px-4 py-2 bg-navy-700 text-gray-400 rounded-xl hover:text-white transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Сбросить
          </button>
          <button
            onClick={saveAll}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-navy-900 rounded-xl font-bold hover:bg-gold-400 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : saved ? (
              <Check className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saved ? 'Сохранено!' : 'Сохранить всё'}
          </button>
        </div>
      </div>

      {/* Список уровней */}
      <div className="space-y-3">
        {levels.map((level) => (
          <div
            key={level.id}
            className="bg-navy-800 border border-navy-600 rounded-xl overflow-hidden"
          >
            {/* Заголовок уровня */}
            <div
              onClick={() => setExpandedLevel(expandedLevel === level.id ? null : level.id)}
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-navy-700 transition-colors"
            >
              <div className="flex items-center gap-4">
                {/* Иконка */}
                <div className="w-12 h-12 bg-navy-700 rounded-xl flex items-center justify-center text-2xl overflow-hidden">
                  {level.iconUrl ? (
                    <img src={level.iconUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    level.emoji
                  )}
                </div>
                
                {/* Инфо */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">Уровень {level.id}</span>
                    <span className="text-gray-400">— {level.name.ru}</span>
                    {!level.active && (
                      <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded">Выкл</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {level.price > 0 ? `${level.price} BNB` : 'Бесплатно'} • {level.nstPerTap} NST/тап
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewLevel(level.id);
                  }}
                  className="p-2 text-gray-400 hover:text-white"
                >
                  <Eye className="w-5 h-5" />
                </button>
                {expandedLevel === level.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>

            {/* Развёрнутое редактирование */}
            {expandedLevel === level.id && (
              <div className="p-4 border-t border-navy-700 space-y-6">
                {/* Картинки */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Иконка */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Иконка уровня</label>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-navy-700 rounded-xl flex items-center justify-center text-3xl overflow-hidden border-2 border-dashed border-navy-600">
                        {level.iconUrl ? (
                          <img src={level.iconUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          level.emoji
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={level.emoji}
                          onChange={(e) => updateLevel(level.id, 'emoji', e.target.value)}
                          placeholder="Эмодзи"
                          className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white"
                        />
                        <label className="flex items-center gap-2 px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg cursor-pointer hover:border-gold-500">
                          <Upload className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-400">Загрузить картинку</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                handleImageUpload(level.id, 'icon', e.target.files[0]);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Фон */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Фон уровня</label>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-navy-700 rounded-xl flex items-center justify-center overflow-hidden border-2 border-dashed border-navy-600">
                        {level.backgroundUrl ? (
                          <img src={level.backgroundUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-8 h-8 text-gray-600" />
                        )}
                      </div>
                      <label className="flex-1 flex items-center gap-2 px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg cursor-pointer hover:border-gold-500">
                        <Upload className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-400">Загрузить фон</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleImageUpload(level.id, 'background', e.target.files[0]);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Названия */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Название</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <span className="text-xs text-gray-500">🇬🇧 English</span>
                      <input
                        type="text"
                        value={level.name.en}
                        onChange={(e) => updateLevel(level.id, 'name.en', e.target.value)}
                        className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white mt-1"
                      />
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">🇺🇦 Українська</span>
                      <input
                        type="text"
                        value={level.name.uk}
                        onChange={(e) => updateLevel(level.id, 'name.uk', e.target.value)}
                        className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white mt-1"
                      />
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">🇷🇺 Русский</span>
                      <input
                        type="text"
                        value={level.name.ru}
                        onChange={(e) => updateLevel(level.id, 'name.ru', e.target.value)}
                        className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Инструмент */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Инструмент</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={level.tool.en}
                      onChange={(e) => updateLevel(level.id, 'tool.en', e.target.value)}
                      placeholder="English"
                      className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white"
                    />
                    <input
                      type="text"
                      value={level.tool.uk}
                      onChange={(e) => updateLevel(level.id, 'tool.uk', e.target.value)}
                      placeholder="Українська"
                      className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white"
                    />
                    <input
                      type="text"
                      value={level.tool.ru}
                      onChange={(e) => updateLevel(level.id, 'tool.ru', e.target.value)}
                      placeholder="Русский"
                      className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white"
                    />
                  </div>
                </div>

                {/* Цены и бонусы */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Цена (BNB)</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={level.price}
                      onChange={(e) => updateLevel(level.id, 'price', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">NST/тап</label>
                    <input
                      type="number"
                      step="0.1"
                      value={level.nstPerTap}
                      onChange={(e) => updateLevel(level.id, 'nstPerTap', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Бонус NST</label>
                    <input
                      type="number"
                      value={level.nstBonus}
                      onChange={(e) => updateLevel(level.id, 'nstBonus', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Бонус CGT</label>
                    <input
                      type="number"
                      value={level.cgtBonus}
                      onChange={(e) => updateLevel(level.id, 'cgtBonus', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Бонус GWT</label>
                    <input
                      type="number"
                      value={level.gwtBonus}
                      onChange={(e) => updateLevel(level.id, 'gwtBonus', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white"
                    />
                  </div>
                </div>

                {/* Активен */}
                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={level.active}
                      onChange={(e) => updateLevel(level.id, 'active', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-navy-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-500"></div>
                  </label>
                  <span className="text-gray-400">Уровень активен (можно купить)</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Модалка предпросмотра */}
      {previewLevel !== null && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewLevel(null)}
        >
          <div 
            className="bg-navy-800 rounded-2xl p-6 max-w-md w-full border border-navy-600"
            onClick={e => e.stopPropagation()}
          >
            {(() => {
              const level = levels.find(l => l.id === previewLevel);
              if (!level) return null;
              
              return (
                <>
                  <div className="text-center mb-6">
                    <div className="w-24 h-24 bg-navy-700 rounded-2xl mx-auto mb-4 flex items-center justify-center text-5xl overflow-hidden">
                      {level.iconUrl ? (
                        <img src={level.iconUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        level.emoji
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-white">{level.name.ru}</h3>
                    <p className="text-gray-400">{level.tool.ru}</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between p-3 bg-navy-700 rounded-xl">
                      <span className="text-gray-400">Цена</span>
                      <span className="font-bold text-gold-400">
                        {level.price > 0 ? `${level.price} BNB` : 'Бесплатно'}
                      </span>
                    </div>
                    <div className="flex justify-between p-3 bg-navy-700 rounded-xl">
                      <span className="text-gray-400">NST за тап</span>
                      <span className="font-bold text-white">{level.nstPerTap}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-navy-700 rounded-xl">
                      <span className="text-gray-400">Бонус NST</span>
                      <span className="font-bold text-cyan-400">+{level.nstBonus}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-navy-700 rounded-xl">
                      <span className="text-gray-400">Бонус CGT</span>
                      <span className="font-bold text-pink-400">+{level.cgtBonus}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-navy-700 rounded-xl">
                      <span className="text-gray-400">Бонус GWT</span>
                      <span className="font-bold text-purple-400">+{level.gwtBonus}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setPreviewLevel(null)}
                    className="w-full py-3 bg-navy-700 text-gray-400 rounded-xl hover:text-white transition-colors"
                  >
                    Закрыть
                  </button>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
