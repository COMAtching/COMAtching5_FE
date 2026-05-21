export const CURRENT_YEAR = 2026;

// true 이면 충전하기 및 매칭하기를 차단하고 "2026년 5월 20일 10시에 시작합니다." 얼럿을 띄웁니다.
export const IS_TESTING = true;

// 차단 시 띄울 얼럿 문구
export const BLOCK_MESSAGE =
  "코매칭 충전 서비스는 5월 22일 00:00시로 종료되었습니다.";

/**
 * 테스트 모드(IS_TESTING === true)인 경우 공통 문구 얼럿을 띄우고 true를 반환합니다.
 */
export function alertIfBlocked(): boolean {
  if (IS_TESTING) {
    alert(BLOCK_MESSAGE);
    return true;
  }
  return false;
}
