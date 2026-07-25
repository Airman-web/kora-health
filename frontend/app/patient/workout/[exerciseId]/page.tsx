"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { AuthHeader } from "@/components/AuthHeader";
import { getToken } from "@/lib/auth";
import {
  getExerciseById,
  startWorkoutSession,
  completeWorkoutSession,
  PrescribedExercise,
  ApiError,
} from "@/lib/api";

type Phase = "loading" | "pre-pain" | "active" | "post-pain" | "summary" | "error";

export default function WorkoutPage() {
  const router = useRouter();
  const params = useParams();
  const exerciseId = params.exerciseId as string;

  const [phase, setPhase] = useState<Phase>("loading");
  const [error, setError] = useState<string | null>(null);
  const [exercise, setExercise] = useState<PrescribedExercise | null>(null);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [prePainScore, setPrePainScore] = useState<number>(5);
  const [postPainScore, setPostPainScore] = useState<number>(5);
  const [setsCompleted, setSetsCompleted] = useState<number>(0);
  const [repsCompleted, setRepsCompleted] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");
  const [bodyLocation, setBodyLocation] = useState<string>("");

  // Timer state
  const [seconds, setSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    getExerciseById(token, exerciseId)
      .then((data) => {
        setExercise(data);
        setSetsCompleted(data.targetSets);
        setRepsCompleted(data.targetReps);
        setPhase("pre-pain");
      })
      .catch((err) => {
        if (err instanceof ApiError && err.statusCode === 401) {
          router.push("/login");
        } else {
          setError(err.message || "Failed to load exercise");
          setPhase("error");
        }
      });
  }, [exerciseId, router]);

  // Timer logic
  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerRunning]);

  function formatTime(totalSeconds: number): string {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  async function handleStartWorkout() {
    const token = getToken();
    if (!token || !exercise) return;

    try {
      const session = await startWorkoutSession(token, {
        exerciseId: exercise.id,
        prePainScore,
        bodyLocation: bodyLocation || undefined,
      });
      setSessionId(session.id);
      setPhase("active");
      setTimerRunning(true);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  function handleFinishWorkout() {
    setTimerRunning(false);
    setPhase("post-pain");
  }

  async function handleCompleteWorkout() {
    const token = getToken();
    if (!token || !sessionId) return;

    try {
      await completeWorkoutSession(token, sessionId, {
        postPainScore,
        setsCompleted,
        repsCompleted,
        durationSeconds: seconds,
        patientNotes: notes || undefined,
        bodyLocation: bodyLocation || undefined,
      });
      setPhase("summary");
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <AuthHeader role="PATIENT" />

      <main className="container-kora py-8 md:py-12 max-w-2xl">
        {phase === "loading" && (
          <p className="text-center text-[color:var(--color-kora-muted)]">
            Loading exercise...
          </p>
        )}

        {phase === "error" && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
            {error}
            <button
              onClick={() => router.push("/patient/dashboard")}
              className="ml-4 underline"
            >
              Back to dashboard
            </button>
          </div>
        )}

        {/* Phase: Pre-pain input */}
        {phase === "pre-pain" && exercise && (
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[color:var(--color-kora-dark)]">
              {exercise.name}
            </h1>
            {exercise.description && (
              <p className="mt-2 text-sm md:text-base text-[color:var(--color-kora-muted)]">
                {exercise.description}
              </p>
            )}

            <div className="mt-6 flex gap-4 text-sm text-[color:var(--color-kora-muted)]">
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

            <div className="mt-8 p-6 rounded-lg bg-[color:var(--color-kora-bg)]">
              <h2 className="text-lg font-semibold text-[color:var(--color-kora-dark)]">
                Before you start
              </h2>
              <p className="mt-1 text-sm text-[color:var(--color-kora-muted)]">
                Rate your current pain level from 0 (no pain) to 10 (worst possible pain).
              </p>

              <div className="mt-6">
                <div className="flex justify-between text-xs text-[color:var(--color-kora-muted)] mb-2">
                  <span>No pain</span>
                  <span>Worst pain</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={prePainScore}
                  onChange={(e) => setPrePainScore(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-center mt-2 text-3xl font-bold text-[color:var(--color-kora-primary)]">
                  {prePainScore}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-[color:var(--color-kora-text)]">
                  Where is the pain? (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. left knee"
                  value={bodyLocation}
                  onChange={(e) => setBodyLocation(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--color-kora-primary)]"
                />
              </div>
            </div>

            <button
              onClick={handleStartWorkout}
              className="mt-6 w-full py-3 rounded-lg bg-[color:var(--color-kora-primary)] text-white font-semibold hover:bg-[color:var(--color-kora-dark)] transition-colors"
            >
              Start workout
            </button>
          </div>
        )}

        {/* Phase: Active workout */}
        {phase === "active" && exercise && (
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[color:var(--color-kora-dark)]">
              {exercise.name}
            </h1>

            <div className="mt-8 p-8 rounded-lg bg-[color:var(--color-kora-bg)] text-center">
              <p className="text-sm font-medium text-[color:var(--color-kora-muted)]">
                Time elapsed
              </p>
              <div className="mt-2 text-6xl md:text-7xl font-bold text-[color:var(--color-kora-dark)] tabular-nums">
                {formatTime(seconds)}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 text-center">
              <div className="p-4 rounded-lg border border-gray-200">
                <p className="text-xs text-[color:var(--color-kora-muted)]">Target sets</p>
                <p className="text-2xl font-bold text-[color:var(--color-kora-dark)]">
                  {exercise.targetSets}
                </p>
              </div>
              <div className="p-4 rounded-lg border border-gray-200">
                <p className="text-xs text-[color:var(--color-kora-muted)]">Target reps</p>
                <p className="text-2xl font-bold text-[color:var(--color-kora-dark)]">
                  {exercise.targetReps}
                </p>
              </div>
            </div>

            <button
              onClick={handleFinishWorkout}
              className="mt-6 w-full py-3 rounded-lg bg-[color:var(--color-kora-primary)] text-white font-semibold hover:bg-[color:var(--color-kora-dark)] transition-colors"
            >
              Finish workout
            </button>
          </div>
        )}

        {/* Phase: Post-pain input */}
        {phase === "post-pain" && exercise && (
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[color:var(--color-kora-dark)]">
              Great work!
            </h1>
            <p className="mt-2 text-sm md:text-base text-[color:var(--color-kora-muted)]">
              You completed {exercise.name} in {formatTime(seconds)}. Let's log how it went.
            </p>

            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[color:var(--color-kora-text)]">
                    Sets completed
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={setsCompleted}
                    onChange={(e) => setSetsCompleted(Number(e.target.value))}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--color-kora-primary)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[color:var(--color-kora-text)]">
                    Reps completed
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={repsCompleted}
                    onChange={(e) => setRepsCompleted(Number(e.target.value))}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--color-kora-primary)]"
                  />
                </div>
              </div>

              <div className="p-6 rounded-lg bg-[color:var(--color-kora-bg)]">
                <label className="block text-sm font-medium text-[color:var(--color-kora-text)]">
                  Rate your pain now (0-10)
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={postPainScore}
                  onChange={(e) => setPostPainScore(Number(e.target.value))}
                  className="mt-4 w-full"
                />
                <div className="text-center mt-2 text-3xl font-bold text-[color:var(--color-kora-primary)]">
                  {postPainScore}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[color:var(--color-kora-text)]">
                  Any notes? (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Felt tight at first, better by the end..."
                  rows={3}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--color-kora-primary)]"
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                onClick={handleCompleteWorkout}
                className="w-full py-3 rounded-lg bg-[color:var(--color-kora-primary)] text-white font-semibold hover:bg-[color:var(--color-kora-dark)] transition-colors"
              >
                Save workout
              </button>
            </div>
          </div>
        )}

        {/* Phase: Summary */}
        {phase === "summary" && exercise && (
          <div className="text-center py-8 md:py-12">
            <div className="inline-block p-4 rounded-full bg-[color:var(--color-kora-bg)] mb-4">
              <div className="w-12 h-12 rounded-full bg-[color:var(--color-kora-primary)] flex items-center justify-center text-white text-2xl font-bold">
                ✓
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[color:var(--color-kora-dark)]">
              Workout logged
            </h1>
            <p className="mt-2 text-sm md:text-base text-[color:var(--color-kora-muted)]">
              Your pain went from <strong>{prePainScore}</strong> to{" "}
              <strong>{postPainScore}</strong>
              {postPainScore < prePainScore && ` — that's a reduction of ${prePainScore - postPainScore}`}
              .
            </p>
            <button
              onClick={() => router.push("/patient/dashboard")}
              className="mt-8 px-6 py-3 rounded-lg bg-[color:var(--color-kora-primary)] text-white font-semibold hover:bg-[color:var(--color-kora-dark)] transition-colors"
            >
              Back to dashboard
            </button>
          </div>
        )}
      </main>
    </div>
  );
}