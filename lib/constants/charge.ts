/* ── 아이콘 사이즈 ── */
export const ICON_SIZE = {
  sm: 24,
  lg: 80,
} as const;

/* ── 보유현황 아이콘·라벨 ── */
export const INVENTORY_ROWS = [
  {
    icon: "/main/coin.png",
    alt: "coin",
    label: "보유 뽑기권",
    key: "matching",
  },
  {
    icon: "/main/elec-bulb.png",
    alt: "bulb",
    label: "보유 아이템",
    key: "option",
  },
] as const;

/* ── 구매 가능 한도 (임시) ── */
export const PURCHASE_LIMITS = {
  matching: { current: 18, max: 30, label: "뽑기권" },
  option: { current: 42, max: 60, label: "아이템" },
} as const;

/* ── 이용안내 및 사업자 정보 ── */
export const USAGE_INFO = `* 충전된 포인트의 소멸시효 기한은 서비스 종료일까지 입니다.
* 각 상품은 아이템 개별 구매 또는 번들 상품 형태로 제공됩니다.
* 매칭 1회 진행 시 뽑기권 1장이 차감됩니다.
* 추가 옵션 선택 시 옵션권이 각각 차감되며, 풀옵션 적용 시 최대 옵션권 3장이 사용될 수 있습니다.
* 사용하지 못한 아이템이 남아있더라도 매칭 횟수 제한으로 인해 이용이 제한될 수 있습니다.
* 매칭 이용제한(30회)으로 인해 사용하지 못한 아이템은 환불이 가능합니다.
* 일부 사용된 상품(번들 포함)은 사용된 비율에 따라 환불금액이 산정됩니다.`;

export const NOTICE_INFO = "결제 혹은 환불에 필요한 유의사항을 적습니다.";

export const BUSINESS_INFO =
  "대표이사 천승환 | 호스팅서비스사업자 코매칭 | 사업자 등록번호 843-27-01742 | 통신판매신고 2024-부천원미-2812 | 대표전화 010-3039-7387 | 경기도 부천시 조마루로 366번길 27, 401호";

/* ── 충전 내역 (임시) ── */
export const CHARGE_HISTORY = [
  {
    id: 1,
    date: "2024.04.12",
    orderId: "20240412-0051",
    points: "뽑기권 10개",
    paymentAmount: "10,000원",
    status: "success",
    statusLabel: "결제완료",
  },
  {
    id: 2,
    date: "2024.03.20",
    orderId: "20240320-0001",
    points: "뽑기권 5개",
    paymentAmount: "5,000원",
    status: "success",
    statusLabel: "결제완료",
  },
  {
    id: 3,
    date: "2024.03.18",
    orderId: "20240318-0042",
    points: "옵션권 10개",
    paymentAmount: "5,000원",
    status: "cancelled",
    statusLabel: "결제취소",
  },
  {
    id: 4,
    date: "2024.03.15",
    orderId: "20240315-0012",
    points: "뽑기권 1개 (이벤트)",
    paymentAmount: "0원",
    status: "event",
    statusLabel: "이벤트 증정",
  },
  {
    id: 5,
    date: "2024.03.10",
    orderId: "20240310-0089",
    points: "옵션권 20개",
    paymentAmount: "10,000원",
    status: "success",
    statusLabel: "결제완료",
  },
  {
    id: 6,
    date: "2024.03.05",
    orderId: "20240305-0022",
    points: "뽑기권 30개",
    paymentAmount: "30,000원",
    status: "success",
    statusLabel: "결제완료",
  },
  {
    id: 7,
    date: "2024.02.28",
    orderId: "20240228-0015",
    points: "옵션권 5개",
    paymentAmount: "2,500원",
    status: "cancelled",
    statusLabel: "결제취소",
  },
] as const;

/* ── 탭 정의 ── */
export const TABS = [
  { label: "상점", title: "상점" },
  { label: "충전내역", title: "충전내역" },
  { label: "입금자명 설정", title: "입금자명 설정" },
] as const;

/* ── 입금 계좌 정보 (상수) ── */
export const BANK_INFO = {
  bank: "토스뱅크",
  account: "1002-4809-1716",
  holder: "천승환",
} as const;
