import { useState } from 'react';
import Icon from '@/components/ui/icon';

const SECTIONS = [
  { id: 'general', label: 'Основные', icon: 'Settings' },
  { id: 'display', label: 'Экран', icon: 'Monitor' },
  { id: 'sound', label: 'Звук', icon: 'Volume2' },
  { id: 'network', label: 'Сеть', icon: 'Wifi' },
  { id: 'security', label: 'Безопасность', icon: 'Shield' },
  { id: 'about', label: 'О системе', icon: 'Info' },
];

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="w-10 h-5 rounded-full relative transition-all duration-200 flex-shrink-0"
      style={{ background: value ? 'var(--os-accent)' : 'rgba(255,255,255,0.12)' }}
    >
      <span
        className="absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200"
        style={{ background: '#fff', left: value ? '22px' : '2px' }}
      />
    </button>
  );
}

function Row({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div>
        <div className="text-sm" style={{ color: 'var(--os-text)' }}>{label}</div>
        {desc && <div className="text-xs mt-0.5" style={{ color: 'var(--os-text-dim)' }}>{desc}</div>}
      </div>
      {children}
    </div>
  );
}

function Slider({ value, onChange, min = 0, max = 100 }: { value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="range" min={min} max={max} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-28 accent-blue-500"
      />
      <span className="text-xs w-8 text-right" style={{ color: 'var(--os-text-dim)' }}>{value}%</span>
    </div>
  );
}

export default function Settings() {
  const [section, setSection] = useState('general');
  const [settings, setSettings] = useState({
    notifications: true,
    autoUpdate: true,
    darkMode: true,
    animations: true,
    brightness: 80,
    volume: 65,
    bluetooth: false,
    wifi: true,
    firewall: true,
    language: 'Русский',
    timezone: 'Москва (UTC+3)',
  });

  const set = (key: keyof typeof settings, value: boolean | number | string) =>
    setSettings(prev => ({ ...prev, [key]: value }));

  const renderContent = () => {
    switch (section) {
      case 'general': return (
        <div>
          <div className="text-sm font-medium mb-4" style={{ color: 'var(--os-text-dim)' }}>ОСНОВНЫЕ</div>
          <Row label="Уведомления" desc="Показывать системные уведомления">
            <Toggle value={settings.notifications as boolean} onChange={v => set('notifications', v)} />
          </Row>
          <Row label="Автообновление" desc="Устанавливать обновления автоматически">
            <Toggle value={settings.autoUpdate as boolean} onChange={v => set('autoUpdate', v)} />
          </Row>
          <Row label="Анимации" desc="Эффекты при открытии окон">
            <Toggle value={settings.animations as boolean} onChange={v => set('animations', v)} />
          </Row>
          <Row label="Язык системы">
            <select
              value={settings.language}
              onChange={e => set('language', e.target.value)}
              className="text-xs px-2 py-1 rounded-lg outline-none"
              style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--os-text)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <option>Русский</option>
              <option>English</option>
              <option>Deutsch</option>
            </select>
          </Row>
          <Row label="Часовой пояс">
            <select
              value={settings.timezone}
              onChange={e => set('timezone', e.target.value)}
              className="text-xs px-2 py-1 rounded-lg outline-none"
              style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--os-text)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <option>Москва (UTC+3)</option>
              <option>Санкт-Петербург (UTC+3)</option>
              <option>Лондон (UTC+0)</option>
            </select>
          </Row>
        </div>
      );
      case 'display': return (
        <div>
          <div className="text-sm font-medium mb-4" style={{ color: 'var(--os-text-dim)' }}>ЭКРАН</div>
          <Row label="Яркость">
            <Slider value={settings.brightness as number} onChange={v => set('brightness', v)} />
          </Row>
          <Row label="Тёмная тема">
            <Toggle value={settings.darkMode as boolean} onChange={v => set('darkMode', v)} />
          </Row>
        </div>
      );
      case 'sound': return (
        <div>
          <div className="text-sm font-medium mb-4" style={{ color: 'var(--os-text-dim)' }}>ЗВУК</div>
          <Row label="Громкость системы">
            <Slider value={settings.volume as number} onChange={v => set('volume', v)} />
          </Row>
        </div>
      );
      case 'network': return (
        <div>
          <div className="text-sm font-medium mb-4" style={{ color: 'var(--os-text-dim)' }}>СЕТЬ</div>
          <Row label="Wi-Fi" desc="Беспроводная сеть: Home-5G">
            <Toggle value={settings.wifi as boolean} onChange={v => set('wifi', v)} />
          </Row>
          <Row label="Bluetooth" desc="Беспроводные устройства">
            <Toggle value={settings.bluetooth as boolean} onChange={v => set('bluetooth', v)} />
          </Row>
        </div>
      );
      case 'security': return (
        <div>
          <div className="text-sm font-medium mb-4" style={{ color: 'var(--os-text-dim)' }}>БЕЗОПАСНОСТЬ</div>
          <Row label="Брандмауэр" desc="Защита входящих соединений">
            <Toggle value={settings.firewall as boolean} onChange={v => set('firewall', v)} />
          </Row>
        </div>
      );
      case 'about': return (
        <div>
          <div className="text-sm font-medium mb-4" style={{ color: 'var(--os-text-dim)' }}>О СИСТЕМЕ</div>
          <div className="flex flex-col items-center py-6 gap-3">
            <span style={{ fontSize: 48 }}>⬡</span>
            <div className="text-lg font-semibold" style={{ color: 'var(--os-text)' }}>ЮраОС</div>
            <div className="text-sm" style={{ color: 'var(--os-text-dim)' }}>Версия 1.0.0 (Build 2026.04.30)</div>
            <div className="mt-4 w-full rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              {[
                ['Процессор', 'Virtual CPU @ 3.0 GHz'],
                ['Оперативная память', '2048 МБ'],
                ['Видеокарта', 'WebGL 2.0'],
                ['Платформа', 'Поехали.dev'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-xs py-1.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'var(--os-text)' }}>
                  <span style={{ color: 'var(--os-text-dim)' }}>{k}</span>
                  <span>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="flex h-full text-sm">
      <div className="w-44 flex-shrink-0 p-2 flex flex-col gap-0.5" style={{ borderRight: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.15)' }}>
        {SECTIONS.map(s => (
          <button
            key={s.id}
            onClick={() => setSection(s.id)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all"
            style={{ background: section === s.id ? 'var(--os-accent-dim)' : 'transparent', color: section === s.id ? 'var(--os-accent)' : 'var(--os-text)' }}
          >
            <Icon name={s.icon} size={14} />
            <span className="text-xs">{s.label}</span>
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto p-5">
        {renderContent()}
      </div>
    </div>
  );
}
