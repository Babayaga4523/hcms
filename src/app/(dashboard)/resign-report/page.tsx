"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Metric, Text, Flex, BarChart } from "@tremor/react";
import { DataTable, Column } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { Download, LogOut, TrendingUp, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const resignReasonsData = [
  { reason: "Career Change", count: 12 },
  { reason: "Personal", count: 8 },
  { reason: "Health Issues", count: 3 },
  { reason: "Relocation", count: 5 },
  { reason: "Compensation", count: 9 },
];

const mockResignData = [
  { id: "1", nik: "BNI001", name: "Joko Susilo", dept: "Executive", date: "2026-05-15", reason: "Career Change", status: "Approved" },
  { id: "2", nik: "BNI012", name: "Rina Marlina", dept: "Finance", date: "2026-05-10", reason: "Personal", status: "Approved" },
  { id: "3", nik: "BNI045", name: "Ahmad Subarjo", dept: "Sales", date: "2026-04-28", reason: "Compensation", status: "Approved" },
  { id: "4", nik: "BNI078", name: "Siti Aminah", dept: "Operations", date: "2026-04-15", reason: "Relocation", status: "Approved" },
];

export default function ResignReportPage() {
  const columns: Column<typeof mockResignData[0]>[] = [
    { key: "nik", header: "NIK" },
    { key: "name", header: "Employee Name", render: (row) => <span className="font-medium">{row.name}</span> },
    { key: "dept", header: "Department" },
    { key: "date", header: "Resign Date" },
    { key: "reason", header: "Primary Reason" },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <Badge variant="secondary" className="bg-[#DCFCE7] text-[#166534]">
          {row.status}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Resignation Report</h1>
          <p className="text-sm text-[#6B7280]">
            Analyze turnover metrics and resignation reasons
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            label=""
            value="2026"
            options={[
              { value: "2026", label: "Year: 2026" },
              { value: "2025", label: "Year: 2025" },
            ]}
          />
          <Button variant="secondary" className="text-[#1A2B6B] border border-[#1A2B6B] bg-white hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-card bg-[#EEF0F8]">
          <CardContent className="p-5 flex items-start gap-4">
            <div className="p-3 bg-white rounded-xl text-[#1A2B6B]">
              <LogOut className="h-6 w-6" />
            </div>
            <div>
              <Text className="font-medium text-[#6B7280]">Total Resignations</Text>
              <Metric className="mt-1 text-[#1A1A2E]">37</Metric>
              <Text className="mt-1 text-xs text-[#6B7280]">Year to date</Text>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-card bg-[#FEF2F2]">
          <CardContent className="p-5 flex items-start gap-4">
            <div className="p-3 bg-white rounded-xl text-[#EF4444]">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <Text className="font-medium text-[#6B7280]">Turnover Rate</Text>
              <Metric className="mt-1 text-[#1A1A2E]">3.2%</Metric>
              <Text className="mt-1 text-xs text-[#EF4444] font-medium">+0.5% from last year</Text>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-card bg-[#FEF9C3]">
          <CardContent className="p-5 flex items-start gap-4">
            <div className="p-3 bg-white rounded-xl text-[#F59E0B]">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <Text className="font-medium text-[#6B7280]">Critical Role Loss</Text>
              <Metric className="mt-1 text-[#1A1A2E]">4</Metric>
              <Text className="mt-1 text-xs text-[#6B7280]">Key personnel</Text>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 shadow-card border-[#E5E7EB]">
          <CardHeader>
            <CardTitle className="text-base text-[#1A1A2E]">Resignation Reasons</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              className="h-[300px]"
              data={resignReasonsData}
              index="reason"
              categories={["count"]}
              colors={["blue"]}
              layout="vertical"
              showLegend={false}
              yAxisWidth={110}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-card border-[#E5E7EB] flex flex-col p-0">
          <CardHeader className="border-b border-[#E5E7EB] p-4">
            <CardTitle className="text-base text-[#1A1A2E]">Recent Resignations</CardTitle>
          </CardHeader>
          <div className="flex-1">
            <DataTable
              data={mockResignData}
              columns={columns}
              keyExtractor={(row) => row.id}
              striped
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
