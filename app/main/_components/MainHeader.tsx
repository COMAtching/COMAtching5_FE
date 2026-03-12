import Image from "next/image";
import React from "react";
import FloatingButton from "./FloatingButton";

const MainHeader = () => {
  return (
    <header className="mt-2 flex w-full items-center justify-between">
      <Image
        src="/logo/comatching-logo.svg"
        alt="Comatching"
        width={140}
        height={32}
        priority
      />
      <FloatingButton />
    </header>
  );
};

export default MainHeader;
