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
import { Prisma, ResignCategory, ResignStatus } from "@prisma/client";
import { revalidateResigns, revalidateDashboard } from "@/lib/revalidate";

// GET /api/resign - List resignation requests with pagination and filters
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const session = await auth();
    if (!session) {
      return unauthorizedResponse("Authentication required");
    }

    const { searchParams } = new URL(request.url);
    const { page, pageSize, skip } = getPaginationParams(searchParams);

    const where: Prisma.ResignWhereInput = {};

    // Filter by employee ID
    const employeeId = searchParams.get("employeeId");
    if (employeeId) {
      where.employeeId = employeeId;
    }

    // Filter by status
    const status = searchParams.get("status");
    if (status) {
      where.status = status as ResignStatus;
    }

    // Filter by category
    const category = searchParams.get("category");
    if (category) {
      where.category = category as ResignCategory;
    }

    // Sorting
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";
    const orderBy: Prisma.ResignOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    // Get total count
    const total = await prisma.resign.count({ where });

    // Get resignation records with relations
    const resigns = await prisma.resign.findMany({
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

    return paginatedResponse(resigns, page, pageSize, total);
  } catch (error) {
    const { message } = apiErrorHandler("Fetching resignation requests", error, {
      method: request.method,
      path: request.url,
    });
    return errorResponse(message, 500);
  }
}

// POST /api/resign - Create new resignation request
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const session = await auth();
    if (!session) {
      return unauthorizedResponse("Authentication required");
    }

    const body = await request.json();

    const { employeeId, resignDate, reason, category } = body;

    // Validate required fields
    if (!employeeId || !resignDate || !reason || !category) {
      return errorResponse("Missing required fields: employeeId, resignDate, reason, category", 400);
    }

    if (!Object.values(ResignCategory).includes(category)) {
      return errorResponse("Invalid resignation category", 400);
    }

    // Verify employee exists and is currently active
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      return notFoundResponse("Employee not found");
    }

    if (employee.status !== "ACTIVE") {
      return errorResponse(`Employee is not in ACTIVE state. Current status: ${employee.status}`, 400);
    }

    // Check if there is already an active resignation process
    const existingResign = await prisma.resign.findFirst({
      where: {
        employeeId,
        status: { in: ["PENDING", "APPROVED"] },
      },
    });

    if (existingResign) {
      return errorResponse("An active resignation process already exists for this employee", 400);
    }

    const resign = await prisma.resign.create({
      data: {
        employeeId,
        requestDate: new Date(),
        resignDate: new Date(resignDate),
        reason,
        category: category as ResignCategory,
        status: "PENDING",
        clearanceStatus: "PENDING",
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

    // Invalidate resign list and dashboard caches
    await revalidateResigns();
    await revalidateDashboard();

    return createdResponse(resign, "Resignation request created successfully");
  } catch (error) {
    const { message } = apiErrorHandler("Creating resignation request", error, {
      method: request.method,
      path: request.url,
    });
    return errorResponse(message, 500);
  }
}