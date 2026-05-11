"use client";

import { create } from "zustand";
import { MatchingRequest, MatchingResult } from "@/lib/types/matching";

interface MatchingStore {
  /** 매칭 진행 중 여부 */
  isMatching: boolean;
  /** 매칭 결과 데이터 */
  result: MatchingResult | null;
  /** 마지막으로 사용한 매칭 조건 (같은 조건 재매칭용) */
  lastPayload: MatchingRequest | null;
  /** 진행 상태 변경 */
  setIsMatching: (isMatching: boolean) => void;
  /** 결과 저장 */
  setResult: (result: MatchingResult) => void;
  /** 마지막 매칭 조건 저장 */
  setLastPayload: (payload: MatchingRequest) => void;
  /** 초기화 */
  clear: () => void;
}

export const useMatchingStore = create<MatchingStore>((set) => ({
  isMatching: false,
  result: null,
  lastPayload: null,
  setIsMatching: (isMatching) => set({ isMatching }),
  setResult: (result) => set({ result }),
  setLastPayload: (payload) => set({ lastPayload: payload }),
  clear: () => set({ result: null, lastPayload: null }),
}));
