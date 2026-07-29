"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import {
  faPlus,
  faTrash,
  faArrowLeft,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { getToken } from "@/lib/auth";
import {
  listAllPatients,
  createTreatmentPlan,
  PatientListItem,
  CreateExerciseInput,
  ApiError,
} from "@/lib/api";

interface ExerciseFormRow extends CreateExerciseInput {
  _id: string; // local ID for React keys
}

function makeEmptyExercise(): ExerciseFormRow {
  return {
    _id: crypto.randomUUID(),
    name: "",
    description: "",
    targetSets: 3,
    targetReps: 10,
    restSeconds: 30,
    frequencyPerWeek: 3,
    videoUrl: "",
  };
}

export default function CreateTreatmentPlanPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<PatientListItem[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [patientId, setPatientId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [endDate, setEndDate] = useState("");
  const [exercises, setExercises] = useState<ExerciseFormRow[]>([makeEmptyExercise()]);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    listAllPatients(token)
      .then((data) => setPatients(data))
      .catch((err) => {
        if (err instanceof ApiError && err.statusCode === 401) {
          router.push("/login");
        } else {
          setError(err.message || "Failed to load patients");
        }
      })
      .finally(() => setLoadingPatients(false));
  }, [router]);

  function updateExercise(id: string, field: keyof ExerciseFormRow, value: string | number) {
    setExercises((prev) =>
      prev.map((ex) => (ex._id === id ? { ...ex, [field]: value } : ex))
    );
  }

  function addExercise() {
    setExercises((prev) => [...prev, makeEmptyExercise()]);
  }

  function removeExercise(id: string) {
    if (exercises.length === 1) return;
    setExercises((prev) => prev.filter((ex) => ex._id !== id));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!patientId) {
      setError("Please select a patient");
      return;
    }
    if (exercises.length === 0) {
      setError("Please add at least one exercise");
      return;
    }
    if (exercises.some((ex) => !ex.name.trim())) {
      setError("All exercises must have a name");
      return;
    }

    setSubmitting(true);

    try {
      const token = getToken();
      if (!token) {
        router.push("/login");
        return;
      }

      // Strip local IDs and empty optional fields before sending
      const cleanExercises: CreateExerciseInput[] = exercises.map((ex) => ({
        name: ex.name.trim(),
        description: ex.description?.trim() || undefined,
        targetSets: ex.targetSets,
        targetReps: ex.targetReps,
        restSeconds: ex.restSeconds,
        frequencyPerWeek: ex.frequencyPerWeek,
        videoUrl: ex.videoUrl?.trim() || undefined,
      }));

      await createTreatmentPlan(token, {
        patientId,
        title: title.trim(),
        description: description.trim() || undefined,
        endDate: endDate || undefined,
        exercises: cleanExercises,
      });

      router.push("/therapist/dashboard");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to create treatment plan");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container-kora py-6 md:py-10 max-w-3xl">
      {/* Back link */}
      <Link
        href="/therapist/dashboard"
        className="inline-flex items-center gap-2 text-sm text-[color:var(--color-kora-muted)] hover:text-[color:var(--color-kora-primary)] mb-4"
      >
        <Icon icon={faArrowLeft} size="xs" />
        Back to dashboard
      </Link>

      <h1 className="text-2xl md:text-3xl font-bold text-[color:var(--color-kora-dark)]">
        Create treatment plan
      </h1>
      <p className="mt-2 text-sm text-[color:var(--color-kora-muted)]">
        Choose a patient and add the exercises you're prescribing.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        {/* Plan basics */}
        <section className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
          <h2 className="text-lg font-bold text-[color:var(--color-kora-dark)]">
            Plan details
          </h2>

          <div>
            <label className="block text-sm font-medium text-[color:var(--color-kora-text)]">
              Patient
            </label>
            <PatientPicker
              patients={patients}
              loading={loadingPatients}
              selectedId={patientId}
              onSelect={setPatientId}
            />
            {!loadingPatients && patients.length === 0 && (
              <p className="mt-2 text-sm text-[color:var(--color-kora-muted)]">
                No patients registered yet. Ask a patient to sign up first.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[color:var(--color-kora-text)]">
              Plan title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Post-ACL Rehab Week 1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--color-kora-primary)] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[color:var(--color-kora-text)]">
              Description (optional)
            </label>
            <textarea
              rows={2}
              placeholder="Notes about the treatment approach or goals..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--color-kora-primary)] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[color:var(--color-kora-text)]">
              End date (optional)
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--color-kora-primary)] focus:border-transparent"
            />
            <p className="mt-1 text-xs text-[color:var(--color-kora-muted)]">
              Leave empty for open-ended plans.
            </p>
          </div>
        </section>

        {/* Exercises */}
        <section className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[color:var(--color-kora-dark)]">
              Exercises
            </h2>
            <button
              type="button"
              onClick={addExercise}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[color:var(--color-kora-primary)] hover:bg-[color:var(--color-kora-bg)] transition-colors"
            >
              <Icon icon={faPlus} size="xs" />
              Add exercise
            </button>
          </div>

          <div className="space-y-4">
            {exercises.map((ex, index) => (
              <div
                key={ex._id}
                className="p-4 rounded-lg border border-gray-200 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[color:var(--color-kora-dark)]">
                    Exercise {index + 1}
                  </h3>
                  {exercises.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExercise(ex._id)}
                      className="p-1 text-red-500 hover:text-red-700"
                      aria-label="Remove exercise"
                    >
                      <Icon icon={faTrash} size="xs" />
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-[color:var(--color-kora-muted)]">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Quad Sets"
                    value={ex.name}
                    onChange={(e) => updateExercise(ex._id, "name", e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--color-kora-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[color:var(--color-kora-muted)]">
                    Description (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Instructions or tips for the patient..."
                    value={ex.description || ""}
                    onChange={(e) =>
                      updateExercise(ex._id, "description", e.target.value)
                    }
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--color-kora-primary)]"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[color:var(--color-kora-muted)]">
                      Sets
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={ex.targetSets}
                      onChange={(e) =>
                        updateExercise(ex._id, "targetSets", Number(e.target.value))
                      }
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--color-kora-primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[color:var(--color-kora-muted)]">
                      Reps
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={ex.targetReps}
                      onChange={(e) =>
                        updateExercise(ex._id, "targetReps", Number(e.target.value))
                      }
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--color-kora-primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[color:var(--color-kora-muted)]">
                      Rest (sec)
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={ex.restSeconds}
                      onChange={(e) =>
                        updateExercise(ex._id, "restSeconds", Number(e.target.value))
                      }
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--color-kora-primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[color:var(--color-kora-muted)]">
                      Times/week
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="7"
                      value={ex.frequencyPerWeek || 3}
                      onChange={(e) =>
                        updateExercise(ex._id, "frequencyPerWeek", Number(e.target.value))
                      }
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--color-kora-primary)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[color:var(--color-kora-muted)]">
                    Video demo URL (optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={ex.videoUrl || ""}
                    onChange={(e) => updateExercise(ex._id, "videoUrl", e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--color-kora-primary)]"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Submit */}
        <div className="flex items-center justify-end gap-3">
          <Link
            href="/therapist/dashboard"
            className="px-4 py-2 rounded-lg text-sm font-medium text-[color:var(--color-kora-muted)] hover:text-[color:var(--color-kora-dark)]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting || loadingPatients}
            className="px-6 py-2 rounded-lg bg-[color:var(--color-kora-primary)] text-white font-semibold hover:bg-[color:var(--color-kora-dark)] transition-colors disabled:opacity-50"
          >
            {submitting ? "Creating..." : "Create plan"}
          </button>
        </div>
      </form>
    </div>
  );
}

function PatientPicker({
  patients,
  loading,
  selectedId,
  onSelect,
}: {
  patients: PatientListItem[];
  loading: boolean;
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedPatient = patients.find((p) => p.id === selectedId);

  const filtered = useMemo(() => {
    if (!query.trim()) return patients;
    const q = query.toLowerCase().trim();
    return patients.filter(
      (p) =>
        p.fullName.toLowerCase().includes(q) ||
        p.phoneNumber.includes(q)
    );
  }, [query, patients]);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative mt-1">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        disabled={loading}
        className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg bg-white text-left focus:outline-none focus:ring-2 focus:ring-[color:var(--color-kora-primary)] disabled:opacity-50"
      >
        <span className={selectedPatient ? "text-[color:var(--color-kora-text)]" : "text-gray-400"}>
          {loading
            ? "Loading patients..."
            : selectedPatient
            ? selectedPatient.fullName
            : "Select a patient"}
        </span>
        <Icon icon={faMagnifyingGlass} size="xs" className="text-[color:var(--color-kora-muted)]" />
      </button>

      {open && !loading && (
        <div className="absolute z-20 top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-hidden flex flex-col">
          <div className="p-2 border-b border-gray-100">
            <input
              type="text"
              autoFocus
              placeholder="Search by name or phone..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[color:var(--color-kora-primary)]"
            />
          </div>
          <div className="overflow-y-auto flex-1">
            {filtered.length === 0 ? (
              <p className="p-4 text-sm text-center text-[color:var(--color-kora-muted)]">
                No patients match your search.
              </p>
            ) : (
              <ul>
                {filtered.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelect(p.id);
                        setOpen(false);
                        setQuery("");
                      }}
                      className={`
                        w-full text-left px-4 py-2 hover:bg-[color:var(--color-kora-bg)] transition-colors
                        ${p.id === selectedId ? "bg-[color:var(--color-kora-bg)]" : ""}
                      `}
                    >
                      <p className="text-sm font-medium text-[color:var(--color-kora-dark)]">
                        {p.fullName}
                      </p>
                      <p className="text-xs text-[color:var(--color-kora-muted)]">
                        {p.phoneNumber}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
