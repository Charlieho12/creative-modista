import type { Metadata } from "next";
import { AccountClient } from "@/components/account/AccountClient";

export const metadata: Metadata = {
  title: "Account",
  description: "View your Creative Modista profile, order history, and tracking details."
};

export default function AccountPage() {
  return (
    <div className="container-shell py-12">
      <h1 className="mb-8 font-serif text-4xl font-semibold text-ink">My account</h1>
      <AccountClient />
    </div>
  );
}
