"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeadCell,
  TableCell,
} from "@/components/ui/Table";
import { Search, ChevronLeft, ChevronRight, ArrowUp, ArrowDown, ArrowUpDown, LogOut } from "lucide-react";
import { format } from "date-fns";
import type { WaitlistEntry } from "@/types";

function SortIcon({
  column,
  currentSortBy,
  currentSortOrder,
}: {
  column: string;
  currentSortBy: string;
  currentSortOrder: string;
}) {
  if (currentSortBy !== column) return <ArrowUpDown className="ml-1 h-3 w-3 text-on-surface-variant/50" />;
  return currentSortOrder === "asc" ? (
    <ArrowUp className="ml-1 h-3 w-3 text-primary" />
  ) : (
    <ArrowDown className="ml-1 h-3 w-3 text-primary" />
  );
}

interface DashboardClientProps {
  entries: WaitlistEntry[];
  totalPages: number;
  currentPage: number;
  currentSearch: string;
  currentSortBy: string;
  currentSortOrder: string;
  sourceBreakdown: Record<string, number>;
}

export function DashboardClient({
  entries,
  totalPages,
  currentPage,
  currentSearch,
  currentSortBy,
  currentSortOrder,
  sourceBreakdown,
}: DashboardClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState(currentSearch);

  const buildUrl = useCallback(
    (params: Record<string, string>) => {
      const sp = new URLSearchParams(searchParams.toString());
      Object.entries(params).forEach(([k, v]) => {
        if (v) sp.set(k, v);
        else sp.delete(k);
      });
      return `/admin/dashboard?${sp.toString()}`;
    },
    [searchParams]
  );

  const handleSearch = (value: string) => {
    setSearchInput(value);
    router.push(buildUrl({ search: value, page: "1" }));
  };

  const handleSort = (column: string) => {
    if (currentSortBy === column) {
      const order = currentSortOrder === "asc" ? "desc" : "asc";
      router.push(buildUrl({ sortBy: column, sortOrder: order }));
    } else {
      router.push(buildUrl({ sortBy: column, sortOrder: "desc" }));
    }
  };

  const handlePage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    router.push(buildUrl({ page: String(page) }));
  };

  const handleSignOut = async () => {
    await fetch("/admin/login/api", { method: "DELETE" });
    router.push("/admin/login");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant/50" />
          <input
            type="text"
            placeholder="Search by email, name, company..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch(searchInput);
            }}
            className="h-10 w-full rounded border border-[#262626] bg-surface-container-lowest pl-9 pr-3 text-sm text-on-surface outline-none focus:border-primary focus:shadow-[0_0_0_2px_rgba(34,211,238,0.2)] placeholder:text-on-surface-variant/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="default">Sign Out</Badge>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1 text-xs text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <LogOut className="h-3 w-3" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {Object.entries(sourceBreakdown)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([source, count]) => (
            <div
              key={source}
              className="rounded-lg border border-[#262626] bg-surface-container p-3"
            >
              <p className="text-xs font-medium capitalize text-on-surface-variant">
                {source}
              </p>
              <p className="mt-1 text-lg font-semibold text-on-surface">{count}</p>
            </div>
          ))}
      </div>

      <div className="rounded-lg border border-[#262626] bg-surface-container overflow-hidden">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeadCell>
                <button
                  onClick={() => handleSort("created_at")}
                  className="inline-flex items-center text-[#525252] hover:text-on-surface transition-colors"
                >
                  Date <SortIcon column="created_at" currentSortBy={currentSortBy} currentSortOrder={currentSortOrder} />
                </button>
              </TableHeadCell>
              <TableHeadCell>
                <button
                  onClick={() => handleSort("email")}
                  className="inline-flex items-center text-[#525252] hover:text-on-surface transition-colors"
                >
                  Email <SortIcon column="email" currentSortBy={currentSortBy} currentSortOrder={currentSortOrder} />
                </button>
              </TableHeadCell>
              <TableHeadCell>
                <button
                  onClick={() => handleSort("name")}
                  className="inline-flex items-center text-[#525252] hover:text-on-surface transition-colors"
                >
                  Name <SortIcon column="name" currentSortBy={currentSortBy} currentSortOrder={currentSortOrder} />
                </button>
              </TableHeadCell>
              <TableHeadCell>Company</TableHeadCell>
              <TableHeadCell>Use Case</TableHeadCell>
              <TableHeadCell>
                <button
                  onClick={() => handleSort("source")}
                  className="inline-flex items-center text-[#525252] hover:text-on-surface transition-colors"
                >
                  Source <SortIcon column="source" currentSortBy={currentSortBy} currentSortOrder={currentSortOrder} />
                </button>
              </TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-on-surface-variant py-12">
                  No signups found
                </TableCell>
              </TableRow>
            ) : (
              entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="text-xs text-on-surface-variant whitespace-nowrap">
                    {format(new Date(entry.created_at), "MMM d, yyyy HH:mm")}
                  </TableCell>
                  <TableCell className="font-medium">{entry.email}</TableCell>
                  <TableCell className="text-on-surface-variant">
                    {entry.name || "—"}
                  </TableCell>
                  <TableCell className="text-on-surface-variant">
                    {entry.company || "—"}
                  </TableCell>
                  <TableCell className="text-on-surface-variant max-w-[200px] truncate">
                    {entry.use_case || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="default" className="capitalize">
                      {entry.source}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-on-surface-variant">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="inline-flex h-8 w-8 items-center justify-center rounded border border-[#262626] text-on-surface-variant hover:bg-surface-container hover:text-on-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 7) {
                pageNum = i + 1;
              } else if (currentPage <= 4) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 3) {
                pageNum = totalPages - 6 + i;
              } else {
                pageNum = currentPage - 3 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePage(pageNum)}
                  className={`inline-flex h-8 w-8 items-center justify-center rounded text-xs font-medium transition-colors ${
                    pageNum === currentPage
                      ? "bg-primary text-on-primary"
                      : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => handlePage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="inline-flex h-8 w-8 items-center justify-center rounded border border-[#262626] text-on-surface-variant hover:bg-surface-container hover:text-on-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
