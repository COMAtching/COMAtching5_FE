"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { AdminHeader } from "../../../_components/AdminHeader";
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
  "허위 프로필 및 사기, 관리자 사칭"
];

export default function SendWarnMessagePage() {
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
    const finalReason = [selectedReason, customReason].filter(Boolean).join(", ");
    try {
      await sendWarnMutation.mutateAsync({ uuid: uuid as string, message: finalReason });
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
      
      <main className="p-6 md:px-[max(5vw,20px)] flex flex-col items-center gap-10">
        <div className="bg-white rounded-[24px] border border-white/30 shadow-[1px_1px_20px_rgba(196,196,196,0.3)] w-full h-[226px] p-6 flex flex-col justify-center gap-6">
          <div className="text-[32px] font-bold text-black border-none">가입자 상세정보</div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center">
              <span className="text-[#828282] text-2xl font-medium">Nickname :</span>
              <span className="text-black text-2xl font-semibold ml-2">{userData.username}</span>
            </div>
            <div className="flex items-center">
              <span className="text-[#828282] text-2xl font-medium">E-mail :</span>
              <span className="text-[#828282] text-2xl font-bold ml-2">{userData.email}</span>
            </div>
          </div>
        </div>

        {!showConfirm ? (
          <div className="bg-white rounded-[24px] border border-white/30 shadow-[1px_1px_20px_rgba(196,196,196,0.3)] w-full p-6 flex flex-col gap-4">
            <div className="text-[32px] font-bold text-black border-none">전송할 경고 사유</div>
            
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative w-full md:w-[400px]">
                <div 
                  className="bg-transparent border-b border-[#b3b3b3] p-[13.5px_8px] text-[18px] text-black font-semibold cursor-pointer flex justify-between items-center"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {selectedReason || "선택"}
                  <Image src="/logo/under-triangle.svg" alt="arrow" width={12} height={12} className={isDropdownOpen ? "rotate-180" : ""} />
                </div>
                
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 w-full bg-white border border-gray-200 mt-1 rounded-lg shadow-lg z-50 max-h-[300px] overflow-y-auto">
                    {warningMenu.map((reason) => (
                      <div
                        key={reason}
                        className="p-3 hover:bg-gray-100 cursor-pointer text-lg font-medium"
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

            <div className="flex justify-between items-center mt-6">
              <span className="text-2xl font-medium text-black">해당 가입자에게 경고 메시지를 보냅니다.</span>
              <button 
                onClick={handleSubmit}
                className="w-24 h-12 bg-[#ff775e] text-white text-xl font-bold rounded-lg hover:opacity-90 active:scale-95 transition-all"
              >
                확인
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <div className="bg-white rounded-[24px] border border-white/30 shadow-[1px_1px_20px_rgba(196,196,196,0.3)] flex-1 h-[247px] p-0 overflow-hidden flex flex-col">
              <div className="flex-1 flex items-center justify-center p-6 text-center text-xl font-medium leading-relaxed">
                {userData.username}님. {[selectedReason, customReason].filter(Boolean).join(", ")} (으)로<br />
                1번 경고 드립니다.<br />
                - 관리자 안내 -
              </div>
              <div className="h-14 flex border-t border-[#b3b3b3]">
                <button 
                  className="flex-1 text-[#808080] text-xl font-medium border-r border-[#b3b3b3] hover:bg-gray-50"
                  onClick={() => setShowConfirm(false)}
                >
                  취소
                </button>
                <button 
                  className="flex-1 text-[#ff775e] text-xl font-medium hover:bg-gray-50"
                  onClick={handleSend}
                >
                  전송
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-[24px] border border-white/30 shadow-[1px_1px_20px_rgba(196,196,196,0.3)] flex-1 h-[247px] p-6 flex flex-col justify-center gap-4">
              <div className="text-[32px] font-bold text-black leading-none">경고 메시지 미리보기</div>
              <div className="text-base font-medium text-[#858585]">
                왼쪽과 같은 형태로 위 가입자에게 경고 메시지가 전송됩니다.<br />
                경고 메시지는 신중하게 전송해 주십시오.<br />
                이에 동의하십니까?
              </div>
              <div className="flex gap-4">
                <button 
                  className="h-12 px-6 bg-[#ff775e] text-white text-xl font-bold rounded-lg hover:opacity-90 active:scale-95 transition-all"
                  onClick={() => setShowConfirm(false)}
                >
                  돌아가기
                </button>
                <button 
                  className="h-12 px-6 bg-[#dd272a] text-white text-xl font-bold rounded-lg hover:opacity-90 active:scale-95 transition-all"
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
