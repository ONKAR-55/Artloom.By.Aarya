"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ProductCustomizer } from "@/components/product/ProductCustomizer";
import { ProductCard } from "@/components/product/ProductCard";
import { Product } from "@/types";
import { DataStore } from "@/lib/db/store";
import { ChevronRight, Sparkles, CheckCircle2 } from "lucide-react";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const resolvedParams = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const p = await DataStore.getProductBySlug(resolvedParams.slug);
      if (p) {
        setProduct(p);
        const all = await DataStore.getProducts();
        const related = all
          .filter((item) => item.id !== p.id && item.category === p.category)
          .slice(0, 3);
        setRelatedProducts(related);
      }
      setLoading(false);
    }
    load();
  }, [resolvedParams.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fffafc]">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xs font-medium text-stone-500">Loading details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fffafc]">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center py-16 text-center px-4">
          <h2 className="font-serif text-xl font-bold text-stone-900">
            Creation Not Found
          </h2>
          <Link
            href="/products"
            className="mt-4 px-4 py-2 bg-pink-600 text-white rounded-full text-xs font-semibold"
          >
            Return to All Creations
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fffafc]">
      <Header />
      <CartDrawer />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-6 w-full space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-stone-500">
          <Link href="/" className="hover:text-pink-600">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/products" className="hover:text-pink-600">
            Creations
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-stone-900 font-medium truncate">
            {product.title}
          </span>
        </nav>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Column: Clean Visual Showcase (Text/Motif block without images) */}
          <div className="md:col-span-5 space-y-4">
            <div className="bg-linear-to-br from-pink-50 via-pink-100/70 to-pink-50 rounded-3xl p-8 border border-pink-200/80 text-center flex flex-col items-center justify-center min-h-75 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-white shadow-xs border border-pink-200 flex items-center justify-center text-2xl mb-3">
                🌸
              </div>

              {product.featuredMotif && (
                <span className="bg-white text-pink-700 text-xs font-bold px-3 py-1 rounded-full border border-pink-200 shadow-2xs mb-2">
                  Motif: {product.featuredMotif}
                </span>
              )}

              <h2 className="font-serif text-xl font-bold text-stone-900 max-w-xs">
                {product.title}
              </h2>
              <p className="text-xs text-pink-700/80 font-medium mt-1">
                {product.subtitle}
              </p>

              <div className="mt-4 flex items-center gap-2 text-[11px] text-stone-600 bg-white/80 px-3 py-1.5 rounded-xl border border-pink-100">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Washable • Reusable • Anti-Slip</span>
              </div>
            </div>

            {/* Quick Specs */}
            <div className="bg-white p-4 rounded-2xl border border-pink-100 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-500">Material:</span>
                <span className="font-medium text-stone-800">Soft Acrylic Wool &amp; Felt</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Care:</span>
                <span className="font-medium text-stone-800">Gentle cold water wash</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Crafting Time:</span>
                <span className="font-medium text-stone-800">2-3 days hand-knitting</span>
              </div>
            </div>
          </div>

          {/* Right Column: Customizer & Order Options */}
          <div className="md:col-span-7 space-y-4">
            <div>
              <h1 className="font-serif text-2xl font-bold text-stone-900">
                {product.title}
              </h1>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                {product.description}
              </p>
            </div>

            <ProductCustomizer product={product} />
          </div>
        </div>

        {/* Related Creations */}
        {relatedProducts.length > 0 && (
          <section className="pt-8 border-t border-pink-100">
            <h3 className="font-serif text-lg font-bold text-stone-900 mb-4">
              More Handcrafted Creations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
