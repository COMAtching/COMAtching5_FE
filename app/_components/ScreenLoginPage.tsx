import ScreenLoginLogoSection from "./LoginLogoSection";
import ScreenLoginActionSection from "./LoginActionSection";

export default function ScreenLoginPage() {
  return (
    <main className="login-start flex flex-col items-center justify-between px-4">
      <ScreenLoginLogoSection />
      <ScreenLoginActionSection />
    </main>
  );
}
