import React from "react";
import { BackButton } from "@/components/ui/BackButton";
import LocalLoginIntro from "./LocalLoginIntro";
import { LoginForm } from "./LoginForm";

const ScreenLocalLoginPage = () => {
  return (
    <main className="flex h-dvh flex-col items-start px-4 pt-2 pb-[6.2vh]">
      <BackButton />
      <LocalLoginIntro />
      <LoginForm />
    </main>
  );
};

export default ScreenLocalLoginPage;
