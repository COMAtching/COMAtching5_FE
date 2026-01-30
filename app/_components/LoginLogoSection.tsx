import Image from "next/image";

export default function ScreenLoginLogoSection() {
  return (
    <section className="mt-[13.3vh] flex w-full flex-col items-start gap-3">
      <Image
        src="/logo/comatching-logo.svg"
        alt="comatching-logo"
        width={96}
        height={16}
      />
      <div className="typo-26-700 text-color-text-black">
        반갑습니다
        <br />
        코매칭이라면 당신은
        <br />
        이미 커플입니다
      </div>
    </section>
  );
}
