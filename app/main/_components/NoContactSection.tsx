import Image from "next/image";
import React from "react";

const NoContactSection = () => {
  return (
    <section className="flex h-[29.56vh] w-full flex-col items-center justify-center gap-4 rounded-[24px] border border-white/30 bg-white/50">
      <Image src="/main/no-contact.png" alt="" width={79} height={48} />
      <span className="typo-16-400 text-center leading-none text-gray-600">
        아직 매칭된 상대가 없어요.
        <br />
        나와 딱 맞는 이성친구를 만들어봐요!
      </span>
    </section>
  );
};

export default NoContactSection;
