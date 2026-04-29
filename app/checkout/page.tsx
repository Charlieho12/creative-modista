import type { Metadata } from "next";
import { CheckoutForm } from "@/components/cart/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Login and place your Creative Modista order."
};

export default function CheckoutPage() {
  return (
    <div className="container-shell py-12">
      <h1 className="mb-8 font-serif text-4xl font-semibold text-ink">Checkout</h1>
      <CheckoutForm />
    </div>
  );
}
