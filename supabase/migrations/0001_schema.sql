-- Bâtir Sa Valeur — schéma complet (Boutique + Espace ADN)
-- Toutes les tables sont préfixées "bsv_" pour ne jamais entrer en conflit avec
-- d'autres projets qui partagent ce même projet Supabase (ex. Ardoise, qui a sa
-- propre table "profiles"). Rien ici ne touche aux tables d'un autre projet.
-- À exécuter une seule fois dans l'éditeur SQL de votre projet Supabase.

-- ===================== BOUTIQUE =====================

create table if not exists public.bsv_products (
  id uuid primary key default gen_random_uuid(),
  active boolean not null default true,
  price integer not null default 0,
  image_url text,
  name_fr text not null default '',
  desc_fr text not null default '',
  long_fr text not null default '',
  name_en text not null default '',
  desc_en text not null default '',
  long_en text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.bsv_orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  items jsonb not null default '[]',
  total integer not null default 0,
  customer_name text not null,
  customer_phone text not null,
  customer_city text,
  customer_address text,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.bsv_site_settings (
  id int primary key default 1,
  site_title text not null default 'Bâtir Sa Valeur',
  whatsapp_number text not null default '',
  phone_number text not null default '',
  channel_link text not null default '',
  facebook_link text not null default '',
  tiktok_link text not null default '',
  cover_image_url text not null default '',
  accent_color text not null default '#C89B3C',
  constraint bsv_settings_single_row check (id = 1)
);
insert into public.bsv_site_settings (id) values (1) on conflict (id) do nothing;

create table if not exists public.bsv_site_visits (
  id bigint generated always as identity primary key,
  visited_at timestamptz not null default now()
);

-- ===================== ESPACE ADN =====================

-- Table de profils propre à Bâtir Sa Valeur (distincte de toute table
-- "profiles" déjà présente sur ce projet Supabase pour un autre outil).
create table if not exists public.bsv_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'member' check (role in ('member', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.bsv_member_progress (
  member_id uuid not null references public.bsv_profiles (id) on delete cascade,
  step_id int not null check (step_id between 1 and 6),
  completed boolean not null default false,
  completed_at timestamptz,
  primary key (member_id, step_id)
);

create table if not exists public.bsv_prospects (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.bsv_profiles (id) on delete cascade,
  name text not null,
  phone text not null,
  status text not null default 'Nouveau' check (status in ('Nouveau', 'Contacté', 'Intéressé', 'Client', 'Perdu')),
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.bsv_assistant_conversations (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.bsv_profiles (id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.bsv_community_posts (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('actualité', 'événement', 'formation', 'témoignage', 'challenge')),
  title text not null,
  content text not null,
  created_at timestamptz not null default now()
);

-- Auto-crée une ligne dans bsv_profiles à chaque inscription Supabase Auth.
-- Le nom de la fonction et du trigger sont préfixés "bsv_" : ils ne peuvent
-- donc pas remplacer un trigger/une fonction déjà utilisés par un autre outil
-- sur ce même projet (contrairement à un nom générique comme
-- "on_auth_user_created", qui aurait pu écraser un trigger existant).
create or replace function public.bsv_handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.bsv_profiles (id, full_name, phone)
  values (new.id, new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'phone')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists bsv_on_auth_user_created on auth.users;
create trigger bsv_on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.bsv_handle_new_user();
