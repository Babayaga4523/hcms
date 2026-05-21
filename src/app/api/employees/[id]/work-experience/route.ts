import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, unauthorizedResponse } from "@/lib/api-utils";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "HR")) {
      return unauthorizedResponse("Authentication required");
    }

    const { id } = await params;
    const body = await request.json();

    const employee = await prisma.employee.findUnique({
      where: { id },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    const experience = await prisma.workExperience.create({
      data: {
        employeeId: id,
        company: body.company,
        position: body.position,
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
      },
    });

    return NextResponse.json(
      {
        message: "Work experience added successfully",
        data: experience,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding work experience:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
