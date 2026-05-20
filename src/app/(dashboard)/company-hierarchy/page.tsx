"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Building2, User } from "lucide-react";
import { cn } from "@/lib/utils";

const hierarchyData = [
  {
    id: "1",
    name: "Board of Directors",
    type: "division",
    children: [
      {
        id: "2",
        name: "Joko Susilo",
        role: "CEO",
        type: "person",
        children: [
          {
            id: "3",
            name: "Finance Division",
            type: "department",
            children: [
              { id: "4", name: "Siti Rahayu", role: "CFO", type: "person" },
            ]
          },
          {
            id: "5",
            name: "Human Capital Division",
            type: "department",
            children: [
              { id: "6", name: "Yoga Utama", role: "Head of HC", type: "person" },
              { id: "7", name: "Budi Santoso", role: "HR Spv", type: "person" },
            ]
          }
        ]
      }
    ]
  }
];

interface HierarchyNodeData {
  id: string;
  name: string;
  role?: string;
  type: string;
  children?: HierarchyNodeData[];
}

function HierarchyNode({ node, level = 0 }: { node: HierarchyNodeData; level?: number }) {
  const isPerson = node.type === "person";
  return (
    <div className={cn("flex flex-col gap-4", level > 0 && "ml-12 mt-4")}>
      <div className="flex items-center gap-3">
        {level > 0 && (
          <div className="h-px w-8 bg-[#E5E7EB] -ml-11 absolute" />
        )}
        <div 
          className={cn(
            "flex items-center gap-3 p-3 rounded-lg border shadow-sm w-[300px]",
            isPerson ? "bg-white border-[#E5E7EB]" : "bg-[#F4F6FB] border-[#1A2B6B]/20"
          )}
        >
          <div className={cn(
            "p-2 rounded-md text-white",
            isPerson ? "bg-[#E8A020]" : "bg-[#1A2B6B]"
          )}>
            {isPerson ? <User className="h-4 w-4" /> : <Building2 className="h-4 w-4" />}
          </div>
          <div>
            <p className="text-sm font-bold text-[#1A1A2E]">{node.name}</p>
            {node.role && <p className="text-xs text-[#6B7280]">{node.role}</p>}
          </div>
        </div>
      </div>
      
      {node.children && (
        <div className="relative border-l-2 border-[#E5E7EB] ml-6">
          {node.children.map((child: HierarchyNodeData) => (
            <HierarchyNode key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CompanyHierarchyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Company Hierarchy</h1>
        <p className="text-sm text-[#6B7280]">
          Visual representation of the organizational structure
        </p>
      </div>

      <Card>
        <CardContent className="p-8 overflow-x-auto">
          <div className="min-w-[800px] py-4">
            {hierarchyData.map((node) => (
              <HierarchyNode key={node.id} node={node} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
