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
import { Prisma, EmployeeStatus, Gender } from "@prisma/client";
import { revalidateAfterEmployeeChange } from "@/lib/revalidate";

// GET /api/employees - List employees with filters and pagination
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const session = await auth();
    if (!session) {
      return unauthorizedResponse("Authentication required");
    }

    const { searchParams } = new URL(request.url);
    const { page, pageSize, skip } = getPaginationParams(searchParams);

    // Build where clause from filters
    const where: Prisma.EmployeeWhereInput = {};

    // Search by name or NIK
    const search = searchParams.get("search");
    if (search) {
      where.OR = [
        { nik: { contains: search, mode: "insensitive" } },
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    // Filter by status
    const status = searchParams.get("status");
    if (status) {
      where.status = status as EmployeeStatus;
    }

    // Filter by department
    const departmentId = searchParams.get("departmentId");
    if (departmentId) {
      where.departmentId = departmentId;
    }

    // Filter by division
    const divisionId = searchParams.get("divisionId");
    if (divisionId) {
      where.divisionId = divisionId;
    }

    // Filter by position
    const positionId = searchParams.get("positionId");
    if (positionId) {
      where.positionId = positionId;
    }

    // Filter by gender
    const gender = searchParams.get("gender");
    if (gender) {
      where.gender = gender as Gender;
    }

    // Sorting
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";
    const orderBy: Prisma.EmployeeOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    // Get total count
    const total = await prisma.employee.count({ where });

    // Get employees with relations
    const employees = await prisma.employee.findMany({
      where,
      orderBy,
      skip,
      take: pageSize,
      include: {
        position: {
          select: { id: true, code: true, name: true },
        },
        division: {
          select: { id: true, code: true, name: true },
        },
        department: {
          select: { id: true, code: true, name: true },
        },
      },
    });

    return paginatedResponse(employees, page, pageSize, total);
  } catch (error) {
    const { message } = apiErrorHandler("Fetching employees", error, {
      method: request.method,
      path: request.url,
    });
    return errorResponse(message, 500);
  }
}

// POST /api/employees - Create new employee
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const session = await auth();
    if (!session) {
      return unauthorizedResponse("Authentication required");
    }

    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "nik",
      "email",
      "firstName",
      "lastName",
      "gender",
      "birthDate",
      "positionId",
      "divisionId",
      "departmentId",
      "joinDate",
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return errorResponse(`Missing required field: ${field}`, 400);
      }
    }

    // Check for duplicate NIK or email
    const existingEmployee = await prisma.employee.findFirst({
      where: {
        OR: [{ nik: body.nik }, { email: body.email }],
      },
    });

    if (existingEmployee) {
      return errorResponse("Employee with this NIK or email already exists", 400);
    }

    const employee = await prisma.employee.create({
      data: {
        nik: body.nik,
        email: body.email,
        firstName: body.firstName,
        lastName: body.lastName,
        gender: body.gender,
        birthDate: new Date(body.birthDate),
        phone: body.phone,
        address: body.address,
        positionId: body.positionId,
        divisionId: body.divisonId,
        departmentId: body.departmentId,
        joinDate: new Date(body.joinDate),
        status: body.status || "ACTIVE",
        ktpNumber: body.ktpNumber,
        bpjsNumber: body.bpjsNumber,
        npwpNumber: body.npwpNumber,
        profilePhoto: body.profilePhoto,
      },
      include: {
        position: { select: { id: true, code: true, name: true } },
        division: { select: { id: true, code: true, name: true } },
        department: { select: { id: true, code: true, name: true } },
      },
    });

    // Invalidate employee list and dashboard caches
    await revalidateAfterEmployeeChange();

    return createdResponse(employee, "Employee created successfully");
  } catch (error) {
    const { message } = apiErrorHandler("Creating employee", error, {
      method: request.method,
      path: request.url,
    });
    return errorResponse(message, 500);
  }
}