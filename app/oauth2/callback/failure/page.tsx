import Link from "next/link";
import { redirect } from "next/navigation";

export default async function OAuthFailure({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if ((await searchParams).error === "ACCOUNT_LOCKED")
    redirect("/login/restricted");
  return (
    <main className="mx-auto flex min-h-dvh max-w-[430px] flex-col justify-center gap-4 p-6">
      <h1 className="typo-20-700">로그인을 완료하지 못했어요</h1>
      <Link
        href="/"
        className="rounded-2xl bg-white p-4 text-center font-semibold"
      >
        로그인 화면으로
      </Link>
    </main>
  );
}
