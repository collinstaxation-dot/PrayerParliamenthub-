
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  CHAT = 'CHAT',
  BIBLE_ARENA = 'BIBLE_ARENA'
}

export interface ChatMessage {
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: number;
  thinking?: string;
  sources?: any[];
}
