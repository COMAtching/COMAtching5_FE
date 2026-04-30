import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
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
  return useQuery<
    RequestStatusResponse,
    AxiosError<{ code: string; message: string }>
  >({
    queryKey: ["requestStatus"],
    queryFn: fetchRequestStatus,
    staleTime: 1000 * 60, // 1 minute
  });
};
