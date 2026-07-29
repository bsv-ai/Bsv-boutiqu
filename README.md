# Bâtir Sa Valeur — Site unique (Boutique + Espace ADN)

Ce dépôt contient le site complet : la boutique publique et l'Espace ADN (communauté, parcours,
CRM, assistant IA), réunis dans un seul projet Next.js avec Supabase comme base de données.

Ce guide part du principe que vous n'avez **jamais utilisé de terminal ni codé**. Suivez les
étapes dans l'ordre, une par une. Chaque commande à taper est dans un bloc gris — copiez-la
telle quelle.

---

## Étape 1 — Installer les outils de base (une seule fois)

1. Installez **Node.js** (version 20 ou plus) : allez sur https://nodejs.org, téléchargez la
   version "LTS" et installez-la comme un logiciel normal.
2. Installez **Git** si ce n'est pas déjà fait : https://git-scm.com/downloads.
3. Ouvrez un terminal :
   - Windows : cherchez "Terminal" ou "PowerShell" dans le menu Démarrer.
   - Mac : cherchez "Terminal" dans Spotlight (Cmd+Espace).

Vérifiez que tout est installé :

```
node -v
npm -v
git -v
```

Chaque commande doit afficher un numéro de version (pas d'erreur).

---

## Étape 2 — Récupérer le projet sur votre ordinateur

Si ce n'est pas déjà fait :

```
git clone <url-de-votre-depot>
cd Bsv-boutiqu
```

Puis installez les dépendances du projet (cela télécharge tout ce dont le site a besoin) :

```
npm install
```

---

## Étape 3 — Créer votre projet Supabase (la base de données)

Supabase héberge gratuitement vos données (produits, commandes, membres, prospects…).

1. Allez sur https://supabase.com et créez un compte gratuit.
2. Cliquez sur **New project**. Donnez-lui un nom (ex. `batir-sa-valeur`) et un mot de passe de
   base de données (notez-le quelque part, vous n'en aurez presque jamais besoin ensuite).
3. Attendez 1 à 2 minutes que le projet soit prêt.

### 3.1 — Créer les tables

1. Dans le menu de gauche, cliquez sur **SQL Editor**.
2. Cliquez sur **New query**.
3. Ouvrez le fichier `supabase/migrations/0001_schema.sql` de ce projet, copiez tout son
   contenu, collez-le dans l'éditeur SQL de Supabase, puis cliquez sur **Run**.
4. Recommencez la même opération avec `supabase/migrations/0002_rls.sql` (les règles de
   sécurité — très important, ne sautez pas cette étape).
5. (Optionnel mais recommandé pour tester) Recommencez avec `supabase/seed.sql` : cela ajoute
   des produits de démonstration et du contenu pour l'Espace ADN.

### 3.2 — Récupérer vos clés

1. Dans le menu de gauche, allez dans **Project Settings** → **API**.
2. Vous avez besoin de trois valeurs :
   - **Project URL** → ce sera `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → ce sera `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** (cliquez sur "Reveal") → ce sera `SUPABASE_SERVICE_ROLE_KEY`
     (⚠️ cette clé est secrète, ne la partagez jamais et ne la mettez jamais dans un fichier
     public)

---

## Étape 4 — Obtenir une clé API Anthropic (pour l'assistant IA)

1. Allez sur https://console.anthropic.com et créez un compte.
2. Dans **API Keys**, créez une nouvelle clé.
3. Copiez-la : ce sera `ANTHROPIC_API_KEY`. Vous devrez ajouter du crédit sur le compte pour que
   l'assistant fonctionne (quelques dollars suffisent pour commencer).

---

## Étape 5 — Configurer les variables d'environnement

À la racine du projet, créez un fichier nommé exactement `.env.local` (vous pouvez copier
`.env.local.example` et le renommer) avec ce contenu, en remplaçant chaque valeur par la vôtre :

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxxxxxxxxxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxxxxxxxxxxxxxxxxxx
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxx
```

Ce fichier ne doit **jamais** être partagé ni envoyé sur GitHub (il est déjà exclu automatiquement
via `.gitignore`).

---

## Étape 6 — Lancer le site en local

```
npm run dev
```

Ouvrez votre navigateur sur http://localhost:3000 — la boutique doit s'afficher avec les
produits de démonstration.

---

## Étape 7 — Créer votre compte administrateur

1. Sur le site (en local ou une fois déployé), allez sur `/connexion` et créez un compte membre
   normal avec votre propre email (onglet "Créer un compte").
2. Retournez dans Supabase → **Table Editor** → table `profiles`.
3. Trouvez la ligne correspondant à votre compte (votre email n'apparaît pas directement dans
   cette table, mais vous pouvez retrouver votre `id` dans **Authentication** → **Users**).
4. Modifiez la colonne `role` de `member` à `admin` pour cette ligne, puis sauvegardez.
5. Reconnectez-vous sur le site : un bouton **Admin** apparaît maintenant dans le menu, et
   `/admin` vous est accessible.

---

## Étape 8 — Tester le site de bout en bout

- **Boutique** : parcourez `/catalogue`, ajoutez un produit au panier, passez une commande sur
  `/checkout`, vérifiez que le message WhatsApp se prépare correctement sur `/confirmation`.
- **Espace ADN** : créez un second compte membre (pas admin), connectez-vous, cochez des étapes
  sur `/adn/parcours`, ajoutez un prospect sur `/adn/crm`, discutez avec l'assistant sur
  `/adn/assistant`.
- **Admin** : avec votre compte admin, vérifiez `/admin` (statistiques), `/admin/produits`
  (ajout/modification), `/admin/contacts`, `/admin/reglages`, `/admin/membres`.

---

## Étape 9 — Déployer sur Vercel (mettre le site en ligne)

1. Mettez votre code sur GitHub si ce n'est pas déjà fait (`git push`).
2. Allez sur https://vercel.com, créez un compte (vous pouvez vous connecter avec GitHub
   directement).
3. Cliquez sur **Add New** → **Project**, puis sélectionnez votre dépôt GitHub.
4. Dans la section **Environment Variables**, ajoutez les 4 mêmes variables que dans votre
   fichier `.env.local` (Étape 5).
5. Cliquez sur **Deploy**. Après 1 à 2 minutes, Vercel vous donne une adresse en
   `https://votre-projet.vercel.app`.
6. (Optionnel) Dans **Settings** → **Domains**, vous pouvez relier votre propre nom de domaine.

⚠️ Après le premier déploiement, retournez dans Supabase → **Authentication** → **URL
Configuration** et ajoutez l'adresse de votre site Vercel dans **Site URL** et **Redirect URLs**
(nécessaire pour que le lien magique et l'inscription fonctionnent correctement en production).

---

## Étape 10 — Installer le site comme application sur Android (PWA)

Une fois le site déployé en HTTPS (via Vercel) :

1. Ouvrez le site dans **Chrome** sur un téléphone Android.
2. Appuyez sur le menu (⋮) en haut à droite.
3. Choisissez **Installer l'application** (ou **Ajouter à l'écran d'accueil**).
4. L'icône du site apparaît alors sur l'écran d'accueil, comme une vraie application.

---

## Structure du projet (pour référence)

```
app/                      Pages du site (routing Next.js)
  page.js                 Accueil boutique (/)
  catalogue/, produit/, panier/, checkout/, confirmation/
  connexion/               Connexion / inscription membre ADN
  adn/                     Espace membre (communauté, parcours, crm, assistant)
  admin/                   Tableau de bord (réservé au rôle admin)
  api/assistant/           Route serveur qui appelle l'API Claude
components/                Composants réutilisables (boutique, adn, admin)
context/                   Panier, langue (état partagé côté client)
lib/                       Suqbase, thème, textes FR/EN, utilitaires
supabase/migrations/       Schéma SQL + règles de sécurité (RLS) à exécuter une fois
supabase/seed.sql          Données de démonstration (facultatif)
public/manifest.json, sw.js, icons/   PWA (installation sur mobile)
```

## Sécurité des données

- Un membre ADN ne voit que **ses propres** prospects et son propre historique avec l'assistant
  IA (appliqué directement par la base de données, pas seulement par le site).
- Seul le compte `admin` peut modifier les produits, les réglages du site et publier du contenu
  communautaire.
- Les commandes de la boutique ne sont visibles que par l'admin.
- La clé `ANTHROPIC_API_KEY` n'est jamais envoyée au navigateur : l'assistant IA appelle
  toujours l'API Claude depuis le serveur (`app/api/assistant/route.js`).
