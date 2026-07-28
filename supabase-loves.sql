-- Public "love" counter for the vandy.ro project cards.
-- Run in Supabase SQL Editor (project: nova-app-factory / cxamezffjphbbbswvhcw).
--
-- Security model: the site ships the PUBLIC anon key, so the table must not be
-- writable directly. Anon may only SELECT. The single write path is the
-- increment_love() function, which adds exactly +1 and nothing else.

create table if not exists public.project_loves (
  project_id text primary key,
  loves      integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.project_loves enable row level security;

-- Anyone may READ the counts.
drop policy if exists "project_loves read" on public.project_loves;
create policy "project_loves read" on public.project_loves
  for select to anon, authenticated using (true);

-- Deliberately NO insert/update/delete policies for anon.
create or replace function public.increment_love(p_project_id text)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  new_count integer;
begin
  update public.project_loves
     set loves = loves + 1,
         updated_at = now()
   where project_id = p_project_id
  returning loves into new_count;

  if new_count is null then
    raise exception 'unknown project_id: %', p_project_id;
  end if;

  return new_count;
end;
$$;

revoke all on function public.increment_love(text) from public;
grant execute on function public.increment_love(text) to anon, authenticated;

-- Seed starting counts (a few hundred to a few thousand).
insert into public.project_loves (project_id, loves) values
  ('dynasty',    2847),
  ('nowwwa',     1936),
  ('neotrader',  1204),
  ('swagg',       873),
  ('izzy',        642),
  ('blur',       1518),
  ('wizzywazza', 2103),
  ('dozain',      419),
  ('consult',     756)
on conflict (project_id) do nothing;
