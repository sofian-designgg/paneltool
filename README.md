# Sayuri Shop 🛒

Site factice / démo pour présentation.

## Clé d'accès

`sayuribuy`

## Installation

```bash
npm install
```

## Développement

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## Déploiement sur Vercel

1. Créer un compte sur [vercel.com](https://vercel.com)
2. Connecter le dépôt Git ou importer le projet
3. Déployer (Vercel détecte automatiquement Next.js)

Ou avec la CLI :

```bash
npm i -g vercel
vercel
```

## Variables d'environnement (Vercel)

Pour la création de tickets depuis le site :

1. Vercel → Settings → Environment Variables
2. Ajouter :
   - `DISCORD_BOT_TOKEN` — Token de ton bot (comme dans Sayuri Shop bot)
   - `DISCORD_GUILD_ID` — ID du serveur Discord
   - `DISCORD_TICKET_CATEGORY_ID` — ID de la catégorie tickets (celle de `+ticketsetup`)
   - `DISCORD_SUPPORT_ROLE_IDS` — (optionnel) IDs des rôles support, séparés par des virgules

Pour obtenir les IDs : Discord → Paramètres → Avancés → Mode développeur (activé), puis clic droit sur serveur/catégorie/rôle → Copier l’identifiant.

## Images des produits

Place les images dans `public/images/` :
- `chatgpt.png`, `spotify.png`, `nba.png`, `ufc.png`, `youtube.png`, `netflix.png`, etc.
