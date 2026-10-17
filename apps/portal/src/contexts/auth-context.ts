import { createContext } from "react";
import type { Doctor } from "../types/auth";

export interface AuthContextValue {
  doctor: Doctor | null;
  isAuthenticated: boolean;
  signIn: (doctor: Doctor) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
