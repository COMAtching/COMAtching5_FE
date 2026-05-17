import { api } from "@/lib/axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { AxiosError } from "axios";

export interface RequestStatusResponse {
  code: string;
  status: number;
  message: string;
  data: {
    status: "PENDING" | "NONE";
  };
}

export const fetchRequestStatus = async (): Promise<RequestStatusResponse> => {
  const { data } = await api.get<RequestStatusResponse>(
    "/api/v1/shop/purchase/status",
  );
  return data;
};

export const useRequestStatus = () => {
  const queryClient = useQueryClient();
  const query = useQuery<
    RequestStatusResponse,
    AxiosError<{ code: string; message: string }>
  >({
    queryKey: ["requestStatus"],
    queryFn: fetchRequestStatus,
    staleTime: 1000 * 60, // 1 minute
  });

  const isPurchasePending =
    query.data?.data?.status === "PENDING" ||
    query.error?.response?.data?.code === "GATEWAY-001" ||
    query.error?.response?.data?.code === "GATEWAY-002";

  // 상태가 PENDING에서 NONE으로 변했을 때를 감지하기 위한 ref
  const prevPendingRef = useRef(isPurchasePending);

  useEffect(() => {
    // 이전엔 대기중(true)이었는데, 지금은 대기중이 아님(false) -> 충전 완료됨!
    if (prevPendingRef.current === true && isPurchasePending === false) {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["itemHistory"] });
    }
    prevPendingRef.current = isPurchasePending;
  }, [isPurchasePending, queryClient]);

  return { ...query, isPurchasePending };
};
