"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { TherapistSidebar } from "@/components/TherapistSidebar";
import { getUser } from "@/lib/auth";

export default function TherapistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const user = getUser();
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role !== "THERAPIST") {
      router.push("/patient/dashboard");
      return;
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <TherapistSidebar />

      {/* Main content area — offset to the right of the sidebar on desktop */}
      <div className="lg:ml-64 min-h-screen">
        {/* Space for mobile top bar */}
        <div className="lg:hidden h-14" />

        <main>{children}</main>
      </div>
    </div>
  );
}
