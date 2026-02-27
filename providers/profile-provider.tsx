"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ProfileData } from "@/lib/types/profile";

const STORAGE_KEY = "onboarding-profile-data";

interface ProfileContextType {
  profile: ProfileData;
  updateProfile: (data: Partial<ProfileData>) => void;
  clearProfile: () => void;
  isReady: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<ProfileData>({});
  const [isReady, setIsReady] = useState(false);

  // 초기 로드: localStorage에서 데이터 읽기
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProfile(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load profile from localStorage:", error);
    } finally {
      setIsReady(true);
    }
  }, []);

  // 프로필 업데이트 (localStorage에도 자동 저장)
  const updateProfile = (data: Partial<ProfileData>) => {
    setProfile((prev) => {
      const updated = { ...prev, ...data };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error("Failed to save profile to localStorage:", error);
      }
      return updated;
    });
  };

  // 프로필 초기화 (온보딩 완료 후 사용)
  const clearProfile = () => {
    setProfile({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear profile from localStorage:", error);
    }
  };

  return (
    <ProfileContext.Provider
      value={{ profile, updateProfile, clearProfile, isReady }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

// useProfile 훅
export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within ProfileProvider");
  }
  return context;
}
