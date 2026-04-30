import { useState, useCallback, useEffect } from 'react';
import { WindowState, AppId, Notification } from './types';

const APP_DEFAULTS: Record<AppId, { title: string; width: number; height: number }> = {
  files: { title: 'Файловый менеджер', width: 760, height: 520 },
  apps: { title: 'Каталог приложений', width: 720, height: 540 },
  settings: { title: 'Настройки', width: 680, height: 500 },
  terminal: { title: 'Терминал', width: 640, height: 420 },
  notifications: { title: 'Уведомления', width: 420, height: 500 },
  start: { title: 'Меню', width: 360, height: 480 },
  yandex: { title: 'Яндекс Браузер', width: 900, height: 620 },
};

let windowCounter = 0;

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: '1', title: 'Система', message: 'Добро пожаловать в ЮраОС!', time: 'Сейчас', icon: '🚀', read: false },
  { id: '2', title: 'Обновления', message: 'Все компоненты актуальны', time: '2 мин назад', icon: '✅', read: false },
  { id: '3', title: 'Файловый менеджер', message: 'Обнаружены новые файлы в Загрузках', time: '5 мин назад', icon: '📁', read: true },
];

export function useOS() {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const openApp = useCallback((appId: AppId) => {
    setShowStartMenu(false);
    const existing = windows.find(w => w.appId === appId);
    if (existing) {
      if (existing.isMinimized) {
        setWindows(prev => prev.map(w => w.id === existing.id ? { ...w, isMinimized: false } : w));
      }
      setActiveWindow(existing.id);
      return;
    }
    const defaults = APP_DEFAULTS[appId];
    const id = `win-${++windowCounter}`;
    const offset = (windowCounter % 6) * 24;
    const newWindow: WindowState = {
      id,
      appId,
      title: defaults.title,
      isMinimized: false,
      isMaximized: false,
      zIndex: 10 + windowCounter,
      x: 80 + offset,
      y: 60 + offset,
      width: defaults.width,
      height: defaults.height,
    };
    setWindows(prev => [...prev, newWindow]);
    setActiveWindow(id);
  }, [windows]);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    setActiveWindow(prev => prev === id ? null : prev);
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
    setActiveWindow(null);
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
  }, []);

  const focusWindow = useCallback((id: string) => {
    windowCounter++;
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: 10 + windowCounter, isMinimized: false } : w));
    setActiveWindow(id);
  }, []);

  const moveWindow = useCallback((id: string, x: number, y: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, x, y } : w));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    windows, openApp, closeWindow, minimizeWindow, maximizeWindow, focusWindow, moveWindow,
    activeWindow, notifications, markAllRead, unreadCount,
    showStartMenu, setShowStartMenu,
    showNotifPanel, setShowNotifPanel,
    time,
  };
}