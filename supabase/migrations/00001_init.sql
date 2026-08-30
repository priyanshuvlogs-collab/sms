-- ============================================================
-- NINE — The $9 marketing OS
-- Migration 00001: full v1 schema + RLS
--
-- Tables: profiles, workspaces, members, brands, campaigns,
--         content_items, library_items, ai_runs, usage_events,
--         usage_months, reports, byok_keys
--
-- Rules encoded here (do not change casually — unit economics):
--   * $9 plan: 3 brands, 2 seats (owner + 1 teammate), 200 runs/mo
--   * add-ons bump runs_limit / brands_limit on the workspace
--   * usage_events is append-only; usage_months is the fast counter
--   * every generate is gated on usage_months BEFORE calling a model
-- ============================================================

-- ------------------------------------------------------------
-- Extensions
-- ------------------------------------------------------------
create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- profiles: 1:1 with auth.users
-- ------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  onboarded_at timestamptz,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- workspaces: billing + plan limits live here
-- ------------------------------------------------------------
create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'My workspace',
  owner_id uuid not null references auth.users (id) on delete cascade,

  -- billing
  plan text not null default 'trial'
    check (plan in ('trial', 'monthly', 'yearly', 'canceled')),
  stripe_customer_id text unique,
  stripe_subscription_id text,
  trial_ends_at timestamptz not null default now() + interval '7 days',

  -- effective limits (base plan + purchased add-ons)
  runs_limit integer not null default 200,
  brands_limit integer not null default 3,
  seats_limit integer not null default 2,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index workspaces_owner_id_idx on public.workspaces (owner_id);

-- ------------------------------------------------------------
-- members: who can access a workspace
-- ------------------------------------------------------------
create table public.members (
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null default 'teammate' check (role in ('owner', 'teammate')),
  created_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

create index members_user_id_idx on public.members (user_id);

-- ------------------------------------------------------------
-- brands: the Brand Kit. Every generation reads this.
-- ------------------------------------------------------------
create table public.brands (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  name text not null,
  website text,
  voice text,                       -- tone, style, do/don't
  offer text,                       -- what you sell, price point
  icp text,                         -- who it's for
  competitors text[] not null default '{}',
  cta text,                         -- default call to action
  banned_words text[] not null default '{}',
  platforms text[] not null default '{}',  -- e.g. {instagram,linkedin,x,tiktok,youtube}
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index brands_workspace_id_idx on public.brands (workspace_id);

-- ------------------------------------------------------------
-- campaigns: Campaign Studio. One goal + one offer in,
-- a full JSON kit out (positioning, calendar, posts, ads,
-- landing outline, emails, shorts titles, UTM set).
-- ------------------------------------------------------------
create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  brand_id uuid not null references public.brands (id) on delete cascade,
  created_by uuid references auth.users (id) on delete set null,
  goal text not null,
  offer text not null,
  status text not null default 'draft'
    check (status in ('draft', 'generating', 'ready', 'archived')),
  output jsonb,                     -- full campaign kit, section-addressable
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index campaigns_workspace_id_idx on public.campaigns (workspace_id);
create index campaigns_brand_id_idx on public.campaigns (brand_id);

-- ------------------------------------------------------------
-- content_items: everything generated or planned.
-- Content Engine outputs, planner entries, SEO briefs, ads.
-- ------------------------------------------------------------
create table public.content_items (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  brand_id uuid references public.brands (id) on delete set null,
  campaign_id uuid references public.campaigns (id) on delete set null,
  created_by uuid references auth.users (id) on delete set null,
  kind text not null check (kind in (
    'post', 'thread', 'caption', 'hook', 'short',
    'email', 'ad', 'seo_brief', 'landing_outline', 'other'
  )),
  platform text,                    -- instagram | linkedin | x | tiktok | youtube | google | meta | null
  title text,
  body text,
  meta jsonb not null default '{}'::jsonb,  -- utm params, scores, angles, etc.
  status text not null default 'draft'
    check (status in ('draft', 'approved', 'scheduled', 'posted', 'archived')),
  scheduled_for date,               -- planner slot; export to CSV, no native posting
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index content_items_workspace_id_idx on public.content_items (workspace_id);
create index content_items_planner_idx on public.content_items (workspace_id, scheduled_for)
  where scheduled_for is not null;

-- ------------------------------------------------------------
-- library_items: saved winners + prompt recipes
-- ------------------------------------------------------------
create table public.library_items (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  brand_id uuid references public.brands (id) on delete set null,
  kind text not null check (kind in ('winner', 'recipe')),
  title text not null,
  body text not null,
  tags text[] not null default '{}',
  source_content_item uuid references public.content_items (id) on delete set null,
  created_at timestamptz not null default now()
);

create index library_items_workspace_id_idx on public.library_items (workspace_id);

-- ------------------------------------------------------------
-- ai_runs: one row per model call. The cost ledger.
-- Written only by the server (service role). Never from client.
-- ------------------------------------------------------------
create table public.ai_runs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  user_id uuid references auth.users (id) on delete set null,
  brand_id uuid references public.brands (id) on delete set null,
  module text not null,             -- campaign | content | seo | ads | report | brand
  model text not null,
  input_chars integer not null default 0,
  input_tokens integer not null default 0,
  output_tokens integer not null default 0,
  cost_usd numeric(10, 6) not null default 0,  -- 0 when byok
  byok boolean not null default false,
  status text not null default 'ok' check (status in ('ok', 'error', 'quota_blocked')),
  error text,
  created_at timestamptz not null default now()
);

create index ai_runs_workspace_id_idx on public.ai_runs (workspace_id, created_at);
create index ai_runs_created_at_idx on public.ai_runs (created_at);

-- ------------------------------------------------------------
-- usage_events: append-only audit trail
-- ------------------------------------------------------------
create table public.usage_events (
  id bigint generated always as identity primary key,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  user_id uuid references auth.users (id) on delete set null,
  event text not null,              -- run | run_blocked | addon_purchased | export | report
  module text,
  runs integer not null default 0,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index usage_events_workspace_id_idx on public.usage_events (workspace_id, created_at);

-- ------------------------------------------------------------
-- usage_months: fast monthly counters, one row per workspace-month.
-- The quota gate reads this row before every generate.
-- ------------------------------------------------------------
create table public.usage_months (
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  month text not null check (month ~ '^\d{4}-\d{2}$'),  -- 'YYYY-MM' (UTC)
  runs_used integer not null default 0,
  runs_limit integer not null default 200,  -- snapshot: base + add-ons at month start
  extra_runs integer not null default 0,    -- purchased +200 packs this month
  cost_usd numeric(10, 4) not null default 0,
  updated_at timestamptz not null default now(),
  primary key (workspace_id, month)
);

-- ------------------------------------------------------------
-- reports: Weekly Report Lite. Paste numbers -> 1-page PDF.
-- ------------------------------------------------------------
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  brand_id uuid references public.brands (id) on delete set null,
  title text not null,
  period_start date not null,
  period_end date not null,
  metrics jsonb not null default '{}'::jsonb,  -- pasted numbers, typed client-side
  summary text,                                 -- AI one-pager text
  pdf_path text,                                -- Supabase Storage path
  created_at timestamptz not null default now()
);

create index reports_workspace_id_idx on public.reports (workspace_id);

-- ------------------------------------------------------------
-- byok_keys: bring-your-own-key, AES-256-GCM encrypted app-side
-- with BYOK_ENCRYPTION_KEY before it ever reaches Postgres.
-- Never logged, never selected by the client. Service role only.
-- ------------------------------------------------------------
create table public.byok_keys (
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  provider text not null check (provider in ('openai', 'anthropic', 'gemini', 'groq')),
  encrypted_key text not null,      -- base64(iv || ciphertext || tag)
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  primary key (workspace_id, provider)
);

-- ============================================================
-- Helper functions
-- ============================================================

-- Membership check used by nearly every policy.
-- SECURITY DEFINER so it can read members without recursive RLS.
create or replace function public.is_workspace_member(ws uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.members
    where workspace_id = ws and user_id = auth.uid()
  );
$$;

create or replace function public.is_workspace_owner(ws uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.members
    where workspace_id = ws and user_id = auth.uid() and role = 'owner'
  );
$$;

-- Quota gate + increment in one round trip. Called by the server
-- (service role) inside the generate path. Returns true when the
-- run is allowed and counted; false when the workspace is over quota.
create or replace function public.consume_run(
  ws uuid,
  run_cost numeric default 0
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  cur_month text := to_char(now() at time zone 'utc', 'YYYY-MM');
  ws_limit integer;
  allowed boolean;
begin
  select runs_limit into ws_limit from public.workspaces where id = ws;
  if ws_limit is null then
    return false;
  end if;

  insert into public.usage_months (workspace_id, month, runs_limit)
  values (ws, cur_month, ws_limit)
  on conflict (workspace_id, month) do nothing;

  update public.usage_months
  set runs_used = runs_used + 1,
      cost_usd = cost_usd + coalesce(run_cost, 0),
      updated_at = now()
  where workspace_id = ws
    and month = cur_month
    and runs_used < runs_limit + extra_runs
  returning true into allowed;

  return coalesce(allowed, false);
end;
$$;

-- Auto-provision on signup: profile + workspace + owner membership.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  ws_id uuid;
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', null)
  );

  insert into public.workspaces (name, owner_id)
  values ('My workspace', new.id)
  returning id into ws_id;

  insert into public.members (workspace_id, user_id, role)
  values (ws_id, new.id, 'owner');

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at maintenance
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger workspaces_updated_at before update on public.workspaces
  for each row execute function public.set_updated_at();
create trigger brands_updated_at before update on public.brands
  for each row execute function public.set_updated_at();
create trigger campaigns_updated_at before update on public.campaigns
  for each row execute function public.set_updated_at();
create trigger content_items_updated_at before update on public.content_items
  for each row execute function public.set_updated_at();

-- ============================================================
-- Row Level Security — enabled on EVERY table
-- ============================================================

alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.members enable row level security;
alter table public.brands enable row level security;
alter table public.campaigns enable row level security;
alter table public.content_items enable row level security;
alter table public.library_items enable row level security;
alter table public.ai_runs enable row level security;
alter table public.usage_events enable row level security;
alter table public.usage_months enable row level security;
alter table public.reports enable row level security;
alter table public.byok_keys enable row level security;

-- profiles: you can see and edit only yourself
create policy "profiles_select_own" on public.profiles
  for select using (id = auth.uid());
create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid());

-- workspaces: members read; only the owner updates.
-- Inserts happen via the signup trigger (definer) or service role.
create policy "workspaces_select_member" on public.workspaces
  for select using (public.is_workspace_member(id));
create policy "workspaces_update_owner" on public.workspaces
  for update using (public.is_workspace_owner(id));

-- members: members can list the roster; owner manages it
create policy "members_select_member" on public.members
  for select using (public.is_workspace_member(workspace_id));
create policy "members_insert_owner" on public.members
  for insert with check (public.is_workspace_owner(workspace_id));
create policy "members_delete_owner" on public.members
  for delete using (
    public.is_workspace_owner(workspace_id)
    and user_id <> auth.uid()  -- owner can't remove themselves
  );

-- brands: full CRUD for members. Brand cap is enforced in the app
-- layer AND here as a belt-and-braces check.
create policy "brands_select_member" on public.brands
  for select using (public.is_workspace_member(workspace_id));
create policy "brands_insert_member" on public.brands
  for insert with check (
    public.is_workspace_member(workspace_id)
    and (
      select count(*) from public.brands b where b.workspace_id = brands.workspace_id
    ) < (
      select w.brands_limit from public.workspaces w where w.id = brands.workspace_id
    )
  );
create policy "brands_update_member" on public.brands
  for update using (public.is_workspace_member(workspace_id));
create policy "brands_delete_member" on public.brands
  for delete using (public.is_workspace_member(workspace_id));

-- campaigns / content_items / library_items / reports: member CRUD
create policy "campaigns_all_member" on public.campaigns
  for all using (public.is_workspace_member(workspace_id))
  with check (public.is_workspace_member(workspace_id));

create policy "content_items_all_member" on public.content_items
  for all using (public.is_workspace_member(workspace_id))
  with check (public.is_workspace_member(workspace_id));

create policy "library_items_all_member" on public.library_items
  for all using (public.is_workspace_member(workspace_id))
  with check (public.is_workspace_member(workspace_id));

create policy "reports_all_member" on public.reports
  for all using (public.is_workspace_member(workspace_id))
  with check (public.is_workspace_member(workspace_id));

-- ai_runs / usage_events / usage_months: members can READ their
-- own workspace's usage (for the quota bar). All writes go through
-- the service role (bypasses RLS) — no insert/update policies.
create policy "ai_runs_select_member" on public.ai_runs
  for select using (public.is_workspace_member(workspace_id));
create policy "usage_events_select_member" on public.usage_events
  for select using (public.is_workspace_member(workspace_id));
create policy "usage_months_select_member" on public.usage_months
  for select using (public.is_workspace_member(workspace_id));

-- byok_keys: no client access at all. Owners write/rotate via a
-- server route using the service role; ciphertext never leaves the
-- server. Deliberately NO select policy.
create policy "byok_keys_delete_owner" on public.byok_keys
  for delete using (public.is_workspace_owner(workspace_id));
