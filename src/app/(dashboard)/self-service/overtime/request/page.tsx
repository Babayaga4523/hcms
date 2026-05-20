"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";

export default function OvertimeRequestPage() {
  const [formData, setFormData] = React.useState({
    date: "",
    startTime: "",
    endTime: "",
    taskType: "",
    description: "",
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Overtime Request</h1>
        <p className="text-sm text-[#6B7280]">Submit a request for upcoming overtime hours.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card border-[#E5E7EB]">
          <CardHeader>
            <CardTitle>Overtime Form</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <Input
                label="Date of Overtime"
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

              <Select
                label="Task Type"
                value={formData.taskType}
                onChange={(e) => setFormData({ ...formData, taskType: e.target.value })}
                options={[
                  { value: "", label: "Select Task Type" },
                  { value: "project", label: "Project Deadline" },
                  { value: "support", label: "Production Support" },
                  { value: "maintenance", label: "System Maintenance" },
                ]}
                required
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#374151]">Task Description</label>
                <textarea
                  className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm focus:border-[#1A2B6B] focus:outline-none focus:ring-1 focus:ring-[#1A2B6B]"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="secondary" type="button">Cancel</Button>
                <Button variant="primary" type="submit">Submit Request</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
