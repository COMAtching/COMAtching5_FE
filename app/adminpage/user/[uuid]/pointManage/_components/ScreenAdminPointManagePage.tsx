"use client";

import React, { useState, useEffect } from "react";
import { MinusCircle, PlusCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { AdminHeader } from "../../../../_components/AdminHeader";
import { useAdminInfo } from "@/hooks/useAdminAuth";
import { useUserDetail, useAdjustPoint } from "@/hooks/useAdminManagement";

export default function ScreenAdminPointManagePage() {
  const { uuid } = useParams();
  const [adminSelect, setAdminSelect] = useState("가입자관리");
  const [pointsInput, setPointsInput] = useState("");
  const [reason, setReason] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [prevPoint, setPrevPoint] = useState(0);

  const { data: adminResponse } = useAdminInfo();
  const { data: userResponse, refetch: refetchUser } = useUserDetail(
    uuid as string,
  );
  const adjustPointMutation = useAdjustPoint();

  const adminData = adminResponse?.data;
  const userData = userResponse?.data;

  const adjustedPoints = pointsInput === "" ? 0 : Number(pointsInput);
  const totalPoints = (userData?.point || 0) + adjustedPoints;
  const isActive = adjustedPoints !== 0;

  const handleIncrease = () => {
    const newVal = Number(pointsInput) + 500;
    if (newVal <= 30000) setPointsInput(newVal.toString());
  };

  const handleDecrease = () => {
    const newVal = Number(pointsInput) - 500;
    if (newVal >= -30000) setPointsInput(newVal.toString());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^[-]?\d*$/.test(value)) {
      setPointsInput(value);
    }
  };

  const handleSubmit = () => {
    if (reason.length < 5 || adjustedPoints === 0) {
      alert("조정할 포인트가 0이 아니고 사유가 5자 이상이어야 합니다.");
      return;
    }
    if (adjustedPoints > 30000 || adjustedPoints < -30000) {
      alert("포인트는 최대 30000까지 조절 가능합니다.");
      return;
    }
    if (totalPoints < 0) {
      alert("포인트를 음수로 조정할 수 없습니다.");
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmAdjust = async () => {
    try {
      if (userData) setPrevPoint(userData.point);
      await adjustPointMutation.mutateAsync({
        uuid: uuid as string,
        point: adjustedPoints,
        reason: reason,
      });
      setShowConfirmModal(false);
      setShowSuccessModal(true);
      await refetchUser();
      setPointsInput("");
      setReason("");
    } catch (error) {
      alert("포인트 조정에 실패했습니다.");
    }
  };

  if (!userData) return null;

  return (
    <div className="min-h-screen bg-[#f4f4f4] font-sans">
      <AdminHeader
        setAdminSelect={setAdminSelect}
        adminSelect={adminSelect}
        university={adminData?.university}
        role={adminData?.role}
        nickname={adminData?.nickname}
      />

      <main className="flex flex-col items-center gap-6 p-6 md:px-[max(5vw,20px)]">
        <div className="flex w-full flex-col gap-6 rounded-[24px] border border-white/30 bg-white p-6 shadow-[1px_1px_20px_rgba(196,196,196,0.3)]">
          <div className="border-none text-[32px] font-bold text-black">
            포인트 조정
          </div>
          <div className="text-base font-medium text-[#858585]">
            오류 및 패널티 관련 포인트 조정 기능. 포인트는 최대 한 번에
            30000P까지 조정 가능합니다.
          </div>

          <div className="flex items-center">
            <span className="text-2xl font-medium text-gray-500">
              Nickname :
            </span>
            <span className="ml-2 text-2xl font-semibold text-black">
              {userData.username}
            </span>
          </div>

          <div className="text-2xl font-medium text-black">
            Available Points : {userData.point}P
          </div>

          <div className="flex items-center gap-4 text-2xl font-medium">
            <span>포인트 조정 :</span>
            <MinusCircle
              size={36}
              className="cursor-pointer text-gray-400 transition-colors hover:text-black"
              onClick={handleDecrease}
            />
            <input
              type="text"
              value={pointsInput}
              onChange={handleInputChange}
              placeholder="포인트 입력"
              className={`w-40 border-b border-[#999] bg-transparent text-center text-2xl font-semibold outline-none ${isActive ? (adjustedPoints > 0 ? "text-[#ff7752]" : "text-[#1a1a1a]") : "text-[#808080]"}`}
            />
            <PlusCircle
              size={36}
              className="cursor-pointer text-gray-400 transition-colors hover:text-black"
              onClick={handleIncrease}
            />
          </div>

          <div className="text-2xl font-medium">
            조정 후 포인트 : <span className="font-bold">{totalPoints}</span>
          </div>
        </div>

        <div className="flex w-full flex-col gap-4 rounded-[24px] border border-white/30 bg-white p-6 shadow-[1px_1px_20px_rgba(196,196,196,0.3)]">
          <div className="flex items-end gap-2">
            <div className="border-none text-[32px] font-bold text-black">
              포인트 조정 사유
            </div>
            <div className="text-base font-medium text-[#858585]">
              (5자 이상)
            </div>
          </div>
          <div className="text-xl font-medium text-gray-600">
            모든 조정 사유는 히스토리에 기록되며, 이후 수정 또는 삭제할 수
            없습니다.
          </div>
          <textarea
            className="h-32 w-full resize-none rounded-xl border border-gray-200 p-4 text-lg transition-colors outline-none focus:border-[#ff775e]"
            maxLength={200}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="사유를 입력하세요."
          />
          <button
            disabled={reason.length < 5 || adjustedPoints === 0}
            onClick={handleSubmit}
            className={`h-14 w-full rounded-xl text-xl font-bold text-white transition-all ${reason.length >= 5 && adjustedPoints !== 0 ? "bg-[#ff775e] hover:opacity-90 active:scale-[0.98]" : "cursor-not-allowed bg-gray-300"}`}
          >
            조정
          </button>
        </div>

        {showConfirmModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
            <div className="flex w-[423px] flex-col items-center rounded-[24px] bg-white shadow-lg">
              <div className="flex h-[190px] w-full items-center justify-center border-b border-[#b3b3b3] p-6 text-center text-2xl leading-relaxed text-black">
                정말로 포인트를 조정하시겠습니까? <br />이 작업은
                <br />
                수정 또는 삭제할 수 없습니다.
              </div>
              <div className="flex h-14 w-full border-t border-[#b3b3b3]">
                <div
                  className="flex flex-1 cursor-pointer items-center justify-center border-r border-[#b3b3b3] text-xl font-medium text-[#808080] hover:bg-gray-50"
                  onClick={() => setShowConfirmModal(false)}
                >
                  취소
                </div>
                <div
                  className="flex flex-1 cursor-pointer items-center justify-center text-xl font-medium text-[#ff775e] hover:bg-gray-50"
                  onClick={handleConfirmAdjust}
                >
                  확인
                </div>
              </div>
            </div>
          </div>
        )}

        {showSuccessModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
            <div className="flex w-[423px] flex-col items-center rounded-[24px] bg-white shadow-lg">
              <div className="flex h-[190px] w-full items-center justify-center border-b border-[#b3b3b3] p-6 text-center text-2xl leading-relaxed text-black">
                해당 가입자의 포인트를 <br />
                정상적으로 조정하였습니다.
                <br />
                {prevPoint}P {"->"} {userData.point}P
              </div>
              <div
                className="flex h-14 w-full cursor-pointer items-center justify-center rounded-b-[24px] text-xl font-medium text-[#ff775e] hover:bg-gray-50"
                onClick={() => setShowSuccessModal(false)}
              >
                확인
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
