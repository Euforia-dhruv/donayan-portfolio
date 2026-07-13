-- ============================================================
-- Donayan Portfolio — Complete Supabase Schema
-- Matches admin CRUD pages column-for-column
-- ============================================================

-- 1. CATEGORIES
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  created_at  timestamptz not null default now()
);

-- 2. PROJECTS
create table if not exists public.projects (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  slug          text not null unique,
  category      text,
  year          text,
  description   text,
  thumbnail_url text,
  images        jsonb default '[]'::jsonb,
  video_url     text,
  featured      boolean not null default false,
  sort_order    int not null default 0,
  created_at    timestamptz not null default now()
);

-- 3. WALL ITEMS
create table if not exists public.wall_items (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  image_url   text not null,
  category    text,
  orientation text not null default 'landscape' check (orientation in ('portrait','landscape','square')),
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

-- 4. MEDIA LIBRARY
create table if not exists public.media (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  url        text not null,
  type       text not null default 'image' check (type in ('image','video','document','other')),
  size       bigint,
  alt_text   text,
  created_at timestamptz not null default now()
);

-- 5. TIMELINE ENTRIES
create table if not exists public.timeline_entries (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  subtitle    text,
  date        text not null,
  description text,
  media_url   text,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

-- 6. TESTIMONIALS
create table if not exists public.testimonials (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  role       text,
  company    text,
  content    text not null,
  avatar_url text,
  rating     int not null default 5 check (rating >= 1 and rating <= 5),
  featured   boolean not null default false,
  created_at timestamptz not null default now()
);

-- 7. ABOUT
create table if not exists public.about (
  id          uuid primary key default gen_random_uuid(),
  bio         text not null default '',
  photo_url   text,
  skills      jsonb default '[]'::jsonb,
  experience  text,
  email       text,
  social_links jsonb default '{}'::jsonb,
  resume_url  text,
  created_at  timestamptz not null default now()
);

-- 8. SETTINGS
create table if not exists public.settings (
  id              uuid primary key default gen_random_uuid(),
  site_name       text not null default 'Donayan',
  site_description text not null default 'Design, Photography & Creative Direction',
  seo_title       text not null default 'Donayan — Portfolio',
  seo_description text not null default 'Design, Photography & Creative Direction',
  og_title        text not null default 'Donayan',
  og_description  text not null default 'Design, Photography & Creative Direction',
  contact_email   text,
  social_links    jsonb default '{}'::jsonb,
  created_at      timestamptz not null default now()
);

-- 9. CONTACT MESSAGES
create table if not exists public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  message    text not null,
  read       boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists idx_projects_featured on projects(featured) where featured = true;
create index if not exists idx_projects_sort on projects(sort_order);
create index if not exists idx_wall_items_sort on wall_items(sort_order);
create index if not exists idx_timeline_sort on timeline_entries(sort_order);
create index if not exists idx_testimonials_featured on testimonials(featured) where featured = true;
create index if not exists idx_contact_messages_read on contact_messages(read);
create index if not exists idx_contact_messages_created on contact_messages(created_at desc);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table if exists public.categories enable row level security;
alter table if exists public.projects enable row level security;
alter table if exists public.wall_items enable row level security;
alter table if exists public.media enable row level security;
alter table if exists public.timeline_entries enable row level security;
alter table if exists public.testimonials enable row level security;
alter table if exists public.about enable row level security;
alter table if exists public.settings enable row level security;
alter table if exists public.contact_messages enable row level security;

-- Authenticated users (admins) have full access
do $$ begin
  create policy "Admin all categories" on public.categories for all using (auth.role() = 'authenticated');
exception when unique_violation then null; end; $$;
do $$ begin
  create policy "Admin all projects" on public.projects for all using (auth.role() = 'authenticated');
exception when unique_violation then null; end; $$;
do $$ begin
  create policy "Admin all wall_items" on public.wall_items for all using (auth.role() = 'authenticated');
exception when unique_violation then null; end; $$;
do $$ begin
  create policy "Admin all media" on public.media for all using (auth.role() = 'authenticated');
exception when unique_violation then null; end; $$;
do $$ begin
  create policy "Admin all timeline_entries" on public.timeline_entries for all using (auth.role() = 'authenticated');
exception when unique_violation then null; end; $$;
do $$ begin
  create policy "Admin all testimonials" on public.testimonials for all using (auth.role() = 'authenticated');
exception when unique_violation then null; end; $$;
do $$ begin
  create policy "Admin all about" on public.about for all using (auth.role() = 'authenticated');
exception when unique_violation then null; end; $$;
do $$ begin
  create policy "Admin all settings" on public.settings for all using (auth.role() = 'authenticated');
exception when unique_violation then null; end; $$;
do $$ begin
  create policy "Admin all contact_messages" on public.contact_messages for all using (auth.role() = 'authenticated');
exception when unique_violation then null; end; $$;

-- Public read access for portfolio data
do $$ begin
  create policy "Public read categories" on public.categories for select using (true);
exception when unique_violation then null; end; $$;
do $$ begin
  create policy "Public read projects" on public.projects for select using (true);
exception when unique_violation then null; end; $$;
do $$ begin
  create policy "Public read wall_items" on public.wall_items for select using (true);
exception when unique_violation then null; end; $$;
do $$ begin
  create policy "Public read media" on public.media for select using (true);
exception when unique_violation then null; end; $$;
do $$ begin
  create policy "Public read timeline_entries" on public.timeline_entries for select using (true);
exception when unique_violation then null; end; $$;
do $$ begin
  create policy "Public read testimonials" on public.testimonials for select using (true);
exception when unique_violation then null; end; $$;
do $$ begin
  create policy "Public read about" on public.about for select using (true);
exception when unique_violation then null; end; $$;

-- Public insert for contact messages
do $$ begin
  create policy "Public insert contact_messages" on public.contact_messages for insert with check (true);
exception when unique_violation then null; end; $$;

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
insert into storage.buckets (id, name, public) values
  ('images', 'images', true),
  ('videos', 'videos', true),
  ('documents', 'documents', true),
  ('thumbnails', 'thumbnails', true)
on conflict (id) do nothing;

-- Storage policies (idempotent)
do $$ begin
  create policy "Public read storage" on storage.objects for select using (true);
exception when unique_violation then null; end; $$;
do $$ begin
  create policy "Admin write storage" on storage.objects for insert with check (auth.role() = 'authenticated');
exception when unique_violation then null; end; $$;
do $$ begin
  create policy "Admin update storage" on storage.objects for update using (auth.role() = 'authenticated');
exception when unique_violation then null; end; $$;
do $$ begin
  create policy "Admin delete storage" on storage.objects for delete using (auth.role() = 'authenticated');
exception when unique_violation then null; end; $$;

-- ============================================================
-- DEFAULT SEED DATA
-- ============================================================
insert into public.settings (site_name, site_description, seo_title, seo_description, og_title, og_description, contact_email)
values ('Donayan', 'Design, Photography & Creative Direction', 'Donayan — Portfolio', 'Design, Photography & Creative Direction', 'Donayan', 'Design, Photography & Creative Direction', 'donayan@example.com')
on conflict do nothing;

insert into public.about (bio) values ('')
on conflict do nothing;
