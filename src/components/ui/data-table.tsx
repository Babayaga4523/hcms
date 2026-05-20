"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronDown, ChevronUp, Search, FileX } from "lucide-react";
import { Button } from "./button";

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  minWidth?: string;
  align?: "left" | "center" | "right";
  hidden?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T) => string;
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  // Pagination
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
  };
  // Sorting
  sorting?: {
    column?: string;
    direction: "asc" | "desc";
    onSort: (column: string) => void;
  };
  // Striped rows
  striped?: boolean;
  // Sticky header
  stickyHeader?: boolean;
  // Hover effect
  hoverable?: boolean;
  // Compact mode
  compact?: boolean;
  // Page size options
  pageSizeOptions?: number[];
  className?: string;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  onRowClick,
  isLoading,
  emptyMessage = "No data available",
  emptyIcon,
  pagination,
  sorting,
  striped = false,
  stickyHeader = true,
  hoverable = true,
  compact = false,
  pageSizeOptions = [10, 25, 50, 100],
  className,
}: DataTableProps<T>) {
  const visibleColumns = columns.filter((col) => !col.hidden);

  const renderSortIcon = (column: Column<T>) => {
    if (!column.sortable) return null;
    if (sorting?.column !== column.key) {
      return <ChevronDown className="h-4 w-4 text-white/40" />;
    }
    return sorting.direction === "asc" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  const handleSort = (column: Column<T>) => {
    if (column.sortable && sorting) {
      sorting.onSort(column.key);
    }
  };

  const totalPages = pagination ? Math.ceil(pagination.total / pagination.pageSize) : 1;
  const currentPage = pagination?.page || 1;
  const rowHeight = compact ? "py-2" : "py-3";
  const headerHeight = compact ? "h-9" : "h-11";

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative">
            <div className="h-12 w-12 rounded-full border-4 border-[#E5E7EB]" />
            <div className="absolute inset-0 h-12 w-12 rounded-full border-4 border-transparent border-t-[#1A2B6B] animate-spin" />
          </div>
          <p className="mt-4 text-sm text-[#6B7280]">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Table Container */}
      <div suppressHydrationWarning className="overflow-x-auto rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
        <table className="w-full caption-bottom text-sm">
          {/* Table Header */}
          <thead className={cn(stickyHeader && "sticky top-0 z-10")}>
            <tr className="bg-gradient-to-r from-[#1A2B6B] to-[#2A3D8B]">
              {visibleColumns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "px-4 text-left align-middle text-xs font-semibold text-white uppercase tracking-wider",
                    column.sortable && "cursor-pointer select-none transition-colors hover:bg-white/10",
                    column.align === "center" && "text-center",
                    column.align === "right" && "text-right",
                    headerHeight
                  )}
                  style={{ width: column.width, minWidth: column.minWidth }}
                  onClick={() => handleSort(column)}
                >
                  <div className={cn("flex items-center gap-2", column.align === "center" && "justify-center", column.align === "right" && "justify-end")}>
                    <span>{column.header}</span>
                    {column.sortable && renderSortIcon(column)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={visibleColumns.length}
                  className="h-64 text-center"
                >
                  <div className="flex flex-col items-center justify-center">
                    {emptyIcon || (
                      <div className="rounded-full bg-[#F3F4F6] p-4 mb-4">
                        <FileX className="h-8 w-8 text-[#9CA3AF]" />
                      </div>
                    )}
                    <p className="text-sm font-medium text-[#6B7280]">
                      {emptyMessage}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={keyExtractor(row)}
                  className={cn(
                    "border-b border-[#F3F4F6] transition-colors",
                    hoverable && "hover:bg-[#FAFAFA]",
                    onRowClick && "cursor-pointer",
                    striped && rowIndex % 2 === 1 && "bg-[#FAFAFA]"
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {visibleColumns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        "px-4 text-[13px] text-[#374151]",
                        column.align === "center" && "text-center",
                        column.align === "right" && "text-right",
                        rowHeight
                      )}
                    >
                      {column.render
                        ? column.render(row, rowIndex)
                        : (row as Record<string, unknown>)[column.key] as React.ReactNode}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.total > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4 bg-white rounded-xl border border-[#E5E7EB] border-t-0 shadow-sm">
          {/* Page Info */}
          <div className="flex items-center gap-2 text-sm text-[#6B7280]">
            <span>Showing</span>
            <span className="font-semibold text-[#1A1A2E]">
              {((currentPage - 1) * pagination.pageSize) + 1}
            </span>
            <span>to</span>
            <span className="font-semibold text-[#1A1A2E]">
              {Math.min(currentPage * pagination.pageSize, pagination.total)}
            </span>
            <span>of</span>
            <span className="font-semibold text-[#1A1A2E]">{pagination.total}</span>
            <span>entries</span>
          </div>

          {/* Page Size Selector */}
          {pagination.onPageSizeChange && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#6B7280]">Show</span>
              <select
                value={pagination.pageSize}
                onChange={(e) => pagination.onPageSizeChange?.(Number(e.target.value))}
                className="h-9 w-20 rounded-lg border border-[#E5E7EB] px-2 text-sm text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#1A2B6B]/20"
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Pagination Controls */}
          <div className="flex items-center gap-1">
            {/* First Page */}
            <button
              onClick={() => pagination.onPageChange(1)}
              disabled={currentPage === 1}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-[#6B7280] hover:bg-[#FAFAFA] hover:text-[#1A2B6B] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>

            {/* Previous Page */}
            <button
              onClick={() => pagination.onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-[#6B7280] hover:bg-[#FAFAFA] hover:text-[#1A2B6B] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1 mx-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => pagination.onPageChange(pageNum)}
                    className={cn(
                      "flex h-9 min-w-[36px] items-center justify-center rounded-lg px-2 text-sm font-medium transition-colors",
                      currentPage === pageNum
                        ? "bg-[#1A2B6B] text-white shadow-sm"
                        : "border border-[#E5E7EB] bg-white text-[#6B7280] hover:bg-[#FAFAFA] hover:text-[#1A2B6B]"
                    )}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* Next Page */}
            <button
              onClick={() => pagination.onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-[#6B7280] hover:bg-[#FAFAFA] hover:text-[#1A2B6B] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* Last Page */}
            <button
              onClick={() => pagination.onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-[#6B7280] hover:bg-[#FAFAFA] hover:text-[#1A2B6B] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Table Search Component
interface TableSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function TableSearch({
  value,
  onChange,
  placeholder = "Search...",
  className,
}: TableSearchProps) {
  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "h-10 w-full rounded-lg border border-[#E5E7EB] bg-white pl-11 pr-4 text-sm text-[#1A1A2E] placeholder:text-[#9CA3AF]",
          "focus:outline-none focus:ring-2 focus:ring-[#1A2B6B]/20 focus:border-[#1A2B6B]",
          "transition-all duration-200"
        )}
      />
    </div>
  );
}

// Table Filter Component
interface TableFilterProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}

export function TableFilter({
  label,
  value,
  onChange,
  options,
  className,
}: TableFilterProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {label && <span className="text-sm text-[#6B7280]">{label}</span>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-10 rounded-lg border border-[#E5E7EB] bg-white px-3 text-sm text-[#1A1A2E]",
          "focus:outline-none focus:ring-2 focus:ring-[#1A2B6B]/20 focus:border-[#1A2B6B]",
          "transition-all duration-200"
        )}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// Table Action Button
interface TableActionsProps {
  children: React.ReactNode;
}

export function TableActions({ children }: TableActionsProps) {
  return <div className="flex items-center gap-2">{children}</div>;
}