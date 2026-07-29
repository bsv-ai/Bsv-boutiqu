-- Bâtir Sa Valeur — règles de sécurité (Row Level Security)
-- À exécuter après 0001_schema.sql.

-- Fonction utilitaire : est-ce que l'utilisateur connecté est admin (côté BSV) ?
-- Nommée "bsv_is_admin" (et non "is_admin") pour ne pas remplacer une fonction
-- du même nom appartenant à un autre outil sur ce projet Supabase.
create or replace function public.bsv_is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.bsv_profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- ===================== PRODUCTS =====================
alter table public.bsv_products enable row level security;

create policy "bsv_products_public_read_active" on public.bsv_products
  for select using (active = true or public.bsv_is_admin());

create policy "bsv_products_admin_write" on public.bsv_products
  for insert with check (public.bsv_is_admin());
create policy "bsv_products_admin_update" on public.bsv_products
  for update using (public.bsv_is_admin());
create policy "bsv_products_admin_delete" on public.bsv_products
  for delete using (public.bsv_is_admin());

-- ===================== ORDERS =====================
alter table public.bsv_orders enable row level security;

-- Tout le monde peut créer une commande (achat sans inscription)
create policy "bsv_orders_public_insert" on public.bsv_orders
  for insert with check (true);

-- Seul l'admin peut consulter les commandes
create policy "bsv_orders_admin_read" on public.bsv_orders
  for select using (public.bsv_is_admin());

-- ===================== SITE SETTINGS =====================
alter table public.bsv_site_settings enable row level security;

create policy "bsv_settings_public_read" on public.bsv_site_settings
  for select using (true);

create policy "bsv_settings_admin_update" on public.bsv_site_settings
  for update using (public.bsv_is_admin());

-- ===================== SITE VISITS =====================
alter table public.bsv_site_visits enable row level security;

create policy "bsv_visits_public_insert" on public.bsv_site_visits
  for insert with check (true);

create policy "bsv_visits_admin_read" on public.bsv_site_visits
  for select using (public.bsv_is_admin());

-- ===================== PROFILES (BSV) =====================
alter table public.bsv_profiles enable row level security;

create policy "bsv_profiles_self_read" on public.bsv_profiles
  for select using (id = auth.uid() or public.bsv_is_admin());

create policy "bsv_profiles_self_update" on public.bsv_profiles
  for update using (id = auth.uid());

create policy "bsv_profiles_self_insert" on public.bsv_profiles
  for insert with check (id = auth.uid());

-- ===================== MEMBER PROGRESS =====================
alter table public.bsv_member_progress enable row level security;

create policy "bsv_progress_self_read" on public.bsv_member_progress
  for select using (member_id = auth.uid() or public.bsv_is_admin());

create policy "bsv_progress_self_write" on public.bsv_member_progress
  for insert with check (member_id = auth.uid());

create policy "bsv_progress_self_update" on public.bsv_member_progress
  for update using (member_id = auth.uid());

-- ===================== PROSPECTS (CRM) =====================
alter table public.bsv_prospects enable row level security;

create policy "bsv_prospects_self_read" on public.bsv_prospects
  for select using (member_id = auth.uid() or public.bsv_is_admin());

create policy "bsv_prospects_self_insert" on public.bsv_prospects
  for insert with check (member_id = auth.uid());

create policy "bsv_prospects_self_update" on public.bsv_prospects
  for update using (member_id = auth.uid());

create policy "bsv_prospects_self_delete" on public.bsv_prospects
  for delete using (member_id = auth.uid());

-- ===================== ASSISTANT CONVERSATIONS =====================
alter table public.bsv_assistant_conversations enable row level security;

create policy "bsv_assistant_self_read" on public.bsv_assistant_conversations
  for select using (member_id = auth.uid() or public.bsv_is_admin());

create policy "bsv_assistant_self_insert" on public.bsv_assistant_conversations
  for insert with check (member_id = auth.uid());

-- ===================== COMMUNITY POSTS =====================
alter table public.bsv_community_posts enable row level security;

create policy "bsv_community_public_read" on public.bsv_community_posts
  for select using (true);

create policy "bsv_community_admin_insert" on public.bsv_community_posts
  for insert with check (public.bsv_is_admin());
create policy "bsv_community_admin_update" on public.bsv_community_posts
  for update using (public.bsv_is_admin());
create policy "bsv_community_admin_delete" on public.bsv_community_posts
  for delete using (public.bsv_is_admin());
