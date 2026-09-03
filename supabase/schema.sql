-- Our Evidence Box — database schema
-- Run this once in your Supabase project's SQL editor (Dashboard -> SQL Editor -> New query).
-- Safe to re-run: uses "if not exists" / "or replace" where possible.

-- ---------------------------------------------------------------------------
-- profiles: one row per allowed user, auto-created when an admin adds them
-- in Authentication -> Users. Only used for a friendly display name.
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  color text not null default '#d46a8f',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles are readable by any signed-in user" on public.profiles;
create policy "profiles are readable by any signed-in user"
  on public.profiles for select
  to authenticated
  using (true);

drop policy if exists "users can update their own profile" on public.profiles;
create policy "users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user is created (i.e. whenever
-- you add Emma or Max in the Supabase dashboard).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------------
-- evidence: every uploaded item — a photo, a document, or a written note.
-- ---------------------------------------------------------------------------
create table if not exists public.evidence (
  id uuid primary key default gen_random_uuid(),
  uploader_id uuid not null references auth.users (id) on delete cascade,
  category text not null check (category in ('financial', 'household', 'social', 'commitment', 'memory')),
  kind text not null check (kind in ('photo', 'document', 'note')),
  title text not null,
  description text not null default '',
  file_path text,
  file_mime text,
  file_name text,
  event_date date not null default current_date,
  created_at timestamptz not null default now()
);

create index if not exists evidence_event_date_idx on public.evidence (event_date desc);
create index if not exists evidence_category_idx on public.evidence (category);

alter table public.evidence enable row level security;

-- Every signed-in user (i.e. both of you) can see, add, edit and delete any
-- entry — this is a shared, joint archive, not separated by account.
drop policy if exists "evidence is shared between signed-in users" on public.evidence;
create policy "evidence is shared between signed-in users"
  on public.evidence for select
  to authenticated
  using (true);

drop policy if exists "signed-in users can insert evidence" on public.evidence;
create policy "signed-in users can insert evidence"
  on public.evidence for insert
  to authenticated
  with check (auth.uid() = uploader_id);

drop policy if exists "signed-in users can update evidence" on public.evidence;
create policy "signed-in users can update evidence"
  on public.evidence for update
  to authenticated
  using (true);

drop policy if exists "signed-in users can delete evidence" on public.evidence;
create policy "signed-in users can delete evidence"
  on public.evidence for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- app_settings: a single row holding small shared settings, e.g. the date
-- your relationship began, used for the "days together" counter.
-- ---------------------------------------------------------------------------
create table if not exists public.app_settings (
  id boolean primary key default true,
  relationship_start_date date,
  couple_note text,
  constraint app_settings_singleton check (id)
);

insert into public.app_settings (id) values (true) on conflict (id) do nothing;

alter table public.app_settings enable row level security;

drop policy if exists "settings readable by signed-in users" on public.app_settings;
create policy "settings readable by signed-in users"
  on public.app_settings for select
  to authenticated
  using (true);

drop policy if exists "settings updatable by signed-in users" on public.app_settings;
create policy "settings updatable by signed-in users"
  on public.app_settings for update
  to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- storage: private bucket for the actual files (photos/documents).
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('evidence', 'evidence', false)
on conflict (id) do nothing;

drop policy if exists "evidence bucket read for signed-in users" on storage.objects;
create policy "evidence bucket read for signed-in users"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'evidence');

drop policy if exists "evidence bucket insert for signed-in users" on storage.objects;
create policy "evidence bucket insert for signed-in users"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'evidence');

drop policy if exists "evidence bucket update for signed-in users" on storage.objects;
create policy "evidence bucket update for signed-in users"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'evidence');

drop policy if exists "evidence bucket delete for signed-in users" on storage.objects;
create policy "evidence bucket delete for signed-in users"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'evidence');
