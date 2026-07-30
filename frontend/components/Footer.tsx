import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-kora bg-kora-surface-alt">
      <div className="container-kora py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Logo size="md" href="/" />
            <p className="mt-4 text-sm text-kora-muted max-w-md leading-relaxed">
              Kora Health brings licensed physiotherapy care to Rwandan patients
              through remote consultations, prescribed exercise plans, and
              measurable pain tracking, right from their phone.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-kora-dark mb-3">
              Product
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-kora-muted hover:text-kora-primary">
                  About
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-kora-muted hover:text-kora-primary">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-kora-muted hover:text-kora-primary">
                  Sign up
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-kora-muted hover:text-kora-primary">
                  Sign in
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-kora-dark mb-3">
              Company
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="text-kora-muted">Kigali, Rwanda</li>
              <li>
                <a
                  href="mailto:hello@korahealth.rw"
                  className="text-kora-muted hover:text-kora-primary"
                >
                  hello@korahealth.rw
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-kora flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-kora-soft">
          <p>© {year} Kora Health. All rights reserved.</p>
          <p>Built for the physiotherapy community of Rwanda.</p>
        </div>
      </div>
    </footer>
  );
}
