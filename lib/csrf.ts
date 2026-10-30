import { SignJWT, jwtVerify } from "jose";

function signingKey() {
  const secret = process.env.CSRF_SECRET || process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret || secret.length < 32) throw new Error('CSRF signing secret is not configured');
  return new TextEncoder().encode(secret);
}
const CSRF_TOKEN_NAME = "paithan_csrf";
const CSRF_HEADER_NAME = "x-csrf-token";

export async function generateCsrfToken(): Promise<string> {
  return new SignJWT({ csrf: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(signingKey());
}

export async function validateCsrfToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, signingKey(), { algorithms: ["HS256"] });
    if (payload.csrf !== true) return false;
    return true;
  } catch {
    return false;
  }
}

export function getCsrfTokenFromRequest(request: Request): string | null {
  const headerToken = request.headers.get(CSRF_HEADER_NAME);
  if (headerToken) return headerToken;

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