"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable, Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

interface ApprovalLevel {
  id: string;
  documentType: string;
  level1: string;
  level2: string;
  level3: string;
  isActive: boolean;
}

const mockApprovalLevels: ApprovalLevel[] = [
  { id: "1", documentType: "Leave Request", level1: "Direct Supervisor", level2: "Department Head", level3: "Not Required", isActive: true },
  { id: "2", documentType: "Overtime Request", level1: "Direct Supervisor", level2: "Division Head", level3: "Not Required", isActive: true },
  { id: "3", documentType: "Resignation Request", level1: "Direct Supervisor", level2: "Division Head", level3: "HC Admin", isActive: true },
];

export default function ApprovalLevelsPage() {
  const columns: Column<ApprovalLevel>[] = [
    { key: "documentType", header: "Document / Workflow", sortable: true },
    { key: "level1", header: "Approval Level 1" },
    { key: "level2", header: "Approval Level 2" },
    { key: "level3", header: "Approval Level 3" },
    {
      key: "isActive",
      header: "Status",
      render: (row) => (
        <Badge variant={row.isActive ? "success" : "secondary"}>
          {row.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <Button size="sm" variant="secondary" onClick={() => alert(`Modify workflow for ${row.documentType}`)}>
          Edit Workflow
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Approval Level Settings</h1>
          <p className="text-sm text-[#6B7280]">
            Configure and govern document submission workflows, approval sequences, and required authorities.
          </p>
        </div>
        <Button variant="primary" onClick={() => alert("Add workflow matrix...")}>
          <Plus className="h-4 w-4 mr-2" /> Add Workflow Matrix
        </Button>
      </div>

      <Card className="shadow-card border-[#E5E7EB]">
        <CardHeader>
          <CardTitle>Approval Level Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={mockApprovalLevels}
            columns={columns}
            keyExtractor={(row) => row.id}
          />
        </CardContent>
      </Card>
    </div>
  );
}
