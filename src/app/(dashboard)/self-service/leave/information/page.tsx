"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  AlertCircle,
  Info,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock leave types with detailed information
const mockLeaveTypes = [
  {
    id: "1",
    code: "ANNUAL",
    name: "Annual Leave (Cuti Tahunan)",
    description: "Annual leave for vacation and personal休息. Employees are entitled to 14 days per year.",
    isPaid: true,
    totalDays: 14,
    rules: [
      "Must be taken at least 3 days before the leave date",
      "Can be accumulated up to 3 days to the following year",
      "Maximum consecutive leave is 7 working days",
      "Requires supervisor approval",
    ],
  },
  {
    id: "2",
    code: "SICK",
    name: "Sick Leave (Cuti Sakit)",
    description: "Leave for medical reasons. Employees are entitled to 5 days per year.",
    isPaid: true,
    totalDays: 5,
    rules: [
      "Must submit medical certificate for leaves exceeding 2 days",
      "Can be used for medical check-ups",
      "Does not require supervisor approval for immediate sick leave",
      "HR must be notified on the same day of absence",
    ],
  },
  {
    id: "3",
    code: "PERSONAL",
    name: "Personal Leave (Cuti Pribadi)",
    description: "Leave for personal matters. Employees are entitled to 3 days per year.",
    isPaid: true,
    totalDays: 3,
    rules: [
      "Must be approved by direct supervisor",
      "Cannot be combined with other leave types",
      "Requires at least 24 hours advance notice",
      "For emergency situations, contact HR directly",
    ],
  },
  {
    id: "4",
    code: "MATERNITY",
    name: "Maternity Leave",
    description: "Leave for female employees giving birth. Entitled to 90 days paid leave.",
    isPaid: true,
    totalDays: 90,
    rules: [
      "Must submit medical certificate from authorized hospital",
      "Can be taken 30 days before expected delivery date",
      "Father is entitled to 2 days paternity leave",
      "Extended leave can be requested as unpaid leave",
    ],
  },
  {
    id: "5",
    code: "PATERNITY",
    name: "Paternity Leave",
    description: "Leave for male employees on birth of child. Entitled to 2 days paid leave.",
    isPaid: true,
    totalDays: 2,
    rules: [
      "Must be taken within 30 days of child birth",
      "Must submit birth certificate",
      "Can be combined with annual leave for extended coverage",
    ],
  },
  {
    id: "6",
    code: "UNPAID",
    name: "Unpaid Leave",
    description: "Leave without pay for特殊情况 situations.",
    isPaid: false,
    totalDays: 0,
    rules: [
      "Requires Director-level approval",
      "Leave period counts as service period but not quota period",
      "Maximum 30 days per year",
      "Benefits continue during unpaid leave period",
    ],
  },
];

// Leave Type Card Component
function LeaveTypeCard({ leaveType }: { leaveType: typeof mockLeaveTypes[0] }) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <Card
      className={cn(
        "transition-all cursor-pointer",
        expanded && "ring-2 ring-[#1A2B6B]"
      )}
      onClick={() => setExpanded(!expanded)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-[#1A1A2E]">{leaveType.name}</h3>
              {leaveType.isPaid ? (
                <Badge variant="success">Paid</Badge>
              ) : (
                <Badge variant="secondary">Unpaid</Badge>
              )}
            </div>
            <p className="text-sm text-[#6B7280] mb-2">{leaveType.description}</p>
            {leaveType.totalDays > 0 && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#6B7280]" />
                <span className="text-sm font-medium text-[#1A2B6B]">
                  {leaveType.totalDays} days per year
                </span>
              </div>
            )}
          </div>
          <button
            className={cn(
              "p-2 hover:bg-gray-100 rounded-lg transition-transform",
              expanded && "rotate-180"
            )}
          >
            ▼
          </button>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
            <h4 className="text-sm font-semibold text-[#1A1A2E] mb-2">Rules & Regulations:</h4>
            <ul className="space-y-2">
              {leaveType.rules.map((rule, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-[#6B7280]">
                  <span className="mt-1">
                    {leaveType.code === "ANNUAL" ? (
                      <CheckCircle className="h-4 w-4 text-[#10B981]" />
                    ) : (
                      <span className="flex h-4 w-4 items-center justify-center text-[#1A2B6B] text-xs font-bold">•</span>
                    )}
                  </span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Notice Card Component
function NoticeCard() {
  return (
    <Card className="bg-[#EEF0F8] border-[#1A2B6B]">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-[#1A2B6B] mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-[#1A2B6B] mb-1">Important Notice</h4>
            <ul className="space-y-1 text-sm text-[#1A2B6B]">
              <li>• Leave requests must be submitted at least 3 days in advance</li>
              <li>• Emergency leave requires documentation (medical certificate, etc.)</li>
              <li>• All leave requests are subject to supervisor approval</li>
              <li>• For assistance, contact Human Capital at ext. 1234</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Policy Card Component
function PolicyCard() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Leave Policies</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ECFDF5]">
            <CheckCircle className="h-5 w-5 text-[#10B981]" />
          </div>
          <div>
            <h4 className="font-medium text-[#1A1A2E]">Paid Leave Benefits</h4>
            <p className="text-sm text-[#6B7280]">
              All paid leaves include full salary and benefits during the leave period.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FEF9C3]">
            <AlertCircle className="h-5 w-5 text-[#F59E0B]" />
          </div>
          <div>
            <h4 className="font-medium text-[#1A1A2E]">Leave Balance</h4>
            <p className="text-sm text-[#6B7280]">
              Leave quotas are reset at the beginning of each calendar year. Unused annual leave can be carried over.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FEE2E2]">
            <XCircle className="h-5 w-5 text-[#EF4444]" />
          </div>
          <div>
            <h4 className="font-medium text-[#1A1A2E]">Cancellation Policy</h4>
            <p className="text-sm text-[#6B7280]">
              Approved leaves can be cancelled with at least 2 days notice. Late cancellations may affect future leave approvals.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Main Page Component
export default function LeaveInformationPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Leave Information</h1>
        <p className="text-sm text-[#6B7280]">
          Learn about leave types, policies, and regulations
        </p>
      </div>

      {/* Notice */}
      <NoticeCard />

      {/* Leave Types Grid */}
      <div>
        <h2 className="text-lg font-semibold text-[#1A1A2E] mb-4">Leave Types</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockLeaveTypes.map((leaveType) => (
            <LeaveTypeCard key={leaveType.id} leaveType={leaveType} />
          ))}
        </div>
      </div>

      {/* Policy Card */}
      <PolicyCard />
    </div>
  );
}