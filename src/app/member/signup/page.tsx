"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { supabaseConfigured } from "@/lib/supabase/safe";

export default function MemberSignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [needsConfirm, setNeedsConfirm] = useState(false);
  const configured = supabaseConfigured();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name, display_name: name } }
    });
    setLoading(false);
    if (error) return setError(error.message);
    if (data.session) {
      router.push("/member");
      router.refresh();
    } else {
      setNeedsConfirm(true);
    }
  }

  if (needsConfirm) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ink px-5 text-center">
        <div className="max-w-sm">
          <p className="font-display text-4xl uppercase text-flame">
            Check Your Email
          </p>
          <p className="mt-3 font-body text-bone/70">
            We sent a confirmation link to {email}. Confirm it, then sign in.
          </p>
          <Link href="/member/login" className="btn-primary mt-8">
            Go To Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-5">
      <div className="w-full max-w-sm">
        <Link href="/" className="font-display text-5xl uppercase">
          MFLH<span className="text-flame">.</span>
        </Link>
        <p className="eyebrow mt-2 mb-8">Join The Collective</p>

        {!configured && (
          <p className="mb-6 border border-concrete bg-[#0d0d0d] p-4 font-body text-sm text-bone/60">
            Backend not configured yet.
          </p>
        )}

        <form onSubmit={onSubmit} className="grid gap-4">
          <div>
            <label htmlFor="name" className="field-label">
              Full Name
            </label>
            <input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="field-input"
            />
          </div>
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
              minLength={8}
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
            {loading ? "Creating…" : "Create Account"}
          </button>
        </form>

        <p className="mt-6 font-body text-sm text-bone/60">
          Already a member?{" "}
          <Link href="/member/login" className="text-flame hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
