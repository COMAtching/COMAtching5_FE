import React, { Suspense } from "react";
import ScreenNewPasswordPage from "./_components/ScreenNewPasswordPage";

export const metadata = {
  title: "비밀번호 변경 | COMatching",
  description: "새로운 비밀번호를 설정합니다.",
};

const NewPasswordPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ScreenNewPasswordPage />
    </Suspense>
  );
};

export default NewPasswordPage;
