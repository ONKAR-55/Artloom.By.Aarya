"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Gift,
  ArrowRight,
  Sparkles,
  Tag,
  Check,
  Truck,
} from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { DataStore } from "@/lib/db/store";

export function CartDrawer() {
  const router = useRouter();
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    getSubtotal,
    getShippingFee,
    getGrandTotal,
    giftWrapping,
    giftWrappingFee,
    giftMessage,
    setGiftWrapping,
    appliedPromo,
    applyPromo,
    removePromo,
    discount,
  } = useCartStore();

  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");
  const [giftMsgInput, setGiftMsgInput] = useState(giftMessage);

  if (!isOpen) return null;

  const subtotal = getSubtotal();
  const shippingFee = getShippingFee();
  const grandTotal = getGrandTotal();

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");
    setPromoSuccess("");

    if (!promoInput.trim()) return;

    const result = await DataStore.validatePromoCode(promoInput, subtotal);
    if (result.valid && result.promo) {
      applyPromo(result.promo, result.discount);
      setPromoSuccess(result.message);
      setPromoInput("");
    } else {
      setPromoError(result.message);
    }
  };

  const handleProceedToCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFFDF9] shadow-2xl flex flex-col border-l border-amber-100 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 sm:p-6 bg-white border-b border-amber-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  Your Handmade Cart
                </h3>
                <p className="text-xs text-stone-500">
                  {items.length} {items.length === 1 ? "creation" : "creations"}
                </p>
              </div>
            </div>
            <button
              onClick={closeCart}
              className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                  <ShoppingBag className="w-8 h-8 stroke-1" />
                </div>
                <h4 className="font-serif text-lg font-bold text-stone-800">
                  Your cart is empty
                </h4>
                <p className="text-sm text-stone-500 mt-1 max-w-xs">
                  Discover our handmade woolen mat rangolis, auspicious torans, and pooja mats.
                </p>
                <Link
                  href="/products"
                  onClick={closeCart}
                  className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-full text-sm font-semibold transition shadow-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  Explore Handcrafted Collections
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-3.5 border border-amber-100 shadow-2xs flex gap-3.5"
                >
                  {/* Product thumbnail */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details & Customizations */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-medium text-sm text-stone-900 line-clamp-1">
                        {item.product.title}
                      </h4>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-stone-400 hover:text-rose-600 transition p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Customization Specs */}
                    <div className="mt-1 space-y-0.5 text-xs text-stone-600">
                      <p className="flex items-center gap-1.5">
                        <span className="text-amber-800 font-medium">Size:</span>
                        <span>{item.customization.selectedSize.label}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <span className="text-amber-800 font-medium">Colors:</span>
                        <span>{item.customization.selectedColorTheme.name}</span>
                      </p>
                      {item.customization.customNameText && (
                        <p className="flex items-center gap-1.5 text-rose-700 font-medium">
                          <span>Custom Text:</span>
                          <span className="bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                            &ldquo;{item.customization.customNameText}&rdquo;
                          </span>
                        </p>
                      )}
                    </div>

                    {/* Quantity & Unit Price */}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-stone-600 hover:bg-stone-200 transition"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-stone-600 hover:bg-stone-200 transition"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="font-bold text-sm text-stone-900">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Gift Wrapping Accordion */}
            {items.length > 0 && (
              <div className="bg-rose-50/60 rounded-xl p-3.5 border border-rose-100">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={giftWrapping}
                    onChange={(e) => setGiftWrapping(e.target.checked, giftMsgInput)}
                    className="mt-1 w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-rose-300"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                        <Gift className="w-3.5 h-3.5 text-rose-600" />
                        Handmade Gift Wrap & Personal Card
                      </span>
                      <span className="text-xs font-semibold text-rose-700">
                        +{formatPrice(giftWrappingFee)}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Artisan kraft wrap with handmade woolen tassel & personalized handwritten greeting note.
                    </p>

                    {giftWrapping && (
                      <div className="mt-2.5">
                        <textarea
                          placeholder="Type your gift message here (e.g. Best wishes for your new home!)..."
                          value={giftMsgInput}
                          onChange={(e) => {
                            setGiftMsgInput(e.target.value);
                            setGiftWrapping(true, e.target.value);
                          }}
                          rows={2}
                          className="w-full text-xs p-2 rounded-lg border border-rose-200 bg-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                        />
                      </div>
                    )}
                  </div>
                </label>
              </div>
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 bg-white border-t border-amber-100 space-y-4">
              {/* Promo Code Form */}
              <div className="space-y-1">
                {appliedPromo ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-800">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      <span>
                        Coupon <strong>{appliedPromo.code}</strong> applied (-
                        {formatPrice(discount)})
                      </span>
                    </div>
                    <button
                      onClick={removePromo}
                      className="text-stone-400 hover:text-rose-600 font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Discount code (e.g. WELCOMEAARYA)"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                        className="w-full text-xs uppercase px-3 py-2 rounded-lg border border-stone-200 focus:outline-none bg-stone-50"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-lg text-xs font-semibold transition"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {promoError && (
                  <p className="text-[11px] text-rose-600 font-medium">{promoError}</p>
                )}
                {promoSuccess && (
                  <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                    <Check className="w-3 h-3" /> {promoSuccess}
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600 pt-2 border-t border-stone-100">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                {giftWrapping && (
                  <div className="flex justify-between">
                    <span>Gift Wrap & Card</span>
                    <span>+{formatPrice(giftWrappingFee)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span>Delivery Charge</span>
                  <span className="font-semibold">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-700 font-bold">FREE</span>
                    ) : (
                      formatPrice(shippingFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Total Amount</span>
                  <span className="text-amber-900 text-base font-serif">
                    {formatPrice(grandTotal)}
                  </span>
                </div>
              </div>

              {/* Checkout Action CTA */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 px-4 bg-linear-to-r from-amber-700 via-rose-600 to-amber-800 text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg hover:brightness-105 active:scale-[0.99] transition flex items-center justify-center gap-2"
              >
                <span>Proceed to Order (No Account Needed)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
