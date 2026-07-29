"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import {
  faPlus,
  faUsers,
  faClipboardList,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";
import { getToken } from "@/lib/auth";
import {
  getTreatmentPlans,
  listAllPatients,
  TreatmentPlan,
  PatientListItem,
  ApiError,
} from "@/lib/api";

interface UniquePatient {
  id: string;
  fullName: string;
  planCount: number;
  hasActivePlans: boolean;
}

export default function TherapistDashboard() {
  const router = useRouter();
  const [plans, setPlans] = useState<TreatmentPlan[]>([]);
  const [allPatients, setAllPatients] = useState<PatientListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    Promise.all([getTreatmentPlans(token), listAllPatients(token)])
      .then(([plansData, patientsData]) => {
        setPlans(plansData);
        setAllPatients(patientsData);
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

  const patientSummaries: UniquePatient[] = useMemo(() => {
    return allPatients.map((p) => {
      const patientPlans = plans.filter((plan) => plan.patient?.id === p.id);
      return {
        id: p.id,
        fullName: p.fullName,
        planCount: patientPlans.length,
        hasActivePlans: patientPlans.some((plan) => plan.status === "ACTIVE"),
      };
    });
  }, [allPatients, plans]);

  const activePlans = plans.filter((p) => p.status === "ACTIVE");
  const completedPlans = plans.filter((p) => p.status === "COMPLETED");

  return (
    <div className="container-kora py-6 md:py-10">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[color:var(--color-kora-dark)]">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-[color:var(--color-kora-muted)]">
            An overview of your patients and treatment plans.
          </p>
        </div>
        <Link
          href="/therapist/plans/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[color:var(--color-kora-primary)] text-white font-semibold hover:bg-[color:var(--color-kora-dark)] transition-colors self-start md:self-auto"
        >
          <Icon icon={faPlus} />
          Create treatment plan
        </Link>
      </div>

      {loading && (
        <div className="text-center py-12">
          <p className="text-[color:var(--color-kora-muted)]">Loading...</p>
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
            <StatCard
              icon={faUsers}
              label="Registered patients"
              value={allPatients.length}
            />
            <StatCard
              icon={faClipboardList}
              label="Active plans"
              value={activePlans.length}
            />
            <StatCard
              icon={faChartLine}
              label="Completed plans"
              value={completedPlans.length}
            />
          </div>

          {/* Patients preview */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[color:var(--color-kora-dark)]">
                Patients
              </h2>
              <Link
                href="/therapist/patients"
                className="text-sm font-medium text-[color:var(--color-kora-primary)] hover:underline"
              >
                View all
              </Link>
            </div>

            {patientSummaries.length === 0 ? (
              <EmptyState
                title="No patients yet"
                description="Once patients sign up on the platform, they'll appear here."
                actionHref="/therapist/plans/new"
                actionLabel="Create treatment plan"
              />
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {patientSummaries.slice(0, 6).map((patient) => (
                  <Link
                    key={patient.id}
                    href={
                      patient.planCount > 0
                        ? `/therapist/patients/${patient.id}`
                        : `/therapist/plans/new?patientId=${patient.id}`
                    }
                    className="block p-5 rounded-lg bg-white border border-gray-200 hover:border-[color:var(--color-kora-primary)] hover:shadow-sm transition-all"
                  >
                    <h3 className="font-semibold text-[color:var(--color-kora-dark)]">
                      {patient.fullName}
                    </h3>
                    <p className="mt-1 text-sm text-[color:var(--color-kora-muted)]">
                      {patient.planCount > 0
                        ? `${patient.planCount} plan${patient.planCount !== 1 ? "s" : ""}${patient.hasActivePlans ? " · active" : ""}`
                        : "No plans yet"}
                    </p>
                    <p className="mt-3 text-sm font-medium text-[color:var(--color-kora-primary)]">
                      {patient.planCount > 0 ? "View patient →" : "Assign a plan →"}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Recent plans */}
          {plans.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-[color:var(--color-kora-dark)]">
                  Recent treatment plans
                </h2>
                <Link
                  href="/therapist/plans"
                  className="text-sm font-medium text-[color:var(--color-kora-primary)] hover:underline"
                >
                  View all
                </Link>
              </div>

              <div className="space-y-3">
                {plans.slice(0, 5).map((plan) => (
                  <div
                    key={plan.id}
                    className="p-4 rounded-lg bg-white border border-gray-200"
                  >
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <StatusBadge status={plan.status} />
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
                          {plan.exercises.length} exercise
                          {plan.exercises.length !== 1 ? "s" : ""} · Started{" "}
                          {new Date(plan.startDate).toLocaleDateString()}
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
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: typeof faUsers;
  label: string;
  value: number;
}) {
  return (
    <div className="p-6 rounded-lg bg-white border border-gray-200">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[color:var(--color-kora-bg)] flex items-center justify-center text-[color:var(--color-kora-primary)]">
          <Icon icon={icon} />
        </div>
        <div>
          <p className="text-xs text-[color:var(--color-kora-muted)]">{label}</p>
          <p className="text-2xl font-bold text-[color:var(--color-kora-dark)]">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    ACTIVE: "bg-[color:var(--color-kora-bg)] text-[color:var(--color-kora-dark)]",
    COMPLETED: "bg-gray-100 text-gray-600",
    PAUSED: "bg-yellow-50 text-yellow-800",
  };
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
        styles[status as keyof typeof styles] || styles.ACTIVE
      }`}
    >
      {status}
    </span>
  );
}

function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string;
  description: string;
  actionHref: string;
  actionLabel: string;
}) {
  return (
    <div className="text-center py-12 bg-white border border-dashed border-gray-300 rounded-lg">
      <p className="text-lg font-medium text-[color:var(--color-kora-dark)]">
        {title}
      </p>
      <p className="mt-2 text-sm text-[color:var(--color-kora-muted)] max-w-md mx-auto px-4">
        {description}
      </p>
      <Link
        href={actionHref}
        className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[color:var(--color-kora-primary)] text-white font-semibold hover:bg-[color:var(--color-kora-dark)] transition-colors"
      >
        <Icon icon={faPlus} />
        {actionLabel}
      </Link>
    </div>
  );
}
