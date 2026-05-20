"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable, Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Printer, ShieldCheck } from "lucide-react";

interface ReleaseRecord {
  id: string;
  employeeId: string;
  name: string;
  resignDate: string;
  releasedAt: string;
  documentNo: string;
  referenceLetter: boolean;
}

const mockReleases: ReleaseRecord[] = [
  { id: "1", employeeId: "BNI0021", name: "Feri Setiawan", resignDate: "2026-05-10", releasedAt: "2026-05-11 09:00", documentNo: "SKK/BNIF/2026/089", referenceLetter: true },
  { id: "2", employeeId: "BNI0115", name: "Rian Hidayat", resignDate: "2026-05-25", releasedAt: "Not Released Yet", documentNo: "Pending Clearance", referenceLetter: false },
];

export default function ResignReleasePage() {
  const columns: Column<ReleaseRecord>[] = [
    { key: "employeeId", header: "Employee ID", sortable: true },
    { key: "name", header: "Employee Name", sortable: true },
    { key: "resignDate", header: "Effective Resign Date" },
    { key: "documentNo", header: "Reference No." },
    { key: "releasedAt", header: "Release Date" },
    {
      key: "referenceLetter",
      header: "Status",
      render: (row) => (
        <Badge variant={row.referenceLetter ? "success" : "warning"}>
          {row.referenceLetter ? "Released" : "Pending Release"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          {row.referenceLetter ? (
            <Button size="sm" variant="secondary" onClick={() => alert(`Printing Reference Letter for ${row.name}`)}>
              <Printer className="h-3 w-3 mr-1" /> Print Letter
            </Button>
          ) : (
            <Button size="sm" variant="primary" onClick={() => alert(`Generate release reference for ${row.name}`)}>
              <ShieldCheck className="h-3 w-3 mr-1" /> Issue Release
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Resign Final Release</h1>
        <p className="text-sm text-[#6B7280]">
          Issue, generate, and print reference letters (Surat Keterangan Kerja) for fully cleared former employees.
        </p>
      </div>

      <Card className="shadow-card border-[#E5E7EB]">
        <CardHeader>
          <CardTitle>Release Issuance Console</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={mockReleases}
            columns={columns}
            keyExtractor={(row) => row.id}
          />
        </CardContent>
      </Card>
    </div>
  );
}
