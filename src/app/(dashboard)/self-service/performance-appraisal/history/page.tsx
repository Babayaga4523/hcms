"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable, Column } from "@/components/ui/data-table";

const mockPerformanceHistory = [
  { id: "1", period: "H1 2026", score: "92", grade: "A (Excellent)", status: "Finalized" },
  { id: "2", period: "H2 2025", score: "88", grade: "B (Good)", status: "Finalized" },
  { id: "3", period: "H1 2025", score: "95", grade: "A (Excellent)", status: "Finalized" },
];

export default function PerformanceAppraisalHistoryPage() {
  const getGradeColor = (grade: string) => {
    if (grade.includes("A")) return "bg-[#DCFCE7] text-[#166534]";
    if (grade.includes("B")) return "bg-[#DBEAFE] text-[#1E3A8A]";
    return "bg-gray-100 text-gray-800";
  };

  const columns: Column<typeof mockPerformanceHistory[0]>[] = [
    { key: "period", header: "Period", render: (row) => <span className="font-bold text-[#1A1A2E]">{row.period}</span> },
    { key: "score", header: "Final Score" },
    {
      key: "grade",
      header: "Grade",
      render: (row) => (
        <Badge variant="secondary" className={getGradeColor(row.grade)}>
          {row.grade}
        </Badge>
      ),
    },
    { key: "status", header: "Status" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Appraisal History</h1>
        <p className="text-sm text-[#6B7280]">View your past performance reviews and scores</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <DataTable data={mockPerformanceHistory} columns={columns} keyExtractor={(row) => row.id} striped />
        </CardContent>
      </Card>
    </div>
  );
}
