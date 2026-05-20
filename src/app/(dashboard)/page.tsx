"use client";

import * as React from "react";
import { Badge as ShadcnBadge } from "@/components/ui/badge";
import { Card as ShadcnCard, CardHeader as ShadcnCardHeader, CardTitle as ShadcnCardTitle, CardContent as ShadcnCardContent } from "@/components/ui/card";
import {
  Card,
  Metric,
  Text,
  Flex,
  AreaChart,
  BarChart,
  DonutChart,
  Badge,
} from "@tremor/react";

// Mock data for dashboard
const employeeStats = {
  total: 1132,
  active: 666,
  inactive: 466,
  lastUpdated: "20/05/2026, 14:30",
};

const genderAgeData = [
  { ageGroup: "< 25", Male: 45, Female: 38 },
  { ageGroup: "25-30", Male: 156, Female: 124 },
  { ageGroup: "31-35", Male: 189, Female: 142 },
  { ageGroup: "36-40", Male: 167, Female: 98 },
  { ageGroup: "41-45", Male: 134, Female: 67 },
  { ageGroup: "46-50", Male: 89, Female: 45 },
  { ageGroup: "> 50", Male: 67, Female: 28 },
];

const locationData = [
  { location: "Head Office", Male: 312, Female: 156 },
  { location: "Branch Office", Male: 535, Female: 386 },
];

const genderPercentage = [
  { name: "Male", value: 79.2 },
  { name: "Female", value: 20.8 },
];

const highlightButtons = [
  { title: "Employees Contracts Expiring Soon", count: 13 },
  { title: "Employee Birthday", count: 3 },
  { title: "Information Anniversary at Work", count: 13 },
  { title: "Public Holiday", count: 4 },
];

const thingsToDoTasks = [
  { id: 1, title: "Review leave request from Budi Santoso", status: "pending" },
  { id: 2, title: "Approve overtime for Dian Pratama", status: "pending" },
  { id: 3, title: "Complete performance appraisal for Team A", status: "pending" },
];

// Summary Card Component (using Tremor Card and Metric)
function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  bgColor,
  iconColor,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
}) {
  return (
    <Card className="p-4 border-0 ring-0 shadow-card" style={{ backgroundColor: bgColor }}>
      <Flex alignItems="start">
        <div>
          <Text className="font-semibold text-xs text-[#6B7280]">{title}</Text>
          <Metric className="mt-0.5 text-[#1A1A2E] text-xl sm:text-2xl font-bold leading-none">{value}</Metric>
          <Text className="mt-1 text-[10px] text-[#6B7280]">{subtitle}</Text>
        </div>
        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg"
          style={{ backgroundColor: "white", color: iconColor }}
        >
          {icon}
        </div>
      </Flex>
    </Card>
  );
}

// Things To Do Widget
function ThingsToDo() {
  return (
    <ShadcnCard className="h-full">
      <ShadcnCardHeader className="pb-2">
        <ShadcnCardTitle>Things To Do</ShadcnCardTitle>
      </ShadcnCardHeader>
      <ShadcnCardContent>
        {thingsToDoTasks.length === 0 ? (
          <p className="text-center italic text-[#6B7280] py-8">Empty Task</p>
        ) : (
          <div className="space-y-1.5">
            {thingsToDoTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-2.5 rounded-[6px] border border-[#E5E7EB] p-2.5 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-[#E8A020]" />
                <span className="flex-1 text-xs">{task.title}</span>
                <ShadcnBadge variant="secondary" className="bg-[#FEF9C3] text-[#854D0E] hover:bg-[#FEF9C3] text-[10px] px-1.5 py-0.5">
                  Pending
                </ShadcnBadge>
              </div>
            ))}
          </div>
        )}
      </ShadcnCardContent>
    </ShadcnCard>
  );
}

// Highlight Information Widget
function HighlightInfo() {
  return (
    <ShadcnCard className="h-full">
      <ShadcnCardHeader className="pb-2">
        <ShadcnCardTitle>Highlight Information</ShadcnCardTitle>
      </ShadcnCardHeader>
      <ShadcnCardContent>
        <div className="space-y-1.5">
          {highlightButtons.map((item, index) => (
            <button
              key={index}
              className="flex w-full items-center justify-between rounded-[6px] bg-[#4B5DAA] px-3 py-2 text-white transition-colors hover:bg-[#3B4D8A]"
            >
              <span className="text-xs font-medium">{item.title}</span>
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-[#1A2B6B] px-1">
                {item.count}
              </span>
            </button>
          ))}
        </div>
      </ShadcnCardContent>
    </ShadcnCard>
  );
}

// My Information Widget
function MyInformation() {
  const employeeData = {
    name: "Yoga Utama",
    position: "HR Admin",
    department: "Human Capital",
    joinDate: "15 Maret 2021",
    remainingLeave: 8,
    pendingTask: 3,
  };

  return (
    <ShadcnCard className="h-full">
      <ShadcnCardHeader className="pb-2">
        <ShadcnCardTitle>My Information</ShadcnCardTitle>
      </ShadcnCardHeader>
      <ShadcnCardContent>
        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1A2B6B] text-sm font-bold text-white">
              YA
            </div>
            <div>
              <p className="text-xs font-semibold text-[#1A1A2E]">{employeeData.name}</p>
              <p className="text-[11px] text-[#6B7280]">{employeeData.position}</p>
            </div>
          </div>
          <div className="border-t border-[#E5E7EB] pt-2.5 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-[#6B7280]">Department</span>
              <span className="font-medium">{employeeData.department}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#6B7280]">Join Date</span>
              <span className="font-medium">{employeeData.joinDate}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#6B7280]">Remaining Leave</span>
              <span className="font-medium text-[#10B981]">{employeeData.remainingLeave} days</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#6B7280]">Pending Task</span>
              <span className="font-medium text-[#E8A020]">{employeeData.pendingTask}</span>
            </div>
          </div>
        </div>
      </ShadcnCardContent>
    </ShadcnCard>
  );
}

// Main Dashboard Page
export default function DashboardPage() {
  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div>
        <h1 className="text-lg font-bold text-[#1A1A2E]">Dashboard</h1>
        <p className="text-xs text-[#6B7280]">
          Welcome back, Yoga! Here&apos;s what&apos;s happening with your team.
        </p>
      </div>

      {/* Top Row - 3 Widgets */}
      <div className="grid gap-4 md:grid-cols-3">
        <ThingsToDo />
        <HighlightInfo />
        <MyInformation />
      </div>

      {/* Summary Cards Row */}
      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          title="All Employee"
          value={employeeStats.total}
          subtitle={`as of ${employeeStats.lastUpdated}`}
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          }
          bgColor="#EEF0F8"
          iconColor="#1A2B6B"
        />
        <SummaryCard
          title="Employee Active"
          value={employeeStats.active}
          subtitle={`as of ${employeeStats.lastUpdated}`}
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          }
          bgColor="#ECFDF5"
          iconColor="#10B981"
        />
        <SummaryCard
          title="Employee Inactive"
          value={employeeStats.inactive}
          subtitle={`as of ${employeeStats.lastUpdated}`}
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          }
          bgColor="#FEF2F2"
          iconColor="#EF4444"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Area Chart */}
        <Card className="shadow-card ring-0 border border-[#E5E7EB]">
          <Text className="text-sm font-semibold text-[#1A1A2E] mb-3">Employees by Gender and Age</Text>
          <AreaChart
            className="h-64"
            data={genderAgeData}
            index="ageGroup"
            categories={["Male", "Female"]}
            colors={["blue", "pink"]}
            showLegend={true}
            showGridLines={true}
            yAxisWidth={40}
            curveType="monotone"
          />
        </Card>

        {/* Bar Chart */}
        <Card className="shadow-card ring-0 border border-[#E5E7EB]">
          <Text className="text-sm font-semibold text-[#1A1A2E] mb-3">Location</Text>
          <BarChart
            className="h-64"
            data={locationData}
            index="location"
            categories={["Male", "Female"]}
            colors={["blue", "pink"]}
            layout="vertical"
            showLegend={true}
            showGridLines={true}
            yAxisWidth={100}
          />
        </Card>

        {/* Donut Chart */}
        <Card className="shadow-card ring-0 border border-[#E5E7EB]">
          <Text className="text-sm font-semibold text-[#1A1A2E] mb-3">Percentage</Text>
          <DonutChart
            className="h-44 mt-4"
            data={genderPercentage}
            category="value"
            index="name"
            colors={["blue", "pink"]}
            showLabel={false}
            valueFormatter={(number) => `${number}%`}
          />
          <Flex className="mt-4 justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <Text className="text-xs">Male <span className="font-bold text-[#1A1A2E]">79.2%</span> (847)</Text>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-pink-500" />
              <Text className="text-xs">Female <span className="font-bold text-[#1A1A2E]">20.8%</span> (285)</Text>
            </div>
          </Flex>
          <Text className="text-center mt-4 text-[10px] text-[#6B7280]">
            Total Employee: {employeeStats.total}
          </Text>
        </Card>
      </div>
    </div>
  );
}