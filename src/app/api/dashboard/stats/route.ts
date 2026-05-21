import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse, unauthorizedResponse } from "@/lib/api-utils";
import { apiErrorHandler } from "@/lib/logger";

// GET /api/dashboard/stats - Get dashboard statistics
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return unauthorizedResponse("Authentication required");
    }

    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get("year") || new Date().getFullYear().toString());

    // Get employee statistics
    const [
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
    ] = await Promise.all([
      prisma.employee.count(),
      prisma.employee.count({ where: { status: "ACTIVE" } }),
      prisma.employee.count({ where: { status: { in: ["INACTIVE", "RESIGNED", "TERMINATED"] } } }),
    ]);

    // Get today's attendance
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAttendance = await prisma.attendance.count({
      where: {
        date: {
          gte: today,
          lt: tomorrow,
        },
        status: "PRESENT",
      },
    });

    // Get total employees for attendance percentage
    const attendancePercentage = totalEmployees > 0
      ? Math.round((todayAttendance / totalEmployees) * 100)
      : 0;

    // Get gender distribution
    const genderStats = await prisma.employee.groupBy({
      by: ["gender"],
      _count: { gender: true },
    });

    const maleCount = genderStats.find((s) => s.gender === "MALE")?._count.gender || 0;
    const femaleCount = genderStats.find((s) => s.gender === "FEMALE")?._count.gender || 0;
    const totalCount = maleCount + femaleCount;

    const malePercentage = totalCount > 0 ? Math.round((maleCount / totalCount) * 100) : 0;
    const femalePercentage = totalCount > 0 ? 100 - malePercentage : 0;

    // Get department distribution
    const departmentStats = await prisma.employee.groupBy({
      by: ["departmentId"],
      _count: { departmentId: true },
    });

    const departments = await prisma.department.findMany({
      where: {
        id: { in: departmentStats.map((s) => s.departmentId) },
      },
      select: { id: true, name: true },
    });

    const departmentDistribution = departmentStats.map((stat) => ({
      name: departments.find((d) => d.id === stat.departmentId)?.name || "Unknown",
      value: stat._count.departmentId,
    }));

    // Get weekly attendance for the past week
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weeklyAttendance = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      const present = await prisma.attendance.count({
        where: {
          date: { gte: dayStart, lte: dayEnd },
          status: "PRESENT",
        },
      });

      const absent = await prisma.attendance.count({
        where: {
          date: { gte: dayStart, lte: dayEnd },
          status: { in: ["ABSENT", "LATE"] },
        },
      });

      weeklyAttendance.push({
        day: weekDays[date.getDay()],
        present,
        absent,
      });
    }

    // Get upcoming holidays
    const upcomingHolidays = await prisma.publicHoliday.count({
      where: {
        date: { gte: today },
      },
    });

    // Get pending tasks (pending leave requests count)
    const pendingLeaveRequests = await prisma.leave.count({
      where: { status: "PENDING" },
    });

    // Get upcoming birthdays (this month)
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();
    const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfMonth = new Date(currentYear, currentMonth, 0);

    const upcomingBirthdays = await prisma.employee.count({
      where: {
        status: "ACTIVE",
        birthDate: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    // Build response
    const stats = {
      employees: {
        total: totalEmployees,
        active: activeEmployees,
        inactive: inactiveEmployees,
      },
      attendance: {
        present: todayAttendance,
        percentage: attendancePercentage,
        weekly: weeklyAttendance,
      },
      demographics: {
        male: { count: maleCount, percentage: malePercentage },
        female: { count: femaleCount, percentage: femalePercentage },
      },
      departments: departmentDistribution,
      quickAlerts: {
        pendingLeaveRequests,
        upcomingBirthdays,
        upcomingHolidays,
        upcomingContracts: 0,
      },
      updatedAt: new Date().toISOString(),
    };

    return successResponse(stats);
  } catch (error) {
    const { message } = apiErrorHandler("Fetching dashboard stats", error, {
      method: request.method,
      path: request.url,
    });
    return errorResponse(message, 500);
  }
}