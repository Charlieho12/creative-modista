import type { Metadata } from "next";
import Image from "next/image";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "About",
  description: "Learn the Creative Modista brand story, mission, and boutique fashion values."
};

export default function AboutPage() {
  return (
    <div>
      <section className="bg-linen py-16">
        <div className="container-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <h1 className="font-serif text-5xl font-semibold text-ink">Fashion with a soft point of view</h1>
            <p className="mt-5 text-base leading-8 text-neutral-700">
              Creative Modista is imagined as a women&apos;s fashion boutique for everyday confidence:
              easy tops, polished blouses, date-ready styles, and dresses that feel put together without trying too hard.
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-blush-100 shadow-soft">
            <Image
              src="https://images.unsplash.com/photo-1554412933-514a83d2f3c8?auto=format&fit=crop&w=1200&q=85"
              alt="Creative Modista lifestyle fashion layout"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="container-shell py-16">
        <SectionHeader eyebrow="Mission" title="Affordable women&apos;s fashion that still feels styled">
          <p>
            The shop helps customers discover feminine, trendy pieces with clear sizing,
            stock visibility, and simple online ordering.
          </p>
        </SectionHeader>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ["Confidence", "Clothes should make getting ready easier and more expressive."],
            ["Clarity", "Customers should see price, size, color, and order progress without guessing."],
            ["Care", "A boutique experience should feel warm, responsive, and personal."]
          ].map(([title, text]) => (
            <article key={title} className="rounded-lg border border-blush-100 bg-white p-6 shadow-sm">
              <h2 className="font-serif text-2xl font-semibold">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-neutral-600">{text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
