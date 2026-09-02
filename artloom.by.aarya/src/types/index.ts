export type CategorySlug = 
  | "woolen-rangolis"
  | "entrance-torans"
  | "pooja-thali-mats"
  | "home-decor-mats"
  | "festive-hampers";

export interface Category {
  id: string;
  name: string;
  slug: CategorySlug;
  description: string;
  iconName: string;
  image: string;
  tagline: string;
  itemCount: number;
}

export interface SizeOption {
  id: string;
  label: string; // e.g. "Small (12 inches)", "Medium (18 inches)", "Grand (24 inches)"
  dimensions: string; // e.g. "12\" x 12\" (30 cm)"
  priceMultiplier: number; // e.g. 1, 1.45, 1.95
  isPopular?: boolean;
}

export interface ColorThemeOption {
  id: string;
  name: string; // e.g. "Haldi Yellow & Rani Pink", "Royal Red & Gold", "Peacock Blue & Emerald"
  colors: string[]; // hex codes e.g. ["#EAB308", "#DB2777"]
  previewTag?: string;
}

export interface ProductSpecification {
  material: string;
  washCare: string;
  craftTime: string;
  durability: string;
  baseMaterial: string;
  reusable: boolean;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  detailedDescription?: string;
  category: CategorySlug;
  price: number;
  compareAtPrice?: number;
  inStock: boolean;
  stockCount: number;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  isCustomizable: boolean;
  featuredMotif?: string;
  motifs: string[]; // ["Kalash", "Ganesha", "Mor Pankh", "Laxmi Charan", "Swastik", "Lotus", "Om", "Rose", "Diya", "Shubh-Labh"]
  images: string[];
  features: string[];
  specifications: ProductSpecification;
  sizes: SizeOption[];
  colorThemes: ColorThemeOption[];
  rating: number;
  reviewsCount: number;
}

export interface CartItemCustomization {
  selectedSize: SizeOption;
  selectedColorTheme: ColorThemeOption;
  customNameText?: string;
  customNotes?: string;
  chosenMotif?: string;
}

export interface CartItem {
  id: string; // unique item id based on product id + options
  product: Product;
  quantity: number;
  unitPrice: number;
  customization: CartItemCustomization;
}

export interface PromoCode {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderValue: number;
  description: string;
  active: boolean;
}

export interface CustomerDetails {
  fullName: string;
  phoneNumber: string;
  otp: string;
  addressLine1: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  orderNotes?: string;
}

export type OrderStatus =
  | "Placed"
  | "Queued for Crafting"
  | "Weaving & Handcrafting 🧶"
  | "Quality Checked & Packed 🎁"
  | "Dispatched 🚚"
  | "Delivered ✨"
  | "Cancelled";

export interface Order {
  id: string; // e.g. "AL-89201"
  customer: CustomerDetails;
  items: CartItem[];
  subtotal: number;
  discount: number;
  appliedPromo?: string;
  giftWrapping: boolean;
  giftWrappingFee: number;
  giftMessage?: string;
  shippingFee: number;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: "Direct Booking / COD" | "UPI Transfer" | "Card / Netbanking (Disabled for now)";
  paymentStatus: "Pending Verification" | "Confirmed" | "Cash on Delivery";
  createdAt: string;
  estimatedDeliveryDate: string;
  artisanNote?: string;
}

export interface AnnouncementBanner {
  id: string;
  enabled: boolean;
  text: string;
  highlightText: string;
  badge: string;
  backgroundColor: string;
  textColor: string;
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  pendingCustomizations: number;
  activeProductsCount: number;
  topMotifs: { motif: string; count: number }[];
}
