"use client";

import React, { useState } from 'react';
import { AdminRegisterHeader } from '../_components/AdminHeader';
import { useRouter } from 'next/navigation';
import { useAdminRegister } from '@/hooks/useAdminAuth';

const InputComponent = ({ name, title, placeholder, type, options, value, onChange }: any) => {
    return (
        <div className="flex flex-col gap-2 justify-center">
            <div className="text-black text-xl font-semibold flex items-center h-6 font-sans">
                {title}
            </div>
            {options ? (
                <select 
                    name={name} 
                    value={value} 
                    onChange={onChange}
                    className="font-sans border-none border-b border-[#b3b3b3] outline-none p-[13.5px_8px] text-[18px] text-[#b3b3b3] bg-transparent cursor-pointer backdrop-blur-[50px] focus:text-black"
                >
                    <option value="" disabled hidden>{placeholder}</option>
                    {options.map((option: string, idx: number) => (
                        <option key={idx} value={option} className="text-[18px] bg-[#f4f4f4] font-semibold text-[#4d4d4d] text-center">
                            {option}
                        </option>
                    ))}
                </select>
            ) : (
                <input 
                    name={name} 
                    type={type} 
                    placeholder={placeholder} 
                    value={value} 
                    onChange={onChange} 
                    className="font-sans border-none border-b border-[#b3b3b3] outline-none p-[14.5px_8px] text-base text-black h-12 w-full placeholder:text-[#b3b3b3] placeholder:font-semibold"
                />
            )}
        </div>
    );
};

export default function AdminRegisterPage() {
    const router = useRouter();
    const registerMutation = useAdminRegister();
    
    const [formData, setFormData] = useState({
        accountId: "",
        password: "",
        confirmPassword: "",
        schoolEmail: "",
        nickname: "",
        university: "",
        role:"",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        if (e) e.preventDefault();

        const requiredFields = [
            "accountId",
            "password",
            "confirmPassword",
            "schoolEmail",
            "nickname",
            "university",
            "role"
        ];
        
        for(const field of requiredFields){
            if(!formData[field as keyof typeof formData] || formData[field as keyof typeof formData].trim() === ""){
                alert(`${field} 입력이 누락되었습니다.`);
                return;
            }
        }

        if(formData.password !== formData.confirmPassword){
            alert("비밀번호가 다릅니다. 다시 입력해주세요.");
            return ;
        }

        let roleToSend = "";
        if(formData.role === "관리자"){
            roleToSend = "ROLE_SEMI_ADMIN";
        } else if(formData.role === "오퍼레이터"){
            roleToSend = "ROLE_SEMI_OPERATOR";
        }

        const requestBody = {
            accountId: formData.accountId,
            password: formData.password,
            schoolEmail: formData.schoolEmail,
            nickname: formData.nickname,
            university: formData.university,
            role: roleToSend
        };

        try {
            const data = await registerMutation.mutateAsync(requestBody);
            
            if(data.status === 200){
                if(formData.role === "관리자"){
                    alert("회원가입이 완료되었습니다.");
                    router.push("/adminpage");
                } else if(formData.role === "오퍼레이터"){
                    alert("오퍼레이터 가입이 완료되었습니다. 관리자의 승인이 필요합니다.");
                    router.push("/adminpage");
                }
            } else if(data.status === 400 && formData.role === "관리자" ) {
                alert("이미 해당 학교에 최고 관리자가 존재합니다.");
            } else if(data.status === 400 && formData.role === "오퍼레이터"){
                alert("중복된 계정의 사용자가 존재합니다.")
            } else {
                alert(`회원가입 실패: ${data.message || '에러가 발생했습니다.'}`);
            }
        } catch(error) {
            console.error("회원 가입 요청 중 에러 발생", error);
            alert("회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.");
        }
    };

    const inputFields = [
        { name:"accountId", title: "아이디", placeholder: "아이디를 입력해주세요.", type: "text" },
        { name:"password", title: "비밀번호", placeholder: "비밀번호를 입력해주세요.", type: "password" },
        { name:"confirmPassword", title: "비밀번호 확인", placeholder: "비밀번호를 다시 한 번 입력해주세요.", type: "password" },
        { name:"schoolEmail", title: "학교 웹메일", placeholder: "웹메일을 입력해주세요.", type: "email" },
        null, 
        null,
        { name:"nickname", title: "이름", placeholder: "실명을 입력해주세요.", type: "text" },
        {
            name: "university",
            title: "소속 대학",
            placeholder: "선택",
            options: ["가톨릭대학교", "부천대학교", "동양미래대학교", "성공회대학교"]
        },
        {
            name: "role",
            title: "신청 권한",
            placeholder: "선택",
            options: ["관리자","오퍼레이터"]
        }
    ];

    return (
        <div className="flex flex-col w-screen min-h-screen bg-[#f4f4f4]">
            <AdminRegisterHeader />
            <main className="flex-1 flex flex-col items-center gap-4 py-6 px-[max(5vw,20px)] font-sans">
                <div 
                    onClick={handleSubmit} 
                    className="bg-white rounded-[24px] border border-white/30 w-full h-[117px] shadow-[1px_1px_20px_1px_rgba(196,196,196,0.3)] flex flex-col justify-center text-left p-6 gap-2 cursor-pointer hover:shadow-lg transition-shadow"
                >
                    <span className="text-black font-bold text-[32px]">가입하기</span>
                    <span className="text-[#858585] font-medium text-base text-left">
                        관리자의 승인을 받은 이후 오퍼레이터 권한을 사용할 수 있습니다
                    </span>
                </div>

                <div className="bg-white rounded-[24px] border border-white/30 w-full shadow-[1px_1px_20px_1px_rgba(196,196,196,0.3)] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-6 lg:pr-[120px] gap-10 md:gap-x-14">
                    {inputFields.map((field, index) => (
                        field === null
                        ? <div key={index} className="hidden lg:block"></div>
                        : <InputComponent
                            key={index}
                            title={field.title}
                            placeholder={field.placeholder}
                            type={field.type}
                            name={field.name}
                            options={field.options}
                            onChange={handleChange}
                            value={(formData as any)[field.name]}
                          />
                    ))}
                </div>
            </main>
        </div>
    );
};
