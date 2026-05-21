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
import { revalidateReferenceData } from "@/lib/revalidate";

// GET /api/positions - List positions
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

    // Filter by division
    const divisionId = searchParams.get("divisionId");
    if (divisionId) {
      (where as Record<string, unknown>).divisionId = divisionId;
    }

    // Filter by level
    const level = searchParams.get("level");
    if (level) {
      (where as Record<string, unknown>).level = parseInt(level);
    }

    // Search by code or name
    const search = searchParams.get("search");
    if (search) {
      (where as Record<string, unknown>).OR = [
        { code: { contains: search, mode: "insensitive" } },
        { name: { contains: search, mode: "insensitive" } },
      ];
    }

    const total = await prisma.position.count({ where });

    const positions = await prisma.position.findMany({
      where,
      orderBy: [{ level: "asc" }, { name: "asc" }],
      skip,
      take: pageSize,
      include: {
        division: {
          select: { id: true, code: true, name: true },
        },
        _count: {
          select: { employees: true },
        },
      },
    });

    return paginatedResponse(positions, page, pageSize, total);
  } catch (error) {
    const { message } = apiErrorHandler("Fetching positions", error, {
      method: request.method,
      path: request.url,
    });
    return errorResponse(message, 500);
  }
}

// POST /api/positions - Create position
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const session = await auth();
    if (!session) {
      return unauthorizedResponse("Authentication required");
    }

    const body = await request.json();

    if (!body.code || !body.name || !body.divisionId) {
      return errorResponse("Code, name, and divisionId are required", 400);
    }

    // Check if division exists
    const division = await prisma.division.findUnique({
      where: { id: body.divisionId },
    });

    if (!division) {
      return notFoundResponse("Division not found");
    }

    const existingPosition = await prisma.position.findUnique({
      where: { code: body.code },
    });

    if (existingPosition) {
      return errorResponse("Position with this code already exists", 400);
    }

    const position = await prisma.position.create({
      data: {
        code: body.code,
        name: body.name,
        level: body.level || 1,
        divisionId: body.divisionId,
      },
      include: {
        division: {
          select: { id: true, code: true, name: true },
        },
      },
    });

    // Invalidate reference data cache
    await revalidateReferenceData();

    return createdResponse(position, "Position created successfully");
  } catch (error) {
    const { message } = apiErrorHandler("Creating position", error, {
      method: request.method,
      path: request.url,
    });
    return errorResponse(message, 500);
  }
}