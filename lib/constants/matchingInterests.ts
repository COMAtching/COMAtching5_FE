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
  { category: "스포츠", imageSrc: "/interest/스포츠.png" },
  { category: "문화", imageSrc: "/interest/문화.png" },
  { category: "음악", imageSrc: "/interest/예술.png" },
  { category: "여행", imageSrc: "/interest/여행.png" },
  { category: "자기계발", imageSrc: "/interest/자기계발.png" },
  { category: "게임", imageSrc: "/interest/게임.png" },
];
