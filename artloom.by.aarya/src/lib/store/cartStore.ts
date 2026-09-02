"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product, CartItem, CartItemCustomization, PromoCode } from "@/types";

export interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  giftWrapping: boolean;
  giftWrappingFee: number;
  giftMessage: string;
  appliedPromo: PromoCode | null;
  discount: number;

  // Actions
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (
    product: Product,
    customization: CartItemCustomization,
    quantity?: number
  ) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  setGiftWrapping: (enabled: boolean, message?: string) => void;
  applyPromo: (promo: PromoCode, discountAmount: number) => void;
  removePromo: () => void;
  clearCart: () => void;

  // Getters
  getSubtotal: () => number;
  getTotalItems: () => number;
  getShippingFee: () => number;
  getGrandTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      giftWrapping: false,
      giftWrappingFee: 49,
      giftMessage: "",
      appliedPromo: null,
      discount: 0,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (product, customization, quantity = 1) => {
        const state = get();
        // Calculate unit price based on size multiplier
        const basePrice = product.price;
        const multiplier = customization.selectedSize.priceMultiplier || 1.0;
        const unitPrice = Math.round(basePrice * multiplier);

        // Generate consistent identifier based on options
        const customKey = `${product.id}-${customization.selectedSize.id}-${customization.selectedColorTheme.id}-${customization.customNameText || ""}`;
        
        const existingIndex = state.items.findIndex((item) => item.id === customKey);

        if (existingIndex > -1) {
          const updatedItems = [...state.items];
          updatedItems[existingIndex].quantity += quantity;
          set({ items: updatedItems, isOpen: true });
        } else {
          const newItem: CartItem = {
            id: customKey,
            product,
            quantity,
            unitPrice,
            customization,
          };
          set({ items: [...state.items, newItem], isOpen: true });
        }
      },

      removeItem: (id: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
      },

      setGiftWrapping: (enabled: boolean, message = "") => {
        set({
          giftWrapping: enabled,
          giftMessage: message,
        });
      },

      applyPromo: (promo: PromoCode, discountAmount: number) => {
        set({
          appliedPromo: promo,
          discount: discountAmount,
        });
      },

      removePromo: () => {
        set({
          appliedPromo: null,
          discount: 0,
        });
      },

      clearCart: () => {
        set({
          items: [],
          appliedPromo: null,
          discount: 0,
          giftWrapping: false,
          giftMessage: "",
        });
      },

      getSubtotal: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
      },

      getTotalItems: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getShippingFee: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        // Free shipping on orders of ₹799 or more
        return subtotal >= 799 ? 0 : 60;
      },

      getGrandTotal: () => {
        const state = get();
        const subtotal = state.getSubtotal();
        if (subtotal === 0) return 0;
        const shipping = state.getShippingFee();
        const giftWrap = state.giftWrapping ? state.giftWrappingFee : 0;
        const discount = Math.min(state.discount, subtotal);
        return Math.max(0, subtotal - discount + shipping + giftWrap);
      },
    }),
    {
      name: "artloom_cart_v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        giftWrapping: state.giftWrapping,
        giftMessage: state.giftMessage,
        appliedPromo: state.appliedPromo,
        discount: state.discount,
      }),
    }
  )
);
