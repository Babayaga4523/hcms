"use client";

import { useState, useCallback } from "react";

export interface ApiError {
  message: string;
  status?: number;
}

export interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface UseListResult<T> {
  data: T[];
  pagination: PaginationState;
  loading: boolean;
  error: ApiError | null;
  refetch: () => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
}

export interface UseDetailResult<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  refetch: () => void;
}

export interface UseMutateResult<T, V = unknown> {
  mutate: (data?: V) => Promise<T | null>;
  loading: boolean;
  error: ApiError | null;
  reset: () => void;
}

// Generic list hook
export function useList<T>(
  url: string | (() => string),
  options?: UseApiOptions<T[]>
): UseListResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const getUrl = useCallback(() => {
    return typeof url === "function" ? url() : url;
  }, [url]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(getUrl());
      const result = await response.json();

      if (!response.ok) {
        throw { message: result.error || "Request failed", status: response.status };
      }

      setData(result.data || []);
      if (result.pagination) {
        setPagination(result.pagination);
      }

      options?.onSuccess?.(result.data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      options?.onError?.(apiError);
    } finally {
      setLoading(false);
    }
  }, [getUrl, options]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const setPage = useCallback((page: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", String(page));
    window.history.pushState({}, "", `${window.location.pathname}?${params.toString()}`);
    fetchData();
  }, [fetchData]);

  const setPageSize = useCallback((pageSize: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("pageSize", String(pageSize));
    params.set("page", "1");
    window.history.pushState({}, "", `${window.location.pathname}?${params.toString()}`);
    fetchData();
  }, [fetchData]);

  return {
    data,
    pagination,
    loading,
    error,
    refetch,
    setPage,
    setPageSize,
  };
}

// Generic detail hook
export function useDetail<T>(
  url: () => string | null,
  options?: UseApiOptions<T>
): UseDetailResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchData = useCallback(async () => {
    const currentUrl = url();
    if (!currentUrl) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(currentUrl);
      const result = await response.json();

      if (!response.ok) {
        throw { message: result.error || "Request failed", status: response.status };
      }

      setData(result.data);
      options?.onSuccess?.(result.data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      options?.onError?.(apiError);
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

// Generic mutate hook (create/update)
export function useMutate<T, V = unknown>(
  method: "POST" | "PUT" | "DELETE",
  url: string,
  options?: UseApiOptions<T> & { redirectTo?: string }
): UseMutateResult<T, V> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const mutate = useCallback(
    async (body?: V): Promise<T | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url, {
          method,
          headers: body ? { "Content-Type": "application/json" } : undefined,
          body: body ? JSON.stringify(body) : undefined,
        });

        const result = await response.json();

        if (!response.ok) {
          throw { message: result.error || "Request failed", status: response.status };
        }

        if (options?.redirectTo) {
          window.location.href = options.redirectTo;
        }

        options?.onSuccess?.(result.data);
        return result.data;
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError);
        options?.onError?.(apiError);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [method, url, options]
  );

  const reset = useCallback(() => {
    setError(null);
  }, []);

  return {
    mutate,
    loading,
    error,
    reset,
  };
}

// Hook for building query string
export function useFilters<T extends Record<string, unknown>>() {
  const [filters, setFilters] = useState<T>({} as T);

  const updateFilter = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({} as T);
  }, []);

  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });
    return params.toString();
  }, [filters]);

  return {
    filters,
    setFilters,
    updateFilter,
    clearFilters,
    buildQueryString,
  };
}