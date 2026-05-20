"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable, Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search } from "lucide-react";

interface PositionRecord {
  id: string;
  code: string;
  title: string;
  grade: string;
  minExperience: string;
  isActive: boolean;
}

const mockPositions: PositionRecord[] = [
  { id: "1", code: "POS-VP", title: "Vice President", grade: "Grade 18", minExperience: "12+ Years", isActive: true },
  { id: "2", code: "POS-AVP", title: "Assistant Vice President", grade: "Grade 16", minExperience: "8+ Years", isActive: true },
  { id: "3", code: "POS-MGR", title: "Manager", grade: "Grade 14", minExperience: "5+ Years", isActive: true },
  { id: "4", code: "POS-SO", title: "Senior Officer", grade: "Grade 12", minExperience: "3+ Years", isActive: true },
  { id: "5", code: "POS-OFC", title: "Officer", grade: "Grade 10", minExperience: "1+ Years", isActive: true },
];

export default function PositionSettingsPage() {
  const [search, setSearch] = React.useState("");

  const filteredPositions = mockPositions.filter((pos) =>
    pos.title.toLowerCase().includes(search.toLowerCase()) ||
    pos.code.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<PositionRecord>[] = [
    { key: "code", header: "Position Code", sortable: true },
    { key: "title", header: "Job Title", sortable: true },
    { key: "grade", header: "Standard Grade" },
    { key: "minExperience", header: "Min Experience" },
    {
      key: "isActive",
      header: "Status",
      render: (row) => (
        <Badge variant={row.isActive ? "success" : "danger"}>
          {row.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <Button size="sm" variant="secondary" onClick={() => alert(`Edit position ${row.title}`)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Job Position Settings</h1>
          <p className="text-sm text-[#6B7280]">
            Manage all corporate roles, job titles, and standard grading ranks.
          </p>
        </div>
        <Button variant="primary" onClick={() => alert("Add position modal...")}>
          <Plus className="h-4 w-4 mr-2" /> Add Position
        </Button>
      </div>

      <Card className="shadow-card border-[#E5E7EB]">
        <CardHeader>
          <CardTitle>Position Master Directory</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-w-md">
            <Input
              placeholder="Search positions or codes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>

          <DataTable
            data={filteredPositions}
            columns={columns}
            keyExtractor={(row) => row.id}
          />
        </CardContent>
      </Card>
    </div>
  );
}
