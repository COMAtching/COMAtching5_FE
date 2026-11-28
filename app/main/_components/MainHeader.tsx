import Image from "next/image";
import React from "react";
import InboxLink from "./InboxLink";
import FloatingButton from "./FloatingButton";
import Link from "next/link";

const MainHeader = () => {
  return (
    <header className="mt-2 flex w-full items-center justify-between">
      <Link
        href="/main"
        className="cursor-pointer transition-opacity hover:opacity-85"
      >
        <Image
          src="/logo/comatching-logo.svg"
          alt="Comatching"
          width={125}
          height={22}
          priority
        />
      </Link>
      <div className="flex items-center gap-1.5">
        <InboxLink />
        <FloatingButton />
      </div>
    </header>
  );
};

export default MainHeader;
