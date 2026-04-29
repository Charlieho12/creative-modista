import { Product } from "@/lib/types";

export type GeneratedReview = {
  reviewerName: string;
  rating: number;
  title: string;
  body: string;
};

type GeminiResponse = {
  candidates?: {
    content?: {
      parts?: {
        text?: string;
      }[];
    };
  }[];
};

export async function generateProductReviews(product: Product, count = 3) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_REVIEW_MODEL ?? "gemini-2.5-flash";

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing.");
  }

  const prompt = [
    "Create product-specific AI-generated style notes for a women's fashion boutique.",
    "Do not claim these are real customer testimonials or verified purchases.",
    "Match the actual product details and keep the tone warm, concise, and useful.",
    "Return exactly the requested JSON shape.",
    JSON.stringify({
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
  ].join("\n\n");

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            required: ["reviews"],
            properties: {
              reviews: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  required: ["reviewerName", "rating", "title", "body"],
                  properties: {
                    reviewerName: {
                      type: "STRING",
                      description: "A short neutral persona label, e.g. Style note, Fit note, Outfit note."
                    },
                    rating: {
                      type: "INTEGER",
                      minimum: 4,
                      maximum: 5
                    },
                    title: {
                      type: "STRING"
                    },
                    body: {
                      type: "STRING"
                    }
                  },
                  propertyOrdering: ["reviewerName", "rating", "title", "body"]
                }
              }
            },
            propertyOrdering: ["reviews"]
          }
        }
      })
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini review generation failed: ${errorText}`);
  }

  const payload = (await response.json()) as GeminiResponse;
  const text = payload.candidates?.[0]?.content?.parts?.find((part) => part.text)?.text;

  if (!text) {
    throw new Error("Gemini did not return review text.");
  }

  const parsed = JSON.parse(text) as { reviews: GeneratedReview[] };
  const reviews = parsed.reviews.slice(0, count);

  if (reviews.length === 0) {
    throw new Error("Gemini returned no reviews.");
  }

  return {
    model,
    reviews
  };
}
