import { showAppAlert } from "./app-alert.js";
export const BROWSER_API_URL =
  process.env.NODE_ENV === "development"
    ? ""
    : process.env.NEXT_PUBLIC_API_URL || "https://srv.comatching.site";

const refreshLock = "comatching-auth-refresh";
export const EXPECTED_SESSION = "X-Expected-Session";

export class BrowserSessionEnded extends Error {
  readonly changed: boolean;

  constructor(changed = false) {
    super(
      changed
        ? "로그인 계정이 변경되었습니다."
        : "로그인 세션이 만료되었습니다.",
    );
    this.changed = changed;
  }
}

export function isAdminPage(path: string) {
  return path === "/adminpage" || path.startsWith("/adminpage/");
}

let leaving = false;
export function handleBrowserSessionEnd(error: unknown) {
  if (!(error instanceof BrowserSessionEnded) || leaving) return;
  const path = window.location.pathname;
  if (!error.changed && (path === "/adminpage" || path === "/adminpage/"))
    return;
  leaving = true;
  if (error.changed) {
    // Bind a fresh document to the new login without replaying pending mutations.
    window.location.reload();
  } else if (isAdminPage(path)) {
    window.location.replace("/adminpage");
  } else {
    showAppAlert(error.message + " 다시 로그인해주세요.", () =>
      window.location.replace("/"),
    );
  }
}

let documentOwner: string | undefined;
let documentGeneration = 0;
let observing: Promise<string | null> | undefined;
const recoveries = new Map<string | undefined, Promise<string>>();

function request(path: string, method = "GET", owner?: string) {
  return fetch(BROWSER_API_URL + path, {
    method,
    credentials: "include",
    headers: owner ? { [EXPECTED_SESSION]: owner } : undefined,
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
}

function denied(status: number) {
  return status === 401 || status === 403;
}

async function readOwner() {
  const response = await request("/api/auth/session");
  if (denied(response.status)) return null;
  if (!response.ok) throw new Error("로그인 상태를 확인할 수 없습니다.");
  const value = (await response.text()).trim();
  if (!/^[a-zA-Z0-9_-]{16,128}$/.test(value))
    throw new Error("로그인 상태를 확인할 수 없습니다.");
  return value;
}

async function rotateIfExpired(expected?: string) {
  // The previous holder may have already set a valid access cookie in this browser.
  const present = await readOwner();
  if (present !== null) return present;
  const response = await request("/api/auth/reissue", "POST", expected);
  if (response.status === 403 && expected) throw new BrowserSessionEnded(true);
  if (!response.ok && !denied(response.status))
    throw new Error("로그인 갱신을 다시 시도해주세요.");
  const current = await readOwner();
  if (current !== null) return current;
  if (denied(response.status)) {
    // An independently served page or a server action may have rotated just before our response.
    for (const delay of [200, 800]) {
      await pause(delay);
      const updated = await readOwner();
      if (updated !== null) return updated;
    }
    throw new BrowserSessionEnded();
  }
  throw new Error("갱신한 로그인 상태를 확인할 수 없습니다.");
}

const pause = (ms: number) =>
  new Promise<void>((done) => window.setTimeout(done, ms));

// Non-secure development origins lack Web Locks. IndexedDB read-write transactions serialize
// acquisition across their tabs. A crashed tab's lease expires after the bounded network requests.
async function withDatabaseLock(run: () => Promise<string>) {
  const db = await new Promise<IDBDatabase>((resolve, reject) => {
    const open = indexedDB.open(refreshLock, 1);
    open.onupgradeneeded = () => open.result.createObjectStore("locks");
    open.onsuccess = () => resolve(open.result);
    open.onerror = () => reject(open.error);
  });
  const holder = `${Date.now()}-${Math.random()}`;
  function update(acquire: boolean) {
    return new Promise<boolean>((resolve, reject) => {
      const tx = db.transaction("locks", "readwrite");
      const store = tx.objectStore("locks");
      const get = store.get(refreshLock);
      let acquired = false;
      get.onsuccess = () => {
        const lease = get.result as
          | { holder: string; expires: number }
          | undefined;
        if (acquire && (!lease || lease.expires <= Date.now())) {
          store.put({ holder, expires: Date.now() + 60_000 }, refreshLock);
          acquired = true;
        } else if (!acquire && lease?.holder === holder) {
          store.delete(refreshLock);
        }
      };
      tx.oncomplete = () => resolve(acquired);
      tx.onabort = () =>
        reject(
          tx.error || new Error("브라우저 로그인 잠금을 얻을 수 없습니다."),
        );
    });
  }
  try {
    while (!(await update(true))) await pause(100);
    try {
      return await run();
    } finally {
      await update(false);
    }
  } finally {
    db.close();
  }
}

async function rotateUnderLock(expected?: string): Promise<string> {
  const rotate = () => rotateIfExpired(expected);
  if (navigator.locks)
    return await navigator.locks.request(refreshLock, rotate);
  return withDatabaseLock(rotate);
}

function recover(expected?: string): Promise<string> {
  const existing = recoveries.get(expected);
  if (existing) return existing;
  const attempt = rotateUnderLock(expected).finally(() =>
    recoveries.delete(expected),
  );
  recoveries.set(expected, attempt);
  return attempt;
}

function observe() {
  if (!observing) {
    const attempt = readOwner().finally(() => {
      if (observing === attempt) observing = undefined;
    });
    observing = attempt;
  }
  return observing;
}

/** The opaque marker is bound to this document's first login. Nothing sensitive is persisted or broadcast. */
export async function confirmBrowserSession(
  expected = documentOwner,
): Promise<string> {
  const generation = documentGeneration;
  const observed = await observe();
  if (generation !== documentGeneration) throw new BrowserSessionEnded();
  const owner = observed ?? (await recover(expected));
  if (generation !== documentGeneration) throw new BrowserSessionEnded();
  if (
    (expected && expected !== owner) ||
    (documentOwner && documentOwner !== owner)
  )
    throw new BrowserSessionEnded(true);
  documentOwner = owner;
  return owner;
}

export async function requestSessionOwner() {
  return documentOwner ?? confirmBrowserSession();
}

export function forgetBrowserSession(owner: string) {
  if (documentOwner === owner) {
    documentGeneration++;
    documentOwner = undefined;
    observing = undefined;
    window.dispatchEvent(new Event("comatching-session-ended"));
  }
  if (typeof BroadcastChannel !== "undefined") {
    const channel = new BroadcastChannel("comatching-auth-change");
    channel.postMessage({ signedOut: owner });
    channel.close();
  }
}
