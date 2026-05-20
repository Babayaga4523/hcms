"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable, Column } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Search, Eye } from "lucide-react";

const mockPermissionHistory = [
  { id: "1", type: "Leave in Mid-day", date: "2026-05-18", duration: "13:00 - 15:00", reason: "Medical checkup", status: "Approved" },
  { id: "2", type: "Arrive Late", date: "2026-05-22", duration: "08:00 - 09:30", reason: "Family emergency", status: "Pending" },
  { id: "3", type: "Leave Early", date: "2026-04-10", duration: "15:00 - 17:00", reason: "Personal matters", status: "Rejected" },
];

export default function WorkOfPermissionHistoryPage() {
  const [searchQuery, setSearchQuery] = React.useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "bg-[#DCFCE7] text-[#166534]";
      case "Pending": return "bg-[#FEF9C3] text-[#854D0E]";
      case "Rejected": return "bg-[#FEE2E2] text-[#991B1B]";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const columns: Column<typeof mockPermissionHistory[0]>[] = [
    { key: "type", header: "Permission Type", render: (row) => <span className="font-medium text-[#1A1A2E]">{row.type}</span> },
    { key: "date", header: "Date" },
    { key: "duration", header: "Time Duration" },
    { key: "reason", header: "Reason" },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <Badge variant="secondary" className={getStatusColor(row.status)}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: () => (
        <Button variant="ghost" className="h-8 w-8 p-0 text-[#1A2B6B]">
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Permission History</h1>
        <p className="text-sm text-[#6B7280]">View the status of your past permission requests</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative min-w-[300px] w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Search by reason..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2B6B]"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <DataTable data={mockPermissionHistory} columns={columns} keyExtractor={(row) => row.id} striped />
        </CardContent>
      </Card>
    </div>
  );
}
