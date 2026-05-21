import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { apiErrorHandler } from "@/lib/logger";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  paginatedResponse,
  getPaginationParams,
  unauthorizedResponse,
} from "@/lib/api-utils";
import { Prisma } from "@prisma/client";
import { revalidateLeaveQuota } from "@/lib/revalidate";

// GET /api/leave/quota - Get leave quotas
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const session = await auth();
    if (!session) {
      return unauthorizedResponse("Authentication required");
    }

    const { searchParams } = new URL(request.url);
    const { page, pageSize, skip } = getPaginationParams(searchParams);

    const where: Prisma.LeaveQuotaWhereInput = {};

    // Filter by employee ID
    const employeeId = searchParams.get("employeeId");
    if (employeeId) {
      where.employeeId = employeeId;
    }

    // Filter by year
    const year = searchParams.get("year");
    if (year) {
      where.year = parseInt(year);
    } else {
      // Default to current year
      where.year = new Date().getFullYear();
    }

    // Filter by leave type
    const leaveTypeId = searchParams.get("leaveTypeId");
    if (leaveTypeId) {
      where.leaveTypeId = leaveTypeId;
    }

    // Sorting
    const orderBy: Prisma.LeaveQuotaOrderByWithRelationInput = {
      year: "desc",
    };

    // Get total count
    const total = await prisma.leaveQuota.count({ where });

    // Get quotas with relations
    const quotas = await prisma.leaveQuota.findMany({
      where,
      orderBy,
      skip,
      take: pageSize,
      include: {
        employee: {
          select: {
            id: true,
            nik: true,
            firstName: true,
            lastName: true,
            position: { select: { name: true } },
            department: { select: { name: true } },
          },
        },
        leaveType: {
          select: { id: true, code: true, name: true, isPaid: true },
        },
      },
    });

    return paginatedResponse(quotas, page, pageSize, total);
  } catch (error) {
    const { message } = apiErrorHandler("Fetching leave quotas", error, {
      method: request.method,
      path: request.url,
    });
    return errorResponse(message, 500);
  }
}

// PUT /api/leave/quota - Update leave quota
export async function PUT(request: NextRequest) {
  try {
    // Verify authentication
    const session = await auth();
    if (!session) {
      return unauthorizedResponse("Authentication required");
    }

    const body = await request.json();

    if (!body.id) {
      return errorResponse("Quota ID is required", 400);
    }

    const quota = await prisma.leaveQuota.findUnique({
      where: { id: body.id },
    });

    if (!quota) {
      return notFoundResponse("Leave quota not found");
    }

    const updatedQuota = await prisma.leaveQuota.update({
      where: { id: body.id },
      data: {
        usedDays: body.usedDays !== undefined ? body.usedDays : quota.usedDays,
      },
      include: {
        employee: {
          select: {
            id: true,
            nik: true,
            firstName: true,
            lastName: true,
          },
        },
        leaveType: {
          select: { id: true, code: true, name: true },
        },
      },
    });

    // Invalidate leave quota cache
    await revalidateLeaveQuota();

    return successResponse(updatedQuota, "Leave quota updated successfully");
  } catch (error) {
    const { message } = apiErrorHandler("Updating leave quota", error, {
      method: request.method,
      path: request.url,
    });
    return errorResponse(message, 500);
  }
}