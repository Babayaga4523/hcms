"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { DataTable, Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Zap, ShieldAlert, History, CheckCircle2 } from "lucide-react";

interface BatchHistory {
  id: string;
  year: string;
  generatedAt: string;
  scope: string;
  targetCount: number;
  status: "Completed" | "Pending" | "Failed";
}

const mockHistory: BatchHistory[] = [
  { id: "1", year: "2026", generatedAt: "2025-12-15 08:30", scope: "All Departments", targetCount: 1540, status: "Completed" },
  { id: "2", year: "2025", generatedAt: "2024-12-16 10:15", scope: "All Departments", targetCount: 1420, status: "Completed" },
  { id: "3", year: "2026", generatedAt: "2026-03-01 14:00", scope: "IT Division (New Joiners)", targetCount: 35, status: "Completed" },
];

export default function GenerateLeaveQuotaPage() {
  const [year, setYear] = React.useState("2026");
  const [department, setDepartment] = React.useState("All");
  const [status, setStatus] = React.useState<"idle" | "generating" | "done">("idle");
  const [progress, setProgress] = React.useState(0);

  const startGeneration = () => {
    setStatus("generating");
    setProgress(0);
  };

  React.useEffect(() => {
    if (status === "generating") {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setStatus("done");
            return 100;
          }
          return prev + 20;
        });
      }, 300);
      return () => clearInterval(interval);
    }
  }, [status]);

  const columns: Column<BatchHistory>[] = [
    { key: "year", header: "Quota Year", sortable: true },
    { key: "generatedAt", header: "Execution Time" },
    { key: "scope", header: "Target Scope" },
    { key: "targetCount", header: "Employees Count", align: "center" },
    {
      key: "status",
      header: "Execution Status",
      render: (row) => (
        <Badge variant={row.status === "Completed" ? "success" : "warning"}>
          {row.status}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Batch Quota Generation</h1>
        <p className="text-sm text-[#6B7280]">
          Initialize and allocate standard leave quotas in batches for a fiscal year.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-card border-[#E5E7EB]">
            <CardHeader>
              <CardTitle>Trigger Allocator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                label="Target Year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                options={[
                  { value: "2026", label: "2026 (Active)" },
                  { value: "2027", label: "2027 (Upcoming)" },
                ]}
              />

              <Select
                label="Target Department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                options={[
                  { value: "All", label: "All Departments" },
                  { value: "IT", label: "IT & Information Systems" },
                  { value: "Finance", label: "Finance & Accounting" },
                  { value: "HR", label: "Human Resources" },
                ]}
              />

              <div className="p-3 bg-[#FEF9C3] rounded-md border border-[#F59E0B]/30 flex gap-2 text-xs text-[#854D0E]">
                <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                <p>
                  <strong>Warning:</strong> Re-generating quotas for employees who already have allocations will reset balances.
                </p>
              </div>

              {status === "idle" && (
                <Button variant="primary" className="w-full" onClick={startGeneration}>
                  <Zap className="h-4 w-4 mr-2" /> Start Generation
                </Button>
              )}

              {status === "generating" && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-[#1A2B6B]">
                    <span>Allocating quotas...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#1A2B6B] h-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {status === "done" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#10B981] p-3 bg-[#DCFCE7] rounded-md">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Allocated successfully!</span>
                  </div>
                  <Button variant="secondary" className="w-full" onClick={() => setStatus("idle")}>
                    Reset Console
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="shadow-card border-[#E5E7EB]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <History className="h-4 w-4 text-[#1A2B6B]" /> Batch Run History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                data={mockHistory}
                columns={columns}
                keyExtractor={(row) => row.id}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
