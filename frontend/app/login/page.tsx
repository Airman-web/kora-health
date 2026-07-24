"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { login, ApiError } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await login({ email, password });

      // Store token and user
      localStorage.setItem("kora_token", response.token);
      localStorage.setItem("kora_user", JSON.stringify(response.user));

      // Redirect based on role
      if (response.user.role === "PATIENT") {
        router.push("/patient/dashboard");
      } else {
        router.push("/therapist/dashboard");
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="container-kora py-4">
          <Link href="/">
            <Logo size="md" />
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="container-kora py-8 md:py-16 max-w-md">
        <h1 className="text-2xl md:text-3xl font-bold text-[color:var(--color-kora-dark)]">
          Welcome back
        </h1>
        <p className="mt-2 text-sm md:text-base text-[color:var(--color-kora-muted)]">
          Sign in to your Kora Health account.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 md:mt-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[color:var(--color-kora-text)]">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--color-kora-primary)] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[color:var(--color-kora-text)]">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--color-kora-primary)] focus:border-transparent"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-[color:var(--color-kora-primary)] text-white font-semibold hover:bg-[color:var(--color-kora-dark)] transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-[color:var(--color-kora-muted)]">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-[color:var(--color-kora-primary)] font-semibold hover:underline"
          >
            Create one
          </Link>
        </p>
      </main>
    </div>
  );
}
