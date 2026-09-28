-- Phase 2+ database schema for Supabase (Postgres).
-- Paste into Supabase → SQL Editor → Run.

create table courts (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  address      text not null,
  lat          double precision not null,
  lng          double precision not null,
  num_courts   int not null check (num_courts > 0),
  indoor       boolean not null default false,
  lights       boolean not null default false,
  free         boolean not null default true,
  surface      text check (surface in ('concrete', 'asphalt', 'sport-court', 'wood')),
  notes        text,
  created_by   uuid references auth.users (id),
  approved     boolean not null default false,   -- Phase 4: moderate user submissions
  created_at   timestamptz not null default now()
);

-- Phase 5: "who's playing now" check-ins
create table check_ins (
  id          uuid primary key default gen_random_uuid(),
  court_id    uuid not null references courts (id) on delete cascade,
  user_id     uuid not null references auth.users (id),
  skill_level text,                                -- e.g. '3.0', '3.5'
  created_at  timestamptz not null default now(),
  expires_at  timestamptz not null default now() + interval '2 hours'
);

-- Row Level Security: anyone can read approved courts; signed-in users can submit.
alter table courts enable row level security;
alter table check_ins enable row level security;

create policy "read approved courts" on courts
  for select using (approved);

create policy "signed-in users submit courts" on courts
  for insert to authenticated with check (created_by = auth.uid());

create policy "read active check-ins" on check_ins
  for select using (expires_at > now());

create policy "users check themselves in" on check_ins
  for insert to authenticated with check (user_id = auth.uid());
