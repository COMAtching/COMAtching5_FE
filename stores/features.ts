import { showAppAlert } from "@/lib/app-alert";
import { create } from "zustand";

export const FEATURE_NAMES = {
  LOGIN: "전체 서비스",
  CHAT: "채팅",
  MATCHING: "매칭",
  SHOP_PAYMENT: "상점 및 결제",
} as const;
export type Feature = keyof typeof FEATURE_NAMES;
export type FeatureState = {
  feature: Feature;
  open: boolean;
  message: string;
  version: number;
};
type States = Partial<Record<Feature, FeatureState>>;
export const useFeatureStates = create<{
  states: States;
  versions: Partial<Record<Feature, number>>;
  unavailable: () => void;
  update: (items: FeatureState[]) => void;
}>((set) => ({
  states: {},
  versions: {},
  unavailable: () => set({ states: {} }),
  update: (items) =>
    set(({ states, versions }) => {
      const next = { ...states };
      const latest = { ...versions };
      for (const item of items) {
        if (
          item &&
          Object.hasOwn(FEATURE_NAMES, item.feature) &&
          typeof item.open === "boolean" &&
          Number.isSafeInteger(item.version) &&
          item.version >= (latest[item.feature] ?? -1)
        ) {
          next[item.feature] = item;
          latest[item.feature] = item.version;
        }
      }
      return { states: next, versions: latest };
    }),
}));
export function useFeature(feature: Feature) {
  return useFeatureStates((s) => s.states[feature]);
}
export function featureMessage(feature: Feature, current?: FeatureState) {
  if (!current) return "운영 상태를 확인하는 중입니다.";
  if (current.message?.trim()) return current.message;
  return FEATURE_NAMES[feature] + " 운영이 종료되었습니다.";
}
export function alertIfClosed(feature: Feature) {
  const value = useFeatureStates.getState().states[feature];
  if (value?.open) return false;
  showAppAlert(featureMessage(feature, value));
  return true;
}
