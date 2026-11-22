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
    refetchInterval: ({ state }) =>
      state.data?.data.status === "PENDING" ? 5_000 : false,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: "always",
  });

  const status = query.data?.data.status;
  const previousStatus = useRef(status);

  useEffect(() => {
    if (previousStatus.current === "PENDING" && status === "NONE") {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["itemHistory"] });
    }
    previousStatus.current = status;
  }, [status, queryClient]);

  return { ...query, isPurchasePending: status === "PENDING" };
};
