import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { CartProvider } from "@/components/CartContext";
import AuthInit from "@/components/AuthInit";
import Toaster from "@/components/ui/Toaster";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Foodio - Premium Food Ordering",
  description:
    "Experience a symphony of flavors crafted with passion. Premium ingredients, exquisite recipes, delivered to your door.",
  icons: {
    icon: "/images/logo.svg",
    shortcut: "/images/logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${playfair.variable} ${inter.variable} font-sans antialiased flex flex-col min-h-screen`}>
        <CartProvider>
          <div className="flex flex-col flex-1 min-h-screen">
            <AuthInit />
            <Toaster />
            {children}
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
