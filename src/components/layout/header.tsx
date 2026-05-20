"use client";

import * as React from "react";
import { Bell, ChevronDown, Calendar, User } from "lucide-react";
import { cn, formatIndonesianDate } from "@/lib/utils";
import { useSidebar } from "./sidebar";

export function Header() {
  const { collapsed } = useSidebar();
  const [currentDate] = React.useState(new Date());

  return (
    <header
      className={cn(
        "fixed right-0 top-0 z-20 flex h-[52px] items-center justify-between border-b border-[#E5E7EB] bg-white px-6 shadow-sm transition-all duration-300",
        collapsed ? "lg:left-[64px]" : "lg:left-[240px]"
      )}
    >
      {/* Left side - Page title area (for breadcrumbs) */}
      <div className="flex items-center gap-4">
        <h1 className="text-base font-semibold text-[#1A1A2E]">
          {/* Page title will be set by each page */}
        </h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Current Date */}
        <div className="hidden items-center gap-2 rounded-[6px] border border-[#E5E7EB] bg-gray-50 px-3 py-1.5 sm:flex">
          <Calendar className="h-3.5 w-3.5 text-[#6B7280]" />
          <span className="text-xs font-medium text-[#6B7280]">
            {formatIndonesianDate(currentDate)}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
        </div>

        {/* Notifications */}
        <button className="relative flex h-8 w-8 items-center justify-center rounded-full border border-[#E5E7EB] hover:bg-gray-50">
          <Bell className="h-4 w-4 text-[#6B7280]" />
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#EF4444] text-[9px] font-bold text-white px-1">
            3
          </span>
        </button>

        {/* User Profile */}
        <button className="flex items-center gap-2 rounded-[6px] border border-[#E5E7EB] px-2 py-1 hover:bg-gray-50">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1A2B6B] text-white text-xs font-semibold">
            YA
          </div>
          <div className="hidden flex-col text-left sm:flex">
            <span className="text-xs font-semibold text-[#1A1A2E] leading-none mb-0.5">Yoga Utama</span>
            <span className="text-[10px] text-[#6B7280] leading-none">HR Admin</span>
          </div>
          <ChevronDown className="hidden h-3.5 w-3.5 text-gray-400 sm:block" />
        </button>
      </div>
    </header>
  );
}