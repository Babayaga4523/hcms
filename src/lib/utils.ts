import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, format: "short" | "long" | "iso" = "short"): string {
  const d = typeof date === "string" ? new Date(date) : date;

  switch (format) {
    case "long":
      return d.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      });
    case "iso":
      return d.toISOString().split("T")[0];
    case "short":
    default:
      return d.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
  }
}

export function formatIndonesianDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const dayName = days[d.getDay()];
  const day = d.getDate().toString().padStart(2, "0");
  const month = months[d.getMonth()];
  const year = d.getFullYear();

  return `${dayName}, ${day}-${month}-${year}`;
}

export function calculateWorkingDays(startDate: Date, endDate: Date): number {
  let count = 0;
  const current = new Date(startDate);

  while (current <= endDate) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }

  return count;
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function getStatusColor(status: string): {
  bg: string;
  text: string;
  border: string;
} {
  const statusMap: Record<string, { bg: string; text: string; border: string }> = {
    ACTIVE: { bg: "#DCFCE7", text: "#166534", border: "#86EFAC" },
    INACTIVE: { bg: "#FEE2E2", text: "#991B1B", border: "#FECACA" },
    RESIGNED: { bg: "#FEF9C3", text: "#854D0E", border: "#FDE047" },
    TERMINATED: { bg: "#FEE2E2", text: "#991B1B", border: "#FECACA" },
    PENDING: { bg: "#FEF9C3", text: "#854D0E", border: "#FDE047" },
    APPROVED: { bg: "#DCFCE7", text: "#166534", border: "#86EFAC" },
    REJECTED: { bg: "#FEE2E2", text: "#991B1B", border: "#FECACA" },
    CANCELLED: { bg: "#F3F4F6", text: "#6B7280", border: "#E5E7EB" },
    PRESENT: { bg: "#DCFCE7", text: "#166534", border: "#86EFAC" },
    ABSENT: { bg: "#FEE2E2", text: "#991B1B", border: "#FECACA" },
    LATE: { bg: "#FEF9C3", text: "#854D0E", border: "#FDE047" },
    SICK: { bg: "#FEE2E2", text: "#991B1B", border: "#FECACA" },
    ON_LEAVE: { bg: "#DBEAFE", text: "#1E40AF", border: "#93C5FD" },
    WFH: { bg: "#DBEAFE", text: "#1E40AF", border: "#93C5FD" },
    PERMIT: { bg: "#F3E8FF", text: "#7C3AED", border: "#C4B5FD" },
    DRAFT: { bg: "#F3F4F6", text: "#6B7280", border: "#E5E7EB" },
    SUBMITTED: { bg: "#FEF9C3", text: "#854D0E", border: "#FDE047" },
    SIGNED: { bg: "#DCFCE7", text: "#166534", border: "#86EFAC" },
    EXPIRED: { bg: "#FEE2E2", text: "#991B1B", border: "#FECACA" },
    VOLUNTARY: { bg: "#DBEAFE", text: "#1E40AF", border: "#93C5FD" },
    INVOLUNTARY: { bg: "#FEF9C3", text: "#854D0E", border: "#FDE047" },
    RETIREMENT: { bg: "#F3E8FF", text: "#7C3AED", border: "#C4B5FD" },
    PROBATION: { bg: "#F3F4F6", text: "#6B7280", border: "#E5E7EB" },
    COMPLETED: { bg: "#DCFCE7", text: "#166534", border: "#86EFAC" },
    IN_PROGRESS: { bg: "#DBEAFE", text: "#1E40AF", border: "#93C5FD" },
  };

  return statusMap[status] || { bg: "#F3F4F6", text: "#6B7280", border: "#E5E7EB" };
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function generateNIK(): string {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `BNI${timestamp}${random}`;
}