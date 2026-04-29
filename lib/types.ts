import type { orderStatuses } from "@/lib/constants";

export type OrderStatus = (typeof orderStatuses)[number];

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number | null;
  category: string;
  sizes: string[];
  colors: string[];
  stock: number;
  isAvailable: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  image: string;
  images: string[];
  rating: number;
  reviewCount: number;
  createdAt: string;
};

export type CartItem = {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  salePrice?: number | null;
  size: string;
  color: string;
  quantity: number;
  stock: number;
};

export type OrderItem = CartItem & {
  lineTotal: number;
};

export type Order = {
  id: string;
  userId: string;
  customerName: string;
  contactNumber: string;
  shippingAddress: string;
  paymentMethod: string;
  status: OrderStatus;
  subtotal: number;
  total: number;
  items: OrderItem[];
  createdAt: string;
};

export type Profile = {
  id: string;
  fullName: string | null;
  contactNumber: string | null;
  shippingAddress: string | null;
  role: "customer" | "admin";
};
