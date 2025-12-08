"use client";

import { useState, useCallback } from "react";
import axios, { AxiosError } from "axios";

interface UseFetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  onSuccess?: (data: unknown) => void;
  onError?: (error: AxiosError) => void;
}

/**
 * Hook para hacer peticiones HTTP
 */
export function useFetch<T>(
  url: string,
  options: UseFetchOptions = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AxiosError | null>(null);

  const execute = useCallback(
    async (body?: unknown) => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios({
          url,
          method: options.method || "GET",
          data: body,
          headers: options.headers,
        });

        setData(response.data);
        options.onSuccess?.(response.data);
        return response.data;
      } catch (err) {
        const axiosError = err as AxiosError;
        setError(axiosError);
        options.onError?.(axiosError);
        throw axiosError;
      } finally {
        setLoading(false);
      }
    },
    [url, options]
  );

  return { data, loading, error, execute };
}
