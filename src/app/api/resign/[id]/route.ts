import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  notFoundResponse,
  errorResponse,
} from "@/lib/api-utils";
import { ResignStatus, ClearanceStatus, EmployeeStatus, Prisma } from "@prisma/client";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/resign/[id] - Get a single resignation request detail
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    const resign = await prisma.resign.findUnique({
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

    if (!resign) {
      return notFoundResponse("Resignation request not found");
    }

    return successResponse(resign);
  } catch (error) {
    console.error("Error fetching resignation request:", error);
    return errorResponse("Failed to fetch resignation request", 500);
  }
}

// PATCH /api/resign/[id] - Approve, reject, or complete resignation and clearance processes
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { status, clearanceStatus, notes, approvedBy } = body;

    // Validate parameters
    if (status && !Object.values(ResignStatus).includes(status)) {
      return errorResponse("Invalid resignation status", 400);
    }

    if (clearanceStatus && !Object.values(ClearanceStatus).includes(clearanceStatus)) {
      return errorResponse("Invalid clearance status", 400);
    }

    // Retrieve existing resignation record
    const existingResign = await prisma.resign.findUnique({
      where: { id },
    });

    if (!existingResign) {
      return notFoundResponse("Resignation request not found");
    }

    if (existingResign.status === "COMPLETED" || existingResign.status === "REJECTED") {
      return errorResponse(`Resignation request has already reached final state: ${existingResign.status}`, 400);
    }

    // Process updates in transaction
    const updatedResign = await prisma.$transaction(async (tx) => {
      const dataToUpdate: Prisma.ResignUpdateInput = {};

      if (status) {
        dataToUpdate.status = status as ResignStatus;
      }
      if (clearanceStatus) {
        dataToUpdate.clearanceStatus = clearanceStatus as ClearanceStatus;
      }
      if (notes !== undefined) {
        dataToUpdate.notes = notes;
      }

      if (status === "APPROVED" || status === "REJECTED") {
        dataToUpdate.approvedBy = approvedBy || "HR Admin";
        dataToUpdate.approvedAt = new Date();
      }

      // If clearance is completed, transition employee to RESIGNED and complete the resign workflow
      if (clearanceStatus === "COMPLETED") {
        dataToUpdate.status = "COMPLETED" as ResignStatus;

        // Automatically disable employee active status
        await tx.employee.update({
          where: { id: existingResign.employeeId },
          data: {
            status: "RESIGNED" as EmployeeStatus,
          },
        });
      }

      return await tx.resign.update({
        where: { id },
        data: dataToUpdate,
        include: {
          employee: {
            select: {
              id: true,
              nik: true,
              firstName: true,
              lastName: true,
              status: true,
            },
          },
        },
      });
    });

    return successResponse(
      updatedResign,
      `Resignation request successfully updated. Employee state: ${updatedResign.employee.status}`
    );
  } catch (error) {
    const err = error as Error;
    console.error("Error patching resignation:", err);
    return errorResponse(err.message || "Failed to update resignation request", 500);
  }
}
