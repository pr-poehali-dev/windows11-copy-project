import { useRef } from 'react';
import { useOS } from './useOS';
import { AppId } from './types';
import Taskbar from './Taskbar';
import Window from './Window';
import StartMenu from './StartMenu';
import NotificationPanel from './NotificationPanel';
import DesktopIcons from './DesktopIcons';
import FileManager from './apps/FileManager';
import AppCatalog from './apps/AppCatalog';
import Terminal from './apps/Terminal';
import Settings from './apps/Settings';

function AppContent({ appId }: { appId: AppId }) {
  switch (appId) {
    case 'files': return <FileManager />;
    case 'apps': return <AppCatalog />;
    case 'terminal': return <Terminal />;
    case 'settings': return <Settings />;
    case 'notifications': return (
      <div className="h-full overflow-y-auto p-4">
        <p className="text-sm mb-4" style={{ color: 'var(--os-text-dim)' }}>Здесь собраны все системные уведомления.</p>
        <div className="flex flex-col gap-2">
          {[
            { icon: '🚀', t: 'Система', m: 'Добро пожаловать в ЮраОС!', time: 'Сейчас' },
            { icon: '✅', t: 'Обновления', m: 'Все компоненты актуальны', time: '2 мин назад' },
            { icon: '📁', t: 'Файловый менеджер', m: 'Обнаружены новые файлы в Загрузках', time: '5 мин назад' },
          ].map((n, i) => (
            <div key={i} className="flex gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <span style={{ fontSize: 22 }}>{n.icon}</span>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-medium" style={{ color: 'var(--os-text)' }}>{n.t}</span>
                  <span className="text-xs" style={{ color: 'var(--os-text-dim)' }}>{n.time}</span>
                </div>
                <p className="text-xs" style={{ color: 'var(--os-text-dim)' }}>{n.m}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
    default: return null;
  }
}

export default function Desktop() {
  const os = useOS();
  const desktopRef = useRef<HTMLDivElement>(null);

  const handleDesktopClick = () => {
    os.setShowStartMenu(false);
    os.setShowNotifPanel(false);
  };

  return (
    <>
    <div
      ref={desktopRef}
      className="relative w-full overflow-hidden select-none"
      style={{
        height: 'calc(100vh - 48px)',
        background: 'var(--os-bg)',
        backgroundImage: `
          radial-gradient(ellipse 60% 50% at 20% 80%, rgba(74,158,255,0.08) 0%, transparent 60%),
          radial-gradient(ellipse 40% 40% at 80% 20%, rgba(124,58,237,0.07) 0%, transparent 50%),
          radial-gradient(ellipse 30% 30% at 50% 50%, rgba(5,150,105,0.04) 0%, transparent 50%)
        `,
      }}
      onClick={handleDesktopClick}
    >
      {/* Grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Desktop icons */}
      <DesktopIcons onOpenApp={os.openApp} />

      {/* Windows */}
      {os.windows.map(win => (
        <Window
          key={win.id}
          window={win}
          isActive={os.activeWindow === win.id}
          onClose={() => os.closeWindow(win.id)}
          onMinimize={() => os.minimizeWindow(win.id)}
          onMaximize={() => os.maximizeWindow(win.id)}
          onFocus={() => os.focusWindow(win.id)}
          onMove={(x, y) => os.moveWindow(win.id, x, y)}
        >
          <AppContent appId={win.appId} />
        </Window>
      ))}

      {/* Overlays */}
      {os.showStartMenu && (
        <StartMenu
          onOpenApp={os.openApp}
          onClose={() => os.setShowStartMenu(false)}
        />
      )}

      {os.showNotifPanel && (
        <NotificationPanel
          notifications={os.notifications}
          onMarkAllRead={os.markAllRead}
          onClose={() => os.setShowNotifPanel(false)}
        />
      )}
    </div>

    <Taskbar
      windows={os.windows}
      activeWindow={os.activeWindow}
      onOpenApp={os.openApp}
      onFocusWindow={os.focusWindow}
      onMinimizeWindow={os.minimizeWindow}
      showStartMenu={os.showStartMenu}
      onToggleStart={() => { os.setShowStartMenu(v => !v); os.setShowNotifPanel(false); }}
      showNotifPanel={os.showNotifPanel}
      onToggleNotif={() => { os.setShowNotifPanel(v => !v); os.setShowStartMenu(false); }}
      unreadCount={os.unreadCount}
      time={os.time}
    />
    </>
  );
}