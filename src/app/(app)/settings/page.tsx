import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWorkspaceContext } from "@/lib/workspace";
import { PLAN } from "@/lib/plan";

export const metadata = { title: "Settings" };

const PLAN_LABELS: Record<string, string> = {
  trial: "Trial",
  monthly: "$9 / month",
  yearly: "$79 / year",
  canceled: "Canceled",
};

export default async function SettingsPage() {
  const ctx = await getWorkspaceContext();
  if (!ctx) redirect("/login");
  const { user, workspace } = ctx;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <p>{user.email}</p>
          <p className="text-muted-foreground">Workspace: {workspace.name}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-sm font-medium">
            <span>Plan</span>
            <Badge variant="outline" className="font-mono">
              {PLAN_LABELS[workspace.plan] ?? workspace.plan}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            {workspace.brands_limit} brands · {workspace.seats_limit} seats ·{" "}
            {workspace.runs_limit} AI runs / month
          </p>
          <p>
            ${PLAN.priceMonthlyUsd}/month or ${PLAN.priceYearlyUsd}/year.
            Billing, upgrades, and cancellation run through Stripe — shipping in
            Phase 1.
          </p>
          <Button size="sm" variant="secondary" disabled>
            Manage billing (Phase 1)
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Bring your own key
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            Use your own OpenAI, Anthropic, Gemini, or Groq key for $0. Keys are
            encrypted at rest and never logged. Shipping in Phase 2.
          </p>
          <Button size="sm" variant="secondary" disabled>
            Add key (Phase 2)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
