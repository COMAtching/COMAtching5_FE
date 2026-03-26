/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Coins } from "lucide-react";
import { useParams } from "next/navigation";
import { AdminHeader } from "../../../../_components/AdminHeader";
import { useAdminInfo } from "@/hooks/useAdminAuth";
import { usePaymentHistory } from "@/hooks/useAdminManagement";

const PaymentHistoryComponent = ({
  cancelReason,
  orderId,
  point,
  price,
  approvedAt,
}: any) => {
  const getStatusStyle = (reason: string) => {
    switch (reason) {
      case "결제 성공":
        return { bg: "bg-[#3fea3a]", text: "text-[#3fea3a]" };
      case "관리자에 의해 취소됨":
        return { bg: "bg-[#ea3a3a]", text: "text-[#ea3a3a]" };
      case "결제 취소":
        return { bg: "bg-[#ff9800]", text: "text-[#ff9800]" };
      default:
        return { bg: "bg-gray-400", text: "text-gray-400" };
    }
  };

  const statusStyle = getStatusStyle(cancelReason);

  return (
    <div className="flex flex-col border-b border-gray-200 py-4 font-sans">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${statusStyle.bg}`} />
            <span className={`text-lg font-bold ${statusStyle.text}`}>
              {cancelReason}
            </span>
          </div>
          <span className="text-lg text-gray-500">{approvedAt}</span>
        </div>
        <span className="text-lg text-gray-500">주문번호: {orderId}</span>
      </div>

      <div className="flex items-center gap-10">
        <div className="flex items-center">
          <Coins size={32} className="mr-2 fill-yellow-500 text-yellow-500" />
          <span className="text-xl font-medium text-gray-600">결제액 :</span>
          <span className="ml-2 w-[100px] text-center text-xl font-bold text-black">
            {price}
          </span>
          <span className="ml-1 text-xl font-medium text-black">원</span>
        </div>
        <div className="flex items-center">
          <span className="text-xl font-medium text-gray-600">
            충전 포인트 :
          </span>
          <span className="ml-2 w-[120px] text-center text-xl font-bold text-black">
            {point}
          </span>
          <span className="ml-1 text-xl font-medium text-black">P</span>
        </div>
      </div>
    </div>
  );
};

export default function ScreenAdminPaymentHistoryPage() {
  const { uuid } = useParams();
  const [adminSelect, setAdminSelect] = useState("가입자관리");

  const { data: adminResponse } = useAdminInfo();
  const adminData = adminResponse?.data;

  const { data: historyResponse, isLoading } = usePaymentHistory(
    uuid as string,
  );
  const paymentHistory = historyResponse?.data || [];

  return (
    <div className="min-h-screen bg-[#f4f4f4] font-sans">
      <AdminHeader
        setAdminSelect={setAdminSelect}
        adminSelect={adminSelect}
        university={adminData?.university}
        role={adminData?.role}
        nickname={adminData?.nickname}
      />

      <main className="flex flex-col items-center gap-4 p-6 md:px-[max(5vw,20px)]">
        <div className="flex min-h-[400px] w-full flex-col gap-2 rounded-[24px] border border-white/30 bg-white p-6 shadow-[1px_1px_20px_rgba(196,196,196,0.3)]">
          <div className="border-none text-[32px] font-bold text-black">
            결제내역
          </div>
          <div className="mb-4 text-base font-medium text-[#858585]">
            최신순 정렬
          </div>

          <div className="flex flex-col gap-4">
            {isLoading ? (
              <div className="flex justify-center p-20">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#ff775e]"></div>
              </div>
            ) : paymentHistory.length > 0 ? (
              paymentHistory.map((data: any, i: number) => (
                <PaymentHistoryComponent key={i} {...data} />
              ))
            ) : (
              <div className="py-20 text-center text-xl font-medium text-gray-500">
                결제 내역이 없습니다.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
