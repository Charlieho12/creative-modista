import { Star } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProductReview } from "@/lib/types";

export function ProductReviews({ reviews }: { reviews: ProductReview[] }) {
  if (!reviews.length) {
    return (
      <EmptyState
        title="No product notes yet"
        description="AI-generated style notes or customer reviews will appear here after they are added from the admin dashboard."
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {reviews.map((review) => (
        <article key={review.id} className="rounded-lg border border-blush-100 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-ink">{review.title}</h3>
              <p className="mt-1 text-xs font-semibold text-neutral-500">{review.reviewerName}</p>
            </div>
            <span className="flex items-center gap-1 text-sm font-semibold text-ink">
              <Star size={15} className="fill-champagne text-champagne" />
              {review.rating}
            </span>
          </div>
          <p className="mt-4 text-sm leading-7 text-neutral-700">{review.body}</p>
          {review.source === "ai_generated" ? (
            <div className="mt-4">
              <Badge className="border-champagne bg-linen">AI-generated style note</Badge>
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}
