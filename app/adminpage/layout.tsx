"use client";

import { useAdminInfo } from "@/hooks/useAdminAuth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: adminInfo, isLoading, isError } = useAdminInfo();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If we are not on the login or register page and not loading, check for auth
    if (!isLoading && !adminInfo && pathname !== "/adminpage" && pathname !== "/adminpage/register") {
      router.push("/adminpage");
    }
  }, [adminInfo, isLoading, pathname, router]);

  // Optionally show a loading spinner while checking auth
  if (isLoading && pathname !== "/adminpage" && pathname !== "/adminpage/register") {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#f4f4f4]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return <>{children}</>;
}
