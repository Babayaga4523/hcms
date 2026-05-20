"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Building2,
  Users,
  User,
  ChevronRight,
  ChevronDown,
  Search,
  Grid3X3,
  List,
  Plus,
  Filter,
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============ DATA ============
const organizationData = {
  departments: [
    {
      id: "dept-1",
      name: "Finance",
      code: "FIN",
      head: { name: "Siti Rahayu", position: "CFO", email: "siti.rahayu@bnifinance.co.id" },
      divisions: [
        {
          id: "div-1",
          name: "Accounting",
          head: { name: "Ahmad Wijaya", position: "Accounting Manager" },
          positions: [
            { name: "Senior Accountant", count: 5 },
            { name: "Junior Accountant", count: 8 },
          ],
          employees: 24,
        },
        {
          id: "div-2",
          name: "Treasury",
          head: { name: "Budi Santoso", position: "Treasury Manager" },
          positions: [
            { name: "Treasury Analyst", count: 4 },
            { name: "Cashier", count: 6 },
          ],
          employees: 18,
        },
      ],
      totalEmployees: 42,
    },
    {
      id: "dept-2",
      name: "Human Capital",
      code: "HC",
      head: { name: "Yoga Utama", position: "Head of HC", email: "yoga.utama@bnifinance.co.id" },
      divisions: [
        {
          id: "div-3",
          name: "Recruitment",
          head: { name: "Diana Putri", position: "Recruitment Manager" },
          positions: [
            { name: "Recruiter", count: 4 },
            { name: "HR Admin", count: 3 },
          ],
          employees: 15,
        },
        {
          id: "div-4",
          name: "Learning & Development",
          head: { name: "Rina Marlina", position: "L&D Manager" },
          positions: [
            { name: "Training Specialist", count: 3 },
            { name: "Development Analyst", count: 2 },
          ],
          employees: 12,
        },
      ],
      totalEmployees: 27,
    },
    {
      id: "dept-3",
      name: "Operations",
      code: "OPS",
      head: { name: "Joko Susilo", position: "COO", email: "joko.susilo@bnifinance.co.id" },
      divisions: [
        {
          id: "div-5",
          name: "Branch Operations",
          head: { name: "Hendra Kusuma", position: "Operations Manager" },
          positions: [
            { name: "Branch Manager", count: 12 },
            { name: "Operations Staff", count: 45 },
          ],
          employees: 156,
        },
        {
          id: "div-6",
          name: "Customer Service",
          head: { name: "Maya Sari", position: "CS Manager" },
          positions: [
            { name: "Customer Service Officer", count: 25 },
            { name: "CS Supervisor", count: 5 },
          ],
          employees: 67,
        },
      ],
      totalEmployees: 223,
    },
    {
      id: "dept-4",
      name: "Information Technology",
      code: "IT",
      head: { name: "Fajar Nugroho", position: "CTO", email: "fajar.nugroho@bnifinance.co.id" },
      divisions: [
        {
          id: "div-7",
          name: "Software Development",
          head: { name: "Bayu Pratama", position: "Dev Manager" },
          positions: [
            { name: "Senior Developer", count: 6 },
            { name: "Junior Developer", count: 10 },
          ],
          employees: 28,
        },
        {
          id: "div-8",
          name: "Infrastructure",
          head: { name: "Rudi Hermawan", position: "Infra Manager" },
          positions: [
            { name: "System Administrator", count: 4 },
            { name: "Network Engineer", count: 3 },
          ],
          employees: 14,
        },
      ],
      totalEmployees: 42,
    },
  ],
  executives: [
    { id: "ex-1", name: "Joko Susilo", position: "CEO", department: "Operations", email: "joko.susilo@bnifinance.co.id", phone: "+62 812 3456 7890" },
    { id: "ex-2", name: "Siti Rahayu", position: "CFO", department: "Finance", email: "siti.rahayu@bnifinance.co.id", phone: "+62 812 3456 7891" },
    { id: "ex-3", name: "Yoga Utama", position: "Head of HC", department: "Human Capital", email: "yoga.utama@bnifinance.co.id", phone: "+62 812 3456 7892" },
    { id: "ex-4", name: "Fajar Nugroho", position: "CTO", department: "IT", email: "fajar.nugroho@bnifinance.co.id", phone: "+62 812 3456 7893" },
  ],
  stats: {
    totalDepartments: 4,
    totalDivisions: 8,
    totalEmployees: 1132,
    totalPositions: 24,
  },
};

// ============ COMPONENTS ============

// Stats Card
function StatCard({ title, value, icon: Icon, color }: { title: string; value: string | number; icon: React.ElementType; color: string }) {
  return (
    <Card className="relative overflow-hidden">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          </div>
          <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", color)}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </Card>
  );
}

// Department Card
function DepartmentCard({ department, onSelect }: { department: typeof organizationData.departments[0]; onSelect: () => void }) {
  return (
    <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-gray-100 hover:border-blue-200">
      <CardContent className="p-0">
        {/* Header */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">{department.name}</h3>
                <p className="text-xs text-gray-500">{department.code}</p>
              </div>
            </div>
            <Badge variant="soft" size="sm">{department.totalEmployees} employees</Badge>
          </div>
        </div>

        {/* Head */}
        <div className="p-5 border-b border-gray-100">
          <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-2">Department Head</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <User className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{department.head.name}</p>
              <p className="text-xs text-gray-500">{department.head.position}</p>
            </div>
          </div>
        </div>

        {/* Divisions */}
        <div className="p-5">
          <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-3">Divisions ({department.divisions.length})</p>
          <div className="space-y-2">
            {department.divisions.map((div) => (
              <div key={div.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-blue-50 flex items-center justify-center">
                    <Grid3X3 className="w-3 h-3 text-blue-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">{div.name}</span>
                </div>
                <span className="text-xs text-gray-400">{div.employees}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5">
          <Button variant="ghost" size="sm" className="w-full group-hover:bg-blue-50 group-hover:text-blue-600" onClick={onSelect}>
            View Details
            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Executive Card
function ExecutiveCard({ executive }: { executive: typeof organizationData.executives[0] }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {executive.name.split(" ").map(n => n[0]).join("")}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-gray-900">{executive.name}</h4>
            <p className="text-xs text-blue-600 font-medium">{executive.position}</p>
            <p className="text-xs text-gray-500 mt-0.5">{executive.department}</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Mail className="w-3.5 h-3.5 text-gray-400" />
            <span className="truncate">{executive.email}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Phone className="w-3.5 h-3.5 text-gray-400" />
            <span>{executive.phone}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Tree Node Component
function TreeNode({ node, level = 0 }: { node: any; level?: number }) {
  const [expanded, setExpanded] = React.useState(level < 2);
  const hasChildren = node.children && node.children.length > 0;
  const isPerson = node.type === "person";

  return (
    <div className={cn("relative", level > 0 && "ml-6")}>
      {/* Connector Line */}
      {level > 0 && (
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200 -ml-3" />
      )}

      <div className="relative flex items-start">
        {/* Toggle Button */}
        {hasChildren ? (
          <button
            onClick={() => setExpanded(!expanded)}
            className="absolute -left-6 top-1/2 -translate-y-1/2 w-5 h-5 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center z-10"
          >
            {expanded ? (
              <ChevronDown className="w-3 h-3 text-gray-500" />
            ) : (
              <ChevronRight className="w-3 h-3 text-gray-500" />
            )}
          </button>
        ) : (
          <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-gray-300" />
          </div>
        )}

        {/* Node Card */}
        <div
          className={cn(
            "flex items-center gap-3 p-3 rounded-xl border transition-all",
            isPerson
              ? "bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm cursor-pointer"
              : "bg-blue-50 border-blue-100 hover:border-blue-300",
            level === 0 && "bg-gradient-to-r from-blue-900 to-blue-700 border-blue-800"
          )}
        >
          {/* Avatar */}
          <div
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
              isPerson ? "bg-amber-100" : level === 0 ? "bg-white/20" : "bg-blue-100"
            )}
          >
            {isPerson ? (
              <User className={cn("w-5 h-5", level === 0 ? "text-white" : "text-amber-600")} />
            ) : (
              <Building2 className={cn("w-5 h-5", level === 0 ? "text-white" : "text-blue-600")} />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className={cn("text-sm font-semibold truncate", level === 0 || isPerson ? "text-gray-900" : "text-blue-900")}>
              {node.name}
            </p>
            {node.position && (
              <p className={cn("text-xs truncate", level === 0 ? "text-white/70" : "text-gray-500")}>
                {node.position}
              </p>
            )}
            {node.count !== undefined && (
              <Badge variant="soft" size="sm" className="mt-1">{node.count}</Badge>
            )}
          </div>

          {/* Actions */}
          {!isPerson && (
            <div className="flex items-center gap-1">
              <button className="p-1.5 rounded-lg hover:bg-white/50 transition-colors">
                <Eye className="w-4 h-4 text-gray-500" />
              </button>
              <button className="p-1.5 rounded-lg hover:bg-white/50 transition-colors">
                <MoreHorizontal className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Children */}
      {hasChildren && expanded && (
        <div className="mt-2 space-y-2">
          {node.children.map((child: any) => (
            <TreeNode key={child.id || child.name} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

// Tree Data
const treeData = [
  {
    id: "ceo",
    name: "Joko Susilo",
    position: "Chief Executive Officer",
    type: "person",
    children: [
      {
        id: "finance",
        name: "Finance Division",
        type: "department",
        children: [
          {
            id: "cfo",
            name: "Siti Rahayu",
            position: "Chief Financial Officer",
            type: "person",
          },
          {
            id: "accounting",
            name: "Accounting Department",
            type: "department",
            children: [
              { id: "acc-mgr", name: "Ahmad Wijaya", position: "Accounting Manager", type: "person" },
              { id: "acc-sr", name: "Wati Dewi", position: "Senior Accountant", type: "person" },
              { id: "acc-jr", name: "Rudi Setiawan", position: "Junior Accountant", type: "person" },
            ],
          },
        ],
      },
      {
        id: "hc",
        name: "Human Capital Division",
        type: "department",
        children: [
          {
            id: "hc-head",
            name: "Yoga Utama",
            position: "Head of Human Capital",
            type: "person",
          },
          {
            id: "recruitment",
            name: "Recruitment Department",
            type: "department",
            children: [
              { id: "rec-mgr", name: "Diana Putri", position: "Recruitment Manager", type: "person" },
              { id: "rec-spv", name: "Budi Santoso", position: "HR Supervisor", type: "person" },
            ],
          },
        ],
      },
      {
        id: "ops",
        name: "Operations Division",
        type: "department",
        children: [
          {
            id: "ops-head",
            name: "Hendra Kusuma",
            position: "Chief Operations Officer",
            type: "person",
          },
          {
            id: "branch",
            name: "Branch Operations",
            type: "department",
            children: [
              { id: "bra-mgr", name: "Maya Sari", position: "Branch Manager", type: "person" },
              { id: "bra-spv", name: "Tono Hermawan", position: "Operations Supervisor", type: "person" },
            ],
          },
        ],
      },
      {
        id: "it",
        name: "IT Division",
        type: "department",
        children: [
          {
            id: "cto",
            name: "Fajar Nugroho",
            position: "Chief Technology Officer",
            type: "person",
          },
          {
            id: "dev",
            name: "Software Development",
            type: "department",
            children: [
              { id: "dev-mgr", name: "Bayu Pratama", position: "Development Manager", type: "person" },
              { id: "dev-lead", name: "Rina Marlina", position: "Tech Lead", type: "person" },
            ],
          },
        ],
      },
    ],
  },
];

// ============ MAIN PAGE ============
export default function CompanyHierarchyPage() {
  const [viewMode, setViewMode] = React.useState<"cards" | "tree">("cards");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedDepartment, setSelectedDepartment] = React.useState<string | null>(null);

  const filteredDepartments = organizationData.departments.filter(
    (dept) =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.head.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Company Hierarchy</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your organizational structure</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-3.5 h-3.5 mr-1.5" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Add Department
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Departments" value={organizationData.stats.totalDepartments} icon={Building2} color="bg-blue-600" />
        <StatCard title="Divisions" value={organizationData.stats.totalDivisions} icon={Grid3X3} color="bg-purple-600" />
        <StatCard title="Employees" value={organizationData.stats.totalEmployees.toLocaleString()} icon={Users} color="bg-green-600" />
        <StatCard title="Positions" value={organizationData.stats.totalPositions} icon={User} color="bg-amber-500" />
      </div>

      {/* Search & View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search departments or employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => setViewMode("cards")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
              viewMode === "cards" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            <Grid3X3 className="w-3.5 h-3.5" />
            Cards
          </button>
          <button
            onClick={() => setViewMode("tree")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
              viewMode === "tree" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            <List className="w-3.5 h-3.5" />
            Tree
          </button>
        </div>
      </div>

      {/* Content */}
      {viewMode === "cards" ? (
        <div className="space-y-8">
          {/* Departments Grid */}
          <div>
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Departments</h2>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredDepartments.map((dept) => (
                <DepartmentCard
                  key={dept.id}
                  department={dept}
                  onSelect={() => setSelectedDepartment(dept.id)}
                />
              ))}
            </div>
          </div>

          {/* Executives */}
          <div>
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Executive Team</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {organizationData.executives.map((exec) => (
                <ExecutiveCard key={exec.id} executive={exec} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Organization Tree</CardTitle>
              <Badge variant="soft" size="sm">{organizationData.stats.totalEmployees} employees</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 pb-4">
              {treeData.map((node) => (
                <TreeNode key={node.id} node={node} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Department Detail */}
      {selectedDepartment && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                Department Details
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setSelectedDepartment(null)}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {(() => {
              const dept = organizationData.departments.find((d) => d.id === selectedDepartment);
              if (!dept) return null;
              return (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-white rounded-xl border border-gray-100">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Department</p>
                      <p className="text-sm font-semibold text-gray-900">{dept.name}</p>
                      <p className="text-xs text-gray-500">{dept.code}</p>
                    </div>
                    <div className="p-4 bg-white rounded-xl border border-gray-100">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Head</p>
                      <p className="text-sm font-semibold text-gray-900">{dept.head.name}</p>
                      <p className="text-xs text-gray-500">{dept.head.position}</p>
                    </div>
                    <div className="p-4 bg-white rounded-xl border border-gray-100">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Total Employees</p>
                      <p className="text-sm font-semibold text-gray-900">{dept.totalEmployees}</p>
                      <p className="text-xs text-gray-500">{dept.divisions.length} divisions</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-900 mb-3">Divisions Breakdown</p>
                    <div className="grid md:grid-cols-2 gap-3">
                      {dept.divisions.map((div) => (
                        <div key={div.id} className="p-4 bg-white rounded-xl border border-gray-100">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                <Grid3X3 className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900">{div.name}</p>
                                <p className="text-xs text-gray-500">{div.head.name}</p>
                              </div>
                            </div>
                            <Badge variant="soft" size="sm">{div.employees}</Badge>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {div.positions.map((pos) => (
                              <span key={pos.name} className="px-2 py-0.5 bg-gray-100 rounded text-[10px] text-gray-600">
                                {pos.name} ({pos.count})
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  );
}