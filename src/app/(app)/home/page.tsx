import Link from "next/link";
import { redirect } from "next/navigation";
import { Rocket, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { getWorkspaceContext, trialDaysLeft } from "@/lib/workspace";

export const metadata = { title: "Home" };

export default async function HomePage() {
  const ctx = await getWorkspaceContext();
  if (!ctx) redirect("/login");

  const { workspace, usage } = ctx;
  const totalRuns = usage.runs_limit + usage.extra_runs;
  const pct = totalRuns > 0 ? Math.min(100, (usage.runs_used / totalRuns) * 100) : 0;

  const supabase = await createClient();
  const { data: lastCampaign } = await supabase
    .from("campaigns")
    .select("id, goal, status, updated_at")
    .eq("workspace_id", workspace.id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const daysLeft =
    workspace.plan === "trial" ? trialDaysLeft(workspace.trial_ends_at) : null;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Home</h1>
        {daysLeft !== null && (
          <Badge variant="outline" className="font-mono">
            Trial · {daysLeft} {daysLeft === 1 ? "day" : "days"} left
          </Badge>
        )}
      </div>

      {/* Quota bar */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-baseline justify-between text-sm font-medium">
            <span>AI runs this month</span>
            <span className="font-mono text-muted-foreground">
              {usage.runs_used} / {totalRuns}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={pct} aria-label="Monthly AI run usage" />
          <p className="mt-2 text-xs text-muted-foreground">
            Resets on the 1st (UTC). Need more? +200 runs for $5, or bring your
            own key for free.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Continue last campaign */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Rocket className="size-4 text-primary" aria-hidden />
              {lastCampaign ? "Continue your campaign" : "Start your first campaign"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {lastCampaign
                ? lastCampaign.goal
                : "One goal + one offer in. A full launch kit out: positioning, 7-day calendar, posts, ads, landing outline, emails."}
            </p>
            <Button size="sm" asChild>
              <Link
                href={
                  lastCampaign ? `/campaigns/${lastCampaign.id}` : "/campaigns"
                }
              >
                {lastCampaign ? "Open campaign" : "New campaign"}
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Weekly pack */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Package className="size-4 text-primary" aria-hidden />
              Weekly pack
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              A week of posts, hooks, and one report — generated in a single
              sitting. Ships with Campaign Studio in Phase 3.
            </p>
            <Button size="sm" variant="secondary" disabled>
              Coming soon
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
