"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import {
  faArrowLeft,
  faPhone,
  faCakeCandles,
  faCalendarDays,
  faDumbbell,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";
import { getToken } from "@/lib/auth";
import {
  getPatientDetail,
  getPainProgress,
  PatientDetailResponse,
  PainProgressPoint,
  ApiError,
} from "@/lib/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function PatientDetailPage() {
  const router = useRouter();
  const params = useParams();
  const patientId = params.id as string;

  const [data, setData] = useState<PatientDetailResponse | null>(null);
  const [painProgress, setPainProgress] = useState<PainProgressPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    Promise.all([
      getPatientDetail(token, patientId),
      getPainProgress(token, patientId).catch(() => [] as PainProgressPoint[]),
    ])
      .then(([detail, progress]) => {
        setData(detail);
        setPainProgress(progress);
      })
      .catch((err) => {
        if (err instanceof ApiError && err.statusCode === 401) {
          router.push("/login");
        } else {
          setError(err.message || "Failed to load patient");
        }
      })
      .finally(() => setLoading(false));
  }, [patientId, router]);

  function calculateAge(dateOfBirth: string): number {
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  }

  if (loading) {
    return (
      <div className="container-kora py-6 md:py-10">
        <p className="text-center text-[color:var(--color-kora-muted)]">
          Loading patient details...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container-kora py-6 md:py-10">
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {error || "Patient not found"}
        </div>
        <Link
          href="/therapist/dashboard"
          className="mt-4 inline-flex items-center gap-2 text-sm text-[color:var(--color-kora-primary)] hover:underline"
        >
          <Icon icon={faArrowLeft} size="xs" />
          Back to dashboard
        </Link>
      </div>
    );
  }

  const { patient, plans, sessions } = data;
  const activePlans = plans.filter((p) => p.status === "ACTIVE");
  const completedPlans = plans.filter((p) => p.status === "COMPLETED");
  const completedSessions = sessions.filter((s) => s.completedAt !== null);

  // Prepare chart data
  const chartData = painProgress.map((p) => ({
    date: new Date(p.date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
    Pre: p.prePain,
    Post: p.postPain,
  }));

  return (
    <div className="container-kora py-6 md:py-10">
      {/* Back link */}
      <Link
        href="/therapist/dashboard"
        className="inline-flex items-center gap-2 text-sm text-[color:var(--color-kora-muted)] hover:text-[color:var(--color-kora-primary)] mb-4"
      >
        <Icon icon={faArrowLeft} size="xs" />
        Back to dashboard
      </Link>

      {/* Patient header */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[color:var(--color-kora-dark)]">
          {patient.fullName}
        </h1>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2 text-[color:var(--color-kora-muted)]">
            <Icon icon={faCakeCandles} className="w-4" />
            <span>
              {calculateAge(patient.dateOfBirth)} years old
            </span>
          </div>
          <div className="flex items-center gap-2 text-[color:var(--color-kora-muted)]">
            <Icon icon={faPhone} className="w-4" />
            <span>{patient.phoneNumber}</span>
          </div>
          <div className="flex items-center gap-2 text-[color:var(--color-kora-muted)]">
            <Icon icon={faCalendarDays} className="w-4" />
            <span>
              Patient since{" "}
              {new Date(patient.createdAt).toLocaleDateString(undefined, {
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {patient.medicalHistory && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs font-medium text-[color:var(--color-kora-muted)] uppercase">
              Medical history
            </p>
            <p className="mt-1 text-sm text-[color:var(--color-kora-text)]">
              {patient.medicalHistory}
            </p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 rounded-lg bg-white border border-gray-200">
          <p className="text-xs text-[color:var(--color-kora-muted)]">Active plans</p>
          <p className="text-2xl font-bold text-[color:var(--color-kora-dark)]">
            {activePlans.length}
          </p>
        </div>
        <div className="p-4 rounded-lg bg-white border border-gray-200">
          <p className="text-xs text-[color:var(--color-kora-muted)]">Completed plans</p>
          <p className="text-2xl font-bold text-[color:var(--color-kora-dark)]">
            {completedPlans.length}
          </p>
        </div>
        <div className="p-4 rounded-lg bg-white border border-gray-200">
          <p className="text-xs text-[color:var(--color-kora-muted)]">Total workouts</p>
          <p className="text-2xl font-bold text-[color:var(--color-kora-dark)]">
            {completedSessions.length}
          </p>
        </div>
      </div>

      {/* Pain progress chart */}
      <section className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Icon icon={faChartLine} className="text-[color:var(--color-kora-primary)]" />
          <h2 className="text-lg font-bold text-[color:var(--color-kora-dark)]">
            Pain progress
          </h2>
        </div>

        {chartData.length === 0 ? (
          <p className="text-sm text-[color:var(--color-kora-muted)] py-8 text-center">
            No completed workouts yet. The pain chart will appear after the patient
            completes their first session.
          </p>
        ) : (
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12, fill: "#64748b" }}
                />
                <YAxis
                  domain={[0, 10]}
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  label={{ value: "Pain (0-10)", angle: -90, position: "insideLeft", fill: "#64748b", fontSize: 12 }}
                />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Pre"
                  stroke="#d97706"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="Post"
                  stroke="#0d9488"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {chartData.length > 0 && (
          <div className="mt-4 flex items-center gap-6 text-xs text-[color:var(--color-kora-muted)] flex-wrap">
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-[#d97706]" />
              Pain before workout
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-[#0d9488]" />
              Pain after workout
            </div>
          </div>
        )}
      </section>

      {/* Active plans */}
      {activePlans.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-[color:var(--color-kora-dark)] mb-4">
            Active treatment plans
          </h2>
          <div className="space-y-4">
            {activePlans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </section>
      )}

      {/* Recent workouts */}
      {completedSessions.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Icon icon={faDumbbell} className="text-[color:var(--color-kora-primary)]" />
            <h2 className="text-lg font-bold text-[color:var(--color-kora-dark)]">
              Recent workouts
            </h2>
          </div>
          <div className="space-y-2">
            {completedSessions.slice(0, 10).map((session) => {
              const prePain = session.painLogs.find((p) => p.timing === "PRE")?.score;
              const postPain = session.painLogs.find((p) => p.timing === "POST")?.score;
              return (
                <div
                  key={session.id}
                  className="p-4 bg-white rounded-lg border border-gray-200 flex items-center justify-between gap-4 flex-wrap"
                >
                  <div>
                    <p className="font-medium text-[color:var(--color-kora-dark)]">
                      {session.exercise?.name || "Unknown exercise"}
                    </p>
                    <p className="text-xs text-[color:var(--color-kora-muted)]">
                      {new Date(session.startedAt).toLocaleDateString()} ·{" "}
                      {session.setsCompleted} sets ·{" "}
                      {session.repsCompleted} reps
                    </p>
                  </div>
                  {prePain !== undefined && postPain !== undefined && (
                    <div className="text-sm">
                      <span className="text-[#d97706] font-semibold">{prePain}</span>
                      <span className="mx-2 text-gray-400">→</span>
                      <span className="text-[color:var(--color-kora-primary)] font-semibold">
                        {postPain}
                      </span>
                      {postPain < prePain && (
                        <span className="ml-2 text-xs text-green-600 font-medium">
                          −{prePain - postPain}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Completed plans */}
      {completedPlans.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-[color:var(--color-kora-dark)] mb-4">
            Past treatment plans
          </h2>
          <div className="space-y-2">
            {completedPlans.map((plan) => (
              <div
                key={plan.id}
                className="p-3 bg-white rounded-lg border border-gray-200 text-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-[color:var(--color-kora-dark)]">
                    {plan.title}
                  </span>
                  <span className="text-xs text-[color:var(--color-kora-muted)]">
                    {plan.exercises.length} exercises
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// Inline helper
function PlanCard({ plan }: { plan: PatientDetailResponse["plans"][0] }) {
  return (
    <div className="p-5 bg-white rounded-lg border border-gray-200">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <h3 className="font-semibold text-[color:var(--color-kora-dark)]">
            {plan.title}
          </h3>
          {plan.description && (
            <p className="mt-1 text-sm text-[color:var(--color-kora-muted)]">
              {plan.description}
            </p>
          )}
        </div>
        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-[color:var(--color-kora-bg)] text-[color:var(--color-kora-dark)] whitespace-nowrap">
          {plan.status}
        </span>
      </div>

      <div className="pt-3 border-t border-gray-100">
        <p className="text-xs font-medium text-[color:var(--color-kora-muted)] uppercase mb-2">
          Exercises ({plan.exercises.length})
        </p>
        <ul className="space-y-1">
          {plan.exercises.map((ex) => (
            <li
              key={ex.id}
              className="text-sm text-[color:var(--color-kora-text)] flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--color-kora-primary)]" />
              {ex.name}
              <span className="text-xs text-[color:var(--color-kora-muted)]">
                {ex.targetSets}×{ex.targetReps}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}