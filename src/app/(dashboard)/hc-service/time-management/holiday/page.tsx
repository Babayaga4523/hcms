"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable, Column } from "@/components/ui/data-table";
import { Plus, CalendarDays } from "lucide-react";

interface PublicHoliday {
  id: string;
  name: string;
  date: string;
  description: string;
}

const mockHolidays: PublicHoliday[] = [
  { id: "1", name: "Tahun Baru Masehi", date: "2026-01-01", description: "New Year's Day" },
  { id: "2", name: "Tahun Baru Imlek", date: "2026-02-17", description: "Chinese New Year" },
  { id: "3", name: "Hari Raya Nyepi", date: "2026-03-19", description: "Hindu Day of Silence" },
  { id: "4", name: "Hari Raya Idul Fitri", date: "2026-04-18", description: "Eid Al-Fitr celebration (Custom joint leave days apply)" },
];

export default function PublicHolidayPage() {
  const columns: Column<PublicHoliday>[] = [
    { key: "date", header: "Holiday Date", sortable: true },
    { key: "name", header: "Holiday Title (Indonesian)", sortable: true },
    { key: "description", header: "English Description" },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" className="text-red-500 hover:text-red-700" onClick={() => alert(`Remove holiday ${row.name}`)}>
            Remove
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Public Holiday Calendar</h1>
          <p className="text-sm text-[#6B7280]">
            Manage national holidays, corporate joint leaves, and office-closed schedules.
          </p>
        </div>
        <Button variant="primary" onClick={() => alert("Add holiday parameter...")}>
          <Plus className="h-4 w-4 mr-2" /> Add Calendar Holiday
        </Button>
      </div>

      <Card className="shadow-card border-[#E5E7EB]">
        <CardHeader>
          <CardTitle>Holiday Calendar (2026)</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={mockHolidays}
            columns={columns}
            keyExtractor={(row) => row.id}
          />
        </CardContent>
      </Card>
    </div>
  );
}
