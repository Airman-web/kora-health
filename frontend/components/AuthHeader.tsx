"use client";

import Link from "next/link";
import { Logo } from "./Logo";
import { logout } from "@/lib/auth";

interface AuthHeaderProps {
  userName?: string;
  role?: "PATIENT" | "THERAPIST";
}

export function AuthHeader({ userName, role }: AuthHeaderProps) {
  const dashboardLink = role === "THERAPIST" ? "/therapist/dashboard" : "/patient/dashboard";

  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="container-kora py-4 flex items-center justify-between">
        <Link href={dashboardLink}>
          <Logo size="md" />
        </Link>
        <div className="flex items-center gap-4">
          {userName && (
            <span className="text-sm text-[color:var(--color-kora-muted)] hidden sm:inline">
              {userName}
            </span>
          )}
          <button
            onClick={logout}
            className="text-sm font-medium text-[color:var(--color-kora-text)] hover:text-[color:var(--color-kora-primary)]"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}