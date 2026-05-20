"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable, Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

interface KYEIrregularity {
  id: string;
  code: string;
  name: string;
  triggerCondition: string;
  riskLevel: "High" | "Medium" | "Low";
  isActive: boolean;
}

const mockIrregularities: KYEIrregularity[] = [
  { id: "1", code: "IRR-01", name: "Undisclosed Affiliate Accounts", triggerCondition: "Affiliate transaction detected without self-declaration", riskLevel: "High", isActive: true },
  { id: "2", code: "IRR-02", name: "Excess Outside Activity Time", triggerCondition: "Outside employment exceeding 10 hours a week declared", riskLevel: "Medium", isActive: true },
];

export default function KYEIrregularitiesPage() {
  const columns: Column<KYEIrregularity>[] = [
    { key: "code", header: "Irregularity Code", sortable: true },
    { key: "name", header: "Irregularity Rule Name", sortable: true },
    { key: "triggerCondition", header: "Automatic Trigger Condition" },
    {
      key: "riskLevel",
      header: "Risk Level",
      render: (row) => (
        <Badge variant={row.riskLevel === "High" ? "danger" : row.riskLevel === "Medium" ? "warning" : "info"}>
          {row.riskLevel}
        </Badge>
      ),
    },
    {
      key: "isActive",
      header: "Active Status",
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
        <Button size="sm" variant="secondary" onClick={() => alert(`Modify trigger rule ${row.name}`)}>
          Edit Trigger
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Irregularities Trigger Rules</h1>
          <p className="text-sm text-[#6B7280]">
            Configure and govern automated rules that trigger risk markers on employee disclosures.
          </p>
        </div>
        <Button variant="primary" onClick={() => alert("Add irregularity trigger...")}>
          <Plus className="h-4 w-4 mr-2" /> Add Trigger Rule
        </Button>
      </div>

      <Card className="shadow-card border-[#E5E7EB]">
        <CardHeader>
          <CardTitle>Automatic Irregularities Triggers</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={mockIrregularities}
            columns={columns}
            keyExtractor={(row) => row.id}
          />
        </CardContent>
      </Card>
    </div>
  );
}
