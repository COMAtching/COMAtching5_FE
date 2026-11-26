// Register only on authenticated screens. Public pages must never prompt or trigger an authentication redirect.
const routes = [
  "/main",
  "/mypage",
  "/matching",
  "/matching-list",
  "/matching-result",
  "/chat",
  "/chat-list",
  "/roulette",
  "/adminpage/main",
  "/adminpage/dashboard",
  "/adminpage/users",
  "/adminpage/products",
  "/adminpage/gift-cards",
  "/adminpage/operations",
  "/adminpage/stats",
  "/adminpage/notices",
];

export function isPushRoute(pathname: string) {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );
}

const referencePattern = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i;

export function chatPushPath(reference?: string) {
  return reference && referencePattern.test(reference)
    ? "/chat-list#push=" + reference
    : "/chat-list";
}

export function chatPushReference(hash: string) {
  const ref = new URLSearchParams(hash.slice(1)).get("push");
  return ref && referencePattern.test(ref) ? ref : null;
}
