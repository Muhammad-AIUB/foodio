import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Foodio - Premium Food Ordering",
  description: "Where great food meets great taste. Premium ingredients, exquisite recipes, delivered to your door.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-white" style={{ colorScheme: 'light' }}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} bg-white text-slate-700 antialiased font-sans`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
