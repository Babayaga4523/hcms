"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, Input } from "@/components/ui/input";
import { DataTable, Column } from "@/components/ui/data-table";
import { Download, FileText, FileSpreadsheet, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data
const mockReportData = [
  { id: "1", nik: "BNI001", name: "Yoga Utama", dept: "Human Capital", date: "2026-05-01", value1: "Present", value2: "08:00" },
  { id: "2", nik: "BNI002", name: "Budi Santoso", dept: "Sales", date: "2026-05-01", value1: "Present", value2: "08:15" },
  { id: "3", nik: "BNI003", name: "Diana Pratama", dept: "Marketing", date: "2026-05-01", value1: "Absent", value2: "-" },
  { id: "4", nik: "BNI004", name: "Andi Wijaya", dept: "Operations", date: "2026-05-01", value1: "Leave", value2: "-" },
  { id: "5", nik: "BNI005", name: "Siti Rahayu", dept: "Finance", date: "2026-05-01", value1: "Present", value2: "07:55" },
];

export default function ReportPage() {
  const [activeTab, setActiveTab] = React.useState("attendance");
  const [isGenerating, setIsGenerating] = React.useState(false);

  const tabs = [
    { id: "attendance", label: "Attendance Report" },
    { id: "leave", label: "Leave Report" },
    { id: "resign", label: "Resign Report" },
    { id: "employee", label: "Employee Data Report" },
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 1000);
  };

  const columns: Column<typeof mockReportData[0]>[] = [
    { key: "nik", header: "NIK" },
    { key: "name", header: "Employee Name" },
    { key: "dept", header: "Department" },
    { key: "date", header: "Date" },
    { key: "value1", header: activeTab === "attendance" ? "Status" : "Type" },
    { key: "value2", header: activeTab === "attendance" ? "Clock In" : "Details" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Reports</h1>
          <p className="text-sm text-[#6B7280]">
            Generate and download various human capital reports
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="text-[#10B981] border border-[#10B981] hover:bg-[#ECFDF5] bg-transparent" leftIcon={<FileSpreadsheet className="h-4 w-4" />}>
            Export Excel
          </Button>
          <Button variant="secondary" className="text-[#EF4444] border border-[#EF4444] hover:bg-[#FEF2F2] bg-transparent" leftIcon={<FileText className="h-4 w-4" />}>
            Export PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b border-[#E5E7EB]">
              <CardTitle className="text-base flex items-center gap-2">
                <Filter className="h-4 w-4 text-[#1A2B6B]" />
                Report Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#374151]">Report Type</label>
                <div className="flex flex-col gap-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "text-left px-3 py-2 text-sm rounded-md transition-colors",
                        activeTab === tab.id
                          ? "bg-[#EEF0F8] text-[#1A2B6B] font-medium"
                          : "text-[#6B7280] hover:bg-gray-50"
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5E7EB] space-y-4">
                <Input label="Start Date" type="date" defaultValue="2026-05-01" />
                <Input label="End Date" type="date" defaultValue="2026-05-31" />
                
                <Select
                  label="Department"
                  options={[
                    { value: "all", label: "All Departments" },
                    { value: "hc", label: "Human Capital" },
                    { value: "sales", label: "Sales" },
                    { value: "it", label: "Information Technology" },
                  ]}
                />
                
                <Select
                  label="Division"
                  options={[
                    { value: "all", label: "All Divisions" },
                    { value: "hq", label: "Headquarters" },
                    { value: "branch", label: "Branch Offices" },
                  ]}
                />
              </div>

              <Button variant="primary" className="w-full mt-4" onClick={handleGenerate}>
                Generate Preview
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Preview Area */}
        <div className="lg:col-span-3">
          <Card className="h-full flex flex-col min-h-[500px]">
            <CardHeader className="pb-0">
              <div className="flex justify-between items-center">
                <CardTitle>
                  Data Preview: {tabs.find(t => t.id === activeTab)?.label}
                </CardTitle>
                <span className="text-xs text-[#6B7280] bg-[#F4F6FB] px-2 py-1 rounded">
                  Showing top 50 records
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 mt-4 border-t border-[#E5E7EB]">
              {isGenerating ? (
                <div className="flex items-center justify-center h-full min-h-[400px]">
                  <div className="flex flex-col items-center gap-3 text-[#6B7280]">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#EEF0F8] border-t-[#1A2B6B]" />
                    <p>Generating report preview...</p>
                  </div>
                </div>
              ) : (
                <DataTable
                  data={mockReportData}
                  columns={columns}
                  keyExtractor={(row) => row.id}
                  striped
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
