"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable, Column } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const mockPaktaHistory = [
  { id: "1", year: "2025", signDate: "2025-01-10", status: "Signed" },
  { id: "2", year: "2024", signDate: "2024-01-15", status: "Signed" },
];

export default function PaktaIntegritasHistoryPage() {
  const columns: Column<typeof mockPaktaHistory[0]>[] = [
    { key: "year", header: "Period Year", render: (row) => <span className="font-bold text-[#1A1A2E]">{row.year}</span> },
    { key: "signDate", header: "Signed Date" },
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
      render: () => (
        <Button variant="ghost" className="h-8 text-[#1A2B6B]">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Pakta Integritas History</h1>
        <p className="text-sm text-[#6B7280]">View your previously signed integrity pacts</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <DataTable data={mockPaktaHistory} columns={columns} keyExtractor={(row) => row.id} striped />
        </CardContent>
      </Card>
    </div>
  );
}
