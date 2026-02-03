import React from "react";
import { BackButton } from "./BackButton";
import LocalLoginIntro from "./LocalLoginIntro";

const ScreenLocalLoginPage = () => {
  return (
    <main className="flex flex-col items-start px-4">
      <BackButton />
      <LocalLoginIntro />
    </main>
  );
};

export default ScreenLocalLoginPage;
