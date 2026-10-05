import { env } from "@/lib/env";

export async function verifyTurnstileToken(token: string | undefined): Promise<boolean> {
  // Allow test tokens in test environment
  if (process.env.NODE_ENV === "test" && token && (token.startsWith("dummy-") || token.startsWith("test-"))) {
    return true;
  }

  const secretKey = env.TURNSTILE_SECRET_KEY;

  if (!secretKey || !token) {
    return false;
  }


  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
    });

    const data = await response.json();
    return data.success === true;
  } catch {
    return false;
  }
}

export function getTurnstileSiteKey(): string {
  return env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';
}

export function isTurnstileEnabled(): boolean {
  return !!(env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && env.TURNSTILE_SECRET_KEY);
}