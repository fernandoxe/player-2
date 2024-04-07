import { ReactionI } from '../interfaces';

export const generateReaction = (code: string, user: string): ReactionI => {
  return {
    id: `${Date.now()}${Math.random()}`,
    code,
    user,
    size: Math.floor(Math.random() * 10),
    position: Math.floor(Math.random() * 10),
  };
};
