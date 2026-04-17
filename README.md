# Boutique Maillots - Monorepo (E-Commerce)

Ce projet est un système e-commerce complet avec backend Express/Prisma, un frontal en Next.js 14 et un crochet unique à WhatsApp pour la réception de commandes (idéal pour le drop-shipping, le M-Commerce PME).

## Structure du Projet

- `backend/` : Serveur Node.js (Express), Base de données PostgreSQL (Prisma ORM), Bot WhatsApp (whatsapp-web.js)
- `frontend/` : Application Web réactive en Next.js 14 avec App Router et Tailwind CSS.

## 🚀 Étape 1 : Installation Locale

1. **Prérequis** : Node.js (v18+ recommandé), PostgreSQL installé localement ou instance cloud.
2. Installer les dépendances dans chaque composant :
```bash
# Dans un terminal
cd backend
npm install

# Dans un autre terminal
cd frontend
npm install
```

## ⚙️ Étape 2 : Configuration

**Backend :**
1. Allez dans le dossier `backend` et modifiez le fichier `.env` existant ou créez-le à partir d'un template avec vos propres clés. 
2. Insérez votre URL de base de données (ex: `DATABASE_URL="postgresql://..."`).
3. Initiez les tables dans PostgreSQL via Prisma :
```bash
npx prisma db push
```

**Frontend :**
1. Modifiez ou créez le fichier `.env.local` du frontend si l'API est hébergée autre part que `localhost:3001` :
`NEXT_PUBLIC_API_URL="http://localhost:3001/api"`

## 🏃 Étape 3 : Démarrage

- **Backend** : `npm run dev` (Démarre sur le port `3001`).
- **Frontend** : `npm run dev` (Démarre sur le port `3000`).

La toute première fois que vous lancez le backend, observez le terminal Node : il générera un **QR Code massif**. Vous devez **scanner ce code avec votre appareil WhatsApp** disposant du numéro sur lequel vous souhaitez opérer le Bot. (Réglages > Appareils connectés > Connecter un appareil).
Une fois validé, il écrira "Client WhatsApp prêt" !

## 🌐 Mettre en Production (Hébergement Gratuit / Freemium)

### 1. Base de données
Utilisez **Supabase** ou **Neon.tech** pour créer une base PostgreSQL gratuite. Copiez la Connexion String dans la variable d'environnement `DATABASE_URL`.

### 2. Backend (via Render.com)
1. Poussez le monolithe sur GitHub.
2. Créez un *"Web Service"* sur Render.
3. Paramètres Render:
   - Root Directory : `backend`
   - Build Command : `npm install && npm run build`
   - Start Command : `npm run start`
   - Ajoutez le fichier `.env` via les "Environment Variables".
4. **ATTENTION WhatsApp** : Render est un hébergeur cloud sans état. À chaque redémarrage (ou mise en veille), il perdra le fichier "auth" de Whatsapp local ! 
👉 Pour que votre session WhatsApp survive aux redémarages, fournissez une variable `MONGODB_URI` pointant vers un Cluster gratuit (ex: **MongoDB Atlas**). Le backend détectera l'URL et validera la connexion persistante en "RemoteAuth".

### 3. Frontend (via Vercel)
1. Créez un projet sur **Vercel** et liez votre GitHub repo.
2. Paramètre Vercel:
   - Framework Preset : `Next.js`
   - Root Directory : `frontend`
   - Configurez la bonne Env Var : `NEXT_PUBLIC_API_URL` -> URL publique donnée par Render (ex: `https://votre-app-backend.onrender.com/api`).
3. Lancez le déploiement. It Just Works™ !
