"use client";

import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { create } from "zustand";

interface ServiceStatusStore {
  isMaintenance: boolean;
  setMaintenance: (value: boolean) => void;
}

export const useServiceStatusStore = create<ServiceStatusStore>((set) => ({
  isMaintenance: false,
  setMaintenance: (value) => set({ isMaintenance: value }),
}));

export function ServiceStatusProvider({
  children,
  initialMaintenanceMode,
}: {
  children: React.ReactNode;
  initialMaintenanceMode: boolean;
}) {
  const setMaintenance = useServiceStatusStore((state) => state.setMaintenance);

  const { data: isMaintenance } = useQuery({
    queryKey: ["maintenance-status"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/status`, {
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

  useEffect(() => {
    setMaintenance(isMaintenance ?? false);
  }, [isMaintenance, setMaintenance]);

  return <>{children}</>;
}

export function useServiceStatus() {
  // Backward-compatible alias for existing call sites.
  return useServiceStatusStore((state) => state.isMaintenance);
}
