"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { Icon } from "./Icon";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";

const navLinks = [
  { label: "About", href: "/about" },
  { label: "Gallery", href: "/gallery" },
];

export function PublicNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-kora">
      <div className="container-kora">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Logo size="md" href="/" />

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-kora-primary"
                      : "text-kora-muted hover:text-kora-primary"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="w-px h-6 bg-kora mx-3" />
            <Link href="/login" className="btn-ghost">
              Sign in
            </Link>
            <Link href="/register" className="btn-primary">
              Get started
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-kora-dark hover:text-kora-primary"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <Icon icon={open ? faXmark : faBars} size="lg" />
          </button>
        </div>
      </div>

      {/* Mobile menu drawer */}
      {open && (
        <div className="md:hidden border-t border-kora bg-white">
          <div className="container-kora py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-3 px-2 text-base font-medium text-kora-dark hover:text-kora-primary"
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-kora my-2" />
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="py-3 px-2 text-base font-medium text-kora-dark hover:text-kora-primary"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="btn-primary mt-2"
            >
              Get started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
