"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable, Column } from "@/components/ui/data-table";

const mockOvertimeHistory = [
  { id: "1", date: "2026-05-18", duration: "17:00 - 20:00 (3h)", type: "Project Deadline", status: "Approved" },
  { id: "2", date: "2026-05-20", duration: "17:00 - 19:00 (2h)", type: "System Maintenance", status: "Pending" },
];

export default function OvertimeHistoryPage() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "bg-[#DCFCE7] text-[#166534]";
      case "Pending": return "bg-[#FEF9C3] text-[#854D0E]";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const columns: Column<typeof mockOvertimeHistory[0]>[] = [
    { key: "date", header: "Date" },
    { key: "duration", header: "Duration" },
    { key: "type", header: "Task Type" },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <Badge variant="secondary" className={getStatusColor(row.status)}>
          {row.status}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Overtime History</h1>
        <p className="text-sm text-[#6B7280]">View the status of your past overtime requests</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <DataTable data={mockOvertimeHistory} columns={columns} keyExtractor={(row) => row.id} striped />
        </CardContent>
      </Card>
    </div>
  );
}
