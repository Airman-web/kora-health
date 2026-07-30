"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Logo } from "@/components/Logo";
import { Icon } from "@/components/Icon";
import {
  faEye,
  faEyeSlash,
  faArrowLeft,
  faShieldHalved,
  faStethoscope,
} from "@fortawesome/free-solid-svg-icons";
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
  const [showConfirm, setShowConfirm] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [specialty, setSpecialty] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
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
      if (err instanceof ApiError) setError(err.message);
      else setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left column — brand imagery (hidden on mobile) */}
      <aside className="hidden lg:flex lg:w-1/2 xl:w-2/5 relative bg-kora-dark">
        <Image
          src="/images/kora-1.jpg"
          alt="Physiotherapy in practice"
          fill
          priority
          sizes="40vw"
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-kora-dark/70 via-kora-dark/40 to-kora-primary/30" />

        {/* Content on top of image */}
        <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14 text-white w-full">
          <Logo size="lg" href="/" />

          <div className="max-w-md">
            <h2 className="text-3xl xl:text-4xl font-bold leading-tight tracking-tight">
              Recovery guided by real physiotherapists.
            </h2>
            <p className="mt-4 text-white/85 leading-relaxed">
              Kora connects patients across Rwanda with licensed therapists.
              Prescribed plans, measured pain, and evidence that treatment is
              working, all in one place.
            </p>

            <ul className="mt-8 space-y-4">
              <li className="flex items-start gap-3">
                <div className="mt-1 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Icon icon={faStethoscope} size="sm" />
                </div>
                <div>
                  <p className="font-semibold">Licensed clinicians</p>
                  <p className="text-sm text-white/75">
                    Every therapist is registered with the Rwandan physiotherapy
                    board.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Icon icon={faShieldHalved} size="sm" />
                </div>
                <div>
                  <p className="font-semibold">Private and secure</p>
                  <p className="text-sm text-white/75">
                    Your records are visible only to you and the therapists you
                    work with.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <p className="text-sm text-white/60">
            © {new Date().getFullYear()} Kora Health · Kigali, Rwanda
          </p>
        </div>
      </aside>

      {/* Right column — form */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <header className="lg:hidden border-b border-kora">
          <div className="container-kora py-4 flex items-center justify-between">
            <Logo size="md" href="/" />
            <Link href="/" className="text-sm text-kora-muted hover:text-kora-primary">
              <Icon icon={faArrowLeft} size="xs" className="mr-1" />
              Home
            </Link>
          </div>
        </header>

        {/* Desktop back link */}
        <div className="hidden lg:block absolute top-6 right-6">
          <Link
            href="/"
            className="text-sm text-kora-muted hover:text-kora-primary inline-flex items-center gap-1"
          >
            <Icon icon={faArrowLeft} size="xs" />
            Back to home
          </Link>
        </div>

        <main className="flex-1 flex items-start lg:items-center justify-center px-5 md:px-10 py-10 md:py-14 overflow-y-auto">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-bold text-kora-dark tracking-tight">
              Create your account
            </h1>
            <p className="mt-2 text-kora-muted">
              Sign up as a patient or a therapist.
            </p>

            {/* Role selector */}
            <div className="mt-6 flex rounded-lg border border-kora p-1 bg-kora-surface-alt">
              <button
                type="button"
                onClick={() => setRole("PATIENT")}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                  role === "PATIENT"
                    ? "bg-white text-kora-primary shadow-sm"
                    : "text-kora-muted"
                }`}
              >
                I'm a Patient
              </button>
              <button
                type="button"
                onClick={() => setRole("THERAPIST")}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                  role === "THERAPIST"
                    ? "bg-white text-kora-primary shadow-sm"
                    : "text-kora-muted"
                }`}
              >
                I'm a Therapist
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="label-kora">Full name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="input-kora"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="label-kora">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-kora"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="label-kora">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-kora pr-10"
                    placeholder="At least 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-kora-soft hover:text-kora-primary"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <Icon icon={showPassword ? faEyeSlash : faEye} size="sm" />
                  </button>
                </div>
              </div>

              <div>
                <label className="label-kora">Confirm password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-kora pr-10"
                    placeholder="Repeat your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-kora-soft hover:text-kora-primary"
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                  >
                    <Icon icon={showConfirm ? faEyeSlash : faEye} size="sm" />
                  </button>
                </div>
              </div>

              <div>
                <label className="label-kora">Phone number</label>
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="input-kora"
                  placeholder="+250 788 000 000"
                />
              </div>

              {role === "PATIENT" && (
                <div>
                  <label className="label-kora">Date of birth</label>
                  <input
                    type="date"
                    required
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="input-kora"
                  />
                </div>
              )}

              {role === "THERAPIST" && (
                <>
                  <div>
                    <label className="label-kora">License number</label>
                    <input
                      type="text"
                      required
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      className="input-kora"
                      placeholder="RW-PHYS-XXX"
                    />
                  </div>
                  <div>
                    <label className="label-kora">Specialty (optional)</label>
                    <input
                      type="text"
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      className="input-kora"
                      placeholder="e.g. Sports rehabilitation"
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
                className="btn-primary w-full disabled:opacity-50"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>

            <p className="mt-6 text-sm text-center text-kora-muted">
              Already have an account?{" "}
              <Link href="/login" className="text-kora-primary font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
