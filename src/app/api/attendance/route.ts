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
import { Prisma, AttendanceStatus } from "@prisma/client";

// GET /api/attendance - List attendance records
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, pageSize, skip } = getPaginationParams(searchParams);

    const where: Prisma.AttendanceWhereInput = {};

    // Filter by employee ID
    const employeeId = searchParams.get("employeeId");
    if (employeeId) {
      where.employeeId = employeeId;
    }

    // Filter by date range
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    } else if (startDate) {
      where.date = { gte: new Date(startDate) };
    } else if (endDate) {
      where.date = { lte: new Date(endDate) };
    }

    // Filter by status
    const status = searchParams.get("status");
    if (status) {
      where.status = status as AttendanceStatus;
    }

    // Sorting
    const sortBy = searchParams.get("sortBy") || "date";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";
    const orderBy: Prisma.AttendanceOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    // Get total count
    const total = await prisma.attendance.count({ where });

    // Get attendance records with employee
    const attendances = await prisma.attendance.findMany({
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

    return paginatedResponse(attendances, page, pageSize, total);
  } catch (error) {
    console.error("Error fetching attendances:", error);
    return errorResponse("Failed to fetch attendances", 500);
  }
}

// POST /api/attendance - Clock in or out
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.employeeId) {
      return errorResponse("Employee ID is required", 400);
    }

    // Check if employee exists
    const employee = await prisma.employee.findUnique({
      where: { id: body.employeeId },
    });

    if (!employee) {
      return notFoundResponse("Employee not found");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if attendance record already exists for today
    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        employeeId: body.employeeId,
        date: today,
      },
    });

    if (body.action === "clockOut" && existingAttendance) {
      // Update existing record with clock out
      if (!existingAttendance.clockOut) {
        const updatedAttendance = await prisma.attendance.update({
          where: { id: existingAttendance.id },
          data: {
            clockOut: new Date(),
            // Calculate duration
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
        return successResponse(updatedAttendance, "Clock out recorded successfully");
      } else {
        return errorResponse("Already clocked out today", 400);
      }
    }

    if (existingAttendance) {
      return errorResponse("Already clocked in today", 400);
    }

    // Create new attendance record with clock in
    const attendance = await prisma.attendance.create({
      data: {
        employeeId: body.employeeId,
        date: today,
        clockIn: new Date(),
        clockOut: null,
        status: "PRESENT",
        location: body.location,
        notes: body.notes,
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

    return createdResponse(attendance, "Clock in recorded successfully");
  } catch (error) {
    console.error("Error recording attendance:", error);
    return errorResponse("Failed to record attendance", 500);
  }
}