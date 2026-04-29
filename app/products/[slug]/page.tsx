import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";
import { RecentlyViewed } from "@/components/product/RecentlyViewed";
import { JsonLd } from "@/components/seo/JsonLd";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { siteConfig } from "@/lib/constants";
import { getProductBySlug, getProducts } from "@/lib/data";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product not found" };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} | Creative Modista`,
      description: product.description,
      images: [product.image]
    }
  };
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductDetailsPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const allProducts = await getProducts();
  const related = allProducts
    .filter((item) => item.id !== product.id && item.category === product.category)
    .concat(allProducts.filter((item) => item.id !== product.id && item.category !== product.category))
    .slice(0, 4);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.description,
    brand: { "@type": "Brand", name: "Creative Modista" },
    offers: {
      "@type": "Offer",
      priceCurrency: "PHP",
      price: product.salePrice ?? product.price,
      availability: product.isAvailable ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${siteConfig.url}/products/${product.slug}`
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount
    }
  };

  return (
    <div className="container-shell py-10">
      <JsonLd data={productJsonLd} />
      <ProductDetailClient product={product} />
      <section className="mt-16">
        <SectionHeader eyebrow="Reviews" title="What customers notice first" />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            "The fabric feels easy to wear and the neckline is flattering.",
            "Cute for casual days and still nice enough for dinner.",
            "Sizing notes helped me choose the right fit before checkout."
          ].map((review) => (
            <blockquote key={review} className="rounded-lg border border-blush-100 bg-white p-5 text-sm leading-7 text-neutral-700 shadow-sm">
              &quot;{review}&quot;
            </blockquote>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <SectionHeader eyebrow="Related" title="More pieces to style with this" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
      <section className="mt-16">
        <SectionHeader eyebrow="Recently viewed" title="Pieces you came back to" />
        <RecentlyViewed currentProduct={product} products={allProducts} />
      </section>
    </div>
  );
}
