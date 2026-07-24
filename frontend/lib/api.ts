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
