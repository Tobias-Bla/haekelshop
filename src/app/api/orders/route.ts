import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { orderSchema } from "@/lib/validation";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = orderSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error:
            result.error.issues[0]?.message ??
            "Bitte prüfe die Angaben im Bestellformular.",
        },
        { status: 400 }
      );
    }

    const { items, ...customer } = result.data;
    const productIds = items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    const productsById = new Map(products.map((product) => [product.id, product]));
    const missingProducts = items.filter(
      (item) => !productsById.has(item.productId)
    );

    if (missingProducts.length > 0) {
      return NextResponse.json(
        {
          error:
            "Mindestens ein Produkt ist nicht mehr verfügbar. Bitte aktualisiere den Warenkorb.",
        },
        { status: 409 }
      );
    }

    const soldOutItems = items
      .map((item) => {
        const product = productsById.get(item.productId);

        if (!product || product.stock < item.quantity) {
          return product?.name ?? "Ein Produkt";
        }

        return null;
      })
      .filter((value): value is string => value !== null);

    if (soldOutItems.length > 0) {
      return NextResponse.json(
        {
          error: `Nicht genug Bestand für: ${soldOutItems.join(", ")}.`,
        },
        { status: 409 }
      );
    }

    const total = items.reduce((sum, item) => {
      const product = productsById.get(item.productId);
      return sum + (product?.price ?? 0) * item.quantity;
    }, 0);

    const order = await prisma.$transaction(async (tx) => {
      for (const item of items) {
        const updated = await tx.product.updateMany({
          where: {
            id: item.productId,
            stock: { gte: item.quantity },
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });

        if (updated.count === 0) {
          throw new Error("OUT_OF_STOCK");
        }
      }

      return tx.order.create({
        data: {
          ...customer,
          total,
          status: "pending",
          items: {
            create: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: productsById.get(item.productId)?.price ?? item.price,
            })),
          },
        },
        include: { items: { include: { product: true } } },
      });
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "OUT_OF_STOCK") {
      return NextResponse.json(
        {
          error:
            "Während des Bezahlens hat sich der Bestand geändert. Bitte prüfe deinen Warenkorb erneut.",
        },
        { status: 409 }
      );
    }

    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
