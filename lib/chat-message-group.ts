type GroupableMessage = { senderId: number; type: string; createdAt: string };

export function sameChatMinute(a?: GroupableMessage, b?: GroupableMessage) {
  if (
    !a ||
    !b ||
    a.senderId !== b.senderId ||
    a.type === "SYSTEM" ||
    b.type === "SYSTEM"
  )
    return false;
  return (
    Math.floor(Date.parse(a.createdAt) / 60_000) ===
    Math.floor(Date.parse(b.createdAt) / 60_000)
  );
}
