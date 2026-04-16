"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

interface UploadImageProps {
  onImageUpload: (url: string) => void;
  isLoading?: boolean;
}

export function UploadImage({ onImageUpload, isLoading }: UploadImageProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Bild konnte nicht hochgeladen werden.");
      }

      onImageUpload(data.url);
      toast.success("Bild erfolgreich hochgeladen.");
      setPreview(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error instanceof Error ? error.message : "Fehler beim Hochladen des Bildes"
      );
      setPreview(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        type="button"
        className="w-full rounded-[1.8rem] border border-dashed border-line bg-white/75 p-5 text-left hover:border-rose hover:bg-white"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={loading || isLoading}
          className="hidden"
        />

        {!preview && !loading && (
          <div className="flex flex-col items-center justify-center py-7 text-center">
            <div className="rounded-full bg-card px-5 py-5">
              <svg
                className="h-10 w-10 text-ink-soft"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="20" cy="20" r="4" stroke="currentColor" strokeWidth={2} />
                <path d="M40 12L28 24" stroke="currentColor" strokeWidth={2} />
              </svg>
            </div>
            <p className="mt-4 font-semibold text-foreground">
              Bild auswählen und direkt hochladen
            </p>
            <p className="mt-2 text-sm leading-6 text-ink-soft">
              JPG, PNG oder WebP bis 5 MB. Das Bild landet automatisch im Shop.
            </p>
          </div>
        )}

        {preview && (
          <div className="relative h-64 overflow-hidden rounded-[1.3rem] bg-card-strong">
            <Image src={preview} alt="Vorschau" fill className="object-contain" />
          </div>
        )}

        {loading && (
          <div className="py-8 text-center">
            <p className="font-semibold text-foreground">Bild wird hochgeladen...</p>
            <p className="mt-2 text-sm text-ink-soft">
              Einen kurzen Moment, wir speichern die Datei.
            </p>
          </div>
        )}
      </button>
    </div>
  );
}
