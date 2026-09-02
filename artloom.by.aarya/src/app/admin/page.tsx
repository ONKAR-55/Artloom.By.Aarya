"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Package,
  ShoppingBag,
  TrendingUp,
  Tag,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  Clock,
  Truck,
  Sparkles,
  Lock,
  LogOut,
  Layers,
  Printer,
  ChevronRight,
  Filter,
  Eye,
} from "lucide-react";
import { Product, Order, PromoCode, AnnouncementBanner, OrderStatus, AdminStats } from "@/types";
import { DataStore } from "@/lib/db/store";
import { formatPrice } from "@/lib/utils";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");

  const [activeTab, setActiveTab] = useState<"overview" | "products" | "orders" | "promotions">(
    "overview"
  );

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [banner, setBanner] = useState<AnnouncementBanner | null>(null);

  // Modals & form state
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<Order | null>(null);

  // New product form
  const [prodForm, setProdForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    category: "woolen-rangolis" as any,
    price: 899,
    compareAtPrice: 1299,
    stockCount: 10,
    featuredMotif: "Kalash",
    isCustomizable: true,
    imageUrl: "https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?auto=format&fit=crop&q=80&w=900",
  });

  // Promo code form
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [promoDiscountVal, setPromoDiscountVal] = useState(10);
  const [promoMinVal, setPromoMinVal] = useState(499);

  // Banner form
  const [bannerText, setBannerText] = useState("");
  const [bannerHighlight, setBannerHighlight] = useState("");
  const [bannerBadge, setBannerBadge] = useState("");

  useEffect(() => {
    // Check if session pin is stored
    const savedAuth = sessionStorage.getItem("artloom_admin_auth");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
      loadAdminData();
    }
  }, []);

  const loadAdminData = async () => {
    const [s, p, o, pr, b] = await Promise.all([
      DataStore.getAdminStats(),
      DataStore.getProducts(),
      DataStore.getOrders(),
      DataStore.getPromoCodes(),
      DataStore.getBanner(),
    ]);
    setStats(s);
    setProducts(p);
    setOrders(o);
    setPromos(pr);
    setBanner(b);
    if (b) {
      setBannerText(b.text);
      setBannerHighlight(b.highlightText);
      setBannerBadge(b.badge);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default PIN: "artloom2026" or "1234"
    if (pinInput === "artloom2026" || pinInput === "1234" || pinInput === "aarya") {
      sessionStorage.setItem("artloom_admin_auth", "true");
      setIsAuthenticated(true);
      setPinError("");
      loadAdminData();
    } else {
      setPinError("Invalid Admin PIN. (Hint: artloom2026)");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("artloom_admin_auth");
    setIsAuthenticated(false);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = prodForm.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const newProd: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      title: prodForm.title,
      slug,
      subtitle: prodForm.subtitle,
      description: prodForm.description,
      category: prodForm.category,
      price: Number(prodForm.price),
      compareAtPrice: Number(prodForm.compareAtPrice),
      inStock: true,
      stockCount: Number(prodForm.stockCount),
      isCustomizable: prodForm.isCustomizable,
      featuredMotif: prodForm.featuredMotif,
      motifs: [prodForm.featuredMotif, "Circular Flowers"],
      images: [prodForm.imageUrl],
      features: [
        "100% Handcrafted with premium yarn",
        "Washable & Reusable year after year",
        "Anti-slip felt backing",
      ],
      specifications: {
        material: "Soft Acrylic Wool",
        washCare: "Gentle cold water hand wash; flat dry",
        craftTime: "2 to 3 days",
        durability: "Colorfast & reusable",
        baseMaterial: "Anti-slip felt base",
        reusable: true,
      },
      sizes: [
        { id: "s-12", label: "Small (12\" Diameter)", dimensions: "12x12 inches", priceMultiplier: 0.8 },
        { id: "s-18", label: "Standard (18\" Diameter)", dimensions: "18x18 inches", priceMultiplier: 1.0, isPopular: true },
        { id: "s-24", label: "Grand (24\" Diameter)", dimensions: "24x24 inches", priceMultiplier: 1.55 },
      ],
      colorThemes: [
        { id: "c-1", name: "Haldi Yellow & Rani Pink", colors: ["#FBBF24", "#E11D48"], previewTag: "Festive" },
        { id: "c-2", name: "Peacock Blue & Emerald", colors: ["#0284C7", "#059669"] },
      ],
      rating: 5.0,
      reviewsCount: 1,
    };

    await DataStore.saveProduct(newProd);
    setIsAddProductOpen(false);
    setEditingProduct(null);
    loadAdminData();
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm("Are you sure you want to delete this handcrafted creation?")) {
      await DataStore.deleteProduct(id);
      loadAdminData();
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    await DataStore.updateOrderStatus(orderId, newStatus);
    loadAdminData();
  };

  const handleSavePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCodeInput.trim()) return;
    const newPromo: PromoCode = {
      code: promoCodeInput.trim().toUpperCase(),
      discountType: "percentage",
      discountValue: Number(promoDiscountVal),
      minOrderValue: Number(promoMinVal),
      description: `${promoDiscountVal}% OFF on orders above ₹${promoMinVal}`,
      active: true,
    };
    await DataStore.savePromoCode(newPromo);
    setPromoCodeInput("");
    loadAdminData();
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!banner) return;
    const updatedBanner: AnnouncementBanner = {
      ...banner,
      text: bannerText,
      highlightText: bannerHighlight,
      badge: bannerBadge,
    };
    await DataStore.updateBanner(updatedBanner);
    setBanner(updatedBanner);
    alert("Top Announcement Banner updated successfully!");
  };

  // If not authenticated, render login PIN screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-stone-950 p-8 rounded-3xl border border-stone-800 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-linear-to-tr from-amber-600 to-rose-600 flex items-center justify-center text-white text-2xl mx-auto shadow-lg">
            🌸
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-white">
              Artloom.By.Aarya
            </h2>
            <p className="text-xs text-amber-400 font-medium tracking-wide mt-1">
              Seller &amp; Artisan Management Studio
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="text-left">
              <label className="block text-xs font-semibold text-stone-400 mb-1">
                Enter Seller Access PIN / Password
              </label>
              <input
                type="password"
                placeholder="Enter PIN (e.g. artloom2026)"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full px-4 py-3 bg-stone-900 border border-stone-700 rounded-xl text-white text-sm focus:outline-none text-center tracking-widest font-mono"
                autoFocus
              />
            </div>

            {pinError && (
              <p className="text-xs text-rose-400 font-medium">{pinError}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-linear-to-r from-amber-600 to-rose-600 hover:brightness-110 text-white rounded-xl font-bold text-sm shadow-md transition"
            >
              Access Studio Dashboard
            </button>

            <p className="text-[11px] text-stone-500">
              Default access PIN is <strong className="text-stone-300">artloom2026</strong>
            </p>
          </form>

          <div className="pt-4 border-t border-stone-800">
            <Link
              href="/"
              className="text-xs text-stone-400 hover:text-white transition"
            >
              ← Return to Customer Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-100 text-stone-900">
      {/* Top Admin Navigation Header */}
      <header className="bg-stone-900 text-white border-b border-stone-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-linear-to-tr from-amber-600 to-rose-500 flex items-center justify-center text-sm shadow-md">
                🌸
              </span>
              <div>
                <span className="font-serif font-bold text-lg text-white">
                  Artloom.By.Aarya
                </span>
                <span className="text-[10px] text-amber-400 font-bold ml-2 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                  Seller Studio
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/"
                target="_blank"
                className="text-xs text-stone-300 hover:text-white px-3 py-1.5 rounded-lg border border-stone-700 bg-stone-800/80 flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Storefront</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs text-rose-300 hover:text-rose-200 px-3 py-1.5 rounded-lg border border-rose-900/50 bg-rose-950/40 flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-300 pb-4 mb-8 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${activeTab === "overview"
              ? "bg-stone-900 text-white shadow-sm"
              : "bg-white text-stone-700 hover:bg-stone-200"
              }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Overview &amp; Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${activeTab === "orders"
              ? "bg-stone-900 text-white shadow-sm"
              : "bg-white text-stone-700 hover:bg-stone-200"
              }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Customer Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${activeTab === "products"
              ? "bg-stone-900 text-white shadow-sm"
              : "bg-white text-stone-700 hover:bg-stone-200"
              }`}
          >
            <Package className="w-4 h-4" />
            <span>Handcrafted Catalog ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("promotions")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${activeTab === "promotions"
              ? "bg-stone-900 text-white shadow-sm"
              : "bg-white text-stone-700 hover:bg-stone-200"
              }`}
          >
            <Tag className="w-4 h-4" />
            <span>Promotions &amp; Banners</span>
          </button>
        </div>

        {/* 1. OVERVIEW & ANALYTICS TAB */}
        {activeTab === "overview" && stats && (
          <div className="space-y-8">
            {/* Top metric cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Total Bookings Revenue
                </span>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-amber-900">
                  {formatPrice(stats.totalRevenue)}
                </div>
                <p className="text-[11px] text-stone-400">All registered customer orders</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Total Orders
                </span>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                  {stats.totalOrders}
                </div>
                <p className="text-[11px] text-stone-400">Across all Indian locations</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  In Handcrafting 🧶
                </span>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-rose-700">
                  {stats.pendingCustomizations}
                </div>
                <p className="text-[11px] text-stone-400">Currently in active knitting queue</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Active Creations
                </span>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-emerald-800">
                  {stats.activeProductsCount}
                </div>
                <p className="text-[11px] text-stone-400">Published in online store</p>
              </div>
            </div>

            {/* Top Motifs & Quick Order Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
                <h3 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  Most Popular Handcrafted Motifs
                </h3>
                <div className="space-y-3">
                  {stats.topMotifs.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-100 text-xs"
                    >
                      <span className="font-bold text-stone-900">{item.motif}</span>
                      <span className="bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 rounded-full">
                        {item.count} items ordered
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
                <h3 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-amber-700" />
                  Recent Orders Feed
                </h3>
                <div className="space-y-3">
                  {orders.slice(0, 4).map((order) => (
                    <div
                      key={order.id}
                      className="p-3 rounded-xl bg-stone-50 border border-stone-100 text-xs flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-stone-900">
                          {order.id} • {order.customer.fullName}
                        </div>
                        <div className="text-stone-500 text-[11px]">
                          {order.items.length} items • {formatPrice(order.totalAmount)}
                        </div>
                      </div>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                        {order.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. ORDERS MANAGEMENT TAB */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-bold text-stone-900">
                  Customer Orders &amp; Fulfillment
                </h2>
                <p className="text-xs text-stone-500">
                  Manage custom names, color choices, and update delivery progress.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Customer &amp; Phone</th>
                      <th className="p-4">Items &amp; Customization</th>
                      <th className="p-4">Total Amount</th>
                      <th className="p-4">Crafting Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-stone-50/50">
                        <td className="p-4 font-mono font-bold text-stone-900">
                          {order.id}
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-stone-900">
                            {order.customer.fullName}
                          </div>
                          <div className="text-stone-500 text-[11px]">
                            {order.customer.phoneNumber} • {order.customer.city}
                          </div>
                        </td>
                        <td className="p-4 max-w-xs">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="mb-1 text-[11px]">
                              <span className="font-semibold text-stone-800">
                                {item.product.title} (x{item.quantity})
                              </span>
                              <div className="text-stone-500">
                                Size: {item.customization.selectedSize.label} •{" "}
                                {item.customization.selectedColorTheme.name}
                              </div>
                              {item.customization.customNameText && (
                                <div className="text-rose-700 font-medium">
                                  Custom Name: &ldquo;{item.customization.customNameText}&rdquo;
                                </div>
                              )}
                            </div>
                          ))}
                        </td>
                        <td className="p-4 font-bold text-stone-900 font-serif text-sm">
                          {formatPrice(order.totalAmount)}
                        </td>
                        <td className="p-4">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleUpdateOrderStatus(
                                order.id,
                                e.target.value as OrderStatus
                              )
                            }
                            className="text-xs p-1.5 rounded-lg border border-stone-300 bg-white font-medium focus:outline-none"
                          >
                            <option value="Placed">Placed</option>
                            <option value="Queued for Crafting">Queued for Crafting</option>
                            <option value="Weaving & Handcrafting 🧶">
                              Weaving &amp; Handcrafting 🧶
                            </option>
                            <option value="Quality Checked & Packed 🎁">
                              Packed 🎁
                            </option>
                            <option value="Dispatched 🚚">Dispatched 🚚</option>
                            <option value="Delivered ✨">Delivered ✨</option>
                          </select>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => setSelectedOrderForDetail(order)}
                            className="px-3 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800"
                          >
                            View Invoice
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. PRODUCTS MANAGEMENT TAB */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-bold text-stone-900">
                  Handcrafted Catalog Management
                </h2>
                <p className="text-xs text-stone-500">
                  Add, edit, or adjust inventory for woolen rangolis, torans, and mats.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setIsAddProductOpen(true);
                }}
                className="px-4 py-2 bg-linear-to-r from-amber-700 to-rose-600 text-white rounded-xl text-xs font-bold shadow-md hover:brightness-105 transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Handcrafted Creation</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs p-4 flex flex-col justify-between space-y-3"
                >
                  <div className="flex gap-3">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-20 h-20 rounded-xl object-cover bg-stone-100 shrink-0 border border-stone-200"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.2 rounded font-bold">
                        {product.category}
                      </span>
                      <h4 className="font-serif font-bold text-stone-900 text-sm mt-1 truncate">
                        {product.title}
                      </h4>
                      <p className="text-xs text-stone-500 line-clamp-1">
                        {product.subtitle}
                      </p>
                      <div className="mt-1 font-bold text-stone-900 font-serif text-sm">
                        {formatPrice(product.price)}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="text-stone-500">
                      Motif: <strong>{product.featuredMotif || "Standard"}</strong>
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-stone-100 transition"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. PROMOTIONS & BANNER STUDIO TAB */}
        {activeTab === "promotions" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Top Announcement Banner Editor */}
            <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
              <h3 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-700" />
                Top Announcement Banner
              </h3>
              <p className="text-xs text-stone-500">
                Update the promotional marquee displayed across the storefront header.
              </p>

              <form onSubmit={handleSaveBanner} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">
                    Badge Text
                  </label>
                  <input
                    type="text"
                    value={bannerBadge}
                    onChange={(e) => setBannerBadge(e.target.value)}
                    placeholder="e.g. ✨ 100% Handcrafted"
                    className="w-full p-2.5 rounded-lg border border-stone-200 bg-stone-50"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">
                    Banner Announcement Text
                  </label>
                  <input
                    type="text"
                    value={bannerText}
                    onChange={(e) => setBannerText(e.target.value)}
                    placeholder="e.g. Personalized Woolen Mat Rangolis & Home Decor • Use Code"
                    className="w-full p-2.5 rounded-lg border border-stone-200 bg-stone-50"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">
                    Highlighted Promo Code / Offer
                  </label>
                  <input
                    type="text"
                    value={bannerHighlight}
                    onChange={(e) => setBannerHighlight(e.target.value)}
                    placeholder="e.g. WELCOMEAARYA for 10% OFF"
                    className="w-full p-2.5 rounded-lg border border-stone-200 bg-stone-50"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold transition"
                >
                  Save Banner Changes
                </button>
              </form>
            </div>

            {/* Discount Coupon Codes Manager */}
            <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
              <h3 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-700" />
                Discount Promo Coupons
              </h3>

              <form onSubmit={handleSavePromo} className="space-y-3 text-xs bg-stone-50 p-4 rounded-xl border border-stone-200">
                <span className="font-bold text-stone-900 block">Create New Coupon</span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">Code</label>
                    <input
                      type="text"
                      placeholder="e.g. FESTIVE20"
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                      className="w-full p-2 rounded-lg border border-stone-200 uppercase font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">Discount %</label>
                    <input
                      type="number"
                      value={promoDiscountVal}
                      onChange={(e) => setPromoDiscountVal(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-stone-200"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">Min Order ₹</label>
                    <input
                      type="number"
                      value={promoMinVal}
                      onChange={(e) => setPromoMinVal(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-stone-200"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-amber-800 text-white rounded-lg font-bold hover:bg-amber-900 transition"
                >
                  Add Coupon Code
                </button>
              </form>

              {/* Existing active promos */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-stone-800 block">Active Coupons</span>
                {promos.map((p) => (
                  <div
                    key={p.code}
                    className="p-3 rounded-xl border border-stone-200 bg-white flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-mono font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {p.code}
                      </span>
                      <p className="text-stone-500 text-[11px] mt-1">{p.description}</p>
                    </div>
                    <span className="text-emerald-700 font-bold">Active</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add / Edit Product Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-amber-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif font-bold text-lg text-stone-900">
              Add New Handcrafted Creation
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  Creation Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mor Pankh Woolen Rangoli Mat"
                  value={prodForm.title}
                  onChange={(e) => setProdForm({ ...prodForm, title: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-stone-200"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  Short Subtitle
                </label>
                <input
                  type="text"
                  placeholder="e.g. Vibrant peacock feather with gold border"
                  value={prodForm.subtitle}
                  onChange={(e) => setProdForm({ ...prodForm, subtitle: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-stone-200"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  Category
                </label>
                <select
                  value={prodForm.category}
                  onChange={(e) => setProdForm({ ...prodForm, category: e.target.value as any })}
                  className="w-full p-2.5 rounded-lg border border-stone-200"
                >
                  <option value="woolen-rangolis">Woolen Mat Rangolis</option>
                  <option value="entrance-torans">Entrance &amp; Torans</option>
                  <option value="pooja-thali-mats">Pooja &amp; Thali Mats</option>
                  <option value="home-decor-mats">Home Decor Mats</option>
                  <option value="festive-hampers">Gift Hampers</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={prodForm.price}
                    onChange={(e) => setProdForm({ ...prodForm, price: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-lg border border-stone-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-800 mb-1">
                    MRP / Compare Price (₹)
                  </label>
                  <input
                    type="number"
                    value={prodForm.compareAtPrice}
                    onChange={(e) => setProdForm({ ...prodForm, compareAtPrice: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-lg border border-stone-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  Sacred Motif
                </label>
                <select
                  value={prodForm.featuredMotif}
                  onChange={(e) => setProdForm({ ...prodForm, featuredMotif: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-stone-200"
                >
                  <option value="Kalash">Kalash</option>
                  <option value="Mor Pankh">Mor Pankh (Peacock)</option>
                  <option value="Laxmi Charan">Laxmi Charan</option>
                  <option value="Ganesha">Lord Ganesha</option>
                  <option value="Lotus">Lotus (Kamal)</option>
                  <option value="Rose">Rose Bloom</option>
                  <option value="Shubh-Labh">Shubh-Labh</option>
                  <option value="Swastik">Swastik &amp; Om</option>
                  <option value="Diya">Diya</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  Product Image URL
                </label>
                <input
                  type="url"
                  value={prodForm.imageUrl}
                  onChange={(e) => setProdForm({ ...prodForm, imageUrl: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-stone-200"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={prodForm.description}
                  onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                  placeholder="Details about craftsmanship, durability, washable felt base..."
                  className="w-full p-2.5 rounded-lg border border-stone-200"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-xl font-bold"
                >
                  Publish Creation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice / Order Detail Modal */}
      {selectedOrderForDetail && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-stone-200 space-y-6">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div>
                <span className="text-xs text-amber-800 font-bold uppercase">
                  Artloom.By.Aarya • Packing Slip
                </span>
                <h3 className="font-serif font-bold text-xl text-stone-900">
                  Order #{selectedOrderForDetail.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrderForDetail(null)}
                className="text-stone-400 hover:text-stone-700 text-xs font-bold"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-bold text-stone-800 block">Deliver To:</span>
                <p className="font-semibold text-stone-900">{selectedOrderForDetail.customer.fullName}</p>
                <p className="text-stone-600">{selectedOrderForDetail.customer.addressLine1}</p>
                <p className="text-stone-600">
                  {selectedOrderForDetail.customer.city}, {selectedOrderForDetail.customer.state} - {selectedOrderForDetail.customer.pincode}
                </p>
                <p className="text-stone-600 mt-1">Phone: {selectedOrderForDetail.customer.phoneNumber}</p>
              </div>

              <div>
                <span className="font-bold text-stone-800 block">Order Status:</span>
                <p className="text-amber-900 font-bold">{selectedOrderForDetail.status}</p>
                <p className="text-stone-600">Payment: {selectedOrderForDetail.paymentMethod}</p>
                <p className="text-stone-600">Date: {new Date(selectedOrderForDetail.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Items */}
            <div className="border-t border-stone-100 pt-4 space-y-2">
              <span className="font-bold text-stone-900 text-xs block">
                Handcrafted Items Breakdown:
              </span>
              {selectedOrderForDetail.items.map((item, i) => (
                <div key={i} className="p-3 bg-stone-50 rounded-xl text-xs space-y-1">
                  <div className="flex justify-between font-bold text-stone-900">
                    <span>{item.product.title} (x{item.quantity})</span>
                    <span>{formatPrice(item.unitPrice * item.quantity)}</span>
                  </div>
                  <div className="text-stone-500 text-[11px]">
                    Size: {item.customization.selectedSize.label} • Colors: {item.customization.selectedColorTheme.name}
                  </div>
                  {item.customization.customNameText && (
                    <div className="text-rose-700 font-semibold text-[11px]">
                      Custom Name: &ldquo;{item.customization.customNameText}&rdquo;
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-stone-200 pt-4 text-xs font-bold">
              <span>Total Amount:</span>
              <span className="font-serif text-lg text-amber-900">
                {formatPrice(selectedOrderForDetail.totalAmount)}
              </span>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Packing Slip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
