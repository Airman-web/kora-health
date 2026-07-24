export interface KoraUser {
  id: string;
  email: string;
  role: "PATIENT" | "THERAPIST";
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("kora_token");
}

export function getUser(): KoraUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("kora_user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as KoraUser;
  } catch {
    return null;
  }
}

export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("kora_token");
  localStorage.removeItem("kora_user");
  window.location.href = "/login";
}
