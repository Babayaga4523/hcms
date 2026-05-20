"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { DataTable, Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Star, ShieldCheck } from "lucide-react";

interface KPITemplate {
  id: string;
  code: string;
  name: string;
  category: string;
  defaultWeight: number;
  target: string;
  unit: string;
}

const mockKPIs: KPITemplate[] = [
  { id: "1", code: "KPI-FIN-01", name: "Budget Utilization Efficiency", category: "Finance", defaultWeight: 20, target: "95% - 100%", unit: "Percentage" },
  { id: "2", code: "KPI-IT-02", name: "System Uptime & Reliability", category: "Technology", defaultWeight: 25, target: "99.9%", unit: "Percentage" },
  { id: "3", code: "KPI-HR-03", name: "Time-to-Hire for Key Roles", category: "Human Resources", defaultWeight: 15, target: "< 35 Days", unit: "Days" },
  { id: "4", code: "KPI-SLS-04", name: "New Customer Acquisition Rate", category: "Sales & Marketing", defaultWeight: 30, target: "+15% YoY", unit: "Percentage" },
];

export default function KPILibraryPage() {
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState("All");

  const filteredKPIs = mockKPIs.filter((kpi) => {
    const matchesSearch = kpi.name.toLowerCase().includes(search.toLowerCase()) || 
                          kpi.code.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || kpi.category === category;
    return matchesSearch && matchesCategory;
  });

  const columns: Column<KPITemplate>[] = [
    { key: "code", header: "KPI Code", sortable: true },
    { key: "name", header: "KPI Indicator", sortable: true },
    { key: "category", header: "Category" },
    { key: "defaultWeight", header: "Default Weight", align: "center", render: (row) => `${row.defaultWeight}%` },
    { key: "target", header: "Target Standard" },
    { key: "unit", header: "Measurement Unit" },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => alert(`Edit ${row.name}`)}>
            Edit
          </Button>
          <Button size="sm" variant="secondary" className="text-red-500 hover:text-red-700" onClick={() => alert(`Delete ${row.name}`)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">KPI Template Library</h1>
          <p className="text-sm text-[#6B7280]">
            Govern standard corporate Key Performance Indicators used during evaluations.
          </p>
        </div>
        <Button variant="primary" onClick={() => alert("Add KPI Panel...")}>
          <Plus className="h-4 w-4 mr-2" /> Add KPI Indicator
        </Button>
      </div>

      <Card className="shadow-card border-[#E5E7EB]">
        <CardHeader>
          <CardTitle>Master KPI Pool</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 max-w-md">
              <Input
                placeholder="Search KPI code or indicator..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={[
                { value: "All", label: "All Categories" },
                { value: "Finance", label: "Finance" },
                { value: "Technology", label: "Technology" },
                { value: "Human Resources", label: "Human Resources" },
                { value: "Sales & Marketing", label: "Sales & Marketing" },
              ]}
              className="w-48"
            />
          </div>

          <DataTable
            data={filteredKPIs}
            columns={columns}
            keyExtractor={(row) => row.id}
          />
        </CardContent>
      </Card>
    </div>
  );
}
