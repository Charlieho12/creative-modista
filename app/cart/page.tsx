import type { Metadata } from "next";
import { CartClient } from "@/components/cart/CartClient";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review Creative Modista cart items before checkout."
};

export default function CartPage() {
  return (
    <div className="container-shell py-12">
      <h1 className="mb-8 font-serif text-4xl font-semibold text-ink">Shopping cart</h1>
      <CartClient />
    </div>
  );
}
