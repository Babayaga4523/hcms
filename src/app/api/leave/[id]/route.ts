import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { apiErrorHandler } from "@/lib/logger";
import {
  successResponse,
  errorResponse,
} from "@/lib/api-utils";
import { LeaveStatus } from "@prisma/client";
import { revalidateLeave, revalidateLeaveQuota, revalidateDashboard } from "@/lib/revalidate";

// GET /api/leave/[id] - Get a single leave request detail
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    const session = await auth();
    if (!session) {
      return errorResponse("Authentication required", 401);
    }

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
      return errorResponse("Leave request not found", 404);
    }

    return successResponse(leave);
  } catch (error) {
    const { message } = apiErrorHandler("Fetching leave request", error, {
      method: request.method,
      path: request.url,
    });
    return errorResponse(message, 500);
  }
}

// PATCH /api/leave/[id] - Update leave request status (Approve/Reject)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    const session = await auth();
    if (!session) {
      return errorResponse("Authentication required", 401);
    }

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
      return errorResponse("Leave request not found", 404);
    }

    // Prevent re-processing already approved/rejected requests
    if (existingLeave.status !== "PENDING") {
      return errorResponse(`Leave request has already been processed with status: ${existingLeave.status}`, 400);
    }

    // Execute in a transaction for atomicity
    const updatedLeave = await prisma.$transaction(async (tx) => {
      // If status is APPROVED, subtract the leave days from the employee's LeaveQuota
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

          // Deduct from quota
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

      // Update the Leave request status
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

    // Invalidate leave caches, quota, and dashboard stats
    await revalidateLeave(id);
    await revalidateLeaveQuota();
    await revalidateDashboard();

    return successResponse(updatedLeave, `Leave request status successfully updated to ${status}`);
  } catch (error) {
    const { message } = apiErrorHandler("Processing leave approval", error, {
      method: request.method,
      path: request.url,
    });
    return errorResponse(message, 500);
  }
}