/**
 * Cloudflare Turnstile verification (free tier — fits the $9 margin).
 * Enabled automatically when TURNSTILE_SECRET_KEY is set; in local dev
 * without keys, signup works without a captcha.
 */
export function captchaEnabled(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY);
}

export async function verifyCaptcha(token: string | null): Promise<boolean> {
  if (!captchaEnabled()) return true;
  if (!token) return false;

  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY!,
        response: token,
      }),
    }
  );

  if (!res.ok) return false;
  const data = (await res.json()) as { success: boolean };
  return data.success;
}
