import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

interface Item {
  itemId: number;
  itemType: string;
  quantity: number;
  expiredAt: string;
}

export interface ItemsResponse {
  code: string;
  status: number;
  message: string;
  data: {
    items: {
      content: Item[];
      currentPage: number;
      size: number;
      totalElements: number;
      totalPages: number;
      hasNext: boolean;
      hasPrevious: boolean;
    };
    matchingTicketCount: number;
    optionTicketCount: number;
  };
}

export const fetchItems = async (): Promise<ItemsResponse> => {
  const { data } = await api.get<ItemsResponse>("/api/items");
  return data;
};

export const useItems = () => {
  return useQuery({
    queryKey: ["items"],
    queryFn: fetchItems,
    staleTime: Infinity, // 충전/소모 전까지는 데이터가 변하지 않으므로 무한정 캐싱
    gcTime: 1000 * 60 * 60, // 메모리에서 1시간 동안 유지
  });
};
