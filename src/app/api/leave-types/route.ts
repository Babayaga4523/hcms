import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  createdResponse,
  errorResponse,
  paginatedResponse,
  getPaginationParams,
} from "@/lib/api-utils";

// GET /api/leave-types - List leave types
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

    const total = await prisma.leaveType.count({ where });

    const leaveTypes = await prisma.leaveType.findMany({
      where,
      orderBy: { name: "asc" },
      skip,
      take: pageSize,
      include: {
        _count: {
          select: { leaves: true, quotas: true },
        },
      },
    });

    return paginatedResponse(leaveTypes, page, pageSize, total);
  } catch (error) {
    console.error("Error fetching leave types:", error);
    return errorResponse("Failed to fetch leave types", 500);
  }
}

// POST /api/leave-types - Create leave type
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.code || !body.name) {
      return errorResponse("Code and name are required", 400);
    }

    const existingLeaveType = await prisma.leaveType.findUnique({
      where: { code: body.code },
    });

    if (existingLeaveType) {
      return errorResponse("Leave type with this code already exists", 400);
    }

    const leaveType = await prisma.leaveType.create({
      data: {
        code: body.code,
        name: body.name,
        description: body.description,
        isPaid: body.isPaid ?? true,
      },
    });

    return createdResponse(leaveType, "Leave type created successfully");
  } catch (error) {
    console.error("Error creating leave type:", error);
    return errorResponse("Failed to create leave type", 500);
  }
}