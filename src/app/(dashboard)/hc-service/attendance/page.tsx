"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Select } from "@/components/ui/input";
import { DataTable, Column } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, FileUp, CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";

// ============ Types ============
interface AttendanceRecord {
  id: string;
  employeeId: string;
  name: string;
  date: string;
  shift: string;
  clockIn: string;
  clockOut: string;
  status: "PRESENT" | "LATE" | "ABSENT" | "ON_LEAVE" | "ANOMALOUS" | "SICK" | "WFH" | "PERMIT";
  remarks?: string;
}

interface AttendanceStats {
  totalPresent: number;
  lateCount: number;
  absentCount: number;
  anomalyCount: number;
  totalEmployees: number;
}

// ============ Status Mapping ============
const statusLabels: Record<string, string> = {
  PRESENT: "Present",
  LATE: "Late",
  ABSENT: "Absent",
  ON_LEAVE: "On Leave",
  ANOMALOUS: "Anomalous",
  SICK: "Sick",
  WFH: "WFH",
  PERMIT: "Permit",
};

const statusVariants: Record<string, "success" | "warning" | "danger" | "info" | "default"> = {
  PRESENT: "success",
  LATE: "warning",
  ABSENT: "danger",
  ON_LEAVE: "info",
  ANOMALOUS: "warning",
  SICK: "danger",
  WFH: "info",
  PERMIT: "info",
};

// ============ API Functions ============
async function fetchAttendanceRecords(params: URLSearchParams): Promise<{
  data: AttendanceRecord[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
}> {
  const response = await fetch(`/api/attendance?${params.toString()}`, {
    credentials: "include",
  });

  if (!response.ok) {
    if (response.status === 401) {
      window.location.href = "/login";
    }
    throw new Error("Failed to fetch attendance records");
  }

  return response.json();
}

async function fetchAttendanceStats(): Promise<AttendanceStats> {
  const today = new Date().toISOString().split("T")[0];
  const response = await fetch(`/api/attendance/stats?date=${today}`, {
    credentials: "include",
  });

  if (!response.ok) {
    // Return default stats if API doesn't exist
    return {
      totalPresent: 0,
      lateCount: 0,
      absentCount: 0,
      anomalyCount: 0,
      totalEmployees: 0,
    };
  }

  const result = await response.json();
  return result.data || {
    totalPresent: 0,
    lateCount: 0,
    absentCount: 0,
    anomalyCount: 0,
    totalEmployees: 0,
  };
}

// ============ Main Component ============
export default function AttendancePage() {
  const { data: session, status } = useSession();

  const [records, setRecords] = React.useState<AttendanceRecord[]>([]);
  const [stats, setStats] = React.useState<AttendanceStats | null>(null);
  const [loading, setLoading] = React.useState(true);

  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [totalCount, setTotalCount] = React.useState(0);

  // Fetch attendance data
  React.useEffect(() => {
    async function loadData() {
      if (status !== "authenticated") return;

      setLoading(true);

      try {
        const params = new URLSearchParams();
        params.set("page", String(currentPage));
        params.set("pageSize", String(pageSize));

        if (search) params.set("search", search);
        if (statusFilter) params.set("status", statusFilter);

        const [recordsData, statsData] = await Promise.all([
          fetchAttendanceRecords(params),
          fetchAttendanceStats(),
        ]);

        // Transform data to match our interface
        const transformedRecords = (recordsData.data || []).map((record: any) => ({
          id: record.id,
          employeeId: record.employee?.nik || record.employeeId,
          name: record.employee ? `${record.employee.firstName} ${record.employee.lastName}` : "Unknown",
          date: record.date,
          shift: record.shift || "Normal (08:00 - 17:00)",
          clockIn: record.clockIn ? new Date(record.clockIn).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "--:--",
          clockOut: record.clockOut ? new Date(record.clockOut).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "--:--",
          status: record.status,
          remarks: record.notes,
        }));

        setRecords(transformedRecords);
        setTotalCount(recordsData.pagination.total);
        setStats(statsData);
      } catch {
        // Error is handled by state
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [status, currentPage, pageSize, search, statusFilter]);

  // Table columns
  const columns: Column<AttendanceRecord>[] = [
    { key: "employeeId", header: "Employee ID", sortable: true },
    { key: "name", header: "Employee Name", sortable: true },
    { key: "date", header: "Date" },
    { key: "shift", header: "Shift" },
    { key: "clockIn", header: "Clock In" },
    { key: "clockOut", header: "Clock Out" },
    {
      key: "status",
      header: "Status",
      render: (row) => {
        const variant = statusVariants[row.status] || "default";
        return <Badge variant={variant}>{statusLabels[row.status] || row.status}</Badge>;
      },
    },
    { key: "remarks", header: "Remarks" },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          {row.status === "ANOMALOUS" && (
            <Button size="sm" variant="primary" onClick={() => alert(`Adjust anomaly for ${row.name}`)}>
              Adjust
            </Button>
          )}
          <Button size="sm" variant="secondary" onClick={() => alert(`View details for ${row.name}`)}>
            View
          </Button>
        </div>
      ),
    },
  ];

  if (status === "loading" || loading && records.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  const presentPercentage = stats && stats.totalEmployees > 0
    ? Math.round((stats.totalPresent / stats.totalEmployees) * 100)
    : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-[#1A1A2E]">Attendance Monitor</h1>
          <p className="text-xs text-[#6B7280]">Monitor and adjust employee attendance records</p>
        </div>
        <Button variant="secondary" size="sm" leftIcon={<FileUp className="h-4 w-4" />} onClick={() => alert("Exporting...")}>
          Export
        </Button>
      </div>

      {/* Attendance Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="!p-4">
          <CardContent className="!p-0 flex items-center gap-3">
            <div className="h-9 w-9 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-[10px] text-[#6B7280]">PRESENT</p>
              <p className="text-lg font-bold text-[#1A1A2E]">{stats?.totalPresent || 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="!p-4">
          <CardContent className="!p-0 flex items-center gap-3">
            <div className="h-9 w-9 bg-amber-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-[10px] text-[#6B7280]">LATE</p>
              <p className="text-lg font-bold text-[#1A1A2E]">{stats?.lateCount || 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="!p-4">
          <CardContent className="!p-0 flex items-center gap-3">
            <div className="h-9 w-9 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-[10px] text-[#6B7280]">ABSENT</p>
              <p className="text-lg font-bold text-[#1A1A2E]">{stats?.absentCount || 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="!p-4">
          <CardContent className="!p-0 flex items-center gap-3">
            <div className="h-9 w-9 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-[10px] text-[#6B7280]">ANOMALY</p>
              <p className="text-lg font-bold text-[#1A1A2E]">{stats?.anomalyCount || 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Filter Table Area */}
      <Card className="shadow-card border-[#E5E7EB]">
        <CardHeader className="pb-4">
          <CardTitle>Attendance Log</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex flex-1 gap-3 max-w-lg">
              <Input
                placeholder="Search by Employee ID or Name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
              />
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: "", label: "All Statuses" },
                  { value: "PRESENT", label: "Present" },
                  { value: "LATE", label: "Late" },
                  { value: "ABSENT", label: "Absent" },
                  { value: "ON_LEAVE", label: "On Leave" },
                  { value: "ANOMALOUS", label: "Anomalous" },
                ]}
                className="w-48"
              />
            </div>
            <div className="flex gap-2">
              <Input type="date" className="w-40" />
            </div>
          </div>

          <DataTable
            data={records}
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
          />
        </CardContent>
      </Card>
    </div>
  );
}