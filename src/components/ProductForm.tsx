"use client";

import type { ShopProduct, ProductFormValues } from "@/types/shop";
import { useState } from "react";
import toast from "react-hot-toast";
import { UploadImage } from "./UploadImage";

interface ProductFormProps {
  onSubmit?: (product: ShopProduct) => void;
  initialData?: Partial<ProductFormValues>;
}

const emptyForm: ProductFormValues = {
  name: "",
  description: "",
  price: "",
  image: "",
  category: "animals",
  stock: "1",
  featured: false,
};

const categories = [
  { value: "animals", label: "Tierchen" },
  { value: "gift", label: "Geschenke" },
  { value: "baby", label: "Baby & Kinderzimmer" },
  { value: "decor", label: "Dekoration" },
];

export function ProductForm({ onSubmit, initialData }: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormValues>({
    ...emptyForm,
    ...initialData,
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = event.target;

    setFormData((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? (event.target as HTMLInputElement).checked
          : value,
    }));
  };

  const handleImageUpload = (imageUrl: string) => {
    setFormData((current) => ({ ...current, image: imageUrl }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Produkt konnte nicht gespeichert werden.");
      }

      toast.success("Produkt erfolgreich erstellt.");
      setFormData(emptyForm);
      onSubmit?.(data);
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error instanceof Error ? error.message : "Fehler beim Erstellen des Produkts"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          Produktbild
        </label>
        <UploadImage onImageUpload={handleImageUpload} isLoading={loading} />
        {formData.image && (
          <p className="mt-3 text-sm text-emerald-700">
            Bild verknüpft und bereit zum Speichern.
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          Name des Tierchens
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          placeholder="z. B. Pfirsich-Otter"
          className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-foreground outline-none focus:border-rose focus:ring-4 focus:ring-rose/10"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          Beschreibung
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={4}
          placeholder="Was macht dieses Stück besonders?"
          className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-foreground outline-none focus:border-rose focus:ring-4 focus:ring-rose/10"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Preis in Euro
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
            min="0"
            step="0.01"
            placeholder="29.00"
            className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-foreground outline-none focus:border-rose focus:ring-4 focus:ring-rose/10"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Lagerbestand
          </label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleInputChange}
            min="0"
            step="1"
            className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-foreground outline-none focus:border-rose focus:ring-4 focus:ring-rose/10"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          Kategorie
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-foreground outline-none focus:border-rose focus:ring-4 focus:ring-rose/10"
        >
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      <label className="flex items-start gap-3 rounded-2xl border border-line bg-white/70 px-4 py-4">
        <input
          type="checkbox"
          name="featured"
          checked={formData.featured}
          onChange={handleInputChange}
          className="mt-1 h-4 w-4 rounded border-line text-rose focus:ring-rose"
        />
        <span>
          <span className="block font-semibold text-foreground">
            Auf der Startseite hervorheben
          </span>
          <span className="mt-1 block text-sm leading-6 text-ink-soft">
            Ideal für saisonale Highlights oder besonders beliebte Produkte.
          </span>
        </span>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-rose px-5 py-3 font-bold text-white shadow-[0_16px_34px_rgba(169,85,69,0.18)] hover:-translate-y-0.5 hover:bg-rose-strong disabled:cursor-not-allowed disabled:bg-stone-400"
      >
        {loading ? "Wird gespeichert..." : "Produkt hinzufügen"}
      </button>
    </form>
  );
}
