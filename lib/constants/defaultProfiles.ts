import wolfFemale from "@/public/animal/Wolf_female 1.png";
import wolfMale from "@/public/animal/Wolf_male 1.png";
import bearFemale from "@/public/animal/bear_female 1.png";
import bearMale from "@/public/animal/bear_male 1.png";
import catFemale from "@/public/animal/cat_female 1.png";
import catMale from "@/public/animal/cat_male 1.png";
import dinosaur from "@/public/animal/dinosaur 1.png";
import dogFemale from "@/public/animal/dog_female 1.png";
import dogMale from "@/public/animal/dog_male 1.png";
import foxFemale from "@/public/animal/fox_female 1.png";
import foxMale from "@/public/animal/fox_male 1.png";
import horseMale from "@/public/animal/horse_male.png";
import otterFemale from "@/public/animal/otter_female 1.png";
import otterMale from "@/public/animal/otter_male 1.png";
import rabbitFemale from "@/public/animal/rabbit_female 1.png";
import rabbitMale from "@/public/animal/rabbit_male 1.png";
import snakeFemale from "@/public/animal/snake_female.png";
import type { Gender } from "@/lib/types/profile";

export interface DefaultProfileAsset {
  id: string;
  name: string;
  maleImage?: string;
  femaleImage?: string;
  fallbackImage?: string;
}

type GenderImageKey = "maleImage" | "femaleImage";

const GENDER_PROFILE_RULES: Record<
  Gender,
  { imageKey: GenderImageKey; excludedIds: Set<string> }
> = {
  MALE: { imageKey: "maleImage", excludedIds: new Set(["snake"]) },
  FEMALE: { imageKey: "femaleImage", excludedIds: new Set(["horse"]) },
};

export const DEFAULT_PROFILE_ASSETS: DefaultProfileAsset[] = [
  {
    id: "dog",
    name: "강아지",
    maleImage: dogMale.src,
    femaleImage: dogFemale.src,
  },
  {
    id: "cat",
    name: "고양이",
    maleImage: catMale.src,
    femaleImage: catFemale.src,
  },
  {
    id: "bear",
    name: "곰",
    maleImage: bearMale.src,
    femaleImage: bearFemale.src,
  },
  {
    id: "fox",
    name: "여우",
    maleImage: foxMale.src,
    femaleImage: foxFemale.src,
  },
  {
    id: "rabbit",
    name: "토끼",
    maleImage: rabbitMale.src,
    femaleImage: rabbitFemale.src,
  },
  {
    id: "otter",
    name: "수달",
    maleImage: otterMale.src,
    femaleImage: otterFemale.src,
  },
  {
    id: "wolf",
    name: "늑대",
    maleImage: wolfMale.src,
    femaleImage: wolfFemale.src,
  },
  {
    id: "horse",
    name: "말",
    maleImage: horseMale.src,
  },
  {
    id: "snake",
    name: "뱀",
    femaleImage: snakeFemale.src,
  },
  {
    id: "dinosaur",
    name: "공룡",
    maleImage: dinosaur.src,
    femaleImage: dinosaur.src,
    fallbackImage: dinosaur.src,
  },
];

export function getDefaultProfilesByGender(gender?: Gender) {
  return DEFAULT_PROFILE_ASSETS.flatMap((profile) => {
    if (gender) {
      const rule = GENDER_PROFILE_RULES[gender];
      if (rule.excludedIds.has(profile.id)) {
        return [];
      }
      const image = profile[rule.imageKey];
      if (!image) {
        return [];
      }
      return [{ id: profile.id, name: profile.name, image }];
    }

    // Unknown gender: prefer female image when available so female-only profiles (e.g. snake) are visible.
    if (profile.femaleImage) {
      return [
        { id: profile.id, name: profile.name, image: profile.femaleImage },
      ];
    }
    if (profile.fallbackImage) {
      return [
        { id: profile.id, name: profile.name, image: profile.fallbackImage },
      ];
    }
    return [];
  });
}

/**
 * 같은 동물 id 기준으로 반대 성별 이미지가 존재하는지 확인하고, 존재하면 id 반환
 */
export function getAutoSwitchProfileIdByGender(
  currentProfileId: string,
  newGender?: Gender,
): string | null {
  if (!newGender) {
    return null;
  }

  // 뱀(여성전용) ↔ 말(남성전용) 특수 스위칭 매핑
  if (currentProfileId === "snake" && newGender === "MALE") {
    return "horse";
  }
  if (currentProfileId === "horse" && newGender === "FEMALE") {
    return "snake";
  }

  const asset = DEFAULT_PROFILE_ASSETS.find((p) => p.id === currentProfileId);
  if (!asset) {
    return null;
  }

  const rule = GENDER_PROFILE_RULES[newGender];
  if (rule.excludedIds.has(currentProfileId)) {
    return null;
  }

  const hasImageForNewGender = asset[rule.imageKey];

  return hasImageForNewGender ? currentProfileId : null;
}
