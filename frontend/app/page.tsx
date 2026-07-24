import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="container-kora py-4 flex items-center justify-between">
          <Logo size="md" />
          <nav className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-[color:var(--color-kora-text)] hover:text-[color:var(--color-kora-primary)]"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium px-4 py-2 rounded-lg bg-[color:var(--color-kora-primary)] text-white hover:bg-[color:var(--color-kora-dark)] transition-colors"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-[color:var(--color-kora-bg)]">
        <div className="container-kora py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-[color:var(--color-kora-dark)] tracking-tight max-w-3xl mx-auto">
            Physiotherapy that reaches every patient in Rwanda.
          </h1>
          <p className="mt-6 text-lg text-[color:var(--color-kora-muted)] max-w-2xl mx-auto">
            Kora Health connects patients with licensed physiotherapists for
            remote rehabilitation, right from their phone. Personalized
            treatment plans, real pain tracking, and better outcomes.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-6 py-3 rounded-lg bg-[color:var(--color-kora-primary)] text-white font-semibold hover:bg-[color:var(--color-kora-dark)] transition-colors"
            >
              Create an account
            </Link>
            <Link
              href="/login"
              className="px-6 py-3 rounded-lg border border-[color:var(--color-kora-primary)] text-[color:var(--color-kora-primary)] font-semibold hover:bg-[color:var(--color-kora-bg)] transition-colors"
            >
              I already have an account
            </Link>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="py-16">
        <div className="container-kora">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="w-12 h-12 rounded-lg bg-[color:var(--color-kora-bg)] flex items-center justify-center mb-4">
                <div className="w-6 h-6 rounded-full bg-[color:var(--color-kora-primary)]" />
              </div>
              <h3 className="text-lg font-semibold text-[color:var(--color-kora-dark)]">
                Personalized treatment plans
              </h3>
              <p className="mt-2 text-sm text-[color:var(--color-kora-muted)]">
                Your therapist prescribes exercises tailored to your specific
                recovery, not a generic plan pulled from a database.
              </p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 rounded-lg bg-[color:var(--color-kora-bg)] flex items-center justify-center mb-4">
                <div className="w-6 h-6 rounded-full bg-[color:var(--color-kora-primary)]" />
              </div>
              <h3 className="text-lg font-semibold text-[color:var(--color-kora-dark)]">
                Real pain tracking
              </h3>
              <p className="mt-2 text-sm text-[color:var(--color-kora-muted)]">
                Log pain before and after every workout. See your progress over
                time and share it with your therapist.
              </p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 rounded-lg bg-[color:var(--color-kora-bg)] flex items-center justify-center mb-4">
                <div className="w-6 h-6 rounded-full bg-[color:var(--color-kora-primary)]" />
              </div>
              <h3 className="text-lg font-semibold text-[color:var(--color-kora-dark)]">
                Built for Rwanda
              </h3>
              <p className="mt-2 text-sm text-[color:var(--color-kora-muted)]">
                Mobile Money payments, WhatsApp reminders, and low-bandwidth
                video designed for real Rwandan network conditions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100">
        <div className="container-kora py-8 flex items-center justify-between text-sm text-[color:var(--color-kora-muted)]">
          <Logo size="sm" />
          <p>Kigali, Rwanda</p>
        </div>
      </footer>
    </div>
  );
}