create table if not exists projects (
  id text primary key,
  name text not null,
  source_of_truth text not null default 'proposal',
  status text not null default 'baseline_review',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists documents (
  id text primary key,
  project_id text not null references projects(id) on delete cascade,
  name text not null,
  source_type text not null,
  version text,
  uploaded_at timestamptz not null default now()
);

create table if not exists requirements (
  id text primary key,
  project_id text not null references projects(id) on delete cascade,
  category text not null,
  title text not null,
  detail text not null,
  confidence numeric(5,2) not null default 0,
  review_state text not null default 'ai_extracted',
  source_document text not null,
  source_type text not null,
  source_page integer,
  source_section text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create table if not exists readiness_items (
  id text primary key,
  project_id text not null references projects(id) on delete cascade,
  service text not null,
  factor text not null,
  status text not null default 'unknown',
  critical boolean not null default false,
  evidence_ids jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists positions (
  id text primary key,
  project_id text not null references projects(id) on delete cascade,
  role_name text not null,
  required_quantity integer not null default 1,
  filled_quantity integer not null default 0,
  status text not null default 'open',
  requirements jsonb not null default '{}'::jsonb
);

create table if not exists candidates (
  id text primary key,
  project_id text not null references projects(id) on delete cascade,
  position_id text references positions(id) on delete set null,
  full_name text not null,
  score numeric(4,2),
  status text not null default 'new',
  expected_salary text,
  availability text,
  assessment jsonb not null default '{}'::jsonb
);

create table if not exists raid_items (
  id text primary key,
  project_id text not null references projects(id) on delete cascade,
  kind text not null,
  title text not null,
  detail text,
  severity text,
  owner text,
  status text not null default 'open',
  due_date date
);

create index if not exists idx_requirements_project on requirements(project_id);
create index if not exists idx_readiness_project on readiness_items(project_id);
