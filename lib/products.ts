import { Product } from "@/lib/types";

export const mockProducts: Product[] = [
  {
    id: "cm-001",
    name: "Blush Muse Ruched Top",
    slug: "blush-muse-ruched-top",
    description:
      "A soft ruched top with a flattering neckline for coffee dates, casual Fridays, and dressed-up evenings.",
    price: 499,
    salePrice: 449,
    category: "Sexy Tops",
    sizes: ["S", "M", "L"],
    colors: ["Blush", "White", "Black"],
    stock: 8,
    isAvailable: true,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    image:
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80"
    ],
    rating: 4.8,
    reviewCount: 42,
    createdAt: "2026-01-16T08:00:00.000Z"
  },
  {
    id: "cm-002",
    name: "Pearl Button Office Blouse",
    slug: "pearl-button-office-blouse",
    description:
      "A polished blouse with pearl-inspired buttons and a clean drape for workdays and Sunday plans.",
    price: 699,
    salePrice: null,
    category: "Blouses",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Cream", "Mocha"],
    stock: 15,
    isAvailable: true,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    image:
      "https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=80"
    ],
    rating: 4.9,
    reviewCount: 36,
    createdAt: "2025-12-21T08:00:00.000Z"
  },
  {
    id: "cm-003",
    name: "Sienna Day Dress",
    slug: "sienna-day-dress",
    description:
      "A relaxed feminine dress made for warm afternoons, errands, and simple styling with sandals.",
    price: 899,
    salePrice: 799,
    category: "Dresses",
    sizes: ["S", "M", "L"],
    colors: ["Rose", "Beige"],
    stock: 5,
    isAvailable: true,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80"
    ],
    rating: 4.7,
    reviewCount: 21,
    createdAt: "2026-02-03T08:00:00.000Z"
  },
  {
    id: "cm-004",
    name: "Noir Satin Camisole",
    slug: "noir-satin-camisole",
    description:
      "A sleek satin camisole that layers beautifully under blazers or wears solo for evening looks.",
    price: 459,
    salePrice: null,
    category: "Tops",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Black", "Champagne"],
    stock: 3,
    isAvailable: true,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: true,
    image:
      "https://images.unsplash.com/photo-1520975661595-6453be3f7070?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1520975661595-6453be3f7070?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80"
    ],
    rating: 4.6,
    reviewCount: 18,
    createdAt: "2026-02-20T08:00:00.000Z"
  },
  {
    id: "cm-005",
    name: "Lace Trim Date Top",
    slug: "lace-trim-date-top",
    description:
      "A romantic lace-trim top with delicate straps and a fitted silhouette for night-out styling.",
    price: 529,
    salePrice: 479,
    category: "Sexy Tops",
    sizes: ["S", "M", "L"],
    colors: ["White", "Black"],
    stock: 10,
    isAvailable: true,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: true,
    image:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80"
    ],
    rating: 4.8,
    reviewCount: 27,
    createdAt: "2025-11-04T08:00:00.000Z"
  },
  {
    id: "cm-006",
    name: "Weekend Knit Coordinate",
    slug: "weekend-knit-coordinate",
    description:
      "A soft coordinate set for easy outfit days, travel, and casual polished errands.",
    price: 1199,
    salePrice: null,
    category: "Coordinates",
    sizes: ["Free Size"],
    colors: ["Beige", "Mocha"],
    stock: 0,
    isAvailable: false,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
    image:
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80"
    ],
    rating: 4.5,
    reviewCount: 12,
    createdAt: "2025-09-28T08:00:00.000Z"
  }
];

export function getMockProductBySlug(slug: string) {
  return mockProducts.find((product) => product.slug === slug) ?? null;
}

export function getRelatedProducts(product: Product) {
  return mockProducts
    .filter((item) => item.id !== product.id && item.category === product.category)
    .concat(mockProducts.filter((item) => item.id !== product.id))
    .slice(0, 4);
}
