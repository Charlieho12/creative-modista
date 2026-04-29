import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();

  if (supabase) {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      redirect("/auth/login");
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", auth.user.id)
      .single();
    if (profile?.role !== "admin") {
      redirect("/account");
    }
  }

  return (
    <div className="container-shell py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blush-500">Admin</p>
          <h1 className="font-serif text-4xl font-semibold text-ink">Creative Modista dashboard</h1>
        </div>
        <nav className="flex flex-wrap gap-2 text-sm font-semibold">
          <Link className="rounded-full border border-blush-100 bg-white px-4 py-2 hover:bg-blush-50" href="/admin">Overview</Link>
          <Link className="rounded-full border border-blush-100 bg-white px-4 py-2 hover:bg-blush-50" href="/admin/products">Products</Link>
          <Link className="rounded-full border border-blush-100 bg-white px-4 py-2 hover:bg-blush-50" href="/admin/orders">Orders</Link>
        </nav>
      </div>
      {!supabase ? (
        <p className="mb-6 rounded-lg bg-linen p-4 text-sm text-neutral-700">
          Supabase is not configured yet, so admin route protection is shown in setup mode. Add environment variables to enforce live authentication and role checks.
        </p>
      ) : null}
      {children}
    </div>
  );
}
