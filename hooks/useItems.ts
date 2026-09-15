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
    staleTime: 0, // 관리자 승인 등으로 잔여권 개수가 언제 바뀔지 모르므로 화면 전환 시 항상 백그라운드에서 최신화
    gcTime: Infinity, // 메모리에서 삭제하지 않음 → 화면 로딩바 방지
  });
};
