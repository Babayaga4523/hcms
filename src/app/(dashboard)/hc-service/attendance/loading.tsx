"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Loading() {
  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[0, 1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-8 w-12" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-10 w-10 rounded-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter & Table */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-96" />
            <Skeleton className="h-10 w-32" />
          </div>

          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {["Employee", "Date", "Shift", "Clock In", "Clock Out", "Status", "Actions"].map((_, i) => (
                    <th key={i} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      <Skeleton className="h-4 w-16" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...Array(8)].map((_, rowIndex) => (
                  <tr key={rowIndex} className="border-t">
                    {[...Array(7)].map((_, colIndex) => (
                      <td key={colIndex} className="px-4 py-3">
                        <Skeleton className="h-4 w-full" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <Skeleton className="h-4 w-48" />
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-8 w-8 rounded" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
