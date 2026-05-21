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

    const document = await prisma.employeeDocument.create({
      data: {
        employeeId: id,
        name: body.name,
        type: body.type,
        url: body.url,
      },
    });

    return NextResponse.json(
      {
        message: "Document added successfully",
        data: document,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding document:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
