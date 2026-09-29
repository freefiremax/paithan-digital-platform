import { SignJWT, jwtVerify } from "jose";

const CSRF_SECRET = new TextEncoder().encode(
  process.env.CSRF_SECRET || "csrf-secret-change-in-production-at-least-32-chars"
);
const CSRF_TOKEN_NAME = "paithan_csrf";
const CSRF_HEADER_NAME = "x-csrf-token";

export async function generateCsrfToken(): Promise<string> {
  return new SignJWT({ csrf: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(CSRF_SECRET);
}

export async function validateCsrfToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, CSRF_SECRET);
    return true;
  } catch {
    return false;
  }
}

export function getCsrfTokenFromRequest(request: Request): string | null {
  const headerToken = request.headers.get(CSRF_HEADER_NAME);
  if (headerToken) return headerToken;

  const cookieHeader = request.headers.get("cookie");
  if (cookieHeader) {
    const cookies = cookieHeader.split(";").map((c) => c.trim());
    for (const cookie of cookies) {
      if (cookie.startsWith(`${CSRF_TOKEN_NAME}=`)) {
        return cookie.substring(CSRF_TOKEN_NAME.length + 1);
      }
    }
  }
  return null;
}

export function setCsrfCookie(response: Response, token: string): void {
  response.headers.append(
    "Set-Cookie",
    `${CSRF_TOKEN_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=3600`
  );
}

export function clearCsrfCookie(response: Response): void {
  response.headers.append(
    "Set-Cookie",
    `${CSRF_TOKEN_NAME}=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0`
  );
}

export const CSRF_CONFIG = {
  tokenName: CSRF_TOKEN_NAME,
  headerName: CSRF_HEADER_NAME,
} as const;