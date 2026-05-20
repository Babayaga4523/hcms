"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable, Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

interface KYEEmployeeAssignment {
  id: string;
  employeeId: string;
  name: string;
  assessorName: string;
  assignedAt: string;
  status: "Completed" | "Pending Review" | "Not Submitted";
}

const mockEmployeeAssignments: KYEEmployeeAssignment[] = [
  { id: "1", employeeId: "BNI0012", name: "Yoga Utama", assessorName: "Andi Wijaya (AVP)", assignedAt: "2026-05-02", status: "Completed" },
  { id: "2", employeeId: "BNI0045", name: "Andi Wijaya", assessorName: "Siti Rahma (MGR)", assignedAt: "2026-05-02", status: "Pending Review" },
];

export default function KYEAssignEmployeePage() {
  const columns: Column<KYEEmployeeAssignment>[] = [
    { key: "employeeId", header: "Employee ID", sortable: true },
    { key: "name", header: "Employee Name", sortable: true },
    { key: "assessorName", header: "Assigned Assessor / Auditor" },
    { key: "assignedAt", header: "Assignment Date" },
    {
      key: "status",
      header: "Declaration Status",
      render: (row) => (
        <Badge variant={row.status === "Completed" ? "success" : row.status === "Pending Review" ? "warning" : "danger"}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <Button size="sm" variant="secondary" onClick={() => alert(`Review assignment for ${row.name}`)}>
          Review
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">KYE Assessor Assignment</h1>
          <p className="text-sm text-[#6B7280]">
            Assign employees to respective risk audit assessors and monitor declaration completion.
          </p>
        </div>
        <Button variant="primary" onClick={() => alert("Add assessor assignment...")}>
          <Plus className="h-4 w-4 mr-2" /> Assign Assessor
        </Button>
      </div>

      <Card className="shadow-card border-[#E5E7EB]">
        <CardHeader>
          <CardTitle>Assessor Audit Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={mockEmployeeAssignments}
            columns={columns}
            keyExtractor={(row) => row.id}
          />
        </CardContent>
      </Card>
    </div>
  );
}
