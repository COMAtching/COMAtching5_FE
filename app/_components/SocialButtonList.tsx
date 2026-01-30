import Image from "next/image";
import Button from "@/components/ui/Button";

type SocialButtonProps = React.ComponentProps<typeof Button> & {
  children?: React.ReactNode;
};

export function KakaoLoginButton({
  children = "카카오로 시작하기",
  ...props
}: SocialButtonProps) {
  return (
    <Button
      {...props}
      className={`typo-20-600 flex w-full items-center gap-6 bg-[#FEE500] text-black ${props.className || ""}`}
    >
      <Image
        src="/sns/kakao.svg"
        alt="카카오 로그인"
        width={22.73}
        height={21}
      />
      {children}
    </Button>
  );
}

export function GoogleLoginButton({
  children = "구글로 시작하기",
  ...props
}: SocialButtonProps) {
  return (
    <Button
      {...props}
      className={`typo-20-600 flex w-full items-center gap-6 border bg-white text-[#797479] ${props.className || ""}`}
    >
      <Image src="/sns/google.svg" alt="구글 로그인" width={20} height={20} />
      {children}
    </Button>
  );
}
