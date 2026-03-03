const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const API_URL = `${API_BASE_URL}/api/auth`;

export interface AuthResponse {
  token: string;
  message?: string;
}

export interface ApiError {
  message: string;
}

async function parseResponseBody(res: Response): Promise<any> {
  const raw = await res.text();
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return { message: raw };
  }
}

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: name, email, password }),
  });

  const data = await parseResponseBody(res);
  if (!res.ok) throw new Error(data.message || "Registration failed");
  if (!data?.token) throw new Error("Registration succeeded but no token was returned");
  return data;
}

export async function loginUser(
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await parseResponseBody(res);
  if (!res.ok) throw new Error(data.message || "Login failed");
  if (!data?.token) throw new Error("Login succeeded but no token was returned");
  return data;
}