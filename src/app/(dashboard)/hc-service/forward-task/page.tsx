"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable, Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Forward, Plus } from "lucide-react";

interface ForwardTask {
  id: string;
  fromUser: string;
  toUser: string;
  startDate: string;
  endDate: string;
  status: "Active" | "Expired" | "Scheduled";
}

const mockForwards: ForwardTask[] = [
  { id: "1", fromUser: "Yoga Utama (VP)", toUser: "Andi Wijaya (AVP)", startDate: "2026-05-20", endDate: "2026-05-27", status: "Active" },
  { id: "2", fromUser: "Siti Rahma (MGR)", toUser: "Budi Santoso (AM)", startDate: "2026-06-01", endDate: "2026-06-10", status: "Scheduled" },
];

export default function ForwardTaskPage() {
  const [forwards, setForwards] = React.useState<ForwardTask[]>(mockForwards);
  const [showForm, setShowForm] = React.useState(false);
  const [formData, setFormData] = React.useState({
    fromUser: "",
    toUser: "",
    startDate: "",
    endDate: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newForward: ForwardTask = {
      id: String(forwards.length + 1),
      fromUser: formData.fromUser,
      toUser: formData.toUser,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: "Scheduled",
    };
    setForwards([newForward, ...forwards]);
    setShowForm(false);
    setFormData({ fromUser: "", toUser: "", startDate: "", endDate: "" });
  };

  const columns: Column<ForwardTask>[] = [
    { key: "fromUser", header: "Delegator / From", sortable: true },
    { key: "toUser", header: "Delegatee / To", sortable: true },
    { key: "startDate", header: "Start Date" },
    { key: "endDate", header: "End Date" },
    {
      key: "status",
      header: "Delegation Status",
      render: (row) => (
        <Badge variant={row.status === "Active" ? "success" : row.status === "Scheduled" ? "info" : "secondary"}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <Button size="sm" variant="secondary" onClick={() => alert(`Revoke delegation for ${row.fromUser}`)}>
          Revoke
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Approval Task Delegation</h1>
          <p className="text-sm text-[#6B7280]">
            Delegate approval workflows to alternate supervisors temporarily during leaves.
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" /> Delegate New Task
        </Button>
      </div>

      {showForm && (
        <Card className="shadow-card border-[#E5E7EB] bg-white">
          <CardHeader>
            <CardTitle>Assign Temporary Delegate</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <Input
                label="Delegator Employee (NIK/Name)"
                placeholder="e.g. BNI0012"
                value={formData.fromUser}
                onChange={(e) => setFormData({ ...formData, fromUser: e.target.value })}
                required
              />
              <Input
                label="Delegatee Employee (NIK/Name)"
                placeholder="e.g. BNI0045"
                value={formData.toUser}
                onChange={(e) => setFormData({ ...formData, toUser: e.target.value })}
                required
              />
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
              <div className="md:col-span-4 flex justify-end gap-2 pt-2">
                <Button variant="secondary" type="button" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  <Forward className="h-4 w-4 mr-2" /> Enable Delegation
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-card border-[#E5E7EB]">
        <CardHeader>
          <CardTitle>Task Forwarding Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={forwards}
            columns={columns}
            keyExtractor={(row) => row.id}
          />
        </CardContent>
      </Card>
    </div>
  );
}
