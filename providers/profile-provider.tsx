"use client";

import type { ReactNode } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ProfileData } from "@/lib/types/profile";

const STORAGE_KEY = "onboarding-profile-data";
const LEGACY_STORAGE_KEYS = ["profileBuilder"];

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
          LEGACY_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
        } catch (error) {
          console.error("Failed to clear legacy profile storage:", error);
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

// Backward-compatible noop wrapper. Zustand store does not require a Provider.
export function ProfileProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
