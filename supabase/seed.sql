-- Bâtir Sa Valeur — données de démonstration (facultatif)
-- À exécuter après 0001_schema.sql et 0002_rls.sql, avec la clé "service_role"
-- (SQL editor Supabase l'utilise déjà par défaut, donc les policies n'empêchent pas ce script).

insert into public.products (active, price, image_url, name_fr, desc_fr, long_fr, name_en, desc_en, long_en) values
(true, 15000, 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=800&auto=format&fit=crop',
 'Savon noir artisanal', 'Gommage naturel, peau douce et nette.',
 'Savon noir traditionnel préparé à base de beurre de karité et d''huiles naturelles. Idéal pour exfolier en douceur et unifier le teint.',
 'Handmade black soap', 'Natural exfoliant for smooth, clear skin.',
 'Traditional black soap made with shea butter and natural oils. Gently exfoliates and evens skin tone.'),
(true, 8500, 'https://images.unsplash.com/photo-1615486511262-c7ff3bfa8fa0?q=80&w=800&auto=format&fit=crop',
 'Beurre de karité pur', '100% naturel, non raffiné.',
 'Beurre de karité brut, extrait à froid pour préserver toutes ses vertus nourrissantes.',
 'Pure shea butter', '100% natural, unrefined.',
 'Raw shea butter, cold-extracted to preserve its nourishing properties.'),
(true, 25000, 'https://images.unsplash.com/photo-1610824352934-c10d87b700cc?q=80&w=800&auto=format&fit=crop',
 'Sac tissé wax', 'Fait main, motifs colorés.',
 'Sac fourre-tout en tissu wax, cousu à la main par des artisans locaux. Résistant et unique.',
 'Wax woven tote bag', 'Handmade, bold patterns.',
 'Tote bag made from wax fabric, hand-sewn by local artisans. Sturdy and one of a kind.'),
(true, 12000, 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?q=80&w=800&auto=format&fit=crop',
 'Bijou perles africaines', 'Collier fait main, édition limitée.',
 'Collier en perles africaines assemblé à la main. Pièce unique.',
 'African bead jewelry', 'Handmade necklace, limited edition.',
 'Necklace made from hand-assembled African beads. A unique piece.'),
(true, 6000, 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=800&auto=format&fit=crop',
 'Huile de coco vierge', 'Pressée à froid, usage cheveux & peau.',
 'Huile de coco vierge, pressée à froid pour garder tous ses bienfaits.',
 'Virgin coconut oil', 'Cold-pressed, for hair & skin.',
 'Virgin coconut oil, cold-pressed to retain all its benefits.'),
(true, 18000, 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?q=80&w=800&auto=format&fit=crop',
 'Ensemble bougies parfumées', 'Lot de 3, senteurs douces.',
 'Ensemble de 3 bougies artisanales aux senteurs douces et enveloppantes.',
 'Scented candle set', 'Set of 3, soft fragrances.',
 'Set of 3 handmade candles with soft, comforting scents.')
on conflict do nothing;

update public.site_settings set
  site_title = 'Bâtir Sa Valeur',
  whatsapp_number = '2250594013027',
  phone_number = '0594013027',
  channel_link = 'https://whatsapp.com/channel/0029Vb7S2R5LY6d8JWXyoN3g',
  facebook_link = 'https://www.facebook.com/share/1EEUnKxsDK/',
  tiktok_link = 'https://www.tiktok.com/@batirsavaleur',
  cover_image_url = 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1600&auto=format&fit=crop',
  accent_color = '#C89B3C'
where id = 1;

insert into public.community_posts (type, title, content) values
('actualité', 'Nouveau contenu de la semaine', 'Nouveau contenu de la semaine 5 disponible sur la chaîne WhatsApp.'),
('actualité', 'Soirée bilan', 'Rappel : soirée bilan de fin de mois vendredi.'),
('actualité', 'Nouveaux membres', '3 nouveaux membres ont rejoint ADN cette semaine.'),
('événement', 'Session d''intégration', 'Session d''intégration en ligne — samedi 20h.'),
('événement', 'Formation posture & vente', 'Formation posture & vente — mardi 19h.'),
('événement', 'Réunion d''équipe mensuelle', 'Réunion d''équipe mensuelle — le 1er du mois.'),
('formation', 'Fondamentaux du marketing relationnel', 'Les fondamentaux du marketing relationnel.'),
('formation', 'Créer son contenu', 'Créer son contenu avec authenticité.'),
('formation', 'Gérer les objections', 'Gérer les objections avec confiance.'),
('témoignage', 'Membre depuis 6 mois', 'Rejoindre ADN a changé ma façon de voir l''entrepreneuriat.'),
('témoignage', 'Membre depuis 1 an', 'Le système de duplication rend tout plus clair.'),
('challenge', 'Défi 5 contacts', 'Échanger avec 5 nouveaux prospects cette semaine et les ajouter au CRM.')
on conflict do nothing;
