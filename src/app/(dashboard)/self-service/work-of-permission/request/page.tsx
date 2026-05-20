"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { FileUp, Clock, CalendarDays } from "lucide-react";

export default function WorkOfPermissionRequestPage() {
  const [formData, setFormData] = React.useState({
    type: "",
    date: "",
    startTime: "",
    endTime: "",
    reason: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Work of Permission Request</h1>
        <p className="text-sm text-[#6B7280]">
          Request permission to leave work temporarily or arrive late.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-card border-[#E5E7EB]">
          <CardHeader>
            <CardTitle>Permission Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Select
                label="Permission Type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                options={[
                  { value: "", label: "Select Type" },
                  { value: "late", label: "Arrive Late" },
                  { value: "leave_early", label: "Leave Early" },
                  { value: "mid_day", label: "Leave in Mid-day" },
                ]}
                required
              />

              <Input
                label="Date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Start Time"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  required
                />
                <Input
                  label="End Time"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#374151]">
                  Reason / Description
                </label>
                <textarea
                  className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm focus:border-[#1A2B6B] focus:outline-none focus:ring-1 focus:ring-[#1A2B6B]"
                  rows={4}
                  placeholder="Explain why you need this permission..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
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

        <div className="space-y-6">
          <Card className="bg-[#EEF0F8] border-[#1A2B6B]/20">
            <CardContent className="p-4 flex gap-3 items-start">
              <Clock className="h-5 w-5 text-[#1A2B6B] shrink-0 mt-0.5" />
              <div className="text-sm text-[#1A2B6B]">
                <p className="font-bold mb-1">Policy Rules</p>
                <ul className="list-disc pl-4 space-y-1 text-xs">
                  <li>Maximum 3 hours duration per request.</li>
                  <li>Requests must be approved by direct supervisor.</li>
                  <li>Requires proof if for medical reasons.</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
