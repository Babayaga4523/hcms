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
import { Prisma, OvertimeStatus } from "@prisma/client";
import { revalidateOvertimes } from "@/lib/revalidate";

// GET /api/overtime - List overtime requests with pagination and filters
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const session = await auth();
    if (!session) {
      return unauthorizedResponse("Authentication required");
    }

    const { searchParams } = new URL(request.url);
    const { page, pageSize, skip } = getPaginationParams(searchParams);

    const where: Prisma.OvertimeWhereInput = {};

    // Filter by employee ID
    const employeeId = searchParams.get("employeeId");
    if (employeeId) {
      where.employeeId = employeeId;
    }

    // Filter by status
    const status = searchParams.get("status");
    if (status) {
      where.status = status as OvertimeStatus;
    }

    // Filter by date range
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    // Sorting
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";
    const orderBy: Prisma.OvertimeOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    // Get total count
    const total = await prisma.overtime.count({ where });

    // Get overtime records with relations
    const overtimes = await prisma.overtime.findMany({
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
      },
    });

    return paginatedResponse(overtimes, page, pageSize, total);
  } catch (error) {
    const { message } = apiErrorHandler("Fetching overtime requests", error, {
      method: request.method,
      path: request.url,
    });
    return errorResponse(message, 500);
  }
}

// POST /api/overtime - Create new overtime request
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const session = await auth();
    if (!session) {
      return unauthorizedResponse("Authentication required");
    }

    const body = await request.json();

    const { employeeId, date, startTime, endTime, reason } = body;

    // Validate required fields
    if (!employeeId || !date || !startTime || !endTime || !reason) {
      return errorResponse("Missing required fields: employeeId, date, startTime, endTime, reason", 400);
    }

    // Verify employee exists
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      return notFoundResponse("Employee not found");
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    // Calculate total hours
    const diffMs = end.getTime() - start.getTime();
    const totalHours = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));

    if (totalHours <= 0) {
      return errorResponse("End time must be after start time", 400);
    }

    const overtime = await prisma.overtime.create({
      data: {
        employeeId,
        date: new Date(date),
        startTime: start,
        endTime: end,
        totalHours,
        reason,
        status: "PENDING",
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
      },
    });

    // Invalidate overtime list cache
    await revalidateOvertimes();

    return createdResponse(overtime, "Overtime request submitted successfully");
  } catch (error) {
    const { message } = apiErrorHandler("Creating overtime request", error, {
      method: request.method,
      path: request.url,
    });
    return errorResponse(message, 500);
  }
}