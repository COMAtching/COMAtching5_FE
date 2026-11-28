export const reportCategories = {
  ABUSE: "욕설·괴롭힘",
  SEXUAL_HARASSMENT: "성희롱·불쾌한 성적 표현",
  IMPERSONATION: "사칭·허위 프로필",
  SPAM_FRAUD: "광고·사기",
  PRIVACY: "개인정보 침해",
  OTHER: "기타",
} as const;

export type ReportCategory = keyof typeof reportCategories;
