-- ============================================================
-- Donayan Portfolio — Complete Supabase Schema
-- ============================================================

-- 0. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 1. PROFILES (extends auth.users)
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text,
  name        text,
  avatar_url  text,
  role        text not null default 'admin' check (role in ('admin')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 2. CATEGORIES
create table public.categories (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  slug        text not null unique,
  description text,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 3. PROJECTS
create table public.projects (
  id              uuid primary key default uuid_generate_v4(),
  title           text not null,
  slug            text not null unique,
  brand           text,
  client          text,
  year            text,
  role            text,
  category_id     uuid references public.categories(id) on delete set null,
  description     text,
  body            text,
  featured        boolean not null default false,
  published       boolean not null default false,
  sort_order      int not null default 0,
  thumbnail       text,
  cover_image     text,
  gallery         jsonb default '[]'::jsonb,
  videos          jsonb default '[]'::jsonb,
  instagram_url   text,
  youtube_url     text,
  vimeo_url       text,
  credits         jsonb default '[]'::jsonb,
  tags            jsonb default '[]'::jsonb,
  talents         jsonb default '[]'::jsonb,
  documents       jsonb default '[]'::jsonb,
  meta_title      text,
  meta_description text,
  og_image        text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- 4. WALL ITEMS
create table public.wall_items (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  slug        text not null unique,
  client      text,
  year        text,
  category    text,
  description text,
  featured    boolean not null default false,
  thumbnail   text,
  cover_image text,
  gallery     jsonb default '[]'::jsonb,
  videos      jsonb default '[]'::jsonb,
  instagram_url text,
  youtube_url text,
  vimeo_url   text,
  credits     jsonb default '[]'::jsonb,
  tags        jsonb default '[]'::jsonb,
  sort_order  int not null default 0,
  published   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 5. MEDIA
create table public.media (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  file_name   text not null,
  file_type   text not null,
  file_size   int,
  url         text not null,
  bucket      text not null,
  folder      text default '/',
  width       int,
  height      int,
  alt         text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 6. TIMELINE ENTRIES
create table public.timeline_entries (
  id                uuid primary key default uuid_generate_v4(),
  role_title        text not null,
  company           text,
  production_house_id text,
  description       text,
  start_date        text,
  end_date          text,
  current_job       boolean not null default false,
  employment_type   text,
  tags              jsonb default '[]'::jsonb,
  sort_order        int not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- 7. TESTIMONIALS
create table public.testimonials (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  company     text,
  quote       text not null,
  image       text,
  position    text,
  featured    boolean not null default false,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 8. SETTINGS (key-value store for site content)
create table public.settings (
  id          uuid primary key default uuid_generate_v4(),
  key         text not null unique,
  value       jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 9. CONTACT MESSAGES
create table public.contact_messages (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  email       text not null,
  phone       text,
  subject     text,
  message     text not null,
  status      text not null default 'unread' check (status in ('unread','read','archived')),
  created_at  timestamptz not null default now()
);

-- 10. TAGS
create table public.tags (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null unique,
  slug        text not null unique,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- INDEXES
-- ============================================================
create index idx_projects_category on projects(category_id);
create index idx_projects_featured on projects(featured) where featured = true;
create index idx_projects_published on projects(published) where published = true;
create index idx_projects_sort on projects(sort_order);
create index idx_wall_items_sort on wall_items(sort_order);
create index idx_timeline_sort on timeline_entries(sort_order);
create index idx_testimonials_sort on testimonials(sort_order);
create index idx_contact_messages_status on contact_messages(status);
create index idx_contact_messages_created on contact_messages(created_at desc);
create index idx_media_type on media(file_type);
create index idx_settings_key on settings(key);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.projects enable row level security;
alter table public.wall_items enable row level security;
alter table public.media enable row level security;
alter table public.timeline_entries enable row level security;
alter table public.testimonials enable row level security;
alter table public.settings enable row level security;
alter table public.contact_messages enable row level security;
alter table public.tags enable row level security;

-- Admins have full access to all tables
create policy "Admins full access profiles" on public.profiles for all using (auth.role() = 'authenticated');
create policy "Admins full access categories" on public.categories for all using (auth.role() = 'authenticated');
create policy "Admins full access projects" on public.projects for all using (auth.role() = 'authenticated');
create policy "Admins full access wall_items" on public.wall_items for all using (auth.role() = 'authenticated');
create policy "Admins full access media" on public.media for all using (auth.role() = 'authenticated');
create policy "Admins full access timeline_entries" on public.timeline_entries for all using (auth.role() = 'authenticated');
create policy "Admins full access testimonials" on public.testimonials for all using (auth.role() = 'authenticated');
create policy "Admins full access settings" on public.settings for all using (auth.role() = 'authenticated');
create policy "Admins full access contact_messages" on public.contact_messages for all using (auth.role() = 'authenticated');
create policy "Admins full access tags" on public.tags for all using (auth.role() = 'authenticated');

-- Public read access for non-sensitive data
create policy "Public read projects" on public.projects for select using (published = true);
create policy "Public read wall_items" on public.wall_items for select using (published = true);
create policy "Public read categories" on public.categories for select using (true);
create policy "Public read timeline_entries" on public.timeline_entries for select using (true);
create policy "Public read testimonials" on public.testimonials for select using (true);
create policy "Public read media" on public.media for select using (true);
create policy "Public read tags" on public.tags for select using (true);

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
insert into storage.buckets (id, name, public) values
  ('projects', 'projects', true),
  ('covers', 'covers', true),
  ('gallery', 'gallery', true),
  ('videos', 'videos', true),
  ('thumbnails', 'thumbnails', true),
  ('avatars', 'avatars', true),
  ('documents', 'documents', true)
on conflict (id) do nothing;

-- Storage policies
create policy "Public read storage" on storage.objects for select using (bucket_id in ('projects','covers','gallery','videos','thumbnails','avatars','documents'));
create policy "Admin write storage" on storage.objects for insert using (auth.role() = 'authenticated');
create policy "Admin update storage" on storage.objects for update using (auth.role() = 'authenticated');
create policy "Admin delete storage" on storage.objects for delete using (auth.role() = 'authenticated');

-- ============================================================
-- TRIGGER: auto-create profile on signup
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'name', 'admin');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- DEFAULT SETTINGS
-- ============================================================
insert into public.settings (key, value) values
  ('site_name', '"DONAYAN SAHDEV"'),
  ('site_tagline', '"Director''s Assistant & Associate Producer"'),
  ('site_description', '"60+ commercial productions across India''s biggest brands."'),
  ('seo_title', '"Donayan Sahdev — Director''s Assistant & Associate Producer"'),
  ('seo_description', '"Mumbai-based Director''s Assistant and Associate Producer."'),
  ('social_links', '{"instagram":"","linkedin":"https://linkedin.com/in/donayansahdev","email":"donayan@example.com","phone":"+91 98765 43210"}'),
  ('hero', '{"introLine":"Helping directors execute ambitious commercial productions with precision.","ctaPrimary":"Explore Production Log →"}'),
  ('about_title', '"Bridging creative vision and production execution."'),
  ('about_body', '"With over five years in commercial production..."'),
  ('contact', '{"header":"Let''s work together.","intro":"Available for freelance and in-house productions in Mumbai and across India.","location":"Mumbai, India"}'),
  ('footer', '{"copyright":"© 2026 Donayan Sahdev. All rights reserved.","resumeLabel":"Download Resume"}')
on conflict (key) do nothing;
