"use client";

import { formatCurrency, formatStock } from "@/lib/format";
import { useCartStore } from "@/store/cartStore";
import type { ShopProduct } from "@/types/shop";
import Image from "next/image";
import { useTransition } from "react";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: ShopProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isPending, startTransition] = useTransition();
  const addItem = useCartStore((state) => state.addItem);

  const description =
    product.description.trim() ||
    "Ein handgehäkeltes Lieblingsstück mit ganz eigenem Charakter.";
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    startTransition(() => {
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      });
      toast.success(`${product.name} liegt jetzt im Warenkorb.`);
    });
  };

  return (
    <article className="group soft-card overflow-hidden rounded-[1.8rem]">
      <div className="relative h-72 overflow-hidden bg-card-strong">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-3 p-4">
          <span className="rounded-full border border-white/60 bg-white/85 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-foreground backdrop-blur-sm">
            {product.featured ? "Favorit" : product.category}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              isOutOfStock
                ? "bg-stone-900/80 text-white"
                : product.stock <= 3
                  ? "bg-amber-400/90 text-stone-900"
                  : "bg-white/80 text-foreground"
            }`}
          >
            {formatStock(product.stock)}
          </span>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div>
          <h3 className="font-display text-3xl leading-none text-foreground">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-ink-soft">
            Handgemacht und mit Liebe zusammengesetzt.
          </p>
        </div>

        <p className="min-h-[4.5rem] text-sm leading-7 text-ink-soft [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] overflow-hidden">
          {description}
        </p>

        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-ink-soft">
              Preis
            </p>
            <p className="mt-1 text-2xl font-bold text-foreground">
              {formatCurrency(product.price)}
            </p>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || isPending}
            className={`inline-flex min-w-40 items-center justify-center rounded-full px-4 py-3 text-sm font-bold ${
              isOutOfStock
                ? "cursor-not-allowed bg-stone-200 text-stone-500"
                : "bg-rose text-white shadow-[0_14px_30px_rgba(169,85,69,0.18)] hover:-translate-y-0.5 hover:bg-rose-strong"
            }`}
          >
            {isOutOfStock
              ? "Ausverkauft"
              : isPending
                ? "Kommt dazu..."
                : "In den Warenkorb"}
          </button>
        </div>
      </div>
    </article>
  );
}
