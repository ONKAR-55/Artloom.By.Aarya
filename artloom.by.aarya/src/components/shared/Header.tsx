"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Search, Menu, X } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import BrandLogo from "../../../public/BrandLogo.png";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const totalItems = useCartStore((state) => state.getTotalItems());
  const openCart = useCartStore((state) => state.openCart);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const navLinks = [
    { label: "All Items", href: "./" },
    { label: "Woolen Rangolis", href: "/products?category=woolen-rangolis" },
    { label: "Entrance Torans", href: "/products?category=entrance-torans" },
    { label: "Pooja Mats", href: "/products?category=pooja-thali-mats" },
    { label: "Gift Hampers", href: "/products?category=festive-hampers" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-pink-100 shadow-2xs">
      {/* <FestiveBanner /> */}

      <nav className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Mobile menu toggle */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-600 hover:text-pink-600 hover:bg-pink-50 focus:outline-none transition-all duration-400"
              aria-label="Toggle navigation">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo & Tagline */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.4, delay: 0.1 }} 
            className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group hover:scale-105 duration-400 transition-all">
              <span className="hover:scale-120 duration-400 transition-all w-auto h-auto p-0.5 rounded-full bg-pink-100 border border-pink-200 flex items-center justify-center text-sm">
                <Image src={BrandLogo} alt="Brand Logo" width={50} height={50} />
              </span>
              <div className="flex flex-col">
                <span className="font-serif text-sm md:text-xl font-bold tracking-tight text-stone-900 group-hover:text-pink-600 transition">
                  Artloom.By.Aarya
                </span>
                <span className="text-[10px] text-pink-500 font-medium mt-0.5">
                  Handmade Decor &amp; Custom Creations
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.4, delay: 0.1 }} 
            className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium hover:scale-105 duration-400 transition-all ${
                    pathname === link.href
                      ? "text-pink-700 bg-pink-50 font-semibold shadow-gold"
                      : "text-stone-600 hover:text-pink-600 hover:bg-pink-50/50"
                  }`}>
                  {link.label}
                </Link>
              );
            })}
          </motion.div>

          {/* Search & Cart Actions (Seller login removed as requested) */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.4, delay: 0.1 }} 
            className="flex items-center gap-2 w-auto">
            <Link
            href="/products?query="
              className="flex gap-4 p-2 text-stone-500 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-all w-auto h-auto items-center">
              <Search className="w-4 h-4"/>
            </Link>

            <button
              onClick={openCart}
              className="flex items-center gap-2 px-3 py-1.5 bg-pink-600 hover:bg-pink-700 text-white rounded-full text-xs font-semibold shadow-xs transition active:scale-95"
              aria-label="Shopping Cart">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Cart</span>
              <span className="bg-white text-pink-700 text-[11px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {isMounted ? totalItems : 0}
              </span>
            </button>
          </motion.div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden border-t border-pink-100 py-3 space-y-1 bg-white">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:bg-pink-50 hover:text-pink-600 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
