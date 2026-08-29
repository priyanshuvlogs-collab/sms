"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { isDisposableEmail } from "@/lib/auth/disposable-domains";
import { verifyCaptcha } from "@/lib/auth/captcha";

export type AuthState = { error?: string };

const credentialsSchema = z.object({
  email: z.email("Enter a valid email."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export async function signUp(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const parsed = credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  const { email, password } = parsed.data;

  if (isDisposableEmail(email)) {
    return { error: "Disposable email addresses aren't allowed. Use your real inbox." };
  }

  const captchaOk = await verifyCaptcha(
    formData.get("cf-turnstile-response") as string | null
  );
  if (!captchaOk) {
    return { error: "Captcha failed. Try again." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Email confirmation on: session is null until the link is clicked.
  if (!data.session) {
    redirect("/check-email");
  }
  redirect("/home");
}

export async function signIn(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const parsed = credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: "Wrong email or password." };
  }

  const next = formData.get("next");
  redirect(typeof next === "string" && next.startsWith("/") ? next : "/home");
}
