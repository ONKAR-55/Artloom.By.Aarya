"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Product,
  SizeOption,
  ColorThemeOption,
  CartItemCustomization,
} from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cartStore";
import {
  Sparkles,
  ShoppingBag,
  Check,
  Plus,
  Minus,
  Truck,
  Layers,
  Palette,
  Zap,
} from "lucide-react";

interface ProductCustomizerProps {
  product: Product;
}

export function ProductCustomizer({ product }: ProductCustomizerProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  const [selectedSize, setSelectedSize] = useState<SizeOption>(
    product.sizes.find((s) => s.isPopular) || product.sizes[0]
  );
  const [selectedColorTheme, setSelectedColorTheme] = useState<ColorThemeOption>(
    product.colorThemes[0]
  );
  const [customName, setCustomName] = useState("");
  const [customNotes, setCustomNotes] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addedEffect, setAddedEffect] = useState(false);

  // Dynamic price calculation
  const calculatedUnitPrice = Math.round(
    product.price * (selectedSize.priceMultiplier || 1.0)
  );
  const calculatedTotalPrice = calculatedUnitPrice * quantity;

  const handleAddToCart = () => {
    const customization: CartItemCustomization = {
      selectedSize,
      selectedColorTheme,
      customNameText: customName.trim() || undefined,
      customNotes: customNotes.trim() || undefined,
      chosenMotif: product.featuredMotif,
    };

    addItem(product, customization, quantity);
    setAddedEffect(true);
    setTimeout(() => setAddedEffect(false), 2000);
  };

  const handleBookNow = () => {
    const customization: CartItemCustomization = {
      selectedSize,
      selectedColorTheme,
      customNameText: customName.trim() || undefined,
      customNotes: customNotes.trim() || undefined,
      chosenMotif: product.featuredMotif,
    };

    addItem(product, customization, quantity);
    router.push("/checkout");
  };

  return (
    <div className="space-y-5 bg-white p-5 rounded-2xl border border-pink-100 shadow-2xs">
      {/* Price */}
      <div className="flex items-baseline justify-between border-b border-pink-100 pb-3">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-stone-900">
              {formatPrice(calculatedTotalPrice)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs text-stone-400 line-through">
                {formatPrice(
                  Math.round(product.compareAtPrice * (selectedSize.priceMultiplier || 1.0)) *
                    quantity
                )}
              </span>
            )}
          </div>
          <span className="text-[11px] text-pink-600 font-medium">
            Handcrafted with soft yarn
          </span>
        </div>

        <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-semibold border border-emerald-200">
          Ready to Craft
        </span>
      </div>

      {/* 1. Size Selection */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-pink-500" />
          <span>Size:</span>
        </label>

        <div className="grid grid-cols-2 gap-2">
          {product.sizes.map((size) => {
            const isSelected = selectedSize.id === size.id;
            return (
              <button
                key={size.id}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`p-2.5 rounded-xl text-left border text-xs transition ${
                  isSelected
                    ? "border-pink-500 bg-pink-50/70 font-semibold text-pink-900"
                    : "border-pink-100 bg-white hover:border-pink-200 text-stone-700"
                }`}
              >
                <div>{size.label}</div>
                <div className="text-[10px] text-stone-400 mt-0.5">
                  {size.dimensions}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Color Theme Swatches */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-pink-500" />
          <span>Woolen Color Combination:</span>
        </label>

        <div className="grid grid-cols-2 gap-2">
          {product.colorThemes.map((theme) => {
            const isSelected = selectedColorTheme.id === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => setSelectedColorTheme(theme)}
                className={`p-2 rounded-xl border flex items-center gap-2 text-left text-xs transition ${
                  isSelected
                    ? "border-pink-500 bg-pink-50/70 font-semibold text-pink-900"
                    : "border-pink-100 bg-white hover:border-pink-200 text-stone-700"
                }`}
              >
                <div className="flex items-center -space-x-1 shrink-0">
                  {theme.colors.map((hex, i) => (
                    <span
                      key={i}
                      className="w-4 h-4 rounded-full border border-white shadow-2xs inline-block"
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>
                <span className="truncate text-[11px]">{theme.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-pink-600 ml-auto shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Custom Name Input */}
      {product.isCustomizable && (
        <div className="p-3 rounded-xl bg-pink-50/50 border border-pink-100 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-stone-900 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              <span>Personalization / Custom Name (Optional)</span>
            </label>
            <span className="text-[10px] text-pink-600 font-bold">FREE</span>
          </div>
          <input
            type="text"
            placeholder="e.g. 'Sharma Family' or 'Shubh Aagman'"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className="w-full text-xs p-2 rounded-lg border border-pink-200 bg-white focus:outline-none"
            maxLength={40}
          />
        </div>
      )}

      {/* 4. Quantity */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-stone-900">Quantity:</span>
        <div className="flex items-center border border-pink-200 rounded-lg overflow-hidden bg-white">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-2.5 py-1 text-stone-600 hover:bg-pink-50"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="px-3 text-xs font-bold text-stone-900">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="px-2.5 py-1 text-stone-600 hover:bg-pink-50"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 5. CTAs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
        <button
          type="button"
          onClick={handleAddToCart}
          className={`py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition ${
            addedEffect
              ? "bg-emerald-600 text-white"
              : "bg-white hover:bg-pink-50 text-pink-700 border border-pink-300"
          }`}
        >
          {addedEffect ? (
            <>
              <Check className="w-3.5 h-3.5" /> Added!
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleBookNow}
          className="py-2.5 px-4 rounded-xl font-bold text-xs bg-pink-600 hover:bg-pink-700 text-white shadow-xs transition flex items-center justify-center gap-1.5"
        >
          <Zap className="w-3.5 h-3.5 fill-white" />
          Order Booking
        </button>
      </div>

      <p className="text-[11px] text-center text-stone-500">
        ✨ Washable, reusable &amp; anti-slip felt backing
      </p>
    </div>
  );
}
