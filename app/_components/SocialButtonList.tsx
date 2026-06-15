import Image from "next/image";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type SocialButtonProps = React.ComponentProps<typeof Button> & {
  children?: React.ReactNode;
};

export function KakaoLoginButton({
  children = "카카오로 시작하기",
  ...props
}: SocialButtonProps) {
  /* 원본: Button에 onClick이 없고 단순히 props를 전파했습니다.
    <Button
      {...props}
      className={cn(
        "typo-20-600 flex w-full items-center gap-6 bg-[#FEE500] text-black",
        props.className,
      )}
    >
  변경: 클릭을 차단하고 알림을 표시합니다. */

  return (
    <Button
      {...props}
      className={cn(
        "typo-20-600 flex w-full items-center gap-6 bg-[#FEE500] text-black",
        props.className,
      )}
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
  /* 원본: Button에 onClick이 없고 단순히 props를 전파했습니다.
    <Button
      {...props}
      className={cn(
        "typo-20-600 flex w-full items-center gap-6 border bg-white text-[#797479]",
        props.className,
      )}
    >
  변경: 클릭을 차단하고 알림을 표시합니다. */

  return (
    <Button
      {...props}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        alert("코매칭 서비스는 23일부로 종료되었습니다");
      }}
      className={cn(
        "typo-20-600 flex w-full items-center gap-6 border bg-white text-[#797479]",
        props.className,
      )}
    >
      <Image src="/sns/google.svg" alt="구글 로그인" width={20} height={20} />
      {children}
    </Button>
  );
}
