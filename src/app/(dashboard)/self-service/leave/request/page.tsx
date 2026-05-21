"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { FileUp, Calendar, AlertCircle, Loader2 } from "lucide-react";

interface LeaveQuota {
  leaveType: { id: string; code: string; name: string };
  totalDays: number;
  usedDays: number;
  remainingDays: number;
}

export default function LeaveRequestPage() {
  const router = useRouter();
  const [formData, setFormData] = React.useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [quotas, setQuotas] = React.useState<LeaveQuota[]>([]);

  // Fetch leave quotas on mount
  React.useEffect(() => {
    async function fetchQuotas() {
      try {
        const response = await fetch("/api/leave/quota?pageSize=100", {
          credentials: "include",
        });
        if (response.ok) {
          const result = await response.json();
          setQuotas(result.data || []);
        }
      } catch {
        // Silently fail - quotas are optional
      }
    }
    fetchQuotas();
  }, []);

  const calculateDays = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) + 1);
    return diff > 0 ? diff : 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate dates
      if (new Date(formData.endDate) < new Date(formData.startDate)) {
        throw new Error("End date must be after start date");
      }

      const response = await fetch("/api/leave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          leaveTypeId: formData.leaveType,
          startDate: formData.startDate,
          endDate: formData.endDate,
          reason: formData.reason,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit leave request");
      }

      // Redirect to history on success
      router.push("/self-service/leave/history");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const days = calculateDays();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Leave Request</h1>
        <p className="text-sm text-[#6B7280]">Submit your leave or time-off request</p>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
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
                  <span className="text-sm font-bold text-[#1A2B6B]">{days} {days === 1 ? "Day" : "Days"}</span>
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
                  <Button variant="secondary" type="button" onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Request"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

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
                {quotas.map((quota) => (
                  <div key={quota.leaveType.id} className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-[#1A1A2E]">{quota.leaveType.name}</span>
                      <span className="text-sm font-bold text-[#1A2B6B]">
                        {quota.remainingDays}/{quota.totalDays}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#10B981] h-2 rounded-full"
                        style={{ width: `${(quota.remainingDays / quota.totalDays) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-[#6B7280] mt-2">
                      {quota.usedDays} days taken this year
                    </p>
                  </div>
                ))}
                {quotas.length === 0 && (
                  <div className="p-4 text-center text-sm text-[#6B7280]">
                    No quota data available
                  </div>
                )}
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