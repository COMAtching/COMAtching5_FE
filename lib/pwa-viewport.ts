// iOS can finish dismissing the keyboard after focusout and its first resize event.
export function isIosWebApp() {
  return (
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function watchPwaKeyboard(shell: HTMLElement) {
  const viewport = window.visualViewport;
  if (!isIosWebApp() || !viewport) return;
  const root = document.documentElement;
  let frame = 0;
  let settle = 0;
  let wasEditing = false;

  function update() {
    if (!viewport || viewport.scale !== 1) return;
    const active = document.activeElement;
    const editing =
      active instanceof HTMLElement &&
      (active.isContentEditable ||
        active.matches(
          "textarea, input:not([readonly]):not([type=file]):not([type=checkbox]):not([type=radio]):not([type=button]):not([type=submit]):not([type=range]):not([type=color])",
        ));
    const keyboardOpen = editing && root.clientHeight - viewport.height > 8;
    if (keyboardOpen) {
      root.dataset.pwaKeyboard = "open";
      root.style.setProperty("--chat-viewport-height", viewport.height + "px");
      root.style.setProperty("--chat-viewport-top", viewport.offsetTop + "px");
    } else {
      delete root.dataset.pwaKeyboard;
      root.style.removeProperty("--chat-viewport-height");
      root.style.removeProperty("--chat-viewport-top");
      // Only remove WebKit's extra document scroll below the actual page.
      // Keep the reader's position on long forms and the chat list's own scroll.
      if (wasEditing && getComputedStyle(document.body).position !== "fixed") {
        const maxY = Math.max(
          0,
          shell.offsetTop +
            shell.offsetHeight -
            Math.max(root.clientHeight, viewport.height),
        );
        const limit = shell.querySelector(".chat-viewport") ? 0 : maxY;
        if (window.scrollY > limit + 1) window.scrollTo(window.scrollX, limit);
      }
    }
    wasEditing =
      editing || (wasEditing && viewport.height < root.clientHeight - 1);
  }

  function schedule() {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(update);
  }
  function settleAfterFocus() {
    schedule();
    window.clearTimeout(settle);
    settle = window.setTimeout(schedule, 450);
  }
  document.addEventListener("focusin", settleAfterFocus);
  document.addEventListener("focusout", settleAfterFocus);
  window.addEventListener("pageshow", settleAfterFocus);
  window.addEventListener("resize", settleAfterFocus);
  viewport.addEventListener("resize", settleAfterFocus);
  viewport.addEventListener("scroll", schedule);
  schedule();
  return () => {
    cancelAnimationFrame(frame);
    window.clearTimeout(settle);
    document.removeEventListener("focusin", settleAfterFocus);
    document.removeEventListener("focusout", settleAfterFocus);
    window.removeEventListener("pageshow", settleAfterFocus);
    window.removeEventListener("resize", settleAfterFocus);
    viewport.removeEventListener("resize", settleAfterFocus);
    viewport.removeEventListener("scroll", schedule);
    delete root.dataset.pwaKeyboard;
    root.style.removeProperty("--chat-viewport-height");
    root.style.removeProperty("--chat-viewport-top");
  };
}
