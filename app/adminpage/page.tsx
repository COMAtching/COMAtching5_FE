import AdminLoginForm from "./_components/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-[calc(100dvh-3rem)] items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* 헤더 */}
        <div className="mb-10 text-center">
          <div className="mb-3 inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff4d61] to-[#ff775e]">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <span className="text-admin-ink text-2xl font-bold tracking-tight">
              COMAtching
            </span>
          </div>
          <p className="text-admin-secondary text-sm font-medium">
            관리자 콘솔에 로그인하세요
          </p>
        </div>

        {/* 로그인 카드 */}
        <div className="border-admin-edge bg-admin-panel/80 rounded-2xl border p-8 shadow-2xl backdrop-blur-sm">
          <AdminLoginForm />
        </div>

        <p className="text-admin-muted mt-6 text-center text-xs">
          관리자 계정이 필요하신 경우 시스템 관리자에게 문의하세요
        </p>
      </div>
    </main>
  );
}
