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
