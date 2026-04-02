"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ProfileData } from "@/lib/types/profile";

const STORAGE_KEY = "onboarding-profile-data";
const LEGACY_STORAGE_KEYS = ["profileBuilder"];

const legacyGenderMap: Record<string, ProfileData["gender"]> = {
  남자: "MALE",
  여자: "FEMALE",
};

const legacyContactFrequencyMap: Record<
  string,
  ProfileData["contactFrequency"]
> = {
  자주: "FREQUENT",
  보통: "NORMAL",
  적음: "RARE",
};

interface LegacyProfileBuilderData {
  birthYear?: string;
  university?: string;
  department?: string;
  major?: string;
  gender?: string;
  mbti?: string;
  frequency?: string;
}

const migrateLegacyProfile = (
  legacyProfile: LegacyProfileBuilderData,
): Partial<ProfileData> => {
  const normalizedMbti = legacyProfile.mbti?.toUpperCase();

  return {
    birthDate: legacyProfile.birthYear
      ? `${legacyProfile.birthYear}-01-01`
      : undefined,
    university: legacyProfile.university,
    department: legacyProfile.department,
    major: legacyProfile.major,
    gender: legacyProfile.gender
      ? legacyGenderMap[legacyProfile.gender]
      : undefined,
    mbti: normalizedMbti as ProfileData["mbti"] | undefined,
    contactFrequency: legacyProfile.frequency
      ? legacyContactFrequencyMap[legacyProfile.frequency]
      : undefined,
  };
};

interface ProfileContextType {
  profile: ProfileData;
  updateProfile: (data: Partial<ProfileData>) => void;
  clearProfile: () => void;
  isReady: boolean;
}

interface ProfileStoreState extends ProfileContextType {
  setReady: (ready: boolean) => void;
}

export const useProfileStore = create<ProfileStoreState>()(
  persist(
    (set, get) => ({
      profile: {} as ProfileData,
      isReady: false,
      setReady: (ready) => set({ isReady: ready }),
      updateProfile: (data) => {
        const updated = { ...get().profile, ...data };
        set({ profile: updated });
      },
      clearProfile: () => {
        set({ profile: {} as ProfileData });
        try {
          localStorage.removeItem(STORAGE_KEY);
          LEGACY_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
        } catch (error) {
          console.error("Failed to clear profile storage:", error);
        }
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ profile: state.profile }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("Failed to hydrate profile store:", error);
        }

        if (state && Object.keys(state.profile || {}).length === 0) {
          for (const key of LEGACY_STORAGE_KEYS) {
            try {
              const saved = localStorage.getItem(key);
              if (!saved) continue;

              const legacyProfile = JSON.parse(
                saved,
              ) as LegacyProfileBuilderData;
              const migrated = migrateLegacyProfile(legacyProfile);
              if (
                Object.values(migrated).some((value) => value !== undefined)
              ) {
                state.updateProfile(migrated);
              }

              localStorage.removeItem(key);
              break;
            } catch (legacyError) {
              console.error(
                "Failed to migrate legacy profile storage:",
                legacyError,
              );
            }
          }
        }

        state?.setReady(true);
      },
    },
  ),
);

// Backward-compatible alias for existing call sites.
export function useProfile() {
  const profile = useProfileStore((state) => state.profile);
  const updateProfile = useProfileStore((state) => state.updateProfile);
  const clearProfile = useProfileStore((state) => state.clearProfile);
  const isReady = useProfileStore((state) => state.isReady);

  return { profile, updateProfile, clearProfile, isReady };
}
