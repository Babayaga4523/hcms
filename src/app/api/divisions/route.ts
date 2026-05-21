import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { apiErrorHandler } from "@/lib/logger";
import {
  successResponse,
  createdResponse,
  errorResponse,
  notFoundResponse,
  paginatedResponse,
  getPaginationParams,
  unauthorizedResponse,
} from "@/lib/api-utils";
import { revalidateReferenceData } from "@/lib/revalidate";

// GET /api/divisions - List divisions
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const session = await auth();
    if (!session) {
      return unauthorizedResponse("Authentication required");
    }

    const { searchParams } = new URL(request.url);
    const { page, pageSize, skip } = getPaginationParams(searchParams);

    const where = {};

    // Filter by department
    const departmentId = searchParams.get("departmentId");
    if (departmentId) {
      (where as Record<string, unknown>).departmentId = departmentId;
    }

    // Search by code or name
    const search = searchParams.get("search");
    if (search) {
      (where as Record<string, unknown>).OR = [
        { code: { contains: search, mode: "insensitive" } },
        { name: { contains: search, mode: "insensitive" } },
      ];
    }

    const total = await prisma.division.count({ where });

    const divisions = await prisma.division.findMany({
      where,
      orderBy: { name: "asc" },
      skip,
      take: pageSize,
      include: {
        department: {
          select: { id: true, code: true, name: true },
        },
        _count: {
          select: { employees: true, positions: true },
        },
      },
    });

    return paginatedResponse(divisions, page, pageSize, total);
  } catch (error) {
    const { message } = apiErrorHandler("Fetching divisions", error, {
      method: request.method,
      path: request.url,
    });
    return errorResponse(message, 500);
  }
}

// POST /api/divisions - Create division
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const session = await auth();
    if (!session) {
      return unauthorizedResponse("Authentication required");
    }

    const body = await request.json();

    if (!body.code || !body.name || !body.departmentId) {
      return errorResponse("Code, name, and departmentId are required", 400);
    }

    // Check if department exists
    const department = await prisma.department.findUnique({
      where: { id: body.departmentId },
    });

    if (!department) {
      return notFoundResponse("Department not found");
    }

    const existingDivision = await prisma.division.findUnique({
      where: { code: body.code },
    });

    if (existingDivision) {
      return errorResponse("Division with this code already exists", 400);
    }

    const division = await prisma.division.create({
      data: {
        code: body.code,
        name: body.name,
        departmentId: body.departmentId,
        description: body.description,
      },
      include: {
        department: {
          select: { id: true, code: true, name: true },
        },
      },
    });

    // Invalidate reference data cache
    await revalidateReferenceData();

    return createdResponse(division, "Division created successfully");
  } catch (error) {
    const { message } = apiErrorHandler("Creating division", error, {
      method: request.method,
      path: request.url,
    });
    return errorResponse(message, 500);
  }
}