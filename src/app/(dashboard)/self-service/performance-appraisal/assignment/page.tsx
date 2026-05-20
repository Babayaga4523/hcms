"use client";

import * as React from "react";
import { Card, Metric, Text, Flex, ProgressBar } from "@tremor/react";
import { Select } from "@/components/ui/input";
import { DataTable, Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import { Award, Target, Users } from "lucide-react";

const radarData = [
  { subject: "Communication", A: 85, fullMark: 100 },
  { subject: "Leadership", A: 78, fullMark: 100 },
  { subject: "Problem Solving", A: 90, fullMark: 100 },
  { subject: "Teamwork", A: 95, fullMark: 100 },
  { subject: "Initiative", A: 82, fullMark: 100 },
  { subject: "Adaptability", A: 88, fullMark: 100 },
];

const historyData = [
  {
    id: "1",
    period: "H2 2025",
    evaluator: "Ahmad Subarjo",
    kpiScore: 88,
    coreScore: 92,
    leadScore: 85,
    finalScore: 88.5,
    status: "Completed",
  },
  {
    id: "2",
    period: "H1 2025",
    evaluator: "Ahmad Subarjo",
    kpiScore: 85,
    coreScore: 90,
    leadScore: 82,
    finalScore: 86.0,
    status: "Completed",
  },
  {
    id: "3",
    period: "H2 2024",
    evaluator: "Siti Aminah",
    kpiScore: 80,
    coreScore: 88,
    leadScore: 75,
    finalScore: 81.5,
    status: "Completed",
  },
];

export default function PerformancePage() {
  const [period, setPeriod] = React.useState("h1-2026");

  const columns: Column<typeof historyData[0]>[] = [
    { key: "period", header: "Period" },
    { key: "evaluator", header: "Evaluator" },
    { key: "kpiScore", header: "KPI Score" },
    { key: "coreScore", header: "Core Values" },
    { key: "leadScore", header: "Leadership" },
    { 
      key: "finalScore", 
      header: "Final Score",
      render: (row) => <span className="font-bold text-[#1A2B6B]">{row.finalScore}</span>
    },
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
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Performance Appraisal</h1>
          <p className="text-sm text-[#6B7280]">
            Review your performance evaluations and competency scores
          </p>
        </div>
        <div className="w-48">
          <Select
            label=""
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            options={[
              { value: "h1-2026", label: "H1 2026 (Current)" },
              { value: "h2-2025", label: "H2 2025" },
              { value: "h1-2025", label: "H1 2025" },
            ]}
          />
        </div>
      </div>

      {/* Score Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="ring-0 border border-[#E5E7EB] shadow-card">
          <Flex alignItems="start">
            <div>
              <Text className="font-medium text-[#6B7280]">KPI Achievement</Text>
              <Metric className="mt-2">92.5%</Metric>
            </div>
            <div className="p-2 bg-[#EEF0F8] rounded-lg text-[#1A2B6B]">
              <Target className="h-6 w-6" />
            </div>
          </Flex>
          <ProgressBar value={92.5} color="blue" className="mt-4" />
          <Text className="mt-2 text-xs text-[#6B7280]">Target: 90%</Text>
        </Card>

        <Card className="ring-0 border border-[#E5E7EB] shadow-card">
          <Flex alignItems="start">
            <div>
              <Text className="font-medium text-[#6B7280]">Core Values (AKHLAK)</Text>
              <Metric className="mt-2">88.0%</Metric>
            </div>
            <div className="p-2 bg-[#ECFDF5] rounded-lg text-[#10B981]">
              <Award className="h-6 w-6" />
            </div>
          </Flex>
          <ProgressBar value={88} color="emerald" className="mt-4" />
          <Text className="mt-2 text-xs text-[#6B7280]">Target: 85%</Text>
        </Card>

        <Card className="ring-0 border border-[#E5E7EB] shadow-card">
          <Flex alignItems="start">
            <div>
              <Text className="font-medium text-[#6B7280]">Leadership</Text>
              <Metric className="mt-2">85.0%</Metric>
            </div>
            <div className="p-2 bg-[#FEF9C3] rounded-lg text-[#F59E0B]">
              <Users className="h-6 w-6" />
            </div>
          </Flex>
          <ProgressBar value={85} color="amber" className="mt-4" />
          <Text className="mt-2 text-xs text-[#6B7280]">Target: 80%</Text>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radar Chart */}
        <Card className="lg:col-span-1 ring-0 border border-[#E5E7EB] shadow-card">
          <Text className="font-semibold text-[#1A1A2E] text-base mb-4">Competency Radar</Text>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#E5E7EB" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#6B7280', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Score"
                  dataKey="A"
                  stroke="#1A2B6B"
                  fill="#4B5DAA"
                  fillOpacity={0.5}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "white", borderRadius: "8px", border: "1px solid #E5E7EB" }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Assessment History Table */}
        <Card className="lg:col-span-2 ring-0 border border-[#E5E7EB] shadow-card p-0 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[#E5E7EB]">
            <Text className="font-semibold text-[#1A1A2E] text-base">Assessment History</Text>
          </div>
          <div className="flex-1 p-0">
            <DataTable
              data={historyData}
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
