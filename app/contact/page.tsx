import type { Metadata } from "next";
import { Facebook, Instagram, Mail, Music2, Phone, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Creative Modista through the contact form, Facebook, Instagram, TikTok, or Shopee."
};

export default function ContactPage() {
  const socials = [
    { href: siteConfig.facebookUrl, label: "Facebook", icon: Facebook },
    { href: siteConfig.instagramUrl, label: "Instagram", icon: Instagram },
    { href: siteConfig.tiktokUrl, label: "TikTok", icon: Music2 },
    { href: siteConfig.shopeeUrl, label: "Shopee", icon: ShoppingBag }
  ];

  return (
    <div className="container-shell py-12">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blush-500">Contact</p>
          <h1 className="mt-3 font-serif text-5xl font-semibold text-ink">Ask about fit, stock, or orders</h1>
          <p className="mt-4 text-sm leading-7 text-neutral-600">
            Send a message for sizing help, order questions, restock requests, and Shopee redirects.
          </p>
          <div className="mt-6 grid gap-3">
            {socials.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 rounded-lg border border-blush-100 bg-white p-4 shadow-sm transition hover:border-blush-300"
              >
                <item.icon size={20} className="text-blush-500" />
                <span className="font-semibold">{item.label}</span>
              </a>
            ))}
          </div>
        </section>

        <form className="rounded-lg border border-blush-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Send a message</h2>
          <div className="mt-5 grid gap-4">
            {["Name", "Email", "Contact number"].map((label) => (
              <label key={label} className="block text-sm font-semibold">
                {label}
                <input className="mt-2 w-full rounded-full border border-blush-100 px-4 py-3 outline-none focus:border-blush-300" />
              </label>
            ))}
            <label className="block text-sm font-semibold">
              Message
              <textarea rows={5} className="mt-2 w-full rounded-lg border border-blush-100 px-4 py-3 outline-none focus:border-blush-300" />
            </label>
          </div>
          <Button type="submit" className="mt-5">
            <Mail size={18} /> Send message
          </Button>
        </form>
      </div>

      <section id="faq" className="mt-16">
        <h2 className="font-serif text-3xl font-semibold">FAQ</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            ["Do I need an account?", "Yes. Login is required before checkout so orders can be tracked."],
            ["How do I know my size?", "Each product shows available sizes. Use the size guide and message for fit help."],
            ["Can I buy through Shopee?", "Yes. Use the Shopee redirect button when you prefer marketplace checkout."]
          ].map(([question, answer]) => (
            <article key={question} className="rounded-lg border border-blush-100 bg-white p-5 shadow-sm">
              <h3 className="font-semibold">{question}</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-600">{answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-lg bg-linen p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Phone size={18} /> TikTok and Instagram feed placeholder
        </h2>
        <p className="mt-2 text-sm leading-6 text-neutral-600">
          Embed live social content here once official API or embed links are available.
        </p>
      </section>
    </div>
  );
}
