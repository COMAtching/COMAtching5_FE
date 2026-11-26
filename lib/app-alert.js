import { createStore } from "zustand/vanilla";

/** @typedef {{ message: string, onConfirm?: () => void }} AppAlert */
export const appAlerts = createStore(() => /** @type {AppAlert[]} */ ([]));

/** @param {string} message @param {() => void} [onConfirm] */
export function showAppAlert(message, onConfirm) {
  appAlerts.setState((queue) => [...queue, { message, onConfirm }], true);
}

/** @param {AppAlert} alert */
export function acknowledgeAppAlert(alert) {
  const queue = appAlerts.getState();
  if (queue[0] !== alert) return;
  appAlerts.setState(queue.slice(1), true);
  alert.onConfirm?.();
}
