# Vio's Häkelshop

Ein kleiner Shop für handgemachte Häkelprodukte auf Basis von Next.js 16, Prisma und Neon Postgres.

## Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS 4
- Prisma 7
- Neon Postgres
- Zustand

## Lokal starten

1. Abhängigkeiten installieren:

```bash
npm install
```

2. `.env.example` nach `.env` kopieren und mit deinen Neon-Zugangsdaten füllen:

```env
DATABASE_URL="postgres://...-pooler.../neondb?sslmode=require&channel_binding=require"
DIRECT_URL="postgres://.../neondb?sslmode=require&channel_binding=require"
```

3. Migrationen anwenden:

```bash
npx prisma migrate deploy
```

4. Prisma Client neu generieren:

```bash
npx prisma generate
```

5. Dev-Server starten:

```bash
npm run dev
```

## Wichtige Umgebungsvariablen

- `DATABASE_URL`
  Gepoolte Neon-Verbindung für Prisma Client und die laufende App.
- `DIRECT_URL`
  Direkte Neon-Verbindung für Prisma CLI und Migrationen.

## Vercel

In Vercel müssen diese Variablen gesetzt sein:

- `DATABASE_URL`
- `DIRECT_URL`

Der Build führt jetzt automatisch zuerst die Migrationen aus und baut danach die App:

```bash
npx prisma migrate deploy && npm run build
```

## Wichtiger Hinweis

Die bestehende Prisma-Migration wurde von SQLite auf PostgreSQL umgestellt. Falls du lokal noch Daten in einer alten `dev.db` hattest, werden die nicht automatisch nach Neon übernommen.
