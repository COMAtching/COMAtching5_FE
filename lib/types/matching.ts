import { ContactFrequency, Hobby, Gender, MBTI, SocialType } from "./profile";

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

export interface MatchingResult {
  memberId: number;
  gender: Gender;
  age: number;
  mbti: MBTI;
  major: string;
  intro: string;
  nickname: string;
  profileImageUrl: string;
  socialType: SocialType;
  socialAccountId: string;
  hobbies: Hobby[];
  tags: { tag: string }[];
}

export interface ApiResponse<T> {
  code: string;
  status: number;
  message: string;
  data: T;
}
