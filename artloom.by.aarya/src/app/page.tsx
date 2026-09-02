"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Palette, Layers, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ProductCard } from "@/components/product/ProductCard";
import { MotifFilterBar } from "@/components/product/MotifFilterBar";
import { Product, Category } from "@/types";
import { DataStore } from "@/lib/db/store";
import { motion } from "framer-motion";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedMotif, setSelectedMotif] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [prodList, catList] = await Promise.all([
        DataStore.getProducts(),
        DataStore.getCategories(),
      ]);
      setProducts(prodList);
      setCategories(catList);
      setLoading(false);
    }
    loadData();
  }, []);

  const filteredProducts = selectedMotif
    ? products.filter((p) =>
        p.motifs.some(
          (m) => m.toLowerCase() === selectedMotif.toLowerCase()
        ) || p.featuredMotif?.toLowerCase() === selectedMotif.toLowerCase()
      )
    : products;

  return (
    <div className="min-h-screen flex flex-col bg-[#fffafc]">
      <Header />
      <CartDrawer />

      <main className="flex-1">
        {/* 1. CLEAN HERO SECTION */}
        <section className="py-12 md:py-16 bg-pink-fade border-b border-pink-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-pink-200 text-xs text-pink-700 font-semibold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
              <span>Personalized Handmade Decor</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 tracking-tight leading-tight">
              Handcrafted Woolen Rangolis &amp;{" "}
              <span className="text-pink-600">Custom Home Decor</span>
            </h1>

            <p className="text-sm sm:text-base text-stone-600 max-w-xl mx-auto leading-relaxed">
              Washable, reusable, and durable handmade creations crafted with love. Personalize your size, color combinations, and family name.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/products"
                className="px-6 py-2.5 rounded-full bg-pink-600 hover:bg-pink-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition"
              >
                Browse All Creations
              </Link>
              <Link
                href="/products?category=woolen-rangolis"
                className="px-6 py-2.5 rounded-full bg-white hover:bg-pink-50 text-stone-800 font-semibold text-xs sm:text-sm border border-pink-200 shadow-2xs transition"
              >
                Woolen Mat Rangolis
              </Link>
            </div>
          </div>
        </section>

        {/* 2. SACRED MOTIFS BAR */}
        <section className="py-4 bg-white border-b border-pink-100 sticky top-16 z-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <MotifFilterBar
              selectedMotif={selectedMotif}
              onSelectMotif={setSelectedMotif}
            />
          </div>
        </section>

        {/* 3. CLEAN CATEGORIES ROW (Simple text blocks without heavy images) */}
        <section className="py-10 max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-5 flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-stone-900">Explore Collections</h2>
            <Link
              href="/products"
              className="text-xs font-semibold text-pink-600 hover:text-pink-700 flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>

          <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="p-4 rounded-xl bg-white border border-pink-100 hover:border-pink-300 hover:bg-pink-50/50 transition-all text-center space-y-1 shadow-2xl group hover:shadow-amber-100 duration-300"
              >
                <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center mx-auto text-sm group-hover:scale-105 transition">
                  🌸
                </div>
                <h3 className="font-serif font-bold text-xs text-stone-900 group-hover:text-pink-700">
                  {cat.name}
                </h3>
                <p className="text-[10px] text-stone-400">
                  {cat.itemCount} Designs
                </p>
              </Link>
            ))}
          </motion.div>
        </section>

        {/* 4. PRODUCT CREATIONS GRID */}
        <section className="py-8 bg-white border-t border-b border-pink-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
            <motion.div 
            initial={{ opacity: 0, y: 20}}
            animate={{ opacity: 1, y: 0}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-bold text-stone-900">
                  {selectedMotif ? `Creations with "${selectedMotif}"` : "Handcrafted Items"}
                </h2>
                <p className="text-xs text-stone-500">
                  {filteredProducts.length} items available
                </p>
              </div>
            </motion.div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 bg-pink-50 rounded-2xl" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <motion.div 
              initial={{ opacity: 0, y: 20}}
              animate={{ opacity: 1, y: 0}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center py-12 bg-pink-50/40 rounded-2xl border border-pink-100 p-4">
                <p className="text-xs font-semibold text-stone-600">
                  No items found for &ldquo;{selectedMotif}&rdquo;
                </p>
                <button
                  onClick={() => setSelectedMotif(null)}
                  className="mt-2 px-3 py-1 bg-pink-600 text-white rounded-lg text-xs"
                >
                  Show All Items
                </button>
              </motion.div>
            ) : (
              <motion.div 
              initial={{ opacity: 0, y: 20}}
              animate={{ opacity: 1, y: 0}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </motion.div>
            )}
          </div>
        </section>

        {/* 5. SIMPLE 3-STEP ORDERING GUIDE */}
        <section className="py-12 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-serif text-xl font-bold text-stone-900 mb-6">
            Simple 3-Step Ordering
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-white p-4 rounded-xl border border-pink-100 space-y-1.5 shadow-2xs">
              <span className="w-7 h-7 rounded-full bg-pink-100 text-pink-700 font-bold flex items-center justify-center mx-auto text-xs">
                1
              </span>
              <h4 className="font-bold text-stone-900 text-xs">Pick a Design</h4>
              <p className="text-[11px] text-stone-500">
                Choose your favorite sacred motif or decor mat.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-pink-100 space-y-1.5 shadow-2xs">
              <span className="w-7 h-7 rounded-full bg-pink-100 text-pink-700 font-bold flex items-center justify-center mx-auto text-xs">
                2
              </span>
              <h4 className="font-bold text-stone-900 text-xs">Personalize</h4>
              <p className="text-[11px] text-stone-500">
                Select your preferred diameter size, colors &amp; custom name.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-pink-100 space-y-1.5 shadow-2xs">
              <span className="w-7 h-7 rounded-full bg-pink-100 text-pink-700 font-bold flex items-center justify-center mx-auto text-xs">
                3
              </span>
              <h4 className="font-bold text-stone-900 text-xs">Direct Order</h4>
              <p className="text-[11px] text-stone-500">
                Zero account needed. Delivered directly to your doorstep.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
