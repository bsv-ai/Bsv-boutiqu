-- Bâtir Sa Valeur — règles de sécurité (Row Level Security)
-- À exécuter après 0001_schema.sql.

-- Fonction utilitaire : est-ce que l'utilisateur connecté est admin ?
-- (security definer pour éviter la récursion des policies sur profiles)
create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- ===================== PRODUCTS =====================
alter table public.products enable row level security;

create policy "products_public_read_active" on public.products
  for select using (active = true or public.is_admin());

create policy "products_admin_write" on public.products
  for insert with check (public.is_admin());
create policy "products_admin_update" on public.products
  for update using (public.is_admin());
create policy "products_admin_delete" on public.products
  for delete using (public.is_admin());

-- ===================== ORDERS =====================
alter table public.orders enable row level security;

-- Tout le monde peut créer une commande (achat sans inscription)
create policy "orders_public_insert" on public.orders
  for insert with check (true);

-- Seul l'admin peut consulter les commandes
create policy "orders_admin_read" on public.orders
  for select using (public.is_admin());

-- ===================== SITE SETTINGS =====================
alter table public.site_settings enable row level security;

create policy "settings_public_read" on public.site_settings
  for select using (true);

create policy "settings_admin_update" on public.site_settings
  for update using (public.is_admin());

-- ===================== SITE VISITS =====================
alter table public.site_visits enable row level security;

create policy "visits_public_insert" on public.site_visits
  for insert with check (true);

create policy "visits_admin_read" on public.site_visits
  for select using (public.is_admin());

-- ===================== PROFILES =====================
alter table public.profiles enable row level security;

create policy "profiles_self_read" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

create policy "profiles_self_update" on public.profiles
  for update using (id = auth.uid());

create policy "profiles_self_insert" on public.profiles
  for insert with check (id = auth.uid());

-- ===================== MEMBER PROGRESS =====================
alter table public.member_progress enable row level security;

create policy "progress_self_read" on public.member_progress
  for select using (member_id = auth.uid() or public.is_admin());

create policy "progress_self_write" on public.member_progress
  for insert with check (member_id = auth.uid());

create policy "progress_self_update" on public.member_progress
  for update using (member_id = auth.uid());

-- ===================== PROSPECTS (CRM) =====================
alter table public.prospects enable row level security;

create policy "prospects_self_read" on public.prospects
  for select using (member_id = auth.uid() or public.is_admin());

create policy "prospects_self_insert" on public.prospects
  for insert with check (member_id = auth.uid());

create policy "prospects_self_update" on public.prospects
  for update using (member_id = auth.uid());

create policy "prospects_self_delete" on public.prospects
  for delete using (member_id = auth.uid());

-- ===================== ASSISTANT CONVERSATIONS =====================
alter table public.assistant_conversations enable row level security;

create policy "assistant_self_read" on public.assistant_conversations
  for select using (member_id = auth.uid() or public.is_admin());

create policy "assistant_self_insert" on public.assistant_conversations
  for insert with check (member_id = auth.uid());

-- ===================== COMMUNITY POSTS =====================
alter table public.community_posts enable row level security;

create policy "community_public_read" on public.community_posts
  for select using (true);

create policy "community_admin_insert" on public.community_posts
  for insert with check (public.is_admin());
create policy "community_admin_update" on public.community_posts
  for update using (public.is_admin());
create policy "community_admin_delete" on public.community_posts
  for delete using (public.is_admin());
