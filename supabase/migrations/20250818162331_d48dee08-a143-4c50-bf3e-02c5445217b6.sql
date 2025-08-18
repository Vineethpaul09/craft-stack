-- 1) tenants
create table if not exists tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  domain text,
  created_at timestamptz default now()
);

-- 2) users (simplified, can mirror supabase_auth.users if desired)
create table if not exists app_users (
  id uuid primary key default gen_random_uuid(),
  auth_uid uuid not null, -- link to supabase auth id
  tenant_id uuid not null references tenants(id) on delete cascade,
  email text not null,
  full_name text,
  roles text[] default '{}', -- e.g. ['recruiter','admin']
  created_at timestamptz default now()
);

-- 3) jobs
create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id),
  title text not null,
  description text,
  status text default 'open',
  created_by uuid references app_users(id),
  created_at timestamptz default now()
);

-- 4) candidates
create table if not exists candidates (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id),
  job_id uuid references jobs(id),
  name text,
  email text,
  title text,
  location text,
  resume_path text, -- Supabase Storage path
  status text not null default 'Applied',
  score int,
  assigned_to uuid references app_users(id),
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5) interviews
create table if not exists interviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id),
  candidate_id uuid not null references candidates(id),
  organizer_id uuid references app_users(id),
  start_at timestamptz,
  end_at timestamptz,
  location text,
  details jsonb default '{}',
  created_at timestamptz default now()
);

-- 6) automation_rules
create table if not exists automation_rules (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id),
  name text,
  active boolean default true,
  trigger_config jsonb,
  conditions jsonb,
  actions jsonb,
  created_by uuid references app_users(id),
  created_at timestamptz default now()
);

-- 7) audit/events
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id),
  event_type text not null,
  payload jsonb,
  created_by uuid,
  created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_candidates_tenant_status on candidates (tenant_id, status);
create index if not exists idx_jobs_tenant on jobs (tenant_id);
create index if not exists idx_app_users_auth_uid on app_users (auth_uid);

-- Enable RLS
alter table tenants enable row level security;
alter table app_users enable row level security;
alter table jobs enable row level security;
alter table candidates enable row level security;
alter table interviews enable row level security;
alter table automation_rules enable row level security;
alter table events enable row level security;

-- Helper function to get current user's auth UID
create or replace function current_auth_uid() returns uuid as $$
  select (current_setting('request.jwt.claim.sub', true))::uuid;
$$ language sql stable;

-- Helper: get current user's tenant_id from app_users table
create or replace function current_tenant_id() returns uuid as $$
  select tenant_id from app_users where auth_uid = current_auth_uid() limit 1;
$$ language sql stable;

-- RLS Policies for tenants
create policy "tenants_select" on tenants for select using (
  id = current_tenant_id()
);

-- RLS Policies for app_users
create policy "app_users_select" on app_users for select using (
  tenant_id = current_tenant_id()
);

create policy "app_users_insert" on app_users for insert with check (
  auth_uid = current_auth_uid()
);

create policy "app_users_update" on app_users for update using (
  auth_uid = current_auth_uid()
);

-- RLS Policies for jobs
create policy "jobs_select" on jobs for select using (
  tenant_id = current_tenant_id()
);

create policy "jobs_insert" on jobs for insert with check (
  tenant_id = current_tenant_id()
);

create policy "jobs_update" on jobs for update using (
  tenant_id = current_tenant_id()
);

create policy "jobs_delete" on jobs for delete using (
  tenant_id = current_tenant_id()
);

-- RLS Policies for candidates
create policy "candidates_select" on candidates for select using (
  tenant_id = current_tenant_id()
);

create policy "candidates_insert" on candidates for insert with check (
  tenant_id = current_tenant_id()
);

create policy "candidates_update" on candidates for update using (
  tenant_id = current_tenant_id()
);

create policy "candidates_delete" on candidates for delete using (
  tenant_id = current_tenant_id()
);

-- RLS Policies for interviews
create policy "interviews_select" on interviews for select using (
  tenant_id = current_tenant_id()
);

create policy "interviews_insert" on interviews for insert with check (
  tenant_id = current_tenant_id()
);

create policy "interviews_update" on interviews for update using (
  tenant_id = current_tenant_id()
);

create policy "interviews_delete" on interviews for delete using (
  tenant_id = current_tenant_id()
);

-- RLS Policies for automation_rules
create policy "automation_rules_select" on automation_rules for select using (
  tenant_id = current_tenant_id()
);

create policy "automation_rules_insert" on automation_rules for insert with check (
  tenant_id = current_tenant_id()
);

create policy "automation_rules_update" on automation_rules for update using (
  tenant_id = current_tenant_id()
);

create policy "automation_rules_delete" on automation_rules for delete using (
  tenant_id = current_tenant_id()
);

-- RLS Policies for events
create policy "events_select" on events for select using (
  tenant_id = current_tenant_id()
);

create policy "events_insert" on events for insert with check (
  tenant_id = current_tenant_id()
);

-- Storage bucket for resumes
insert into storage.buckets (id, name, public) values ('resumes', 'resumes', false) on conflict do nothing;

-- Storage policies for resumes
create policy "resume_upload_policy" on storage.objects for insert with check (
  bucket_id = 'resumes' and 
  (storage.foldername(name))[1] = (select tenant_id::text from app_users where auth_uid = auth.uid() limit 1)
);

create policy "resume_download_policy" on storage.objects for select using (
  bucket_id = 'resumes' and 
  (storage.foldername(name))[1] = (select tenant_id::text from app_users where auth_uid = auth.uid() limit 1)
);

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger for candidates updated_at
create trigger update_candidates_updated_at 
  before update on candidates 
  for each row 
  execute function update_updated_at_column();

-- Enable realtime for candidates table
alter publication supabase_realtime add table candidates;

-- Seed demo data
insert into tenants (id, name, domain) values ('11111111-1111-1111-1111-111111111111','AcmeProcure','acmeprocure.com') on conflict do nothing;

insert into jobs (id, tenant_id, title, description) values 
  ('33333333-3333-3333-3333-333333333333','11111111-1111-1111-1111-111111111111','Frontend Engineer','Build modern UIs with React and TypeScript'),
  ('44444444-4444-4444-4444-444444444444','11111111-1111-1111-1111-111111111111','DevOps Engineer','Manage cloud infrastructure and CI/CD pipelines'),
  ('55555555-5555-5555-5555-555555555555','11111111-1111-1111-1111-111111111111','Product Manager','Lead product strategy and roadmap') 
  on conflict do nothing;

insert into candidates (id, tenant_id, job_id, name, email, title, location, status, score) values
  ('c1111111-1111-1111-1111-111111111111','11111111-1111-1111-1111-111111111111','33333333-3333-3333-3333-333333333333','Sarah Johnson','sarah.johnson@email.com','Senior Full Stack Developer','San Francisco, CA','Applied', 85),
  ('c2222222-2222-2222-2222-222222222222','11111111-1111-1111-1111-111111111111','44444444-4444-4444-4444-444444444444','Michael Chen','m.chen@email.com','DevOps Engineer','Seattle, WA','Screening', 78),
  ('c3333333-3333-3333-3333-333333333333','11111111-1111-1111-1111-111111111111','33333333-3333-3333-3333-333333333333','Emily Rodriguez','emily.r@email.com','Product Manager','Austin, TX','Phone Screen', 92),
  ('c4444444-4444-4444-4444-444444444444','11111111-1111-1111-1111-111111111111','33333333-3333-3333-3333-333333333333','David Kim','david.kim@email.com','Frontend Developer','Remote','Technical Interview', 76),
  ('c5555555-5555-5555-5555-555555555555','11111111-1111-1111-1111-111111111111','55555555-5555-5555-5555-555555555555','Lisa Wang','lisa.wang@email.com','UX Designer','New York, NY','Finalist', 89),
  ('c6666666-6666-6666-6666-666666666666','11111111-1111-1111-1111-111111111111','33333333-3333-3333-3333-333333333333','James Wilson','james.wilson@email.com','Backend Engineer','Chicago, IL','Offer', 81)
  on conflict do nothing;