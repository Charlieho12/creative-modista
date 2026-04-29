import { ProductReview } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

type DbProductReview = {
  id: string;
  product_id: string;
  reviewer_name: string;
  rating: number;
  title: string;
  body: string;
  source: "customer" | "ai_generated";
  generated_by_model: string | null;
  created_at: string;
};

function mapReview(review: DbProductReview): ProductReview {
  return {
    id: review.id,
    productId: review.product_id,
    reviewerName: review.reviewer_name,
    rating: review.rating,
    title: review.title,
    body: review.body,
    source: review.source,
    generatedByModel: review.generated_by_model,
    createdAt: review.created_at
  };
}

export async function getProductReviews(productId: string): Promise<ProductReview[]> {
  const supabase = await createClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("product_reviews")
    .select("id, product_id, reviewer_name, rating, title, body, source, generated_by_model, created_at")
    .eq("product_id", productId)
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Unable to load product reviews", error.message);
    return [];
  }

  return ((data ?? []) as DbProductReview[]).map(mapReview);
}
