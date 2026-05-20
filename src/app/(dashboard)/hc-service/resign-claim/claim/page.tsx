"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable, Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ResignClaim {
  id: string;
  employeeId: string;
  name: string;
  resignDate: string;
  itClearance: "Cleared" | "Pending";
  financeClearance: "Cleared" | "Pending";
  hrClearance: "Cleared" | "Pending";
  overallStatus: "Pending Clearance" | "Ready for Release";
}

const mockClaims: ResignClaim[] = [
  { id: "1", employeeId: "BNI0041", name: "Siti Aisyah", resignDate: "2026-05-30", itClearance: "Cleared", financeClearance: "Pending", hrClearance: "Cleared", overallStatus: "Pending Clearance" },
  { id: "2", employeeId: "BNI0115", name: "Rian Hidayat", resignDate: "2026-05-25", itClearance: "Cleared", financeClearance: "Cleared", hrClearance: "Cleared", overallStatus: "Ready for Release" },
];

export default function ResignClaimPage() {
  const [search, setSearch] = React.useState("");

  const filteredClaims = mockClaims.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.employeeId.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<ResignClaim>[] = [
    { key: "employeeId", header: "Employee ID", sortable: true },
    { key: "name", header: "Employee Name", sortable: true },
    { key: "resignDate", header: "Effective Resign Date" },
    {
      key: "itClearance",
      header: "IT Assets",
      render: (row) => (
        <Badge variant={row.itClearance === "Cleared" ? "success" : "warning"}>
          {row.itClearance}
        </Badge>
      ),
    },
    {
      key: "financeClearance",
      header: "Finance/Loan",
      render: (row) => (
        <Badge variant={row.financeClearance === "Cleared" ? "success" : "warning"}>
          {row.financeClearance}
        </Badge>
      ),
    },
    {
      key: "hrClearance",
      header: "HR Clearance",
      render: (row) => (
        <Badge variant={row.hrClearance === "Cleared" ? "success" : "warning"}>
          {row.hrClearance}
        </Badge>
      ),
    },
    {
      key: "overallStatus",
      header: "Overall Status",
      render: (row) => (
        <Badge variant={row.overallStatus === "Ready for Release" ? "success" : "info"}>
          {row.overallStatus}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="primary" onClick={() => alert(`Review checklists for ${row.name}`)}>
            Review Checklists
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Exit Clearance Checklist</h1>
        <p className="text-sm text-[#6B7280]">
          Track, review, and approve departmental exit clearances for resigning personnel.
        </p>
      </div>

      <Card className="shadow-card border-[#E5E7EB]">
        <CardHeader>
          <CardTitle>Resignation Clearances</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-w-md">
            <Input
              placeholder="Search employee NIK or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>

          <DataTable
            data={filteredClaims}
            columns={columns}
            keyExtractor={(row) => row.id}
          />
        </CardContent>
      </Card>
    </div>
  );
}
