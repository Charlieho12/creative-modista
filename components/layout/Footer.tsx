import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Mail, Music2, ShoppingBag } from "lucide-react";
import { siteConfig } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-blush-100 bg-ink text-white">
      <div className="container-shell grid gap-10 py-12 md:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
        <div>
          <Link href="/" className="relative block h-28 w-72 max-w-full overflow-hidden rounded bg-white p-3">
            <Image
              src={siteConfig.logo}
              alt="Creative Modista official brand logo"
              fill
              sizes="288px"
              className="object-contain"
            />
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-7 text-white/70">
            A feminine online boutique for stylish tops, blouses, dresses, and
            affordable women&apos;s fashion in the Philippines.
          </p>
          <div className="mt-5 flex gap-3">
            <a href={siteConfig.facebookUrl} aria-label="Facebook" className="rounded-full bg-white/10 p-2 hover:bg-white/20">
              <Facebook size={18} />
            </a>
            <a href={siteConfig.instagramUrl} aria-label="Instagram" className="rounded-full bg-white/10 p-2 hover:bg-white/20">
              <Instagram size={18} />
            </a>
            <a href={siteConfig.tiktokUrl} aria-label="TikTok" className="rounded-full bg-white/10 p-2 hover:bg-white/20">
              <Music2 size={18} />
            </a>
            <a href={siteConfig.shopeeUrl} aria-label="Shopee" className="rounded-full bg-white/10 p-2 hover:bg-white/20">
              <ShoppingBag size={18} />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-blush-200">Shop</h3>
          <div className="mt-4 grid gap-3 text-sm text-white/70">
            <Link href="/products?category=Tops">Women&apos;s Tops</Link>
            <Link href="/products?category=Blouses">Blouses</Link>
            <Link href="/products?category=Sexy%20Tops">Sexy Tops</Link>
            <Link href="/products?category=Dresses">Dresses</Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-blush-200">Support</h3>
          <div className="mt-4 grid gap-3 text-sm text-white/70">
            <Link href="/account">My Account</Link>
            <Link href="/orders">Track Order</Link>
            <Link href="/contact#faq">FAQ</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>

        <form className="rounded-lg border border-white/10 bg-white/5 p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Mail size={16} /> Newsletter
          </h3>
          <p className="mt-2 text-sm leading-6 text-white/70">
            Get new arrivals, restock notes, and soft-launch promos.
          </p>
          <div className="mt-4 flex gap-2">
            <input
              type="email"
              aria-label="Email address"
              placeholder="you@email.com"
              className="min-w-0 flex-1 rounded-full border border-white/10 bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-blush-300"
            />
            <button className="rounded-full bg-blush-300 px-4 py-2.5 text-sm font-semibold text-ink hover:bg-blush-200">
              Join
            </button>
          </div>
        </form>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        Copyright {new Date().getFullYear()} Creative Modista. All rights reserved.
      </div>
    </footer>
  );
}
