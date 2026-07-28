"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { Icon } from "./Icon";
import {
  faChartLine,
  faUsers,
  faClipboardList,
  faGear,
  faRightFromBracket,
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { logout, getUser } from "@/lib/auth";
import { KoraUser } from "@/lib/auth";

interface NavItem {
  label: string;
  href: string;
  icon: typeof faChartLine;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/therapist/dashboard", icon: faChartLine },
  { label: "Patients", href: "/therapist/patients", icon: faUsers },
  { label: "Treatment Plans", href: "/therapist/plans", icon: faClipboardList },
  { label: "Settings", href: "/therapist/settings", icon: faGear },
];

export function TherapistSidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<KoraUser | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setUser(getUser());
  }, []);

  // Close mobile menu when clicking a link
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100 flex items-center justify-between px-4 py-3">
        <Link href="/therapist/dashboard">
          <Logo size="sm" />
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-[color:var(--color-kora-text)] hover:text-[color:var(--color-kora-primary)]"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          <Icon icon={mobileOpen ? faXmark : faBars} size="lg" />
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-100
          transform transition-transform duration-200 flex flex-col
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b border-gray-100">
          <Link href="/therapist/dashboard">
            <Logo size="md" />
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${
                    isActive
                      ? "bg-[color:var(--color-kora-bg)] text-[color:var(--color-kora-primary)]"
                      : "text-[color:var(--color-kora-text)] hover:bg-gray-50 hover:text-[color:var(--color-kora-primary)]"
                  }
                `}
              >
                <Icon icon={item.icon} className="w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User info + logout */}
        <div className="border-t border-gray-100 px-4 py-4">
          {user && (
            <div className="px-3 py-2 mb-2">
              <p className="text-xs text-[color:var(--color-kora-muted)]">
                Signed in as
              </p>
              <p className="text-sm font-medium text-[color:var(--color-kora-dark)] truncate">
                {user.email}
              </p>
            </div>
          )}
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[color:var(--color-kora-text)] hover:bg-gray-50 hover:text-[color:var(--color-kora-primary)] transition-colors"
          >
            <Icon icon={faRightFromBracket} className="w-5" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
