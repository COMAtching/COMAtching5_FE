"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePurchaseSessionBoundary } from "@/hooks/usePurchaseOrders";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 0,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  usePurchaseSessionBoundary(queryClient);
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
