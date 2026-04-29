"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

export function AuthForm({ mode }: { mode: "login" | "signup" | "forgot" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const supabase = createClient();
    if (!supabase) {
      setMessage("Supabase is not configured yet. Add your project URL and anon key to .env.local.");
      setLoading(false);
      return;
    }

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setMessage(error ? error.message : "Logged in. You can continue shopping.");
    }

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } }
      });
      setMessage(error ? error.message : "Account created. Please check your email if confirmation is enabled.");
    }

    if (mode === "forgot") {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      setMessage(error ? error.message : "Password reset email sent.");
    }

    setLoading(false);
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-md rounded-lg border border-blush-100 bg-white p-6 shadow-sm">
      <h1 className="font-serif text-3xl font-semibold text-ink">
        {mode === "login" ? "Welcome back" : mode === "signup" ? "Create account" : "Reset password"}
      </h1>
      <p className="mt-2 text-sm leading-6 text-neutral-600">
        {mode === "login"
          ? "Login to checkout and track your Creative Modista orders."
          : mode === "signup"
            ? "Create an account before placing your first order."
            : "Enter your email and we will send reset instructions."}
      </p>

      {mode === "signup" ? (
        <label className="mt-5 block text-sm font-semibold">
          Full name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            className="mt-2 w-full rounded-full border border-blush-100 px-4 py-3 outline-none focus:border-blush-300"
          />
        </label>
      ) : null}

      <label className="mt-5 block text-sm font-semibold">
        Email
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="mt-2 w-full rounded-full border border-blush-100 px-4 py-3 outline-none focus:border-blush-300"
        />
      </label>

      {mode !== "forgot" ? (
        <label className="mt-4 block text-sm font-semibold">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={6}
            className="mt-2 w-full rounded-full border border-blush-100 px-4 py-3 outline-none focus:border-blush-300"
          />
        </label>
      ) : null}

      {message ? <p className="mt-4 rounded-md bg-linen p-3 text-sm text-neutral-700">{message}</p> : null}

      <Button type="submit" className="mt-5 w-full" disabled={loading}>
        {loading ? "Please wait..." : mode === "login" ? "Login" : mode === "signup" ? "Sign up" : "Send reset link"}
      </Button>

      <div className="mt-5 flex flex-wrap justify-between gap-3 text-sm text-neutral-600">
        {mode !== "login" ? <Link href="/auth/login">Login</Link> : <Link href="/auth/signup">Create account</Link>}
        {mode !== "forgot" ? <Link href="/auth/forgot-password">Forgot password?</Link> : null}
      </div>
    </form>
  );
}
