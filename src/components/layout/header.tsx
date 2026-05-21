"use client";

import * as React from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Bell, ChevronDown, Calendar, User, Settings, LogOut, Search, Loader2 } from "lucide-react";
import { cn, formatIndonesianDate } from "@/lib/utils";
import { useSidebar } from "./sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export function Header({ title, subtitle, actions }: { title?: string; subtitle?: string; actions?: React.ReactNode }) {
  const { data: session, status } = useSession();
  const { collapsed } = useSidebar();
  const [mounted, setMounted] = React.useState(false);
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const staticDate = "Kamis, 21-05-2026";

  // Get user initials from session
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Role labels
  const roleLabels: Record<string, string> = {
    SUPER_ADMIN: "Super Admin",
    ADMIN: "HR Admin",
    MANAGER: "Manager",
    EMPLOYEE: "Employee",
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" });
  };

  // Get user info from session or fallback
  const userName = session?.user?.name || "User";
  const userEmail = session?.user?.email || "";
  const userRole = session?.user?.role ? roleLabels[session.user.role] : "Employee";
  const userInitials = getInitials(userName);

  return (
    <header
      className={cn(
        "fixed right-0 top-0 z-20 flex h-[60px] items-center justify-between border-b border-[#E5E7EB] bg-white px-6 shadow-sm transition-all duration-300",
        collapsed ? "lg:left-[72px]" : "lg:left-[260px]"
      )}
    >
      {/* Left side - Title */}
      <div className="flex items-center gap-4">
        <div>
          {title && <h1 className="text-base font-semibold text-[#1A1A2E]">{title}</h1>}
          {subtitle && <p className="text-xs text-[#6B7280]">{subtitle}</p>}
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden xl:block">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF] group-focus-within:text-[#1A2B6B]" />
            <input
              type="text"
              placeholder="Quick search..."
              className="h-9 w-64 rounded-lg border border-[#E5E7EB] bg-[#FAFAFA] pl-10 pr-4 text-sm text-[#1A1A2E] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#1A2B6B]/20 focus:border-[#1A2B6B] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Current Date */}
        <div className="hidden items-center gap-2 rounded-lg border border-[#E5E7EB] bg-[#FAFAFA] px-3.5 py-2 xl:flex">
          <Calendar className="h-4 w-4 text-[#9CA3AF]" />
          <span className="text-xs font-medium text-[#6B7280]">
            {mounted ? formatIndonesianDate(new Date()) : staticDate}
          </span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white hover:bg-[#FAFAFA] transition-colors"
          >
            <Bell className="h-5 w-5 text-[#6B7280]" />
            <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#EF4444] text-[10px] font-bold text-white px-1 shadow-sm">
              3
            </span>
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-[#E5E7EB] bg-white shadow-xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-[#F3F4F6]">
                  <h3 className="text-sm font-semibold text-[#1A1A2E]">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  <NotificationItem title="New Leave Request" message="Budi Santoso submitted a leave request" time="5 min ago" unread />
                  <NotificationItem title="Overtime Approved" message="Your overtime request for yesterday was approved" time="1 hour ago" unread />
                  <NotificationItem title="Performance Review" message="Performance appraisal deadline is approaching" time="2 hours ago" />
                </div>
                <div className="px-4 py-2.5 border-t border-[#F3F4F6] bg-[#FAFAFA]">
                  <button className="w-full text-center text-xs font-medium text-[#1A2B6B] hover:underline">View all notifications</button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-2 py-1.5 hover:bg-[#FAFAFA] transition-colors"
          >
            {status === "loading" ? (
              <Skeleton className="h-8 w-8 rounded-full" />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#1A2B6B] to-[#2A3D8B] text-white text-xs font-semibold shadow-sm">
                {userInitials}
              </div>
            )}
            <div className="hidden flex-col items-start lg:flex">
              {status === "loading" ? (
                <>
                  <Skeleton className="h-3 w-16 mb-0.5" />
                  <Skeleton className="h-2 w-12" />
                </>
              ) : (
                <>
                  <span className="text-xs font-semibold text-[#1A1A2E] leading-none mb-0.5">{userName}</span>
                  <span className="text-[10px] text-[#6B7280] leading-none">{userRole}</span>
                </>
              )}
            </div>
            <ChevronDown className="hidden h-4 w-4 text-[#9CA3AF] lg:block" />
          </button>

          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
              <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-[#E5E7EB] bg-white shadow-xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-[#F3F4F6]">
                  <p className="text-sm font-semibold text-[#1A1A2E]">{userName}</p>
                  <p className="text-xs text-[#6B7280]">{userEmail}</p>
                </div>
                <div className="py-1">
                  <Link
                    href="/(dashboard)/profile"
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-[#374151] hover:bg-[#FAFAFA] transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User className="h-4 w-4 text-[#6B7280]" />
                    My Profile
                  </Link>
                  <button className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-[#374151] hover:bg-[#FAFAFA] transition-colors">
                    <Settings className="h-4 w-4 text-[#6B7280]" />
                    Settings
                  </button>
                </div>
                <div className="border-t border-[#F3F4F6] py-1">
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-[#EF4444] hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Custom Actions */}
      {actions && (
        <div className="hidden lg:flex items-center gap-3 ml-4">
          {actions}
        </div>
      )}
    </header>
  );
}

function NotificationItem({
  title,
  message,
  time,
  unread = false,
}: {
  title: string;
  message: string;
  time: string;
  unread?: boolean;
}) {
  return (
    <button className="flex w-full items-start gap-3 px-4 py-3 hover:bg-[#FAFAFA] transition-colors text-left">
      <div className={cn("mt-1 h-2 w-2 rounded-full flex-shrink-0", unread ? "bg-[#1A2B6B]" : "bg-transparent")} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#1A1A2E] truncate">{title}</p>
        <p className="text-xs text-[#6B7280] line-clamp-2 mt-0.5">{message}</p>
        <p className="text-[10px] text-[#9CA3AF] mt-1">{time}</p>
      </div>
    </button>
  );
}

export default Header;