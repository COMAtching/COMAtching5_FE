import React from "react";
import MainHeader from "./MainHeader";
import MyCoinSection from "./MyCoinSection";
import NoContactSection from "./NoContactSection";
import { MatchingButton } from "./FooterButtonList";

const ScreenMainPage = () => {
  return (
    <section className="flex flex-col items-center gap-4 px-4">
      <MainHeader />
      <MyCoinSection />
      <NoContactSection />
      <MatchingButton />
    </section>
  );
};

export default ScreenMainPage;
