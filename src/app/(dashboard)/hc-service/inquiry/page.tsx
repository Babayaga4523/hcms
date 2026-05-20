"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { DataTable, Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Search, Info, HelpCircle } from "lucide-react";

interface InquiryRecord {
  id: string;
  employeeId: string;
  name: string;
  department: string;
  category: "Leave" | "Overtime" | "Permission" | "Appraisal";
  subject: string;
  date: string;
  status: "Approved" | "Rejected" | "Pending";
}

const mockInquiries: InquiryRecord[] = [
  { id: "1", employeeId: "BNI0012", name: "Yoga Utama", department: "IT Division", category: "Leave", subject: "Annual Leave (3 Days)", date: "2026-05-10", status: "Approved" },
  { id: "2", employeeId: "BNI0045", name: "Andi Wijaya", department: "IT Division", category: "Overtime", subject: "Weekday Overtime (4 Hours)", date: "2026-05-18", status: "Approved" },
  { id: "3", employeeId: "BNI0089", name: "Siti Rahma", department: "Finance & Accounting", category: "Permission", subject: "Late Arrival (Arrive late 2 hours)", date: "2026-05-19", status: "Rejected" },
  { id: "4", employeeId: "BNI0112", name: "Budi Santoso", department: "Operations", category: "Appraisal", subject: "KPI Q1 Assessment Submission", date: "2026-04-15", status: "Approved" },
];

export default function HCInquiryPage() {
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState("All");

  const filteredInquiries = mockInquiries.filter((row) => {
    const matchesSearch = row.name.toLowerCase().includes(search.toLowerCase()) || 
                          row.employeeId.toLowerCase().includes(search.toLowerCase()) || 
                          row.subject.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || row.category === category;
    return matchesSearch && matchesCategory;
  });

  const columns: Column<InquiryRecord>[] = [
    { key: "employeeId", header: "NIK", sortable: true },
    { key: "name", header: "Employee Name", sortable: true },
    { key: "department", header: "Department" },
    { key: "category", header: "Record Type" },
    { key: "subject", header: "Subject Detail" },
    { key: "date", header: "Effective Date" },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <Badge variant={row.status === "Approved" ? "success" : row.status === "Rejected" ? "danger" : "warning"}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <Button size="sm" variant="secondary" onClick={() => alert(`Showing detail log for ID ${row.id}`)}>
          Details
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Universal Inquiry Center</h1>
        <p className="text-sm text-[#6B7280]">
          Query and audit all employee request records across leaves, permissions, appraisals, and overtime.
        </p>
      </div>

      <Card className="shadow-card border-[#E5E7EB]">
        <CardHeader>
          <CardTitle>Inquiry Search Engine</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 max-w-lg">
              <Input
                placeholder="Search NIK, name, or subject..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={[
                { value: "All", label: "All Record Types" },
                { value: "Leave", label: "Leave Requests" },
                { value: "Overtime", label: "Overtime Requests" },
                { value: "Permission", label: "Permission Requests" },
                { value: "Appraisal", label: "Appraisal Submissions" },
              ]}
              className="w-48"
            />
          </div>

          <DataTable
            data={filteredInquiries}
            columns={columns}
            keyExtractor={(row) => row.id}
          />
        </CardContent>
      </Card>
    </div>
  );
}
