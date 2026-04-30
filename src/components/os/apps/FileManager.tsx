import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { FileItem } from '../types';

const FILES: FileItem[] = [
  { id: '1', name: 'Документы', type: 'folder', modified: '29 апр' },
  { id: '2', name: 'Загрузки', type: 'folder', modified: '28 апр' },
  { id: '3', name: 'Фотографии', type: 'folder', modified: '25 апр' },
  { id: '4', name: 'Проекты', type: 'folder', modified: '20 апр' },
  { id: '5', name: 'Отчёт_апрель.docx', type: 'doc', size: '48 КБ', modified: '30 апр' },
  { id: '6', name: 'Презентация.pptx', type: 'doc', size: '2.1 МБ', modified: '29 апр' },
  { id: '7', name: 'Бюджет_2026.xlsx', type: 'doc', size: '180 КБ', modified: '28 апр' },
  { id: '8', name: 'Логотип.png', type: 'image', size: '340 КБ', modified: '22 апр' },
  { id: '9', name: 'Инструкция.pdf', type: 'doc', size: '1.5 МБ', modified: '15 апр' },
  { id: '10', name: 'Видео_обзор.mp4', type: 'video', size: '128 МБ', modified: '10 апр' },
];

const SIDEBAR = ['Рабочий стол', 'Документы', 'Загрузки', 'Проекты', 'Фотографии'];

const FILE_ICON: Record<string, string> = {
  folder: '📁',
  doc: '📄',
  image: '🖼️',
  video: '🎬',
};

export default function FileManager() {
  const [selected, setSelected] = useState<string | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('list');
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('Рабочий стол');

  const filtered = FILES.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex h-full text-sm">
      {/* Sidebar */}
      <div className="w-40 flex-shrink-0 p-2 flex flex-col gap-0.5" style={{ borderRight: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.15)' }}>
        <div className="px-2 py-1 text-xs font-medium mb-1" style={{ color: 'var(--os-text-dim)' }}>ИЗБРАННОЕ</div>
        {SIDEBAR.map(item => (
          <button
            key={item}
            onClick={() => setLocation(item)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-all text-xs w-full"
            style={{
              background: location === item ? 'var(--os-accent-dim)' : 'transparent',
              color: location === item ? 'var(--os-accent)' : 'var(--os-text)',
            }}
          >
            <span>{item === 'Рабочий стол' ? '🖥️' : item === 'Документы' ? '📄' : item === 'Загрузки' ? '⬇️' : item === 'Проекты' ? '💼' : '🖼️'}</span>
            <span className="truncate">{item}</span>
          </button>
        ))}
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-3 py-2 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-1 mr-1">
            <button className="w-6 h-6 flex items-center justify-center rounded" style={{ color: 'var(--os-text-dim)' }}><Icon name="ChevronLeft" size={14} /></button>
            <button className="w-6 h-6 flex items-center justify-center rounded" style={{ color: 'var(--os-text-dim)' }}><Icon name="ChevronRight" size={14} /></button>
          </div>
          <span className="text-xs font-medium flex-1" style={{ color: 'var(--os-text)' }}>{location}</span>
          <div className="flex items-center rounded-lg px-2 py-1 gap-1.5" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <Icon name="Search" size={12} style={{ color: 'var(--os-text-dim)' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Поиск..."
              className="bg-transparent outline-none text-xs w-28"
              style={{ color: 'var(--os-text)' }}
            />
          </div>
          <button onClick={() => setView(v => v === 'grid' ? 'list' : 'grid')} className="w-6 h-6 flex items-center justify-center rounded" style={{ color: 'var(--os-text-dim)' }}>
            <Icon name={view === 'grid' ? 'List' : 'Grid2X2'} size={14} />
          </button>
        </div>

        {/* Files */}
        <div className="flex-1 overflow-y-auto p-3">
          {view === 'list' ? (
            <table className="w-full text-xs">
              <thead>
                <tr style={{ color: 'var(--os-text-dim)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <th className="text-left pb-2 pl-2 font-medium">Имя</th>
                  <th className="text-left pb-2 font-medium">Размер</th>
                  <th className="text-left pb-2 font-medium">Изменён</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(file => (
                  <tr
                    key={file.id}
                    onClick={() => setSelected(file.id)}
                    className="cursor-pointer rounded-lg transition-all"
                    style={{ background: selected === file.id ? 'var(--os-accent-dim)' : 'transparent' }}
                    onMouseEnter={e => { if (selected !== file.id) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
                    onMouseLeave={e => { if (selected !== file.id) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    <td className="py-1.5 pl-2 pr-3 rounded-l-lg">
                      <div className="flex items-center gap-2">
                        <span>{FILE_ICON[file.type]}</span>
                        <span style={{ color: selected === file.id ? 'var(--os-accent)' : 'var(--os-text)' }}>{file.name}</span>
                      </div>
                    </td>
                    <td className="py-1.5" style={{ color: 'var(--os-text-dim)' }}>{file.size || '—'}</td>
                    <td className="py-1.5 rounded-r-lg" style={{ color: 'var(--os-text-dim)' }}>{file.modified}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {filtered.map(file => (
                <button
                  key={file.id}
                  onClick={() => setSelected(file.id)}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all text-center"
                  style={{ background: selected === file.id ? 'var(--os-accent-dim)' : 'rgba(255,255,255,0.03)', border: `1px solid ${selected === file.id ? 'var(--os-accent)' : 'rgba(255,255,255,0.06)'}` }}
                >
                  <span style={{ fontSize: 32 }}>{FILE_ICON[file.type]}</span>
                  <span className="text-xs truncate w-full" style={{ color: 'var(--os-text)' }}>{file.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Status bar */}
        <div className="px-3 py-1.5 flex-shrink-0 text-xs" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', color: 'var(--os-text-dim)' }}>
          {filtered.length} объект(ов){selected && ' · 1 выбран'}
        </div>
      </div>
    </div>
  );
}
