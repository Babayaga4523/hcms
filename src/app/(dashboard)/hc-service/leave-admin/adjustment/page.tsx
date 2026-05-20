"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { DataTable, Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { CalendarRange, UserMinus, UserPlus, History } from "lucide-react";

interface AdjustmentRecord {
  id: string;
  employeeId: string;
  name: string;
  leaveType: string;
  amount: number;
  operation: "Add" | "Deduct";
  adjustedBy: string;
  date: string;
  reason: string;
}

const mockAdjustments: AdjustmentRecord[] = [
  { id: "1", employeeId: "BNI0012", name: "Yoga Utama", leaveType: "Annual Leave", amount: 2, operation: "Add", adjustedBy: "HR Admin", date: "2026-05-18", reason: "Carry over correction" },
  { id: "2", employeeId: "BNI0045", name: "Andi Wijaya", leaveType: "Maternity Leave", amount: 5, operation: "Deduct", adjustedBy: "HR Admin", date: "2026-05-15", reason: "Excess allocation" },
];

export default function LeaveAdjustmentPage() {
  const [records, setRecords] = React.useState<AdjustmentRecord[]>(mockAdjustments);
  const [formData, setFormData] = React.useState({
    employeeId: "",
    leaveType: "Annual Leave",
    amount: 1,
    operation: "Add" as "Add" | "Deduct",
    reason: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: AdjustmentRecord = {
      id: String(records.length + 1),
      employeeId: formData.employeeId,
      name: "Employee " + formData.employeeId,
      leaveType: formData.leaveType,
      amount: formData.amount,
      operation: formData.operation,
      adjustedBy: "HR Admin",
      date: new Date().toISOString().split("T")[0],
      reason: formData.reason,
    };
    setRecords([newRecord, ...records]);
    setFormData({ employeeId: "", leaveType: "Annual Leave", amount: 1, operation: "Add", reason: "" });
    alert("Adjustment processed successfully!");
  };

  const columns: Column<AdjustmentRecord>[] = [
    { key: "employeeId", header: "Employee ID", sortable: true },
    { key: "name", header: "Employee Name", sortable: true },
    { key: "leaveType", header: "Leave Type" },
    {
      key: "amount",
      header: "Adjustment",
      render: (row) => (
        <span className={row.operation === "Add" ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
          {row.operation === "Add" ? "+" : "-"}
          {row.amount} Days
        </span>
      ),
    },
    { key: "date", header: "Adjusted Date" },
    { key: "adjustedBy", header: "By" },
    { key: "reason", header: "Reason / Description" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Leave Balance Adjustment</h1>
        <p className="text-sm text-[#6B7280]">
          Manually add or deduct leave quotas for individual employees.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 shadow-card border-[#E5E7EB] bg-white">
          <CardHeader>
            <CardTitle>New Adjustment</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Employee ID / NIK"
                placeholder="e.g. BNI0012"
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                required
              />

              <Select
                label="Leave Type"
                value={formData.leaveType}
                onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                options={[
                  { value: "Annual Leave", label: "Annual Leave" },
                  { value: "Sick Leave", label: "Sick Leave" },
                  { value: "Maternity Leave", label: "Maternity Leave" },
                ]}
              />

              <Select
                label="Operation"
                value={formData.operation}
                onChange={(e) => setFormData({ ...formData, operation: e.target.value as "Add" | "Deduct" })}
                options={[
                  { value: "Add", label: "Add Days" },
                  { value: "Deduct", label: "Deduct Days" },
                ]}
              />

              <Input
                label="Number of Days"
                type="number"
                min="1"
                value={String(formData.amount)}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                required
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700">
                  Adjustment Reason
                </label>
                <textarea
                  className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm focus:border-[#1A2B6B] focus:outline-none focus:ring-1 focus:ring-[#1A2B6B]"
                  rows={3}
                  placeholder="Explain why this adjustment is necessary..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  required
                />
              </div>

              <Button variant="primary" className="w-full" type="submit">
                Apply Adjustment
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-card border-[#E5E7EB]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <History className="h-4 w-4 text-[#1A2B6B]" /> Adjustment Log
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={records}
              columns={columns}
              keyExtractor={(row) => row.id}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
