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
export type SocialType = "INSTAGRAM" | "FACEBOOK" | "TWITTER" | "KAKAO";
export type ContactFrequency = "FREQUENT" | "NORMAL" | "RARE";

export interface ProfileData {
  // 기본 정보
  nickname?: string;
  gender?: Gender;
  birthDate?: string; // YYYY-MM-DD 형식
  mbti?: MBTI;
  intro?: string;
  profileImageUrl?: string;

  // 소셜 정보
  socialType?: SocialType;
  socialAccountId?: string;

  // 학교 정보
  university?: string;
  major?: string;

  // 기타
  contactFrequency?: ContactFrequency;
}

// 백엔드 전송용 타입 (필수 필드)
export interface ProfileSubmitData {
  nickname: string;
  gender: Gender;
  birthDate: string;
  mbti: MBTI;
  intro: string;
  profileImageUrl: string;
  socialType: SocialType;
  socialAccountId: string;
  university: string;
  major: string;
  contactFrequency: ContactFrequency;
}
