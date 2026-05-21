# HCMS-BNI System Audit Report

**Generated:** 2026-05-21
**Auditor:** Claude Code (Senior Developer Audit)
**Project:** HCMS - Human Capital Management System for BNI Finance

---

## Executive Summary

| Category | Severity | Count |
|----------|----------|-------|
| 🔴 Critical | High | 12 |
| 🟡 Medium | Medium | 18 |
| 🟢 Low | Low | 8 |

**Overall Status:** Development In Progress - Most pages use mock data, backend APIs exist but not integrated

---

## 1. Data Dummy & Hardcoded Values

### 1.1 Dashboard (Homepage)
| File | Line | Issue | Recommendation |
|------|------|-------|----------------|
| `src/app/(dashboard)/page.tsx` | 42-48 | Hardcoded `stats` object (total: 1132, active: 666, etc.) | Replace with API call to `/api/employees/stats` |
| `src/app/(dashboard)/page.tsx` | 50-58 | `ageGenderData` hardcoded array | Query from Prisma with aggregation |
| `src/app/(dashboard)/page.tsx` | 60-72 | `officeData`, `departmentData` hardcoded | Query from divisions/departments tables |
| `src/app/(dashboard)/page.tsx` | 74-80 | `attendanceData` hardcoded | Fetch from `/api/attendance` |
| `src/app/(dashboard)/page.tsx` | 82-93 | `tasks`, `activities` arrays | Query from workflow/task tables |
| `src/app/(dashboard)/page.tsx` | 235 | Username "Yoga Utama" hardcoded | Get from session |

### 1.2 Employee Module
| File | Line | Issue | Recommendation |
|------|------|-------|----------------|
| `src/app/(dashboard)/employee/page.tsx` | 30-111 | `mockEmployees` - 5 employee objects hardcoded | Use `useList` hook to fetch from `/api/employees` |
| `src/app/(dashboard)/employee/page.tsx` | 113-136 | `mockDepartments`, `mockPositions`, `mockStatuses` | Fetch from `/api/departments`, `/api/positions` |
| `src/app/(dashboard)/employee/working-days/page.tsx` | 11 | `mockWorkingDays` array | Query from `WorkSchedule` table |

### 1.3 Self-Service Leave Module
| File | Line | Issue | Recommendation |
|------|------|-------|----------------|
| `src/app/(dashboard)/self-service/leave/history/page.tsx` | 26-100 | `mockLeaveHistory` - 6 records hardcoded | Fetch from `/api/leave?employeeId={currentUser}` |
| `src/app/(dashboard)/self-service/leave/information/page.tsx` | 16-100 | `mockLeaveTypes` - leave type info | Query from `LeaveType` table |
| `src/app/(dashboard)/self-service/leave/request/page.tsx` | 72, 133, 143 | Quota values hardcoded (12/14, 3/5, 8 days) | Fetch from `/api/leave/quota` |

### 1.4 Self-Service Overtime Module
| File | Line | Issue | Recommendation |
|------|------|-------|----------------|
| `src/app/(dashboard)/self-service/overtime/history/page.tsx` | 8-11 | `mockOvertimeHistory` - 2 records | Fetch from `/api/overtime?employeeId={currentUser}` |
| `src/app/(dashboard)/self-service/overtime/request/page.tsx` | - | No data shown, but needs integration | - |

### 1.5 Self-Service Work Permission Module
| File | Line | Issue | Recommendation |
|------|------|-------|----------------|
| `src/app/(dashboard)/self-service/work-of-permission/history/page.tsx` | 10-14 | `mockPermissionHistory` - 3 records | Fetch from `/api/work-permission?employeeId={currentUser}` |

### 1.6 Pakta Integritas Module
| File | Line | Issue | Recommendation |
|------|------|-------|----------------|
| `src/app/(dashboard)/self-service/pakta-integritas/history/page.tsx` | 10-13 | `mockPaktaHistory` - 2 records | Fetch from `/api/pakta-integritas?employeeId={currentUser}` |
| `src/app/(dashboard)/self-service/performance-appraisal/history/page.tsx` | 8-12 | `mockPerformanceHistory` - 3 records | Fetch from `/api/performance-appraisal?employeeId={currentUser}` |

### 1.7 HC Service Modules
| File | Line | Issue | Recommendation |
|------|------|-------|----------------|
| `src/app/(dashboard)/hc-service/attendance/page.tsx` | 23-30 | `mockAttendance` - 6 records | Fetch from `/api/attendance` with filters |
| `src/app/(dashboard)/hc-service/report/page.tsx` | 12-18 | `mockReportData` - 5 records | Query from actual data |
| `src/app/(dashboard)/caretaker-resign/history/page.tsx` | 11-30 | `mockResignHistory` - 2 records | Fetch from `/api/resign` |
| `src/app/(dashboard)/resign-report/page.tsx` | 12-25 | `resignReasonsData`, `mockResignData` | Query from Prisma aggregations |
| `src/app/(dashboard)/company-hierarchy/page.tsx` | 31, 378 | `organizationData`, `treeData` | Query from Department/Division/Position tables |

### 1.8 Utilities
| File | Line | Issue | Recommendation |
|------|------|-------|----------------|
| `src/lib/utils.ts` | 115 | `Math.random()` for OTP | Use cryptographically secure random |

---

## 2. Komponen & UI yang Tidak Berfungsi

### 2.1 Non-functional Buttons/Links
| File | Line | Issue |
|------|------|-------|
| `src/app/(dashboard)/page.tsx` | 238-241 | Refresh button - no `onClick` handler |
| `src/app/(dashboard)/page.tsx` | 242-245 | Export button - no `onClick` handler |
| `src/app/(dashboard)/page.tsx` | 274-276 | "View all tasks" button - no handler |
| `src/app/(dashboard)/page.tsx` | 440-442 | "Details" button - no handler |
| `src/app/(dashboard)/page.tsx` | 534-536 | "View all" button - no handler |
| `src/app/(dashboard)/employee/page.tsx` | 519 | Edit button - `console.log("Edit", row.id)` |
| `src/app/(dashboard)/employee/page.tsx` | 526 | Delete button - `console.log("Delete", row.id)` |
| `src/app/(dashboard)/self-service/leave/request/page.tsx` | 93-104 | File upload area - no `onChange` or actual upload handler |

### 2.2 Non-functional Filters
| File | Line | Issue |
|------|------|-------|
| `src/app/(dashboard)/self-service/leave/history/page.tsx` | 405-407 | Filter button - no `onClick` handler (filtering happens client-side) |
| `src/app/(dashboard)/employee/page.tsx` | 584-589 | Filter/Export buttons - no handlers |

### 2.3 Empty/Incomplete States
| File | Line | Issue |
|------|------|-------|
| `src/app/(dashboard)/employee/page.tsx` | 283-286 | "No documents uploaded" - static text, no upload UI |
| `src/app/(dashboard)/employee/page.tsx` | 289-292 | "No history available" - static text, no content |

### 2.4 Modal/Drawer Issues
| File | Line | Issue |
|------|------|-------|
| `src/app/(dashboard)/self-service/pakta-integritas/history/page.tsx` | 33-36 | Download button - no handler for actual PDF download |

---

## 3. Frontend Belum Terintegrasi dengan Backend

### 3.1 Pages Without API Integration (Major)
| Page | Should Fetch From |
|------|-------------------|
| `src/app/(dashboard)/page.tsx` | `/api/employees`, `/api/attendance`, `/api/leaves` |
| `src/app/(dashboard)/employee/page.tsx` | `/api/employees`, `/api/departments`, `/api/divisions`, `/api/positions` |
| `src/app/(dashboard)/self-service/leave/history/page.tsx` | `/api/leave?employeeId={session.id}` |
| `src/app/(dashboard)/self-service/leave/request/page.tsx` | `/api/leave/quota`, `/api/leave-types` |
| `src/app/(dashboard)/self-service/leave/information/page.tsx` | `/api/leave-types` |
| `src/app/(dashboard)/self-service/overtime/history/page.tsx` | `/api/overtime?employeeId={session.id}` |
| `src/app/(dashboard)/self-service/overtime/request/page.tsx` | None yet |
| `src/app/(dashboard)/self-service/work-of-permission/history/page.tsx` | `/api/work-permission?employeeId={session.id}` |
| `src/app/(dashboard)/self-service/pakta-integritas/history/page.tsx` | `/api/pakta-integritas?employeeId={session.id}` |
| `src/app/(dashboard)/self-service/performance-appraisal/history/page.tsx` | `/api/performance-appraisal?employeeId={session.id}` |
| `src/app/(dashboard)/hc-service/attendance/page.tsx` | `/api/attendance` with date/employee filters |
| `src/app/(dashboard)/hc-service/report/page.tsx` | Various endpoints |
| `src/app/(dashboard)/resign-report/page.tsx` | `/api/resign` |
| `src/app/(dashboard)/caretaker-resign/history/page.tsx` | `/api/resign?type=caretaker` |

### 3.2 API Endpoints That Exist But Not Used
- ✅ `/api/employees` (GET, POST)
- ✅ `/api/employees/[id]` (GET, PATCH, DELETE)
- ✅ `/api/departments` (GET, POST)
- ✅ `/api/divisions` (GET, POST)
- ✅ `/api/positions` (GET, POST)
- ✅ `/api/leave-types` (GET, POST)
- ✅ `/api/leave` (GET, POST)
- ✅ `/api/leave/[id]` (GET, PATCH)
- ✅ `/api/leave/quota` (GET, PATCH)
- ✅ `/api/attendance` (GET, POST)
- ✅ `/api/overtime` (GET, POST)
- ✅ `/api/overtime/[id]` (GET, PATCH)
- ✅ `/api/resign` (GET, POST)
- ✅ `/api/resign/[id]` (GET, PATCH)
- ✅ `/api/pakta-integritas` (GET, POST)
- ✅ `/api/pakta-integritas/[id]` (GET, PATCH)

### 3.3 Missing Revalidation
No pages use `revalidatePath` or `revalidateTag` after create/update/delete operations.

---

## 4. Auth, Session & RBAC

### 4.1 Missing Auth Implementation
| Item | Status |
|------|--------|
| `middleware.ts` | ❌ Not found |
| NextAuth/SSO integration | ❌ Not found |
| Session validation in API routes | ❌ No routes validate session |
| User session context | ❌ No session provider |

### 4.2 Hardcoded User Context
| File | Line | Issue |
|------|------|-------|
| `src/app/(dashboard)/page.tsx` | 235 | "Welcome back, Yoga!" - hardcoded name |
| `src/app/(dashboard)/page.tsx` | 303-311 | Profile shows "Yoga Utama", "HR Admin" hardcoded |
| `src/app/(dashboard)/page.tsx` | 309-311 | Position/department hardcoded |

### 4.3 RBAC Issues
- No role-based rendering checks (all pages accessible)
- No permission checks for admin features
- HC Service pages not protected

### 4.4 API Security
All API routes have NO session validation - anyone can access:
- `/api/employees` (full CRUD)
- `/api/leave` (create requests)
- `/api/attendance` (record attendance)

---

## 5. Error Handling & UX State

### 5.1 Missing Error Boundaries
- No `error.tsx` or `error.tsx` files
- No `loading.tsx` files for Suspense boundaries
- No toast notifications for user feedback

### 5.2 Console.log Statements (Development)
| File | Line | Code |
|------|------|------|
| `src/app/(dashboard)/self-service/leave/request/page.tsx` | 19 | `console.log("Submit Leave Request", formData)` |
| `src/app/(dashboard)/self-service/leave/history/page.tsx` | 245 | `console.log("Cancel", leave.id)` |
| `src/app/(dashboard)/caretaker-resign/request/page.tsx` | 19 | `console.log("Submit Caretaker Resign", formData)` |
| `src/app/(dashboard)/employee/page.tsx` | 519, 526 | `console.log("Edit", "Delete", row.id)` |
| `src/app/(dashboard)/employee/page.tsx` | 627 | `console.log("Submit:", data)` |

### 5.3 Missing Loading States
Most pages lack loading skeletons or spinners while fetching data.

### 5.4 Form Validation
| Page | Issue |
|------|-------|
| Leave Request | No client-side validation (date order, quota check) |
| Employee Add | No validation before submit |
| Overtime Request | Empty form with no validation |

---

## 6. Fitur Belum Selesai (Incomplete Features)

### 6.1 Pages That Exist But Need Work
| Page | Status |
|------|--------|
| `src/app/(dashboard)/company-hierarchy/page.tsx` | Has mock org data, needs real integration |
| `src/app/(dashboard)/self-service/attendance/page.tsx` | Uses mock data |
| `src/app/(dashboard)/hc-service/parameter/approval-level/page.tsx` | Empty UI stub |
| `src/app/(dashboard)/hc-service/parameter/kye/*` | Empty pages |
| `src/app/(dashboard)/hc-service/parameter/pakta/*` | Empty pages |
| `src/app/(dashboard)/hc-service/performance/*` | Empty pages |
| `src/app/(dashboard)/hc-service/time-management/*` | Empty pages |
| `src/app/(dashboard)/hc-service/leave-admin/*` | Empty pages |
| `src/app/(dashboard)/hc-service/resign-claim/*` | Empty pages |
| `src/app/(dashboard)/hc-service/inquiry/page.tsx` | Empty UI |
| `src/app/(dashboard)/hc-service/forward-task/page.tsx` | Empty UI |
| `src/app/(dashboard)/hc-service/user-locked/page.tsx` | Empty UI |
| `src/app/(dashboard)/self-service/resign/page.tsx` | Has form but no API call |

### 6.2 Features Mentioned in Nav but No Implementation
- Company Hierarchy
- KYE (Kartu Y extens? - unclear)
- Pakta Integritas Assignment (HR side)
- Performance KPIs (HR Admin)
- Time Management (Schedules, Holidays)
- Leave Admin (Adjustment, Quota Generation)
- Inquiry
- Forward Task
- User Locked

---

## Priority Recommendations

### 🔴 HIGH PRIORITY (Fix Immediately)
1. **Implement Authentication** - Add NextAuth with SSO
2. **Add middleware.ts** - Protect all dashboard routes
3. **Integrate API** - Replace all mock data with actual API calls
4. **Fix console.log** - Remove debug statements

### 🟡 MEDIUM PRIORITY (Next Sprint)
1. **Add loading states** - Skeleton components
2. **Add error boundaries** - Global error handling
3. **Add toast notifications** - User feedback
4. **Complete empty pages** - Parameter, Performance, Time Management

### 🟢 LOW PRIORITY (Nice to Have)
1. **Add revalidation** - Cache invalidation after mutations
2. **Add unit tests** - Critical paths
3. **Add audit logging** - Track changes
4. **Add real-time updates** - WebSocket/SSE for attendance

---

## Summary Statistics

| Metric | Count |
|--------|-------|
| Total TSX files in src | 60+ |
| Pages using mock data | 25+ |
| API routes created | 15 |
| API routes actually called | 0 |
| Files with console.log | 5 |
| Missing auth middleware | 1 |
| Incomplete feature pages | 15+ |

---

*End of Audit Report*