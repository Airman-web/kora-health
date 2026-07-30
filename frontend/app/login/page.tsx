"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Logo } from "@/components/Logo";
import { Icon } from "@/components/Icon";
import { faEye, faEyeSlash, faArrowLeft, faQuoteLeft } from "@fortawesome/free-solid-svg-icons";
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
      if (err instanceof ApiError) setError(err.message);
      else setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left column — brand imagery */}
      <aside className="hidden lg:flex lg:w-1/2 xl:w-2/5 relative bg-kora-dark">
        <Image
          src="/images/kora-2.jpg"
          alt="Physiotherapy in practice at Kora Health"
          fill
          priority
          sizes="40vw"
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-kora-dark/70 via-kora-dark/40 to-kora-primary/30" />

        <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14 text-white w-full">
          <Logo size="lg" href="/" />

          <div className="max-w-md">
            <Icon icon={faQuoteLeft} size="2xl" className="text-white/50" />
            <blockquote className="mt-4 text-2xl xl:text-3xl font-medium leading-snug">
              With Kora I can keep guiding my patients long after they leave the
              room.
            </blockquote>
            <cite className="not-italic mt-4 block text-white/75">
              A practising physiotherapist, Kigali
            </cite>
          </div>

          <p className="text-sm text-white/60">
            © {new Date().getFullYear()} Kora Health · Kigali, Rwanda
          </p>
        </div>
      </aside>

      {/* Right column — form */}
      <div className="flex-1 flex flex-col">
        <header className="lg:hidden border-b border-kora">
          <div className="container-kora py-4 flex items-center justify-between">
            <Logo size="md" href="/" />
            <Link href="/" className="text-sm text-kora-muted hover:text-kora-primary">
              <Icon icon={faArrowLeft} size="xs" className="mr-1" />
              Home
            </Link>
          </div>
        </header>

        <div className="hidden lg:block absolute top-6 right-6">
          <Link
            href="/"
            className="text-sm text-kora-muted hover:text-kora-primary inline-flex items-center gap-1"
          >
            <Icon icon={faArrowLeft} size="xs" />
            Back to home
          </Link>
        </div>

        <main className="flex-1 flex items-center justify-center px-5 md:px-10 py-10">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-bold text-kora-dark tracking-tight">
              Welcome back
            </h1>
            <p className="mt-2 text-kora-muted">
              Sign in to continue your care.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <label className="label-kora">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-kora"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="label-kora">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-kora pr-10"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-kora-soft hover:text-kora-primary"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <Icon icon={showPassword ? faEyeSlash : faEye} size="sm" />
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
                className="btn-primary w-full disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <p className="mt-6 text-sm text-center text-kora-muted">
              Don't have an account?{" "}
              <Link href="/register" className="text-kora-primary font-semibold hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
