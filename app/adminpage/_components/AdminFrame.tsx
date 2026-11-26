"use client";

import { useState, type ReactNode } from "react";
import { adminThemeCookie, type AdminTheme } from "../theme";

function rememberTheme(value: AdminTheme) {
  document.cookie = `${adminThemeCookie}=${value}; Path=/adminpage; Max-Age=31536000; SameSite=Lax`;
}

export default function AdminFrame({
  initialTheme,
  children,
}: {
  initialTheme: AdminTheme;
  children: ReactNode;
}) {
  const [theme, setTheme] = useState(initialTheme);
  function changeTheme(value: AdminTheme) {
    setTheme(value);
    rememberTheme(value);
  }
  return (
    <div
      className="admin-layout bg-admin-canvas text-admin-ink min-h-dvh w-full"
      data-theme={theme}
    >
      <div className="mx-auto flex max-w-6xl justify-end px-4 pt-3 sm:px-6 lg:px-8">
        <div
          role="group"
          aria-label="화면 테마"
          className="border-admin-edge bg-admin-panel inline-flex gap-0.5 rounded-lg border p-0.5"
        >
          {(["light", "dark"] as const).map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={theme === value}
              onClick={() => changeTheme(value)}
              className="text-admin-secondary aria-pressed:bg-admin-ink aria-pressed:text-admin-panel rounded-md px-3 py-1.5 text-xs font-medium"
            >
              {value === "light" ? "라이트" : "다크"}
            </button>
          ))}
        </div>
      </div>
      {children}
    </div>
  );
}
