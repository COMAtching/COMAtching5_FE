import React, { Suspense } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ScreenNewPasswordPage from "./_components/ScreenNewPasswordPage";

export const metadata = {
  title: "비밀번호 변경 | COMatching",
  description: "새로운 비밀번호를 설정합니다.",
};

const NewPasswordPage = () => {
  return (
    <Suspense
      fallback={
        <LoadingSpinner variant="screen" label="비밀번호 변경 화면 준비 중" />
      }
    >
      <ScreenNewPasswordPage />
    </Suspense>
  );
};

export default NewPasswordPage;
