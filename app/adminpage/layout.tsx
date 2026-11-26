import { cookies } from "next/headers";
import AdminFrame from "./_components/AdminFrame";
import { adminThemeCookie } from "./theme";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const saved = (await cookies()).get(adminThemeCookie)?.value;
  return (
    <AdminFrame initialTheme={saved === "dark" ? "dark" : "light"}>
      {children}
    </AdminFrame>
  );
}
