"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DataTable, Column } from "@/components/ui/data-table";
import { Search, Download, Calendar } from "lucide-react";

// Mock data for Attendance
const mockAttendance = [
  {
    id: "1",
    name: "Yoga Utama",
    date: "2026-05-20",
    clockIn: "08:00",
    clockOut: "17:00",
    duration: "9h 0m",
    status: "Present",
    location: "Head Office",
  },
  {
    id: "2",
    name: "Budi Santoso",
    date: "2026-05-20",
    clockIn: "08:15",
    clockOut: "17:00",
    duration: "8h 45m",
    status: "Late",
    location: "Head Office",
  },
  {
    id: "3",
    name: "Diana Pratama",
    date: "2026-05-20",
    clockIn: "-",
    clockOut: "-",
    duration: "-",
    status: "Absent",
    location: "-",
  },
  {
    id: "4",
    name: "Andi Wijaya",
    date: "2026-05-20",
    clockIn: "08:00",
    clockOut: "17:30",
    duration: "9h 30m",
    status: "WFH",
    location: "Home",
  },
];

export default function AttendancePage() {
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredData = mockAttendance.filter((record) =>
    record.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Present":
        return "bg-[#DCFCE7] text-[#166534] hover:bg-[#DCFCE7]";
      case "Late":
        return "bg-[#FEF9C3] text-[#854D0E] hover:bg-[#FEF9C3]";
      case "Absent":
        return "bg-[#FEE2E2] text-[#991B1B] hover:bg-[#FEE2E2]";
      case "WFH":
        return "bg-[#DBEAFE] text-[#1E40AF] hover:bg-[#DBEAFE]";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const columns: Column<typeof mockAttendance[0]>[] = [
    { key: "name", header: "Employee Name" },
    { key: "date", header: "Date" },
    { key: "clockIn", header: "Clock In" },
    { key: "clockOut", header: "Clock Out" },
    { key: "duration", header: "Duration" },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <Badge variant="secondary" className={getStatusColor(row.status)}>
          {row.status}
        </Badge>
      ),
    },
    { key: "location", header: "Location" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Attendance</h1>
          <p className="text-sm text-[#6B7280]">
            Monitor employee daily attendance and working hours
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4 justify-between">
            <div className="flex items-center gap-4">
              <div className="relative min-w-[250px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
                <input
                  type="text"
                  placeholder="Search employee..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2B6B] focus:border-transparent"
                />
              </div>
              <div className="flex items-center border border-[#E5E7EB] rounded-lg px-3 py-2 bg-white">
                <Calendar className="h-4 w-4 text-[#6B7280] mr-2" />
                <span className="text-sm text-[#1A1A2E]">20 May 2026 - 20 May 2026</span>
              </div>
            </div>
            <Button variant="secondary" className="text-[#1A2B6B] border border-[#1A2B6B] bg-white hover:bg-gray-50">
              <Download className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <DataTable
            data={filteredData}
            columns={columns}
            keyExtractor={(row) => row.id}
            striped
          />
        </CardContent>
      </Card>
    </div>
  );
}