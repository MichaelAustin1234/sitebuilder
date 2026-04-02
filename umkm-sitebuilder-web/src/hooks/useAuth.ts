"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { User, LoginPayload, RegisterPayload } from "@/lib/types";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthActions {
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}

export function useAuth(): AuthState & AuthActions {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, check if there is a valid session
  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const json = await res.json();
          setUser(json.data.user);
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchMe();
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (!res.ok) {
      // Re-throw so the form can handle validation / auth errors
      throw json;
    }

    setUser(json.data.user);
    router.push("/dashboard");
    router.refresh();
  }, [router]);

  const register = useCallback(async (payload: RegisterPayload) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (!res.ok) {
      throw json;
    }

    setUser(json.data.user);
    router.push("/dashboard");
    router.refresh();
  }, [router]);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
    router.refresh();
  }, [router]);

  return {
    user,
    isLoading,
    isAuthenticated: user !== null,
    login,
    register,
    logout,
  };
}

