"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { Icon } from "./Icon";
import { faBars, faXmark, faRightFromBracket, faChartLine, faHouse } from "@fortawesome/free-solid-svg-icons";
import { logout } from "@/lib/auth";

interface AuthHeaderProps {
  userName?: string;
  role?: "PATIENT" | "THERAPIST";
}

export function AuthHeader({ userName, role }: AuthHeaderProps) {
  const [open, setOpen] = useState(false);
  const dashboardLink =
    role === "THERAPIST" ? "/therapist/dashboard" : "/patient/dashboard";

  return (
    <header className="border-b border-kora bg-white">
      <div className="container-kora">
        <div className="flex items-center justify-between h-16">
          <Logo size="md" href={dashboardLink} />

          {/* Desktop right side */}
          <div className="hidden md:flex items-center gap-4">
            {role === "PATIENT" && (
              <>
                <Link href="/patient/dashboard" className="btn-ghost text-sm">
                  <Icon icon={faHouse} size="xs" />
                  Dashboard
                </Link>
                <Link href="/patient/progress" className="btn-ghost text-sm">
                  <Icon icon={faChartLine} size="xs" />
                  Progress
                </Link>
              </>
            )}
            {userName && (
              <span className="text-sm text-kora-muted hidden lg:inline">
                {userName}
              </span>
            )}
            <button
              onClick={logout}
              className="btn-ghost text-sm"
            >
              <Icon icon={faRightFromBracket} size="xs" />
              Sign out
            </button>
          </div>

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
            {role === "PATIENT" && (
              <>
                <Link
                  href="/patient/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 py-3 px-2 text-base font-medium text-kora-dark hover:text-kora-primary"
                >
                  <Icon icon={faHouse} size="sm" />
                  Dashboard
                </Link>
                <Link
                  href="/patient/progress"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 py-3 px-2 text-base font-medium text-kora-dark hover:text-kora-primary"
                >
                  <Icon icon={faChartLine} size="sm" />
                  Progress
                </Link>
              </>
            )}
            {userName && (
              <div className="py-3 px-2 border-t border-kora mt-2">
                <p className="text-xs text-kora-soft">Signed in as</p>
                <p className="text-sm font-medium text-kora-dark">{userName}</p>
              </div>
            )}
            <button
              onClick={logout}
              className="flex items-center gap-3 py-3 px-2 text-base font-medium text-kora-dark hover:text-kora-primary text-left"
            >
              <Icon icon={faRightFromBracket} size="sm" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
