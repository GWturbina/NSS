'use client';

import { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  RefreshCw,
  Shield,
  Zap,
  Clock,
  Percent,
  Link,
  Bell,
  AlertTriangle
} from 'lucide-react';

export default function AdminSettings() {
  const [mounted, setMounted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    // Game settings
    maxEnergy: 500,
    energyRegenSeconds: 10,
    evaporationMinutes: 30,
    baseNstPerTap: 0.1,
    
    // Registration bonuses
    registrationCGT: 10,
    registrationGWT: 5,
    
    // Marketing
    personalPercent: 10,
    linePercent: 2,
    clubPercent: 48,
    totalLines: 12,
    
    // Contracts
    nstContract: '',
    cgtContract: '',
    gameContract: '',
    integrationContract: '',
    
    // GlobalWay
    globalWayContract: '0xc6E769A790cE87f9Dd952Dca6Ac1A9526Bc0FBe7',
    globalWayBridge: '0x75231309172544886f27449446A9A2a43D5Ac801',
    matrixRegistry: '0xC12b57B8B4BcE9134788FBb2290Cf4d496c4eE4a',
    gwtToken: '0x47DB57C849Fce197c812713253042533E9DE88db',
    
    // Network
    rpcUrl: 'https://opbnb-mainnet-rpc.bnbchain.org',
    chainId: 204,
    explorerUrl: 'https://opbnbscan.com',
    
    // Notifications
    telegramBotToken: '',
    telegramChatId: '',
    notifyOnRegistration: true,
    notifyOnPurchase: true,
    notifyOnWithdraw: true,
  });

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('nss_admin_settings');
    if (saved) {
      setSettings(prev => ({ ...prev, ...JSON.parse(saved) }));
    }
  }, []);

  const saveSettings = async () => {
    setSaving(true);
    localStorage.setItem('nss_admin_settings', JSON.stringify(settings));
    await new Promise(r => setTimeout(r, 500));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const update = (field: string, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Настройки</h1>
        <button
          onClick={saveSettings}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-navy-900 rounded-xl font-bold hover:bg-gold-400 transition-colors disabled:opacity-50"
        >
          {saving ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : saved ? (
            <Save className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saved ? 'Сохранено!' : 'Сохранить'}
        </button>
      </div>

      {/* Game Settings */}
      <div className="bg-navy-800 border border-navy-600 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-gold-500" />
          Настройки игры
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Макс. энергия</label>
            <input
              type="number"
              value={settings.maxEnergy}
              onChange={(e) => update('maxEnergy', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Восстановление (сек)</label>
            <input
              type="number"
              value={settings.energyRegenSeconds}
              onChange={(e) => update('energyRegenSeconds', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Испарение (мин)</label>
            <input
              type="number"
              value={settings.evaporationMinutes}
              onChange={(e) => update('evaporationMinutes', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Базовый NST/тап</label>
            <input
              type="number"
              step="0.01"
              value={settings.baseNstPerTap}
              onChange={(e) => update('baseNstPerTap', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white"
            />
          </div>
        </div>
      </div>

      {/* Registration Bonuses */}
      <div className="bg-navy-800 border border-navy-600 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-500" />
          Бонусы за регистрацию
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Бонус CGT</label>
            <input
              type="number"
              value={settings.registrationCGT}
              onChange={(e) => update('registrationCGT', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Бонус GWT</label>
            <input
              type="number"
              value={settings.registrationGWT}
              onChange={(e) => update('registrationGWT', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white"
            />
          </div>
        </div>
      </div>

      {/* Marketing Settings */}
      <div className="bg-navy-800 border border-navy-600 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Percent className="w-5 h-5 text-purple-500" />
          Маркетинг-план
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Личный % (от приглашения)</label>
            <input
              type="number"
              value={settings.personalPercent}
              onChange={(e) => update('personalPercent', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">% за линию</label>
            <input
              type="number"
              value={settings.linePercent}
              onChange={(e) => update('linePercent', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Кол-во линий</label>
            <input
              type="number"
              value={settings.totalLines}
              onChange={(e) => update('totalLines', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Клубный %</label>
            <input
              type="number"
              value={settings.clubPercent}
              onChange={(e) => update('clubPercent', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white"
            />
          </div>
        </div>
        <div className="mt-4 p-3 bg-navy-700 rounded-lg">
          <div className="text-sm text-gray-400">
            Итого с партнёра (макс): 
            <span className="text-gold-400 font-bold ml-2">
              {settings.personalPercent + (settings.linePercent * settings.totalLines) + settings.clubPercent}%
            </span>
            <span className="text-gray-500 ml-2">
              ({settings.personalPercent}% личн. + {settings.linePercent}%×{settings.totalLines} парт. + {settings.clubPercent}% клуб.)
            </span>
          </div>
        </div>
      </div>

      {/* Contract Addresses */}
      <div className="bg-navy-800 border border-navy-600 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Link className="w-5 h-5 text-cyan-500" />
          Адреса контрактов NSS
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">NSTToken</label>
            <input
              type="text"
              value={settings.nstContract}
              onChange={(e) => update('nstContract', e.target.value)}
              placeholder="0x..."
              className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white font-mono text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">CGTToken</label>
            <input
              type="text"
              value={settings.cgtContract}
              onChange={(e) => update('cgtContract', e.target.value)}
              placeholder="0x..."
              className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white font-mono text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">NSSGame</label>
            <input
              type="text"
              value={settings.gameContract}
              onChange={(e) => update('gameContract', e.target.value)}
              placeholder="0x..."
              className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white font-mono text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">NSSIntegration</label>
            <input
              type="text"
              value={settings.integrationContract}
              onChange={(e) => update('integrationContract', e.target.value)}
              placeholder="0x..."
              className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white font-mono text-sm"
            />
          </div>
        </div>
        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
            <div className="text-sm text-yellow-400">
              Заполните адреса после деплоя контрактов на opBNB
            </div>
          </div>
        </div>
      </div>

      {/* GlobalWay Integration */}
      <div className="bg-navy-800 border border-navy-600 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          🌐 Интеграция с GlobalWay
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">GlobalWay Contract</label>
            <input
              type="text"
              value={settings.globalWayContract}
              onChange={(e) => update('globalWayContract', e.target.value)}
              className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white font-mono text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">GlobalWay Bridge</label>
            <input
              type="text"
              value={settings.globalWayBridge}
              onChange={(e) => update('globalWayBridge', e.target.value)}
              className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white font-mono text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Matrix Registry</label>
            <input
              type="text"
              value={settings.matrixRegistry}
              onChange={(e) => update('matrixRegistry', e.target.value)}
              className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white font-mono text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">GWT Token</label>
            <input
              type="text"
              value={settings.gwtToken}
              onChange={(e) => update('gwtToken', e.target.value)}
              className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white font-mono text-sm"
            />
          </div>
        </div>
      </div>

      {/* Network Settings */}
      <div className="bg-navy-800 border border-navy-600 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          ⛓️ Сеть
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">RPC URL</label>
            <input
              type="text"
              value={settings.rpcUrl}
              onChange={(e) => update('rpcUrl', e.target.value)}
              className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Chain ID</label>
            <input
              type="number"
              value={settings.chainId}
              onChange={(e) => update('chainId', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Explorer URL</label>
            <input
              type="text"
              value={settings.explorerUrl}
              onChange={(e) => update('explorerUrl', e.target.value)}
              className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white text-sm"
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-navy-800 border border-navy-600 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-500" />
          Уведомления (Telegram)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Bot Token</label>
            <input
              type="text"
              value={settings.telegramBotToken}
              onChange={(e) => update('telegramBotToken', e.target.value)}
              placeholder="123456:ABC-DEF..."
              className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white font-mono text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Chat ID</label>
            <input
              type="text"
              value={settings.telegramChatId}
              onChange={(e) => update('telegramChatId', e.target.value)}
              placeholder="-100..."
              className="w-full px-3 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white font-mono text-sm"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          {[
            { key: 'notifyOnRegistration', label: 'Регистрации' },
            { key: 'notifyOnPurchase', label: 'Покупки' },
            { key: 'notifyOnWithdraw', label: 'Выводы' },
          ].map(item => (
            <label key={item.key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings[item.key as keyof typeof settings] as boolean}
                onChange={(e) => update(item.key, e.target.checked)}
                className="w-4 h-4 rounded border-navy-600 bg-navy-700 text-gold-500 focus:ring-gold-500"
              />
              <span className="text-gray-400">{item.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
