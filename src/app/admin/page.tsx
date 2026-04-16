"use client";

import { ProductForm } from "@/components/ProductForm";
import { formatCurrency } from "@/lib/format";
import type { ShopProduct } from "@/types/shop";
import Image from "next/image";
import Link from "next/link";
import { startTransition, useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AdminPage() {
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error ?? "Produkte konnten nicht geladen werden.");
        }

        setProducts(data);
      } catch (error) {
        console.error("Error:", error);
        toast.error(
          error instanceof Error ? error.message : "Fehler beim Laden der Produkte"
        );
      } finally {
        setLoading(false);
      }
    };

    void fetchProducts();
  }, []);

  const handleProductAdded = (product: ShopProduct) => {
    startTransition(() => {
      setProducts((current) => [product, ...current]);
    });
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Möchtest du ${name} wirklich löschen?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error ?? "Produkt konnte nicht gelöscht werden.");
      }

      startTransition(() => {
        setProducts((current) => current.filter((product) => product.id !== id));
      });
      toast.success(`${name} wurde entfernt.`);
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error instanceof Error ? error.message : "Fehler beim Löschen des Produkts"
      );
    }
  };

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="soft-card rounded-[2rem] px-6 py-6 sm:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-ink-soft">
                Admin
              </p>
              <h1 className="font-display text-5xl text-foreground">
                Kollektion pflegen
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-ink-soft">
                Produkte anlegen, Lagerbestand prüfen und Lieblingsstücke gezielt
                hervorheben. Die Oberfläche ist jetzt näher an einem echten kleinen
                Shop-Backoffice statt an einer Rohfassung.
              </p>
            </div>

            <Link
              href="/"
              className="inline-flex rounded-full border border-line bg-white px-5 py-3 font-bold text-foreground hover:-translate-y-0.5 hover:bg-card"
            >
              Zurück zum Shop
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
          <section className="soft-card rounded-[2rem] p-6 sm:p-7">
            <p className="text-sm uppercase tracking-[0.24em] text-ink-soft">
              Neues Produkt
            </p>
            <h2 className="mt-2 font-display text-4xl text-foreground">
              Ein neues Lieblingsstück anlegen
            </h2>
            <p className="mt-3 text-sm leading-7 text-ink-soft">
              Bild hochladen, Beschreibung ergänzen und direkt festlegen, ob das
              Produkt als Favorit auf der Startseite erscheinen soll.
            </p>

            <div className="mt-6">
              <ProductForm onSubmit={handleProductAdded} />
            </div>
          </section>

          <section className="space-y-4">
            <div className="soft-card rounded-[2rem] p-6 sm:p-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-ink-soft">
                    Bestandsliste
                  </p>
                  <h2 className="mt-2 font-display text-4xl text-foreground">
                    {products.length} Produkte im Sortiment
                  </h2>
                </div>
                <p className="text-sm leading-7 text-ink-soft">
                  Schnellüberblick über Preis, Status und Lagerbestand.
                </p>
              </div>
            </div>

            {loading ? (
              <div className="soft-card rounded-[2rem] p-10 text-center text-ink-soft">
                Produkte werden geladen...
              </div>
            ) : products.length === 0 ? (
              <div className="soft-card rounded-[2rem] p-10 text-center">
                <h3 className="font-display text-3xl text-foreground">
                  Noch keine Produkte hinterlegt
                </h3>
                <p className="mt-3 text-sm leading-7 text-ink-soft">
                  Das Formular links ist bereit. Sobald du das erste Produkt anlegst,
                  landet es sofort in dieser Übersicht.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product) => (
                  <article
                    key={product.id}
                    className="soft-card rounded-[1.6rem] p-4 sm:p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <div className="relative h-28 w-full overflow-hidden rounded-[1.3rem] bg-card-strong sm:w-28">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          sizes="112px"
                          className="object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <div className="flex flex-wrap gap-2">
                              {product.featured && (
                                <span className="rounded-full bg-rose px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-white">
                                  Favorit
                                </span>
                              )}
                              <span className="rounded-full border border-line px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-ink-soft">
                                {product.category}
                              </span>
                            </div>
                            <h3 className="mt-3 font-display text-3xl text-foreground">
                              {product.name}
                            </h3>
                            <p className="mt-1 text-sm text-ink-soft">
                              {formatCurrency(product.price)}
                            </p>
                          </div>

                          <button
                            onClick={() => handleDeleteProduct(product.id, product.name)}
                            className="rounded-full border border-rose/[0.25] bg-white px-4 py-2 text-sm font-bold text-rose hover:border-rose hover:bg-rose/[0.05]"
                          >
                            Löschen
                          </button>
                        </div>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          <div className="rounded-2xl border border-line bg-white/70 px-4 py-3">
                            <p className="text-xs uppercase tracking-[0.2em] text-ink-soft">
                              Lagerbestand
                            </p>
                            <p className="mt-1 font-semibold text-foreground">
                              {product.stock} Stück
                            </p>
                          </div>
                          <div className="rounded-2xl border border-line bg-white/70 px-4 py-3">
                            <p className="text-xs uppercase tracking-[0.2em] text-ink-soft">
                              Status
                            </p>
                            <p className="mt-1 font-semibold text-foreground">
                              {product.stock > 0 ? "Verfügbar" : "Ausverkauft"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
