"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { FileUp, Calendar, AlertCircle } from "lucide-react";

export default function LeaveRequestPage() {
  const [formData, setFormData] = React.useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit Leave Request", formData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Leave Request</h1>
        <p className="text-sm text-[#6B7280]">
          Submit your leave or time-off request
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Request Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Select
                label="Leave Type"
                value={formData.leaveType}
                onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                options={[
                  { value: "", label: "Select Leave Type" },
                  { value: "annual", label: "Annual Leave" },
                  { value: "sick", label: "Sick Leave" },
                  { value: "unpaid", label: "Unpaid Leave" },
                  { value: "maternity", label: "Maternity Leave" },
                ]}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Start Date"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
                <Input
                  label="End Date"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>

              <div className="bg-[#F4F6FB] p-3 rounded-lg flex items-center justify-between border border-[#E5E7EB]">
                <span className="text-sm font-medium text-[#6B7280]">Calculated Duration</span>
                <span className="text-sm font-bold text-[#1A2B6B]">3 Days</span>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#374151]">
                  Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm focus:border-[#1A2B6B] focus:outline-none focus:ring-1 focus:ring-[#1A2B6B]"
                  rows={4}
                  placeholder="Explain why you are requesting leave..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#374151]">
                  Attachment (Optional)
                </label>
                <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-[#E5E7EB] px-6 pt-5 pb-6 hover:bg-gray-50 cursor-pointer">
                  <div className="space-y-1 text-center">
                    <FileUp className="mx-auto h-8 w-8 text-[#6B7280]" />
                    <div className="flex text-sm text-[#6B7280]">
                      <span className="relative cursor-pointer rounded-md font-medium text-[#1A2B6B] focus-within:outline-none hover:underline">
                        Upload a file
                      </span>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-[#6B7280]">PNG, JPG, PDF up to 5MB</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E7EB] mt-6">
                <Button variant="secondary" type="button">
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Submit Request
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Quota Summary Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="bg-[#1A2B6B] text-white rounded-t-xl pb-4">
              <CardTitle className="flex items-center gap-2 text-white">
                <Calendar className="h-5 w-5" />
                Leave Quota
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-[#E5E7EB]">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-[#1A1A2E]">Annual Leave</span>
                    <span className="text-sm font-bold text-[#1A2B6B]">12/14</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-[#10B981] h-2 rounded-full" style={{ width: "85%" }}></div>
                  </div>
                  <p className="text-xs text-[#6B7280] mt-2">2 days taken this year</p>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-[#1A1A2E]">Sick Leave</span>
                    <span className="text-sm font-bold text-[#1A2B6B]">3/5</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-[#E8A020] h-2 rounded-full" style={{ width: "60%" }}></div>
                  </div>
                  <p className="text-xs text-[#6B7280] mt-2">2 days taken this year</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#EEF0F8] border-0">
            <CardContent className="p-4 flex gap-3 items-start">
              <AlertCircle className="h-5 w-5 text-[#1A2B6B] shrink-0 mt-0.5" />
              <div className="text-sm text-[#1A2B6B]">
                <p className="font-semibold mb-1">Important Note</p>
                <p>Leave requests must be submitted at least 3 days in advance for annual leave. Medical certificates are required for sick leave exceeding 2 days.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}