import { DEFAULT_PROFILE_ASSETS } from "../constants/defaultProfiles";
import { ContactFrequency, Gender } from "../types/profile";

export const getContactFrequencyLabel = (freq?: ContactFrequency | string) => {
  if (!freq) return "보통"; // 🛡️ 정보가 없거나 빈 경우 기본값 '보통' 반환해 빈 칸으로 노출되는 버그 방지

  const normalized = String(freq).trim().toUpperCase();

  switch (normalized) {
    case "FREQUENT":
    case "자주":
      return "자주";
    case "NORMAL":
    case "보통":
      return "보통";
    case "RARE":
    case "적음":
      return "적음";
    default:
      // 소문자 및 부분 일치 처리
      if (normalized.includes("FREQ")) return "자주";
      if (normalized.includes("NORM")) return "보통";
      if (normalized.includes("RARE")) return "적음";
      return freq;
  }
};

/**
 * 서버에서 내려온 프로필 이미지 URL/키를 실제 이미지 경로로 변환
 */
export const getProfileImageUrl = (
  url: string | null | undefined,
  gender?: Gender | string,
) => {
  if (!url || url === "default") return "/default-profile.png";

  // 파일명 부분 추출 (URL인 경우 마지막 세그먼트)
  const filename = url.split("/").pop() || "";

  // animal_ 또는 default_ 접두사가 붙은 경우 로컬 에셋에서 찾음
  if (
    url.startsWith("animal_") ||
    url.startsWith("default_") ||
    filename.startsWith("animal_") ||
    filename.startsWith("default_")
  ) {
    const animalId = filename
      .replace("animal_", "")
      .replace("default_", "")
      .replace(/_(male|female)/i, "") // _male 또는 _female 접미사 제거
      .replace(/\d+.*$/, "") // animal_dinosaur1.png -> dinosaur
      .replace(/\..*$/, ""); // 확장자 제거

    const asset = DEFAULT_PROFILE_ASSETS.find(
      (p) => p.id.toLowerCase() === animalId.toLowerCase(),
    );

    if (asset) {
      if (gender === "MALE" && asset.maleImage) return asset.maleImage;
      if (gender === "FEMALE" && asset.femaleImage) return asset.femaleImage;
      return (
        asset.fallbackImage ||
        asset.maleImage ||
        asset.femaleImage ||
        "/default-profile.png"
      );
    }
  }

  // 그 외에는 서버 URL 그대로 사용
  return url;
};
