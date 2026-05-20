"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { DataTable, Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Search, FileUp, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface AttendanceRecord {
  id: string;
  employeeId: string;
  name: string;
  date: string;
  shift: string;
  clockIn: string;
  clockOut: string;
  status: "Present" | "Late" | "Absent" | "On Leave" | "Anomalous";
  remarks: string;
}

const mockAttendance: AttendanceRecord[] = [
  { id: "1", employeeId: "BNI0012", name: "Yoga Utama", date: "2026-05-20", shift: "Normal (08:00 - 17:00)", clockIn: "07:54", clockOut: "17:02", status: "Present", remarks: "" },
  { id: "2", employeeId: "BNI0045", name: "Andi Wijaya", date: "2026-05-20", shift: "Normal (08:00 - 17:00)", clockIn: "08:15", clockOut: "17:00", status: "Late", remarks: "Traffic jam" },
  { id: "3", employeeId: "BNI0089", name: "Siti Rahma", date: "2026-05-20", shift: "Normal (08:00 - 17:00)", clockIn: "08:00", clockOut: "--:--", status: "Anomalous", remarks: "Forgot clock-out" },
  { id: "4", employeeId: "BNI0112", name: "Budi Santoso", date: "2026-05-20", shift: "Shift A (06:00 - 14:00)", clockIn: "05:50", clockOut: "14:05", status: "Present", remarks: "" },
  { id: "5", employeeId: "BNI0154", name: "Rina Melati", date: "2026-05-20", shift: "Normal (08:00 - 17:00)", clockIn: "--:--", clockOut: "--:--", status: "On Leave", remarks: "Annual Leave" },
  { id: "6", employeeId: "BNI0201", name: "Denny Hidayat", date: "2026-05-20", shift: "Normal (08:00 - 17:00)", clockIn: "--:--", clockOut: "--:--", status: "Absent", remarks: "No notice" },
];

export default function AttendancePage() {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("All");

  const filteredData = mockAttendance.filter((row) => {
    const matchesSearch = row.name.toLowerCase().includes(search.toLowerCase()) || 
                          row.employeeId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || row.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
        let variant: "success" | "warning" | "danger" | "info" | "default" = "default";
        if (row.status === "Present") variant = "success";
        else if (row.status === "Late") variant = "warning";
        else if (row.status === "Absent") variant = "danger";
        else if (row.status === "On Leave") variant = "info";
        else if (row.status === "Anomalous") variant = "warning";
        return <Badge variant={variant}>{row.status}</Badge>;
      },
    },
    { key: "remarks", header: "Remarks" },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          {row.status === "Anomalous" && (
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">HC Attendance Monitor</h1>
          <p className="text-sm text-[#6B7280]">
            Monitor and adjust employee daily attendance records and check-in/out anomalies.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => alert("Exporting to Excel...")}>
            <FileUp className="h-4 w-4 mr-2" /> Export Excel
          </Button>
        </div>
      </div>

      {/* Attendance Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-card border-[#E5E7EB]">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#6B7280]">TOTAL PRESENT</p>
              <h3 className="text-2xl font-bold text-[#1A1A2E] mt-1">456</h3>
              <p className="text-xs text-[#10B981] mt-1">92.4% of total employees</p>
            </div>
            <div className="h-10 w-10 bg-[#DCFCE7] rounded-full flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-[#10B981]" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card border-[#E5E7EB]">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#6B7280]">LATE CHECK-IN</p>
              <h3 className="text-2xl font-bold text-[#1A1A2E] mt-1">12</h3>
              <p className="text-xs text-[#F59E0B] mt-1">Requires follow-up</p>
            </div>
            <div className="h-10 w-10 bg-[#FEF9C3] rounded-full flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-[#F59E0B]" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card border-[#E5E7EB]">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#6B7280]">ABSENT / NO INFO</p>
              <h3 className="text-2xl font-bold text-[#1A1A2E] mt-1">3</h3>
              <p className="text-xs text-[#EF4444] mt-1">Unexcused leaves today</p>
            </div>
            <div className="h-10 w-10 bg-[#FEE2E2] rounded-full flex items-center justify-center">
              <XCircle className="h-5 w-5 text-[#EF4444]" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card border-[#E5E7EB]">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#6B7280]">ANOMALIES</p>
              <h3 className="text-2xl font-bold text-[#1A1A2E] mt-1">8</h3>
              <p className="text-xs text-[#EF4444] mt-1">Missing check-out stamps</p>
            </div>
            <div className="h-10 w-10 bg-[#FEE2E2] rounded-full flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-[#EF4444]" />
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
                  { value: "All", label: "All Statuses" },
                  { value: "Present", label: "Present" },
                  { value: "Late", label: "Late" },
                  { value: "Absent", label: "Absent" },
                  { value: "On Leave", label: "On Leave" },
                  { value: "Anomalous", label: "Anomalous" },
                ]}
                className="w-48"
              />
            </div>
            <div className="flex gap-2">
              <Input type="date" className="w-40" />
            </div>
          </div>

          <DataTable
            data={filteredData}
            columns={columns}
            keyExtractor={(row) => row.id}
          />
        </CardContent>
      </Card>
    </div>
  );
}
