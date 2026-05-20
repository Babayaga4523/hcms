"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable, Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

interface KYEAssignment {
  id: string;
  programName: string;
  startDate: string;
  endDate: string;
  targetGroup: string;
  status: "Active" | "Scheduled" | "Completed";
}

const mockAssignments: KYEAssignment[] = [
  { id: "1", programName: "Annual Financial Disclosure 2026", startDate: "2026-05-01", endDate: "2026-06-30", targetGroup: "All Employees", status: "Active" },
  { id: "2", programName: "Executive Conflict of Interest Audit", startDate: "2026-07-01", endDate: "2026-08-31", targetGroup: "Manager & Above", status: "Scheduled" },
];

export default function KYEAssignmentPage() {
  const columns: Column<KYEAssignment>[] = [
    { key: "programName", header: "Program Name", sortable: true },
    { key: "targetGroup", header: "Target Employee Group" },
    { key: "startDate", header: "Start Date" },
    { key: "endDate", header: "End Date" },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <Badge variant={row.status === "Active" ? "success" : row.status === "Scheduled" ? "info" : "secondary"}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <Button size="sm" variant="secondary" onClick={() => alert(`Review program ${row.programName}`)}>
          Review
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">KYE Program Scheduling</h1>
          <p className="text-sm text-[#6B7280]">
            Schedule and configure corporate disclosure audits, audits, and declarations.
          </p>
        </div>
        <Button variant="primary" onClick={() => alert("Schedule KYE program...")}>
          <Plus className="h-4 w-4 mr-2" /> Schedule Program
        </Button>
      </div>

      <Card className="shadow-card border-[#E5E7EB]">
        <CardHeader>
          <CardTitle>KYE Scheduled Programs</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={mockAssignments}
            columns={columns}
            keyExtractor={(row) => row.id}
          />
        </CardContent>
      </Card>
    </div>
  );
}
