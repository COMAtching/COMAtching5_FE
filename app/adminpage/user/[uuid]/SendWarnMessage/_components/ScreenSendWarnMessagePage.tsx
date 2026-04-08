"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { AdminHeader } from "../../../../_components/AdminHeader";
import { useAdminInfo } from "@/hooks/useAdminAuth";
import { useUserDetail, useSendWarnMessage } from "@/hooks/useAdminManagement";

const warningMenu = [
  "욕설 및 수치심을 주는 발언",
  "특정인에 대한 비하 및 조롱",
  "명예훼손, 사생활 노출, 신상 털기",
  "협박 및 폭력성 발언, 인총자별",
  "불법성(마약 등) 단어 언급",
  "부적절한 미팅장소 제시",
  "금전적 거래",
  "불순한 의도의 다계정 생성",
  "타인 명의 계정 이용 및 거래",
  "스팸 및 광고 활동",
  "단순 팔로워 늘리기 목적 및 홍보",
  "포교 활동",
  "조건 만남 및 성매매",
  "스토킹",
  "허위 프로필 및 사기, 관리자 사칭",
];

export default function ScreenSendWarnMessagePage() {
  const { uuid } = useParams();
  const router = useRouter();
  const [adminSelect, setAdminSelect] = useState("가입자관리");
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { data: adminResponse } = useAdminInfo();
  const { data: userResponse } = useUserDetail(uuid as string);
  const sendWarnMutation = useSendWarnMessage();

  const adminData = adminResponse?.data;
  const userData = userResponse?.data;

  const handleSubmit = () => {
    if (!selectedReason && !customReason) {
      alert("경고 사유를 선택하거나 직접 입력해주세요.");
      return;
    }
    setShowConfirm(true);
  };

  const handleSend = async () => {
    const finalReason = [selectedReason, customReason]
      .filter(Boolean)
      .join(", ");
    try {
      await sendWarnMutation.mutateAsync({
        uuid: uuid as string,
        message: finalReason,
      });
      alert("경고 메시지가 전송되었습니다.");
      router.push(`/adminpage/user/${uuid}`);
    } catch (error) {
      alert("전송 중 오류가 발생했습니다.");
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

      <main className="flex flex-col items-center gap-10 p-6 md:px-[max(5vw,20px)]">
        <div className="flex h-[226px] w-full flex-col justify-center gap-6 rounded-[24px] border border-white/30 bg-white p-6 shadow-[1px_1px_20px_rgba(196,196,196,0.3)]">
          <div className="border-none text-[32px] font-bold text-black">
            가입자 상세정보
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center">
              <span className="text-2xl font-medium text-[#828282]">
                Nickname :
              </span>
              <span className="ml-2 text-2xl font-semibold text-black">
                {userData.username}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-2xl font-medium text-[#828282]">
                E-mail :
              </span>
              <span className="ml-2 text-2xl font-bold text-[#828282]">
                {userData.email}
              </span>
            </div>
          </div>
        </div>

        {!showConfirm ? (
          <div className="flex w-full flex-col gap-4 rounded-[24px] border border-white/30 bg-white p-6 shadow-[1px_1px_20px_rgba(196,196,196,0.3)]">
            <div className="border-none text-[32px] font-bold text-black">
              전송할 경고 사유
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="relative w-full md:w-[400px]">
                <div
                  className="flex cursor-pointer items-center justify-between border-b border-[#b3b3b3] bg-transparent p-[13.5px_8px] text-[18px] font-semibold text-black"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {selectedReason || "선택"}
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                  />
                </div>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 z-50 mt-1 max-h-[300px] w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                    {warningMenu.map((reason) => (
                      <div
                        key={reason}
                        className="cursor-pointer p-3 text-lg font-medium hover:bg-gray-100"
                        onClick={() => {
                          setSelectedReason(reason);
                          setIsDropdownOpen(false);
                        }}
                      >
                        {reason}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <span className="text-2xl font-medium text-black">또는</span>

              <input
                type="text"
                placeholder="직접 입력하기"
                className="flex-1 border-b border-[#b3b3b3] p-3 text-[18px] text-black outline-none placeholder:text-[#b3b3b3]"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
              />

              <span className="text-2xl font-medium text-black">(으)로</span>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <span className="text-2xl font-medium text-black">
                해당 가입자에게 경고 메시지를 보냅니다.
              </span>
              <button
                onClick={handleSubmit}
                className="h-12 w-24 rounded-lg bg-[#ff775e] text-xl font-bold text-white transition-all hover:opacity-90 active:scale-95"
              >
                확인
              </button>
            </div>
          </div>
        ) : (
          <div className="flex w-full flex-col gap-4 md:flex-row">
            <div className="flex h-[247px] flex-1 flex-col overflow-hidden rounded-[24px] border border-white/30 bg-white p-0 shadow-[1px_1px_20px_rgba(196,196,196,0.3)]">
              <div className="flex flex-1 items-center justify-center p-6 text-center text-xl leading-relaxed font-medium">
                {userData.username}님.{" "}
                {[selectedReason, customReason].filter(Boolean).join(", ")}{" "}
                (으)로
                <br />
                1번 경고 드립니다.
                <br />- 관리자 안내 -
              </div>
              <div className="flex h-14 border-t border-[#b3b3b3]">
                <button
                  className="flex-1 border-r border-[#b3b3b3] text-xl font-medium text-[#808080] hover:bg-gray-50"
                  onClick={() => setShowConfirm(false)}
                >
                  취소
                </button>
                <button
                  className="flex-1 text-xl font-medium text-[#ff775e] hover:bg-gray-50"
                  onClick={handleSend}
                >
                  전송
                </button>
              </div>
            </div>

            <div className="flex h-[247px] flex-1 flex-col justify-center gap-4 rounded-[24px] border border-white/30 bg-white p-6 shadow-[1px_1px_20px_rgba(196,196,196,0.3)]">
              <div className="text-[32px] leading-none font-bold text-black">
                경고 메시지 미리보기
              </div>
              <div className="text-base font-medium text-[#858585]">
                왼쪽과 같은 형태로 위 가입자에게 경고 메시지가 전송됩니다.
                <br />
                경고 메시지는 신중하게 전송해 주십시오.
                <br />
                이에 동의하십니까?
              </div>
              <div className="flex gap-4">
                <button
                  className="h-12 rounded-lg bg-[#ff775e] px-6 text-xl font-bold text-white transition-all hover:opacity-90 active:scale-95"
                  onClick={() => setShowConfirm(false)}
                >
                  돌아가기
                </button>
                <button
                  className="h-12 rounded-lg bg-[#dd272a] px-6 text-xl font-bold text-white transition-all hover:opacity-90 active:scale-95"
                  onClick={handleSend}
                >
                  전송하기
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
