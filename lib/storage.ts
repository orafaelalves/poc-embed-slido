export interface EventUser {
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  registeredAt: string;
}

const USER_KEY = "poc-slido-user";
const SLIDO_CODE_KEY = "poc-slido-event-code";

export function saveUser(user: Omit<EventUser, "registeredAt">): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    USER_KEY,
    JSON.stringify({ ...user, registeredAt: new Date().toISOString() })
  );
}

export function getUser(): EventUser | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(USER_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data) as EventUser;
  } catch {
    return null;
  }
}

export function clearUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_KEY);
}

export function saveSlidoCode(code: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SLIDO_CODE_KEY, code);
}

export function getSlidoCode(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(SLIDO_CODE_KEY) || "";
}

export function buildSlidoUrl(
  eventCode: string,
  user: Pick<EventUser, "name" | "email">
): string {
  if (!eventCode) return "";
  const base = `https://app.sli.do/event/${eventCode}/live/questions`;
  const params = new URLSearchParams();
  if (user.name) params.set("user_name", user.name);
  if (user.email) params.set("user_email", user.email);
  const query = params.toString();
  return query ? `${base}?${query}` : base;
}
