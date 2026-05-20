"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable, Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search } from "lucide-react";

interface DivisionRecord {
  id: string;
  code: string;
  name: string;
  headName: string;
  totalDepartments: number;
  isActive: boolean;
}

const mockDivisions: DivisionRecord[] = [
  { id: "1", code: "DIV-IT", name: "Information Technology Division", headName: "Yoga Utama", totalDepartments: 4, isActive: true },
  { id: "2", code: "DIV-FIN", name: "Finance & Accounting Division", headName: "Siti Rahma", totalDepartments: 3, isActive: true },
  { id: "3", code: "DIV-HC", name: "Human Capital Division", headName: "Andi Wijaya", totalDepartments: 2, isActive: true },
];

export default function DivisionSettingsPage() {
  const [search, setSearch] = React.useState("");

  const filteredDivs = mockDivisions.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.code.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<DivisionRecord>[] = [
    { key: "code", header: "Division Code", sortable: true },
    { key: "name", header: "Division Name", sortable: true },
    { key: "headName", header: "Division Head (VP)" },
    { key: "totalDepartments", header: "Active DepartmentsCount", align: "center" },
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
        <Button size="sm" variant="secondary" onClick={() => alert(`Edit division ${row.name}`)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Division Settings</h1>
          <p className="text-sm text-[#6B7280]">
            Manage all corporate divisions, hierarchy parent structures, and division leads.
          </p>
        </div>
        <Button variant="primary" onClick={() => alert("Add division modal...")}>
          <Plus className="h-4 w-4 mr-2" /> Add Division
        </Button>
      </div>

      <Card className="shadow-card border-[#E5E7EB]">
        <CardHeader>
          <CardTitle>Divisions Directory</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-w-md">
            <Input
              placeholder="Search divisions or codes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>

          <DataTable
            data={filteredDivs}
            columns={columns}
            keyExtractor={(row) => row.id}
          />
        </CardContent>
      </Card>
    </div>
  );
}
