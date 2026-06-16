import { supabase } from "./supabase";

export interface EventUser {
  name: string;
  email: string;
  crmUf: string;
  crmNumber: string;
  privacyConsent: boolean;
  commsConsent: boolean;
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

export async function saveUserToSupabase(
  user: EventUser
): Promise<{ error: string | null }> {
  const { error } = await supabase.from("registrations").insert({
    name: user.name,
    email: user.email,
    crm_uf: user.crmUf,
    crm_number: user.crmNumber,
    privacy_consent: user.privacyConsent,
    comms_consent: user.commsConsent,
    registered_at: user.registeredAt,
  });
  return { error: error ? error.message : null };
}

export function buildSlidoUrl(
  eventCode: string,
  user: Pick<EventUser, "name" | "email">
): string {
  if (!eventCode) return "";
  const base = `https://app.sli.do/event/${eventCode}`;
  const parts: string[] = [];
  if (user.name) parts.push(`user_name=${encodeURIComponent(user.name)}`);
  if (user.email) parts.push(`user_email=${encodeURIComponent(user.email)}`);
  return parts.length ? `${base}?${parts.join("&")}` : base;
}
