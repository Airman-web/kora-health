"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { faPlus, faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { getToken } from "@/lib/auth";
import { getTreatmentPlans, TreatmentPlan, ApiError } from "@/lib/api";

type FilterStatus = "ALL" | "ACTIVE" | "COMPLETED" | "PAUSED";

export default function PlansListPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<TreatmentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterStatus>("ALL");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    getTreatmentPlans(token)
      .then((data) => setPlans(data))
      .catch((err) => {
        if (err instanceof ApiError && err.statusCode === 401) {
          router.push("/login");
        } else {
          setError(err.message || "Failed to load plans");
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  const filteredPlans =
    filter === "ALL" ? plans : plans.filter((p) => p.status === filter);

  const counts = {
    ALL: plans.length,
    ACTIVE: plans.filter((p) => p.status === "ACTIVE").length,
    COMPLETED: plans.filter((p) => p.status === "COMPLETED").length,
    PAUSED: plans.filter((p) => p.status === "PAUSED").length,
  };

  return (
    <div className="container-kora py-6 md:py-10">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[color:var(--color-kora-dark)]">
            Treatment plans
          </h1>
          <p className="mt-1 text-sm text-[color:var(--color-kora-muted)]">
            All plans you've created for your patients.
          </p>
        </div>
        <Link
          href="/therapist/plans/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[color:var(--color-kora-primary)] text-white font-semibold hover:bg-[color:var(--color-kora-dark)] transition-colors self-start md:self-auto"
        >
          <Icon icon={faPlus} />
          Create plan
        </Link>
      </div>

      {loading && (
        <p className="text-center text-[color:var(--color-kora-muted)] py-12">
          Loading plans...
        </p>
      )}

      {error && !loading && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Filter tabs */}
          <div className="mb-6 flex gap-1 border-b border-gray-200 overflow-x-auto">
            {(["ALL", "ACTIVE", "COMPLETED", "PAUSED"] as FilterStatus[]).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`
                  px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
                  ${
                    filter === status
                      ? "border-[color:var(--color-kora-primary)] text-[color:var(--color-kora-primary)]"
                      : "border-transparent text-[color:var(--color-kora-muted)] hover:text-[color:var(--color-kora-dark)]"
                  }
                `}
              >
                {status.charAt(0) + status.slice(1).toLowerCase()}
                <span className="ml-2 text-xs">({counts[status]})</span>
              </button>
            ))}
          </div>

          {/* Plans list */}
          {filteredPlans.length === 0 ? (
            <div className="text-center py-16 bg-white border border-dashed border-gray-300 rounded-lg">
              <Icon
                icon={faClipboardList}
                size="2xl"
                className="text-[color:var(--color-kora-muted)] mb-3"
              />
              <p className="text-lg font-medium text-[color:var(--color-kora-dark)]">
                {filter === "ALL"
                  ? "No plans yet"
                  : `No ${filter.toLowerCase()} plans`}
              </p>
              <p className="mt-2 text-sm text-[color:var(--color-kora-muted)] max-w-md mx-auto px-4">
                {filter === "ALL"
                  ? "Create your first treatment plan to get started."
                  : "Try a different filter or create a new plan."}
              </p>
              {filter === "ALL" && (
                <Link
                  href="/therapist/plans/new"
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[color:var(--color-kora-primary)] text-white font-semibold hover:bg-[color:var(--color-kora-dark)] transition-colors"
                >
                  <Icon icon={faPlus} />
                  Create plan
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="p-5 bg-white rounded-lg border border-gray-200 hover:border-[color:var(--color-kora-primary)] transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
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
                      {plan.description && (
                        <p className="mt-1 text-sm text-[color:var(--color-kora-muted)] line-clamp-2">
                          {plan.description}
                        </p>
                      )}
                      <p className="mt-2 text-xs text-[color:var(--color-kora-muted)]">
                        {plan.exercises.length} exercise
                        {plan.exercises.length !== 1 ? "s" : ""} · Started{" "}
                        {new Date(plan.startDate).toLocaleDateString()}
                        {plan.endDate &&
                          ` · Ends ${new Date(plan.endDate).toLocaleDateString()}`}
                      </p>
                    </div>
                    {plan.patient && (
                      <Link
                        href={`/therapist/patients/${plan.patient.id}`}
                        className="text-sm font-medium text-[color:var(--color-kora-primary)] hover:underline whitespace-nowrap self-start md:self-auto"
                      >
                        View patient →
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
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