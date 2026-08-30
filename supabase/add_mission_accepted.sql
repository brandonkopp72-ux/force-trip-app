-- =============================================================================
-- FORCE — Add per-person "mission accepted" persistence
-- Paste this ENTIRE file into the Supabase SQL Editor and click "Run".
-- Safe to re-run if something fails partway.
--
-- This lets a returning family member skip the cinematic onboarding on
-- future logins, and lets that status follow them across devices — the
-- same reasoning already used for preferences/votes in the original setup.
-- =============================================================================

-- 1. Add the column itself. Defaults to false for everyone, including the
--    six existing rows, so nobody is silently marked "done" by this migration.
alter table family_members
  add column if not exists mission_accepted boolean not null default false;

-- 2. Expose it through the existing public-safe view (id + name only before
--    this). mission_accepted is not sensitive — same treatment as name.
drop view if exists family_members_public;
create view family_members_public as
  select id, name, mission_accepted from family_members;

grant select on family_members_public to anon;

-- 3. The only way to SET this flag — validates the PIN server-side first,
--    exactly like every other write in this app. Includes the
--    `extensions` schema in search_path so crypt() resolves correctly
--    (the same fix that was needed for the original PIN functions).
create or replace function mark_mission_accepted(p_person text, p_pin text)
returns void
language plpgsql
security definer
set search_path = public, extensions
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

  update family_members set mission_accepted = true where id = v_member_id;
end;
$$;

grant execute on function mark_mission_accepted(text, text) to anon;

-- 4. Force Supabase's API layer to pick up the new function/view immediately
--    rather than waiting on its own cache — this is the step that caused
--    confusion the first time around, so it's included proactively here.
NOTIFY pgrst, 'reload schema';

-- =============================================================================
-- DONE. No further setup needed — the app already knows how to use this.
-- =============================================================================
