"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Building2,
  Clock,
  CalendarDays,
  FileText,
  Hourglass,
  Star,
  FileSignature,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Settings,
  FolderKanban,
  ClipboardList,
  UserCheck,
  ShieldCheck,
  BookOpen,
  BarChart3,
  ArrowRightLeft,
  Search,
} from "lucide-react";

interface NavItem {
  title: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  children?: NavItem[];
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navigation: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", href: "/", icon: LayoutDashboard },
    ],
  },
  {
    title: "Data Management",
    items: [
      { title: "Employee Data", href: "/employee", icon: Users },
      { title: "Working Days", href: "/employee/working-days", icon: Clock },
      { title: "Company Hierarchy", href: "/company-hierarchy", icon: Building2 },
    ],
  },
  {
    title: "Self Service",
    items: [
      { title: "Attendance", href: "/self-service/attendance", icon: UserCheck },
      {
        title: "Leave",
        icon: CalendarDays,
        children: [
          { title: "Request", href: "/self-service/leave/request", icon: FileText },
          { title: "History", href: "/self-service/leave/history", icon: Clock },
          { title: "Information", href: "/self-service/leave/information", icon: BookOpen },
        ],
      },
      {
        title: "Work Permission",
        icon: ShieldCheck,
        children: [
          { title: "Request", href: "/self-service/work-of-permission/request", icon: FileText },
          { title: "History", href: "/self-service/work-of-permission/history", icon: Clock },
        ],
      },
      {
        title: "Overtime",
        icon: Hourglass,
        children: [
          { title: "Request", href: "/self-service/overtime/request", icon: FileText },
          { title: "History", href: "/self-service/overtime/history", icon: Clock },
        ],
      },
      {
        title: "Performance",
        icon: Star,
        children: [
          { title: "Assignment", href: "/self-service/performance-appraisal/assignment", icon: FileText },
          { title: "History", href: "/self-service/performance-appraisal/history", icon: Clock },
        ],
      },
      {
        title: "Pakta Integritas",
        icon: FileSignature,
        children: [
          { title: "Assignment", href: "/self-service/pakta-integritas/assignment", icon: FileText },
          { title: "History", href: "/self-service/pakta-integritas/history", icon: Clock },
        ],
      },
      { title: "Resign Request", href: "/self-service/resign", icon: LogOut },
    ],
  },
  {
    title: "Administration",
    items: [
      {
        title: "Leave Admin",
        icon: CalendarDays,
        children: [
          { title: "Master Parameter", href: "/hc-service/leave-admin/master-parameter", icon: FolderKanban },
          { title: "Generate Quota", href: "/hc-service/leave-admin/generate-quota", icon: ClipboardList },
          { title: "Adjustment", href: "/hc-service/leave-admin/adjustment", icon: Settings },
        ],
      },
      { title: "Attendance", href: "/hc-service/attendance", icon: UserCheck },
      {
        title: "Performance",
        icon: Star,
        children: [
          { title: "KPI", href: "/hc-service/performance/kpi", icon: BarChart3 },
          { title: "Core Value", href: "/hc-service/performance/core-value", icon: Star },
          { title: "Leadership", href: "/hc-service/performance/leadership", icon: Users },
        ],
      },
      {
        title: "Time Management",
        icon: Clock,
        children: [
          { title: "Schedules", href: "/hc-service/time-management/schedules", icon: Clock },
          { title: "Holidays", href: "/hc-service/time-management/holiday", icon: CalendarDays },
        ],
      },
    ],
  },
  {
    title: "Resign Management",
    items: [
      { title: "Request", href: "/caretaker-resign/request", icon: LogOut },
      { title: "History", href: "/caretaker-resign/history", icon: Clock },
      {
        title: "Claim",
        icon: ClipboardList,
        children: [
          { title: "Claim Management", href: "/hc-service/resign-claim/claim", icon: FileText },
          { title: "Release", href: "/hc-service/resign-claim/release", icon: ArrowRightLeft },
        ],
      },
    ],
  },
  {
    title: "Settings & Reports",
    items: [
      { title: "Report", href: "/hc-service/report", icon: BarChart3 },
      { title: "Forward Task", href: "/hc-service/forward-task", icon: ArrowRightLeft },
      { title: "User Locked", href: "/hc-service/user-locked", icon: ShieldCheck },
      {
        title: "Parameters",
        icon: Settings,
        children: [
          { title: "Position", href: "/hc-service/parameter/position", icon: FolderKanban },
          { title: "Department", href: "/hc-service/parameter/department", icon: Building2 },
          { title: "Division", href: "/hc-service/parameter/division", icon: FolderKanban },
          {
            title: "Know Your Employee",
            icon: Search,
            children: [
              { title: "Assignment", href: "/hc-service/parameter/kye/assignment", icon: FileText },
              { title: "Assign Employee", href: "/hc-service/parameter/kye/assign-employee", icon: Users },
              { title: "Irregularities", href: "/hc-service/parameter/kye/irregularities", icon: ShieldCheck },
              { title: "Follow-up", href: "/hc-service/parameter/kye/follow-up", icon: Clock },
            ],
          },
          { title: "Approval Level", href: "/hc-service/parameter/approval-level", icon: UserCheck },
          {
            title: "Pakta Integritas",
            icon: FileSignature,
            children: [
              { title: "Assignment", href: "/hc-service/parameter/pakta/assignment", icon: FileText },
              { title: "Komitmen", href: "/hc-service/parameter/pakta/komitmen", icon: BookOpen },
            ],
          },
        ],
      },
      { title: "Inquiry", href: "/hc-service/inquiry", icon: Search },
    ],
  },
  {
    title: "Reports",
    items: [
      { title: "Resign Report", href: "/resign-report", icon: BarChart3 },
    ],
  },
];

function NavItemComponent({
  item,
  depth = 0,
  onItemClick,
}: {
  item: NavItem;
  depth?: number;
  onItemClick?: () => void;
}) {
  const pathname = usePathname();
  const [expanded, setExpanded] = React.useState(false);

  const hasChildren = item.children && item.children.length > 0;
  const isActive = item.href ? pathname === item.href : false;

  const hasActiveChild = React.useMemo(() => {
    if (!item.children) return false;
    return item.children.some(
      (child) => child.href === pathname || (child.children && child.children.some((c) => c.href === pathname))
    );
  }, [item.children, pathname]);

  React.useEffect(() => {
    if (hasActiveChild) {
      setExpanded(true);
    }
  }, [hasActiveChild]);

  const handleClick = () => {
    if (hasChildren) {
      setExpanded(!expanded);
    }
  };

  const indentClass = depth > 0 ? "ml-6" : "";

  const itemClassName = cn(
    "group flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer",
    isActive
      ? "bg-gradient-to-r from-[#E8A020]/20 to-transparent border-l-2 border-[#E8A020]"
      : depth > 0
      ? "text-white/50 hover:text-white hover:bg-white/5 text-xs"
      : "text-white/70 hover:text-white hover:bg-white/10",
    depth === 0 && "text-sm"
  );

  const content = (
    <>
      {item.icon && (
        <item.icon
          className={cn(
            "flex-shrink-0 transition-colors duration-200",
            depth > 0 ? "h-3.5 w-3.5" : "h-4.5 w-4.5",
            isActive ? "text-[#E8A020]" : "text-white/50 group-hover:text-white/70"
          )}
        />
      )}

      <span className={cn("flex-1 font-medium truncate", isActive && "text-white")}>
        {item.title}
      </span>

      {item.badge && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#E8A020] text-[10px] font-bold text-white px-1.5">
          {item.badge}
        </span>
      )}

      {hasChildren && (
        <ChevronDown
          className={cn(
            "h-4 w-4 text-white/40 transition-transform duration-200 group-hover:text-white/70",
            expanded && "rotate-180"
          )}
        />
      )}
    </>
  );

  return (
    <div className={cn("mb-0.5", indentClass)}>
      {hasChildren ? (
        <div className={itemClassName} onClick={handleClick}>
          {content}
        </div>
      ) : (
        <Link href={item.href || "#"} className={itemClassName} onClick={onItemClick}>
          {content}
        </Link>
      )}

      {hasChildren && expanded && (
        <div className={cn("mt-1 overflow-hidden", depth > 0 ? "ml-4" : "")}>
          {item.children!.map((child, idx) => (
            <NavItemComponent key={idx} item={child} depth={depth + 1} onItemClick={onItemClick} />
          ))}
        </div>
      )}
    </div>
  );
}

function SidebarContent({ onItemClick }: { onItemClick?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      {/* Logo Header */}
      <div className="flex items-center h-16 px-4 border-b border-white/10 gap-3">
        <div className="relative">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#E8A020] to-[#D08F1D] shadow-lg">
            <span className="text-sm font-black text-white">BNI</span>
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-400 border-2 border-[#1A2B6B]" />
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-bold text-white leading-tight">BNI Finance</span>
          <span className="text-[10px] text-white/50 font-medium">Human Capital</span>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-3">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="text"
            placeholder="Search menu..."
            suppressHydrationWarning
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#E8A020]/50 focus:bg-white/10 transition-all"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {navigation.map((group, index) => (
          <div key={index} className="mb-4">
            <div className="mb-2 px-3">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-white/30">
                {group.title}
              </span>
            </div>
            {group.items.map((item, itemIndex) => (
              <NavItemComponent key={itemIndex} item={item} onItemClick={onItemClick} />
            ))}
            {index < navigation.length - 1 && (
              <div className="mx-3 my-2 border-t border-white/5" />
            )}
          </div>
        ))}
      </nav>

      {/* User Section */}
      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#E8A020] to-[#D08F1D] text-white font-bold text-sm shadow-lg">
              YA
            </div>
            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-400 border-2 border-[#1A2B6B]" />
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm font-semibold text-white truncate">Yoga Utama</span>
            <span className="text-[10px] text-white/50 font-medium">HR Admin</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleClose = () => setMobileOpen(false);

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-[#1A2B6B] to-[#152454] text-white shadow-lg hover:shadow-xl transition-shadow lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={handleClose}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-[280px] bg-[#1A2B6B] shadow-2xl transition-transform duration-300 ease-out lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex justify-end p-4">
            <button
              onClick={handleClose}
              className="flex h-9 w-9 items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <SidebarContent onItemClick={handleClose} />
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-[260px] bg-gradient-to-b from-[#1A2B6B] to-[#152454] lg:block">
        <SidebarContent />
      </aside>
    </>
  );
}

export { navigation };

// Hook for sidebar state (kept for compatibility)
export function useSidebar() {
  return {
    collapsed: false,
    setCollapsed: () => {},
    mobileOpen: false,
    setMobileOpen: () => {},
  };
}