import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { apiErrorHandler } from "@/lib/logger";
import {
  successResponse,
  notFoundResponse,
  errorResponse,
} from "@/lib/api-utils";
import { PaktaStatus, Prisma } from "@prisma/client";
import { revalidatePaktaIntegritasRecord } from "@/lib/revalidate";

// GET /api/pakta-integritas/[id] - Get a single pakta integritas assignment detail
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

    const pakta = await prisma.paktaIntegritas.findUnique({
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

    if (!pakta) {
      return notFoundResponse("Pakta Integritas assignment not found");
    }

    return successResponse(pakta);
  } catch (error) {
    const { message } = apiErrorHandler("Fetching Pakta Integritas detail", error, {
      method: request.method,
      path: request.url,
    });
    return errorResponse(message, 500);
  }
}

// PATCH /api/pakta-integritas/[id] - Sign pakta integritas or update status
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

    const { status, fileUrl } = body;

    // Retrieve existing record
    const existingPakta = await prisma.paktaIntegritas.findUnique({
      where: { id },
    });

    if (!existingPakta) {
      return notFoundResponse("Pakta Integritas assignment not found");
    }

    if (existingPakta.status === "SIGNED") {
      return errorResponse("Pakta Integritas has already been signed", 400);
    }

    if (existingPakta.status === "EXPIRED") {
      return errorResponse("This Pakta Integritas assignment has expired and cannot be signed", 400);
    }

    const dataToUpdate: Prisma.PaktaIntegritasUpdateInput = {};

    if (status) {
      if (!Object.values(PaktaStatus).includes(status)) {
        return errorResponse("Invalid status value", 400);
      }
      dataToUpdate.status = status as PaktaStatus;

      // If status is transitioning to SIGNED, record signed timestamp
      if (status === "SIGNED") {
        dataToUpdate.signedDate = new Date();
      }
    } else {
      // Default behavior if just signing without explicitly passing status
      dataToUpdate.status = "SIGNED" as PaktaStatus;
      dataToUpdate.signedDate = new Date();
    }

    if (fileUrl !== undefined) {
      dataToUpdate.fileUrl = fileUrl;
    }

    const updatedPakta = await prisma.paktaIntegritas.update({
      where: { id },
      data: dataToUpdate,
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

    // Invalidate pakta integritas record cache
    await revalidatePaktaIntegritasRecord(id);

    return successResponse(updatedPakta, "Pakta Integritas signed successfully.");
  } catch (error) {
    const { message } = apiErrorHandler("Signing Pakta Integritas", error, {
      method: request.method,
      path: request.url,
    });
    return errorResponse(message, 500);
  }
}