"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  UserCheck,
  UserX,
  Calendar,
  TrendingUp,
  Download,
  RefreshCw,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Gift,
  PartyPopper,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// ============ DATA ============
const stats = {
  total: 1132,
  active: 666,
  inactive: 466,
  present: 623,
  updated: "20 May 2026",
};

const ageGenderData = [
  { age: "< 25", male: 45, female: 38 },
  { age: "25-30", male: 156, female: 124 },
  { age: "31-35", male: 189, female: 142 },
  { age: "36-40", male: 167, female: 98 },
  { age: "41-45", male: 134, female: 67 },
  { age: "46-50", male: 89, female: 45 },
  { age: "> 50", male: 67, female: 28 },
];

const officeData = [
  { name: "Head Office", value: 468 },
  { name: "Branch Office", value: 664 },
];

const departmentData = [
  { name: "Finance", value: 245 },
  { name: "Operations", value: 312 },
  { name: "Marketing", value: 189 },
  { name: "HR", value: 156 },
  { name: "IT", value: 98 },
  { name: "Legal", value: 132 },
];

const attendanceData = [
  { day: "Mon", present: 580, absent: 52 },
  { day: "Tue", present: 595, absent: 37 },
  { day: "Wed", present: 612, absent: 20 },
  { day: "Thu", present: 598, absent: 34 },
  { day: "Fri", present: 623, absent: 9 },
];

const tasks = [
  { id: 1, title: "Review leave request from Budi Santoso", type: "Leave", priority: "high" },
  { id: 2, title: "Approve overtime for Dian Pratama", type: "Overtime", priority: "medium" },
  { id: 3, title: "Complete performance appraisal for Team A", type: "Appraisal", priority: "high" },
];

const activities = [
  { id: 1, action: "Leave approved", employee: "Sarah Wijaya", time: "10 min ago", type: "success" },
  { id: 2, action: "New employee onboarded", employee: "Ahmad Fauzi", time: "1 hour ago", type: "info" },
  { id: 3, action: "Resign request submitted", employee: "Diana Putri", time: "2 hours ago", type: "warning" },
  { id: 4, action: "Overtime rejected", employee: "Budi Santoso", time: "3 hours ago", type: "danger" },
];

// ============ COLORS ============
const CHART_COLORS = {
  blue: "#3B82F6",
  violet: "#8B5CF6",
  green: "#10B981",
  amber: "#F59E0B",
  red: "#EF4444",
  pink: "#EC4899",
};

// ============ CUSTOM TOOLTIP ============
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-white px-3 py-2 text-sm shadow-lg ring-1 ring-black/5">
        <p className="font-medium text-gray-900 mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

// ============ UI COMPONENTS ============
function StatCard({ title, value, subtitle, icon: Icon, trend, colorClass }: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  trend?: number;
  colorClass: string;
}) {
  return (
    <Card className="relative overflow-hidden group hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{subtitle}</p>
          </div>
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${colorClass}`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
        {trend !== undefined && (
          <div className="flex items-center gap-1 mt-3">
            <TrendingUp className={`w-3.5 h-3.5 ${trend >= 0 ? "text-green-500" : "text-red-500 rotate-180"}`} />
            <span className={`text-xs font-medium ${trend >= 0 ? "text-green-500" : "text-red-500"}`}>
              {Math.abs(trend)}%
            </span>
            <span className="text-xs text-gray-400">vs last month</span>
          </div>
        )}
      </div>
      <div className={`absolute -right-4 -top-4 h-20 w-20 rounded-full opacity-10 ${colorClass.replace("bg-", "bg-")}`} />
    </Card>
  );
}

function TaskItem({ task }: { task: typeof tasks[0] }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 cursor-pointer transition-all group">
      <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-amber-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate group-hover:text-blue-900">{task.title}</p>
        <p className="text-[11px] text-gray-400">{task.type}</p>
      </div>
      <Badge variant={task.priority === "high" ? "warning" : "soft"} size="sm">
        {task.priority}
      </Badge>
      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all" />
    </div>
  );
}

function ActivityItem({ activity }: { activity: typeof activities[0] }) {
  const typeStyles: Record<string, string> = {
    success: "bg-green-50 text-green-600",
    danger: "bg-red-50 text-red-600",
    warning: "bg-amber-50 text-amber-600",
    info: "bg-blue-50 text-blue-600",
  };

  const icons: Record<string, React.ElementType> = {
    success: CheckCircle,
    danger: XCircle,
    warning: AlertCircle,
    info: Users,
  };

  const Icon = icons[activity.type] || CheckCircle;

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group">
      <div className={`w-9 h-9 rounded-full flex items-center justify-center ${typeStyles[activity.type]}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800">{activity.action}</p>
        <p className="text-[11px] text-gray-400">by {activity.employee}</p>
      </div>
      <span className="text-[11px] text-gray-400 group-hover:text-gray-600">{activity.time}</span>
    </div>
  );
}

function QuickCard({ icon: Icon, label, count, bgColor }: {
  icon: React.ElementType;
  label: string;
  count: number;
  bgColor: string;
}) {
  return (
    <button className={`flex items-center gap-3 p-3 rounded-xl ${bgColor} text-white hover:opacity-90 transition-opacity text-left w-full`}>
      <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-[10px] text-white/70">{label}</p>
        <p className="text-lg font-bold">{count}</p>
      </div>
    </button>
  );
}

// ============ MAIN PAGE ============
export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Welcome back, Yoga! Here&apos;s your team overview.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-3.5 h-3.5" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Employees" value="1,132" subtitle={`as of ${stats.updated}`} icon={Users} colorClass="bg-blue-600" />
        <StatCard title="Active" value="666" subtitle="58.8% of total" icon={UserCheck} trend={2.5} colorClass="bg-green-600" />
        <StatCard title="Inactive" value="466" subtitle="On leave/terminated" icon={UserX} colorClass="bg-red-500" />
        <StatCard title="Attendance" value="623" subtitle="88% present rate" icon={Calendar} trend={1.2} colorClass="bg-amber-500" />
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-5">
          {/* Tasks */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  Things To Do
                </CardTitle>
                <Badge variant="soft" size="sm">{tasks.length} pending</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {tasks.map(task => <TaskItem key={task.id} task={task} />)}
              <Button variant="ghost" size="sm" className="w-full mt-2" rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
                View all tasks
              </Button>
            </CardContent>
          </Card>

          {/* Quick Alerts */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Quick Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2.5">
                <QuickCard icon={FileText} label="Contracts" count={13} bgColor="bg-blue-600" />
                <QuickCard icon={Gift} label="Birthdays" count={3} bgColor="bg-pink-500" />
                <QuickCard icon={PartyPopper} label="Anniversaries" count={5} bgColor="bg-purple-600" />
                <QuickCard icon={Calendar} label="Holidays" count={4} bgColor="bg-teal-600" />
              </div>
            </CardContent>
          </Card>

          {/* My Profile */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">My Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center text-white font-bold text-sm">
                    YA
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Yoga Utama</p>
                  <p className="text-xs text-gray-500">HR Admin</p>
                  <Badge variant="success" size="sm" className="mt-1">Active</Badge>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-3 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Department</span>
                  <span className="font-medium text-gray-700">Human Capital</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Join Date</span>
                  <span className="font-medium text-gray-700">15 Mar 2021</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Remaining Leave</span>
                  <span className="font-medium text-green-600">8 days</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Pending Task</span>
                  <span className="font-medium text-amber-600">3</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Charts Row */}
          <div className="grid md:grid-cols-2 gap-5">
            {/* Area Chart - Age & Gender */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">Employees by Age & Gender</CardTitle>
                  <Badge variant="soft" size="sm">7 groups</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={ageGenderData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorMale" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={CHART_COLORS.blue} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={CHART_COLORS.blue} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorFemale" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={CHART_COLORS.pink} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={CHART_COLORS.pink} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                    <XAxis dataKey="age" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Area
                      type="monotone"
                      dataKey="male"
                      name="Male"
                      stroke={CHART_COLORS.blue}
                      fillOpacity={1}
                      fill="url(#colorMale)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="female"
                      name="Female"
                      stroke={CHART_COLORS.pink}
                      fillOpacity={1}
                      fill="url(#colorFemale)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Pie Chart - Office Distribution */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">Office Distribution</CardTitle>
                  <Badge variant="soft" size="sm">2 locations</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <ResponsiveContainer width="50%" height={180}>
                    <PieChart>
                      <Pie
                        data={officeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        <Cell fill={CHART_COLORS.blue} />
                        <Cell fill={CHART_COLORS.violet} />
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex-1 space-y-3">
                    {officeData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: index === 0 ? CHART_COLORS.blue : CHART_COLORS.violet }}
                          />
                          <span className="text-sm text-gray-600">{item.name}</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bar Chart - Department */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">Employees by Department</CardTitle>
                <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
                  Details
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={departmentData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    width={60}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="value"
                    name="Employees"
                    fill={CHART_COLORS.blue}
                    radius={[0, 4, 4, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gender Ratio & Weekly Attendance */}
          <div className="grid md:grid-cols-2 gap-5">
            {/* Gender Ratio */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">Gender Ratio</CardTitle>
                  <Badge variant="soft" size="sm">1,132 employees</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center gap-10 py-4">
                  <div className="text-center group">
                    <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-xl font-bold text-blue-600 group-hover:scale-105 transition-transform">
                      79.2%
                    </div>
                    <p className="text-sm font-medium text-gray-700 mt-2">Male</p>
                    <p className="text-xs text-gray-400">847 employees</p>
                  </div>
                  <div className="text-center group">
                    <div className="w-16 h-16 rounded-full bg-pink-50 flex items-center justify-center text-xl font-bold text-pink-500 group-hover:scale-105 transition-transform">
                      20.8%
                    </div>
                    <p className="text-sm font-medium text-gray-700 mt-2">Female</p>
                    <p className="text-xs text-gray-400">285 employees</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Attendance */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">Weekly Attendance</CardTitle>
                  <Badge variant="success" size="sm">+2.5%</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={attendanceData} barCategoryGap="30%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="present"
                      name="Present"
                      fill={CHART_COLORS.green}
                      radius={[4, 4, 0, 0]}
                      maxBarSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
                <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
                  View all
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-2">
                {activities.map(activity => <ActivityItem key={activity.id} activity={activity} />)}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}