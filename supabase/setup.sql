-- =============================================================================
-- FORCE Trip App — Supabase setup script
-- Paste this ENTIRE file into the Supabase SQL Editor and click "Run".
-- Safe to re-run if something fails partway — uses IF NOT EXISTS / OR REPLACE
-- everywhere practical.
-- =============================================================================

-- Needed for PIN hashing (crypt/gen_salt). Supabase projects have this
-- available; this just makes sure it's turned on.
create extension if not exists pgcrypto;

-- -----------------------------------------------------------------------------
-- TABLES
-- -----------------------------------------------------------------------------

create table if not exists family_members (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  pin_hash text, -- set via the "assign PINs" step below, NOT edited by hand
  created_at timestamptz not null default now()
);

create table if not exists preferences (
  id uuid primary key default gen_random_uuid(),
  family_member_id uuid not null references family_members(id) on delete cascade,
  item_id text not null,
  preference text not null check (preference in ('must_do', 'interested', 'not_for_me', 'chosen')),
  updated_at timestamptz not null default now(),
  unique (family_member_id, item_id)
);

create index if not exists idx_preferences_item on preferences(item_id);
create index if not exists idx_preferences_member on preferences(family_member_id);

create table if not exists dinner_top_picks (
  family_member_id uuid primary key references family_members(id) on delete cascade,
  item_id text not null,
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- SEED THE SIX FAMILY MEMBERS (no PINs yet — you'll assign those next)
-- -----------------------------------------------------------------------------

insert into family_members (name)
values ('Brandon'), ('Melissa'), ('Ava'), ('Marissa'), ('Justin'), ('Levi')
on conflict (name) do nothing;

-- -----------------------------------------------------------------------------
-- RPC: verify_pin — used by the login screen. Returns true/false only,
-- never exposes the hash itself.
-- -----------------------------------------------------------------------------

create or replace function verify_pin(p_person text, p_pin text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_pin_hash text;
begin
  select pin_hash into v_pin_hash from family_members where name = p_person;
  if v_pin_hash is null then
    return false;
  end if;
  return crypt(p_pin, v_pin_hash) = v_pin_hash;
end;
$$;

-- -----------------------------------------------------------------------------
-- RPC: set_preference — the ONLY way preferences get written or cleared.
-- Validates the PIN server-side before touching any data. Pass NULL for
-- p_preference to clear (delete) that person's preference for that item.
-- -----------------------------------------------------------------------------

create or replace function set_preference(
  p_person text,
  p_pin text,
  p_item_id text,
  p_preference text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_member_id uuid;
  v_pin_hash text;
begin
  select id, pin_hash into v_member_id, v_pin_hash
  from family_members
  where name = p_person;

  if v_member_id is null then
    raise exception 'Unknown family member: %', p_person;
  end if;

  if v_pin_hash is null or crypt(p_pin, v_pin_hash) <> v_pin_hash then
    raise exception 'Invalid PIN';
  end if;

  if p_preference is null then
    delete from preferences
    where family_member_id = v_member_id and item_id = p_item_id;
  else
    if p_preference not in ('must_do', 'interested', 'not_for_me', 'chosen') then
      raise exception 'Invalid preference value: %', p_preference;
    end if;

    insert into preferences (family_member_id, item_id, preference, updated_at)
    values (v_member_id, p_item_id, p_preference, now())
    on conflict (family_member_id, item_id)
    do update set preference = excluded.preference, updated_at = now();
  end if;
end;
$$;

-- -----------------------------------------------------------------------------
-- RPC: set_single_choice — for mutually-exclusive picks (Droid Depot vs
-- Savi's, HHN meal strategy, Friday plan). Clears every other option in the
-- group for this person, then sets the chosen one (or clears all if
-- p_chosen_item_id is NULL, meaning "deselect").
-- -----------------------------------------------------------------------------

create or replace function set_single_choice(
  p_person text,
  p_pin text,
  p_group_item_ids text[],
  p_chosen_item_id text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_member_id uuid;
  v_pin_hash text;
begin
  select id, pin_hash into v_member_id, v_pin_hash
  from family_members
  where name = p_person;

  if v_member_id is null then
    raise exception 'Unknown family member: %', p_person;
  end if;

  if v_pin_hash is null or crypt(p_pin, v_pin_hash) <> v_pin_hash then
    raise exception 'Invalid PIN';
  end if;

  delete from preferences
  where family_member_id = v_member_id
    and item_id = any(p_group_item_ids);

  if p_chosen_item_id is not null then
    insert into preferences (family_member_id, item_id, preference, updated_at)
    values (v_member_id, p_chosen_item_id, 'chosen', now());
  end if;
end;
$$;

-- -----------------------------------------------------------------------------
-- RPC: set_top_dinner_pick — enforces "must have rated this restaurant Yes
-- (must_do) first" at the database level, not just in the UI.
-- -----------------------------------------------------------------------------

create or replace function set_top_dinner_pick(
  p_person text,
  p_pin text,
  p_item_id text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_member_id uuid;
  v_pin_hash text;
  v_rating text;
begin
  select id, pin_hash into v_member_id, v_pin_hash
  from family_members
  where name = p_person;

  if v_member_id is null then
    raise exception 'Unknown family member: %', p_person;
  end if;

  if v_pin_hash is null or crypt(p_pin, v_pin_hash) <> v_pin_hash then
    raise exception 'Invalid PIN';
  end if;

  select preference into v_rating
  from preferences
  where family_member_id = v_member_id and item_id = p_item_id;

  if v_rating is distinct from 'must_do' then
    raise exception 'You must rate this restaurant "Yes" before making it your Top Pick';
  end if;

  insert into dinner_top_picks (family_member_id, item_id, updated_at)
  values (v_member_id, p_item_id, now())
  on conflict (family_member_id)
  do update set item_id = excluded.item_id, updated_at = now();
end;
$$;

-- -----------------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- Reads: open (the family needs shared, realtime visibility of everyone's
--   preferences, and there's no real per-user auth to gate reads behind).
-- Writes: CLOSED at the table level. The only way to change data is through
--   the RPC functions above, which validate the PIN before doing anything.
-- family_members: reads are restricted to id+name only via a view, since the
--   raw table contains pin_hash and there's no reason to ship that to browsers.
-- -----------------------------------------------------------------------------

alter table family_members enable row level security;
alter table preferences enable row level security;
alter table dinner_top_picks enable row level security;

-- No direct policies on family_members for anon — nothing is readable/writable
-- directly. The app reads family names through the view below instead.
drop view if exists family_members_public;
create view family_members_public as
  select id, name from family_members;

grant select on family_members_public to anon;

drop policy if exists "preferences readable by anyone with the link" on preferences;
create policy "preferences readable by anyone with the link"
  on preferences for select
  to anon
  using (true);

-- Intentionally NO insert/update/delete policies on preferences or
-- dinner_top_picks for anon — this blocks direct table writes entirely.
-- All writes must go through the SECURITY DEFINER RPC functions above.

drop policy if exists "top picks readable by anyone with the link" on dinner_top_picks;
create policy "top picks readable by anyone with the link"
  on dinner_top_picks for select
  to anon
  using (true);

-- Let the anon role call the RPC functions (the functions themselves do the
-- real security check against the PIN — this grant just allows calling them).
grant execute on function verify_pin(text, text) to anon;
grant execute on function set_preference(text, text, text, text) to anon;
grant execute on function set_single_choice(text, text, text[], text) to anon;
grant execute on function set_top_dinner_pick(text, text, text) to anon;

-- -----------------------------------------------------------------------------
-- REALTIME
-- Turn on realtime replication for the preferences table so everyone's
-- screen updates live. In the Supabase Dashboard: Database → Replication →
-- toggle "preferences" on for the supabase_realtime publication.
-- The line below does the same thing via SQL, in case the UI toggle isn't
-- available on your plan/version — safe to run either way.
-- -----------------------------------------------------------------------------

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'preferences'
  ) then
    alter publication supabase_realtime add table preferences;
  end if;
end $$;

-- =============================================================================
-- DONE. Next step: assign the six PINs — see "Assigning PINs" in the README.
-- =============================================================================
