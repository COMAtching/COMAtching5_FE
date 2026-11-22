import type { OrderGrant } from "@/hooks/admin/useAdminOrders";

export const grantLabels: Record<OrderGrant["grantStatus"], string> = {
  PENDING: "지급 대기 중",
  GRANTED: "지급 완료",
  FAILED: "지급 실패",
  REVIEW_REQUIRED: "기존 지급 이력 확인 필요",
  NOT_REQUESTED: "지급 요청 전",
};
