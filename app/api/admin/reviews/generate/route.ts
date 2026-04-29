import { NextResponse, type NextRequest } from "next/server";
import { getProductBySlug } from "@/lib/data";
import { saveAiReviews } from "@/lib/reviewGeneration";
import { createClient } from "@/lib/supabase/server";

type ProductRow = {
  id: string;
  slug: string;
};

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
  }

  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", auth.user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const body = (await request.json()) as { productId?: string; replace?: boolean };
  if (!body.productId) {
    return NextResponse.json({ error: "productId is required." }, { status: 400 });
  }

  const { data: productRow, error: productError } = await supabase
    .from("products")
    .select("id, slug")
    .eq("id", body.productId)
    .single();

  if (productError || !productRow) {
    return NextResponse.json({ error: productError?.message ?? "Product not found." }, { status: 404 });
  }

  const product = await getProductBySlug((productRow as ProductRow).slug);
  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  try {
    const result = await saveAiReviews(supabase, product, body.replace ?? true);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to generate reviews." },
      { status: 500 }
    );
  }
}
