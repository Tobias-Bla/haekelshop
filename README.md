# Haekelshop - E-Commerce-Website für handgefertigte Häkeltierchen

Willkommen zu **Vio's Häkelshop** - einer modernen, schönen E-Commerce-Website für handgefertigte Häkeltierchen.

## ✨ Features

- 🎨 **Schöne, einladende Benutzeroberfläche** mit Modern Design
- 📸 **Einfaches Produkt-Upload-System** - Bilder und Details hochladen
- 🛒 **Shopping Cart** - Produkte zum Warenkorb hinzufügen
- 💳 **Bestellverwaltung** - Komplettes Order-Management
- 📱 **Responsives Design** - Optimiert für Handy, Tablet und Desktop
- ⚡ **Blitzschnell** - Next.js mit Vercel Deployment
- 🔒 **Admin Panel** - Einfache Verwaltung aller Produkte
- 💾 **SQLite Datenbank** - Kostenlos und einfach zu verwenden

## 🚀 Getting Started

### Installation

```bash
# Abhängigkeiten installieren
npm install

# Datenbank migrieren
npx prisma migrate dev

# Entwicklungsserver starten
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000) im Browser.

### Admin-Panel

Gehe zu [http://localhost:3000/admin](http://localhost:3000/admin) um:
- Neue Häkeltierchen hochzuladen
- Bilder einzufügen
- Preise und Beschreibungen zu verwalten
- Verfügbare Menge zu aktualisieren

## 📁 Projektstruktur

```
src/
├── app/
│   ├── page.tsx              # Startseite mit Produktgalerie
│   ├── admin/                # Admin-Panel
│   ├── checkout/             # Kasse/Bestellformular
│   ├── order-confirmation/   # Bestellbestätigung
│   ├── api/
│   │   ├── products/         # Produkt-APIs
│   │   ├── orders/           # Bestellungs-APIs
│   │   └── upload/           # Bild-Upload-API
│   └── layout.tsx            # Root Layout mit Toast
├── components/
│   ├── ProductCard.tsx       # Produktkarte
│   ├── ProductForm.tsx       # Admin-Formular
│   ├── UploadImage.tsx       # Bild-Upload
│   └── CartSidebar.tsx       # Warenkorb-Sidebar
├── store/
│   └── cartStore.ts          # Zustand Cart Store
└── lib/
    └── db.ts                 # Prisma Client
```

## 🗄️ Datenbank

Das System verwendet **SQLite** mit Prisma als ORM:

- **Products** - Deine Häkeltierchen
- **Orders** - Kundenbestellungen
- **OrderItems** - Artikel in Bestellungen
- **Cart** - Zwischenspeicher für Warenkorb
- **CartItems** - Artikel im Warenkorb

## 🌐 Deployment auf Vercel

```bash
# Vercel CLI installieren
npm i -g vercel

# Deployen
vercel deploy

# Produktivumgebung
vercel deploy --prod
```

### Vercel Environment Variables

Erstelle eine `.env.production` mit:
```
DATABASE_URL="file:./prod.db"
```

## 📦 Konfiguration

Wichtige Dateien:
- `prisma/schema.prisma` - Datenbankschema
- `next.config.ts` - Next.js Konfiguration
- `tsconfig.json` - TypeScript Konfiguration
- `tailwind.config.ts` - Tailwind CSS Konfiguration

## 🎨 Styling

Das Projekt nutzt **Tailwind CSS** für schnelle und schöne Gestaltung. Die Farben sind auf Rosa/Pink abgestimmt.

## 📱 API Endpoints

### Produkte
- `GET /api/products` - Alle Produkte abrufen
- `POST /api/products` - Neues Produkt erstellen
- `GET /api/products/[id]` - Einzelnes Produkt
- `PATCH /api/products/[id]` - Produkt aktualisieren
- `DELETE /api/products/[id]` - Produkt löschen

### Bestellungen
- `GET /api/orders` - Alle Bestellungen
- `POST /api/orders` - Neue Bestellung erstellen
- `GET /api/orders/[id]` - Einzelne Bestellung

### Upload
- `POST /api/upload` - Bild hochladen

## 🛠️ Entwicklung

```bash
# Typescript Überprüfung
npm run lint

# Build
npm run build

# Production-Server
npm run start
```

## 📚 Tech Stack

- **Framework**: Next.js 16 mit App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite mit Prisma
- **State Management**: Zustand
- **Notifications**: React Hot Toast
- **Deployment**: Vercel

## 💡 Nächste Schritte

1. ✅ Projekt ist bereit
2. 📸 Laden Sie Ihre Häkeltierchen im Admin-Panel hoch
3. 🎨 Passen Sie Texte und Farben an (wenn gewünscht)
4. 🌐 Deployen Sie auf Vercel
5. 💳 Integrieren Sie Payment-Systeme (optional)

## 📞 Support

Bei Fragen, schauen Sie sich die Prisma, Next.js und Tailwind CSS Dokumentation an!

---

**Gemacht mit 💕 für Vio's Häkelshop**

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
