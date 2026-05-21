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

    const education = await prisma.employeeEducation.create({
      data: {
        employeeId,
        level: body.level,
        institution: body.institution,
        major: body.major || null,
        year: body.year ? parseInt(body.year) : null,
        grade: body.grade || null,
      },
    });

    await revalidateAfterEmployeeChange(employeeId);
    return successResponse(education, "Education history added successfully");
  } catch (error) {
    const { message } = apiErrorHandler("Adding education history", error, { method: request.method, path: request.url });
    return errorResponse(message, 500);
  }
}
