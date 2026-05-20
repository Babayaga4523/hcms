// HCMS Type Definitions for BNI Finance

// Gender
export type Gender = "MALE" | "FEMALE";

// Employee Status
export type EmployeeStatus = "ACTIVE" | "INACTIVE" | "RESIGNED" | "TERMINATED";

// Attendance Status
export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "SICK" | "ON_LEAVE" | "WFH" | "PERMIT";

// Leave Status
export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

// Overtime Status
export type OvertimeStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

// Work Permission Status
export type WorkPermissionStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

// Appraisal Status
export type AppraisalStatus = "DRAFT" | "SUBMITTED" | "APPROVED";

// Pakta Status
export type PaktaStatus = "PENDING" | "SIGNED" | "EXPIRED";

// Resign Category
export type ResignCategory = "VOLUNTARY" | "INVOLUNTARY" | "RETIREMENT" | "PROBATION";

// Resign Status
export type ResignStatus = "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";

// Clearance Status
export type ClearanceStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

// Department
export interface Department {
  id: string;
  code: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Division
export interface Division {
  id: string;
  code: string;
  name: string;
  departmentId: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  department?: Department;
}

// Position
export interface Position {
  id: string;
  code: string;
  name: string;
  level: number;
  divisionId: string;
  createdAt: Date;
  updatedAt: Date;
  division?: Division;
}

// Leave Type
export interface LeaveType {
  id: string;
  code: string;
  name: string;
  description?: string;
  isPaid: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Employee
export interface Employee {
  id: string;
  nik: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  birthDate: Date;
  phone?: string;
  address?: string;
  positionId: string;
  divisionId: string;
  departmentId: string;
  joinDate: Date;
  status: EmployeeStatus;
  ktpNumber?: string;
  bpjsNumber?: string;
  npwpNumber?: string;
  profilePhoto?: string;
  isLocked: boolean;
  lockedReason?: string;
  createdAt: Date;
  updatedAt: Date;
  position?: Position;
  division?: Division;
  department?: Department;
}

// Attendance
export interface Attendance {
  id: string;
  employeeId: string;
  date: Date;
  clockIn?: Date;
  clockOut?: Date;
  status: AttendanceStatus;
  location?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  employee?: Employee;
}

// Leave
export interface Leave {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  reason?: string;
  status: LeaveStatus;
  approvedBy?: string;
  approvedAt?: Date;
  notes?: string;
  attachmentUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  employee?: Employee;
  leaveType?: LeaveType;
}

// Leave Quota
export interface LeaveQuota {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  year: number;
  totalDays: number;
  usedDays: number;
  createdAt: Date;
  updatedAt: Date;
  employee?: Employee;
  leaveType?: LeaveType;
}

// Overtime
export interface Overtime {
  id: string;
  employeeId: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  totalHours: number;
  reason: string;
  status: OvertimeStatus;
  approvedBy?: string;
  approvedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  employee?: Employee;
}

// Work Permission
export interface WorkPermission {
  id: string;
  employeeId: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  reason: string;
  status: WorkPermissionStatus;
  approvedBy?: string;
  approvedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  employee?: Employee;
}

// Performance Appraisal
export interface PerformanceAppraisal {
  id: string;
  employeeId: string;
  period: string;
  kpiScore: number;
  coreValueScore: number;
  leadershipScore: number;
  overallScore: number;
  notes?: string;
  status: AppraisalStatus;
  createdAt: Date;
  updatedAt: Date;
  employee?: Employee;
}

// Pakta Integritas
export interface PaktaIntegritas {
  id: string;
  employeeId: string;
  assignmentDate: Date;
  dueDate: Date;
  signedDate?: Date;
  status: PaktaStatus;
  fileUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  employee?: Employee;
}

// Resign
export interface Resign {
  id: string;
  employeeId: string;
  requestDate: Date;
  resignDate: Date;
  reason: string;
  category: ResignCategory;
  status: ResignStatus;
  approvedBy?: string;
  approvedAt?: Date;
  notes?: string;
  clearanceStatus: ClearanceStatus;
  createdAt: Date;
  updatedAt: Date;
  employee?: Employee;
}

// Public Holiday
export interface PublicHoliday {
  id: string;
  date: Date;
  name: string;
  description?: string;
  createdAt: Date;
}

// Work Schedule
export interface WorkSchedule {
  id: string;
  name: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isWorking: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Navigation Types
export interface NavItem {
  title: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  children?: NavItem[];
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

// Dashboard Types
export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  lastUpdated: string;
}

export interface GenderAgeData {
  ageGroup: string;
  male: number;
  female: number;
}

export interface LocationData {
  location: string;
  male: number;
  female: number;
  total: number;
}

export interface GenderPercentage {
  gender: string;
  count: number;
  percentage: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// Filter Types
export interface EmployeeFilters {
  search?: string;
  departmentId?: string;
  divisionId?: string;
  positionId?: string;
  status?: EmployeeStatus;
  gender?: Gender;
}

export interface AttendanceFilters {
  employeeId?: string;
  startDate?: Date;
  endDate?: Date;
  status?: AttendanceStatus;
}

export interface LeaveFilters {
  employeeId?: string;
  leaveTypeId?: string;
  status?: LeaveStatus;
  startDate?: Date;
  endDate?: Date;
}
