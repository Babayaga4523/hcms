"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DataTable, Column } from "@/components/ui/data-table";
import { Search, Calendar, Download, Edit } from "lucide-react";

const mockWorkingDays = [
  { id: "1", name: "Yoga Utama", role: "HR Admin", shift: "Morning (08:00 - 17:00)", days: "Mon-Fri", status: "Active" },
  { id: "2", name: "Budi Santoso", role: "Sales", shift: "Morning (08:00 - 17:00)", days: "Mon-Fri", status: "Active" },
  { id: "3", name: "Diana Pratama", role: "Support", shift: "Evening (15:00 - 00:00)", days: "Tue-Sat", status: "Active" },
  { id: "4", name: "Andi Wijaya", role: "Security", shift: "Night (00:00 - 08:00)", days: "Rotational", status: "Active" },
];

export default function EmployeeWorkingDaysPage() {
  const [searchQuery, setSearchQuery] = React.useState("");

  const columns: Column<typeof mockWorkingDays[0]>[] = [
    { key: "name", header: "Employee Name", render: (row) => <span className="font-medium text-[#1A1A2E]">{row.name}</span> },
    { key: "role", header: "Role" },
    { key: "shift", header: "Shift Schedule" },
    { key: "days", header: "Working Days" },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <Badge variant="secondary" className="bg-[#DCFCE7] text-[#166534]">
          {row.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (row) => (
        <Button variant="ghost" className="h-8 w-8 p-0 text-[#1A2B6B]">
          <Edit className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Employee Working Days</h1>
          <p className="text-sm text-[#6B7280]">
            Manage employee shifts and working schedules
          </p>
        </div>
        <Button variant="primary" leftIcon={<Calendar className="h-4 w-4" />}>
          Assign Schedule
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative min-w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
              <input
                type="text"
                placeholder="Search by name or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2B6B]"
              />
            </div>
            <Button variant="secondary" className="text-[#1A2B6B] border border-[#1A2B6B] bg-white">
              <Download className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <DataTable
            data={mockWorkingDays}
            columns={columns}
            keyExtractor={(row) => row.id}
            striped
          />
        </CardContent>
      </Card>
    </div>
  );
}
