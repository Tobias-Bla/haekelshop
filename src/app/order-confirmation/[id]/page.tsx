import { prisma } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/format";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";

const statusLabels: Record<string, string> = {
  pending: "Offen",
  paid: "Bezahlt",
  shipped: "Versendet",
  delivered: "Zugestellt",
  canceled: "Storniert",
};

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();

  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  });

  if (!order) {
    notFound();
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <section className="soft-card rounded-[2rem] px-6 py-8 text-center sm:px-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-700">
            ✓
          </div>
          <p className="mt-5 text-sm uppercase tracking-[0.28em] text-ink-soft">
            Bestellung eingegangen
          </p>
          <h1 className="mt-2 font-display text-5xl text-foreground">
            Vielen Dank für deine Bestellung.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-ink-soft">
            Deine Bestellung wurde gespeichert und ist jetzt im Shop-System sichtbar.
            Alle wichtigen Informationen findest du direkt hier auf einen Blick.
          </p>
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <div className="soft-card rounded-[2rem] p-6 sm:p-7">
              <p className="text-sm uppercase tracking-[0.24em] text-ink-soft">
                Übersicht
              </p>
              <h2 className="mt-2 font-display text-4xl text-foreground">
                Bestelldetails
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.4rem] border border-line bg-white/80 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-ink-soft">
                    Bestellnummer
                  </p>
                  <p className="mt-2 break-all font-mono text-sm font-bold text-foreground">
                    {order.id}
                  </p>
                </div>
                <div className="rounded-[1.4rem] border border-line bg-white/80 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-ink-soft">
                    Status
                  </p>
                  <p className="mt-2 font-semibold text-foreground">
                    {statusLabels[order.status] ?? order.status}
                  </p>
                </div>
                <div className="rounded-[1.4rem] border border-line bg-white/80 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-ink-soft">
                    Kunde
                  </p>
                  <p className="mt-2 font-semibold text-foreground">
                    {order.fullName}
                  </p>
                </div>
                <div className="rounded-[1.4rem] border border-line bg-white/80 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-ink-soft">
                    Eingegangen am
                  </p>
                  <p className="mt-2 font-semibold text-foreground">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-[1.4rem] border border-line bg-white/80 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-ink-soft">
                  Kontakt
                </p>
                <p className="mt-2 font-semibold text-foreground">{order.email}</p>
                <p className="mt-1 text-sm text-ink-soft">{order.phone}</p>
              </div>
            </div>

            <div className="soft-card rounded-[2rem] p-6 sm:p-7">
              <p className="text-sm uppercase tracking-[0.24em] text-ink-soft">
                Nächste Schritte
              </p>
              <div className="mt-4 space-y-3 text-sm leading-7 text-ink-soft">
                <p>Die Bestellung ist nun im System angelegt.</p>
                <p>Im Admin-Bereich kann der Status später auf bezahlt oder versendet gesetzt werden.</p>
                <p>Alle Positionen wurden bereits mit dem aktuellen Lagerbestand abgeglichen.</p>
              </div>
            </div>
          </div>

          <div className="soft-card rounded-[2rem] p-6 sm:p-7">
            <p className="text-sm uppercase tracking-[0.24em] text-ink-soft">
              Positionen
            </p>
            <h2 className="mt-2 font-display text-4xl text-foreground">
              Deine Artikel
            </h2>

            <div className="mt-6 space-y-4">
              {order.items.map((item) => (
                <article
                  key={item.id}
                  className="rounded-[1.4rem] border border-line bg-white/80 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-foreground">
                        {item.product?.name ?? "Produkt"}
                      </p>
                      <p className="mt-1 text-sm text-ink-soft">
                        {item.quantity} x {formatCurrency(item.price)}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-foreground">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-6 rounded-[1.4rem] border border-line bg-white/80 p-5">
              <div className="flex items-center justify-between text-sm text-ink-soft">
                <span>Gesamtsumme</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/"
                  className="flex-1 rounded-full bg-rose px-5 py-3 text-center font-bold text-white hover:-translate-y-0.5 hover:bg-rose-strong"
                >
                  Weiter im Shop stöbern
                </Link>
                <Link
                  href="/admin"
                  className="flex-1 rounded-full border border-line bg-white px-5 py-3 text-center font-bold text-foreground hover:bg-card"
                >
                  Bestellung im Admin ansehen
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
