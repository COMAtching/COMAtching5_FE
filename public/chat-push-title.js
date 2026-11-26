// Used by both the page bundle and the classic Firebase service worker.
/** @param {string} apiBase @param {string | undefined} reference */
async function chatPushTitle(apiBase, reference) {
  const fallback = "새 채팅";
  if (
    typeof reference !== "string" ||
    !/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(reference)
  )
    return fallback;
  try {
    const response = await fetch(
      apiBase + "/api/fcm/chat-links/" + reference + "/sender",
      {
        credentials: "include",
        cache: "no-store",
        redirect: "error",
        signal: AbortSignal.timeout(3000),
      },
    );
    return response.ok ? (await response.text()).trim() || fallback : fallback;
  } catch {
    return fallback;
  }
}

if (typeof module !== "undefined") module.exports = { chatPushTitle };
else self.chatPushTitle = chatPushTitle;
