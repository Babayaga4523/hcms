import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { apiErrorHandler } from "@/lib/logger";
import {
  successResponse,
  createdResponse,
  errorResponse,
  paginatedResponse,
  getPaginationParams,
  unauthorizedResponse,
} from "@/lib/api-utils";
import { revalidateReferenceData } from "@/lib/revalidate";

// GET /api/leave-types - List leave types
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
    const { message } = apiErrorHandler("Fetching leave types", error, {
      method: request.method,
      path: request.url,
    });
    return errorResponse(message, 500);
  }
}

// POST /api/leave-types - Create leave type
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const session = await auth();
    if (!session) {
      return unauthorizedResponse("Authentication required");
    }

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

    // Invalidate reference data cache
    await revalidateReferenceData();

    return createdResponse(leaveType, "Leave type created successfully");
  } catch (error) {
    const { message } = apiErrorHandler("Creating leave type", error, {
      method: request.method,
      path: request.url,
    });
    return errorResponse(message, 500);
  }
}