import { Product } from "@/lib/types";

export type GeneratedReview = {
  reviewerName: string;
  rating: number;
  title: string;
  body: string;
};

type OpenAIResponse = {
  output_text?: string;
  output?: {
    content?: {
      type?: string;
      text?: string;
    }[];
  }[];
};

export async function generateProductReviews(product: Product, count = 3) {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_REVIEW_MODEL ?? "gpt-5.2";

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is missing.");
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      instructions:
        "Create product-specific AI-generated style notes for a women's fashion boutique. Do not claim these are real customer testimonials or verified purchases. Match the actual product details and keep the tone warm, concise, and useful.",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: JSON.stringify({
                count,
                product: {
                  name: product.name,
                  category: product.category,
                  description: product.description,
                  price: product.salePrice ?? product.price,
                  sizes: product.sizes,
                  colors: product.colors,
                  stock: product.stock
                }
              })
            }
          ]
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "product_review_notes",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            required: ["reviews"],
            properties: {
              reviews: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  required: ["reviewerName", "rating", "title", "body"],
                  properties: {
                    reviewerName: {
                      type: "string",
                      description: "A short neutral persona label, e.g. Style note, Fit note, Outfit note."
                    },
                    rating: {
                      type: "integer",
                      minimum: 4,
                      maximum: 5
                    },
                    title: {
                      type: "string"
                    },
                    body: {
                      type: "string"
                    }
                  }
                }
              }
            }
          }
        }
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI review generation failed: ${errorText}`);
  }

  const payload = (await response.json()) as OpenAIResponse;
  const text = payload.output_text ?? payload.output?.flatMap((item) => item.content ?? []).find((item) => item.text)?.text;

  if (!text) {
    throw new Error("OpenAI did not return review text.");
  }

  const parsed = JSON.parse(text) as { reviews: GeneratedReview[] };
  const reviews = parsed.reviews.slice(0, count);

  if (reviews.length === 0) {
    throw new Error("OpenAI returned no reviews.");
  }

  return {
    model,
    reviews
  };
}
