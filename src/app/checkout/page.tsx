"use client";

import { formatCurrency } from "@/lib/format";
import { useCartHydrated, useCartStore } from "@/store/cartStore";
import type { OrderFormValues } from "@/types/shop";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const emptyForm: OrderFormValues = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const clearCart = useCartStore((state) => state.clearCart);
  const hydrated = useCartHydrated();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<OrderFormValues>(emptyForm);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          items,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Bestellung konnte nicht abgeschlossen werden.");
      }

      clearCart();
      toast.success("Bestellung erfolgreich erfasst.");
      router.push(`/order-confirmation/${data.id}`);
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Fehler beim Erstellen der Bestellung"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!hydrated) {
    return (
      <main className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="soft-card rounded-[2rem] p-10 text-center text-ink-soft">
            Checkout wird vorbereitet...
          </div>
        </div>
      </main>
    );
  }

  const totalPrice = getTotalPrice();

  if (items.length === 0) {
    return (
      <main className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="soft-card rounded-[2rem] p-10 text-center">
            <h1 className="font-display text-4xl text-foreground">
              Dein Warenkorb ist noch leer.
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-ink-soft">
              Lege zuerst ein Produkt in den Warenkorb, dann erscheint hier die
              Bestellübersicht.
            </p>
            <button
              onClick={() => router.push("/")}
              className="mt-6 rounded-full bg-rose px-5 py-3 font-bold text-white hover:-translate-y-0.5 hover:bg-rose-strong"
            >
              Zurück zum Shop
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="soft-card rounded-[2rem] px-6 py-6 sm:px-8">
          <p className="text-sm uppercase tracking-[0.28em] text-ink-soft">
            Checkout
          </p>
          <h1 className="font-display text-5xl text-foreground">
            Fast geschafft
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-ink-soft">
            Hier sammelst du die Versanddaten. Die Bestellung wird anschließend im
            System gespeichert und kann im Admin-Bereich weiterbearbeitet werden.
          </p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <aside className="soft-card rounded-[2rem] p-6 sm:p-7 lg:sticky lg:top-6 lg:self-start">
            <p className="text-sm uppercase tracking-[0.24em] text-ink-soft">
              Bestellung
            </p>
            <h2 className="mt-2 font-display text-4xl text-foreground">
              Deine Übersicht
            </h2>

            <div className="mt-6 space-y-4">
              {items.map((item) => (
                <article
                  key={item.productId}
                  className="rounded-[1.4rem] border border-line bg-white/80 p-4"
                >
                  <div className="flex gap-4">
                    <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-card-strong">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-foreground">{item.name}</p>
                      <p className="mt-1 text-sm text-ink-soft">
                        {item.quantity} x {formatCurrency(item.price)}
                      </p>
                      <p className="mt-3 text-sm font-bold text-foreground">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-6 rounded-[1.4rem] border border-line bg-white/80 p-5">
              <div className="flex items-center justify-between text-sm text-ink-soft">
                <span>Zwischensumme</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-lg font-bold text-foreground">
                <span>Gesamt</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-ink-soft">
                Zahlung und Versandstatus können später im Admin-Bereich ergänzt
                werden.
              </p>
            </div>
          </aside>

          <section className="soft-card rounded-[2rem] p-6 sm:p-7">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-ink-soft">
                  Versanddaten
                </p>
                <h2 className="mt-2 font-display text-4xl text-foreground">
                  Wohin soll dein Paket?
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Vollständiger Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    autoComplete="name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none focus:border-rose focus:ring-4 focus:ring-rose/10"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    E-Mail
                  </label>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none focus:border-rose focus:ring-4 focus:ring-rose/10"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none focus:border-rose focus:ring-4 focus:ring-rose/10"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Straße und Hausnummer
                  </label>
                  <input
                    type="text"
                    name="address"
                    autoComplete="street-address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none focus:border-rose focus:ring-4 focus:ring-rose/10"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Stadt
                  </label>
                  <input
                    type="text"
                    name="city"
                    autoComplete="address-level2"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none focus:border-rose focus:ring-4 focus:ring-rose/10"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Postleitzahl
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    autoComplete="postal-code"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none focus:border-rose focus:ring-4 focus:ring-rose/10"
                  />
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-line bg-white/70 p-5">
                <p className="font-semibold text-foreground">So geht es danach weiter</p>
                <p className="mt-2 text-sm leading-7 text-ink-soft">
                  Nach dem Absenden wird die Bestellung gespeichert. Auf der
                  Bestätigungsseite siehst du alle Details, und im Admin-Bereich kann
                  der Bestellstatus anschließend gepflegt werden.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-rose px-5 py-3 text-lg font-bold text-white shadow-[0_16px_34px_rgba(169,85,69,0.18)] hover:-translate-y-0.5 hover:bg-rose-strong disabled:cursor-not-allowed disabled:bg-stone-400"
              >
                {loading ? "Bestellung wird gespeichert..." : "Bestellung abschließen"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
