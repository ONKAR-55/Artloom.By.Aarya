"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { useCartStore } from "@/lib/store/cartStore";
import { formatPrice, generateOrderId, calculateDeliveryEstimate } from "@/lib/utils";
import { DataStore } from "@/lib/db/store";
import { CustomerDetails, Order } from "@/types";
import confetti from "canvas-confetti";
import {
  ShieldCheck,
  Truck,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Gift,
  Clock,
  Info,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    getSubtotal,
    getShippingFee,
    getGrandTotal,
    discount,
    appliedPromo,
    giftWrapping,
    giftWrappingFee,
    giftMessage,
    clearCart,
  } = useCartStore();

  const [formData, setFormData] = useState<CustomerDetails>({
    fullName: "",
    phoneNumber: "",
    otp: "",
    addressLine1: "",
    landmark: "",
    city: "",
    state: "Maharashtra",
    pincode: "",
    orderNotes: "",
  });

  const [paymentOption, setPaymentOption] = useState<
    "Direct Booking / COD" | "UPI Transfer"
  >("Direct Booking / COD");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const subtotal = getSubtotal();
  const shippingFee = getShippingFee();
  const grandTotal = getGrandTotal();

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FFFDF9]">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-900">
            Your Cart is Empty
          </h2>
          <p className="text-stone-500 text-sm mt-2 max-w-sm">
            Please add handcrafted woolen creations to your bag before proceeding to checkout.
          </p>
          <Link
            href="/products"
            className="mt-6 px-6 py-2.5 bg-amber-800 text-white rounded-full text-xs font-semibold"
          >
            Explore Handcrafted Creations
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Validate fields
    if (!formData.fullName.trim()) {
      setErrorMessage("Please provide your full name");
      return;
    }
    if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ""))) {
      setErrorMessage("Please enter a valid 10-digit mobile number");
      return;
    }
    if (!formData.addressLine1.trim()) {
      setErrorMessage("Please enter your street / building address");
      return;
    }
    if (!formData.city.trim()) {
      setErrorMessage("Please enter your city");
      return;
    }
    if (!/^\d{6}$/.test(formData.pincode.trim())) {
      setErrorMessage("Please enter a valid 6-digit postal PIN code");
      return;
    }
    if (!/^\d{6}$/.test(formData.otp.trim())) {
      setErrorMessage("Please enter a valid 6-digit OTP");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderId = generateOrderId();
      const newOrder: Order = {
        id: orderId,
        customer: formData,
        items: [...items],
        subtotal,
        discount,
        appliedPromo: appliedPromo?.code,
        giftWrapping,
        giftWrappingFee: giftWrapping ? giftWrappingFee : 0,
        giftMessage: giftWrapping ? giftMessage : undefined,
        shippingFee,
        totalAmount: grandTotal,
        status: "Placed",
        paymentMethod: paymentOption,
        paymentStatus: "Confirmed",
        createdAt: new Date().toISOString(),
        estimatedDeliveryDate: calculateDeliveryEstimate(5),
      };

      await DataStore.createOrder(newOrder);

      // Trigger celebratory festive confetti
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#F59E0B", "#DB2777", "#DC2626", "#047857", "#FFFBEB"],
      });

      // Clear cart
      clearCart();

      // Navigate to order success receipt
      router.push(`/checkout/success?orderId=${orderId}`);
    } catch (err) {
      console.error("Order creation failed:", err);
      setErrorMessage("Could not save your order. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF9]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Navigation back */}
        <div className="mb-6">
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-amber-800"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Continue Browsing Creations
          </Link>
          <div className="mt-2 flex items-center justify-between border-b border-amber-100 pb-4">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                Frictionless Checkout (No Account Needed)
              </h1>
              <p className="text-xs text-stone-500 mt-0.5">
                Direct booking for handcrafted woolen decor • Delivered to your doorstep
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Column: Customer Shipping Details */}
            <div className="lg:col-span-7 space-y-6">
              {/* Delivery Details Card */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-amber-100 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <h3 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-amber-700" />
                    1. Shipping &amp; Delivery Address
                  </h3>
                  <span className="text-[11px] text-amber-800 font-medium">
                    Pan-India Home Delivery
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="e.g. Aarti Sharma"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full text-xs p-2.5 rounded-lg border border-stone-200 focus:outline-none bg-stone-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      Mobile Number (for delivery updates) *
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      placeholder="e.g. 9820123456"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      required
                      maxLength={10}
                      className="w-full text-xs p-2.5 rounded-lg border border-stone-200 focus:outline-none bg-stone-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    OTP
                  </label>
                  <input
                    type="number"
                    name="otp"
                    placeholder="e.g. 123456"
                    value={formData.otp}
                    onChange={handleInputChange}
                    required
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-200 focus:outline-none bg-stone-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Flat / House No. / Building Name / Street Address *
                  </label>
                  <input
                    type="text"
                    name="addressLine1"
                    placeholder="e.g. Flat 301, Shree Ganesh Residency, Shivaji Road"
                    value={formData.addressLine1}
                    onChange={handleInputChange}
                    required
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-200 focus:outline-none bg-stone-50/50"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      placeholder="e.g. 411001"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      required
                      maxLength={6}
                      className="w-full text-xs p-2.5 rounded-lg border focus:outline-none focus:border-amber-700 bg-stone-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      placeholder="e.g. Kopargaon"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full text-xs p-2.5 rounded-lg border border-stone-200 focus:outline-none bg-stone-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      State *
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full text-xs p-2.5 rounded-lg border border-stone-200 focus:outline-none bg-stone-50/50"
                    >
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Madhya Pradesh">Madhya Pradesh</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Other">Other States</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Special Delivery Instructions or Notes for Aarya (Optional)
                  </label>
                  <textarea
                    name="orderNotes"
                    placeholder="e.g. Leave package with security if not available / Please deliver before festive date"
                    value={formData.orderNotes}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-200 focus:outline-none bg-stone-50/50"
                  />
                </div>
              </div>

              {/* Payment Mode Selection Card */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-amber-100 shadow-xs space-y-4">
                <div className="border-b border-stone-100 pb-3">
                  <h3 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-700" />
                    2. Payment &amp; Confirmation Method
                  </h3>
                </div>

                <div className="space-y-3">
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentOption === "Direct Booking / COD"
                        ? "border-amber-700 bg-amber-50/60 ring-1 ring-amber-700"
                        : "border-stone-200 bg-white hover:bg-stone-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentOption"
                      checked={paymentOption === "Direct Booking / COD"}
                      onChange={() => setPaymentOption("Direct Booking / COD")}
                      className="mt-1 text-amber-700 focus:ring-amber-700"
                    />
                    <div>
                      <div className="text-xs font-bold text-stone-900 flex items-center gap-2">
                        <span>Direct Booking / Pay on Delivery</span>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.2 rounded-full">
                          Recommended
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Your order is immediately queued for handcrafting. Pay conveniently when your order arrives.
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentOption === "UPI Transfer"
                        ? "border-amber-700 bg-amber-50/60 ring-1 ring-amber-700"
                        : "border-stone-200 bg-white hover:bg-stone-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentOption"
                      checked={paymentOption === "UPI Transfer"}
                      onChange={() => setPaymentOption("UPI Transfer")}
                      className="mt-1 text-amber-700 focus:ring-amber-700"
                    />
                    <div>
                      <div className="text-xs font-bold text-stone-900">
                        Direct UPI (GPay / PhonePe / Paytm)
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Instant booking with direct artisan UPI settlement.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary Sidebar */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-amber-100 shadow-md space-y-5 sticky top-24">
                <h3 className="font-serif font-bold text-base text-stone-900 border-b border-stone-100 pb-3">
                  Order Summary ({items.length} {items.length === 1 ? "Item" : "Items"})
                </h3>

                {/* Items preview */}
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 text-xs">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title}
                        className="w-14 h-14 rounded-lg object-cover bg-stone-100 shrink-0 border border-stone-200"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-stone-900 truncate">
                          {item.product.title}
                        </h4>
                        <p className="text-stone-500 text-[11px]">
                          {item.customization.selectedSize.label} • {item.customization.selectedColorTheme.name}
                        </p>
                        {item.customization.customNameText && (
                          <p className="text-rose-700 text-[11px] font-medium">
                            Name: &ldquo;{item.customization.customNameText}&rdquo;
                          </p>
                        )}
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-stone-500">Qty: {item.quantity}</span>
                          <span className="font-bold text-stone-900">
                            {formatPrice(item.unitPrice * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Gift wrapping info */}
                {giftWrapping && (
                  <div className="bg-rose-50 p-2.5 rounded-lg border border-rose-100 text-xs flex items-center justify-between text-rose-900">
                    <span className="flex items-center gap-1.5">
                      <Gift className="w-3.5 h-3.5 text-rose-600" />
                      Handmade Gift Wrap Included
                    </span>
                    <span className="font-semibold">+{formatPrice(giftWrappingFee)}</span>
                  </div>
                )}

                {/* Price Calculations */}
                <div className="space-y-2 text-xs border-t border-stone-100 pt-3 text-stone-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-stone-900">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Discount ({appliedPromo?.code})</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}

                  {giftWrapping && (
                    <div className="flex justify-between">
                      <span>Gift Wrapping Fee</span>
                      <span>+{formatPrice(giftWrappingFee)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span>Home Delivery</span>
                    <span>
                      {shippingFee === 0 ? (
                        <strong className="text-emerald-700">FREE</strong>
                      ) : (
                        formatPrice(shippingFee)
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-base font-bold text-stone-900 border-t border-stone-200 pt-3">
                    <span>Total Amount</span>
                    <span className="text-amber-900 font-serif text-lg">
                      {formatPrice(grandTotal)}
                    </span>
                  </div>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
                    {errorMessage}
                  </div>
                )}

                {/* Place Order CTA */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-4 bg-linear-to-r from-amber-700 via-rose-600 to-amber-800 hover:brightness-105 active:scale-98 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Registering Handcrafted Booking...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Place &amp; Confirm Order ({formatPrice(grandTotal)})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
