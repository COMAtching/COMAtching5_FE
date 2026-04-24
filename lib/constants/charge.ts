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

/* ── 빠른 구매 번들 카드 ── */
export const QUICK_BUNDLES = [
  {
    title: "실속 번들",
    icon: "/main/coin.png",
    description: "뽑기권 5개+옵션권 2개",
    bonus: "옵션권 1개 무료 증정!",
    price: "5,000원",
    priceValue: 5000,
  },
  {
    title: "슈퍼 번들",
    icon: "/main/coin.png",
    description: "뽑기권 10개+옵션권 10개",
    bonus: "옵션권 5개 무료 증정!",
    price: "10,000원",
    priceValue: 10000,
  },
] as const;

/* ── API 응답 데이터 타입 ── */
export interface Reward {
  itemType: "MATCHING_TICKET" | "OPTION_TICKET";
  itemName: string;
  quantity: number;
}

export interface ShopItemAPI {
  id: number;
  name: string;
  price: number;
  rewards: Reward[];
}

/* ── 전체 아이템 (API 더미 데이터) ── */
export const SHOP_ITEMS_API: ShopItemAPI[] = [
  {
    id: 1,
    name: "뽑기권 1개",
    price: 1000,
    rewards: [{ itemType: "MATCHING_TICKET", itemName: "매칭권", quantity: 1 }],
  },
  {
    id: 2,
    name: "옵션권 1개",
    price: 200,
    rewards: [{ itemType: "OPTION_TICKET", itemName: "옵션권", quantity: 1 }],
  },
  {
    id: 10,
    name: "미니 번들",
    price: 2500,
    rewards: [
      { itemType: "OPTION_TICKET", itemName: "옵션권", quantity: 3 },
      { itemType: "OPTION_TICKET", itemName: "보너스 옵션권", quantity: 1 },
    ],
  },
  {
    id: 11,
    name: "실속 번들",
    price: 5000,
    rewards: [
      { itemType: "MATCHING_TICKET", itemName: "매칭권", quantity: 5 },
      { itemType: "OPTION_TICKET", itemName: "옵션권", quantity: 2 },
    ],
  },
  {
    id: 12,
    name: "슈퍼 번들",
    price: 10000,
    rewards: [
      { itemType: "MATCHING_TICKET", itemName: "매칭권", quantity: 10 },
      { itemType: "OPTION_TICKET", itemName: "옵션권", quantity: 10 },
    ],
  },
];

/* ── 이용안내 및 사업자 정보 ── */
export const USAGE_INFO = `충전된 포인트의 소멸시효 기한은 충전 후 5년입니다.
1 포인트는 1원입니다.
충전한 포인트로 서비스를 이용할 수 있습니다.
포인트는 이벤트 포인트 먼저 사용되고, 유상 포인트가 사용됩니다.
이벤트 포인트는 유효기한이 임박한 순으로 먼저 사용됩니다.
유효기간은 포인트 충전내역을 통해 확인하실 수 있습니다.`;

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
