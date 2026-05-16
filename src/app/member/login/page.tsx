"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { supabaseConfigured } from "@/lib/supabase/safe";

export default function MemberLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const configured = supabaseConfigured();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    setLoading(false);
    if (error) return setError(error.message);
    router.push("/member");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-5">
      <div className="w-full max-w-sm">
        <Link href="/" className="font-display text-5xl uppercase">
          MFLH<span className="text-flame">.</span>
        </Link>
        <p className="eyebrow mt-2 mb-8">Member Login</p>

        {!configured && (
          <p className="mb-6 border border-concrete bg-[#0d0d0d] p-4 font-body text-sm text-bone/60">
            Backend not configured yet.
          </p>
        )}

        <form onSubmit={onSubmit} className="grid gap-4">
          <div>
            <label htmlFor="email" className="field-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field-input"
            />
          </div>
          <div>
            <label htmlFor="password" className="field-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field-input"
            />
          </div>
          {error && <p className="font-body text-sm text-flame">{error}</p>}
          <button
            type="submit"
            disabled={loading || !configured}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="mt-6 font-body text-sm text-bone/60">
          New here?{" "}
          <Link href="/member/signup" className="text-flame hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}
