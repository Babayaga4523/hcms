"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable, Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

interface KYEFollowUp {
  id: string;
  code: string;
  name: string;
  targetRisk: string;
  slaDays: number;
  isActive: boolean;
}

const mockFollowUps: KYEFollowUp[] = [
  { id: "1", code: "SOP-HIGH-01", name: "Audit Clearance Interview", targetRisk: "High Risk Flags", slaDays: 3, isActive: true },
  { id: "2", code: "SOP-MED-02", name: "Declaration Revision Request", targetRisk: "Medium Risk Flags", slaDays: 7, isActive: true },
];

export default function KYEFollowUpPage() {
  const columns: Column<KYEFollowUp>[] = [
    { key: "code", header: "SOP Code", sortable: true },
    { key: "name", header: "Follow-up Action SOP", sortable: true },
    { key: "targetRisk", header: "Applicable Risk Marker" },
    { key: "slaDays", header: "Resolution SLA (Days)", align: "center" },
    {
      key: "isActive",
      header: "Status",
      render: (row) => (
        <Badge variant={row.isActive ? "success" : "secondary"}>
          {row.isActive ? "Enabled" : "Disabled"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <Button size="sm" variant="secondary" onClick={() => alert(`Modify SOP ${row.name}`)}>
          Edit SOP
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Risk Follow-up SOPs</h1>
          <p className="text-sm text-[#6B7280]">
            Configure and govern resolution workflows, target SLAs, and SOP steps for flagged employee audits.
          </p>
        </div>
        <Button variant="primary" onClick={() => alert("Add follow-up SOP...")}>
          <Plus className="h-4 w-4 mr-2" /> Add Follow-up SOP
        </Button>
      </div>

      <Card className="shadow-card border-[#E5E7EB]">
        <CardHeader>
          <CardTitle>Configured Follow-up Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={mockFollowUps}
            columns={columns}
            keyExtractor={(row) => row.id}
          />
        </CardContent>
      </Card>
    </div>
  );
}
