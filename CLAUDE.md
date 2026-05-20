# HCMS - Human Capital Management System (BNI Finance)

## 1. Project Overview

HCMS adalah sistem manajemen modal manusia (Human Capital Management System) yang dikembangkan untuk BNI Finance. Sistem ini dirancang untuk mengelola seluruh aspek sumber daya manusia termasuk data karyawan, kehadiran, cuti, lembur, penilaian kinerja, dan proses resign.

**Informasi Project:**
- **Nama:** HCMS - BNI Finance
- **Versi:** 0.1.0
- **Type:** Full-stack Web Application (Next.js)
- **Target Users:** HR Admin, Employees, Managers

---

## 2. Tech Stack

### Frontend
| Teknologi | Versi | Deskripsi |
|-----------|-------|-----------|
| Next.js | 16.2.6 | React framework dengan App Router |
| React | 19.2.4 | UI library |
| Tailwind CSS | 4 | Utility-first CSS framework |
| Recharts | 3.8.1 | Charting library |
| Lucide React | 1.16.0 | Icon library |

### Backend & Database
| Teknologi | Versi | Deskripsi |
|-----------|-------|-----------|
| Prisma | 7.8.0 | ORM untuk PostgreSQL |
| PostgreSQL | - | Relational database |
| Zod | 4.4.3 | Schema validation |

### Development Tools
| Teknologi | Deskripsi |
|-----------|-----------|
| TypeScript | Type safety |
| ESLint | Code linting |
| tsx | TypeScript executor |

---

## 3. Architecture Overview

### 3.1 Application Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (dashboard)/             # Route Group: Dashboard pages
│   │   ├── layout.tsx            # Dashboard layout (Sidebar + Header)
│   │   ├── page.tsx             # Dashboard home
│   │   ├── employee/            # Employee module
│   │   ├── company-hierarchy/   # Organization module
│   │   ├── self-service/        # Self-service module
│   │   ├── caretaker-resign/    # Admin resign module
│   │   ├── hc-service/          # HC admin module
│   │   └── resign-report/       # Reporting module
│   ├── api/                      # REST API routes
│   │   ├── employees/
│   │   ├── departments/
│   │   ├── divisions/
│   │   ├── positions/
│   │   ├── leave/
│   │   ├── leave-types/
│   │   ├── attendance/
│   │   ├── overtime/
│   │   ├── resign/
│   │   └── pakta-integritas/
│   └── layout.tsx               # Root layout
├── components/
│   ├── layout/                  # Layout components
│   │   ├── sidebar.tsx         # Navigation sidebar
│   │   ├── header.tsx          # Top header
│   │   └── index.ts            # Exports
│   └── ui/                      # UI components
│       ├── button.tsx           # Button variants
│       ├── badge.tsx            # Badge/label
│       ├── card.tsx             # Card container
│       ├── input.tsx            # Form inputs
│       ├── modal.tsx            # Modal/Dialog
│       ├── data-table.tsx       # Data table
│       ├── chart.tsx           # Chart wrapper
│       └── page-components.tsx # Page helpers
└── lib/
    ├── prisma.ts                # Prisma client singleton
    ├── utils.ts                # Utility functions
    └── api-utils.ts             # API response helpers
```

### 3.2 Design Pattern

**Component Architecture:**
- Atomic Design: Components diorganisir berdasarkan kompleksitas
- Composition Pattern: Komponen kecil dikomposisi menjadi komponen besar
- DRY Principle: Shared logic di-extract ke custom hooks/utils

**State Management:**
- React Server Components untuk data fetching
- Client Components dengan useState/useEffect untuk interaksi
- Context API untuk global state (sidebar, theme)

**API Pattern:**
- RESTful API dengan JSON responses
- Consistent response format dengan success/error structure
- Pagination support untuk list endpoints

---

## 4. Database Schema

### 4.1 Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   Department     │──────<│    Division      │──────<│    Position      │
│   - id           │       │   - id           │       │   - id           │
│   - code         │       │   - code         │       │   - code         │
│   - name         │       │   - name         │       │   - name         │
│   - description  │       │   - departmentId │       │   - level        │
└─────────────────┘       │   - description  │       │   - divisionId   │
                         └─────────────────┘       └─────────────────┘
                                │
                                │
                                ▼
                         ┌─────────────────┐
                         │    Employee     │
                         │   - id          │
                         │   - nik         │
                         │   - email       │
                         │   - firstName   │
                         │   - lastName    │
                         │   - gender      │
                         │   - birthDate   │
                         │   - phone       │
                         │   - address     │
                         │   - positionId  │
                         │   - divisionId  │
                         │   - departmentId│
                         │   - joinDate    │
                         │   - status      │
                         │   - ktpNumber   │
                         │   - bpjsNumber  │
                         │   - npwpNumber  │
                         │   - profilePhoto │
                         │   - isLocked    │
                         └────────┬────────┘
                                  │
        ┌──────────────────────────┼──────────────────────────┐
        │                          │                          │
        ▼                          ▼                          ▼
┌───────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Attendance   │    │      Leave       │    │    Overtime     │
│   - id        │    │    - id          │    │    - id         │
│   - employeeId│    │    - employeeId   │    │    - employeeId  │
│   - date      │    │    - leaveTypeId │    │    - date       │
│   - clockIn   │    │    - startDate   │    │    - startTime  │
│   - clockOut  │    │    - endDate     │    │    - endTime    │
│   - status    │    │    - totalDays   │    │    - totalHours  │
│   - location  │    │    - reason       │    │    - reason      │
│   - notes     │    │    - status       │    │    - status      │
└───────────────┘    │    - approvedBy   │    │    - approvedBy  │
                      │    - approvedAt    │    │    - approvedAt  │
                      │    - notes        │    │    - notes       │
                      └────────┬──────────┘    └─────────────────┘
                               │
                      ┌────────┴──────────┐
                      │   LeaveQuota        │
                      │   - id             │
                      │   - employeeId     │
                      │   - leaveTypeId   │
                      │   - year          │
                      │   - totalDays     │
                      │   - usedDays      │
                      └───────────────────┘
```

### 4.2 Table Definitions

#### Reference Tables

**Department**
| Field | Type | Constraints | Description |
|-------|------|------------|-------------|
| id | String | PK, cuid() | Unique identifier |
| code | String | Unique | Department code |
| name | String | - | Department name |
| description | String | Nullable | Department description |
| createdAt | DateTime | Default now | Creation timestamp |
| updatedAt | DateTime | Auto | Last update timestamp |

**Division**
| Field | Type | Constraints | Description |
|-------|------|------------|-------------|
| id | String | PK, cuid() | Unique identifier |
| code | String | Unique | Division code |
| name | String | - | Division name |
| departmentId | String | FK | Reference to Department |
| description | String | Nullable | Division description |
| createdAt | DateTime | Default now | Creation timestamp |
| updatedAt | DateTime | Auto | Last update timestamp |

**Position**
| Field | Type | Constraints | Description |
|-------|------|------------|-------------|
| id | String | PK, cuid() | Unique identifier |
| code | String | Unique | Position code |
| name | String | - | Position name |
| level | Int | Default 1 | Position level |
| divisionId | String | FK | Reference to Division |
| createdAt | DateTime | Default now | Creation timestamp |
| updatedAt | DateTime | Auto | Last update timestamp |

**LeaveType**
| Field | Type | Constraints | Description |
|-------|------|------------|-------------|
| id | String | PK, cuid() | Unique identifier |
| code | String | Unique | Leave type code |
| name | String | - | Leave type name |
| description | String | Nullable | Type description |
| isPaid | Boolean | Default true | Paid leave flag |
| createdAt | DateTime | Default now | Creation timestamp |
| updatedAt | DateTime | Auto | Last update timestamp |

#### Core Tables

**Employee**
| Field | Type | Constraints | Description |
|-------|------|------------|-------------|
| id | String | PK, cuid() | Unique identifier |
| nik | String | Unique | Employee NIK |
| email | String | Unique | Employee email |
| firstName | String | - | First name |
| lastName | String | - | Last name |
| gender | Gender | Enum | MALE, FEMALE |
| birthDate | DateTime | @db.Date | Birth date |
| phone | String | Nullable | Phone number |
| address | String | Nullable | Home address |
| positionId | String | FK | Reference to Position |
| divisionId | String | FK | Reference to Division |
| departmentId | String | FK | Reference to Department |
| joinDate | DateTime | @db.Date | Join date |
| status | EmployeeStatus | Default ACTIVE | Employment status |
| ktpNumber | String | Nullable | ID card number |
| bpjsNumber | String | Nullable | BPJS number |
| npwpNumber | String | Nullable | Tax ID |
| profilePhoto | String | Nullable | Photo URL |
| isLocked | Boolean | Default false | Account lock status |
| lockedReason | String | Nullable | Lock reason |
| createdAt | DateTime | Default now | Creation timestamp |
| updatedAt | DateTime | Auto | Last update timestamp |

**Attendance**
| Field | Type | Constraints | Description |
|-------|------|------------|-------------|
| id | String | PK, cuid() | Unique identifier |
| employeeId | String | FK | Reference to Employee |
| date | DateTime | @db.Date, Unique | Attendance date |
| clockIn | DateTime | Nullable | Check-in time |
| clockOut | DateTime | Nullable | Check-out time |
| status | AttendanceStatus | Enum | PRESENT, ABSENT, LATE, etc. |
| location | String | Nullable | Location info |
| notes | String | Nullable | Additional notes |

**Leave**
| Field | Type | Constraints | Description |
|-------|------|------------|-------------|
| id | String | PK, cuid() | Unique identifier |
| employeeId | String | FK | Reference to Employee |
| leaveTypeId | String | FK | Reference to LeaveType |
| startDate | DateTime | @db.Date | Leave start |
| endDate | DateTime | @db.Date | Leave end |
| totalDays | Int | - | Total leave days |
| reason | String | Nullable | Leave reason |
| status | LeaveStatus | Default PENDING | Approval status |
| approvedBy | String | Nullable | Approver ID |
| approvedAt | DateTime | Nullable | Approval time |
| notes | String | Nullable | Admin notes |
| attachmentUrl | String | Nullable | Attachment |

**LeaveQuota**
| Field | Type | Constraints | Description |
|-------|------|------------|-------------|
| id | String | PK, cuid() | Unique identifier |
| employeeId | String | FK | Reference to Employee |
| leaveTypeId | String | FK | Reference to LeaveType |
| year | Int | - | Year |
| totalDays | Int | - | Total quota |
| usedDays | Int | Default 0 | Used days |

**Overtime**
| Field | Type | Constraints | Description |
|-------|------|------------|-------------|
| id | String | PK, cuid() | Unique identifier |
| employeeId | String | FK | Reference to Employee |
| date | DateTime | @db.Date | Overtime date |
| startTime | DateTime | - | Start time |
| endTime | DateTime | - | End time |
| totalHours | Float | - | Total hours |
| reason | String | - | Overtime reason |
| status | OvertimeStatus | Default PENDING | Approval status |
| approvedBy | String | Nullable | Approver ID |
| approvedAt | DateTime | Nullable | Approval time |
| notes | String | Nullable | Admin notes |

**WorkPermission**
| Field | Type | Constraints | Description |
|-------|------|------------|-------------|
| id | String | PK, cuid() | Unique identifier |
| employeeId | String | FK | Reference to Employee |
| date | DateTime | @db.Date | Permission date |
| startTime | DateTime | - | Start time |
| endTime | DateTime | - | End time |
| reason | String | - | Permission reason |
| status | WorkPermissionStatus | Default PENDING | Approval status |
| approvedBy | String | Nullable | Approver ID |
| approvedAt | DateTime | Nullable | Approval time |
| notes | String | Nullable | Admin notes |

**PerformanceAppraisal**
| Field | Type | Constraints | Description |
|-------|------|------------|-------------|
| id | String | PK, cuid() | Unique identifier |
| employeeId | String | FK | Reference to Employee |
| period | String | - | Appraisal period (e.g., "2026-Q1") |
| kpiScore | Float | - | KPI score |
| coreValueScore | Float | - | Core value score |
| leadershipScore | Float | - | Leadership score |
| overallScore | Float | - | Calculated overall |
| notes | String | Nullable | Additional notes |
| status | AppraisalStatus | Default DRAFT | Status |

**PaktaIntegritas**
| Field | Type | Constraints | Description |
|-------|------|------------|-------------|
| id | String | PK, cuid() | Unique identifier |
| employeeId | String | FK | Reference to Employee |
| assignmentDate | DateTime | @db.Date | Assignment date |
| dueDate | DateTime | @db.Date | Due date |
| signedDate | DateTime | Nullable | Signed date |
| status | PaktaStatus | Default PENDING | Status |
| fileUrl | String | Nullable | Signed file |

**Resign**
| Field | Type | Constraints | Description |
|-------|------|------------|-------------|
| id | String | PK, cuid() | Unique identifier |
| employeeId | String | FK | Reference to Employee |
| requestDate | DateTime | @db.Date | Request date |
| resignDate | DateTime | @db.Date | Effective date |
| reason | String | - | Resign reason |
| category | ResignCategory | Enum | VOLUNTARY, INVOLUNTARY, etc. |
| status | ResignStatus | Default PENDING | Approval status |
| approvedBy | String | Nullable | Approver ID |
| approvedAt | DateTime | Nullable | Approval time |
| notes | String | Nullable | Admin notes |
| clearanceStatus | ClearanceStatus | Default PENDING | Clearance status |

### 4.3 Enum Types

```prisma
enum Gender {
  MALE
  FEMALE
}

enum EmployeeStatus {
  ACTIVE
  INACTIVE
  RESIGNED
  TERMINATED
}

enum AttendanceStatus {
  PRESENT
  ABSENT
  LATE
  SICK
  ON_LEAVE
  WFH
  PERMIT
}

enum LeaveStatus {
  PENDING
  APPROVED
  REJECTED
  CANCELLED
}

enum OvertimeStatus {
  PENDING
  APPROVED
  REJECTED
  CANCELLED
}

enum WorkPermissionStatus {
  PENDING
  APPROVED
  REJECTED
  CANCELLED
}

enum AppraisalStatus {
  DRAFT
  SUBMITTED
  APPROVED
}

enum PaktaStatus {
  PENDING
  SIGNED
  EXPIRED
}

enum ResignCategory {
  VOLUNTARY
  INVOLUNTARY
  RETIREMENT
  PROBATION
}

enum ResignStatus {
  PENDING
  APPROVED
  REJECTED
  COMPLETED
}

enum ClearanceStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
}
```

---

## 5. Module Structure

### 5.1 Dashboard Module (`/`)

**Halaman:** `src/app/(dashboard)/page.tsx`

**Fitur:**
- Overview statistik karyawan
- Grafik distribusi (age, gender, department)
- Things to do list
- Recent activities
- Quick alerts
- User profile card

### 5.2 Employee Module (`/employee`)

**Halaman:**
- `/employee` - List semua karyawan dengan DataTable
- `/employee/working-days` - Manajemen hari kerja

**Fitur:**
- CRUD employee
- Filter by status, department, division
- Search by NIK, name, email
- Lock/unlock user
- View employee details

### 5.3 Organization Module (`/company-hierarchy`)

**Halaman:** `/company-hierarchy`

**Fitur:**
- Tree view organisasi
- Hierarchy visualization (Department → Division → Position)

### 5.4 Self Service Module (`/self-service`)

**Halaman:**

| Route | Description |
|-------|-------------|
| `/self-service/attendance` | Check-in/out attendance |
| `/self-service/leave/request` | Request cuti baru |
| `/self-service/leave/history` | Riwayat pengajuan cuti |
| `/self-service/leave/information` | Informasi kuota cuti |
| `/self-service/work-of-permission/request` | Request izin kerja |
| `/self-service/work-of-permission/history` | Riwayat izin |
| `/self-service/overtime/request` | Request lembur |
| `/self-service/overtime/history` | Riwayat lembur |
| `/self-service/performance-appraisal/assignment` | Penugasan penilaian |
| `/self-service/performance-appraisal/history` | Riwayat penilaian |
| `/self-service/pakta-integritas/assignment` | Penugasan pakta |
| `/self-service/pakta-integritas/history` | Riwayat pakta |
| `/self-service/resign` | Pengajuan resign |

### 5.5 HC Service Module (`/hc-service`)

**Halaman:**

| Route | Description |
|-------|-------------|
| `/hc-service/attendance` | Manajemen kehadiran |
| `/hc-service/leave-admin/master-parameter` | Parameter cuti |
| `/hc-service/leave-admin/generate-quota` | Generate kuota |
| `/hc-service/leave-admin/adjustment` | Adjustment cuti |
| `/hc-service/performance/kpi` | Manajemen KPI |
| `/hc-service/performance/core-value` | Core value |
| `/hc-service/performance/leadership` | Leadership |
| `/hc-service/time-management/schedules` | Jadwal kerja |
| `/hc-service/time-management/holiday` | Hari libur |
| `/hc-service/resign-claim/claim` | Klaim resign |
| `/hc-service/resign-claim/release` | Release resign |
| `/hc-service/report` | Laporan |
| `/hc-service/forward-task` | Forward task |
| `/hc-service/user-locked` | User terkunci |
| `/hc-service/parameter/position` | Parameter posisi |
| `/hc-service/parameter/department` | Parameter departemen |
| `/hc-service/parameter/division` | Parameter divisi |
| `/hc-service/parameter/kye/*` | Know Your Employee |
| `/hc-service/parameter/approval-level` | Level approval |
| `/hc-service/parameter/pakta/*` | Parameter pakta |
| `/hc-service/inquiry` | Inquiry |

### 5.6 Caretaker Resign (`/caretaker-resign`)

**Halaman:**
- `/caretaker-resign/request` - Request resign (admin)
- `/caretaker-resign/history` - History resign

### 5.7 Reports (`/resign-report`)

**Halaman:** `/resign-report`

---

## 6. API Documentation

### 6.1 Response Format

**Success Response:**
```typescript
{
  success: true,
  data: T,
  message?: string
}
```

**Paginated Response:**
```typescript
{
  success: true,
  data: T[],
  pagination: {
    page: number,
    pageSize: number,
    total: number,
    totalPages: number
  }
}
```

**Error Response:**
```typescript
{
  success: false,
  error: string
}
```

### 6.2 API Utilities

| Function | Status | Description |
|----------|--------|-------------|
| `successResponse(data)` | 200 | Success response |
| `createdResponse(data)` | 201 | Created response |
| `noContentResponse()` | 204 | No content |
| `errorResponse(message, status)` | Custom | Error response |
| `notFoundResponse()` | 404 | Not found |
| `unauthorizedResponse()` | 401 | Unauthorized |
| `forbiddenResponse()` | 403 | Forbidden |
| `serverErrorResponse()` | 500 | Server error |
| `paginatedResponse(data, page, pageSize, total)` | 200 | Paginated |
| `getPaginationParams(searchParams)` | - | Parse pagination |
| `getSortParams(searchParams, fields)` | - | Parse sorting |
| `getFilterParams(searchParams, fields)` | - | Parse filters |

### 6.3 API Endpoints

#### Employees
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees` | List employees (paginated) |
| POST | `/api/employees` | Create employee |
| GET | `/api/employees/[id]` | Get employee |
| PUT | `/api/employees/[id]` | Update employee |
| DELETE | `/api/employees/[id]` | Delete employee |

#### Departments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/departments` | List departments |
| POST | `/api/departments` | Create department |
| PUT | `/api/departments/[id]` | Update department |
| DELETE | `/api/departments/[id]` | Delete department |

#### Divisions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/divisions` | List divisions |
| POST | `/api/divisions` | Create division |
| PUT | `/api/divisions/[id]` | Update division |
| DELETE | `/api/divisions/[id]` | Delete division |

#### Positions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/positions` | List positions |
| POST | `/api/positions` | Create position |
| PUT | `/api/positions/[id]` | Update position |
| DELETE | `/api/positions/[id]` | Delete position |

#### Leave
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leave` | List leave requests |
| POST | `/api/leave` | Create leave request |
| GET | `/api/leave/[id]` | Get leave |
| PUT | `/api/leave/[id]` | Update leave |
| DELETE | `/api/leave/[id]` | Delete leave |
| GET | `/api/leave/quota` | Get leave quota |
| GET | `/api/leave-types` | List leave types |

#### Attendance
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/attendance` | List attendance |
| POST | `/api/attendance` | Create attendance |

#### Overtime
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/overtime` | List overtime |
| POST | `/api/overtime` | Create overtime |
| GET | `/api/overtime/[id]` | Get overtime |
| PUT | `/api/overtime/[id]` | Update overtime |

#### Resign
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/resign` | List resign |
| POST | `/api/resign` | Create resign |
| GET | `/api/resign/[id]` | Get resign |
| PUT | `/api/resign/[id]` | Update resign |

#### Pakta Integritas
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/pakta-integritas` | List pakta |
| POST | `/api/pakta-integritas` | Create pakta |
| GET | `/api/pakta-integritas/[id]` | Get pakta |
| PUT | `/api/pakta-integritas/[id]` | Update pakta |

---

## 7. UI Components

### 7.1 Component List

| Component | File | Variants |
|-----------|------|----------|
| Button | `button.tsx` | primary, secondary, ghost, danger, success, warning, link, outline |
| Badge | `badge.tsx` | default, secondary, success, warning, danger, info, soft |
| Card | `card.tsx` | default, with variants via props |
| Input | `input.tsx` | text, textarea, select, checkbox, radio |
| Modal | `modal.tsx` | modal, drawer, slideover, confirmDialog |
| DataTable | `data-table.tsx` | sortable, filterable, paginated |

### 7.2 Button Variants

```tsx
// Sizes: xs, sm, md, lg, xl, icon, icon-sm, icon-lg
<Button variant="primary" size="md">Save</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="danger">Delete</Button>
<Button variant="ghost">View</Button>
<Button variant="success">Approve</Button>
<Button variant="warning">Pending</Button>
<Button variant="outline">Outline</Button>
```

### 7.3 Form Components

```tsx
// Input with label and validation
<Input
  label="Email"
  type="email"
  placeholder="Enter email"
  required
  error={errors.email}
/>

// Select with options
<Select
  label="Department"
  options={[
    { value: "dept1", label: "Finance" },
    { value: "dept2", label: "HR" },
  ]}
  placeholder="Select department"
/>

// Textarea
<Textarea
  label="Description"
  placeholder="Enter description"
  rows={4}
/>
```

### 7.4 DataTable Usage

```tsx
<DataTable
  data={employees}
  columns={[
    { key: "nik", header: "NIK", sortable: true },
    { key: "name", header: "Name", render: (row) => `${row.firstName} ${row.lastName}` },
    { key: "status", header: "Status", render: (row) => <Badge status={row.status} /> },
  ]}
  keyExtractor={(row) => row.id}
  pagination={{
    page,
    pageSize,
    total,
    onPageChange: setPage,
  }}
  sorting={{
    column: sortBy,
    direction: sortOrder,
    onSort: handleSort,
  }}
/>
```

---

## 8. Design System

### 8.1 Color Palette (BNI Theme)

| Name | Hex | Usage |
|------|-----|-------|
| Primary | #1A2B6B | Main buttons, headers |
| Primary Dark | #152454 | Hover states |
| Accent | #E8A020 | Highlights, badges |
| Background | #F4F6FB | Page background |
| Surface | #FFFFFF | Cards, modals |
| Border | #E5E7EB | Borders, dividers |
| Text Primary | #1A1A2E | Headings |
| Text Secondary | #6B7280 | Body text |
| Text Muted | #9CA3AF | Captions |
| Success | #10B981 | Success states |
| Warning | #E8A020 | Warning states |
| Danger | #EF4444 | Error states |

### 8.2 Typography

| Element | Size | Weight |
|---------|------|--------|
| H1 | 2xl (24px) | Bold |
| H2 | xl (20px) | Bold |
| H3 | lg (18px) | Semibold |
| Body | sm (14px) | Normal |
| Caption | xs (12px) | Normal |
| Small | 10px | Normal |

### 8.3 Spacing

| Name | Value | Usage |
|------|-------|-------|
| xs | 4px | Tight spacing |
| sm | 8px | Small gaps |
| md | 16px | Default padding |
| lg | 24px | Section spacing |
| xl | 32px | Large gaps |

### 8.4 Layout Specs

| Element | Value |
|---------|-------|
| Sidebar Width | 260px |
| Header Height | 60px |
| Card Padding | 20px (p-5) |
| Border Radius | 12px (rounded-xl) |

---

## 9. Utility Functions

### 9.1 `src/lib/utils.ts`

```typescript
// Classname merge
cn("px-2", "py-1", condition && "bg-red") // => "px-2 py-1 bg-red"

// Date formatting
formatDate(date, "short")  // => "21/05/2026"
formatDate(date, "long")   // => "21 Mei 2026"
formatDate(date, "iso")    // => "2026-05-21"

// Status colors
getStatusColor("ACTIVE")   // => { bg, text, border }
getStatusColor("PENDING") // => { bg, text, border }
```

### 9.2 `src/lib/api-utils.ts`

```typescript
// Pagination
const { page, pageSize, skip } = getPaginationParams(searchParams)

// Sorting
const orderBy = getSortParams(searchParams, ["name", "createdAt"])

// Filtering
const filters = getFilterParams(searchParams, ["status", "departmentId"])
```

---

## 10. Development Guide

### 10.1 Available Scripts

```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push schema to database
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio
npm run db:generate # Generate Prisma client
```

### 10.2 Database Setup

```bash
# 1. Configure .env
DATABASE_URL="postgresql://user:password@localhost:5432/hcms"

# 2. Initialize Prisma
npx prisma init

# 3. Push schema
npm run db:push

# 4. Generate client
npm run db:generate

# 5. Seed data (optional)
npm run db:seed
```

### 10.3 Adding New Module

1. **Create page routes** in `src/app/(dashboard)/`
2. **Add API routes** in `src/app/api/`
3. **Add Prisma model** in `prisma/schema.prisma`
4. **Create components** in `src/components/ui/`
5. **Add navigation** to sidebar `src/components/layout/sidebar.tsx`

### 10.4 Code Conventions

- **Components:** PascalCase (e.g., `EmployeeList.tsx`)
- **Hooks:** camelCase with `use` prefix (e.g., `useEmployees.ts`)
- **Utils:** camelCase (e.g., `formatDate.ts`)
- **API Routes:** kebab-case (e.g., `employee-status.ts`)
- **CSS Classes:** Tailwind utilities, lowercase

---

## 11. File Naming Convention

| Type | Convention | Example |
|------|------------|---------|
| Pages | kebab-case | `employee-list.tsx` |
| Components | PascalCase | `EmployeeCard.tsx` |
| Utils | camelCase | `formatDate.ts` |
| Hooks | use + PascalCase | `useAuth.ts` |
| Types | PascalCase | `types.ts` |

---

## 12. Environment Variables

```bash
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/hcms"
```

---

## 13. Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## 14. Performance Considerations

- Use React Server Components for data fetching
- Implement proper caching strategies
- Optimize images with next/image
- Use dynamic imports for heavy components
- Implement proper pagination for large datasets

---

## 15. Security Considerations

- Validate all user inputs with Zod
- Use parameterized queries (Prisma handles this)
- Implement proper authentication/authorization
- Sanitize outputs to prevent XSS
- Use HTTPS in production
