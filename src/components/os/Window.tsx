import { useRef, useState, useCallback, ReactNode } from 'react';
import Icon from '@/components/ui/icon';
import { WindowState } from './types';

interface WindowProps {
  window: WindowState;
  isActive: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onMove: (x: number, y: number) => void;
  children: ReactNode;
}

export default function Window({ window: win, isActive, onClose, onMinimize, onMaximize, onFocus, onMove, children }: WindowProps) {
  const dragRef = useRef<{ startX: number; startY: number; winX: number; winY: number } | null>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.win-controls')) return;
    onFocus();
    dragRef.current = { startX: e.clientX, startY: e.clientY, winX: win.x, winY: win.y };

    const handleMove = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = ev.clientX - dragRef.current.startX;
      const dy = ev.clientY - dragRef.current.startY;
      onMove(dragRef.current.winX + dx, dragRef.current.winY + dy);
    };

    const handleUp = () => {
      dragRef.current = null;
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
  }, [win.x, win.y, onFocus, onMove]);

  if (win.isMinimized) return null;

  const style = win.isMaximized
    ? { left: 0, top: 0, width: '100vw', height: 'calc(100vh - 48px)', borderRadius: 0 }
    : { left: win.x, top: win.y, width: win.width, height: win.height };

  return (
    <div
      className="os-window fixed flex flex-col window-enter"
      style={{ ...style, zIndex: win.zIndex, minWidth: 320, minHeight: 220 }}
      onClick={onFocus}
    >
      {/* Title bar */}
      <div
        className="flex items-center gap-2 px-3 py-2.5 cursor-move select-none flex-shrink-0"
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: isActive ? 'rgba(255,255,255,0.03)' : 'transparent',
        }}
        onMouseDown={handleMouseDown}
        onDoubleClick={onMaximize}
      >
        <div className="win-controls flex items-center gap-1.5">
          <button
            onClick={e => { e.stopPropagation(); onClose(); }}
            className="w-3 h-3 rounded-full flex items-center justify-center group transition-opacity"
            style={{ background: '#ff5f57' }}
          >
            <Icon name="X" size={8} className="opacity-0 group-hover:opacity-100 text-red-900" />
          </button>
          <button
            onClick={e => { e.stopPropagation(); onMinimize(); }}
            className="w-3 h-3 rounded-full flex items-center justify-center group transition-opacity"
            style={{ background: '#febc2e' }}
          >
            <Icon name="Minus" size={8} className="opacity-0 group-hover:opacity-100 text-yellow-900" />
          </button>
          <button
            onClick={e => { e.stopPropagation(); onMaximize(); }}
            className="w-3 h-3 rounded-full flex items-center justify-center group transition-opacity"
            style={{ background: '#28c840' }}
          >
            <Icon name="Maximize2" size={8} className="opacity-0 group-hover:opacity-100 text-green-900" />
          </button>
        </div>

        <span
          className="flex-1 text-center text-sm font-medium truncate"
          style={{ color: isActive ? 'var(--os-text)' : 'var(--os-text-dim)', fontSize: 13 }}
        >
          {win.title}
        </span>

        <div style={{ width: 52 }} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden" style={{ color: 'var(--os-text)' }}>
        {children}
      </div>
    </div>
  );
}
