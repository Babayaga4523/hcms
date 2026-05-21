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
import { Prisma, LeaveStatus } from "@prisma/client";
import { addDays, differenceInBusinessDays } from "date-fns";
import { revalidateLeaves, revalidateLeaveQuota, revalidateDashboard } from "@/lib/revalidate";

// GET /api/leave - List leave requests
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const session = await auth();
    if (!session) {
      return unauthorizedResponse("Authentication required");
    }

    const { searchParams } = new URL(request.url);
    const { page, pageSize, skip } = getPaginationParams(searchParams);

    const where: Prisma.LeaveWhereInput = {};

    // Filter by employee ID
    const employeeId = searchParams.get("employeeId");
    if (employeeId) {
      where.employeeId = employeeId;
    }

    // Filter by status
    const status = searchParams.get("status");
    if (status) {
      where.status = status as LeaveStatus;
    }

    // Filter by leave type
    const leaveTypeId = searchParams.get("leaveTypeId");
    if (leaveTypeId) {
      where.leaveTypeId = leaveTypeId;
    }

    // Filter by date range
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    if (startDate && endDate) {
      where.startDate = {
        gte: new Date(startDate),
      };
      where.endDate = {
        lte: new Date(endDate),
      };
    }

    // Sorting
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";
    const orderBy: Prisma.LeaveOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    // Get total count
    const total = await prisma.leave.count({ where });

    // Get leave records with relations
    const leaves = await prisma.leave.findMany({
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

    return paginatedResponse(leaves, page, pageSize, total);
  } catch (error) {
    const { message } = apiErrorHandler("Fetching leave requests", error, {
      method: request.method,
      path: request.url,
    });
    return errorResponse(message, 500);
  }
}

// POST /api/leave - Create new leave request
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const session = await auth();
    if (!session) {
      return unauthorizedResponse("Authentication required");
    }

    const body = await request.json();

    // Validate required fields
    if (!body.employeeId || !body.leaveTypeId || !body.startDate || !body.endDate) {
      return errorResponse("Missing required fields", 400);
    }

    // Check if employee exists
    const employee = await prisma.employee.findUnique({
      where: { id: body.employeeId },
    });

    if (!employee) {
      return notFoundResponse("Employee not found");
    }

    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);

    // Calculate total days (excluding weekends)
    const totalDays = differenceInBusinessDays(addDays(endDate, 1), startDate);

    if (totalDays <= 0) {
      return errorResponse("End date must be after start date", 400);
    }

    // Check leave quota
    const currentYear = startDate.getFullYear();
    const quota = await prisma.leaveQuota.findUnique({
      where: {
        employeeId_leaveTypeId_year: {
          employeeId: body.employeeId,
          leaveTypeId: body.leaveTypeId,
          year: currentYear,
        },
      },
    });

    if (quota) {
      const remainingDays = quota.totalDays - quota.usedDays;
      if (totalDays > remainingDays) {
        return errorResponse(
          `Insufficient leave quota. You have ${remainingDays} days remaining but requested ${totalDays} days.`,
          400
        );
      }
    }

    const leave = await prisma.leave.create({
      data: {
        employeeId: body.employeeId,
        leaveTypeId: body.leaveTypeId,
        startDate,
        endDate,
        totalDays,
        reason: body.reason,
        status: "PENDING",
        attachmentUrl: body.attachmentUrl,
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

    // Invalidate leave-related caches and dashboard stats
    await revalidateLeaves();
    await revalidateLeaveQuota();
    await revalidateDashboard();

    return createdResponse(leave, "Leave request created successfully");
  } catch (error) {
    const { message } = apiErrorHandler("Creating leave request", error, {
      method: request.method,
      path: request.url,
    });
    return errorResponse(message, 500);
  }
}