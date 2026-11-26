"use client";

import { create } from "zustand";
import type { ProfileData } from "@/lib/types/profile";

interface ProfileStoreState {
  profile: ProfileData;
  isReady: boolean;
  owner: string | null;
  bind: (owner: string | null) => void;
  updateProfile: (data: Partial<ProfileData>) => void;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileStoreState>((set) => ({
  profile: {} as ProfileData,
  isReady: true,
  owner: null,
  bind: (owner) =>
    set((s) => (s.owner === owner ? s : { owner, profile: {} as ProfileData })),
  updateProfile: (data) =>
    set((state) => ({ profile: { ...state.profile, ...data } })),
  clearProfile: () => set({ profile: {} as ProfileData, owner: null }),
}));

export function discardLegacyProfile() {
  try {
    for (const key of ["onboarding-profile-data", "profileBuilder"]) {
      localStorage.removeItem(key);
    }
  } catch {
    // Browsers that disable local storage already keep this draft in memory.
  }
}

export const useProfile = useProfileStore;
