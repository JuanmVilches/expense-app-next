"use client";

import { useSession } from "next-auth/react";
import type { UserSession } from "@/app/types";

/**
 * Hook para obtener la sesión del usuario autenticado
 * @returns Usuario autenticado o null si no está logueado
 */
export function useAuth() {
  const { data: session, status } = useSession();

  return {
    user: (session as UserSession | null)?.user || null,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    status,
  };
}
