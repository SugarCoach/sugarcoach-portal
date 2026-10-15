import { useCallback, useMemo, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "./auth-context";
import { logoutRequest } from "../services/authService";
import type { Doctor } from "../types/auth";

// TODO: remove this temporary persistence. With the BFF, restore the session
// by querying GET /api/auth/me (the cookie travels automatically).
const MOCK_SESSION_KEY = "sc_mock_doctor";

function readStoredDoctor(): Doctor | null {
  try {
    const raw = sessionStorage.getItem(MOCK_SESSION_KEY);
    return raw ? (JSON.parse(raw) as Doctor) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [doctor, setDoctor] = useState<Doctor | null>(readStoredDoctor);

  const signIn = useCallback((doctor: Doctor) => {
    sessionStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(doctor));
    setDoctor(doctor);
  }, []);

  const logout = useCallback(() => {
    void logoutRequest();
    sessionStorage.removeItem(MOCK_SESSION_KEY);
    setDoctor(null);
    queryClient.clear(); // don't leave one doctor's cached patient data around
  }, [queryClient]);

  const value = useMemo(
    () => ({ doctor, isAuthenticated: doctor !== null, signIn, logout }),
    [doctor, signIn, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
