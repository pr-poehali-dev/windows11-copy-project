import { useState, useRef } from 'react';
import Icon from '@/components/ui/icon';

const BOOKMARKS = [
  { label: 'Яндекс', url: 'https://ya.ru' },
  { label: 'Почта', url: 'https://mail.yandex.ru' },
  { label: 'Карты', url: 'https://maps.yandex.ru' },
  { label: 'Новости', url: 'https://news.yandex.ru' },
  { label: 'Диск', url: 'https://disk.yandex.ru' },
];

export default function YandexBrowser() {
  const [url, setUrl] = useState('https://ya.ru');
  const [input, setInput] = useState('https://ya.ru');
  const [loading, setLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const navigate = (target: string) => {
    let finalUrl = target.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      if (finalUrl.includes('.')) {
        finalUrl = 'https://' + finalUrl;
      } else {
        finalUrl = `https://yandex.ru/search/?text=${encodeURIComponent(finalUrl)}`;
      }
    }
    setUrl(finalUrl);
    setInput(finalUrl);
    setLoading(true);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') navigate(input);
  };

  return (
    <div className="flex flex-col h-full" style={{ background: '#0d1117' }}>
      {/* Toolbar */}
      <div
        className="flex items-center gap-2 px-3 py-2 flex-shrink-0"
        style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        {/* Nav buttons */}
        <button
          onClick={() => iframeRef.current?.contentWindow?.history.back()}
          className="w-7 h-7 flex items-center justify-center rounded-lg transition-all"
          style={{ color: 'var(--os-text-dim)' }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
        >
          <Icon name="ChevronLeft" size={15} />
        </button>
        <button
          onClick={() => iframeRef.current?.contentWindow?.history.forward()}
          className="w-7 h-7 flex items-center justify-center rounded-lg transition-all"
          style={{ color: 'var(--os-text-dim)' }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
        >
          <Icon name="ChevronRight" size={15} />
        </button>
        <button
          onClick={() => navigate(url)}
          className="w-7 h-7 flex items-center justify-center rounded-lg transition-all"
          style={{ color: 'var(--os-text-dim)' }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
        >
          <Icon name={loading ? 'X' : 'RefreshCw'} size={13} />
        </button>

        {/* Address bar */}
        <div
          className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <Icon name="Lock" size={12} style={{ color: 'var(--os-text-dim)', flexShrink: 0 }} />
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            onFocus={e => e.target.select()}
            className="flex-1 bg-transparent outline-none text-xs"
            style={{ color: 'var(--os-text)', fontFamily: "'IBM Plex Mono', monospace" }}
            spellCheck={false}
          />
          <button onClick={() => navigate(input)}>
            <Icon name="ArrowRight" size={12} style={{ color: 'var(--os-text-dim)' }} />
          </button>
        </div>

        {/* Home */}
        <button
          onClick={() => navigate('https://ya.ru')}
          className="w-7 h-7 flex items-center justify-center rounded-lg transition-all"
          style={{ color: 'var(--os-text-dim)' }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
        >
          <Icon name="Home" size={14} />
        </button>
      </div>

      {/* Bookmarks */}
      <div
        className="flex items-center gap-1 px-3 py-1 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.15)' }}
      >
        {BOOKMARKS.map(b => (
          <button
            key={b.url}
            onClick={() => navigate(b.url)}
            className="px-2.5 py-0.5 rounded text-xs transition-all"
            style={{
              color: url.startsWith(b.url) ? 'var(--os-accent)' : 'var(--os-text-dim)',
              background: url.startsWith(b.url) ? 'var(--os-accent-dim)' : 'transparent',
            }}
            onMouseEnter={e => { if (!url.startsWith(b.url)) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; }}
            onMouseLeave={e => { if (!url.startsWith(b.url)) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
          >
            {b.label}
          </button>
        ))}
      </div>

      {/* iframe */}
      <div className="flex-1 relative overflow-hidden">
        {loading && (
          <div
            className="absolute top-0 left-0 right-0 h-0.5 z-10"
            style={{ background: 'linear-gradient(90deg, var(--os-accent), transparent)', animation: 'progress 1.5s ease-in-out infinite' }}
          />
        )}
        <iframe
          ref={iframeRef}
          src={url}
          className="w-full h-full border-0"
          onLoad={() => setLoading(false)}
          onError={() => setLoading(false)}
          title="Яндекс Браузер"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
        />
      </div>

      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); opacity: 1; }
          100% { transform: translateX(400%); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
