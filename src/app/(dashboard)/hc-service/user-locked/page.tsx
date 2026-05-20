"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable, Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Unlock, Search, ShieldAlert } from "lucide-react";

interface LockedUser {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  failedAttempts: number;
  lastAttempt: string;
}

const mockLockedUsers: LockedUser[] = [
  { id: "1", employeeId: "BNI0039", name: "Roni Setiawan", email: "roni.s@bnifinance.co.id", failedAttempts: 5, lastAttempt: "2026-05-20 15:45" },
  { id: "2", employeeId: "BNI0092", name: "Indah Permata", email: "indah.p@bnifinance.co.id", failedAttempts: 6, lastAttempt: "2026-05-20 16:12" },
];

export default function UserLockedPage() {
  const [users, setUsers] = React.useState<LockedUser[]>(mockLockedUsers);
  const [search, setSearch] = React.useState("");

  const handleUnlock = (id: string, name: string) => {
    setUsers(users.filter((u) => u.id !== id));
    alert(`Account unlocked for ${name}!`);
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.employeeId.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<LockedUser>[] = [
    { key: "employeeId", header: "Employee ID", sortable: true },
    { key: "name", header: "Full Name", sortable: true },
    { key: "email", header: "Corporate Email" },
    { key: "failedAttempts", header: "Failed Attempts", align: "center", render: (row) => <span className="font-bold text-red-600">{row.failedAttempts}</span> },
    { key: "lastAttempt", header: "Last Failed Time" },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <Button size="sm" variant="primary" onClick={() => handleUnlock(row.id, row.name)}>
          <Unlock className="h-3 w-3 mr-1" /> Unlock Account
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Locked Accounts Administration</h1>
        <p className="text-sm text-[#6B7280]">
          Unlock employee AD/LDAP accounts and resolve login failure restrictions.
        </p>
      </div>

      <Card className="shadow-card border-[#E5E7EB]">
        <CardHeader className="flex flex-row items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-red-500" />
          <CardTitle>Currently Locked Accounts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-w-md">
            <Input
              placeholder="Search by NIK or employee name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>

          <DataTable
            data={filteredUsers}
            columns={columns}
            keyExtractor={(row) => row.id}
            emptyMessage="No accounts are currently locked."
          />
        </CardContent>
      </Card>
    </div>
  );
}
