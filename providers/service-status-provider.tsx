"use client";

import React, { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";

const ServiceStatusContext = createContext<boolean>(false);

export function ServiceStatusProvider({
  children,
  initialMaintenanceMode,
}: {
  children: React.ReactNode;
  initialMaintenanceMode: boolean;
}) {
  const { data: isMaintenance } = useQuery({
    queryKey: ["maintenance-status"],
    queryFn: async () => {
      const res = await fetch("https://api.your-backend.com/status", {
        cache: "no-store",
      });
      const data = await res.json();
      return data.maintenance;
    },
    initialData: initialMaintenanceMode,
    refetchInterval: 30 * 1000,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 20,
  });

  return (
    <ServiceStatusContext.Provider value={isMaintenance ?? false}>
      {children}
    </ServiceStatusContext.Provider>
  );
}

export function useServiceStatus() {
  return useContext(ServiceStatusContext);
}
