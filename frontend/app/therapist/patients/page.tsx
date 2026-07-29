"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { faUsers, faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import { getToken } from "@/lib/auth";
import {
  listAllPatients,
  getTreatmentPlans,
  PatientListItem,
  TreatmentPlan,
  ApiError,
} from "@/lib/api";

interface PatientSummary {
  id: string;
  fullName: string;
  phoneNumber: string;
  totalPlans: number;
  activePlans: number;
  latestPlanTitle: string | null;
}

export default function PatientsListPage() {
  const router = useRouter();
  const [allPatients, setAllPatients] = useState<PatientListItem[]>([]);
  const [plans, setPlans] = useState<TreatmentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    Promise.all([listAllPatients(token), getTreatmentPlans(token)])
      .then(([patientsData, plansData]) => {
        setAllPatients(patientsData);
        setPlans(plansData);
      })
      .catch((err) => {
        if (err instanceof ApiError && err.statusCode === 401) {
          router.push("/login");
        } else {
          setError(err.message || "Failed to load patients");
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  // Merge plan data into every patient
  const patients: PatientSummary[] = useMemo(() => {
    return allPatients.map((p) => {
      const patientPlans = plans.filter((plan) => plan.patient?.id === p.id);
      const activePlans = patientPlans.filter((plan) => plan.status === "ACTIVE");
      return {
        id: p.id,
        fullName: p.fullName,
        phoneNumber: p.phoneNumber,
        totalPlans: patientPlans.length,
        activePlans: activePlans.length,
        latestPlanTitle: patientPlans[0]?.title || null,
      };
    }).sort((a, b) => a.fullName.localeCompare(b.fullName));
  }, [allPatients, plans]);

  // Filter by search
  const filtered = useMemo(() => {
    if (!query.trim()) return patients;
    const q = query.toLowerCase().trim();
    return patients.filter(
      (p) =>
        p.fullName.toLowerCase().includes(q) ||
        p.phoneNumber.includes(q)
    );
  }, [patients, query]);

  return (
    <div className="container-kora py-6 md:py-10">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[color:var(--color-kora-dark)]">
            Patients
          </h1>
          <p className="mt-1 text-sm text-[color:var(--color-kora-muted)]">
            {loading
              ? "Loading..."
              : `${patients.length} registered patient${patients.length !== 1 ? "s" : ""} on the platform`}
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

      {/* Search */}
      {patients.length > 0 && (
        <div className="mb-6 relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--color-kora-muted)]">
            <Icon icon={faMagnifyingGlass} size="sm" />
          </div>
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--color-kora-primary)] focus:border-transparent"
          />
        </div>
      )}

      {loading && (
        <p className="text-center text-[color:var(--color-kora-muted)] py-12">
          Loading patients...
        </p>
      )}

      {error && !loading && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {patients.length === 0 ? (
            <div className="text-center py-16 bg-white border border-dashed border-gray-300 rounded-lg">
              <Icon
                icon={faUsers}
                size="2xl"
                className="text-[color:var(--color-kora-muted)] mb-3"
              />
              <p className="text-lg font-medium text-[color:var(--color-kora-dark)]">
                No patients registered yet
              </p>
              <p className="mt-2 text-sm text-[color:var(--color-kora-muted)] max-w-md mx-auto px-4">
                Once patients sign up on the platform, they'll appear here so you can assign treatment plans to them.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 bg-white border border-dashed border-gray-300 rounded-lg">
              <p className="text-sm text-[color:var(--color-kora-muted)]">
                No patients match "{query}"
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((patient) => (
                <PatientCard key={patient.id} patient={patient} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function PatientCard({ patient }: { patient: PatientSummary }) {
  const initials = patient.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const hasPlans = patient.totalPlans > 0;

  const cardContent = (
    <>
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full bg-[color:var(--color-kora-bg)] flex items-center justify-center text-[color:var(--color-kora-primary)] font-bold text-lg flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[color:var(--color-kora-dark)] truncate">
            {patient.fullName}
          </h3>
          <p className="mt-1 text-xs text-[color:var(--color-kora-muted)] truncate">
            {patient.phoneNumber}
          </p>
          <div className="mt-2 flex items-center gap-2 text-xs text-[color:var(--color-kora-muted)] flex-wrap">
            {hasPlans ? (
              <>
                <span>
                  {patient.totalPlans} plan
                  {patient.totalPlans !== 1 ? "s" : ""}
                </span>
                {patient.activePlans > 0 && (
                  <>
                    <span>·</span>
                    <span className="text-[color:var(--color-kora-primary)] font-medium">
                      {patient.activePlans} active
                    </span>
                  </>
                )}
              </>
            ) : (
              <span className="italic">No plans yet</span>
            )}
          </div>
        </div>
      </div>

      {patient.latestPlanTitle && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <p className="text-xs text-[color:var(--color-kora-muted)]">
            Latest plan
          </p>
          <p className="text-sm font-medium text-[color:var(--color-kora-text)] truncate">
            {patient.latestPlanTitle}
          </p>
        </div>
      )}

      <p className="mt-4 text-sm font-medium text-[color:var(--color-kora-primary)]">
        {hasPlans ? "View patient →" : "Assign a plan →"}
      </p>
    </>
  );

  // Only patients with plans can be viewed via detail page (backend restriction)
  // For patients without plans, link to the create plan page instead
  return hasPlans ? (
    <Link
      href={`/therapist/patients/${patient.id}`}
      className="block p-5 bg-white rounded-lg border border-gray-200 hover:border-[color:var(--color-kora-primary)] hover:shadow-sm transition-all"
    >
      {cardContent}
    </Link>
  ) : (
    <Link
      href={`/therapist/plans/new?patientId=${patient.id}`}
      className="block p-5 bg-white rounded-lg border border-gray-200 hover:border-[color:var(--color-kora-primary)] hover:shadow-sm transition-all"
    >
      {cardContent}
    </Link>
  );
}
