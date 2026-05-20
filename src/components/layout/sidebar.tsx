"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Building2,
  UserCircle,
  Clock,
  CalendarDays,
  FileText,
  Hourglass,
  Star,
  FileSignature,
  LogOut,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
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
    title: "Main",
    items: [
      { title: "Dashboard", href: "/", icon: LayoutDashboard },
    ],
  },
  {
    title: "Employee",
    items: [
      {
        title: "Employee Data",
        href: "/employee",
        icon: Users,
      },
      {
        title: "Employee Working Days",
        href: "/employee/working-days",
        icon: Clock,
      },
    ],
  },
  {
    title: "Organization",
    items: [
      { title: "Company Hierarchy", href: "/company-hierarchy", icon: Building2 },
    ],
  },
  {
    title: "Employee Self Service",
    items: [
      { title: "Attendance", href: "/self-service/attendance", icon: Clock },
      {
        title: "Leave (Cuti)",
        icon: CalendarDays,
        children: [
          { title: "Request", href: "/self-service/leave/request", icon: FileText },
          { title: "History", href: "/self-service/leave/history", icon: Clock },
          { title: "Leave Information", href: "/self-service/leave/information", icon: FileText },
        ],
      },
      {
        title: "Work of Permission",
        icon: FileText,
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
        title: "Performance Appraisal",
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
      {
        title: "Employee Resign",
        href: "/self-service/resign",
        icon: LogOut,
      },
    ],
  },
  {
    title: "Caretaker Resign",
    items: [
      { title: "Request Employee Resign", href: "/caretaker-resign/request", icon: LogOut },
      { title: "History Resign", href: "/caretaker-resign/history", icon: Clock },
    ],
  },
  {
    title: "Human Capital Service",
    items: [
      { title: "Attendance", href: "/hc-service/attendance", icon: Clock },
      {
        title: "Leave Administration",
        icon: CalendarDays,
        children: [
          { title: "Master Parameter", href: "/hc-service/leave-admin/master-parameter", icon: FileText },
          { title: "Generate Quota", href: "/hc-service/leave-admin/generate-quota", icon: FileText },
          { title: "Leave Adjustment", href: "/hc-service/leave-admin/adjustment", icon: FileText },
        ],
      },
      {
        title: "Performance Appraisal",
        icon: Star,
        children: [
          { title: "KPI", href: "/hc-service/performance/kpi", icon: Star },
          { title: "Core Value", href: "/hc-service/performance/core-value", icon: Star },
          { title: "Leadership", href: "/hc-service/performance/leadership", icon: Star },
        ],
      },
      {
        title: "Time Management",
        icon: Clock,
        children: [
          { title: "Work Schedules", href: "/hc-service/time-management/schedules", icon: Clock },
          { title: "Public Holiday", href: "/hc-service/time-management/holiday", icon: CalendarDays },
        ],
      },
      {
        title: "Employee Resign Claim",
        icon: LogOut,
        children: [
          { title: "Claim", href: "/hc-service/resign-claim/claim", icon: FileText },
          { title: "Release", href: "/hc-service/resign-claim/release", icon: FileText },
        ],
      },
      { title: "Report", href: "/hc-service/report", icon: FileText },
      { title: "Forward Task", href: "/hc-service/forward-task", icon: FileText },
      { title: "User Locked", href: "/hc-service/user-locked", icon: Users },
      {
        title: "Parameter Setting",
        icon: Settings,
        children: [
          { title: "Position", href: "/hc-service/parameter/position", icon: FileText },
          { title: "Department", href: "/hc-service/parameter/department", icon: FileText },
          { title: "Division", href: "/hc-service/parameter/division", icon: FileText },
          {
            title: "Know Your Employee",
            icon: Users,
            children: [
              { title: "Assignment", href: "/hc-service/parameter/kye/assignment", icon: FileText },
              { title: "Assign Employee", href: "/hc-service/parameter/kye/assign-employee", icon: Users },
              { title: "Irregularities", href: "/hc-service/parameter/kye/irregularities", icon: FileText },
              { title: "Follow-up", href: "/hc-service/parameter/kye/follow-up", icon: FileText },
            ],
          },
          { title: "Approval Level", href: "/hc-service/parameter/approval-level", icon: FileText },
          {
            title: "Pakta Integritas",
            icon: FileSignature,
            children: [
              { title: "Assignment", href: "/hc-service/parameter/pakta/assignment", icon: FileText },
              { title: "Komitmen", href: "/hc-service/parameter/pakta/komitmen", icon: FileText },
            ],
          },
        ],
      },
      { title: "Inquiry", href: "/hc-service/inquiry", icon: FileText },
    ],
  },
  {
    title: "Report",
    items: [
      { title: "Resign Report", href: "/resign-report", icon: LogOut },
    ],
  },
];

// Placeholder for Settings icon
function Settings({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

interface SidebarContextValue {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const SidebarContext = React.createContext<SidebarContextValue>({
  collapsed: false,
  setCollapsed: () => {},
  mobileOpen: false,
  setMobileOpen: () => {},
});

export function useSidebar() {
  return React.useContext(SidebarContext);
}

function NavItemComponent({
  item,
  depth = 0,
  isChild = false,
}: {
  item: NavItem;
  depth?: number;
  isChild?: boolean;
}) {
  const pathname = usePathname();
  const { collapsed, setMobileOpen } = useSidebar();
  const [expanded, setExpanded] = React.useState(false);

  const hasChildren = item.children && item.children.length > 0;
  const isActive = item.href && pathname === item.href;

  // Auto-expand if a child is active
  React.useEffect(() => {
    if (item.children) {
      const hasActiveChild = item.children.some(
        (child) => child.href === pathname || (child.children && child.children.some((c) => c.href === pathname))
      );
      if (hasActiveChild) {
        setTimeout(() => setExpanded(true), 0);
      }
    }
  }, [pathname, item.children]);

  const handleClick = () => {
    if (hasChildren) {
      setExpanded(!expanded);
    }
  };

  const content = (
    <div
      className={cn(
        "flex items-center gap-2.5 px-3 py-1.5 rounded-[6px] transition-colors group relative",
        isActive
          ? "bg-white/10 text-white before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[3px] before:bg-[#E8A020] before:rounded-r"
          : "text-white/80 hover:bg-white/8",
        isChild ? "ml-4 py-1 text-xs text-white/70" : "text-sm",
        collapsed && !isChild && "justify-center px-2"
      )}
    >
      {item.icon && (
        <item.icon
          className={cn(
            isChild ? "h-3.5 w-3.5 flex-shrink-0" : "h-4 w-4 flex-shrink-0",
            isActive && "text-[#E8A020]"
          )}
        />
      )}

      {!collapsed && (
        <>
          <span className="flex-1 truncate leading-none">{item.title}</span>

          {item.badge && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-[#1A2B6B] px-1">
              {item.badge}
            </span>
          )}

          {hasChildren && (
            <div className="ml-auto p-0.5 rounded hover:bg-white/10">
              {expanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </div>
          )}
        </>
      )}

      {/* Tooltip for collapsed state */}
      {collapsed && !isChild && (
        <div className="absolute left-full ml-2 hidden group-hover:block z-50">
          <div className="bg-gray-900 text-white text-sm px-2 py-1 rounded whitespace-nowrap">
            {item.title}
          </div>
        </div>
      )}
    </div>
  );

  const linkContent = (
    <>
      {item.href ? (
        <Link
          href={item.href}
          onClick={() => setMobileOpen(false)}
          className="block"
        >
          {content}
        </Link>
      ) : (
        <button onClick={handleClick} className="w-full text-left">
          {content}
        </button>
      )}
    </>
  );

  if (!hasChildren || collapsed) {
    return <div className="mb-1">{linkContent}</div>;
  }

  return (
    <div className="mb-1">
      {linkContent}
      {expanded && (
        <div className="mt-1 space-y-1">
          {item.children!.map((child, index) => (
            <NavItemComponent
              key={index}
              item={child}
              depth={depth + 1}
              isChild
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SidebarContent() {
  const { collapsed } = useSidebar();

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className={cn("flex h-[52px] items-center border-b border-white/10 px-4", collapsed ? "justify-center" : "gap-2.5")}>
        <div className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-white">
          <span className="text-sm font-black text-[#1A2B6B]">BNI</span>
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white leading-none mb-0.5">BNI Finance</span>
            <span className="text-[9px] text-white/60 leading-none">Human Capital</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {navigation.map((group, index) => (
          <div key={index} className="mb-3">
            {!collapsed && (
              <div className="mb-1.5 px-3 text-[9px] font-semibold uppercase tracking-wider text-white/40">
                {group.title}
              </div>
            )}
            {group.items.map((item, itemIndex) => (
              <NavItemComponent key={itemIndex} item={item} />
            ))}
          </div>
        ))}
      </nav>

      {/* User Section */}
      <div className="border-t border-white/10 p-4">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8A020] text-white font-bold">
            YA
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white">Yoga Utama</span>
              <span className="inline-flex w-fit rounded bg-[#E8A020] px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
                HR Admin
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, mobileOpen, setMobileOpen }}>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-[#1A2B6B] text-white lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-[280px] bg-[#1A2B6B] transition-transform duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={() => setMobileOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-white hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-30 hidden h-screen bg-[#1A2B6B] transition-all duration-300 lg:block",
          collapsed ? "w-[64px]" : "w-[240px]"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Collapse toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="fixed bottom-6 left-6 z-50 hidden h-10 w-10 items-center justify-center rounded-full bg-[#1A2B6B] text-white shadow-lg hover:bg-[#152454] lg:flex"
      >
        <ChevronRight className={cn("h-5 w-5 transition-transform", collapsed && "rotate-180")} />
      </button>
    </SidebarContext.Provider>
  );
}

export { navigation };