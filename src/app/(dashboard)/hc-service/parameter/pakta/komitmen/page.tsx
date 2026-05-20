"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable, Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

interface CommitmentItem {
  id: string;
  code: string;
  text: string;
  category: "Conflict of Interest" | "Anti-Bribery" | "Confidentiality" | "Information Security";
  isActive: boolean;
}

const mockCommitments: CommitmentItem[] = [
  { id: "1", code: "COM-01", text: "Karyawan tidak akan menerima suap, gratifikasi, atau komisi dalam bentuk apa pun.", category: "Anti-Bribery", isActive: true },
  { id: "2", code: "COM-02", text: "Karyawan wajib menjaga kerahasiaan seluruh data transaksi nasabah BNI Finance.", category: "Confidentiality", isActive: true },
  { id: "3", code: "COM-03", text: "Karyawan akan menghindari keterlibatan dalam bisnis yang menimbulkan konflik kepentingan.", category: "Conflict of Interest", isActive: true },
];

export default function PaktaKomitmenPage() {
  const columns: Column<CommitmentItem>[] = [
    { key: "code", header: "Clause Code", sortable: true },
    { key: "category", header: "Commitment Category" },
    { key: "text", header: "Clause Text Detail" },
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
        <Button size="sm" variant="secondary" onClick={() => alert(`Edit clause ${row.code}`)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Commitment Clauses Library</h1>
          <p className="text-sm text-[#6B7280]">
            Govern standard legal clauses, commitments, and texts included in integrity pact drafts.
          </p>
        </div>
        <Button variant="primary" onClick={() => alert("Add clause template...")}>
          <Plus className="h-4 w-4 mr-2" /> Add Clause Clause
        </Button>
      </div>

      <Card className="shadow-card border-[#E5E7EB]">
        <CardHeader>
          <CardTitle>Commitment Clauses Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={mockCommitments}
            columns={columns}
            keyExtractor={(row) => row.id}
          />
        </CardContent>
      </Card>
    </div>
  );
}
