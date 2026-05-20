"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable, Column } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Search, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockResignHistory = [
  {
    id: "1",
    employeeName: "Budi Santoso",
    nik: "BNI001",
    requestDate: "2026-05-15",
    resignDate: "2026-06-15",
    reason: "Career Change",
    status: "Pending Approval",
  },
  {
    id: "2",
    employeeName: "Diana Pratama",
    nik: "BNI002",
    requestDate: "2026-04-10",
    resignDate: "2026-05-10",
    reason: "Personal",
    status: "Approved",
  },
];

export default function CaretakerResignHistoryPage() {
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredData = mockResignHistory.filter((record) =>
    record.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.nik.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-[#DCFCE7] text-[#166534]";
      case "Pending Approval":
        return "bg-[#FEF9C3] text-[#854D0E]";
      case "Rejected":
        return "bg-[#FEE2E2] text-[#991B1B]";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const columns: Column<typeof mockResignHistory[0]>[] = [
    { key: "nik", header: "NIK" },
    { key: "employeeName", header: "Employee Name", render: (row) => <span className="font-medium text-[#1A1A2E]">{row.employeeName}</span> },
    { key: "requestDate", header: "Request Date" },
    { key: "resignDate", header: "Effective Date" },
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
      render: (row) => (
        <Button variant="ghost" className="h-8 w-8 p-0 text-[#1A2B6B]">
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Resignation History</h1>
          <p className="text-sm text-[#6B7280]">
            Track the status of caretaker resignation requests
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative min-w-[300px] w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Search by name or NIK..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2B6B]"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <DataTable
            data={filteredData}
            columns={columns}
            keyExtractor={(row) => row.id}
            striped
          />
        </CardContent>
      </Card>
    </div>
  );
}
