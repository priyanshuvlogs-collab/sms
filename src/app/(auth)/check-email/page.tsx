import Link from "next/link";
import { MailCheck } from "lucide-react";

export default function CheckEmailPage() {
  return (
    <div className="space-y-4 text-center">
      <MailCheck className="mx-auto size-10 text-primary" aria-hidden />
      <h1 className="text-2xl font-semibold tracking-tight">Check your email</h1>
      <p className="text-sm text-muted-foreground">
        We sent you a confirmation link. Click it and you&apos;re in — your
        7-day trial starts the moment you confirm.
      </p>
      <p className="text-sm text-muted-foreground">
        Wrong address?{" "}
        <Link href="/signup" className="text-foreground underline underline-offset-4">
          Sign up again
        </Link>
      </p>
    </div>
  );
}
