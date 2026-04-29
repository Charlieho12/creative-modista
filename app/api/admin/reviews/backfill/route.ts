import { NextResponse } from "next/server";
import { getProducts } from "@/lib/data";
import { saveAiReviews } from "@/lib/reviewGeneration";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
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

  const products = await getProducts();
  const results = [];

  try {
    for (const product of products) {
      results.push(await saveAiReviews(supabase, product, true));
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to backfill reviews." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    updatedProducts: results.length,
    generatedReviews: results.reduce((total, result) => total + result.count, 0),
    results
  });
}
