import { z } from "zod";

// --- 인증 ---
export const LoginSchema = z.object({
  email: z.string().email("올바른 이메일 형식이 아닙니다").max(100),
  password: z.string().min(1, "비밀번호를 입력해주세요").max(72),
});

// --- 매칭 ---
export const MatchingRequestSchema = z.object({
  ageOption: z.enum(["OLDER", "YOUNGER", "EQUAL"]).nullable().optional(),
  mbtiOption: z.string().max(4).optional(),
  hobbyOption: z
    .enum(["SPORTS", "CULTURE", "MUSIC", "LEISURE", "DAILY", "GAME"])
    .optional(),
  contactFrequency: z.enum(["FREQUENT", "NORMAL", "RARE"]).optional(),
  sameMajorOption: z.boolean(),
  importantOption: z.enum(["MBTI", "HOBBY", "CONTACT"]).optional(),
  minAgeOffset: z.number().int().min(0).max(20).nullable().optional(),
  maxAgeOffset: z.number().int().min(0).max(20).nullable().optional(),
});

// --- 프로필 제출 ---
const MbtiList = [
  "ISTJ",
  "ISFJ",
  "INFJ",
  "INTJ",
  "ISTP",
  "ISFP",
  "INFP",
  "INTP",
  "ESTP",
  "ESFP",
  "ENFP",
  "ENTP",
  "ESTJ",
  "ESFJ",
  "ENFJ",
  "ENTJ",
] as const;

const HobbySchema = z.object({
  category: z.string().max(50),
  name: z.string().max(50),
});

export const ProfileSubmitSchema = z.object({
  nickname: z.string().min(1).max(20),
  gender: z.enum(["MALE", "FEMALE"]),
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD 형식이어야 합니다"),
  mbti: z.enum(MbtiList),
  intro: z.string().max(200),
  profileImageKey: z.string().min(1),
  socialType: z.enum(["INSTAGRAM", "KAKAO"]).nullable(),
  socialAccountId: z.string().max(100).nullable(),
  university: z.string().min(1).max(100),
  major: z.string().min(1).max(100),
  contactFrequency: z.enum(["FREQUENT", "NORMAL", "RARE"]),
  hobbies: z.array(HobbySchema).max(10),
  tags: z
    .array(z.object({ tag: z.string().max(20) }))
    .max(5)
    .nullable(),
  song: z.string().max(200).nullable(),
  profileImageUrl: z.string().url().optional(),
  isMatchable: z.boolean().optional(),
});

// --- 리다이렉트 안전 처리 ---
/**
 * 로그인 후 이동할 주소가 내부 경로인지 검증합니다.
 * 외부 URL이거나 프로토콜 상대 URL(//)인 경우 기본 경로로 폴백합니다.
 */
export function safeRedirectUrl(
  url: string | null,
  fallback = "/main",
): string {
  if (!url) return fallback;
  if (url.startsWith("/") && !url.startsWith("//")) return url;
  try {
    const parsed = new URL(url);
    const allowed = ["comatching.site", "www.comatching.site"];
    if (allowed.includes(parsed.hostname))
      return parsed.pathname + parsed.search;
  } catch {
    // URL 파싱 실패 -> 폴백
  }
  return fallback;
}
