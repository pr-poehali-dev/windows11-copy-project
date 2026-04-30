import Icon from '@/components/ui/icon';
import { Notification } from './types';

interface NotifPanelProps {
  notifications: Notification[];
  onMarkAllRead: () => void;
  onClose: () => void;
}

const QUICK_ACTIONS = [
  { icon: 'Wifi', label: 'Wi-Fi', active: true },
  { icon: 'Bluetooth', label: 'BT', active: false },
  { icon: 'Moon', label: 'Не беспокоить', active: false },
  { icon: 'Volume2', label: 'Звук', active: true },
];

export default function NotificationPanel({ notifications, onMarkAllRead, onClose }: NotifPanelProps) {
  return (
    <div
      className="fixed right-3 bottom-14 w-80 rounded-2xl flex flex-col overflow-hidden notif-enter"
      style={{
        background: 'rgba(15,20,32,0.95)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
        zIndex: 45,
        maxHeight: '70vh',
      }}
    >
      {/* Quick actions */}
      <div className="p-3 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="text-xs font-medium mb-2" style={{ color: 'var(--os-text-dim)' }}>БЫСТРЫЕ ДЕЙСТВИЯ</div>
        <div className="grid grid-cols-4 gap-2">
          {QUICK_ACTIONS.map(action => (
            <button
              key={action.label}
              className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all"
              style={{
                background: action.active ? 'var(--os-accent-dim)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${action.active ? 'rgba(74,158,255,0.3)' : 'rgba(255,255,255,0.07)'}`,
              }}
            >
              <Icon name={action.icon} size={16} style={{ color: action.active ? 'var(--os-accent)' : 'var(--os-text-dim)' }} />
              <span className="text-xs" style={{ color: action.active ? 'var(--os-accent)' : 'var(--os-text-dim)', fontSize: 10 }}>{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Notifications list */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-between px-3 pt-3 pb-2">
          <span className="text-xs font-medium" style={{ color: 'var(--os-text-dim)' }}>УВЕДОМЛЕНИЯ</span>
          <button onClick={onMarkAllRead} className="text-xs transition-colors" style={{ color: 'var(--os-accent)' }}>
            Прочитать все
          </button>
        </div>

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <span style={{ fontSize: 32 }}>🎉</span>
            <span className="text-xs" style={{ color: 'var(--os-text-dim)' }}>Нет новых уведомлений</span>
          </div>
        ) : (
          <div className="px-2 pb-3 flex flex-col gap-1.5">
            {notifications.map(notif => (
              <div
                key={notif.id}
                className="flex gap-3 p-3 rounded-xl"
                style={{
                  background: notif.read ? 'rgba(255,255,255,0.02)' : 'rgba(74,158,255,0.06)',
                  border: `1px solid ${notif.read ? 'rgba(255,255,255,0.04)' : 'rgba(74,158,255,0.12)'}`,
                }}
              >
                <span style={{ fontSize: 20, lineHeight: 1, flexShrink: 0, marginTop: 2 }}>{notif.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium truncate" style={{ color: 'var(--os-text)' }}>{notif.title}</span>
                    <span className="text-xs flex-shrink-0" style={{ color: 'var(--os-text-dim)', fontSize: 10 }}>{notif.time}</span>
                  </div>
                  <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--os-text-dim)' }}>{notif.message}</p>
                </div>
                {!notif.read && (
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: 'var(--os-accent)' }} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
