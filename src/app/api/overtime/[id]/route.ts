import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  notFoundResponse,
  errorResponse,
} from "@/lib/api-utils";
import { OvertimeStatus } from "@prisma/client";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/overtime/[id] - Get a single overtime request detail
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    const overtime = await prisma.overtime.findUnique({
      where: { id },
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

    if (!overtime) {
      return notFoundResponse("Overtime request not found");
    }

    return successResponse(overtime);
  } catch (error) {
    console.error("Error fetching overtime request:", error);
    return errorResponse("Failed to fetch overtime request", 500);
  }
}

// PATCH /api/overtime/[id] - Update overtime request status (Approve/Reject)
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { status, notes, approvedBy } = body;

    if (!status || !Object.values(OvertimeStatus).includes(status)) {
      return errorResponse("Invalid status value", 400);
    }

    const existingOvertime = await prisma.overtime.findUnique({
      where: { id },
    });

    if (!existingOvertime) {
      return notFoundResponse("Overtime request not found");
    }

    if (existingOvertime.status !== "PENDING") {
      return errorResponse(`Overtime request has already been processed with status: ${existingOvertime.status}`, 400);
    }

    const updatedOvertime = await prisma.overtime.update({
      where: { id },
      data: {
        status: status as OvertimeStatus,
        notes: notes !== undefined ? notes : existingOvertime.notes,
        approvedBy: approvedBy || "HR Admin",
        approvedAt: new Date(),
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

    return successResponse(updatedOvertime, `Overtime request successfully updated to ${status}`);
  } catch (error) {
    console.error("Error updating overtime request:", error);
    return errorResponse("Failed to update overtime request", 500);
  }
}
