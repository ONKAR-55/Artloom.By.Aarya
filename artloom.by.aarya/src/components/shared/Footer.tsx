import Link from "next/link";
import { Sparkles, Truck, RefreshCw, Layers } from "lucide-react";
import {motion} from "framer-motion";

export function Footer() {
  return (
    <footer className="bg-white border-t border-pink-100 pt-10 pb-8 text-stone-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Simple Guarantees Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-8 border-b border-pink-100 text-center sm:text-left">
          <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2.5 p-2 rounded-xl bg-pink-50/50 border border-pink-200 shadow-xs hover:shadow-md shadow-amber-100 transition-all duration-400 hover:scale-105">
            <Sparkles className="w-4 h-4 text-pink-500 shrink-0" />
            <div>
              <p className="text-md font-bold text-stone-900">100% Handcrafted</p>
              <p className="text-sm text-stone-500">Premium soft wool</p>
            </div>
          </motion.div>

          <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2.5 p-2 rounded-xl bg-pink-50/50 border border-pink-200 shadow-xs hover:shadow-md shadow-amber-100 transition-all duration-400 hover:scale-105">
            <RefreshCw className="w-4 h-4 text-pink-500 shrink-0" />
            <div> 
              <p className="text-md font-bold text-stone-900">Washable &amp; Reusable</p>
              <p className="text-sm text-stone-500">Lasts for years</p>
            </div>
          </motion.div>

          <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2.5 p-2 rounded-xl bg-pink-50/50 border border-pink-200 shadow-xs hover:shadow-md shadow-amber-100 transition-all duration-400 hover:scale-105">
            <Layers className="w-4 h-4 text-pink-500 shrink-0" />
            <div>
              <p className="text-md font-bold text-stone-900">Custom Designs</p>
              <p className="text-sm text-stone-500">Size, colors &amp; names</p>
            </div>
          </motion.div>

          <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2.5 p-2 rounded-xl bg-pink-50/50 border border-pink-200 shadow-xs hover:shadow-md shadow-amber-100 transition-all duration-400 hover:scale-105">
            <Truck className="w-4 h-4 text-pink-500 shrink-0" />
            <div>
              <p className="text-md font-bold text-stone-900">Home Delivery</p>
              <p className="text-sm text-stone-500">On you door</p>
            </div>
          </motion.div>
        </div>

        {/* Footer Navigation & Brand */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-pink-600 font-serif font-bold text-base">
              Artloom.By.Aarya 🌸
            </span>
            <span className="text-stone-400">|</span>
            <span className="text-stone-500 text-[11px]">
              Handcrafted Woolen Rangolis &amp; Personalized Decor
            </span>
          </div>

          <div className="flex items-center gap-4 text-stone-600">
            <Link href="/products" className="hover:text-pink-600 transition">
              All Creations
            </Link>
            <Link href="/products?category=woolen-rangolis" className="hover:text-pink-600 transition">
              Woolen Rangolis
            </Link>
            <Link href="/products?category=entrance-torans" className="hover:text-pink-600 transition">
              Torans
            </Link>
            <Link href="/products?category=pooja-thali-mats" className="hover:text-pink-600 transition">
              Pooja Mats
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-4 border-t border-pink-50 text-center text-[11px] text-stone-400">
          © {new Date().getFullYear()} Artloom.By.Aarya. Handcrafted in India.
        </div>
      </div>
    </footer>
  );
}
