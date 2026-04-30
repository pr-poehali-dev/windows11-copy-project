import { AppId } from './types';
import Icon from '@/components/ui/icon';

interface StartMenuProps {
  onOpenApp: (id: AppId) => void;
  onClose: () => void;
}

const MENU_APPS: { id: AppId; icon: string; label: string; desc: string }[] = [
  { id: 'files', icon: '📁', label: 'Файловый менеджер', desc: 'Управление файлами' },
  { id: 'apps', icon: '🗂️', label: 'Каталог приложений', desc: 'Установка приложений' },
  { id: 'terminal', icon: '💻', label: 'Терминал', desc: 'Командная строка' },
  { id: 'settings', icon: '⚙️', label: 'Настройки', desc: 'Параметры системы' },
  { id: 'notifications', icon: '🔔', label: 'Уведомления', desc: 'Центр уведомлений' },
  { id: 'yandex', icon: '🔴', label: 'Яндекс Браузер', desc: 'Поиск и сервисы Яндекса' },
];

const RECENT = ['Отчёт_апрель.docx', 'Презентация.pptx', 'Бюджет_2026.xlsx'];

export default function StartMenu({ onOpenApp, onClose }: StartMenuProps) {
  return (
    <div
      className="fixed bottom-14 left-2 w-80 rounded-2xl flex flex-col overflow-hidden ctx-enter"
      style={{
        background: 'rgba(15,20,32,0.96)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
        zIndex: 45,
      }}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-3 mb-3">
          <span style={{ fontSize: 28 }}>⬡</span>
          <div>
            <div className="text-sm font-semibold" style={{ color: 'var(--os-text)' }}>ЮраОС</div>
            <div className="text-xs" style={{ color: 'var(--os-text-dim)' }}>Версия 1.0.0</div>
          </div>
        </div>
      </div>

      {/* Apps */}
      <div className="p-2 flex-1">
        <div className="text-xs font-medium px-2 py-1.5 mb-1" style={{ color: 'var(--os-text-dim)' }}>ПРИЛОЖЕНИЯ</div>
        {MENU_APPS.map(app => (
          <button
            key={app.id}
            onClick={() => { onOpenApp(app.id); onClose(); }}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all text-left"
            style={{ color: 'var(--os-text)' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
          >
            <span style={{ fontSize: 20 }}>{app.icon}</span>
            <div>
              <div className="text-sm font-medium">{app.label}</div>
              <div className="text-xs" style={{ color: 'var(--os-text-dim)' }}>{app.desc}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Recent */}
      <div className="px-4 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="text-xs font-medium mb-2" style={{ color: 'var(--os-text-dim)' }}>НЕДАВНИЕ</div>
        <div className="flex flex-col gap-1">
          {RECENT.map(f => (
            <button
              key={f}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-all text-xs"
              style={{ color: 'var(--os-text)' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
            >
              <Icon name="File" size={12} style={{ color: 'var(--os-text-dim)' }} />
              <span className="truncate">{f}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 flex gap-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {[
          { icon: 'Power', label: 'Выкл.' },
          { icon: 'RefreshCw', label: 'Перезагрузка' },
          { icon: 'LogOut', label: 'Выход' },
        ].map(action => (
          <button
            key={action.icon}
            className="flex-1 flex flex-col items-center gap-1 py-2 rounded-xl transition-all"
            style={{ color: 'var(--os-text-dim)' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
          >
            <Icon name={action.icon} size={16} />
            <span style={{ fontSize: 10 }}>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}