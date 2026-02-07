'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Save,
  Trash2,
  Edit,
  Check,
  X,
  Calendar,
  Gift,
  Users,
  Zap,
  Star,
  Clock
} from 'lucide-react';

interface Quest {
  id: string;
  title: { en: string; uk: string; ru: string };
  description: { en: string; uk: string; ru: string };
  type: 'daily' | 'social' | 'partner' | 'event';
  condition: {
    type: 'taps' | 'invites' | 'purchase' | 'link' | 'custom';
    value: number | string;
  };
  rewards: {
    nst: number;
    cgt: number;
    gwt: number;
  };
  startDate: string;
  endDate: string;
  maxCompletions: number;
  active: boolean;
}

const QUEST_TYPES = [
  { id: 'daily', label: 'Ежедневное', icon: Clock, color: 'blue' },
  { id: 'social', label: 'Социальное', icon: Users, color: 'purple' },
  { id: 'partner', label: 'Партнёрское', icon: Gift, color: 'green' },
  { id: 'event', label: 'Событийное', icon: Star, color: 'gold' },
];

const CONDITION_TYPES = [
  { id: 'taps', label: 'Сделать N тапов' },
  { id: 'invites', label: 'Пригласить N друзей' },
  { id: 'purchase', label: 'Купить уровень N' },
  { id: 'link', label: 'Перейти по ссылке' },
  { id: 'custom', label: 'Кастомное (ручная проверка)' },
];

const DEMO_QUESTS: Quest[] = [
  {
    id: '1',
    title: { en: 'First 100 taps', uk: 'Перші 100 тапів', ru: 'Первые 100 тапов' },
    description: { en: 'Make your first 100 taps', uk: 'Зроби перші 100 тапів', ru: 'Сделай первые 100 тапов' },
    type: 'daily',
    condition: { type: 'taps', value: 100 },
    rewards: { nst: 10, cgt: 0, gwt: 0 },
    startDate: '2024-01-01',
    endDate: '2025-12-31',
    maxCompletions: 1,
    active: true,
  },
  {
    id: '2',
    title: { en: 'Invite a friend', uk: 'Запроси друга', ru: 'Пригласи друга' },
    description: { en: 'Invite 1 friend to the game', uk: 'Запроси 1 друга в гру', ru: 'Пригласи 1 друга в игру' },
    type: 'partner',
    condition: { type: 'invites', value: 1 },
    rewards: { nst: 50, cgt: 5, gwt: 5 },
    startDate: '2024-01-01',
    endDate: '2025-12-31',
    maxCompletions: 0,
    active: true,
  },
  {
    id: '3',
    title: { en: 'New Year Bonus', uk: 'Новорічний бонус', ru: 'Новогодний бонус' },
    description: { en: 'Special New Year reward', uk: 'Спеціальна новорічна нагорода', ru: 'Специальная новогодняя награда' },
    type: 'event',
    condition: { type: 'custom', value: 'newyear2024' },
    rewards: { nst: 100, cgt: 10, gwt: 10 },
    startDate: '2024-12-25',
    endDate: '2025-01-05',
    maxCompletions: 1,
    active: false,
  },
];

export default function AdminQuests() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const saved = localStorage.getItem('nss_admin_quests');
    if (saved) {
      setQuests(JSON.parse(saved));
    } else {
      setQuests(DEMO_QUESTS);
    }
  }, []);

  const saveQuests = (newQuests: Quest[]) => {
    setQuests(newQuests);
    localStorage.setItem('nss_admin_quests', JSON.stringify(newQuests));
  };

  const deleteQuest = (id: string) => {
    if (confirm('Удалить задание?')) {
      saveQuests(quests.filter(q => q.id !== id));
    }
  };

  const toggleActive = (id: string) => {
    saveQuests(quests.map(q => 
      q.id === id ? { ...q, active: !q.active } : q
    ));
  };

  const openEditor = (quest?: Quest) => {
    setEditingQuest(quest || {
      id: Date.now().toString(),
      title: { en: '', uk: '', ru: '' },
      description: { en: '', uk: '', ru: '' },
      type: 'daily',
      condition: { type: 'taps', value: 100 },
      rewards: { nst: 10, cgt: 0, gwt: 0 },
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
      maxCompletions: 1,
      active: true,
    });
    setShowEditor(true);
  };

  const saveQuest = (quest: Quest) => {
    const exists = quests.find(q => q.id === quest.id);
    if (exists) {
      saveQuests(quests.map(q => q.id === quest.id ? quest : q));
    } else {
      saveQuests([...quests, quest]);
    }
    setShowEditor(false);
    setEditingQuest(null);
  };

  const filteredQuests = filter === 'all' 
    ? quests 
    : quests.filter(q => q.type === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Управление заданиями</h1>
        <button
          onClick={() => openEditor()}
          className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-navy-900 rounded-xl font-bold hover:bg-gold-400 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Создать задание
        </button>
      </div>

      {/* Фильтры */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl transition-colors ${
            filter === 'all' 
              ? 'bg-gold-500 text-navy-900' 
              : 'bg-navy-700 text-gray-400 hover:text-white'
          }`}
        >
          Все ({quests.length})
        </button>
        {QUEST_TYPES.map(type => {
          const count = quests.filter(q => q.type === type.id).length;
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              onClick={() => setFilter(type.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                filter === type.id 
                  ? 'bg-gold-500 text-navy-900' 
                  : 'bg-navy-700 text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {type.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Список заданий */}
      <div className="space-y-3">
        {filteredQuests.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Нет заданий. Создайте первое!
          </div>
        ) : (
          filteredQuests.map(quest => {
            const typeInfo = QUEST_TYPES.find(t => t.id === quest.type);
            const Icon = typeInfo?.icon || Star;
            
            return (
              <div
                key={quest.id}
                className={`bg-navy-800 border rounded-xl p-4 ${
                  quest.active ? 'border-navy-600' : 'border-red-500/30 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-${typeInfo?.color || 'gray'}-500/20`}>
                      <Icon className={`w-6 h-6 text-${typeInfo?.color || 'gray'}-400`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white">{quest.title.ru}</h3>
                        {!quest.active && (
                          <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded">Выкл</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mt-1">{quest.description.ru}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
                        <span className="text-gray-500">
                          {CONDITION_TYPES.find(c => c.id === quest.condition.type)?.label}: {quest.condition.value}
                        </span>
                        <span className="text-gray-500">•</span>
                        <span className="text-cyan-400">+{quest.rewards.nst} NST</span>
                        {quest.rewards.cgt > 0 && <span className="text-pink-400">+{quest.rewards.cgt} CGT</span>}
                        {quest.rewards.gwt > 0 && <span className="text-purple-400">+{quest.rewards.gwt} GWT</span>}
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-500">{quest.startDate} — {quest.endDate}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleActive(quest.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        quest.active 
                          ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                          : 'bg-navy-700 text-gray-500 hover:text-white'
                      }`}
                    >
                      {quest.active ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => openEditor(quest)}
                      className="p-2 bg-navy-700 text-gray-400 rounded-lg hover:text-white transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteQuest(quest.id)}
                      className="p-2 bg-navy-700 text-gray-400 rounded-lg hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Модалка редактирования */}
      {showEditor && editingQuest && (
        <QuestEditor
          quest={editingQuest}
          onSave={saveQuest}
          onClose={() => {
            setShowEditor(false);
            setEditingQuest(null);
          }}
        />
      )}
    </div>
  );
}

function QuestEditor({
  quest,
  onSave,
  onClose,
}: {
  quest: Quest;
  onSave: (quest: Quest) => void;
  onClose: () => void;
}) {
  const [data, setData] = useState(quest);

  const update = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setData(prev => ({
        ...prev,
        [parent]: { ...(prev as any)[parent], [child]: value }
      }));
    } else {
      setData(prev => ({ ...prev, [field]: value }));
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-navy-800 rounded-2xl p-6 max-w-2xl w-full border border-navy-600 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-white mb-6">
          {quest.id ? 'Редактировать задание' : 'Создать задание'}
        </h2>

        <div className="space-y-4">
          {/* Тип */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Тип задания</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {QUEST_TYPES.map(type => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => update('type', type.id)}
                    className={`flex items-center gap-2 p-3 rounded-xl border transition-colors ${
                      data.type === type.id 
                        ? 'border-gold-500 bg-gold-500/20 text-gold-400' 
                        : 'border-navy-600 text-gray-400 hover:border-navy-500'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Название */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Название</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                value={data.title.en}
                onChange={(e) => update('title.en', e.target.value)}
                placeholder="English"
                className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white"
              />
              <input
                type="text"
                value={data.title.uk}
                onChange={(e) => update('title.uk', e.target.value)}
                placeholder="Українська"
                className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white"
              />
              <input
                type="text"
                value={data.title.ru}
                onChange={(e) => update('title.ru', e.target.value)}
                placeholder="Русский"
                className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white"
              />
            </div>
          </div>

          {/* Описание */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Описание</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <textarea
                value={data.description.en}
                onChange={(e) => update('description.en', e.target.value)}
                placeholder="English"
                rows={2}
                className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white resize-none"
              />
              <textarea
                value={data.description.uk}
                onChange={(e) => update('description.uk', e.target.value)}
                placeholder="Українська"
                rows={2}
                className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white resize-none"
              />
              <textarea
                value={data.description.ru}
                onChange={(e) => update('description.ru', e.target.value)}
                placeholder="Русский"
                rows={2}
                className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white resize-none"
              />
            </div>
          </div>

          {/* Условие */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Условие</label>
              <select
                value={data.condition.type}
                onChange={(e) => update('condition.type', e.target.value)}
                className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white"
              >
                {CONDITION_TYPES.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Значение</label>
              <input
                type={data.condition.type === 'link' || data.condition.type === 'custom' ? 'text' : 'number'}
                value={data.condition.value}
                onChange={(e) => update('condition.value', 
                  data.condition.type === 'link' || data.condition.type === 'custom' 
                    ? e.target.value 
                    : parseInt(e.target.value) || 0
                )}
                placeholder={data.condition.type === 'link' ? 'https://...' : 'Количество'}
                className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white"
              />
            </div>
          </div>

          {/* Награды */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Награда</label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <span className="text-xs text-cyan-400">NST</span>
                <input
                  type="number"
                  value={data.rewards.nst}
                  onChange={(e) => update('rewards.nst', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white mt-1"
                />
              </div>
              <div>
                <span className="text-xs text-pink-400">CGT</span>
                <input
                  type="number"
                  value={data.rewards.cgt}
                  onChange={(e) => update('rewards.cgt', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white mt-1"
                />
              </div>
              <div>
                <span className="text-xs text-purple-400">GWT</span>
                <input
                  type="number"
                  value={data.rewards.gwt}
                  onChange={(e) => update('rewards.gwt', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white mt-1"
                />
              </div>
            </div>
          </div>

          {/* Даты */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Дата начала</label>
              <input
                type="date"
                value={data.startDate}
                onChange={(e) => update('startDate', e.target.value)}
                className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Дата окончания</label>
              <input
                type="date"
                value={data.endDate}
                onChange={(e) => update('endDate', e.target.value)}
                className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white"
              />
            </div>
          </div>

          {/* Лимит */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Лимит выполнений (0 = бесконечно)
            </label>
            <input
              type="number"
              value={data.maxCompletions}
              onChange={(e) => update('maxCompletions', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white"
            />
          </div>

          {/* Активно */}
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={data.active}
                onChange={(e) => update('active', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-navy-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-500"></div>
            </label>
            <span className="text-gray-400">Задание активно</span>
          </div>
        </div>

        {/* Кнопки */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-navy-700 text-gray-400 rounded-xl hover:text-white transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={() => onSave(data)}
            className="flex-1 py-3 bg-gold-500 text-navy-900 rounded-xl font-bold hover:bg-gold-400 transition-colors"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}
