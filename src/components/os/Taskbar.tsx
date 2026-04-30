import Icon from '@/components/ui/icon';
import { AppId, WindowState } from './types';

interface TaskbarProps {
  windows: WindowState[];
  activeWindow: string | null;
  onOpenApp: (id: AppId) => void;
  onFocusWindow: (id: string) => void;
  onMinimizeWindow: (id: string) => void;
  showStartMenu: boolean;
  onToggleStart: () => void;
  showNotifPanel: boolean;
  onToggleNotif: () => void;
  unreadCount: number;
  time: Date;
}

const PINNED_APPS: { id: AppId; icon: string; label: string }[] = [
  { id: 'files', icon: 'FolderOpen', label: 'Файлы' },
  { id: 'apps', icon: 'Grid3X3', label: 'Каталог' },
  { id: 'terminal', icon: 'Terminal', label: 'Терминал' },
  { id: 'settings', icon: 'Settings', label: 'Настройки' },
];

export default function Taskbar({
  windows, activeWindow, onOpenApp, onFocusWindow, onMinimizeWindow,
  showStartMenu, onToggleStart, showNotifPanel, onToggleNotif, unreadCount, time
}: TaskbarProps) {
  const openWindows = windows.filter(w => !w.isMinimized);

  const formatTime = (d: Date) => d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  const formatDate = (d: Date) => d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });

  return (
    <div
      className="taskbar-anim fixed bottom-0 left-0 right-0 h-12 flex items-center px-2 gap-1 z-50"
      style={{ background: 'var(--os-taskbar)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Start button */}
      <button
        onClick={onToggleStart}
        className="flex items-center justify-center w-10 h-8 rounded-lg transition-all duration-150 mr-1"
        style={{
          background: showStartMenu ? 'var(--os-accent-dim)' : 'transparent',
          color: showStartMenu ? 'var(--os-accent)' : 'var(--os-text)',
        }}
        onMouseEnter={e => { if (!showStartMenu) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'; }}
        onMouseLeave={e => { if (!showStartMenu) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
      >
        <span style={{ fontSize: 18 }}>⬡</span>
      </button>

      {/* Separator */}
      <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.08)', margin: '0 4px' }} />

      {/* Pinned apps */}
      {PINNED_APPS.map(app => {
        const isOpen = windows.some(w => w.appId === app.id);
        const isActive = windows.find(w => w.appId === app.id)?.id === activeWindow;
        return (
          <button
            key={app.id}
            title={app.label}
            onClick={() => {
              const win = windows.find(w => w.appId === app.id);
              if (win) {
                if (win.id === activeWindow && !win.isMinimized) onMinimizeWindow(win.id);
                else onFocusWindow(win.id);
              } else {
                onOpenApp(app.id);
              }
            }}
            className="relative flex items-center justify-center w-10 h-8 rounded-lg transition-all duration-150"
            style={{
              background: isActive ? 'var(--os-accent-dim)' : isOpen ? 'rgba(255,255,255,0.06)' : 'transparent',
              color: isActive ? 'var(--os-accent)' : 'var(--os-text)',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = isActive ? 'var(--os-accent-dim)' : 'rgba(255,255,255,0.1)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = isActive ? 'var(--os-accent-dim)' : isOpen ? 'rgba(255,255,255,0.06)' : 'transparent'; }}
          >
            <Icon name={app.icon} size={16} />
            {isOpen && (
              <span
                className="absolute bottom-0.5 left-1/2 -translate-x-1/2 rounded-full"
                style={{ width: isActive ? 12 : 4, height: 2, background: isActive ? 'var(--os-accent)' : 'rgba(255,255,255,0.4)', transition: 'width 0.2s ease' }}
              />
            )}
          </button>
        );
      })}

      {/* Running apps (not pinned) */}
      {openWindows.filter(w => !PINNED_APPS.some(p => p.id === w.appId)).map(w => (
        <button
          key={w.id}
          onClick={() => w.id === activeWindow ? onMinimizeWindow(w.id) : onFocusWindow(w.id)}
          className="relative flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs transition-all duration-150 max-w-32 truncate"
          style={{ background: w.id === activeWindow ? 'var(--os-accent-dim)' : 'rgba(255,255,255,0.06)', color: 'var(--os-text)' }}
        >
          <span className="truncate">{w.title}</span>
        </button>
      ))}

      {/* Spacer */}
      <div className="flex-1" />

      {/* System tray */}
      <div className="flex items-center gap-1">
        {/* Notifications */}
        <button
          onClick={onToggleNotif}
          className="relative flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150"
          style={{ color: showNotifPanel ? 'var(--os-accent)' : 'var(--os-text)', background: showNotifPanel ? 'var(--os-accent-dim)' : 'transparent' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = showNotifPanel ? 'var(--os-accent-dim)' : 'rgba(255,255,255,0.07)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = showNotifPanel ? 'var(--os-accent-dim)' : 'transparent'; }}
        >
          <Icon name="Bell" size={15} />
          {unreadCount > 0 && (
            <span
              className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-xs flex items-center justify-center font-medium"
              style={{ background: 'var(--os-accent)', color: '#fff', fontSize: 10 }}
            >
              {unreadCount}
            </span>
          )}
        </button>

        {/* Clock */}
        <div
          className="flex flex-col items-center justify-center px-2 h-8 rounded-lg cursor-default"
          style={{ color: 'var(--os-text)', fontSize: 11, lineHeight: 1.2 }}
        >
          <span style={{ fontWeight: 500 }}>{formatTime(time)}</span>
          <span style={{ color: 'var(--os-text-dim)', fontSize: 10 }}>{formatDate(time)}</span>
        </div>
      </div>
    </div>
  );
}