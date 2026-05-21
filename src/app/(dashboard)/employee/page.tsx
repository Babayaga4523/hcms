"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Select } from "@/components/ui/input";
import { DataTable, Column } from "@/components/ui/data-table";
import { Modal, Drawer } from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Search,
  Plus,
  Filter,
  Download,
  Edit,
  Trash2,
  Eye,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building2,
  Loader2,
  AlertCircle,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============ Types ============
interface Employee {
  id: string;
  nik: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: "MALE" | "FEMALE";
  birthDate: string;
  phone?: string;
  address?: string;
  position: { id: string; code: string; name: string };
  division: { id: string; code: string; name: string };
  department: { id: string; code: string; name: string };
  joinDate: string;
  status: "ACTIVE" | "INACTIVE" | "RESIGNED" | "TERMINATED";
}

interface Department {
  id: string;
  code: string;
  name: string;
}

interface Position {
  id: string;
  code: string;
  name: string;
}

interface Division {
  id: string;
  code: string;
  name: string;
}

// ============ API Functions ============
async function fetchEmployees(params: URLSearchParams): Promise<{
  data: Employee[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
}> {
  const response = await fetch(`/api/employees?${params.toString()}`, {
    credentials: "include",
  });

  if (!response.ok) {
    if (response.status === 401) {
      window.location.href = "/login";
    }
    throw new Error("Failed to fetch employees");
  }

  return response.json();
}

async function fetchDepartments(): Promise<Department[]> {
  const response = await fetch("/api/departments", { credentials: "include" });
  if (!response.ok) return [];
  const result = await response.json();
  return result.data || [];
}

async function fetchDivisions(): Promise<Division[]> {
  const response = await fetch("/api/divisions", { credentials: "include" });
  if (!response.ok) return [];
  const result = await response.json();
  return result.data || [];
}

async function fetchPositions(): Promise<Position[]> {
  const response = await fetch("/api/positions", { credentials: "include" });
  if (!response.ok) return [];
  const result = await response.json();
  return result.data || [];
}

async function createEmployee(data: Partial<Employee>): Promise<Employee | null> {
  const response = await fetch("/api/employees", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.error || "Failed to create employee");
  }

  const result = await response.json();
  return result.data;
}

async function updateEmployee(id: string, data: Partial<Employee>): Promise<Employee | null> {
  const response = await fetch(`/api/employees/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.error || "Failed to update employee");
  }

  const result = await response.json();
  return result.data;
}

async function deleteEmployee(id: string): Promise<boolean> {
  const response = await fetch(`/api/employees/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  return response.ok;
}

// ============ Employee Detail Component ============
function EmployeeDetail({ employee, onClose }: { employee: Employee; onClose: () => void }) {
  const [activeTab, setActiveTab] = React.useState<"personal" | "employment" | "documents" | "history">("personal");

  const tabs = [
    { id: "personal", label: "Personal Info" },
    { id: "employment", label: "Employment" },
    { id: "documents", label: "Documents" },
    { id: "history", label: "History" },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 p-6 border-b border-[#E5E7EB]">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1A2B6B] text-white text-xl font-bold">
          {employee.firstName[0]}{employee.lastName[0]}
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-[#1A1A2E]">
            {employee.firstName} {employee.lastName}
          </h2>
          <p className="text-sm text-[#6B7280]">
            {employee.position.name} - {employee.division.name}
          </p>
          <Badge status={employee.status} className="mt-1">
            {employee.status}
          </Badge>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E5E7EB]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={cn(
              "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
              activeTab === tab.id
                ? "border-[#1A2B6B] text-[#1A2B6B]"
                : "border-transparent text-[#6B7280] hover:text-[#1A1A2E]"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "personal" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-[#6B7280] mt-0.5" />
                <div>
                  <p className="text-xs text-[#6B7280]">NIK</p>
                  <p className="text-sm font-medium">{employee.nik}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-[#6B7280] mt-0.5" />
                <div>
                  <p className="text-xs text-[#6B7280]">Email</p>
                  <p className="text-sm font-medium">{employee.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-[#6B7280] mt-0.5" />
                <div>
                  <p className="text-xs text-[#6B7280]">Phone</p>
                  <p className="text-sm font-medium">{employee.phone || "-"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#6B7280] mt-0.5" />
                <div>
                  <p className="text-xs text-[#6B7280]">Address</p>
                  <p className="text-sm font-medium">{employee.address || "-"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-[#6B7280] mt-0.5" />
                <div>
                  <p className="text-xs text-[#6B7280]">Birth Date</p>
                  <p className="text-sm font-medium">
                    {employee.birthDate ? format(new Date(employee.birthDate), "dd MMMM yyyy", { locale: id }) : "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-[#6B7280] mt-0.5" />
                <div>
                  <p className="text-xs text-[#6B7280]">Gender</p>
                  <p className="text-sm font-medium">{employee.gender === "MALE" ? "Male" : "Female"}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "employment" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-[#6B7280] mt-0.5" />
                <div>
                  <p className="text-xs text-[#6B7280]">Department</p>
                  <p className="text-sm font-medium">{employee.department.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-[#6B7280] mt-0.5" />
                <div>
                  <p className="text-xs text-[#6B7280]">Division</p>
                  <p className="text-sm font-medium">{employee.division.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-[#6B7280] mt-0.5" />
                <div>
                  <p className="text-xs text-[#6B7280]">Position</p>
                  <p className="text-sm font-medium">{employee.position.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-[#6B7280] mt-0.5" />
                <div>
                  <p className="text-xs text-[#6B7280]">Join Date</p>
                  <p className="text-sm font-medium">
                    {employee.joinDate ? format(new Date(employee.joinDate), "dd MMMM yyyy", { locale: id }) : "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "documents" && (
          <div className="text-center py-8 text-[#6B7280]">
            <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No documents uploaded</p>
          </div>
        )}

        {activeTab === "history" && (
          <div className="text-center py-8 text-[#6B7280]">
            <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No history available</p>
          </div>
        )}
      </div>
    </div>
  );
}

import { FileText, Clock } from "lucide-react";

// ============ Add Employee Form ============
function AddEmployeeForm({
  onClose,
  onSuccess,
  departments,
  divisions,
  positions,
}: {
  onClose: () => void;
  onSuccess: () => void;
  departments: Department[];
  divisions: Division[];
  positions: Position[];
}) {
  const [formData, setFormData] = React.useState({
    nik: "",
    firstName: "",
    lastName: "",
    email: "",
    gender: "MALE" as "MALE" | "FEMALE",
    birthDate: "",
    phone: "",
    address: "",
    departmentId: "",
    divisionId: "",
    positionId: "",
    joinDate: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createEmployee(formData);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="NIK"
          value={formData.nik}
          onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
          required
          placeholder="e.g. BNI001"
        />
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          placeholder="email@bnifinance.co.id"
        />
        <Input
          label="First Name"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          required
        />
        <Input
          label="Last Name"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          required
        />
        <Select
          label="Gender"
          value={formData.gender}
          onChange={(e) => setFormData({ ...formData, gender: e.target.value as "MALE" | "FEMALE" })}
          options={[
            { value: "MALE", label: "Male" },
            { value: "FEMALE", label: "Female" },
          ]}
        />
        <Input
          label="Birth Date"
          type="date"
          value={formData.birthDate}
          onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
          required
        />
        <Input
          label="Phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="08xxxxxxxxxx"
        />
        <Input
          label="Address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />
        <Select
          label="Department"
          value={formData.departmentId}
          onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
          options={[
            { value: "", label: "Select Department" },
            ...departments.map((d) => ({ value: d.id, label: d.name })),
          ]}
        />
        <Select
          label="Division"
          value={formData.divisionId}
          onChange={(e) => setFormData({ ...formData, divisionId: e.target.value })}
          options={[
            { value: "", label: "Select Division" },
            ...divisions.map((d) => ({ value: d.id, label: d.name })),
          ]}
        />
        <Select
          label="Position"
          value={formData.positionId}
          onChange={(e) => setFormData({ ...formData, positionId: e.target.value })}
          options={[
            { value: "", label: "Select Position" },
            ...positions.map((p) => ({ value: p.id, label: p.name })),
          ]}
        />
        <Input
          label="Join Date"
          type="date"
          value={formData.joinDate}
          onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
          required
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E7EB]">
        <Button variant="secondary" onClick={onClose} type="button">
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Save Employee
        </Button>
      </div>
    </form>
  );
}

// ============ Edit Employee Form ============
function EditEmployeeForm({
  employee,
  onClose,
  onSuccess,
  departments,
  divisions,
  positions,
}: {
  employee: Employee;
  onClose: () => void;
  onSuccess: () => void;
  departments: Department[];
  divisions: Division[];
  positions: Position[];
}) {
  const [formData, setFormData] = React.useState({
    nik: employee.nik,
    firstName: employee.firstName,
    lastName: employee.lastName,
    email: employee.email,
    gender: employee.gender,
    birthDate: employee.birthDate ? new Date(employee.birthDate).toISOString().split("T")[0] : "",
    phone: employee.phone || "",
    address: employee.address || "",
    departmentId: employee.department.id,
    divisionId: employee.division.id,
    positionId: employee.position.id,
    joinDate: employee.joinDate ? new Date(employee.joinDate).toISOString().split("T")[0] : "",
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await updateEmployee(employee.id, formData);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="NIK"
          value={formData.nik}
          onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
          required
          placeholder="e.g. BNI001"
        />
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          placeholder="email@bnifinance.co.id"
        />
        <Input
          label="First Name"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          required
        />
        <Input
          label="Last Name"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          required
        />
        <Select
          label="Gender"
          value={formData.gender}
          onChange={(e) => setFormData({ ...formData, gender: e.target.value as "MALE" | "FEMALE" })}
          options={[
            { value: "MALE", label: "Male" },
            { value: "FEMALE", label: "Female" },
          ]}
        />
        <Input
          label="Birth Date"
          type="date"
          value={formData.birthDate}
          onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
          required
        />
        <Input
          label="Phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="08xxxxxxxxxx"
        />
        <Input
          label="Address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />
        <Select
          label="Department"
          value={formData.departmentId}
          onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
          options={[
            { value: "", label: "Select Department" },
            ...departments.map((d) => ({ value: d.id, label: d.name })),
          ]}
        />
        <Select
          label="Division"
          value={formData.divisionId}
          onChange={(e) => setFormData({ ...formData, divisionId: e.target.value })}
          options={[
            { value: "", label: "Select Division" },
            ...divisions.map((d) => ({ value: d.id, label: d.name })),
          ]}
        />
        <Select
          label="Position"
          value={formData.positionId}
          onChange={(e) => setFormData({ ...formData, positionId: e.target.value })}
          options={[
            { value: "", label: "Select Position" },
            ...positions.map((p) => ({ value: p.id, label: p.name })),
          ]}
        />
        <Input
          label="Join Date"
          type="date"
          value={formData.joinDate}
          onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
          required
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E7EB]">
        <Button variant="secondary" onClick={onClose} type="button">
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Update Employee
        </Button>
      </div>
    </form>
  );
}

// ============ Main Page Component ============
export default function EmployeeDataPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [employees, setEmployees] = React.useState<Employee[]>([]);
  const [departments, setDepartments] = React.useState<Department[]>([]);
  const [divisions, setDivisions] = React.useState<Division[]>([]);
  const [positions, setPositions] = React.useState<Position[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [departmentFilter, setDepartmentFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [employeeToEdit, setEmployeeToEdit] = React.useState<Employee | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = React.useState<Employee | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [totalCount, setTotalCount] = React.useState(0);

  // Fetch employees and reference data
  React.useEffect(() => {
    async function loadData() {
      if (status !== "authenticated") return;

      setLoading(true);
      setError(null);

      try {
        // Load reference data in parallel
        const [deptData, divData, posData] = await Promise.all([
          fetchDepartments(),
          fetchDivisions(),
          fetchPositions(),
        ]);

        setDepartments(deptData);
        setDivisions(divData);
        setPositions(posData);
      } catch (err) {
        setError("Failed to load reference data");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [status]);

  // Fetch employees when filters/page change
  React.useEffect(() => {
    async function loadEmployees() {
      if (status !== "authenticated") return;

      setLoading(true);

      try {
        const params = new URLSearchParams();
        params.set("page", String(currentPage));
        params.set("pageSize", String(pageSize));

        if (searchQuery) params.set("search", searchQuery);
        if (departmentFilter) params.set("departmentId", departmentFilter);
        if (statusFilter) params.set("status", statusFilter);

        const result = await fetchEmployees(params);

        setEmployees(result.data);
        setTotalCount(result.pagination.total);
      } catch (err) {
        setError("Failed to load employees");
      } finally {
        setLoading(false);
      }
    }

    loadEmployees();
  }, [status, currentPage, pageSize, searchQuery, departmentFilter, statusFilter]);

  // Table columns
  const columns: Column<Employee>[] = [
    {
      key: "nik",
      header: "NIK",
      width: "80px",
    },
    {
      key: "name",
      header: "Name",
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1A2B6B] text-white text-[10px] font-semibold">
            {row.firstName[0]}{row.lastName[0]}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-[#1A1A2E] truncate max-w-[120px] md:max-w-[160px]">{row.firstName} {row.lastName}</p>
            <p className="text-[11px] text-[#6B7280] truncate max-w-[120px] md:max-w-[160px]">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "position",
      header: "Position",
      render: (row) => row.position.name,
    },
    {
      key: "department",
      header: "Department",
      render: (row) => row.department.name,
    },
    {
      key: "division",
      header: "Division",
      render: (row) => row.division.name,
    },
    {
      key: "joinDate",
      header: "Join Date",
      render: (row) => format(new Date(row.joinDate), "dd/MM/yyyy"),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <Badge status={row.status} className="text-[10px] px-2 py-0.5">{row.status}</Badge>,
    },
    {
      key: "actions",
      header: "Actions",
      width: "100px",
      align: "right",
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => router.push(`/employee/${row.id}`)}
            className="p-1.5 hover:bg-gray-100 rounded text-[#6B7280] hover:text-[#1A2B6B]"
            title="View"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => setEmployeeToEdit(row)}
            className="p-1.5 hover:bg-gray-100 rounded text-[#6B7280] hover:text-blue-600"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => setEmployeeToDelete(row)}
            className="p-1.5 hover:bg-gray-100 rounded text-[#6B7280] hover:text-red-600"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  // Filter options
  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "ACTIVE", label: "Active" },
    { value: "INACTIVE", label: "Inactive" },
    { value: "RESIGNED", label: "Resigned" },
    { value: "TERMINATED", label: "Terminated" },
  ];

  if (status === "loading" || loading && employees.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-[#1A1A2E]">Employee Data</h1>
          <p className="text-xs text-[#6B7280]">Manage employee information and records</p>
        </div>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add
        </Button>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-3">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <p className="text-sm text-red-600">{error}</p>
          <button onClick={() => window.location.reload()} className="ml-auto text-xs text-red-600 underline">
            Retry
          </button>
        </div>
      )}

      {/* Filters */}
      <Card className="!p-3">
        <CardContent className="!p-0">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[160px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2B6B] focus:border-transparent"
                />
              </div>
            </div>
            <Select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              options={[
                { value: "", label: "All Dept" },
                ...departments.map((d) => ({ value: d.id, label: d.name })),
              ]}
              className="w-[140px]"
            />
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={statusOptions}
              className="w-[120px]"
            />
            <Button variant="ghost" size="sm" leftIcon={<Download className="h-4 w-4" />} onClick={() => alert("Export coming soon")}>
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          <DataTable
            data={employees}
            columns={columns}
            keyExtractor={(row) => row.id}
            pagination={{
              page: currentPage,
              pageSize,
              total: totalCount,
              onPageChange: setCurrentPage,
              onPageSizeChange: (size) => {
                setPageSize(size);
                setCurrentPage(1);
              },
            }}
            isLoading={loading}
            striped
            stickyHeader
            compact
          />
        </CardContent>
      </Card>

      {/* Add Employee Modal */}
      <Modal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Employee"
        maxWidth="lg"
      >
        <AddEmployeeForm
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => {
            // Refresh the list
            setCurrentPage(1);
          }}
          departments={departments}
          divisions={divisions}
          positions={positions}
        />
      </Modal>

      {/* Edit Employee Modal */}
      <Modal
        open={employeeToEdit !== null}
        onClose={() => setEmployeeToEdit(null)}
        title="Edit Employee"
        maxWidth="lg"
      >
        {employeeToEdit && (
          <EditEmployeeForm
            employee={employeeToEdit}
            onClose={() => setEmployeeToEdit(null)}
            onSuccess={() => {
              // Refresh the list without changing page
              const params = new URLSearchParams();
              params.set("page", String(currentPage));
              params.set("pageSize", String(pageSize));
              if (searchQuery) params.set("search", searchQuery);
              if (departmentFilter) params.set("departmentId", departmentFilter);
              if (statusFilter) params.set("status", statusFilter);
              
              setLoading(true);
              fetchEmployees(params)
                .then(result => {
                  setEmployees(result.data);
                  setTotalCount(result.pagination.total);
                })
                .finally(() => setLoading(false));
            }}
            departments={departments}
            divisions={divisions}
            positions={positions}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={employeeToDelete !== null}
        onClose={() => !isDeleting && setEmployeeToDelete(null)}
        title="Delete Employee"
        maxWidth="sm"
      >
        {employeeToDelete && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-red-50 text-red-800 border border-red-100 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900">Are you absolutely sure?</p>
                <p className="text-sm mt-1">
                  You are about to delete the employee record for <strong>{employeeToDelete.firstName} {employeeToDelete.lastName}</strong>.
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="secondary" onClick={() => setEmployeeToDelete(null)} disabled={isDeleting}>
                Cancel
              </Button>
              <Button
                variant="primary"
                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                disabled={isDeleting}
                onClick={async () => {
                  setIsDeleting(true);
                  try {
                    const success = await deleteEmployee(employeeToDelete.id);
                    if (success) {
                      setEmployees((prev) => prev.filter((e) => e.id !== employeeToDelete.id));
                      setTotalCount(prev => prev - 1);
                      setEmployeeToDelete(null);
                    }
                  } catch (err) {
                    alert("Failed to delete employee. They might have related records like attendance or leaves.");
                  } finally {
                    setIsDeleting(false);
                  }
                }}
              >
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
                Delete Employee
              </Button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}