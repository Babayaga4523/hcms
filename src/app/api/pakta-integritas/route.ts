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
import { Prisma, PaktaStatus, EmployeeStatus } from "@prisma/client";

// GET /api/pakta-integritas - List pakta integritas assignments with pagination and filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, pageSize, skip } = getPaginationParams(searchParams);

    const where: Prisma.PaktaIntegritasWhereInput = {};

    // Filter by employee ID
    const employeeId = searchParams.get("employeeId");
    if (employeeId) {
      where.employeeId = employeeId;
    }

    // Filter by status
    const status = searchParams.get("status");
    if (status) {
      where.status = status as PaktaStatus;
    }

    // Sorting
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";
    const orderBy: Prisma.PaktaIntegritasOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    // Get total count
    const total = await prisma.paktaIntegritas.count({ where });

    // Get pakta records with relations
    const paktas = await prisma.paktaIntegritas.findMany({
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

    return paginatedResponse(paktas, page, pageSize, total);
  } catch (error) {
    console.error("Error fetching pakta-integritas:", error);
    return errorResponse("Failed to fetch pakta-integritas assignments", 500);
  }
}

// POST /api/pakta-integritas - Assign pakta integritas (individual or bulk)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { employeeId, isBulk, assignmentDate, dueDate, fileUrl } = body;

    // Validate dates
    if (!assignmentDate || !dueDate) {
      return errorResponse("Missing required fields: assignmentDate, dueDate", 400);
    }

    const assignDate = new Date(assignmentDate);
    const due = new Date(dueDate);

    if (due.getTime() <= assignDate.getTime()) {
      return errorResponse("Due date must be after assignment date", 400);
    }

    if (isBulk) {
      // 1. Bulk Assignment: Assign to all currently ACTIVE employees
      const activeEmployees = await prisma.employee.findMany({
        where: { status: "ACTIVE" as EmployeeStatus },
        select: { id: true },
      });

      if (activeEmployees.length === 0) {
        return errorResponse("No active employees found to assign", 400);
      }

      // Prepare bulk data
      const assignmentsData = activeEmployees.map((emp) => ({
        employeeId: emp.id,
        assignmentDate: assignDate,
        dueDate: due,
        status: "PENDING" as PaktaStatus,
        fileUrl: fileUrl || null,
      }));

      // Create many
      const result = await prisma.paktaIntegritas.createMany({
        data: assignmentsData,
        skipDuplicates: true,
      });

      return createdResponse(
        { count: result.count },
        `Successfully assigned Pakta Integritas to ${result.count} active employees in bulk.`
      );
    } else {
      // 2. Individual Assignment
      if (!employeeId) {
        return errorResponse("employeeId is required for individual assignment", 400);
      }

      const employee = await prisma.employee.findUnique({
        where: { id: employeeId },
      });

      if (!employee) {
        return notFoundResponse("Employee not found");
      }

      const assignment = await prisma.paktaIntegritas.create({
        data: {
          employeeId,
          assignmentDate: assignDate,
          dueDate: due,
          status: "PENDING",
          fileUrl: fileUrl || null,
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

      return createdResponse(assignment, "Pakta Integritas assigned successfully.");
    }
  } catch (error) {
    console.error("Error creating pakta-integritas assignment:", error);
    return errorResponse("Failed to assign Pakta Integritas", 500);
  }
}
