import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  notFoundResponse,
  errorResponse,
} from "@/lib/api-utils";
import { PaktaStatus, Prisma } from "@prisma/client";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/pakta-integritas/[id] - Get a single pakta integritas assignment detail
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
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
    console.error("Error fetching pakta-integritas detail:", error);
    return errorResponse("Failed to fetch Pakta Integritas detail", 500);
  }
}

// PATCH /api/pakta-integritas/[id] - Sign pakta integritas or update status
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
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

    return successResponse(updatedPakta, "Pakta Integritas signed successfully.");
  } catch (error) {
    console.error("Error signing pakta-integritas:", error);
    return errorResponse("Failed to sign Pakta Integritas", 500);
  }
}
