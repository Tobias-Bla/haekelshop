import { CartSidebar } from "@/components/CartSidebar";
import { ProductCard } from "@/components/ProductCard";
import { prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/format";
import Link from "next/link";
import { connection } from "next/server";

const promises = [
  "Von Hand gemacht, nicht aus der Massenproduktion",
  "Mit Persönlichkeit, Charme und kleinen Details",
  "Ideal als Geschenk, Deko oder Herzensstück",
];

const highlights = [
  [
    "Sorgfältig gemacht",
    "Jedes Stück wirkt wie ein bewusstes Einzelstück statt wie Lagerware.",
  ],
  [
    "Klarer Kaufpfad",
    "Produkt, Warenkorb und Checkout sind jetzt deutlich leichter verständlich.",
  ],
  [
    "Mehr Shop-Qualität",
    "Bessere Typografie, robustere Validierung und weniger unnötiges Client-JavaScript.",
  ],
];

export default async function Home() {
  await connection();

  const products = await prisma.product.findMany({
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  const featuredProducts = products.filter((product) => product.featured).slice(0, 3);
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  const startingPrice =
    products.length > 0
      ? Math.min(...products.map((product) => product.price))
      : null;

  return (
    <main className="shop-shell min-h-screen overflow-x-hidden">
      <section className="relative px-4 pb-14 pt-6 sm:px-6 lg:px-8 lg:pb-20 lg:pt-8">
        <div className="mx-auto max-w-7xl">
          <div className="soft-card rounded-[2rem] px-5 py-5 sm:px-8 sm:py-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-ink-soft">
                  Vio&apos;s Häkelshop
                </p>
                <h1 className="font-display text-5xl leading-none text-foreground sm:text-6xl lg:text-7xl">
                  Häkeltiere mit Wärme, Witz und ganz viel Handarbeit.
                </h1>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="#kollektion"
                  className="inline-flex items-center justify-center rounded-full bg-rose px-5 py-3 text-sm font-bold text-white shadow-[0_12px_30px_rgba(169,85,69,0.22)] hover:-translate-y-0.5 hover:bg-rose-strong"
                >
                  Kollektion ansehen
                </Link>
                <Link
                  href="/admin"
                  className="inline-flex items-center justify-center rounded-full border border-line bg-white/70 px-5 py-3 text-sm font-bold text-foreground hover:-translate-y-0.5 hover:bg-white"
                >
                  Produkte verwalten
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="relative overflow-hidden rounded-[2rem] border border-line bg-[linear-gradient(140deg,rgba(255,250,245,0.98),rgba(255,243,233,0.94))] px-6 py-8 shadow-[0_30px_70px_rgba(106,73,58,0.1)] sm:px-8 sm:py-10">
              <div className="absolute -left-10 top-8 h-36 w-36 rounded-full bg-gold/[0.25] blur-3xl" />
              <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-rose/[0.18] blur-3xl" />

              <div className="relative z-10 max-w-2xl">
                <p className="mb-4 inline-flex rounded-full border border-line bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-ink-soft">
                  Kleine Unikate für große Freude
                </p>
                <h2 className="headline-balance font-display text-4xl leading-tight text-foreground sm:text-5xl">
                  Jedes Tierchen entsteht Masche für Masche und soll sofort
                  Lieblingsplatzpotenzial haben.
                </h2>
                <p className="mt-5 max-w-xl text-lg leading-8 text-ink-soft">
                  Statt einer austauschbaren Shop-Vorlage bekommt der Laden jetzt
                  mehr Charakter: weichere Tonalität, bessere Lesbarkeit, klarere
                  Struktur und ein Einkaufserlebnis, das zu handgemachten Produkten
                  passt.
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-3xl border border-line bg-white/85 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-ink-soft">
                      Produkte
                    </p>
                    <p className="mt-2 text-3xl font-bold text-foreground">
                      {products.length}
                    </p>
                  </div>
                  <div className="rounded-3xl border border-line bg-white/85 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-ink-soft">
                      Verfügbar
                    </p>
                    <p className="mt-2 text-3xl font-bold text-foreground">
                      {totalStock}
                    </p>
                  </div>
                  <div className="rounded-3xl border border-line bg-white/85 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-ink-soft">
                      Einstieg
                    </p>
                    <p className="mt-2 text-3xl font-bold text-foreground">
                      {startingPrice ? formatCurrency(startingPrice) : "Bald"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <aside className="soft-card rounded-[2rem] p-6 sm:p-7">
              <p className="text-sm uppercase tracking-[0.28em] text-ink-soft">
                Darauf dürfen Kundinnen sich freuen
              </p>
              <div className="mt-5 space-y-3">
                {promises.map((item) => (
                  <div
                    key={item}
                    className="rounded-3xl border border-line bg-white/80 px-4 py-4 text-sm leading-6 text-foreground"
                  >
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-[1.75rem] bg-[linear-gradient(160deg,#b76555,#7f4a3d)] p-5 text-white shadow-[0_18px_44px_rgba(120,69,57,0.25)]">
                <p className="text-xs uppercase tracking-[0.24em] text-white/70">
                  Favoriten
                </p>
                {featuredProducts.length > 0 ? (
                  <ul className="mt-3 space-y-3">
                    {featuredProducts.map((product) => (
                      <li key={product.id} className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold">{product.name}</p>
                          <p className="text-sm text-white/70">{product.category}</p>
                        </div>
                        <span className="rounded-full bg-white/15 px-3 py-1 text-sm font-bold">
                          {formatCurrency(product.price)}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm leading-6 text-white/80">
                    Sobald du Produkte als Favoriten markierst, bekommen sie hier
                    eine eigene Bühne.
                  </p>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          {highlights.map(([title, text]) => (
            <div key={title} className="soft-card rounded-[1.6rem] p-5">
              <h3 className="font-display text-3xl text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-ink-soft">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="kollektion" className="px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-ink-soft">
                Kollektion
              </p>
              <h2 className="font-display text-4xl text-foreground sm:text-5xl">
                Tierchen, die nicht nach Vorlage aussehen.
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-7 text-ink-soft">
                Die Startseite lädt Produkte jetzt direkt serverseitig aus der
                Datenbank, damit der Shop sofort Inhalt zeigt und nicht erst im
                Browser nachladen muss.
              </p>
            </div>

            <div className="rounded-full border border-line bg-white/75 px-4 py-3 text-sm font-semibold text-foreground">
              {products.length} Produkte im Shop
            </div>
          </div>

          {products.length === 0 ? (
            <div className="soft-card rounded-[2rem] p-10 text-center">
              <h3 className="font-display text-4xl text-foreground">
                Der Laden ist bereit für die ersten Lieblingsstücke.
              </h3>
              <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-ink-soft">
                Aktuell sind noch keine Produkte hinterlegt. Über das Admin-Panel
                kannst du direkt Bilder, Preise und Lagerbestand anlegen.
              </p>
              <Link
                href="/admin"
                className="mt-6 inline-flex rounded-full bg-rose px-5 py-3 font-bold text-white hover:-translate-y-0.5 hover:bg-rose-strong"
              >
                Zum Admin-Bereich
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="border-t border-line bg-white/60 px-4 py-8 backdrop-blur-sm sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <p>Vio&apos;s Häkelshop, liebevoll überarbeitet für einen wärmeren Auftritt.</p>
          <p>Handgemacht verdient einen Shop mit Charakter.</p>
        </div>
      </footer>

      <CartSidebar />
    </main>
  );
}
