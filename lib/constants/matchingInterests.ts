import games from "@/public/interest/게임.png";
import growth from "@/public/interest/자기계발.png";
import travel from "@/public/interest/여행.png";
import music from "@/public/interest/예술.png";
import culture from "@/public/interest/문화.png";
import sports from "@/public/interest/스포츠.png";
export const MATCHING_INTEREST_CATEGORIES = [
  "스포츠",
  "문화",
  "음악",
  "여행",
  "자기계발",
  "게임",
] as const;

export type MatchingInterestCategory =
  (typeof MATCHING_INTEREST_CATEGORIES)[number];

export interface MatchingInterestItem {
  category: MatchingInterestCategory;
  imageSrc: string;
}

export const MATCHING_INTEREST_ITEMS: MatchingInterestItem[] = [
  { category: "스포츠", imageSrc: sports.src },
  { category: "문화", imageSrc: culture.src },
  { category: "음악", imageSrc: music.src },
  { category: "여행", imageSrc: travel.src },
  { category: "자기계발", imageSrc: growth.src },
  { category: "게임", imageSrc: games.src },
];
