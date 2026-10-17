import { mockDoctor } from "../data/mockData";

// TODO: replace with the real Doctor type when the backend contract exists
export type Doctor = typeof mockDoctor;

export interface LoginPayload {
  email: string;
  password: string;
}

// The BFF sets the session as an httpOnly cookie, so no token in the body
export interface LoginResponse {
  doctor: Doctor;
}
