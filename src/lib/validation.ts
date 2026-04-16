import { z } from "zod";

export const productSchema = z.object({
  name: z.string().trim().min(2, "Bitte gib einen Produktnamen an."),
  description: z
    .string()
    .trim()
    .max(600, "Die Beschreibung ist zu lang.")
    .optional()
    .default(""),
  price: z.coerce.number().positive("Der Preis muss größer als 0 sein."),
  image: z.string().trim().min(1, "Bitte lade ein Produktbild hoch."),
  category: z
    .string()
    .trim()
    .min(2, "Bitte wähle eine Kategorie.")
    .max(40, "Die Kategorie ist zu lang.")
    .default("animals"),
  stock: z.coerce
    .number()
    .int("Der Lagerbestand muss eine ganze Zahl sein.")
    .min(0, "Der Lagerbestand darf nicht negativ sein.")
    .max(999, "Der Lagerbestand ist zu hoch.")
    .default(1),
  featured: z.coerce.boolean().default(false),
});

export const productUpdateSchema = productSchema.partial();

export const orderItemSchema = z.object({
  productId: z.string().trim().min(1),
  quantity: z.coerce.number().int().min(1).max(20),
  price: z.coerce.number().nonnegative(),
});

export const orderSchema = z.object({
  fullName: z.string().trim().min(2, "Bitte gib einen Namen an."),
  email: z.email("Bitte gib eine gültige E-Mail-Adresse an."),
  phone: z.string().trim().min(6, "Bitte gib eine Telefonnummer an."),
  address: z.string().trim().min(5, "Bitte gib eine Adresse an."),
  city: z.string().trim().min(2, "Bitte gib eine Stadt an."),
  postalCode: z.string().trim().min(4, "Bitte gib eine PLZ an."),
  items: z.array(orderItemSchema).min(1, "Der Warenkorb ist leer."),
});
