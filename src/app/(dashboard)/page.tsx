"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton, StatCardSkeleton, ChartSkeleton } from "@/components/ui/skeleton";
import {
  Users,
  UserCheck,
  UserX,
  Calendar,
  TrendingUp,
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ============ Types ============
interface DashboardStats {
  employees: {
    total: number;
    active: number;
    inactive: number;
  };
  attendance: {
    present: number;
    percentage: number;
    weekly: Array<{ day: string; present: number; absent: number }>;
  };
  demographics: {
    male: { count: number; percentage: number };
    female: { count: number; percentage: number };
  };
  departments: Array<{ name: string; value: number }>;
  quickAlerts: {
    pendingLeaveRequests: number;
    upcomingBirthdays: number;
    upcomingHolidays: number;
    upcomingContracts: number;
  };
  updatedAt: string;
}

interface Task {
  id: string;
  title: string;
  type: string;
  priority: "high" | "medium" | "low";
}

interface Activity {
  id: string;
  action: string;
  employee: string;
  time: string;
  type: "success" | "danger" | "warning" | "info";
}

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

function TaskItem({ task }: { task: Task }) {
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

function ActivityItem({ activity }: { activity: Activity }) {
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

// ============ PROFILE COMPONENT WITH SESSION ============
function ProfileCard({ session }: { session: { user: { name: string; email: string; role: string; department?: string; position?: string; nik?: string } } }) {
  const user = session.user;
  const initials = user.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const roleLabels: Record<string, string> = {
    SUPER_ADMIN: "Super Admin",
    ADMIN: "HR Admin",
    MANAGER: "Manager",
    EMPLOYEE: "Employee",
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">My Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center text-white font-bold text-sm">
              {initials}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{roleLabels[user.role] || user.role}</p>
            <Badge variant="success" size="sm" className="mt-1">Active</Badge>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-3 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Department</span>
            <span className="font-medium text-gray-700">{user.department || "-"}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Position</span>
            <span className="font-medium text-gray-700">{user.position || "-"}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">NIK</span>
            <span className="font-medium text-gray-700">{user.nik || "-"}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============ FETCH DATA ============
async function fetchDashboardData(): Promise<DashboardStats | null> {
  try {
    const response = await fetch("/api/dashboard/stats", {
      credentials: "include",
    });

    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = "/login";
        return null;
      }
      throw new Error("Failed to fetch dashboard data");
    }

    const result = await response.json();
    return result.data;
  } catch {
    return null;
  }
}

async function fetchPendingTasks(): Promise<Task[]> {
  try {
    // Fetch pending leave requests for "Things To Do"
    const response = await fetch("/api/leave?status=PENDING&pageSize=3", {
      credentials: "include",
    });

    if (!response.ok) return [];

    const result = await response.json();
    return (result.data || []).map((leave: any) => ({
      id: leave.id,
      title: `Review leave request from ${leave.employee?.firstName} ${leave.employee?.lastName}`,
      type: "Leave",
      priority: "high" as const,
    }));
  } catch {
    return [];
  }
}

async function fetchRecentActivities(): Promise<Activity[]> {
  try {
    // For now, return static activities
    // In production, this would come from activity logs
    return [
      { id: "1", action: "Leave approved", employee: "Sarah Wijaya", time: "10 min ago", type: "success" as const },
      { id: "2", action: "New employee onboarded", employee: "Ahmad Fauzi", time: "1 hour ago", type: "info" as const },
      { id: "3", action: "Resign request submitted", employee: "Diana Putri", time: "2 hours ago", type: "warning" as const },
      { id: "4", action: "Overtime rejected", employee: "Budi Santoso", time: "3 hours ago", type: "danger" as const },
    ];
  } catch {
    return [];
  }
}

// ============ MAIN PAGE ============
export default function DashboardPage() {
  const { data: session, status } = useSession();

  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [activities, setActivities] = React.useState<Activity[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch dashboard data
  React.useEffect(() => {
    async function loadData() {
      if (status !== "authenticated") return;

      setLoading(true);
      setError(null);

      try {
        const [statsData, tasksData, activitiesData] = await Promise.all([
          fetchDashboardData(),
          fetchPendingTasks(),
          fetchRecentActivities(),
        ]);

        setStats(statsData);
        setTasks(tasksData);
        setActivities(activitiesData);
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [status]);

  // Show loading state
  if (status === "loading" || loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)}
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="space-y-5">
            <Skeleton className="h-48" />
            <Skeleton className="h-36" />
            <Skeleton className="h-44" />
          </div>
          <div className="lg:col-span-2 space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <ChartSkeleton height="h-[280px]" />
              <ChartSkeleton height="h-[280px]" />
            </div>
            <ChartSkeleton />
            <div className="grid md:grid-cols-2 gap-5">
              <ChartSkeleton height="h-[200px]" />
              <ChartSkeleton height="h-[200px]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (!session || error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900">Error Loading Dashboard</h2>
          <p className="text-sm text-gray-500">{error || "Please sign in to access the dashboard."}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const user = session.user;
  const firstName = user.name?.split(" ")[0] || "User";

  // Prepare chart data
  const weeklyAttendance = stats?.attendance.weekly || [];
  const departmentData = stats?.departments || [];
  const demographics = stats?.demographics;

  // Gender ratio data
  const genderRatioData = demographics ? [
    { name: "Male", value: demographics.male.count, percentage: demographics.male.percentage },
    { name: "Female", value: demographics.female.count, percentage: demographics.female.percentage },
  ] : [];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Dashboard</h1>
          <p className="text-xs text-gray-500">Welcome back, {firstName}!</p>
        </div>
        <Button variant="secondary" size="sm" leftIcon={<RefreshCw className="w-3.5 h-3.5" />} onClick={() => window.location.reload()}>
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          title="Total Employees"
          value={stats?.employees.total.toLocaleString() || "0"}
          subtitle="as of today"
          icon={Users}
          colorClass="bg-blue-600"
        />
        <StatCard
          title="Active"
          value={stats?.employees.active.toLocaleString() || "0"}
          subtitle={`${stats?.employees.total ? Math.round((stats.employees.active / stats.employees.total) * 100) : 0}% of total`}
          icon={UserCheck}
          trend={2.5}
          colorClass="bg-green-600"
        />
        <StatCard
          title="Inactive"
          value={stats?.employees.inactive.toLocaleString() || "0"}
          subtitle="On leave/terminated"
          icon={UserX}
          colorClass="bg-red-500"
        />
        <StatCard
          title="Attendance Today"
          value={stats?.attendance.present.toLocaleString() || "0"}
          subtitle={`${stats?.attendance.percentage || 0}% present rate`}
          icon={Calendar}
          trend={1.2}
          colorClass="bg-amber-500"
        />
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Left Column */}
        <div className="space-y-3">
          {/* Tasks */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-semibold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Things To Do
                </CardTitle>
                <Badge variant="soft" size="sm">{tasks.length}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-1.5">
              {tasks.length > 0 ? (
                tasks.map((task) => <TaskItem key={task.id} task={task} />)
              ) : (
                <p className="text-xs text-gray-500 text-center py-3">No pending tasks</p>
              )}
            </CardContent>
          </Card>

          {/* Quick Alerts */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold">Quick Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <QuickCard icon={FileText} label="Contracts" count={stats?.quickAlerts.upcomingContracts || 0} bgColor="bg-blue-600" />
                <QuickCard icon={Gift} label="Birthdays" count={stats?.quickAlerts.upcomingBirthdays || 0} bgColor="bg-pink-500" />
                <QuickCard icon={PartyPopper} label="Anniversaries" count={0} bgColor="bg-purple-600" />
                <QuickCard icon={Calendar} label="Holidays" count={stats?.quickAlerts.upcomingHolidays || 0} bgColor="bg-teal-600" />
              </div>
            </CardContent>
          </Card>

          {/* My Profile */}
          <ProfileCard session={session} />
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-3">
          {/* Charts Row */}
          <div className="grid md:grid-cols-2 gap-3">
            {/* Weekly Attendance Chart */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">Weekly Attendance</CardTitle>
                  <Badge variant="success" size="sm">+2.5%</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {weeklyAttendance.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={weeklyAttendance} barCategoryGap="30%">
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                      <XAxis dataKey="day" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="present" name="Present" fill={CHART_COLORS.green} radius={[4, 4, 0, 0]} maxBarSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[200px] flex items-center justify-center text-gray-400 text-sm">No attendance data</div>
                )}
              </CardContent>
            </Card>

            {/* Gender Ratio */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">Gender Ratio</CardTitle>
                  <Badge variant="soft" size="sm">{stats?.employees.total.toLocaleString() || 0} employees</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {genderRatioData.length > 0 ? (
                  <div className="flex items-center justify-center gap-10 py-4">
                    <div className="text-center group">
                      <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-xl font-bold text-blue-600 group-hover:scale-105 transition-transform">
                        {demographics?.male.percentage || 0}%
                      </div>
                      <p className="text-sm font-medium text-gray-700 mt-2">Male</p>
                      <p className="text-xs text-gray-400">{demographics?.male.count} employees</p>
                    </div>
                    <div className="text-center group">
                      <div className="w-16 h-16 rounded-full bg-pink-50 flex items-center justify-center text-xl font-bold text-pink-500 group-hover:scale-105 transition-transform">
                        {demographics?.female.percentage || 0}%
                      </div>
                      <p className="text-sm font-medium text-gray-700 mt-2">Female</p>
                      <p className="text-xs text-gray-400">{demographics?.female.count} employees</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-[150px] flex items-center justify-center text-gray-400 text-sm">No data available</div>
                )}
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
              {departmentData.length > 0 ? (
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={departmentData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={60} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" name="Employees" fill={CHART_COLORS.blue} radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[180px] flex items-center justify-center text-gray-400 text-sm">No department data</div>
              )}
            </CardContent>
          </Card>

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
                {activities.map((activity) => <ActivityItem key={activity.id} activity={activity} />)}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}