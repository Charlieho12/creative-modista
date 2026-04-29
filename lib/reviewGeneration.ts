import { generateProductReviews } from "@/lib/aiReviews";
import { Product } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

export async function saveAiReviews(
  supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>,
  product: Product,
  replace: boolean
) {
  const generated = await generateProductReviews(product);

  if (replace) {
    await supabase
      .from("product_reviews")
      .delete()
      .eq("product_id", product.id)
      .eq("source", "ai_generated");
  }

  const { error } = await supabase.from("product_reviews").insert(
    generated.reviews.map((review) => ({
      product_id: product.id,
      reviewer_name: review.reviewerName,
      rating: review.rating,
      title: review.title,
      body: review.body,
      source: "ai_generated",
      generated_by_model: generated.model,
      is_published: true
    }))
  );

  if (error) {
    throw new Error(error.message);
  }

  return {
    productId: product.id,
    count: generated.reviews.length,
    model: generated.model
  };
}
