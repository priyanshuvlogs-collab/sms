/**
 * Disposable / throwaway email domains blocked at signup.
 * Trials cost us real AI spend — burner emails are the #1 abuse vector.
 * This list covers the high-volume offenders; extend as abuse shows up
 * in the admin view (Phase 6).
 */
const DISPOSABLE_DOMAINS = new Set([
  "10minutemail.com",
  "10minutemail.net",
  "20minutemail.com",
  "33mail.com",
  "anonaddy.me",
  "burnermail.io",
  "byom.de",
  "dispostable.com",
  "dropmail.me",
  "emailondeck.com",
  "fakeinbox.com",
  "fakemail.net",
  "getairmail.com",
  "getnada.com",
  "guerrillamail.biz",
  "guerrillamail.com",
  "guerrillamail.de",
  "guerrillamail.info",
  "guerrillamail.net",
  "guerrillamail.org",
  "guerrillamailblock.com",
  "harakirimail.com",
  "inboxkitten.com",
  "incognitomail.org",
  "jetable.org",
  "mail-temp.com",
  "mail.tm",
  "mailcatch.com",
  "maildrop.cc",
  "mailinator.com",
  "mailnesia.com",
  "mailsac.com",
  "mintemail.com",
  "moakt.com",
  "mohmal.com",
  "mytemp.email",
  "nada.email",
  "sharklasers.com",
  "spam4.me",
  "spamgourmet.com",
  "tempail.com",
  "temp-mail.io",
  "temp-mail.org",
  "tempinbox.com",
  "tempmail.com",
  "tempmail.dev",
  "tempmail.net",
  "tempmail.plus",
  "tempmailo.com",
  "tempr.email",
  "throwawaymail.com",
  "trash-mail.com",
  "trashmail.com",
  "trashmail.de",
  "tutanota.de", // note: tutanota.com/tuta.com are legit and NOT blocked
  "yopmail.com",
  "yopmail.fr",
  "yopmail.net",
]);

export function isDisposableEmail(email: string): boolean {
  const domain = email.trim().toLowerCase().split("@").pop();
  if (!domain) return true;
  return DISPOSABLE_DOMAINS.has(domain);
}
