const COOKIE_NAME = "admin_session";

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "elitte2026";
}

export function getSessionToken(): string {
  return (
    process.env.ADMIN_SESSION_TOKEN ||
    "elitte-admin-session-token-change-me"
  );
}

export function isValidSessionToken(token: string | undefined): boolean {
  if (!token) return false;
  return token === getSessionToken();
}

export { COOKIE_NAME };
