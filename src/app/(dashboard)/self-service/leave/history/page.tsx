"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/input";
import { DataTable, Column } from "@/components/ui/data-table";
import { Modal } from "@/components/ui/modal";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  FileText,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data
const mockLeaveHistory = [
  {
    id: "1",
    leaveType: { id: "1", code: "ANNUAL", name: "Annual Leave" },
    startDate: new Date("2026-05-10"),
    endDate: new Date("2026-05-14"),
    totalDays: 5,
    reason: "Family vacation to Bali",
    status: "APPROVED",
    approvedBy: "Joko Susilo",
    approvedAt: new Date("2026-05-08"),
    createdAt: new Date("2026-05-05"),
  },
  {
    id: "2",
    leaveType: { id: "2", code: "SICK", name: "Sick Leave" },
    startDate: new Date("2026-04-15"),
    endDate: new Date("2026-04-15"),
    totalDays: 1,
    reason: "Health check-up at hospital",
    status: "APPROVED",
    approvedBy: "Joko Susilo",
    approvedAt: new Date("2026-04-14"),
    createdAt: new Date("2026-04-14"),
  },
  {
    id: "3",
    leaveType: { id: "1", code: "ANNUAL", name: "Annual Leave" },
    startDate: new Date("2026-03-20"),
    endDate: new Date("2026-03-22"),
    totalDays: 3,
    reason: "Personal matters - moving house",
    status: "APPROVED",
    approvedBy: "Joko Susilo",
    approvedAt: new Date("2026-03-18"),
    createdAt: new Date("2026-03-15"),
  },
  {
    id: "4",
    leaveType: { id: "1", code: "ANNUAL", name: "Annual Leave" },
    startDate: new Date("2026-06-01"),
    endDate: new Date("2026-06-05"),
    totalDays: 5,
    reason: "Wedding attendance of family member",
    status: "PENDING",
    approvedBy: null,
    approvedAt: null,
    createdAt: new Date("2026-05-18"),
  },
  {
    id: "5",
    leaveType: { id: "3", code: "PERSONAL", name: "Personal Leave" },
    startDate: new Date("2026-02-10"),
    endDate: new Date("2026-02-10"),
    totalDays: 1,
    reason: "Family emergency",
    status: "REJECTED",
    approvedBy: "Joko Susilo",
    approvedAt: new Date("2026-02-09"),
    createdAt: new Date("2026-02-08"),
    notes: "Sorry, this date has already been approved for another team member",
  },
  {
    id: "6",
    leaveType: { id: "2", code: "SICK", name: "Sick Leave" },
    startDate: new Date("2026-01-20"),
    endDate: new Date("2026-01-20"),
    totalDays: 1,
    reason: "Flu and fever",
    status: "APPROVED",
    approvedBy: "Joko Susilo",
    approvedAt: new Date("2026-01-20"),
    createdAt: new Date("2026-01-20"),
  },
];

// Status Summary Component
function StatusSummary() {
  const summary = {
    pending: mockLeaveHistory.filter((l) => l.status === "PENDING").length,
    approved: mockLeaveHistory.filter((l) => l.status === "APPROVED").length,
    rejected: mockLeaveHistory.filter((l) => l.status === "REJECTED").length,
    cancelled: mockLeaveHistory.filter((l) => l.status === "CANCELLED").length,
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
          <p className="text-2xl font-bold text-[#1A1A2E]">{mockLeaveHistory.length}</p>
          <p className="text-sm text-[#6B7280]">Total</p>
        </div>
      </div>
    </div>
  );
}

// Detail Modal Component
function LeaveDetailModal({
  leave,
  open,
  onClose,
}: {
  leave: (typeof mockLeaveHistory)[0] | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!leave) return null;

  return (
    <Modal open={open} onClose={onClose} title="Leave Request Details" maxWidth="md">
      <div className="space-y-6">
        {/* Status Banner */}
        <div
          className={cn(
            "flex items-center gap-3 p-4 rounded-lg",
            leave.status === "APPROVED" && "bg-[#ECFDF5]",
            leave.status === "PENDING" && "bg-[#FEF9C3]",
            leave.status === "REJECTED" && "bg-[#FEE2E2]",
            leave.status === "CANCELLED" && "bg-gray-100"
          )}
        >
          {leave.status === "APPROVED" && (
            <CheckCircle className="h-6 w-6 text-[#10B981]" />
          )}
          {leave.status === "PENDING" && (
            <Clock className="h-6 w-6 text-[#F59E0B]" />
          )}
          {leave.status === "REJECTED" && (
            <XCircle className="h-6 w-6 text-[#EF4444]" />
          )}
          <div>
            <p className="font-semibold text-[#1A1A2E]">
              {leave.status === "APPROVED" && "Request Approved"}
              {leave.status === "PENDING" && "Request Pending Approval"}
              {leave.status === "REJECTED" && "Request Rejected"}
              {leave.status === "CANCELLED" && "Request Cancelled"}
            </p>
            <p className="text-sm text-[#6B7280]">
              Submitted on {format(leave.createdAt, "dd MMMM yyyy, HH:mm", { locale: id })}
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-[#6B7280] mb-1">Leave Type</p>
            <p className="font-medium text-[#1A1A2E]">{leave.leaveType.name}</p>
          </div>
          <div>
            <p className="text-sm text-[#6B7280] mb-1">Total Days</p>
            <p className="font-medium text-[#1A1A2E]">{leave.totalDays} days</p>
          </div>
          <div>
            <p className="text-sm text-[#6B7280] mb-1">Start Date</p>
            <p className="font-medium text-[#1A1A2E]">
              {format(leave.startDate, "dd MMMM yyyy", { locale: id })}
            </p>
          </div>
          <div>
            <p className="text-sm text-[#6B7280] mb-1">End Date</p>
            <p className="font-medium text-[#1A1A2E]">
              {format(leave.endDate, "dd MMMM yyyy", { locale: id })}
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-[#6B7280] mb-1">Reason</p>
            <p className="font-medium text-[#1A1A2E]">{leave.reason}</p>
          </div>
          {leave.approvedBy && (
            <>
              <div>
                <p className="text-sm text-[#6B7280] mb-1">Processed By</p>
                <p className="font-medium text-[#1A1A2E]">{leave.approvedBy}</p>
              </div>
              <div>
                <p className="text-sm text-[#6B7280] mb-1">Processed At</p>
                <p className="font-medium text-[#1A1A2E]">
                  {format(leave.approvedAt!, "dd MMMM yyyy, HH:mm", { locale: id })}
                </p>
              </div>
            </>
          )}
          {leave.notes && (
            <div className="col-span-2">
              <p className="text-sm text-[#6B7280] mb-1">
                {leave.status === "REJECTED" ? "Rejection Reason" : "Notes"}
              </p>
              <p className="font-medium text-[#1A1A2E]">{leave.notes}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        {leave.status === "PENDING" && (
          <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E7EB]">
            <Button variant="danger" onClick={() => console.log("Cancel", leave.id)}>
              Cancel Request
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}

// Main Page Component
export default function LeaveHistoryPage() {
  const [statusFilter, setStatusFilter] = React.useState("");
  const [leaveTypeFilter, setLeaveTypeFilter] = React.useState("");
  const [dateRange, setDateRange] = React.useState({
    start: "",
    end: "",
  });
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [selectedLeave, setSelectedLeave] = React.useState<(typeof mockLeaveHistory)[0] | null>(null);

  // Filter data
  const filteredHistory = mockLeaveHistory.filter((leave) => {
    const matchesStatus = statusFilter === "" || leave.status === statusFilter;
    const matchesLeaveType =
      leaveTypeFilter === "" || leave.leaveType.id === leaveTypeFilter;

    let matchesDate = true;
    if (dateRange.start) {
      matchesDate = leave.startDate >= new Date(dateRange.start);
    }
    if (dateRange.end) {
      matchesDate = matchesDate && leave.endDate <= new Date(dateRange.end);
    }

    return matchesStatus && matchesLeaveType && matchesDate;
  });

  // Pagination
  const paginatedHistory = filteredHistory.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Table columns
  const columns: Column<(typeof mockLeaveHistory)[0]>[] = [
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
            {format(row.startDate, "dd/MM/yyyy")} - {format(row.endDate, "dd/MM/yyyy")}
          </p>
          <p className="text-xs text-[#6B7280]">{row.totalDays} days</p>
        </div>
      ),
    },
    {
      key: "reason",
      header: "Reason",
      render: (row) => (
        <p className="text-sm truncate max-w-[200px]" title={row.reason}>
          {row.reason}
        </p>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <Badge status={row.status}>{row.status}</Badge>,
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Leave History</h1>
          <p className="text-sm text-[#6B7280]">
            View and track all your leave requests
          </p>
        </div>
      </div>

      {/* Status Summary */}
      <StatusSummary />

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm"
              placeholder="Start Date"
            />
            <span className="text-[#6B7280]">to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm"
              placeholder="End Date"
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
            data={paginatedHistory}
            columns={columns}
            keyExtractor={(row) => row.id}
            pagination={{
              page: currentPage,
              pageSize,
              total: filteredHistory.length,
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

      {/* Detail Modal */}
      <LeaveDetailModal
        leave={selectedLeave}
        open={selectedLeave !== null}
        onClose={() => setSelectedLeave(null)}
      />
    </div>
  );
}