/**
 * Revalidation Helper - Centralized cache invalidation utilities
 *
 * Provides consistent cache invalidation across the app:
 * - Tag-based invalidation for specific routes (stale-while-revalidate via 'max')
 * - Path-based revalidation
 * - Batch invalidation helpers
 *
 * Next.js 16: revalidateTag requires a second argument for the stale profile.
 * We use 'max' (recommended) for stale-while-revalidate semantics — stale
 * content is served instantly while fresh content loads in the background.
 */

import { revalidatePath, revalidateTag } from "next/cache";

/**
 * Default stale-while-revalidate profile for all tag invalidations.
 * 'max' provides the longest stale window while data regenerates.
 */
const REVALIDATE_PROFILE = "max" as const;

/**
 * Cache tags for consistent tag naming
 */
export const CACHE_TAGS = {
  // Employee cache tags
  employees: "employees",
  employee: (id: string) => `employee-${id}`,
  employeeList: "employee-list",

  // Leave cache tags
  leaves: "leaves",
  leave: (id: string) => `leave-${id}`,
  leaveHistory: "leave-history",
  leaveQuota: "leave-quota",

  // Attendance cache tags
  attendance: "attendance",
  attendanceRecord: (id: string) => `attendance-${id}`,
  attendanceStats: "attendance-stats",

  // Dashboard cache tags
  dashboard: "dashboard",
  dashboardStats: "dashboard-stats",

  // Department/Division/Position cache tags
  departments: "departments",
  divisions: "divisions",
  positions: "positions",
  leaveTypes: "leave-types",

  // Overtime cache tags
  overtimes: "overtimes",
  overtime: (id: string) => `overtime-${id}`,

  // Resign cache tags
  resigns: "resigns",
  resign: (id: string) => `resign-${id}`,

  // Pakta Integritas cache tags
  paktaIntegritas: "pakta-integritas",
  paktaIntegritasRecord: (id: string) => `pakta-integritas-${id}`,
} as const;

/**
 * Revalidate helper functions for specific resources
 * Use these in Server Actions and API routes after mutations
 */
export async function revalidateEmployees() {
  revalidateTag(CACHE_TAGS.employees, REVALIDATE_PROFILE);
  revalidatePath("/(dashboard)/employee");
}

export async function revalidateEmployee(id: string) {
  revalidateTag(CACHE_TAGS.employee(id), REVALIDATE_PROFILE);
  revalidateTag(CACHE_TAGS.employees, REVALIDATE_PROFILE);
}

export async function revalidateLeaves() {
  revalidateTag(CACHE_TAGS.leaves, REVALIDATE_PROFILE);
  revalidateTag(CACHE_TAGS.leaveHistory, REVALIDATE_PROFILE);
}

export async function revalidateLeave(id: string) {
  revalidateTag(CACHE_TAGS.leave(id), REVALIDATE_PROFILE);
  revalidateTag(CACHE_TAGS.leaves, REVALIDATE_PROFILE);
}

export async function revalidateLeaveQuota() {
  revalidateTag(CACHE_TAGS.leaveQuota, REVALIDATE_PROFILE);
}

export async function revalidateAttendance() {
  revalidateTag(CACHE_TAGS.attendance, REVALIDATE_PROFILE);
  revalidatePath("/(dashboard)/hc-service/attendance");
}

export async function revalidateAttendanceRecord(id: string) {
  revalidateTag(CACHE_TAGS.attendanceRecord(id), REVALIDATE_PROFILE);
  revalidateTag(CACHE_TAGS.attendance, REVALIDATE_PROFILE);
}

export async function revalidateDashboard() {
  revalidateTag(CACHE_TAGS.dashboard, REVALIDATE_PROFILE);
  revalidateTag(CACHE_TAGS.dashboardStats, REVALIDATE_PROFILE);
  revalidatePath("/(dashboard)");
}

export async function revalidateResigns() {
  revalidateTag(CACHE_TAGS.resigns, REVALIDATE_PROFILE);
  revalidatePath("/caretaker-resign");
  revalidatePath("/resign-report");
}

export async function revalidateResign(id: string) {
  revalidateTag(CACHE_TAGS.resign(id), REVALIDATE_PROFILE);
  revalidateTag(CACHE_TAGS.resigns, REVALIDATE_PROFILE);
}

/**
 * Revalidate overtime data
 */
export async function revalidateOvertimes() {
  revalidateTag(CACHE_TAGS.overtimes, REVALIDATE_PROFILE);
  revalidatePath("/(dashboard)/self-service/overtime");
}

export async function revalidateOvertime(id: string) {
  revalidateTag(CACHE_TAGS.overtime(id), REVALIDATE_PROFILE);
  revalidateTag(CACHE_TAGS.overtimes, REVALIDATE_PROFILE);
}

/**
 * Revalidate Pakta Integritas data
 */
export async function revalidatePaktaIntegritas() {
  revalidateTag(CACHE_TAGS.paktaIntegritas, REVALIDATE_PROFILE);
  revalidatePath("/(dashboard)/self-service/pakta-integritas");
}

export async function revalidatePaktaIntegritasRecord(id: string) {
  revalidateTag(CACHE_TAGS.paktaIntegritasRecord(id), REVALIDATE_PROFILE);
  revalidateTag(CACHE_TAGS.paktaIntegritas, REVALIDATE_PROFILE);
}

/**
 * Revalidate reference data (rarely change)
 */
export async function revalidateReferenceData() {
  revalidateTag(CACHE_TAGS.departments, REVALIDATE_PROFILE);
  revalidateTag(CACHE_TAGS.divisions, REVALIDATE_PROFILE);
  revalidateTag(CACHE_TAGS.positions, REVALIDATE_PROFILE);
  revalidateTag(CACHE_TAGS.leaveTypes, REVALIDATE_PROFILE);
  revalidatePath("/(dashboard)/company-hierarchy");
}

/**
 * Composite helper: revalidate employee + dashboard stats
 * Use after any employee mutation since dashboard stats depend on employee data
 */
export async function revalidateAfterEmployeeChange(employeeId?: string) {
  if (employeeId) {
    revalidateTag(CACHE_TAGS.employee(employeeId), REVALIDATE_PROFILE);
  }
  revalidateTag(CACHE_TAGS.employees, REVALIDATE_PROFILE);
  revalidateTag(CACHE_TAGS.employeeList, REVALIDATE_PROFILE);
  revalidateTag(CACHE_TAGS.dashboard, REVALIDATE_PROFILE);
  revalidateTag(CACHE_TAGS.dashboardStats, REVALIDATE_PROFILE);
  revalidatePath("/(dashboard)/employee");
  revalidatePath("/(dashboard)");
}

/**
 * Revalidate multiple tags at once (batch invalidation)
 */
export async function revalidateTags(tags: string[]) {
  tags.forEach((tag) => revalidateTag(tag, REVALIDATE_PROFILE));
}

/**
 * Revalidate multiple paths at once
 */
export async function revalidatePaths(paths: string[]) {
  paths.forEach((path) => revalidatePath(path));
}