const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, token } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    const message = data.message || "Request failed";
    throw new ApiError(response.status, Array.isArray(message) ? message[0] : message);
  }

  return data as T;
}

// Auth types
export interface AuthResponse {
  user: {
    id: string;
    email: string;
    role: "PATIENT" | "THERAPIST";
  };
  token: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  role: "PATIENT" | "THERAPIST";
  fullName: string;
  phoneNumber: string;
  dateOfBirth?: string;
  licenseNumber?: string;
  specialty?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

// Auth API calls
export function register(input: RegisterInput): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: input,
  });
}

export function login(input: LoginInput): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: input,
  });
}

// Treatment plan types
export interface PrescribedExercise {
  id: string;
  name: string;
  description: string | null;
  targetSets: number;
  targetReps: number;
  restSeconds: number;
  frequencyPerWeek: number;
  videoUrl: string | null;
}

export interface TreatmentPlan {
  id: string;
  title: string;
  description: string | null;
  status: "ACTIVE" | "COMPLETED" | "PAUSED";
  startDate: string;
  endDate: string | null;
  exercises: PrescribedExercise[];
  therapist?: {
    id: string;
    fullName: string;
    specialty: string | null;
  };
  patient?: {
    id: string;
    fullName: string;
  };
}

// Authenticated user info
export interface UserInfo {
  id: string;
  email: string;
  role: "PATIENT" | "THERAPIST";
}

export function getMe(token: string): Promise<UserInfo> {
  return apiRequest<UserInfo>("/auth/me", { token });
}

export function getTreatmentPlans(token: string): Promise<TreatmentPlan[]> {
  return apiRequest<TreatmentPlan[]>("/treatment-plans", { token });
}

export function getTreatmentPlan(token: string, id: string): Promise<TreatmentPlan> {
  return apiRequest<TreatmentPlan>(`/treatment-plans/${id}`, { token });
}

// Workout session types
export interface PainLog {
  id: string;
  sessionId: string;
  score: number;
  timing: "PRE" | "POST";
  bodyLocation: string | null;
  createdAt: string;
}

export interface WorkoutSession {
  id: string;
  patientId: string;
  exerciseId: string;
  startedAt: string;
  completedAt: string | null;
  setsCompleted: number | null;
  repsCompleted: number | null;
  durationSeconds: number | null;
  patientNotes: string | null;
  exercise?: {
    id: string;
    name: string;
  };
  painLogs: PainLog[];
}

export interface StartWorkoutInput {
  exerciseId: string;
  prePainScore: number;
  bodyLocation?: string;
}

export interface CompleteWorkoutInput {
  postPainScore: number;
  setsCompleted: number;
  repsCompleted: number;
  durationSeconds: number;
  patientNotes?: string;
  bodyLocation?: string;
}

export function getExerciseById(token: string, exerciseId: string): Promise<PrescribedExercise & { plan: TreatmentPlan }> {
  return apiRequest(`/treatment-plans/exercises/${exerciseId}`, { token });
}

export function startWorkoutSession(token: string, input: StartWorkoutInput): Promise<WorkoutSession> {
  return apiRequest<WorkoutSession>("/workout-sessions", {
    method: "POST",
    body: input,
    token,
  });
}

export function completeWorkoutSession(
  token: string,
  sessionId: string,
  input: CompleteWorkoutInput
): Promise<WorkoutSession> {
  return apiRequest<WorkoutSession>(`/workout-sessions/${sessionId}/complete`, {
    method: "PATCH",
    body: input,
    token,
  });
}