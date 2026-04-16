"use client";

import { formatCurrency } from "@/lib/format";
import { useCartHydrated, useCartStore } from "@/store/cartStore";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function CartSidebar() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const getTotalItems = useCartStore((state) => state.getTotalItems);

  const [isOpen, setIsOpen] = useState(false);
  const hydrated = useCartHydrated();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const totalItems = hydrated ? getTotalItems() : 0;
  const totalPrice = hydrated ? getTotalPrice() : 0;
  const cartItems = hydrated ? items : [];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Warenkorb öffnen"
        className="fixed bottom-5 right-5 z-40 flex items-center gap-3 rounded-full bg-stone-900 px-4 py-3 text-white shadow-[0_22px_40px_rgba(35,22,18,0.24)] hover:-translate-y-0.5 hover:bg-stone-800"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/12">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6H19"
            />
          </svg>
        </span>
        <div className="text-left">
          <p className="text-xs uppercase tracking-[0.2em] text-white/65">Warenkorb</p>
          <p className="text-sm font-bold">{totalItems} Artikel</p>
        </div>
        <span className="rounded-full bg-white/14 px-3 py-1 text-sm font-bold">
          {formatCurrency(totalPrice)}
        </span>
        {totalItems > 0 && (
          <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-rose text-xs font-bold text-white">
            {totalItems}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-[rgba(39,23,19,0.45)] backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="fixed right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-line bg-[linear-gradient(180deg,#fffaf6,#f8eee6)] shadow-[0_26px_70px_rgba(43,25,21,0.2)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="border-b border-line px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-ink-soft">
                    Einkauf
                  </p>
                  <h2 className="font-display text-4xl text-foreground">Warenkorb</h2>
                  <p className="mt-1 text-sm text-ink-soft">
                    {totalItems === 0
                      ? "Noch nichts drin"
                      : `${totalItems} Artikel bereit zur Bestellung`}
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full border border-line bg-white/80 p-2 text-foreground hover:bg-white"
                >
                  ✕
                </button>
              </div>
            </div>

            {cartItems.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <div className="rounded-full bg-white/80 p-5 shadow-sm">
                  <svg className="h-8 w-8 text-ink-soft" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6H19"
                    />
                  </svg>
                </div>
                <h3 className="mt-5 font-display text-3xl text-foreground">
                  Ein leerer Korb wartet auf Gesellschaft.
                </h3>
                <p className="mt-3 text-sm leading-7 text-ink-soft">
                  Lege ein Lieblingsstück hinein, dann erscheint hier sofort deine
                  Bestellübersicht.
                </p>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
                  {cartItems.map((item) => (
                    <article
                      key={item.productId}
                      className="rounded-[1.4rem] border border-line bg-white/80 p-4 shadow-sm"
                    >
                      <div className="flex gap-4">
                        <div className="relative h-[5.5rem] w-[5.5rem] overflow-hidden rounded-2xl bg-card-strong">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            sizes="88px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold text-foreground">{item.name}</p>
                              <p className="mt-1 text-sm text-ink-soft">
                                {formatCurrency(item.price)} pro Stück
                              </p>
                            </div>
                            <button
                              onClick={() => removeItem(item.productId)}
                              className="text-sm font-semibold text-rose hover:text-rose-strong"
                            >
                              Entfernen
                            </button>
                          </div>

                          <div className="mt-4 flex items-center justify-between gap-4">
                            <div className="inline-flex items-center rounded-full border border-line bg-card px-2 py-1">
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                className="h-8 w-8 rounded-full text-lg text-foreground hover:bg-white"
                              >
                                -
                              </button>
                              <span className="min-w-8 text-center text-sm font-bold text-foreground">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                className="h-8 w-8 rounded-full text-lg text-foreground hover:bg-white"
                              >
                                +
                              </button>
                            </div>

                            <p className="text-sm font-bold text-foreground">
                              {formatCurrency(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="border-t border-line bg-white/65 px-6 py-5">
                  <div className="mb-4 flex items-center justify-between text-sm text-ink-soft">
                    <span>Zwischensumme</span>
                    <span>{formatCurrency(totalPrice)}</span>
                  </div>
                  <div className="mb-5 flex items-center justify-between text-lg font-bold text-foreground">
                    <span>Gesamt</span>
                    <span>{formatCurrency(totalPrice)}</span>
                  </div>

                  <Link
                    href="/checkout"
                    className="block rounded-full bg-rose px-5 py-3 text-center font-bold text-white hover:-translate-y-0.5 hover:bg-rose-strong"
                    onClick={() => setIsOpen(false)}
                  >
                    Zur Kasse
                  </Link>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="mt-3 w-full rounded-full border border-line bg-white px-5 py-3 font-bold text-foreground hover:bg-card"
                  >
                    Weiterstöbern
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
