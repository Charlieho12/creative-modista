import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, HeartHandshake, PackageCheck, Sparkles, Truck } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { siteConfig } from "@/lib/constants";
import { getProducts } from "@/lib/data";

export default async function HomePage() {
  const products = await getProducts();
  const featured = products.filter((product) => product.isFeatured).slice(0, 4);
  const arrivals = products.filter((product) => product.isNewArrival).slice(0, 4);
  const bestSellers = products.filter((product) => product.isBestSeller).slice(0, 4);

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    name: "Creative Modista",
    url: siteConfig.url,
    sameAs: [siteConfig.facebookUrl, siteConfig.instagramUrl, siteConfig.tiktokUrl, siteConfig.shopeeUrl],
    logo: `${siteConfig.url}${siteConfig.logo}`,
    description: siteConfig.description,
    address: {
      "@type": "PostalAddress",
      addressCountry: "PH"
    }
  };

  return (
    <>
      <JsonLd data={localBusiness} />
      <section className="bg-linen">
        <div className="container-shell grid min-h-[calc(100svh-4rem)] items-center gap-10 py-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="py-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blush-500">
              Women&apos;s fashion boutique Philippines
            </p>
            <h1 className="mt-4 font-serif text-5xl font-semibold leading-[1.05] text-ink md:text-7xl">
              Creative Modista
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-neutral-700">
              Shop trendy tops for women, blouses, sexy tops, dresses, and ready-to-style pieces
              made for confident everyday looks.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/products">Shop Now</Button>
              <Button href="/products#collection" variant="secondary">
                View Collection
              </Button>
            </div>
          </div>
          <div className="relative min-h-[420px] overflow-hidden rounded-lg bg-blush-100 shadow-soft">
            <Image
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1400&q=85"
              alt="Creative Modista fashion boutique collection"
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
            <div className="absolute bottom-5 left-5 right-5 rounded-lg bg-white/90 p-4 backdrop-blur">
              <p className="font-semibold text-ink">Fresh feminine styles</p>
              <p className="mt-1 text-sm text-neutral-600">New arrivals, best sellers, and affordable women&apos;s fashion.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="collection" className="container-shell py-16">
        <SectionHeader eyebrow="Featured" title="Boutique picks for this week">
          <p>Curated Creative Modista styles for casual days, office looks, dates, and weekend plans.</p>
        </SectionHeader>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-shell">
          <SectionHeader eyebrow="New Arrivals" title="Just added to the rack" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {arrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell py-16">
        <SectionHeader eyebrow="Best Sellers" title="Customer favorites" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="bg-linen py-16">
        <div className="container-shell">
          <SectionHeader eyebrow="Why shop with us" title="Real boutique details, made easy online" />
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { icon: Sparkles, title: "Fresh styles", text: "Trendy tops, blouses, and dresses for everyday confidence." },
              { icon: PackageCheck, title: "Stock clarity", text: "Availability, low-stock cues, colors, and sizes shown upfront." },
              { icon: Truck, title: "Order tracking", text: "Follow each order from placed to delivered." },
              { icon: HeartHandshake, title: "Social support", text: "Message Creative Modista directly for sizing and order help." }
            ].map((item) => (
              <article key={item.title} className="rounded-lg bg-white p-5 shadow-sm">
                <item.icon className="text-blush-500" size={24} />
                <h3 className="mt-4 font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-600">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell py-16">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader eyebrow="Love notes" title="Styled by women who love easy outfits">
            <p>Starter testimonials can be replaced with real customer reviews from Supabase.</p>
          </SectionHeader>
          <div className="grid gap-4 md:grid-cols-3">
            {["The blouse looked polished and still felt comfortable.", "Loved the fit. Perfect for dinner and photos.", "Fast replies and the order tracker felt reassuring."].map((text) => (
              <blockquote key={text} className="rounded-lg border border-blush-100 bg-white p-5 shadow-sm">
                <CheckCircle2 className="text-blush-500" size={20} />
                <p className="mt-4 text-sm leading-7 text-neutral-700">&quot;{text}&quot;</p>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink py-14 text-white">
        <div className="container-shell grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="font-serif text-3xl font-semibold">Follow Creative Modista</h2>
            <p className="mt-2 text-sm text-white/70">Facebook, Instagram, TikTok, and Shopee links are ready for real feeds and redirects.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href={siteConfig.facebookUrl} variant="dark">Facebook</Button>
            <Button href={siteConfig.instagramUrl} variant="dark">Instagram</Button>
            <Button href={siteConfig.tiktokUrl} variant="dark">TikTok</Button>
            <Button href={siteConfig.shopeeUrl} variant="dark">Shopee</Button>
          </div>
        </div>
      </section>
    </>
  );
}
