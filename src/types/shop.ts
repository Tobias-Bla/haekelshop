import type { Prisma, Product } from "@/generated/prisma/client";

export type ShopProduct = Product;

export type OrderWithItems = Prisma.OrderGetPayload<{
  include: { items: { include: { product: true } } };
}>;

export interface CartLineItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface ProductFormValues {
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  stock: string;
  featured: boolean;
}

export interface OrderFormValues {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}
