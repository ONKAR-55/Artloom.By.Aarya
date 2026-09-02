"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { Order } from "@/types";
import { DataStore } from "@/lib/db/store";
import { formatPrice } from "@/lib/utils";
import {
  CheckCircle2,
  Sparkles,
  Printer,
  ShoppingBag,
  Clock,
  Truck,
  Heart,
  Layers,
} from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fire festive celebration confetti
    try {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.5 },
        colors: ["#F59E0B", "#DB2777", "#DC2626", "#047857", "#FFFBEB"],
      });
    } catch (e) {
      console.warn("Confetti animation:", e);
    }

    if (orderId) {
      DataStore.getOrderById(orderId).then((o) => {
        setOrder(o);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF9]">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full">
        {/* Celebration Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>
          <span className="text-xs font-bold text-amber-800 uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600 fill-amber-600" />
            Order Booked Successfully • Done ❤️
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Thank You for Supporting Handcrafted Art!
          </h1>
          <p className="text-sm text-stone-600 max-w-md mx-auto">
            Your custom creation request has been registered with Artloom.By.Aarya and is queued for hand-knitting.
          </p>
        </div>

        {/* Printable Order Receipt Card */}
        {order ? (
          <div className="bg-white rounded-3xl border border-amber-100 shadow-xl overflow-hidden print:border-none print:shadow-none">
            {/* Receipt Banner */}
            <div className="bg-linear-to-r from-amber-700 via-rose-700 to-amber-800 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-amber-200 uppercase font-semibold tracking-wider">
                  Handcrafted Order Booking
                </span>
                <h2 className="font-serif text-2xl font-bold mt-0.5">
                  Order #{order.id}
                </h2>
                <p className="text-xs text-amber-100 mt-1">
                  Placed on: {new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })}
                </p>
              </div>

              <div className="bg-white/15 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/20 text-left sm:text-right">
                <span className="text-[11px] text-amber-200 block font-medium">
                  Estimated Delivery:
                </span>
                <span className="font-bold text-sm text-white">
                  {order.estimatedDeliveryDate}
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-8">
              {/* Delivery Address & Customer Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-stone-100 text-xs">
                <div>
                  <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-amber-700" />
                    Delivery Destination
                  </h4>
                  <p className="font-bold text-stone-900 text-sm">
                    {order.customer.fullName}
                  </p>
                  <p className="text-stone-600 mt-1">{order.customer.addressLine1}</p>
                  {order.customer.addressLine1 && (
                    <p className="text-stone-600">{order.customer.addressLine1}</p>
                  )}
                  <p className="text-stone-600">
                    {order.customer.city}, {order.customer.state} - {order.customer.pincode}
                  </p>
                  <p className="text-stone-600 mt-1">
                    Phone: <strong>{order.customer.phoneNumber}</strong>
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-700" />
                    Order Status &amp; Method
                  </h4>
                  <div className="space-y-1.5">
                    <p className="text-stone-600">
                      Payment Mode:{" "}
                      <strong className="text-stone-900">
                        {order.paymentMethod}
                      </strong>
                    </p>
                    <p className="text-stone-600">
                      Crafting Status:{" "}
                      <span className="inline-block bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded text-[11px]">
                        {order.status}
                      </span>
                    </p>
                    {order.customer.orderNotes && (
                      <p className="text-stone-600 bg-amber-50 p-2 rounded border border-amber-200 mt-2">
                        <strong>Customer Note:</strong> {order.customer.orderNotes}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Itemized Order List */}
              <div className="space-y-4">
                <h4 className="font-serif font-bold text-stone-900 text-base flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-700" />
                  Itemized Handcrafted Creations
                </h4>

                <div className="divide-y divide-stone-100">
                  {order.items.map((item) => (
                    <div key={item.id} className="py-3.5 flex items-center gap-4 text-xs">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title}
                        className="w-16 h-16 rounded-xl object-cover bg-stone-100 shrink-0 border border-stone-200"
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-stone-900 text-sm truncate">
                          {item.product.title}
                        </h5>
                        <div className="text-stone-500 text-[11px] mt-0.5 space-y-0.5">
                          <p>
                            Size: <strong>{item.customization.selectedSize.label}</strong>
                          </p>
                          <p>
                            Woolen Colors:{" "}
                            <strong>{item.customization.selectedColorTheme.name}</strong>
                          </p>
                          {item.customization.customNameText && (
                            <p className="text-rose-700 font-medium">
                              Custom Text: &ldquo;{item.customization.customNameText}&rdquo;
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-stone-500 text-[11px]">
                          Qty: {item.quantity} × {formatPrice(item.unitPrice)}
                        </p>
                        <p className="font-bold text-stone-900 text-sm mt-0.5">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Calculation Breakdown */}
              <div className="bg-stone-50 p-4 sm:p-6 rounded-2xl space-y-2 text-xs border border-stone-100">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">
                    {formatPrice(order.subtotal)}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount ({order.appliedPromo})</span>
                    <span>-{formatPrice(order.discount)}</span>
                  </div>
                )}
                {order.giftWrapping && (
                  <div className="flex justify-between text-rose-800">
                    <span>Handmade Gift Packaging &amp; Note</span>
                    <span>+{formatPrice(order.giftWrappingFee)}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>Home Delivery Fee</span>
                  <span>
                    {order.shippingFee === 0 ? (
                      <strong className="text-emerald-700">FREE</strong>
                    ) : (
                      formatPrice(order.shippingFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-stone-900 border-t border-stone-200 pt-3">
                  <span>Total Amount</span>
                  <span className="text-amber-900 font-serif text-lg">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-100 print:hidden">
                <button
                  onClick={handlePrint}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 font-semibold text-xs transition flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Print / Save Receipt
                </button>

                <Link
                  href="/products"
                  className="w-full sm:w-auto px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-semibold text-xs transition flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Continue Exploring Creations
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-stone-500 text-sm">Order reference loaded.</p>
            <Link
              href="/products"
              className="mt-4 inline-block px-5 py-2 bg-amber-800 text-white rounded-lg text-xs"
            >
              Browse Products
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FFFDF9]">
          <p className="text-sm text-stone-500 font-medium">Loading booking receipt...</p>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
