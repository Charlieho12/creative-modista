export const siteConfig = {
  name: "Creative Modista",
  description:
    "Creative Modista is a women's fashion boutique in the Philippines for trendy tops, blouses, dresses, and stylish everyday pieces.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  facebookUrl:
    process.env.NEXT_PUBLIC_FACEBOOK_URL ??
    "https://www.facebook.com/CreativeModista",
  instagramUrl:
    process.env.NEXT_PUBLIC_INSTAGRAM_URL ??
    "https://www.instagram.com/creativemodista",
  tiktokUrl:
    process.env.NEXT_PUBLIC_TIKTOK_URL ??
    "https://www.tiktok.com/@creativemodista",
  shopeeUrl:
    process.env.NEXT_PUBLIC_SHOPEE_URL ?? "https://shopee.ph/creativemodista",
  keywords: [
    "Creative Modista",
    "women's tops Philippines",
    "trendy tops for women",
    "blouse for women",
    "sexy tops for women",
    "affordable women's fashion",
    "women's clothing online shop",
    "stylish tops Philippines",
    "casual tops for women",
    "fashion boutique Philippines"
  ]
};

export const orderStatuses = [
  "placed",
  "confirmed",
  "preparing",
  "ready_to_ship",
  "shipped",
  "delivered",
  "cancelled"
] as const;

export const categories = [
  "Tops",
  "Blouses",
  "Sexy Tops",
  "Dresses",
  "Coordinates",
  "Available Items"
];

export const sizes = ["XS", "S", "M", "L", "XL", "Free Size"];
export const colors = ["White", "Black", "Blush", "Beige", "Cream", "Mocha", "Rose", "Gold"];
