"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/constants";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/orders", label: "Track Order" },
  { href: "/contact", label: "Contact" }
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-blush-100 bg-white/95 backdrop-blur">
      <div className="container-shell flex h-20 items-center justify-between gap-4">
        <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="Creative Modista home">
          <span className="relative h-16 w-44 shrink-0 overflow-hidden rounded bg-white md:w-56 lg:w-64">
            <Image
              src={siteConfig.logo}
              alt="Creative Modista official brand logo"
              fill
              priority
              sizes="(min-width: 1024px) 256px, (min-width: 768px) 224px, 176px"
              className="object-contain"
            />
          </span>
          <span className="sr-only">{siteConfig.name}</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-neutral-700 lg:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-blush-500">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button href="/products" variant="ghost" aria-label="Search products">
            <Search size={18} />
          </Button>
          <Button href="/account" variant="ghost" aria-label="Account">
            <User size={18} />
          </Button>
          <Button href="/wishlist" variant="ghost" aria-label="Wishlist">
            <Heart size={18} />
          </Button>
          <Button href="/cart" variant="secondary" className="relative" aria-label="Cart">
            <ShoppingBag size={18} />
            <span>Cart</span>
            {count ? (
              <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-blush-500 text-[11px] text-white">
                {count}
              </span>
            ) : null}
          </Button>
        </div>

        <button
          type="button"
          className="focus-ring rounded-full p-2 lg:hidden"
          aria-label="Toggle navigation"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-blush-100 bg-white lg:hidden">
          <nav className="container-shell grid gap-1 py-4 text-sm font-semibold">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-3 hover:bg-blush-50"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button href="/account" variant="secondary" onClick={() => setOpen(false)}>
                <User size={17} /> Account
              </Button>
              <Button href="/cart" variant="primary" onClick={() => setOpen(false)}>
                <ShoppingBag size={17} /> Cart {count ? `(${count})` : ""}
              </Button>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
