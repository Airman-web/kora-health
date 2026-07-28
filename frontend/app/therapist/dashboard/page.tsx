"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthHeader } from "@/components/AuthHeader";
import { Icon } from "@/components/Icon";
import { faPlus, faUsers, faClipboardList, faChartLine } from "@fortawesome/free-solid-svg-icons";
import { getToken } from "@/lib/auth";
import { getTreatmentPlans, TreatmentPlan, ApiError } from "@/lib/api";

interface UniquePatient {
  id: string;
  fullName: string;
  planCount: number;
}

export default function TherapistDashboard() {
  const router = useRouter();
  const [plans, setPlans] = useState<TreatmentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [therapistName, setTherapistName] = useState<string>("");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    getTreatmentPlans(token)
      .then((data) => {
        setPlans(data);
      })
      .catch((err) => {
        if (err instanceof ApiError && err.statusCode === 401) {
          router.push("/login");
        } else {
          setError(err.message || "Failed to load dashboard");
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  // Derive unique patients from plans
  const uniquePatients: UniquePatient[] = [];
  const seenPatientIds = new Set<string>();
  plans.forEach((plan) => {
    if (plan.patient && !seenPatientIds.has(plan.patient.id)) {
      seenPatientIds.add(plan.patient.id);
      uniquePatients.push({
        id: plan.patient.id,
        fullName: plan.patient.fullName,
        planCount: plans.filter((p) => p.patient?.id === plan.patient!.id).length,
      });
    }
  });

  const activePlans = plans.filter((p) => p.status === "ACTIVE");
  const completedPlans = plans.filter((p) => p.status === "COMPLETED");

  return (
    <div className="min-h-screen bg-white">
      <AuthHeader userName={therapistName} role="THERAPIST" />

      <main className="container-kora py-8 md:py-12">
        {/* Greeting */}
        <div className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[color:var(--color-kora-dark)]">
              Therapist dashboard
            </h1>
            <p className="mt-2 text-sm md:text-base text-[color:var(--color-kora-muted)]">
              Manage your patients and their treatment plans.
            </p>
          </div>
          <Link
            href="/therapist/plans/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[color:var(--color-kora-primary)] text-white font-semibold hover:bg-[color:var(--color-kora-dark)] transition-colors"
          >
            <Icon icon={faPlus} />
            Create treatment plan
          </Link>
        </div>

        {loading && (
          <div className="text-center py-12">
            <p className="text-[color:var(--color-kora-muted)]">Loading your dashboard...</p>
          </div>
        )}

        {error && !loading && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="p-6 rounded-lg border border-gray-200 bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[color:var(--color-kora-bg)] flex items-center justify-center text-[color:var(--color-kora-primary)]">
                    <Icon icon={faUsers} />
                  </div>
                  <div>
                    <p className="text-xs text-[color:var(--color-kora-muted)]">
                      Patients
                    </p>
                    <p className="text-2xl font-bold text-[color:var(--color-kora-dark)]">
                      {uniquePatients.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-lg border border-gray-200 bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[color:var(--color-kora-bg)] flex items-center justify-center text-[color:var(--color-kora-primary)]">
                    <Icon icon={faClipboardList} />
                  </div>
                  <div>
                    <p className="text-xs text-[color:var(--color-kora-muted)]">
                      Active plans
                    </p>
                    <p className="text-2xl font-bold text-[color:var(--color-kora-dark)]">
                      {activePlans.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-lg border border-gray-200 bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[color:var(--color-kora-bg)] flex items-center justify-center text-[color:var(--color-kora-primary)]">
                    <Icon icon={faChartLine} />
                  </div>
                  <div>
                    <p className="text-xs text-[color:var(--color-kora-muted)]">
                      Completed plans
                    </p>
                    <p className="text-2xl font-bold text-[color:var(--color-kora-dark)]">
                      {completedPlans.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Patients section */}
            <section className="mb-12">
              <h2 className="text-xl font-bold text-[color:var(--color-kora-dark)] mb-4">
                Your patients
              </h2>

              {uniquePatients.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
                  <p className="text-lg font-medium text-[color:var(--color-kora-dark)]">
                    No patients yet
                  </p>
                  <p className="mt-2 text-sm text-[color:var(--color-kora-muted)] max-w-md mx-auto">
                    Create your first treatment plan to start working with a patient.
                  </p>
                  <Link
                    href="/therapist/plans/new"
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[color:var(--color-kora-primary)] text-white font-semibold hover:bg-[color:var(--color-kora-dark)] transition-colors"
                  >
                    <Icon icon={faPlus} />
                    Create treatment plan
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {uniquePatients.map((patient) => (
                    <Link
                      key={patient.id}
                      href={`/therapist/patients/${patient.id}`}
                      className="block p-5 rounded-lg border border-gray-200 hover:border-[color:var(--color-kora-primary)] hover:shadow-md transition-all"
                    >
                      <h3 className="font-semibold text-[color:var(--color-kora-dark)]">
                        {patient.fullName}
                      </h3>
                      <p className="mt-1 text-sm text-[color:var(--color-kora-muted)]">
                        {patient.planCount} treatment plan{patient.planCount !== 1 ? "s" : ""}
                      </p>
                      <p className="mt-3 text-sm font-medium text-[color:var(--color-kora-primary)]">
                        View patient →
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            {/* Treatment plans section */}
            {plans.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-[color:var(--color-kora-dark)] mb-4">
                  Recent treatment plans
                </h2>

                <div className="space-y-3">
                  {plans.slice(0, 10).map((plan) => (
                    <div
                      key={plan.id}
                      className="p-4 rounded-lg border border-gray-200 hover:border-[color:var(--color-kora-primary)] transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                                plan.status === "ACTIVE"
                                  ? "bg-[color:var(--color-kora-bg)] text-[color:var(--color-kora-dark)]"
                                  : plan.status === "COMPLETED"
                                  ? "bg-gray-100 text-gray-600"
                                  : "bg-yellow-50 text-yellow-800"
                              }`}
                            >
                              {plan.status}
                            </span>
                            {plan.patient && (
                              <span className="text-sm text-[color:var(--color-kora-muted)]">
                                For {plan.patient.fullName}
                              </span>
                            )}
                          </div>
                          <h3 className="font-semibold text-[color:var(--color-kora-dark)]">
                            {plan.title}
                          </h3>
                          <p className="mt-1 text-sm text-[color:var(--color-kora-muted)]">
                            {plan.exercises.length} exercise{plan.exercises.length !== 1 ? "s" : ""}
                            {" · "}
                            Started {new Date(plan.startDate).toLocaleDateString()}
                          </p>
                        </div>
                        {plan.patient && (
                          <Link
                            href={`/therapist/patients/${plan.patient.id}`}
                            className="text-sm font-medium text-[color:var(--color-kora-primary)] hover:underline whitespace-nowrap"
                          >
                            View →
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}
