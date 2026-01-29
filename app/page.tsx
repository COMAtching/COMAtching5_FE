import Blur from "@/components/common/Blur";
import Button from "@/components/ui/Button";
import Image from "next/image";
import BubbleDiv from "./_components/BubbleDiv";

export default function Home() {
  return (
    <main className="flex flex-col items-center px-4">
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
      <section className="flex flex-col items-center">
        <BubbleDiv />
        <Button className="mt-8" bgColor="bg-[#FEE500]">
          코매칭 시작하기
        </Button>
      </section>
    </main>
  );
}
