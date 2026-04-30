import { useState, useRef, useEffect } from 'react';

interface Line {
  type: 'input' | 'output' | 'error' | 'system';
  text: string;
}

const COMMANDS: Record<string, string | ((args: string[]) => string)> = {
  help: `Доступные команды:
  help        — список команд
  ls          — список файлов
  pwd         — текущая директория
  whoami      — имя пользователя
  date        — текущая дата и время
  echo [text] — вывод текста
  clear       — очистить терминал
  uname       — информация о системе
  uptime      — время работы системы
  neofetch    — информация о системе`,
  ls: `📁 Документы   📁 Загрузки   📁 Фотографии
📁 Проекты     📄 README.md   💻 install.sh`,
  pwd: '/home/user',
  whoami: 'user',
  date: () => new Date().toLocaleString('ru-RU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  uname: 'ЮраОС 1.0.0 (x86_64) — Powered by Поехали',
  uptime: () => {
    const h = Math.floor(Math.random() * 8) + 1;
    const m = Math.floor(Math.random() * 60);
    return `up ${h}:${String(m).padStart(2, '0')}, 1 user, load average: 0.12, 0.08, 0.05`;
  },
  neofetch: `
       ⬡⬡⬡⬡      user@юраос
      ⬡      ⬡     ─────────────
     ⬡  ●  ●  ⬡    ОС: ЮраОС 1.0.0
     ⬡    ▲    ⬡    Ядро: web-kernel 5.15
      ⬡  ═══  ⬡    Оболочка: юраsh 2.1
       ⬡⬡⬡⬡      ЦП: Virtual CPU @ 3.0GHz
                   ОЗУ: 512 МБ / 2048 МБ`,
};

const INITIAL: Line[] = [
  { type: 'system', text: 'ЮраОС Терминал v1.0.0' },
  { type: 'system', text: 'Введите "help" для списка команд.' },
  { type: 'system', text: '' },
];

export default function Terminal() {
  const [lines, setLines] = useState<Line[]>(INITIAL);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const runCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const newLines: Line[] = [...lines, { type: 'input', text: `user@юраос:~$ ${trimmed}` }];
    const parts = trimmed.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (command === 'clear') {
      setLines(INITIAL);
      setHistory(prev => [trimmed, ...prev]);
      setHistIdx(-1);
      setInput('');
      return;
    }

    if (command in COMMANDS) {
      const result = COMMANDS[command];
      const output = typeof result === 'function' ? result(args) : result;
      output.split('\n').forEach(line => newLines.push({ type: 'output', text: line }));
    } else if (command === 'echo') {
      newLines.push({ type: 'output', text: args.join(' ') });
    } else {
      newLines.push({ type: 'error', text: `юраsh: command not found: ${command}` });
    }

    newLines.push({ type: 'system', text: '' });
    setLines(newLines);
    setHistory(prev => [trimmed, ...prev]);
    setHistIdx(-1);
    setInput('');
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      runCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const idx = histIdx + 1;
      if (idx < history.length) {
        setHistIdx(idx);
        setInput(history[idx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const idx = histIdx - 1;
      if (idx < 0) {
        setHistIdx(-1);
        setInput('');
      } else {
        setHistIdx(idx);
        setInput(history[idx]);
      }
    }
  };

  return (
    <div
      className="h-full flex flex-col p-4 cursor-text"
      style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, background: 'rgba(0,0,0,0.3)', color: '#a8ff78' }}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex-1 overflow-y-auto mb-2">
        {lines.map((line, i) => (
          <div
            key={i}
            className="leading-relaxed whitespace-pre-wrap"
            style={{
              color: line.type === 'input' ? '#4a9eff'
                : line.type === 'error' ? '#ff6b6b'
                : line.type === 'system' ? '#64748b'
                : '#a8ff78',
            }}
          >
            {line.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input line */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <span style={{ color: '#4a9eff', flexShrink: 0 }}>user@юраос:~$</span>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          autoFocus
          className="flex-1 bg-transparent outline-none"
          style={{ color: '#a8ff78', fontFamily: "'IBM Plex Mono', monospace", fontSize: 13 }}
          spellCheck={false}
        />
        <span className="terminal-cursor" style={{ color: '#a8ff78' }}>█</span>
      </div>
    </div>
  );
}
