"use client";

import Link from "next/link";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Share, ArrowRight, Palette } from "lucide-react";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const discountPercentage = product.compareAtPrice
    ? Math.round(
        ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100
      )
    : 0;

  return (
    <motion.div 
    initial={{ opacity: 0, y: 20 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ duration: 0.4, delay: 0.1 }} 
    className="bg-white rounded-2xl border border-pink-100 hover:border-pink-300 transition-all duration-300 shadow-2xs hover:shadow-2xl hover:shadow-amber-100 flex flex-col justify-between overflow-hidden group">
      {/* Aesthetic Text-Only Visual Block (Replacing images for a clean look) */}
      <Link
        href={`/products/${product.slug}`}
        className="relative bg-linear-to-br from-pink-50 via-pink-100/60 to-pink-50 p-6 flex flex-col items-center justify-center text-center min-h-40 border-b border-pink-100/60 group-hover:bg-pink-100/80 transition">
        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          {product.featuredMotif && (
            <span className="bg-white/90 text-pink-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-pink-200">
              {product.featuredMotif}
            </span>
          )}
          <button onClick={() => {navigator.clipboard.writeText(window.location.href); setTimeout(() => {
            alert("Link Copied!")
          }, 100)}} className="bg-white/90 text-pink-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-pink-200 cursor-pointer">
            <Share className="w-3 h-3" />
          </button>
        </div>
        {discountPercentage > 0 && (
          <div className="absolute top-2.5 right-2.5 bg-pink-100 text-pink-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-pink-200">
            {discountPercentage}% OFF
          </div>
        )}

        {/* Big stylized title in the visual block */}
        <div className="w-auto h-auto rounded-full bg-white shadow-2xs border border-pink-200 flex items-center justify-center text-pink-600 text-base mb-2">
          <img src={product.images[0]} alt={product.title} width={130} height={130} className="rounded-full"/>
        </div>
        <h3 className="font-serif font-bold text-stone-900 text-sm group-hover:text-pink-700 transition line-clamp-2 max-w-55">
          {product.title}
        </h3>
        <p className="text-[11px] text-pink-600/90 font-medium mt-0.5">
          {product.subtitle}
        </p>
      </Link>

      {/* Card Content & Actions */}
      <div className="p-4 space-y-3">
        {/* Color themes count */}
        <div className="flex items-center justify-between text-[11px] text-stone-500">
          <span className="flex items-center gap-1 text-pink-700 font-medium">
            <Palette className="w-3 h-3" />
            {product.colorThemes.length} Color Options
          </span>
          <span>Washable &amp; Reusable</span>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-2 border-t border-pink-50 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif font-bold text-base text-stone-900">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="text-xs text-stone-400 line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>
          </div>

          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-pink-50 hover:bg-pink-600 text-pink-700 hover:text-white font-semibold text-xs transition border border-pink-200"
          >
            <span>Customize</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
