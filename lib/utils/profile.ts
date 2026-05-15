import { DEFAULT_PROFILE_ASSETS } from "../constants/defaultProfiles";
import { ContactFrequency, Gender } from "../types/profile";

export const getContactFrequencyLabel = (freq?: ContactFrequency | string) => {
  switch (freq) {
    case "FREQUENT":
      return "자주";
    case "NORMAL":
      return "보통";
    case "RARE":
      return "적음";
    default:
      return freq || "";
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
