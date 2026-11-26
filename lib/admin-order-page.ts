export const adminOrderPageKey = (page: number) =>
  ["adminOrders", page] as const;

export const adminOrderPagePath = (page: number) =>
  `/api/v1/admin/payment/requests?page=${page}&size=20&sort=requestedAt,desc&sort=id,desc`;
