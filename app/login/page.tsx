import { Metadata } from "next";
import ScreenLocalLoginPage from "./_components/ScreenLocalLoginPage";

export const metadata: Metadata = {
  title: "로그인 | COMAtching",
  description: "COMAtching 로그인 페이지",
};

export default function LoginPage() {
  return <ScreenLocalLoginPage />;
}
