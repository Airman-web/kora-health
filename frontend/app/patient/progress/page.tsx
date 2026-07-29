"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthHeader } from "@/components/AuthHeader";
import { Icon } from "@/components/Icon";
import { faArrowLeft, faChartLine } from "@fortawesome/free-solid-svg-icons";
import { getToken } from "@/lib/auth";
import { getMyPainProgress, PainProgressPoint, ApiError } from "@/lib/api";
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

export default function PatientProgressPage() {
  const router = useRouter();
  const [progress, setProgress] = useState<PainProgressPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    getMyPainProgress(token)
      .then((data) => setProgress(data))
      .catch((err) => {
        if (err instanceof ApiError && err.statusCode === 401) {
          router.push("/login");
        } else {
          setError(err.message || "Failed to load your progress");
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  const chartData = progress.map((p) => ({
    date: new Date(p.date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
    Pre: p.prePain,
    Post: p.postPain,
  }));

  const totalSessions = progress.length;
  const averagePreP =
    progress.length > 0
      ? Math.round(
          (progress.reduce((sum, p) => sum + (p.prePain ?? 0), 0) / progress.length) * 10
        ) / 10
      : 0;
  const averagePostP =
    progress.length > 0
      ? Math.round(
          (progress.reduce((sum, p) => sum + (p.postPain ?? 0), 0) / progress.length) * 10
        ) / 10
      : 0;
  const averageReduction = Math.round((averagePreP - averagePostP) * 10) / 10;

  return (
    <div className="min-h-screen bg-white">
      <AuthHeader role="PATIENT" />

      <main className="container-kora py-8 md:py-12">
        <Link
          href="/patient/dashboard"
          className="inline-flex items-center gap-2 text-sm text-[color:var(--color-kora-muted)] hover:text-[color:var(--color-kora-primary)] mb-4"
        >
          <Icon icon={faArrowLeft} size="xs" />
          Back to dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[color:var(--color-kora-dark)]">
            My progress
          </h1>
          <p className="mt-2 text-sm md:text-base text-[color:var(--color-kora-muted)]">
            See how your pain levels have changed with each workout.
          </p>
        </div>

        {loading && (
          <p className="text-center text-[color:var(--color-kora-muted)]">
            Loading your progress...
          </p>
        )}

        {error && !loading && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {progress.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-gray-300 rounded-lg">
                <Icon
                  icon={faChartLine}
                  size="2xl"
                  className="text-[color:var(--color-kora-muted)] mb-3"
                />
                <p className="text-lg font-medium text-[color:var(--color-kora-dark)]">
                  No workouts logged yet
                </p>
                <p className="mt-2 text-sm text-[color:var(--color-kora-muted)] max-w-md mx-auto px-4">
                  Complete your first workout to start tracking your pain progress.
                </p>
                <Link
                  href="/patient/dashboard"
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[color:var(--color-kora-primary)] text-white font-semibold hover:bg-[color:var(--color-kora-dark)] transition-colors"
                >
                  Go to my exercises
                </Link>
              </div>
            ) : (
              <>
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <div className="p-4 rounded-lg bg-white border border-gray-200">
                    <p className="text-xs text-[color:var(--color-kora-muted)]">Total workouts</p>
                    <p className="text-2xl font-bold text-[color:var(--color-kora-dark)]">
                      {totalSessions}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-white border border-gray-200">
                    <p className="text-xs text-[color:var(--color-kora-muted)]">Average pain before</p>
                    <p className="text-2xl font-bold text-[#d97706]">{averagePreP}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white border border-gray-200">
                    <p className="text-xs text-[color:var(--color-kora-muted)]">Average pain after</p>
                    <p className="text-2xl font-bold text-[color:var(--color-kora-primary)]">
                      {averagePostP}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-white border border-gray-200">
                    <p className="text-xs text-[color:var(--color-kora-muted)]">Average reduction</p>
                    <p className="text-2xl font-bold text-green-600">
                      {averageReduction > 0 ? `−${averageReduction}` : averageReduction}
                    </p>
                  </div>
                </div>

                {/* Chart */}
                <section className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Icon icon={faChartLine} className="text-[color:var(--color-kora-primary)]" />
                    <h2 className="text-lg font-bold text-[color:var(--color-kora-dark)]">
                      Pain over time
                    </h2>
                  </div>

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
                </section>

                {/* Session list */}
                <section>
                  <h2 className="text-lg font-bold text-[color:var(--color-kora-dark)] mb-4">
                    Session details
                  </h2>
                  <div className="space-y-2">
                    {progress
                      .slice()
                      .reverse()
                      .map((session) => (
                        <div
                          key={session.sessionId}
                          className="p-4 bg-white rounded-lg border border-gray-200 flex items-center justify-between gap-4 flex-wrap"
                        >
                          <div>
                            <p className="font-medium text-[color:var(--color-kora-dark)]">
                              {session.exerciseName}
                            </p>
                            <p className="text-xs text-[color:var(--color-kora-muted)]">
                              {new Date(session.date).toLocaleDateString(undefined, {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                          {session.prePain !== null && session.postPain !== null && (
                            <div className="text-sm">
                              <span className="text-[#d97706] font-semibold">{session.prePain}</span>
                              <span className="mx-2 text-gray-400">→</span>
                              <span className="text-[color:var(--color-kora-primary)] font-semibold">
                                {session.postPain}
                              </span>
                              {session.painReduction !== null && session.painReduction > 0 && (
                                <span className="ml-2 text-xs text-green-600 font-medium">
                                  −{session.painReduction}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </section>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}