import { api } from "@/lib/axios";
import { useInfiniteQuery } from "@tanstack/react-query";

export type ItemHistoryType = "CHARGE" | "USE" | "EVENT";
export type ItemType = "MATCHING_TICKET" | "OPTION_TICKET" | "COIN";

export interface ItemHistoryItem {
  historyId: number;
  itemType: ItemType | string;
  historyType: ItemHistoryType | string;
  quantity: number;
  description: string;
  createdAt: string;
}

export interface ItemHistoryPageData {
  content: ItemHistoryItem[];
  currentPage: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ItemHistoryResponse {
  code: string;
  status: number;
  message: string;
  data: ItemHistoryPageData;
}

export interface FetchItemHistoryParams {
  type?: string;
  historyType?: string;
  sort?: string;
  page?: number;
  size?: number;
}

export const fetchItemHistoryPage = async (
  params: FetchItemHistoryParams,
): Promise<ItemHistoryResponse> => {
  const { data } = await api.get<ItemHistoryResponse>("/api/items/history", {
    params: {
      page: params.page || 0,
      size: params.size || 20,
      type: params.type,
      historyType: params.historyType,
      sort: params.sort || "createdAt,desc",
    },
  });
  return data;
};

export const useItemHistory = (
  params: Omit<FetchItemHistoryParams, "page"> = {},
) => {
  return useInfiniteQuery({
    queryKey: ["itemHistory", params],
    queryFn: ({ pageParam }) =>
      fetchItemHistoryPage({ ...params, page: pageParam as number }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage?.data?.hasNext
        ? lastPage.data.currentPage + 1
        : undefined;
    },
  });
};
