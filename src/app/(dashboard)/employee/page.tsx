"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Select } from "@/components/ui/input";
import { DataTable, Column } from "@/components/ui/data-table";
import { Modal, Drawer } from "@/components/ui/modal";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for initial development
const mockEmployees = [
  {
    id: "1",
    nik: "BNI001",
    email: "budi.santoso@bnifinance.co.id",
    firstName: "Budi",
    lastName: "Santoso",
    gender: "MALE",
    birthDate: new Date("1990-05-15"),
    phone: "081234567890",
    address: "Jl. Sudirman No. 123, Jakarta",
    position: { id: "1", code: "SPV", name: "Supervisor" },
    division: { id: "1", code: "SALES", name: "Sales" },
    department: { id: "1", code: "MKT", name: "Marketing" },
    joinDate: new Date("2018-03-15"),
    status: "ACTIVE",
  },
  {
    id: "2",
    nik: "BNI002",
    email: "diana.pratama@bnifinance.co.id",
    firstName: "Diana",
    lastName: "Pratama",
    gender: "FEMALE",
    birthDate: new Date("1992-08-22"),
    phone: "081234567891",
    address: "Jl. Gatot Subroto No. 45, Jakarta",
    position: { id: "2", code: "AM", name: "Account Manager" },
    division: { id: "1", code: "SALES", name: "Sales" },
    department: { id: "1", code: "MKT", name: "Marketing" },
    joinDate: new Date("2019-06-01"),
    status: "ACTIVE",
  },
  {
    id: "3",
    nik: "BNI003",
    email: "andi.wijaya@bnifinance.co.id",
    firstName: "Andi",
    lastName: "Wijaya",
    gender: "MALE",
    birthDate: new Date("1988-12-03"),
    phone: "081234567892",
    address: "Jl. Thamrin No. 78, Jakarta",
    position: { id: "3", code: "MGR", name: "Manager" },
    division: { id: "2", code: "OPS", name: "Operations" },
    department: { id: "2", code: "OPS", name: "Operations" },
    joinDate: new Date("2015-01-10"),
    status: "ACTIVE",
  },
  {
    id: "4",
    nik: "BNI004",
    email: "siti.rahayu@bnifinance.co.id",
    firstName: "Siti",
    lastName: "Rahayu",
    gender: "FEMALE",
    birthDate: new Date("1995-03-28"),
    phone: "081234567893",
    address: "Jl. KH. Wahid Hasyim No. 12, Jakarta",
    position: { id: "4", code: "STAFF", name: "Staff" },
    division: { id: "3", code: "FIN", name: "Finance" },
    department: { id: "3", code: "FIN", name: "Finance" },
    joinDate: new Date("2020-09-15"),
    status: "ACTIVE",
  },
  {
    id: "5",
    nik: "BNI005",
    email: "joko.susilo@bnifinance.co.id",
    firstName: "Joko",
    lastName: "Susilo",
    gender: "MALE",
    birthDate: new Date("1985-07-19"),
    phone: "081234567894",
    address: "Jl. Casablanca No. 56, Jakarta",
    position: { id: "5", code: "DIR", name: "Director" },
    division: { id: "4", code: "EXEC", name: "Executive" },
    department: { id: "4", code: "EXEC", name: "Executive" },
    joinDate: new Date("2010-02-28"),
    status: "INACTIVE",
  },
];

const mockDepartments = [
  { value: "", label: "All Departments" },
  { value: "1", label: "Marketing" },
  { value: "2", label: "Operations" },
  { value: "3", label: "Finance" },
  { value: "4", label: "Executive" },
];

const mockPositions = [
  { value: "", label: "All Positions" },
  { value: "1", label: "Supervisor" },
  { value: "2", label: "Account Manager" },
  { value: "3", label: "Manager" },
  { value: "4", label: "Staff" },
  { value: "5", label: "Director" },
];

const mockStatuses = [
  { value: "", label: "All Status" },
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "RESIGNED", label: "Resigned" },
  { value: "TERMINATED", label: "Terminated" },
];

// Employee Detail Component
function EmployeeDetail({ employee, onClose }: { employee: typeof mockEmployees[0]; onClose: () => void }) {
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
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
        >
          ✕
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
                    {format(employee.birthDate, "dd MMMM yyyy", { locale: id })}
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
                    {format(employee.joinDate, "dd MMMM yyyy", { locale: id })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "documents" && (
          <div className="text-center py-8 text-[#6B7280]">
            No documents uploaded
          </div>
        )}

        {activeTab === "history" && (
          <div className="text-center py-8 text-[#6B7280]">
            No history available
          </div>
        )}
      </div>
    </div>
  );
}

// Add Employee Form Component
function AddEmployeeForm({ onClose, onSubmit }: { onClose: () => void; onSubmit: (data: unknown) => void }) {
  const [formData, setFormData] = React.useState({
    nik: "",
    firstName: "",
    lastName: "",
    email: "",
    gender: "MALE",
    birthDate: "",
    phone: "",
    address: "",
    departmentId: "",
    divisionId: "",
    positionId: "",
    joinDate: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
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
          options={mockDepartments.slice(1)}
        />
        <Select
          label="Division"
          value={formData.divisionId}
          onChange={(e) => setFormData({ ...formData, divisionId: e.target.value })}
          options={[
            { value: "", label: "Select Division" },
            { value: "1", label: "Sales" },
            { value: "2", label: "Operations" },
            { value: "3", label: "Finance" },
          ]}
        />
        <Select
          label="Position"
          value={formData.positionId}
          onChange={(e) => setFormData({ ...formData, positionId: e.target.value })}
          options={mockPositions.slice(1)}
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
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" type="submit">
          Save Employee
        </Button>
      </div>
    </form>
  );
}

// Main Page Component
export default function EmployeeDataPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [departmentFilter, setDepartmentFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [selectedEmployee, setSelectedEmployee] = React.useState<typeof mockEmployees[0] | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  // Filter data based on search and filters
  const filteredEmployees = mockEmployees.filter((emp) => {
    const matchesSearch =
      searchQuery === "" ||
      emp.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.nik.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment =
      departmentFilter === "" || emp.department.id === departmentFilter;

    const matchesStatus =
      statusFilter === "" || emp.status === statusFilter;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / pageSize);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Table columns
  const columns: Column<typeof mockEmployees[0]>[] = [
    {
      key: "nik",
      header: "NIK",
      width: "100px",
    },
    {
      key: "name",
      header: "Name",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1A2B6B] text-white text-xs font-semibold">
            {row.firstName[0]}{row.lastName[0]}
          </div>
          <div>
            <p className="font-medium text-[#1A1A2E]">{row.firstName} {row.lastName}</p>
            <p className="text-xs text-[#6B7280]">{row.email}</p>
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
      render: (row) => format(row.joinDate, "dd/MM/yyyy"),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <Badge status={row.status}>{row.status}</Badge>,
    },
    {
      key: "actions",
      header: "Actions",
      width: "120px",
      align: "right",
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => setSelectedEmployee(row)}
            className="p-1.5 hover:bg-gray-100 rounded text-[#6B7280] hover:text-[#1A2B6B]"
            title="View"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => console.log("Edit", row.id)}
            className="p-1.5 hover:bg-gray-100 rounded text-[#6B7280] hover:text-blue-600"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => console.log("Delete", row.id)}
            className="p-1.5 hover:bg-gray-100 rounded text-[#6B7280] hover:text-red-600"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Employee Data</h1>
          <p className="text-sm text-[#6B7280]">
            Manage employee information and records
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Employee
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
                <input
                  type="text"
                  placeholder="Search by name, NIK, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2B6B] focus:border-transparent"
                />
              </div>
            </div>
            <Select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              options={mockDepartments}
              className="w-[180px]"
            />
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={mockStatuses}
              className="w-[150px]"
            />
            <Button variant="secondary" leftIcon={<Filter className="h-4 w-4" />}>
              Filter
            </Button>
            <Button variant="ghost" leftIcon={<Download className="h-4 w-4" />}>
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          <DataTable
            data={paginatedEmployees}
            columns={columns}
            keyExtractor={(row) => row.id}
            pagination={{
              page: currentPage,
              pageSize,
              total: filteredEmployees.length,
              onPageChange: setCurrentPage,
              onPageSizeChange: (size) => {
                setPageSize(size);
                setCurrentPage(1);
              },
            }}
            striped
            stickyHeader
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
          onSubmit={(data) => {
            console.log("Submit:", data);
            setIsAddModalOpen(false);
          }}
        />
      </Modal>

      {/* Employee Detail Drawer */}
      <Drawer
        open={selectedEmployee !== null}
        onClose={() => setSelectedEmployee(null)}
        title="Employee Details"
        width="480px"
      >
        {selectedEmployee && (
          <EmployeeDetail
            employee={selectedEmployee}
            onClose={() => setSelectedEmployee(null)}
          />
        )}
      </Drawer>
    </div>
  );
}