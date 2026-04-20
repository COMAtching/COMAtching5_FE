import { ADVANTAGES } from "@/lib/constants/advantages";
import { HOBBIES } from "@/lib/constants/hobbies";

export const ALL_HOBBIES = Object.values(HOBBIES).flat();
export const ALL_ADVANTAGES = Object.values(ADVANTAGES).flat();

/**
 * Backend list items and constant items matching helper
 * Returns the full string with emoji if found, otherwise returns the original text.
 */
export const findWithEmoji = (
  list: readonly string[] | string[],
  text: string,
) => {
  return list.find((item) => item.includes(text)) || text;
};
