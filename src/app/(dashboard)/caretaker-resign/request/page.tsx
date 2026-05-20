"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { FileUp, AlertCircle } from "lucide-react";

export default function CaretakerResignRequestPage() {
  const [formData, setFormData] = React.useState({
    employeeId: "",
    resignDate: "",
    reasonType: "",
    remarks: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit Caretaker Resign", formData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Request Employee Resign</h1>
        <p className="text-sm text-[#6B7280]">
          Submit a resignation request on behalf of an employee (Caretaker)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Resignation Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Select
                label="Target Employee"
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                options={[
                  { value: "", label: "Search and Select Employee" },
                  { value: "1", label: "Budi Santoso - NIK BNI001" },
                  { value: "2", label: "Diana Pratama - NIK BNI002" },
                ]}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Reason Type"
                  value={formData.reasonType}
                  onChange={(e) => setFormData({ ...formData, reasonType: e.target.value })}
                  options={[
                    { value: "", label: "Select Reason" },
                    { value: "personal", label: "Personal Reasons" },
                    { value: "career", label: "Career Change" },
                    { value: "health", label: "Health Issues" },
                    { value: "other", label: "Other" },
                  ]}
                  required
                />
                <Input
                  label="Effective Resign Date"
                  type="date"
                  value={formData.resignDate}
                  onChange={(e) => setFormData({ ...formData, resignDate: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#374151]">
                  Additional Remarks
                </label>
                <textarea
                  className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm focus:border-[#1A2B6B] focus:outline-none focus:ring-1 focus:ring-[#1A2B6B]"
                  rows={4}
                  placeholder="Enter details or handover notes..."
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#374151]">
                  Upload Resignation Letter
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
                    <p className="text-xs text-[#6B7280]">PDF or JPG up to 5MB</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E7EB] mt-6">
                <Button variant="secondary" type="button">
                  Cancel
                </Button>
                <Button variant="primary" type="submit" className="bg-[#EF4444] hover:bg-[#DC2626]">
                  Submit Resignation
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-[#FEF2F2] border-[#FCA5A5]">
            <CardContent className="p-4 flex gap-3 items-start">
              <AlertCircle className="h-5 w-5 text-[#DC2626] shrink-0 mt-0.5" />
              <div className="text-sm text-[#991B1B]">
                <p className="font-bold mb-1">Caretaker Policy</p>
                <p>By submitting this form, you are initiating a resignation workflow on behalf of another employee. This action requires Level 2 managerial approval and cannot be easily undone.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
