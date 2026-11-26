// Install before Firebase Messaging, which automatically displays notification payloads.
self.installComatchingPushPrivacy = function (senderId) {
  function legacy(payload) {
    if (!payload || (payload.from && String(payload.from) !== senderId))
      return false;
    if (payload.from && payload.notification) return true;
    const data = payload.data;
    return (
      (typeof data?.roomId === "string" &&
        typeof data.senderNickname === "string" &&
        typeof data.content === "string") ||
      (data?.type === "ITEMS_GRANTED" && typeof data.orderId === "string")
    );
  }

  function legacyDisplayed(notification) {
    const data = notification.data;
    return (
      legacy(data?.FCM_MSG) ||
      (typeof data?.roomId === "string" &&
        notification.tag === "comatching-room-" + data.roomId)
    );
  }

  self.addEventListener("push", (event) => {
    let payload;
    try {
      payload = event.data?.json();
    } catch {
      return;
    }
    if (legacy(payload)) event.stopImmediatePropagation();
  });

  // Remove sensitive notifications already shown by the preceding worker, including Firebase's wrapper.
  self.addEventListener("activate", (event) => {
    event.waitUntil(
      self.registration
        .getNotifications()
        .then((notifications) => {
          for (const notification of notifications) {
            if (legacyDisplayed(notification)) notification.close();
          }
        })
        .catch(() => {}),
    );
  });

  self.addEventListener("notificationclick", (event) => {
    const data = event.notification.data;
    const old = data?.FCM_MSG;
    if (!legacyDisplayed(event.notification) && data?.comatchingPush !== true)
      return;
    event.stopImmediatePropagation();
    event.notification.close();
    const grant = old ? old.data?.type === "ITEMS_GRANTED" : data.grant;
    const path = grant ? "/main" : "/chat-list";
    event.waitUntil(
      self.clients
        .matchAll({ type: "window", includeUncontrolled: true })
        .then(async (windows) => {
          const existing = windows.find(
            (client) => new URL(client.url).origin === self.location.origin,
          );
          if (!existing) return self.clients.openWindow(path);
          const navigated = await existing.navigate(path);
          return navigated?.focus();
        }),
    );
  });
};
