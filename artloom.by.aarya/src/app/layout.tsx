import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Artloom.By.Aarya 🌸 | Handmade Woolen Mat Rangolis & Custom Decor",
  description:
    "Artloom.By.Aarya crafts personalized home decor items with a primary focus on handcrafted woolen mat rangolis, auspicious entrance torans, pooja thali mats, and festive gifts. Durable, washable, reusable & delivered to your doorstep.",
  keywords: [
    "Artloom.By.Aarya",
    "Woolen Mat Rangoli",
    "Handmade Decor India",
    "Washable Rangoli",
    "Kalash Rangoli",
    "Peacock Rangoli",
    "Laxmi Charan Mat",
    "Torans",
    "Pooja Thali Mat",
    "Custom Gifts",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="max-w-lg md:max-w-full min-h-full flex flex-col bg-[#FFFDF9] text-stone-900 font-sans">
        {children}
      </body>
    </html>
  );
}
