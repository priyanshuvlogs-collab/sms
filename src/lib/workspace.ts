import { createClient } from "@/lib/supabase/server";

export type Workspace = {
  id: string;
  name: string;
  plan: "trial" | "monthly" | "yearly" | "canceled";
  trial_ends_at: string;
  runs_limit: number;
  brands_limit: number;
  seats_limit: number;
};

export type UsageMonth = {
  runs_used: number;
  runs_limit: number;
  extra_runs: number;
};

export function currentMonthUtc(): string {
  return new Date().toISOString().slice(0, 7); // YYYY-MM
}

/** Whole days of trial remaining, floored at 0. */
export function trialDaysLeft(trialEndsAt: string): number {
  return Math.max(
    0,
    Math.ceil((new Date(trialEndsAt).getTime() - Date.now()) / 86_400_000)
  );
}

/**
 * The signed-in user's workspace (v1: one workspace per user, created
 * by the signup trigger) plus this month's usage counters.
 */
export async function getWorkspaceContext() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: workspace } = await supabase
    .from("workspaces")
    .select("id, name, plan, trial_ends_at, runs_limit, brands_limit, seats_limit")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle<Workspace>();

  if (!workspace) return null;

  const { data: usage } = await supabase
    .from("usage_months")
    .select("runs_used, runs_limit, extra_runs")
    .eq("workspace_id", workspace.id)
    .eq("month", currentMonthUtc())
    .maybeSingle<UsageMonth>();

  return {
    user,
    workspace,
    usage: usage ?? {
      runs_used: 0,
      runs_limit: workspace.runs_limit,
      extra_runs: 0,
    },
  };
}
