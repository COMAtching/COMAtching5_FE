import MemberModerationNotice from "@/components/common/MemberModerationNotice";

export default function RestrictedLoginPage() {
  return (
    <main>
      <MemberModerationNotice kind="suspension" />
    </main>
  );
}
