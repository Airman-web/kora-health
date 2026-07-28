"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Icon } from "@/components/Icon";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { register, ApiError } from "@/lib/api";

type Role = "PATIENT" | "THERAPIST";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("PATIENT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [specialty, setSpecialty] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        email,
        password,
        role,
        fullName,
        phoneNumber,
        ...(role === "PATIENT" ? { dateOfBirth } : {}),
        ...(role === "THERAPIST" ? { licenseNumber, specialty } : {}),
      };

      const response = await register(payload);

      localStorage.setItem("kora_token", response.token);
      localStorage.setItem("kora_user", JSON.stringify(response.user));

      if (response.user.role === "PATIENT") {
        router.push("/patient/dashboard");
      } else {
        router.push("/therapist/dashboard");
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="container-kora py-4">
          <Link href="/">
            <Logo size="md" />
          </Link>
        </div>
      </header>

      <main className="container-kora py-8 md:py-12 max-w-lg">
        <h1 className="text-2xl md:text-3xl font-bold text-[color:var(--color-kora-dark)]">
          Create your Kora Health account
        </h1>
        <p className="mt-2 text-sm md:text-base text-[color:var(--color-kora-muted)]">
          Sign up as a patient or a therapist to get started.
        </p>

        <div className="mt-6 md:mt-8 flex rounded-lg border border-gray-200 p-1 bg-gray-50">
          <button
            type="button"
            onClick={() => setRole("PATIENT")}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
              role === "PATIENT"
                ? "bg-white text-[color:var(--color-kora-primary)] shadow-sm"
                : "text-gray-600"
            }`}
          >
            I'm a Patient
          </button>
          <button
            type="button"
            onClick={() => setRole("THERAPIST")}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
              role === "THERAPIST"
                ? "bg-white text-[color:var(--color-kora-primary)] shadow-sm"
                : "text-gray-600"
            }`}
          >
            I'm a Therapist
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 md:mt-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[color:var(--color-kora-text)]">
              Full name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--color-kora-primary)] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[color:var(--color-kora-text)]">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--color-kora-primary)] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[color:var(--color-kora-text)]">
              Password
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--color-kora-primary)] focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[color:var(--color-kora-muted)] hover:text-[color:var(--color-kora-primary)]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <Icon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            <p className="mt-1 text-xs text-[color:var(--color-kora-muted)]">
              At least 8 characters.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[color:var(--color-kora-text)]">
              Confirm password
            </label>
            <div className="relative mt-1">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--color-kora-primary)] focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[color:var(--color-kora-muted)] hover:text-[color:var(--color-kora-primary)]"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                <Icon icon={showConfirmPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[color:var(--color-kora-text)]">
              Phone number
            </label>
            <input
              type="tel"
              required
              placeholder="+250788000000"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--color-kora-primary)] focus:border-transparent"
            />
          </div>

          {role === "PATIENT" && (
            <div>
              <label className="block text-sm font-medium text-[color:var(--color-kora-text)]">
                Date of birth
              </label>
              <input
                type="date"
                required
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--color-kora-primary)] focus:border-transparent"
              />
            </div>
          )}

          {role === "THERAPIST" && (
            <>
              <div>
                <label className="block text-sm font-medium text-[color:var(--color-kora-text)]">
                  License number
                </label>
                <input
                  type="text"
                  required
                  placeholder="RW-PHYS-XXX"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--color-kora-primary)] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[color:var(--color-kora-text)]">
                  Specialty (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sports Rehab"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--color-kora-primary)] focus:border-transparent"
                />
              </div>
            </>
          )}

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-[color:var(--color-kora-primary)] text-white font-semibold hover:bg-[color:var(--color-kora-dark)] transition-colors disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-[color:var(--color-kora-muted)]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[color:var(--color-kora-primary)] font-semibold hover:underline"
          >
            Sign in
          </Link>
        </p>
      </main>
    </div>
  );
}
