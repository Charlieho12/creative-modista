import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/account";
  const redirectUrl = new URL(next, requestUrl.origin);

  if (!code) {
    redirectUrl.pathname = "/auth/login";
    redirectUrl.searchParams.set("message", "Missing confirmation code.");
    return NextResponse.redirect(redirectUrl);
  }

  const supabase = await createClient();
  if (!supabase) {
    redirectUrl.pathname = "/auth/login";
    redirectUrl.searchParams.set("message", "Supabase is not configured.");
    return NextResponse.redirect(redirectUrl);
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    redirectUrl.pathname = "/auth/login";
    redirectUrl.searchParams.set("message", error.message);
    return NextResponse.redirect(redirectUrl);
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user) {
    await supabase
      .from("profiles")
      .update({
        email: user.email,
        email_confirmed_at: user.email_confirmed_at ?? new Date().toISOString(),
        last_sign_in_at: user.last_sign_in_at
      })
      .eq("id", user.id);
  }

  redirectUrl.searchParams.set("confirmed", "true");
  return NextResponse.redirect(redirectUrl);
}
