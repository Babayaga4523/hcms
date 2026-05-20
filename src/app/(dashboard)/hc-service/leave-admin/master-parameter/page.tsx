"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { DataTable, Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Settings, Plus, Edit, Trash } from "lucide-react";

interface LeaveParameter {
  id: string;
  code: string;
  name: string;
  quotaDays: number;
  gender: "All" | "Male" | "Female";
  carryOverMax: number;
  isActive: boolean;
}

const initialParameters: LeaveParameter[] = [
  { id: "1", code: "AL", name: "Annual Leave", quotaDays: 12, gender: "All", carryOverMax: 6, isActive: true },
  { id: "2", code: "SL", name: "Sick Leave", quotaDays: 30, gender: "All", carryOverMax: 0, isActive: true },
  { id: "3", code: "ML", name: "Maternity Leave", quotaDays: 90, gender: "Female", carryOverMax: 0, isActive: true },
  { id: "4", code: "PL", name: "Paternity Leave", quotaDays: 2, gender: "Male", carryOverMax: 0, isActive: true },
  { id: "5", code: "CL", name: "Compassionate Leave", quotaDays: 3, gender: "All", carryOverMax: 0, isActive: true },
];

export default function LeaveMasterParameterPage() {
  const [params, setParams] = React.useState<LeaveParameter[]>(initialParameters);
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [formData, setFormData] = React.useState<{
    code: string;
    name: string;
    quotaDays: number;
    gender: "All" | "Male" | "Female";
    carryOverMax: number;
    isActive: boolean;
  }>({
    code: "",
    name: "",
    quotaDays: 12,
    gender: "All",
    carryOverMax: 0,
    isActive: true,
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newParam: LeaveParameter = {
      id: String(params.length + 1),
      ...formData,
    };
    setParams([...params, newParam]);
    setShowAddForm(false);
    setFormData({ code: "", name: "", quotaDays: 12, gender: "All", carryOverMax: 0, isActive: true });
  };

  const toggleActive = (id: string) => {
    setParams(
      params.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
  };

  const columns: Column<LeaveParameter>[] = [
    { key: "code", header: "Code", sortable: true },
    { key: "name", header: "Parameter Name", sortable: true },
    { key: "quotaDays", header: "Quota (Days)", align: "center" },
    { key: "gender", header: "Gender Group" },
    { key: "carryOverMax", header: "Max Carry Over", align: "center" },
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
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => toggleActive(row.id)}>
            {row.isActive ? "Deactivate" : "Activate"}
          </Button>
          <Button size="sm" variant="secondary" onClick={() => alert(`Edit ${row.name}`)}>
            <Edit className="h-3 w-3" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Leave Master Parameters</h1>
          <p className="text-sm text-[#6B7280]">
            Configure and govern policy rules, quotas, and gender constraints for all leave types.
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="h-4 w-4 mr-2" /> Add Leave Type
        </Button>
      </div>

      {showAddForm && (
        <Card className="shadow-card border-[#E5E7EB] bg-white animate-fade-in">
          <CardHeader>
            <CardTitle>Define New Leave Parameter</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <Input
                label="Leave Code"
                placeholder="e.g. SL"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
              />
              <Input
                label="Leave Name"
                placeholder="e.g. Study Leave"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                label="Quota Days"
                type="number"
                value={String(formData.quotaDays)}
                onChange={(e) => setFormData({ ...formData, quotaDays: Number(e.target.value) })}
                required
              />
              <Select
                label="Applicable Gender"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as "All" | "Male" | "Female" })}
                options={[
                  { value: "All", label: "All" },
                  { value: "Male", label: "Male Only" },
                  { value: "Female", label: "Female Only" },
                ]}
              />
              <Input
                label="Max Carry-Over Days"
                type="number"
                value={String(formData.carryOverMax)}
                onChange={(e) => setFormData({ ...formData, carryOverMax: Number(e.target.value) })}
                required
              />
              <div className="flex gap-2 justify-end">
                <Button variant="secondary" type="button" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Save Policy
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-card border-[#E5E7EB]">
        <CardHeader>
          <CardTitle>Configured Leave Policies</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={params}
            columns={columns}
            keyExtractor={(row) => row.id}
          />
        </CardContent>
      </Card>
    </div>
  );
}
