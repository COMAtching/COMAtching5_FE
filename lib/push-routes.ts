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
