import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  paginatedResponse,
  getPaginationParams,
} from "@/lib/api-utils";
import { Prisma } from "@prisma/client";

// GET /api/leave/quota - Get leave quotas
export async function GET(request: NextRequest) {
  try {
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
    console.error("Error fetching leave quotas:", error);
    return errorResponse("Failed to fetch leave quotas", 500);
  }
}

// PUT /api/leave/quota - Update leave quota (approve leave and update used days)
export async function PUT(request: NextRequest) {
  try {
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

    return successResponse(updatedQuota, "Leave quota updated successfully");
  } catch (error) {
    console.error("Error updating leave quota:", error);
    return errorResponse("Failed to update leave quota", 500);
  }
}