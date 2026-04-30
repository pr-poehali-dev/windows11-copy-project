export type AppId = 'files' | 'apps' | 'settings' | 'terminal' | 'notifications' | 'start' | 'yandex';

export interface WindowState {
  id: string;
  appId: AppId;
  title: string;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  icon: string;
  read: boolean;
}

export interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'doc' | 'image' | 'video';
  size?: string;
  modified: string;
}

export interface AppItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  installed: boolean;
  category: string;
}