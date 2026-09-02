"use client";

import { useEffect, useState } from "react";
import { Sparkles, Copy, Check } from "lucide-react";
import { AnnouncementBanner } from "@/types";
import { DataStore } from "@/lib/db/store";

export function FestiveBanner() {
  const [banner, setBanner] = useState<AnnouncementBanner | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    DataStore.getBanner().then(setBanner);
  }, []);

  if (!banner || !banner.enabled) return null;

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-pink-100 text-pink-900 text-xs font-medium py-2 px-4 border-b border-pink-200/60">
      <div className="max-w-6xl mx-auto flex items-center justify-center gap-2 text-center">
        <span className="bg-white text-pink-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-pink-200 hidden sm:inline-flex items-center gap-1 shadow-2xs">
          <Sparkles className="w-3 h-3 text-pink-500 fill-pink-500" />
          Handmade
        </span>
        <p className="text-pink-900">
          Handcrafted Woolen Rangolis &amp; Decor • Use code{" "}
          <strong className="text-pink-700">WELCOMEAARYA hhh</strong> for 10% off
        </p>
        <button
          onClick={() => handleCopyCode("WELCOMEAARYA")}
          className="inline-flex items-center gap-1 bg-white hover:bg-pink-50 text-pink-700 px-2 py-0.5 rounded text-[11px] font-medium border border-pink-300 transition ml-1"
          title="Copy coupon code"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-600" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
