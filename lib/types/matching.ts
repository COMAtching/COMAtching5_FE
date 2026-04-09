import { ContactFrequency } from "./profile";

export type AgeOption = "OLDER" | "YOUNGER" | "EQUAL";

export type HobbyOption =
  | "SPORTS"
  | "CULTURE"
  | "MUSIC"
  | "TRAVEL"
  | "DAILY"
  | "GAME";

export type ImportantOption = "AGE" | "MBTI" | "HOBBY" | "CONTACT";

export interface MatchingRequest {
  ageOption?: AgeOption;
  mbtiOption?: string; // e.g., "IS", "EN"
  hobbyOption?: HobbyOption;
  contactFrequency?: ContactFrequency;
  sameMajorOption: boolean;
  importantOption?: ImportantOption;
  minAgeOffset?: number | null;
  maxAgeOffset?: number | null;
}
