import { AppId } from './types';

interface DesktopIconsProps {
  onOpenApp: (id: AppId) => void;
}

const ICONS: { id: AppId; emoji: string; label: string; color: string }[] = [
  { id: 'files', emoji: '📁', label: 'Файлы', color: 'linear-gradient(135deg, #3b7dd8, #1e4fa3)' },
  { id: 'apps', emoji: '🗂️', label: 'Каталог', color: 'linear-gradient(135deg, #7c3aed, #4c1d95)' },
  { id: 'terminal', emoji: '💻', label: 'Терминал', color: 'linear-gradient(135deg, #059669, #064e3b)' },
  { id: 'settings', emoji: '⚙️', label: 'Настройки', color: 'linear-gradient(135deg, #475569, #1e293b)' },
  { id: 'notifications', emoji: '🔔', label: 'Центр уведомлений', color: 'linear-gradient(135deg, #d97706, #78350f)' },
];

export default function DesktopIcons({ onOpenApp }: DesktopIconsProps) {
  return (
    <div className="absolute left-4 top-4 flex flex-col gap-2">
      {ICONS.map(icon => (
        <div
          key={icon.id}
          className="os-desktop-icon"
          onDoubleClick={() => onOpenApp(icon.id)}
        >
          <div className="icon-wrap" style={{ background: icon.color }}>
            <span>{icon.emoji}</span>
          </div>
          <span className="icon-label">{icon.label}</span>
        </div>
      ))}
    </div>
  );
}
