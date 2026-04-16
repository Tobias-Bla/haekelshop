import type { Metadata } from "next";
import { Cormorant_Garamond, Nunito_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const bodyFont = Nunito_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const displayFont = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Vio's Häkelshop",
    template: "%s | Vio's Häkelshop",
  },
  description:
    "Liebevoll gehäkelte Tierchen, kleine Lieblingsgeschenke und eine warme Shop-Erfahrung mit Herz.",
  keywords: [
    "Häkelshop",
    "Häkeltiere",
    "Handgemacht",
    "Geschenkideen",
    "Amigurumi",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      data-scroll-behavior="smooth"
      className={`${bodyFont.variable} ${displayFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              borderRadius: "1rem",
              border: "1px solid rgba(107, 79, 69, 0.14)",
              background: "#fffaf5",
              color: "#34211c",
              boxShadow: "0 14px 40px rgba(79, 47, 36, 0.12)",
            },
          }}
        />
      </body>
    </html>
  );
}
