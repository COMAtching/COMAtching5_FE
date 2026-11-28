import Link from "next/link";
import MemberModerationNotice from "@/components/common/MemberModerationNotice";

export default function RestrictedLoginPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col justify-center gap-5 p-6">
      <MemberModerationNotice kind="suspension" />
      <Link
        href="/"
        className="bg-button-primary typo-16-600 flex min-h-12 items-center justify-center rounded-2xl text-white"
      >
        로그인 화면으로
      </Link>
    </main>
  );
}
