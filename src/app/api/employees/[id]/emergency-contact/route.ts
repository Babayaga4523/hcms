import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { apiErrorHandler } from "@/lib/logger";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  unauthorizedResponse,
} from "@/lib/api-utils";
import { revalidateAfterEmployeeChange } from "@/lib/revalidate";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) return unauthorizedResponse("Authentication required");

    const { id: employeeId } = await params;
    const body = await request.json();

    const employee = await prisma.employee.findUnique({ where: { id: employeeId } });
    if (!employee) return notFoundResponse("Employee not found");

    const contact = await prisma.emergencyContact.create({
      data: {
        employeeId,
        name: body.name,
        relationship: body.relationship,
        phone: body.phone,
        address: body.address || null,
      },
    });

    await revalidateAfterEmployeeChange(employeeId);
    return successResponse(contact, "Emergency contact added successfully");
  } catch (error) {
    const { message } = apiErrorHandler("Adding emergency contact", error, { method: request.method, path: request.url });
    return errorResponse(message, 500);
  }
}
