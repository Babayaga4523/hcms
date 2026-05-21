"use client";

import { useState, useCallback, useEffect } from "react";

// ============ Types ============
export interface ApiError {
  message: string;
  status?: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: PaginationState;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
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

// ============ Default pagination state ============
const defaultPagination: PaginationState = {
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0,
};

// ============ API Fetch Helper with Auth ============
async function apiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    credentials: "include", // Include cookies for NextAuth
  });

  const result = await response.json();

  if (!response.ok) {
    // Handle 401 Unauthorized - redirect to login
    if (response.status === 401) {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    throw {
      message: result.error || result.message || "Request failed",
      status: response.status,
    };
  }

  return result;
}

// ============ Generic list hook ============
export function useList<T>(
  url: string | (() => string),
  options?: UseApiOptions<T[]>
): UseListResult<T> & { filter: (key: string, value: string | number | null) => void } {
  const [data, setData] = useState<T[]>([]);
  const [pagination, setPagination] = useState<PaginationState>(defaultPagination);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [params, setParams] = useState<URLSearchParams>(new URLSearchParams());

  const getUrl = useCallback(() => {
    const baseUrl = typeof url === "function" ? url() : url;
    const queryString = params.toString();
    return queryString ? `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}${queryString}` : baseUrl;
  }, [url, params]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiFetch<T[]>(getUrl());

      setData(result.data || []);
      if (result.pagination) {
        setPagination(result.pagination);
      }

      options?.onSuccess?.(result.data as T[]);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      options?.onError?.(apiError);
    } finally {
      setLoading(false);
    }
  }, [getUrl, options]);

  // Initial fetch and refetch when URL or params change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const setPage = useCallback((page: number) => {
    setParams((prev) => {
      const newParams = new URLSearchParams(prev.toString());
      newParams.set("page", String(page));
      return newParams;
    });
  }, []);

  const setPageSize = useCallback((pageSize: number) => {
    setParams((prev) => {
      const newParams = new URLSearchParams(prev.toString());
      newParams.set("pageSize", String(pageSize));
      newParams.set("page", "1");
      return newParams;
    });
  }, []);

  const filter = useCallback((key: string, value: string | number | null) => {
    setParams((prev) => {
      const newParams = new URLSearchParams(prev.toString());
      if (value === null || value === "" || value === undefined) {
        newParams.delete(key);
      } else {
        newParams.set(key, String(value));
      }
      newParams.set("page", "1"); // Reset to page 1 on filter
      return newParams;
    });
  }, []);

  return {
    data,
    pagination,
    loading,
    error,
    refetch,
    setPage,
    setPageSize,
    filter,
  };
}

// ============ Generic detail hook ============
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
      const result = await apiFetch<T>(currentUrl);
      setData(result.data as T);
      options?.onSuccess?.(result.data as T);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      options?.onError?.(apiError);
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  // Auto fetch when URL changes
  useEffect(() => {
    if (url()) {
      fetchData();
    }
  }, [url, fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

// ============ Generic mutate hook (create/update/delete) ============
export function useMutate<T, V = unknown>(
  method: "POST" | "PUT" | "PATCH" | "DELETE",
  url: string,
  options?: UseApiOptions<T> & {
    redirectTo?: string;
    invalidateUrls?: string[];
    onMutate?: () => void;
  }
): UseMutateResult<T, V> & { isSuccess: boolean; clearSuccess: () => void } {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const mutate = useCallback(
    async (body?: V): Promise<T | null> => {
      setLoading(true);
      setError(null);
      setIsSuccess(false);

      try {
        const result = await apiFetch<T>(url, {
          method,
          body: body ? JSON.stringify(body) : undefined,
        });

        setIsSuccess(true);
        options?.onSuccess?.(result.data as T);

        // Redirect if specified
        if (options?.redirectTo) {
          window.location.href = options.redirectTo;
        }

        return result.data as T;
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError);
        options?.onError?.(apiError);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [url, method, options]
  );

  const reset = useCallback(() => {
    setError(null);
    setIsSuccess(false);
  }, []);

  const clearSuccess = useCallback(() => {
    setIsSuccess(false);
  }, []);

  return {
    mutate,
    loading,
    error,
    reset,
    isSuccess,
    clearSuccess,
  };
}

// ============ Filters hook ============
export function useFilters<T extends Record<string, unknown>>() {
  const [filters, setFilters] = useState<T>({} as T);

  const updateFilter = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({} as T);
  }, []);

  const buildQueryString = useCallback((additionalFilters?: Partial<T>) => {
    const params = new URLSearchParams();
    const allFilters = { ...filters, ...additionalFilters };

    Object.entries(allFilters).forEach(([key, value]) => {
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