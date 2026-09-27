/* ===== News seen/unread tracking (per device+user, localStorage) ===== */
const KEY = (uid: string, suffix: string) => `news_seen_${uid}_${suffix}`;

export function getSeen(uid: string, suffix: "updates" | "contribs"): string[] {
  try { return JSON.parse(localStorage.getItem(KEY(uid, suffix)) || "[]"); } catch { return []; }
}

export function markSeen(uid: string, suffix: "updates" | "contribs", ids: string[]) {
  if (!ids.length) return;
  const cur = new Set([...getSeen(uid, suffix), ...ids]);
  localStorage.setItem(KEY(uid, suffix), JSON.stringify(Array.from(cur).slice(-300)));
  window.dispatchEvent(new CustomEvent("news-seen-changed"));
}

export function unreadUpdates(uid: string, updates: any[]): any[] {
  const seen = new Set(getSeen(uid, "updates"));
  return updates.filter(u => !seen.has(u.id));
}

/* ===== URL sanitizer — "this page doesn't exist" bug fix ===== */
export function safeUrl(u?: string | null): string {
  if (!u) return "";
  let s = String(u).trim();
  if (!s) return "";
  if (!/^https?:\/\//i.test(s)) s = "https://" + s;
  try {
    const url = new URL(s);
    return url.href;
  } catch { return ""; }
}
