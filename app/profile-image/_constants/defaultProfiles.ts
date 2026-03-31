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
    maleImage: "/animal/dog_male%201.png",
    femaleImage: "/animal/dog_female%201.png",
  },
  {
    id: "cat",
    name: "고양이",
    maleImage: "/animal/cat_male%201.png",
    femaleImage: "/animal/cat_female%201.png",
  },
  {
    id: "bear",
    name: "곰",
    maleImage: "/animal/bear_male%201.png",
    femaleImage: "/animal/bear_female%201.png",
  },
  {
    id: "rabbit",
    name: "토끼",
    maleImage: "/animal/rabbit_male%201.png",
    femaleImage: "/animal/rabbit_female%201.png",
  },
  {
    id: "fox",
    name: "여우",
    maleImage: "/animal/fox_male%201.png",
    femaleImage: "/animal/fox_female%201.png",
  },
  {
    id: "dinosaur",
    name: "공룡",
    maleImage: "/animal/dinosaur%201.png",
    femaleImage: "/animal/dinosaur%201.png",
    fallbackImage: "/animal/dinosaur%201.png",
  },
  {
    id: "otter",
    name: "수달",
    maleImage: "/animal/otter_male%201.png",
    femaleImage: "/animal/otter_female%201.png",
  },
  {
    id: "wolf",
    name: "늑대",
    maleImage: "/animal/Wolf_male%201.png",
    femaleImage: "/animal/Wolf_female%201.png",
  },
  {
    id: "snake",
    name: "뱀",
    femaleImage: "/animal/snake_female.png",
  },
  {
    id: "horse",
    name: "말",
    maleImage: "/animal/horse_male.png",
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
