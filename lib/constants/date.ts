export const CURRENT_YEAR = 2026;

// 로그인 기능을 차단할지 여부
export const IS_LOGIN_BLOCKED = true;

// 충전하기 기능을 차단할지 여부
export const IS_CHARGE_BLOCKED = true;

// 매칭하기 기능을 차단할지 여부
export const IS_MATCHING_BLOCKED = true;

// 차단 시 띄울 얼럿 문구
export const LOGIN_BLOCK_MESSAGE =
  "코매칭 서비스는 종료되었습니다!\n이용해주셔서 감사합니다.";

export const CHARGE_BLOCK_MESSAGE =
  "코매칭 충전 서비스는 종료되었습니다!\n이용해주셔서 감사합니다.";

export const MATCHING_BLOCK_MESSAGE =
  "코매칭 매칭 서비스는 종료되었습니다!\n이용해주셔서 감사합니다.";

/**
 * 로그인 기능 차단 모드일 경우 얼럿을 띄우고 true를 반환합니다.
 */
export function alertIfLoginBlocked(): boolean {
  if (IS_LOGIN_BLOCKED) {
    alert(LOGIN_BLOCK_MESSAGE);
    return true;
  }
  return false;
}

/**
 * 충전 기능 차단 모드일 경우 얼럿을 띄우고 true를 반환합니다.
 */
export function alertIfChargeBlocked(): boolean {
  if (IS_CHARGE_BLOCKED) {
    alert(CHARGE_BLOCK_MESSAGE);
    return true;
  }
  return false;
}

/**
 * 매칭 기능 차단 모드일 경우 얼럿을 띄우고 true를 반환합니다.
 */
export function alertIfMatchingBlocked(): boolean {
  if (IS_MATCHING_BLOCKED) {
    alert(MATCHING_BLOCK_MESSAGE);
    return true;
  }
  return false;
}
