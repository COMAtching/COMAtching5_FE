import { isAxiosError, serverApi } from "@/lib/server-api";

type ItemsResponse = {
  data: {
    matchingTicketCount: number;
    optionTicketCount: number;
  };
};

export type ItemCountSummary = {
  matchingTicketCount: number;
  optionTicketCount: number;
};

export async function getItemCountSummary(): Promise<ItemCountSummary | null> {
  try {
    const res = await serverApi.get<ItemsResponse>({ path: "/api/items" });

    return {
      matchingTicketCount: res.data.data.matchingTicketCount,
      optionTicketCount: res.data.data.optionTicketCount,
    };
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("[getItemCountSummary] API Error", {
        status: error.response?.status,
        message: error.response?.data?.message,
      });
      return null;
    }

    console.error("[getItemCountSummary] Unexpected Error", error);
    return null;
  }
}
