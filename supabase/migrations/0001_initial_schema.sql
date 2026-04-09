create extension if not exists "uuid-ossp";

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create table public.resumes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null default 'Untitled Resume',
  template_id text not null default 'modern',
  is_public boolean not null default false,
  last_edited_at timestamp with time zone,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create table public.resume_sections (
  id uuid primary key default uuid_generate_v4(),
  resume_id uuid not null references public.resumes(id) on delete cascade,
  type text not null,
  title text not null,
  position integer not null,
  is_visible boolean not null default true,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint resume_sections_type_check check (
    type in (
      'personal_info',
      'experience',
      'education',
      'skills',
      'projects',
      'certifications',
      'languages',
      'custom'
    )
  )
);

create table public.section_items (
  id uuid primary key default uuid_generate_v4(),
  section_id uuid not null references public.resume_sections(id) on delete cascade,
  position integer not null,
  data jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create table public.templates (
  id text primary key,
  name text not null,
  description text not null,
  thumbnail_url text,
  is_premium boolean not null default false,
  category text not null
);

insert into public.templates (id, name, description, thumbnail_url, is_premium, category)
values
  ('modern', 'Modern', 'A clean, contemporary layout with strong hierarchy and flexible sections.', null, false, 'Professional'),
  ('classic', 'Classic', 'A traditional layout designed for readability, structure, and ATS friendliness.', null, false, 'Professional'),
  ('minimal', 'Minimal', 'A lightweight layout with generous spacing and a focused presentation.', null, false, 'Simple'),
  ('creative', 'Creative', 'A bold layout for distinctive resumes with visual personality and balanced emphasis.', null, false, 'Creative'),
  ('executive', 'Executive', 'A polished premium layout suited for senior roles and high-impact leadership profiles.', null, true, 'Premium');

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    nullif(new.raw_user_meta_data->>'avatar_url', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace function public.update_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create trigger update_resumes_updated_at
  before update on public.resumes
  for each row execute procedure public.update_updated_at();

create trigger update_resume_sections_updated_at
  before update on public.resume_sections
  for each row execute procedure public.update_updated_at();

create trigger update_section_items_updated_at
  before update on public.section_items
  for each row execute procedure public.update_updated_at();

alter table public.profiles enable row level security;
alter table public.resumes enable row level security;
alter table public.resume_sections enable row level security;
alter table public.section_items enable row level security;
alter table public.templates enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles
  for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles
  for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users can delete their own profile"
  on public.profiles
  for delete
  using (auth.uid() = id);

create policy "Users can view their own resumes and public resumes"
  on public.resumes
  for select
  using (auth.uid() = user_id or is_public = true);

create policy "Users can insert their own resumes"
  on public.resumes
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own resumes"
  on public.resumes
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own resumes"
  on public.resumes
  for delete
  using (auth.uid() = user_id);

create policy "Users can view sections for accessible resumes"
  on public.resume_sections
  for select
  using (
    exists (
      select 1
      from public.resumes
      where resumes.id = resume_sections.resume_id
        and (resumes.user_id = auth.uid() or resumes.is_public = true)
    )
  );

create policy "Users can insert sections for their own resumes"
  on public.resume_sections
  for insert
  with check (
    exists (
      select 1
      from public.resumes
      where resumes.id = resume_sections.resume_id
        and resumes.user_id = auth.uid()
    )
  );

create policy "Users can update sections for their own resumes"
  on public.resume_sections
  for update
  using (
    exists (
      select 1
      from public.resumes
      where resumes.id = resume_sections.resume_id
        and resumes.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.resumes
      where resumes.id = resume_sections.resume_id
        and resumes.user_id = auth.uid()
    )
  );

create policy "Users can delete sections for their own resumes"
  on public.resume_sections
  for delete
  using (
    exists (
      select 1
      from public.resumes
      where resumes.id = resume_sections.resume_id
        and resumes.user_id = auth.uid()
    )
  );

create policy "Users can view items for accessible resumes"
  on public.section_items
  for select
  using (
    exists (
      select 1
      from public.resume_sections
      join public.resumes on resumes.id = resume_sections.resume_id
      where resume_sections.id = section_items.section_id
        and (resumes.user_id = auth.uid() or resumes.is_public = true)
    )
  );

create policy "Users can insert items for their own resumes"
  on public.section_items
  for insert
  with check (
    exists (
      select 1
      from public.resume_sections
      join public.resumes on resumes.id = resume_sections.resume_id
      where resume_sections.id = section_items.section_id
        and resumes.user_id = auth.uid()
    )
  );

create policy "Users can update items for their own resumes"
  on public.section_items
  for update
  using (
    exists (
      select 1
      from public.resume_sections
      join public.resumes on resumes.id = resume_sections.resume_id
      where resume_sections.id = section_items.section_id
        and resumes.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.resume_sections
      join public.resumes on resumes.id = resume_sections.resume_id
      where resume_sections.id = section_items.section_id
        and resumes.user_id = auth.uid()
    )
  );

create policy "Users can delete items for their own resumes"
  on public.section_items
  for delete
  using (
    exists (
      select 1
      from public.resume_sections
      join public.resumes on resumes.id = resume_sections.resume_id
      where resume_sections.id = section_items.section_id
        and resumes.user_id = auth.uid()
    )
  );

create policy "Templates are publicly readable"
  on public.templates
  for select
  using (true);
