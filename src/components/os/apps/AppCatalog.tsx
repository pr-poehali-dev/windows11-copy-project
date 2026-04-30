import { useState } from 'react';
import Icon from '@/components/ui/icon';

const APPS = [
  { id: '1', name: 'Браузер', desc: 'Веб-браузер на движке Chromium', icon: '🌐', installed: true, cat: 'Системные' },
  { id: '2', name: 'Редактор кода', desc: 'Лёгкий редактор с подсветкой синтаксиса', icon: '💻', installed: true, cat: 'Разработка' },
  { id: '3', name: 'Медиаплеер', desc: 'Воспроизведение видео и аудио файлов', icon: '🎬', installed: false, cat: 'Мультимедиа' },
  { id: '4', name: 'Таблицы', desc: 'Работа с таблицами и данными', icon: '📊', installed: true, cat: 'Офис' },
  { id: '5', name: 'Почта', desc: 'Клиент электронной почты', icon: '📧', installed: false, cat: 'Коммуникации' },
  { id: '6', name: 'Музыка', desc: 'Потоковая музыка и подкасты', icon: '🎵', installed: false, cat: 'Мультимедиа' },
  { id: '7', name: 'Заметки', desc: 'Быстрые заметки и списки задач', icon: '📝', installed: true, cat: 'Офис' },
  { id: '8', name: 'Калькулятор', desc: 'Стандартный и научный калькулятор', icon: '🧮', installed: true, cat: 'Системные' },
  { id: '9', name: 'Архиватор', desc: 'Сжатие и распаковка архивов', icon: '📦', installed: false, cat: 'Утилиты' },
  { id: '10', name: 'VPN', desc: 'Безопасное подключение к сети', icon: '🔐', installed: false, cat: 'Безопасность' },
  { id: '11', name: 'Погода', desc: 'Прогноз погоды и климатические данные', icon: '🌤️', installed: false, cat: 'Утилиты' },
  { id: '12', name: 'Git', desc: 'Версионирование и управление кодом', icon: '🔀', installed: true, cat: 'Разработка' },
];

const CATS = ['Все', 'Системные', 'Офис', 'Разработка', 'Мультимедиа', 'Утилиты', 'Коммуникации', 'Безопасность'];

export default function AppCatalog() {
  const [cat, setCat] = useState('Все');
  const [search, setSearch] = useState('');
  const [installed, setInstalled] = useState<Record<string, boolean>>(
    Object.fromEntries(APPS.map(a => [a.id, a.installed]))
  );

  const filtered = APPS.filter(a =>
    (cat === 'Все' || a.cat === cat) &&
    (a.name.toLowerCase().includes(search.toLowerCase()) || a.desc.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex h-full text-sm">
      {/* Sidebar */}
      <div className="w-36 flex-shrink-0 p-2 flex flex-col gap-0.5" style={{ borderRight: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.15)' }}>
        <div className="px-2 py-1 text-xs font-medium mb-1" style={{ color: 'var(--os-text-dim)' }}>КАТЕГОРИИ</div>
        {CATS.map(c => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className="text-left px-2 py-1.5 rounded-md text-xs transition-all"
            style={{ background: cat === c ? 'var(--os-accent-dim)' : 'transparent', color: cat === c ? 'var(--os-accent)' : 'var(--os-text)' }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Search */}
        <div className="p-3 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center rounded-lg px-3 py-1.5 gap-2" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <Icon name="Search" size={13} style={{ color: 'var(--os-text-dim)' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Поиск приложений..."
              className="bg-transparent outline-none text-xs flex-1"
              style={{ color: 'var(--os-text)' }}
            />
          </div>
        </div>

        {/* Apps grid */}
        <div className="flex-1 overflow-y-auto p-3 grid grid-cols-2 gap-2 content-start">
          {filtered.map(app => (
            <div
              key={app.id}
              className="flex items-center gap-3 p-3 rounded-xl transition-all"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <span style={{ fontSize: 28, lineHeight: 1 }}>{app.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-xs truncate" style={{ color: 'var(--os-text)' }}>{app.name}</div>
                <div className="text-xs mt-0.5 leading-tight line-clamp-2" style={{ color: 'var(--os-text-dim)' }}>{app.desc}</div>
              </div>
              <button
                onClick={() => setInstalled(prev => ({ ...prev, [app.id]: !prev[app.id] }))}
                className="flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: installed[app.id] ? 'rgba(255,255,255,0.06)' : 'var(--os-accent)',
                  color: installed[app.id] ? 'var(--os-text-dim)' : '#fff',
                  border: installed[app.id] ? '1px solid rgba(255,255,255,0.1)' : 'none',
                }}
              >
                {installed[app.id] ? 'Удалить' : 'Установить'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
