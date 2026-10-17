import { mockDoctor } from "../data/mockData";
import type { LoginPayload, LoginResponse } from "../types/auth";

// Mock credentials, remove once the BFF endpoint exists
const MOCK_CREDENTIALS = {
  email: "doctor@sugarcoach.com",
  password: "Password123",
};

export class AuthError extends Error {
  code: "INVALID_CREDENTIALS" | "NETWORK_ERROR";

  constructor(code: AuthError["code"], message: string) {
    super(message);
    this.name = "AuthError";
    this.code = code;
  }
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function loginRequest(
  payload: LoginPayload,
): Promise<LoginResponse> {
  // TODO: replace with POST /api/auth/login on the BFF.
  // The BFF validates the credentials and sets an httpOnly session cookie.
  // The real fetch must use `credentials: 'include'`.
  await delay(800);

  const isValid =
    payload.email.toLowerCase() === MOCK_CREDENTIALS.email &&
    payload.password === MOCK_CREDENTIALS.password;

  if (!isValid) {
    throw new AuthError(
      "INVALID_CREDENTIALS",
      "Correo o contraseña incorrectos",
    );
  }

  return { doctor: mockDoctor };
}

export async function loginWithGoogleRequest(): Promise<LoginResponse> {
  // TODO: replace with the real Google flow through the BFF (OAuth redirect or
  // Firebase popup). The BFF must end up setting the same httpOnly session
  // cookie as the email/password login, and respond with the doctor profile.
  await delay(800)
  return { doctor: mockDoctor }
}

export async function logoutRequest(): Promise<void> {
  // TODO: replace with POST /api/auth/logout (the BFF clears the session cookie)
  await delay(200);
}
