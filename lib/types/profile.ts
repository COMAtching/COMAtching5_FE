// 온보딩 프로필 데이터 타입 정의

export type Gender = "MALE" | "FEMALE";
export type MBTI =
  | "ISTJ"
  | "ISFJ"
  | "INFJ"
  | "INTJ"
  | "ISTP"
  | "ISFP"
  | "INFP"
  | "INTP"
  | "ESTP"
  | "ESFP"
  | "ENFP"
  | "ENTP"
  | "ESTJ"
  | "ESFJ"
  | "ENFJ"
  | "ENTJ";
export type SocialType = "INSTAGRAM" | "KAKAO";
export type ContactFrequency = "FREQUENT" | "NORMAL" | "RARE";

export interface Hobby {
  category: string;
  name: string;
}

export interface IntroItem {
  question: string;
  answer: string;
}

export interface ProfileData {
  // 기본 정보
  memberId: number;
  nickname?: string;
  gender?: Gender;
  birthDate?: string; // YYYY-MM-DD 형식
  mbti?: MBTI;
  intro?: string;
  profileImageUrl?: string;
  profileImageFile?: File; // 업로드용 실제 파일

  // 소셜 정보
  socialType?: SocialType;
  socialAccountId?: string;

  // 학교 정보
  university?: string;
  department?: string;
  major?: string;

  // 기타
  contactFrequency?: ContactFrequency;
  hobbies?: Hobby[] | string[]; // UI에서는 string[], 제출 시 Hobby[]
  intros?: IntroItem[];
  tags?: { tag: string }[];
  song?: string;
}

// 백엔드 전송용 타입 (필수 필드 및 변경된 스펙 반영)
export interface ProfileSubmitData {
  nickname: string;
  gender: Gender;
  birthDate: string;
  mbti: MBTI;
  intro: string;
  profileImageKey: string;
  socialType: SocialType | null;
  socialAccountId: string | null;
  university: string;
  major: string;
  contactFrequency: ContactFrequency;
  hobbies: Hobby[];
  intros: IntroItem[];
  tags: { tag: string }[] | null;
  song: string | null;
}
