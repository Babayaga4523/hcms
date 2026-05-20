import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  createdResponse,
  errorResponse,
  notFoundResponse,
  paginatedResponse,
  getPaginationParams,
} from "@/lib/api-utils";

// GET /api/divisions - List divisions
export async function GET(request: NextRequest) {
  try {
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
    console.error("Error fetching divisions:", error);
    return errorResponse("Failed to fetch divisions", 500);
  }
}

// POST /api/divisions - Create division
export async function POST(request: NextRequest) {
  try {
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

    return createdResponse(division, "Division created successfully");
  } catch (error) {
    console.error("Error creating division:", error);
    return errorResponse("Failed to create division", 500);
  }
}