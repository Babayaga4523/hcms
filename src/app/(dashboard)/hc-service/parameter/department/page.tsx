"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable, Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search } from "lucide-react";

interface DepartmentRecord {
  id: string;
  code: string;
  name: string;
  headName: string;
  division: string;
  isActive: boolean;
}

const mockDepartments: DepartmentRecord[] = [
  { id: "1", code: "DEP-IT-DEV", name: "Software Development", headName: "Yoga Utama", division: "IT Division", isActive: true },
  { id: "2", code: "DEP-FIN-ACC", name: "Corporate Accounting", headName: "Siti Rahma", division: "Finance Division", isActive: true },
  { id: "3", code: "DEP-HR-OPS", name: "HR Operations", headName: "Andi Wijaya", division: "Human Resources", isActive: true },
];

export default function DepartmentSettingsPage() {
  const [search, setSearch] = React.useState("");

  const filteredDeps = mockDepartments.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.code.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<DepartmentRecord>[] = [
    { key: "code", header: "Department Code", sortable: true },
    { key: "name", header: "Department Name", sortable: true },
    { key: "division", header: "Parent Division" },
    { key: "headName", header: "Department Head (PJS)" },
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
        <Button size="sm" variant="secondary" onClick={() => alert(`Edit department ${row.name}`)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Department Settings</h1>
          <p className="text-sm text-[#6B7280]">
            Manage all departments, hierarchy parents, and department lead assignments.
          </p>
        </div>
        <Button variant="primary" onClick={() => alert("Add department modal...")}>
          <Plus className="h-4 w-4 mr-2" /> Add Department
        </Button>
      </div>

      <Card className="shadow-card border-[#E5E7EB]">
        <CardHeader>
          <CardTitle>Departments Directory</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-w-md">
            <Input
              placeholder="Search departments or codes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>

          <DataTable
            data={filteredDeps}
            columns={columns}
            keyExtractor={(row) => row.id}
          />
        </CardContent>
      </Card>
    </div>
  );
}
