"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdminLogin, useAdminInfo } from "@/hooks/useAdminAuth";

export default function AdminLoginPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({ accountId: "", password: "" });
  const router = useRouter();
  
  const loginMutation = useAdminLogin();
  const { refetch: fetchAdminInfo } = useAdminInfo();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const data = await loginMutation.mutateAsync(formData);
      
      if (data.status >= 200 && data.status < 300) {
        await fetchAdminInfo();
        router.push("/adminpage/myPage");
      } else {
        alert("로그인 실패: " + (data.message || "알 수 없는 오류"));
      }
    } catch (error: any) {
      console.error("로그인 중 에러 발생:", error);
      alert("로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F4F4F4] font-sans">
      <div className="w-[90%] max-w-[500px] p-6 text-center bg-transparent">
        <div className="flex justify-center mb-4">
          <Image
            src="/logo/admin_page_logo.svg"
            alt="Logo"
            width={500}
            height={69}
            className="w-full h-auto"
          />
        </div>
        <h2 className="text-[48px] font-bold mt-3 mb-5">Partners Page</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
          <input
            type="text"
            name="accountId"
            placeholder="ID입력"
            className="w-[70%] p-[0.9em] border border-gray-300 rounded-[0.8em] shadow-sm text-[18px] outline-none"
            value={formData.accountId}
            onChange={handleChange}
          />
          
          <div className="w-[70%] relative">
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              placeholder="비밀번호 입력"
              className="w-full p-[0.9em] border border-gray-300 rounded-[0.8em] shadow-sm text-[18px] outline-none"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="w-[70%] flex justify-start items-center gap-2 mb-4">
            <label className="flex items-center cursor-pointer select-none text-[#505050]">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={passwordVisible}
                  onChange={togglePasswordVisibility}
                />
                <div className={`w-5 h-5 border border-gray-300 rounded bg-[#f4f4f4] transition-colors ${passwordVisible ? "bg-gray-200" : ""}`}>
                   <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${passwordVisible ? "opacity-100" : "opacity-0"}`}>
                      <div className="w-3 h-1.5 border-l-2 border-b-2 border-black rotate-[-45deg] translate-y-[-1px]"></div>
                    </div>
                </div>
              </div>
              <span className="ml-2 text-sm">비밀번호 보기</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-[80%] p-[0.9em] bg-[#d3d3d3] text-[#727272] rounded-[1em] shadow-sm text-lg font-medium hover:bg-[#b0b0b0] active:bg-[#8a8a8a] transition-colors"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "로그인 중..." : "다음으로"}
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-2 text-[#505050]">
          <div className="flex justify-center gap-3 text-lg">
            <Link href="/adminpage/register" className="hover:text-black transition-colors">
              가입하기
            </Link>
            <span>|</span>
            <Link href="#find-id-password" className="hover:text-black transition-colors">
              ID/비밀번호 찾기
            </Link>
          </div>
          <Link href="#contact" className="mt-2 text-lg hover:text-black transition-colors">
            문의하기
          </Link>
        </div>
      </div>
    </div>
  );
}
