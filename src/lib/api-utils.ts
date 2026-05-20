import { NextResponse } from "next/server";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export function successResponse<T>(data: T, message?: string) {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    },
    { status: 200 }
  );
}

export function createdResponse<T>(data: T, message?: string) {
  return NextResponse.json(
    {
      success: true,
      data,
      message: message || "Created successfully",
    },
    { status: 201 }
  );
}

export function noContentResponse() {
  return NextResponse.json({}, { status: 204 });
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status }
  );
}

export function notFoundResponse(message = "Resource not found") {
  return errorResponse(message, 404);
}

export function unauthorizedResponse(message = "Unauthorized") {
  return errorResponse(message, 401);
}

export function forbiddenResponse(message = "Forbidden") {
  return errorResponse(message, 403);
}

export function serverErrorResponse(message = "Internal server error") {
  return errorResponse(message, 500);
}

export function paginatedResponse<T>(
  data: T[],
  page: number,
  pageSize: number,
  total: number
) {
  return NextResponse.json({
    success: true,
    data,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  });
}

// Parse pagination params from request
export function getPaginationParams(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") || "10")));
  return { page, pageSize, skip: (page - 1) * pageSize };
}

// Parse sort params from request
export function getSortParams<T extends Record<string, unknown>>(
  searchParams: URLSearchParams,
  allowedFields: string[]
) {
  const sortBy = searchParams.get("sortBy");
  const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";

  if (sortBy && allowedFields.includes(sortBy)) {
    return { [sortBy]: sortOrder } as Partial<Record<keyof T, "asc" | "desc">>;
  }
  return undefined;
}

// Parse filter params from request
export function getFilterParams<T extends Record<string, unknown>>(
  searchParams: URLSearchParams,
  filterableFields: string[]
): Partial<T> {
  const filters: Partial<T> = {};

  filterableFields.forEach((field) => {
    const value = searchParams.get(field);
    if (value !== null && value !== "") {
      (filters as Record<string, unknown>)[field] = value;
    }
  });

  return filters;
}