"use client";

import {
  Product,
  Category,
  Order,
  PromoCode,
  AnnouncementBanner,
  AdminStats,
  OrderStatus,
} from "@/types";
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_PROMOS,
  INITIAL_BANNER,
  INITIAL_ORDERS,
} from "./mockData";
import { supabase, isSupabaseConfigured } from "./supabase";

const PRODUCTS_KEY = "artloom_products_v1";
const ORDERS_KEY = "artloom_orders_v1";
const PROMOS_KEY = "artloom_promos_v1";
const BANNER_KEY = "artloom_banner_v1";

// Helper to safely get from localStorage
function getLocalItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

// Helper to safely set in localStorage
function setLocalItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error("Storage error:", err);
  }
}

export const DataStore = {
  // PRODUCTS
  async getProducts(): Promise<Product[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from("products").select("*");
        if (!error && data && data.length > 0) return data as Product[];
      } catch (err) {
        console.warn("Supabase query failed, falling back to local data:", err);
      }
    }
    const local = getLocalItem<Product[]>(PRODUCTS_KEY, INITIAL_PRODUCTS);
    return local;
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    const products = await this.getProducts();
    return products.find((p) => p.slug === slug || p.id === slug) || null;
  },

  async getCategories(): Promise<Category[]> {
    return INITIAL_CATEGORIES;
  },

  async saveProduct(product: Product): Promise<Product> {
    const products = await this.getProducts();
    const existingIndex = products.findIndex((p) => p.id === product.id);
    let updatedProducts: Product[];

    if (existingIndex >= 0) {
      updatedProducts = [...products];
      updatedProducts[existingIndex] = product;
    } else {
      updatedProducts = [product, ...products];
    }

    setLocalItem(PRODUCTS_KEY, updatedProducts);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("products").upsert(product);
      } catch (err) {
        console.error("Supabase upsert error:", err);
      }
    }

    return product;
  },

  async deleteProduct(productId: string): Promise<void> {
    const products = await this.getProducts();
    const updated = products.filter((p) => p.id !== productId);
    setLocalItem(PRODUCTS_KEY, updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("products").delete().eq("id", productId);
      } catch (err) {
        console.error("Supabase delete error:", err);
      }
    }
  },

  // ORDERS
  async getOrders(): Promise<Order[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false });
        if (!error && data && data.length > 0) return data as Order[];
      } catch (err) {
        console.warn("Supabase fetch orders failed:", err);
      }
    }
    return getLocalItem<Order[]>(ORDERS_KEY, INITIAL_ORDERS);
  },

  async getOrderById(orderId: string): Promise<Order | null> {
    const orders = await this.getOrders();
    return orders.find((o) => o.id.toLowerCase() === orderId.toLowerCase()) || null;
  },

  async createOrder(order: Order): Promise<Order> {
    const orders = await this.getOrders();
    const updatedOrders = [order, ...orders];
    setLocalItem(ORDERS_KEY, updatedOrders);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("orders").insert(order);
      } catch (err) {
        console.error("Supabase insert order error:", err);
      }
    }

    return order;
  },

  async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    artisanNote?: string
  ): Promise<Order | null> {
    const orders = await this.getOrders();
    const index = orders.findIndex((o) => o.id === orderId);
    if (index === -1) return null;

    const updatedOrder: Order = {
      ...orders[index],
      status,
      ...(artisanNote !== undefined ? { artisanNote } : {}),
    };

    orders[index] = updatedOrder;
    setLocalItem(ORDERS_KEY, orders);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from("orders")
          .update({ status, artisan_note: artisanNote })
          .eq("id", orderId);
      } catch (err) {
        console.error("Supabase update order error:", err);
      }
    }

    return updatedOrder;
  },

  // PROMO CODES
  async getPromoCodes(): Promise<PromoCode[]> {
    return getLocalItem<PromoCode[]>(PROMOS_KEY, INITIAL_PROMOS);
  },

  async savePromoCode(promo: PromoCode): Promise<void> {
    const promos = await this.getPromoCodes();
    const index = promos.findIndex((p) => p.code.toUpperCase() === promo.code.toUpperCase());
    let updated: PromoCode[];
    if (index >= 0) {
      updated = [...promos];
      updated[index] = promo;
    } else {
      updated = [promo, ...promos];
    }
    setLocalItem(PROMOS_KEY, updated);
  },

  async validatePromoCode(
    code: string,
    orderSubtotal: number
  ): Promise<{ valid: boolean; discount: number; message: string; promo?: PromoCode }> {
    const promos = await this.getPromoCodes();
    const match = promos.find(
      (p) => p.code.toUpperCase() === code.trim().toUpperCase() && p.active
    );

    if (!match) {
      return { valid: false, discount: 0, message: "Invalid or expired coupon code" };
    }

    if (orderSubtotal < match.minOrderValue) {
      return {
        valid: false,
        discount: 0,
        message: `Minimum order of ₹${match.minOrderValue} required for this code`,
      };
    }

    let discount = 0;
    if (match.discountType === "percentage") {
      discount = Math.round((orderSubtotal * match.discountValue) / 100);
    } else {
      discount = match.discountValue;
    }

    return {
      valid: true,
      discount: Math.min(discount, orderSubtotal),
      message: `Coupon "${match.code}" applied successfully!`,
      promo: match,
    };
  },

  // ANNOUNCEMENT BANNER
  async getBanner(): Promise<AnnouncementBanner> {
    return getLocalItem<AnnouncementBanner>(BANNER_KEY, INITIAL_BANNER);
  },

  async updateBanner(banner: AnnouncementBanner): Promise<void> {
    setLocalItem(BANNER_KEY, banner);
  },

  // ADMIN ANALYTICS
  async getAdminStats(): Promise<AdminStats> {
    const orders = await this.getOrders();
    const products = await this.getProducts();

    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const totalOrders = orders.length;
    const pendingCustomizations = orders.filter(
      (o) =>
        o.status === "Placed" ||
        o.status === "Queued for Crafting" ||
        o.status === "Weaving & Handcrafting 🧶"
    ).length;

    const motifCountMap: Record<string, number> = {};
    orders.forEach((o) => {
      o.items.forEach((item) => {
        const motif = item.customization.chosenMotif || item.product.featuredMotif || "Woolen Mat";
        motifCountMap[motif] = (motifCountMap[motif] || 0) + item.quantity;
      });
    });

    const topMotifs = Object.entries(motifCountMap)
      .map(([motif, count]) => ({ motif, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalRevenue,
      totalOrders,
      pendingCustomizations,
      activeProductsCount: products.filter((p) => p.inStock).length,
      topMotifs: topMotifs.length > 0 ? topMotifs : [
        { motif: "Kalash", count: 18 },
        { motif: "Mor Pankh", count: 14 },
        { motif: "Laxmi Charan", count: 12 },
        { motif: "Ganesha", count: 9 },
        { motif: "Rose Bloom", count: 7 },
      ],
    };
  },
};
