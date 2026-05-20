import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse, notFoundResponse, serverErrorResponse } from "@/lib/api-utils";

// GET /api/employees/[id] - Get single employee
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        position: true,
        division: {
          include: { department: true },
        },
        department: true,
        attendances: {
          orderBy: { date: "desc" },
          take: 10,
        },
        leaves: {
          orderBy: { createdAt: "desc" },
          take: 10,
          include: { leaveType: true },
        },
      },
    });

    if (!employee) {
      return notFoundResponse("Employee not found");
    }

    return successResponse(employee);
  } catch (error) {
    console.error("Error fetching employee:", error);
    return serverErrorResponse();
  }
}

// PUT /api/employees/[id] - Update employee
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if employee exists
    const existingEmployee = await prisma.employee.findUnique({
      where: { id },
    });

    if (!existingEmployee) {
      return notFoundResponse("Employee not found");
    }

    // Check for duplicate NIK or email if being updated
    if (body.nik || body.email) {
      const duplicate = await prisma.employee.findFirst({
        where: {
          id: { not: id },
          OR: [
            body.nik ? { nik: body.nik } : {},
            body.email ? { email: body.email } : {},
          ].filter((f) => Object.keys(f).length > 0),
        },
      });

      if (duplicate) {
        return errorResponse("Employee with this NIK or email already exists", 400);
      }
    }

    const updateData: Record<string, unknown> = {};

    // Only update provided fields
    const fields = [
      "nik",
      "email",
      "firstName",
      "lastName",
      "gender",
      "phone",
      "address",
      "positionId",
      "divisionId",
      "departmentId",
      "status",
      "ktpNumber",
      "bpjsNumber",
      "npwpNumber",
      "profilePhoto",
      "isLocked",
      "lockedReason",
    ];

    fields.forEach((field) => {
      if (body[field] !== undefined) {
        if (field === "birthDate" || field === "joinDate") {
          updateData[field] = new Date(body[field]);
        } else {
          updateData[field] = body[field];
        }
      }
    });

    const employee = await prisma.employee.update({
      where: { id },
      data: updateData,
      include: {
        position: { select: { id: true, code: true, name: true } },
        division: { select: { id: true, code: true, name: true } },
        department: { select: { id: true, code: true, name: true } },
      },
    });

    return successResponse(employee, "Employee updated successfully");
  } catch (error) {
    console.error("Error updating employee:", error);
    return serverErrorResponse();
  }
}

// DELETE /api/employees/[id] - Delete employee
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const employee = await prisma.employee.findUnique({
      where: { id },
    });

    if (!employee) {
      return notFoundResponse("Employee not found");
    }

    // Check if employee has related records
    const attendanceCount = await prisma.attendance.count({ where: { employeeId: id } });
    const leaveCount = await prisma.leave.count({ where: { employeeId: id } });

    if (attendanceCount > 0 || leaveCount > 0) {
      return errorResponse(
        "Cannot delete employee with existing attendance or leave records. Consider marking as INACTIVE instead.",
        400
      );
    }

    await prisma.employee.delete({ where: { id } });

    return successResponse(null, "Employee deleted successfully");
  } catch (error) {
    console.error("Error deleting employee:", error);
    return serverErrorResponse();
  }
}