"use client";

import React, { useState, useEffect } from "react";
import { AdminHeader } from "../../_components/AdminHeader";
import {
  AdminMyPageMain,
  MasterManageComponent,
  OperatorManageComponent,
  AdminTeamManage,
} from "../../_components/ManagementComponents";
import { useAdminInfo } from "@/hooks/useAdminAuth";
import { useRouter, useSearchParams } from "next/navigation";
import AdminNotAllowed from "../../_components/AdminNotAllowed";

export default function ScreenAdminMyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const [adminSelect, setAdminSelect] = useState(tab || "Main");
  const { data: adminResponse, isLoading } = useAdminInfo();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f4f4]">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-black"></div>
      </div>
    );
  }

  const adminData = adminResponse?.data;

  if (!adminData) return null;

  // Handle specific roles
  if (adminData.role === "ROLE_SEMI_OPERATOR") {
    return (
      <div className="min-h-screen bg-[#f4f4f4]">
        <AdminHeader
          setAdminSelect={setAdminSelect}
          adminSelect={adminSelect}
          university={adminData.university}
          role={adminData.role}
          nickname={adminData.nickname}
        />
        <AdminNotAllowed />
      </div>
    );
  }

  if (adminData.role === "ROLE_SEMI_ADMIN") {
    router.replace("/adminpage/webmail-check");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      <AdminHeader
        setAdminSelect={setAdminSelect}
        adminSelect={adminSelect}
        university={adminData.university}
        role={adminData.role}
        nickname={adminData.nickname}
      />

      <main className="flex flex-col items-center gap-4 p-6 md:px-[max(5vw,20px)]">
        {adminSelect === "Main" && <AdminMyPageMain adminData={adminData} />}

        {adminSelect === "가입자관리" && (
          <div className="w-full">
            {adminData.role === "ROLE_OPERATOR" && <OperatorManageComponent />}
            {adminData.role === "ROLE_ADMIN" && <MasterManageComponent />}
          </div>
        )}

        {adminSelect === "팀관리" && <AdminTeamManage />}
      </main>
    </div>
  );
}
