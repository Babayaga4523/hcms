"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable, Column } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, CheckCircle, XCircle, FileText, Clock } from "lucide-react";
import { format } from "date-fns";

// ============ Types ============
interface LeaveRecord {
  id: string;
  leaveType: { id: string; code: string; name: string };
  startDate: string;
  endDate: string;
  totalDays: number;
  reason?: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  approvedBy?: string;
  approvedAt?: string;
  notes?: string;
  createdAt: string;
}

interface LeaveQuota {
  leaveType: { id: string; code: string; name: string };
  totalDays: number;
  usedDays: number;
  remainingDays: number;
}

// ============ Status Mapping ============
const statusLabels: Record<string, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  CANCELLED: "Cancelled",
};

const statusVariants: Record<string, "warning" | "success" | "danger" | "default"> = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "danger",
  CANCELLED: "default",
};

// ============ API Functions ============
async function fetchLeaveHistory(employeeId: string): Promise<LeaveRecord[]> {
  const response = await fetch(`/api/leave?employeeId=${employeeId}`, {
    credentials: "include",
  });

  if (!response.ok) {
    if (response.status === 401) {
      window.location.href = "/login";
    }
    return [];
  }

  const result = await response.json();
  return result.data || [];
}

async function fetchLeaveQuotas(employeeId: string): Promise<LeaveQuota[]> {
  const currentYear = new Date().getFullYear();
  const response = await fetch(`/api/leave/quota?employeeId=${employeeId}&year=${currentYear}`, {
    credentials: "include",
  });

  if (!response.ok) return [];

  const result = await response.json();
  return result.data || [];
}

async function createLeaveRequest(data: {
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  reason: string;
  attachmentUrl?: string;
}): Promise<LeaveRecord | null> {
  const response = await fetch("/api/leave", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.error || "Failed to submit leave request");
  }

  const result = await response.json();
  return result.data;
}

// ============ Status Summary Component ============
function StatusSummary({ records }: { records: LeaveRecord[] }) {
  const summary = {
    pending: records.filter((l) => l.status === "PENDING").length,
    approved: records.filter((l) => l.status === "APPROVED").length,
    rejected: records.filter((l) => l.status === "REJECTED").length,
    total: records.length,
  };

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="flex items-center gap-3 p-4 bg-[#FEF9C3] rounded-lg">
        <Clock className="h-8 w-8 text-[#F59E0B]" />
        <div>
          <p className="text-2xl font-bold text-[#1A1A2E]">{summary.pending}</p>
          <p className="text-sm text-[#6B7280]">Pending</p>
        </div>
      </div>
      <div className="flex items-center gap-3 p-4 bg-[#ECFDF5] rounded-lg">
        <CheckCircle className="h-8 w-8 text-[#10B981]" />
        <div>
          <p className="text-2xl font-bold text-[#1A1A2E]">{summary.approved}</p>
          <p className="text-sm text-[#6B7280]">Approved</p>
        </div>
      </div>
      <div className="flex items-center gap-3 p-4 bg-[#FEE2E2] rounded-lg">
        <XCircle className="h-8 w-8 text-[#EF4444]" />
        <div>
          <p className="text-2xl font-bold text-[#1A1A2E]">{summary.rejected}</p>
          <p className="text-sm text-[#6B7280]">Rejected</p>
        </div>
      </div>
      <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-lg">
        <FileText className="h-8 w-8 text-[#6B7280]" />
        <div>
          <p className="text-2xl font-bold text-[#1A1A2E]">{summary.total}</p>
          <p className="text-sm text-[#6B7280]">Total</p>
        </div>
      </div>
    </div>
  );
}

// ============ Main Page Component ============
export default function LeaveHistoryPage() {
  const { data: session, status } = useSession();

  const [records, setRecords] = React.useState<LeaveRecord[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [statusFilter, setStatusFilter] = React.useState("");
  const [leaveTypeFilter, setLeaveTypeFilter] = React.useState("");
  const [dateRange, setDateRange] = React.useState({ start: "", end: "" });
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [selectedLeave, setSelectedLeave] = React.useState<LeaveRecord | null>(null);

  // Fetch leave history
  React.useEffect(() => {
    async function loadData() {
      if (status !== "authenticated" || !session?.user?.employeeId) return;

      setLoading(true);
      setError(null);

      try {
        const data = await fetchLeaveHistory(session.user.employeeId);
        setRecords(data);
      } catch (err) {
        setError("Failed to load leave history");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [status, session]);

  // Filter data
  const filteredRecords = records.filter((leave) => {
    const matchesStatus = !statusFilter || leave.status === statusFilter;
    const matchesLeaveType = !leaveTypeFilter || leave.leaveType.id === leaveTypeFilter;

    let matchesDate = true;
    if (dateRange.start) {
      matchesDate = new Date(leave.startDate) >= new Date(dateRange.start);
    }
    if (dateRange.end) {
      matchesDate = matchesDate && new Date(leave.endDate) <= new Date(dateRange.end);
    }

    return matchesStatus && matchesLeaveType && matchesDate;
  });

  // Pagination
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Table columns
  const columns: Column<LeaveRecord>[] = [
    {
      key: "leaveType",
      header: "Leave Type",
      render: (row) => (
        <div>
          <p className="font-medium text-[#1A1A2E]">{row.leaveType.name}</p>
          <p className="text-xs text-[#6B7280]">{row.leaveType.code}</p>
        </div>
      ),
    },
    {
      key: "dateRange",
      header: "Date Range",
      render: (row) => (
        <div>
          <p className="text-sm">
            {format(new Date(row.startDate), "dd/MM/yyyy")} - {format(new Date(row.endDate), "dd/MM/yyyy")}
          </p>
          <p className="text-xs text-[#6B7280]">{row.totalDays} days</p>
        </div>
      ),
    },
    {
      key: "reason",
      header: "Reason",
      render: (row) => (
        <p className="text-sm truncate max-w-[200px]" title={row.reason || ""}>
          {row.reason || "-"}
        </p>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <Badge variant={statusVariants[row.status] || "default"} status={row.status}>
          {statusLabels[row.status] || row.status}
        </Badge>
      ),
    },
    {
      key: "approvedBy",
      header: "Processed By",
      render: (row) => row.approvedBy || "-",
    },
    {
      key: "actions",
      header: "Actions",
      width: "80px",
      align: "right",
      render: (row) => (
        <button
          onClick={() => setSelectedLeave(row)}
          className="p-1.5 hover:bg-gray-100 rounded text-[#6B7280] hover:text-[#1A2B6B]"
          title="View Details"
        >
          <Eye className="h-4 w-4" />
        </button>
      ),
    },
  ];

  if (status === "loading" || (loading && records.length === 0)) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20" />)}
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Leave History</h1>
        <p className="text-sm text-[#6B7280]">View and track all your leave requests</p>
      </div>

      {/* Status Summary */}
      <StatusSummary records={records} />

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm"
            />
            <span className="text-[#6B7280]">to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm"
            />
            <select
              value={leaveTypeFilter}
              onChange={(e) => setLeaveTypeFilter(e.target.value)}
              className="px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm"
            >
              <option value="">All Leave Types</option>
              <option value="1">Annual Leave</option>
              <option value="2">Sick Leave</option>
              <option value="3">Personal Leave</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <Button variant="secondary" onClick={() => {}}>
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          <DataTable
            data={paginatedRecords}
            columns={columns}
            keyExtractor={(row) => row.id}
            pagination={{
              page: currentPage,
              pageSize,
              total: filteredRecords.length,
              onPageChange: setCurrentPage,
              onPageSizeChange: (size) => {
                setPageSize(size);
                setCurrentPage(1);
              },
            }}
            isLoading={loading}
            emptyMessage="No leave records found"
            striped
            stickyHeader
          />
        </CardContent>
      </Card>
    </div>
  );
}