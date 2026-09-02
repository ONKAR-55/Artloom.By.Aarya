"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ProductCard } from "@/components/product/ProductCard";
import { MotifFilterBar } from "@/components/product/MotifFilterBar";
import { Product, CategorySlug } from "@/types";
import { DataStore } from "@/lib/db/store";
import { Search } from "lucide-react";

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") as CategorySlug | null;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory || "all"
  );
  const [selectedMotif, setSelectedMotif] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("featured");

  useEffect(() => {
    async function load() {
      const data = await DataStore.getProducts();
      setProducts(data);
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const categories = [
    { slug: "all", label: "All Items" },
    { slug: "woolen-rangolis", label: "Woolen Rangolis" },
    { slug: "entrance-torans", label: "Entrance Torans" },
    { slug: "pooja-thali-mats", label: "Pooja Mats" },
    { slug: "home-decor-mats", label: "Home Mats" },
    { slug: "festive-hampers", label: "Gift Hampers" },
  ];

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(term);
          const matchSub = p.subtitle.toLowerCase().includes(term);
          const matchMotif = p.motifs.some((m) => m.toLowerCase().includes(term));
          if (!matchTitle && !matchSub && !matchMotif) return false;
        }

        if (selectedCategory !== "all" && p.category !== selectedCategory) {
          return false;
        }

        if (
          selectedMotif &&
          !p.motifs.some(
            (m) => m.toLowerCase() === selectedMotif.toLowerCase()
          ) &&
          p.featuredMotif?.toLowerCase() !== selectedMotif.toLowerCase()
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
      });
  }, [products, searchTerm, selectedCategory, selectedMotif, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fffafc]">
      <Header />
      <CartDrawer />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-6 w-full space-y-6">
        {/* Simple Page Header */}
        <div className="border-b border-pink-100 pb-4">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Handcrafted Creations
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Woolen mat rangolis, auspicious torans, pooja thali mats, and personalized gifts.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2.5 items-center justify-between">
            {/* Search */}
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
              <input
                type="text"
                placeholder="Search by name, motif..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-pink-200 bg-white text-xs focus:outline-none"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end text-xs">
              <span className="text-stone-500">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs px-2 py-1.5 rounded-lg border border-pink-200 bg-white focus:outline-none"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Motif filter */}
          <MotifFilterBar
            selectedMotif={selectedMotif}
            onSelectMotif={setSelectedMotif}
          />
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-pink-50 rounded-2xl" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-pink-100 p-4">
            <p className="text-xs font-semibold text-stone-600">
              No matching creations found.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSelectedMotif(null);
              }}
              className="mt-2 px-3 py-1 bg-pink-600 text-white rounded-lg text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#fffafc]">
          <p className="text-xs text-stone-500 font-medium">Loading items...</p>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
