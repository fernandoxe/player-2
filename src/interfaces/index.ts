export const REACTION_TYPE: {[key: string]: string} = {
  love: '❤️',
  inlove: '😍',
  hahaha: '😂',
  sad: '😢',
  pleading: '🥺',
  angry: '😠',
  cry: '😭',
  surprise: '😮',
  thinking: '🤔',
};

export interface ReactionI {
  id: string;
  code: string;
  user: string;
  size: number;
  position: number;
}

export interface UserI {
  id: string;
  name: string;
  currentTime: number;
}

export type ConnectionStatus = 'disconnected' | 'connecting' | 'reconnecting' | 'connected';
