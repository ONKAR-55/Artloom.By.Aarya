"use client";

import { Sparkles } from "lucide-react";

interface MotifFilterBarProps {
  selectedMotif: string | null;
  onSelectMotif: (motif: string | null) => void;
}

const MOTIF_LIST = [
  { id: "all", label: "All Items" },
  { id: "Kalash", label: "Kalash" },
  { id: "Mor Pankh", label: "Peacock (Mor Pankh)" },
  { id: "Laxmi Charan", label: "Laxmi Charan" },
  { id: "Ganesha", label: "Lord Ganesha" },
  { id: "Lotus", label: "Lotus (Kamal)" },
  { id: "Rose", label: "Rose Bloom" },
  { id: "Shubh-Labh", label: "Shubh-Labh" },
  { id: "Swastik", label: "Swastik" },
  { id: "Diya", label: "Diya Motifs" },
];

export function MotifFilterBar({
  selectedMotif,
  onSelectMotif,
}: MotifFilterBarProps) {
  return (
    <div className="w-full overflow-x-auto py-1 scrollbar-none">
      <div className="flex items-center gap-1.5 min-w-max">
        <span className="text-xs font-semibold text-pink-800 flex items-center gap-1 mr-1">
          <Sparkles className="w-3.5 h-3.5 text-pink-500" />
          <span>Motifs:</span>
        </span>
        {MOTIF_LIST.map((item) => {
          const isSelected =
            (item.id === "all" && selectedMotif === null) ||
            selectedMotif === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectMotif(item.id === "all" ? null : item.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                isSelected
                  ? "bg-pink-600 text-white shadow-2xs"
                  : "bg-white text-stone-600 border border-pink-100 hover:border-pink-300 hover:bg-pink-50"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
