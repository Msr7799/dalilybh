"use client";

import { auth, googleProvider } from "@/lib/firebase";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      error,
      signInWithGoogle: async () => {
        setError(null);
        try {
          await signInWithPopup(auth, googleProvider);
        } catch (e: any) {
          const code = typeof e?.code === "string" ? e.code : "auth/unknown";
          const message =
            typeof e?.message === "string" ? e.message : String(e);
          const friendly = `${code}: ${message}`;
          setError(friendly);
          throw new Error(friendly);
        }
      },
      logout: async () => {
        setError(null);
        try {
          await signOut(auth);
        } catch (e: any) {
          const code = typeof e?.code === "string" ? e.code : "auth/unknown";
          const message =
            typeof e?.message === "string" ? e.message : String(e);
          const friendly = `${code}: ${message}`;
          setError(friendly);
          throw new Error(friendly);
        }
      },
    }),
    [user, loading, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
