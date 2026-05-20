"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable, Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Trophy, CheckCircle, Shield } from "lucide-react";

interface LeadershipCompetency {
  id: string;
  competency: string;
  definition: string;
  targetRole: string;
  totalIndicators: number;
}

const mockCompetencies: LeadershipCompetency[] = [
  { id: "1", competency: "Strategic Vision Alignment", definition: "Translates corporate priorities into executable tactical department plans.", targetRole: "Manager & Above", totalIndicators: 4 },
  { id: "2", competency: "People & Talent Development", definition: "Actively mentors junior teams and guides professional succession paths.", targetRole: "Manager & Above", totalIndicators: 5 },
  { id: "3", competency: "Conflict Resolution & Decisiveness", definition: "Navigates multi-stakeholder friction to deliver firm compromises.", targetRole: "Director & VP", totalIndicators: 3 },
  { id: "4", competency: "Drive for Executive Excellence", definition: "Pushes operations to surpass set budget targets via workflow modernizations.", targetRole: "All Leaders", totalIndicators: 4 },
];

export default function LeadershipCompetencyPage() {
  const columns: Column<LeadershipCompetency>[] = [
    { key: "competency", header: "Competency Area", sortable: true },
    { key: "definition", header: "Definition Description" },
    { key: "targetRole", header: "Applicable Executive Group" },
    { key: "totalIndicators", header: "Key Indicators", align: "center" },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => alert(`Modify indicators for ${row.competency}`)}>
            Edit Indicators
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Leadership Competency Models</h1>
          <p className="text-sm text-[#6B7280]">
            Govern leadership indicators for senior executives and supervisor-level appraisals.
          </p>
        </div>
        <Button variant="primary" onClick={() => alert("Add competency model...")}>
          Add Competency Model
        </Button>
      </div>

      <Card className="shadow-card border-[#E5E7EB]">
        <CardHeader>
          <CardTitle>Leadership Standards & Competencies</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={mockCompetencies}
            columns={columns}
            keyExtractor={(row) => row.id}
          />
        </CardContent>
      </Card>
    </div>
  );
}
