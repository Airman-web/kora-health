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
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await login({ email, password });
      localStorage.setItem("kora_token", response.token);
      localStorage.setItem("kora_user", JSON.stringify(response.user));

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
      <header className="border-b border-gray-100">
        <div className="container-kora py-4">
          <Link href="/">
            <Logo size="md" />
          </Link>
        </div>
      </header>

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
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--color-kora-primary)] focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[color:var(--color-kora-muted)] hover:text-[color:var(--color-kora-primary)]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
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
