import { alertIfClosed } from "@/stores/features";

export const CURRENT_YEAR = 2026;

/**
 * 로그인 기능 차단 모드일 경우 얼럿을 띄우고 true를 반환합니다.
 */
export function alertIfLoginBlocked(): boolean {
  return alertIfClosed("LOGIN");
}

/**
 * 충전 기능 차단 모드일 경우 얼럿을 띄우고 true를 반환합니다.
 */
export function alertIfChargeBlocked(): boolean {
  return alertIfClosed("SHOP_PAYMENT");
}

/**
 * 매칭 기능 차단 모드일 경우 얼럿을 띄우고 true를 반환합니다.
 */
export function alertIfMatchingBlocked(): boolean {
  return alertIfClosed("MATCHING");
}
