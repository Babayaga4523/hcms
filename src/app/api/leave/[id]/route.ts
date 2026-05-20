import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  notFoundResponse,
  errorResponse,
} from "@/lib/api-utils";
import { LeaveStatus } from "@prisma/client";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/leave/[id] - Get a single leave request detail
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    const leave = await prisma.leave.findUnique({
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
        leaveType: {
          select: { id: true, code: true, name: true, isPaid: true },
        },
      },
    });

    if (!leave) {
      return notFoundResponse("Leave request not found");
    }

    return successResponse(leave);
  } catch (error) {
    console.error("Error fetching leave request:", error);
    return errorResponse("Failed to fetch leave request", 500);
  }
}

// PATCH /api/leave/[id] - Update leave request status (Approve/Reject)
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { status, notes, approvedBy } = body;

    if (!status || !Object.values(LeaveStatus).includes(status)) {
      return errorResponse("Invalid status value", 400);
    }

    // Find the current leave request
    const existingLeave = await prisma.leave.findUnique({
      where: { id },
      include: { leaveType: true },
    });

    if (!existingLeave) {
      return notFoundResponse("Leave request not found");
    }

    // Prevent re-processing already approved/rejected requests to avoid duplicate calculations
    if (existingLeave.status !== "PENDING") {
      return errorResponse(`Leave request has already been processed with status: ${existingLeave.status}`, 400);
    }

    // Execute in a transaction for atomicity and data safety
    const updatedLeave = await prisma.$transaction(async (tx) => {
      // 1. If status is APPROVED, subtract the leave days from the employee's LeaveQuota
      if (status === "APPROVED") {
        const leaveYear = new Date(existingLeave.startDate).getFullYear();

        // Find or create a quota record for the current year
        const quota = await tx.leaveQuota.findUnique({
          where: {
            employeeId_leaveTypeId_year: {
              employeeId: existingLeave.employeeId,
              leaveTypeId: existingLeave.leaveTypeId,
              year: leaveYear,
            },
          },
        });

        if (quota) {
          // Verify remaining balance
          const remainingDays = quota.totalDays - quota.usedDays;
          if (existingLeave.totalDays > remainingDays) {
            throw new Error(`Insufficient leave quota. Remaining: ${remainingDays} days, Requested: ${existingLeave.totalDays} days.`);
          }

          // Deduct from quota (increment usedDays)
          await tx.leaveQuota.update({
            where: { id: quota.id },
            data: {
              usedDays: {
                increment: existingLeave.totalDays,
              },
            },
          });
        }
      }

      // 2. Update the Leave request status
      return await tx.leave.update({
        where: { id },
        data: {
          status: status as LeaveStatus,
          notes: notes !== undefined ? notes : existingLeave.notes,
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
          leaveType: {
            select: { id: true, name: true },
          },
        },
      });
    });

    return successResponse(updatedLeave, `Leave request status successfully updated to ${status}`);
  } catch (error) {
    const err = error as Error;
    console.error("Error processing leave patch transaction:", err);
    return errorResponse(err.message || "Failed to process leave request", 500);
  }
}
