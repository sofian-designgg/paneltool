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

**Tickets :** `DISCORD_BOT_TOKEN`, `DISCORD_GUILD_ID`, `DISCORD_TICKET_CATEGORY_ID`, `DISCORD_SUPPORT_ROLE_IDS`

**OAuth (client visible dans son ticket) :** Créer une app sur discord.com/developers/applications → OAuth2 → Redirect : `https://ton-site.vercel.app/api/auth/callback`  
Variables : `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`, `NEXT_PUBLIC_APP_URL`

Pour les IDs : Mode développeur Discord activé → clic droit → Copieridentifiant


 l’
## Images des produits

Place les images dans `public/images/` :
- `chatgpt.png`, `spotify.png`, `nba.png`, `ufc.png`, `youtube.png`, `netflix.png`, etc.
