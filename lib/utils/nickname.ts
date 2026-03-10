import { NICKNAME_MODIFIERS, NICKNAME_NOUNS } from "../constants/nicknames";

/**
 * 랜덤한 닉네임을 생성합니다 (수식어 + 명사)
 */
export const generateRandomNickname = () => {
  const modifier = NICKNAME_MODIFIERS[Math.floor(Math.random() * NICKNAME_MODIFIERS.length)];
  const noun = NICKNAME_NOUNS[Math.floor(Math.random() * NICKNAME_NOUNS.length)];
  return `${modifier} ${noun}`;
};
