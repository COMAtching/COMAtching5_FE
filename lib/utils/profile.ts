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
  if (!url || url === "default" || url === "/default-profile.png")
    return "/profile/default-profile.svg";

  const localAnimal = url.match(
    /^\/animal\/([a-z]+)(?:_(male|female))?(?:(?: |%20)?1)?\.png$/i,
  );
  const preset = url.match(
    /^(?:(?:https?:\/\/[^/]+)?\/api\/public\/profile-images\/)?(?:animal_|default_)([a-z]+)(?:_(male|female))?1?(?:\.png)?$/i,
  );
  const match = localAnimal ?? preset;
  if (!match) return url;

  const asset = DEFAULT_PROFILE_ASSETS.find(
    (item) => item.id === match[1].toLowerCase(),
  );
  if (!asset) return url;

  const variant = match[2]?.toUpperCase() ?? gender;
  if (variant === "FEMALE" && asset.femaleImage) return asset.femaleImage;
  if (variant === "MALE" && asset.maleImage) return asset.maleImage;
  return asset.fallbackImage ?? asset.maleImage ?? asset.femaleImage ?? url;
};
