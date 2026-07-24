"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthHeader } from "@/components/AuthHeader";
import { getToken } from "@/lib/auth";
import { getTreatmentPlans, TreatmentPlan, ApiError } from "@/lib/api";

export default function PatientDashboard() {
  const router = useRouter();
  const [plans, setPlans] = useState<TreatmentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    getTreatmentPlans(token)
      .then((data) => {
        setPlans(data);
        // Grab patient name from first plan's patient info if present
        if (data.length > 0 && data[0].patient) {
          setUserName(data[0].patient.fullName);
        }
      })
      .catch((err) => {
        if (err instanceof ApiError && err.statusCode === 401) {
          router.push("/login");
        } else {
          setError(err.message || "Failed to load treatment plans");
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  const activePlans = plans.filter((p) => p.status === "ACTIVE");
  const completedPlans = plans.filter((p) => p.status === "COMPLETED");

  return (
    <div className="min-h-screen bg-white">
      <AuthHeader userName={userName} role="PATIENT" />

      <main className="container-kora py-8 md:py-12">
        {/* Greeting */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-2xl md:text-3xl font-bold text-[color:var(--color-kora-dark)]">
            {userName ? `Welcome back, ${userName.split(" ")[0]}` : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm md:text-base text-[color:var(--color-kora-muted)]">
            Here's your rehabilitation plan for today.
          </p>
        </div>

        {loading && (
          <div className="text-center py-12">
            <p className="text-[color:var(--color-kora-muted)]">Loading your plan...</p>
          </div>
        )}

        {error && !loading && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && plans.length === 0 && (
          <div className="text-center py-12 md:py-20 border border-dashed border-gray-300 rounded-lg">
            <p className="text-lg font-medium text-[color:var(--color-kora-dark)]">
              No treatment plan yet
            </p>
            <p className="mt-2 text-sm text-[color:var(--color-kora-muted)] max-w-md mx-auto">
              Your therapist hasn't assigned you a plan yet. Once they do, your prescribed exercises will show up here.
            </p>
          </div>
        )}

        {!loading && activePlans.length > 0 && (
          <div className="space-y-8">
            {activePlans.map((plan) => (
              <section key={plan.id}>
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-[color:var(--color-kora-bg)] text-[color:var(--color-kora-dark)]">
                      Active
                    </span>
                    {plan.therapist && (
                      <span className="text-sm text-[color:var(--color-kora-muted)]">
                        Prescribed by {plan.therapist.fullName}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-[color:var(--color-kora-dark)]">
                    {plan.title}
                  </h2>
                  {plan.description && (
                    <p className="mt-1 text-sm text-[color:var(--color-kora-muted)]">
                      {plan.description}
                    </p>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {plan.exercises.map((exercise) => (
                    <Link
                      key={exercise.id}
                      href={`/patient/workout/${exercise.id}`}
                      className="block p-5 rounded-lg border border-gray-200 hover:border-[color:var(--color-kora-primary)] hover:shadow-md transition-all"
                    >
                      <h3 className="font-semibold text-[color:var(--color-kora-dark)]">
                        {exercise.name}
                      </h3>
                      {exercise.description && (
                        <p className="mt-1 text-xs text-[color:var(--color-kora-muted)] line-clamp-2">
                          {exercise.description}
                        </p>
                      )}
                      <div className="mt-3 flex items-center gap-3 text-xs text-[color:var(--color-kora-muted)]">
                        <span>
                          <strong className="text-[color:var(--color-kora-text)]">
                            {exercise.targetSets}
                          </strong>{" "}
                          sets
                        </span>
                        <span>·</span>
                        <span>
                          <strong className="text-[color:var(--color-kora-text)]">
                            {exercise.targetReps}
                          </strong>{" "}
                          reps
                        </span>
                        <span>·</span>
                        <span>
                          <strong className="text-[color:var(--color-kora-text)]">
                            {exercise.restSeconds}s
                          </strong>{" "}
                          rest
                        </span>
                      </div>
                      <div className="mt-4 text-sm font-medium text-[color:var(--color-kora-primary)]">
                        Start workout →
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {!loading && completedPlans.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-[color:var(--color-kora-dark)] mb-4">
              Past treatment plans
            </h2>
            <ul className="space-y-2">
              {completedPlans.map((plan) => (
                <li
                  key={plan.id}
                  className="text-sm text-[color:var(--color-kora-muted)]"
                >
                  {plan.title}{" "}
                  <span className="text-xs">
                    (completed{" "}
                    {plan.endDate ? new Date(plan.endDate).toLocaleDateString() : ""})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Progress link */}
        {!loading && plans.length > 0 && (
          <div className="mt-12">
            <Link
              href="/patient/progress"
              className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--color-kora-primary)] hover:underline"
            >
              View my pain progress over time →
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
