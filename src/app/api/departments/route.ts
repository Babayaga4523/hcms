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

// GET /api/departments - List departments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, pageSize, skip } = getPaginationParams(searchParams);

    const where = {};

    // Search by code or name
    const search = searchParams.get("search");
    if (search) {
      (where as Record<string, unknown>).OR = [
        { code: { contains: search, mode: "insensitive" } },
        { name: { contains: search, mode: "insensitive" } },
      ];
    }

    const total = await prisma.department.count({ where });

    const departments = await prisma.department.findMany({
      where,
      orderBy: { name: "asc" },
      skip,
      take: pageSize,
      include: {
        _count: {
          select: { employees: true, divisions: true },
        },
      },
    });

    return paginatedResponse(departments, page, pageSize, total);
  } catch (error) {
    console.error("Error fetching departments:", error);
    return errorResponse("Failed to fetch departments", 500);
  }
}

// POST /api/departments - Create department
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.code || !body.name) {
      return errorResponse("Code and name are required", 400);
    }

    const existingDepartment = await prisma.department.findUnique({
      where: { code: body.code },
    });

    if (existingDepartment) {
      return errorResponse("Department with this code already exists", 400);
    }

    const department = await prisma.department.create({
      data: {
        code: body.code,
        name: body.name,
        description: body.description,
      },
    });

    return createdResponse(department, "Department created successfully");
  } catch (error) {
    console.error("Error creating department:", error);
    return errorResponse("Failed to create department", 500);
  }
}