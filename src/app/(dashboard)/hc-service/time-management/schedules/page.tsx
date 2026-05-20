"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable, Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { CalendarRange, Plus, Clock } from "lucide-react";

interface WorkSchedule {
  id: string;
  name: string;
  code: string;
  clockIn: string;
  clockOut: string;
  gracePeriod: number; // in minutes
  description: string;
  isActive: boolean;
}

const mockSchedules: WorkSchedule[] = [
  { id: "1", code: "SCH-NORM", name: "Normal Office Shift", clockIn: "08:00", clockOut: "17:00", gracePeriod: 15, description: "Standard corporate hours, Mon-Fri", isActive: true },
  { id: "2", code: "SCH-SHF-A", name: "Morning Shift (A)", clockIn: "06:00", clockOut: "14:00", gracePeriod: 10, description: "Operations first shift, Mon-Sat", isActive: true },
  { id: "3", code: "SCH-SHF-B", name: "Evening Shift (B)", clockIn: "14:00", clockOut: "22:00", gracePeriod: 10, description: "Operations second shift, Mon-Sat", isActive: true },
];

export default function WorkSchedulesPage() {
  const columns: Column<WorkSchedule>[] = [
    { key: "code", header: "Schedule Code", sortable: true },
    { key: "name", header: "Shift Name", sortable: true },
    { key: "clockIn", header: "Clock In" },
    { key: "clockOut", header: "Clock Out" },
    { key: "gracePeriod", header: "Grace Period", align: "center", render: (row) => `${row.gracePeriod} mins` },
    { key: "description", header: "Description" },
    {
      key: "isActive",
      header: "Status",
      render: (row) => (
        <Badge variant={row.isActive ? "success" : "danger"}>
          {row.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <Button size="sm" variant="secondary" onClick={() => alert(`Modify shift ${row.name}`)}>
          Edit Shift
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Work Schedules</h1>
          <p className="text-sm text-[#6B7280]">
            Configure and govern standard corporate shift patterns, grace periods, and rules.
          </p>
        </div>
        <Button variant="primary" onClick={() => alert("Add shift parameter...")}>
          <Plus className="h-4 w-4 mr-2" /> Add Schedule Pattern
        </Button>
      </div>

      <Card className="shadow-card border-[#E5E7EB]">
        <CardHeader>
          <CardTitle>Work Schedule Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={mockSchedules}
            columns={columns}
            keyExtractor={(row) => row.id}
          />
        </CardContent>
      </Card>
    </div>
  );
}
