"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { AlertCircle, LogOut } from "lucide-react";

export default function SelfServiceResignPage() {
  const [formData, setFormData] = React.useState({
    resignDate: "",
    reasonType: "",
    remarks: "",
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Employee Resignation Request</h1>
        <p className="text-sm text-[#6B7280]">Submit your formal resignation request</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-card border-[#E5E7EB]">
          <CardHeader>
            <CardTitle>Resignation Form</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Primary Reason"
                  value={formData.reasonType}
                  onChange={(e) => setFormData({ ...formData, reasonType: e.target.value })}
                  options={[
                    { value: "", label: "Select Reason" },
                    { value: "career", label: "Career Change/Opportunity" },
                    { value: "personal", label: "Personal/Family Reasons" },
                    { value: "health", label: "Health Issues" },
                    { value: "relocation", label: "Relocation" },
                  ]}
                  required
                />
                <Input
                  label="Proposed Last Working Date"
                  type="date"
                  value={formData.resignDate}
                  onChange={(e) => setFormData({ ...formData, resignDate: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#374151]">Additional Remarks / Exit Interview Notes</label>
                <textarea
                  className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm focus:border-[#1A2B6B] focus:outline-none focus:ring-1 focus:ring-[#1A2B6B]"
                  rows={6}
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  placeholder="Share your thoughts about your time here..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E7EB]">
                <Button variant="secondary" type="button">Cancel</Button>
                <Button variant="primary" type="submit" className="bg-[#EF4444] hover:bg-[#DC2626]">
                  Submit Resignation
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-[#FEF2F2] border-[#FCA5A5]">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3 text-[#DC2626]">
                <LogOut className="h-6 w-6" />
                <h3 className="font-bold text-lg">Resignation Policy</h3>
              </div>
              <ul className="list-disc pl-5 space-y-2 text-sm text-[#991B1B]">
                <li>Notice period is strictly <strong>1 Month (30 Days)</strong> from the date of request submission.</li>
                <li>Ensure all handovers are completed before the effective date.</li>
                <li>Company assets (laptops, badges) must be returned to HR and IT.</li>
                <li>Final salary settlement takes up to 14 working days after the last working day.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
