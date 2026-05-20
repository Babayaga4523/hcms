"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable, Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

interface PaktaAssignment {
  id: string;
  pactName: string;
  targetGroup: string;
  deadLine: string;
  isActive: boolean;
}

const mockPactAssignments: PaktaAssignment[] = [
  { id: "1", pactName: "Annual Code of Ethics Commitment 2026", targetGroup: "All Corporate Personnel", deadLine: "2026-06-30", isActive: true },
  { id: "2", pactName: "Financial Trader High-Integrity Declaration", targetGroup: "Treasury Department", deadLine: "2026-05-31", isActive: true },
];

export default function PaktaAssignmentPage() {
  const columns: Column<PaktaAssignment>[] = [
    { key: "pactName", header: "Pact Campaign Name", sortable: true },
    { key: "targetGroup", header: "Target Personnel Group" },
    { key: "deadLine", header: "Signature Deadline" },
    {
      key: "isActive",
      header: "Campaign Status",
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
        <Button size="sm" variant="secondary" onClick={() => alert(`Review campaign ${row.pactName}`)}>
          Review Progress
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Integrity Pact Assignments</h1>
          <p className="text-sm text-[#6B7280]">
            Schedule and configure mandatory Integrity Pact batches and signature completion audits.
          </p>
        </div>
        <Button variant="primary" onClick={() => alert("Schedule pact batch...")}>
          <Plus className="h-4 w-4 mr-2" /> Assign Pact Campaign
        </Button>
      </div>

      <Card className="shadow-card border-[#E5E7EB]">
        <CardHeader>
          <CardTitle>Pact Signing Batches</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={mockPactAssignments}
            columns={columns}
            keyExtractor={(row) => row.id}
          />
        </CardContent>
      </Card>
    </div>
  );
}
