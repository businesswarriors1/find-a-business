"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  queryParams?: Record<string, string>;
}

export function Pagination({
  currentPage,
  totalPages,
  basePath,
  queryParams = {},
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const buildHref = (page: number) => {
    const params = new URLSearchParams(queryParams);
    if (page > 1) params.set("page", String(page));
    else params.delete("page");
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  // Build page numbers to display
  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <nav
      className="flex items-center justify-center gap-1 mt-8"
      aria-label="Pagination"
    >
      <Link
        href={buildHref(currentPage - 1)}
        className={cn(
          "inline-flex items-center justify-center w-10 h-10 rounded-md text-sm font-medium transition-colors",
          currentPage === 1
            ? "text-mid/40 pointer-events-none"
            : "text-mid hover:bg-light-bg hover:text-dark",
        )}
        aria-disabled={currentPage === 1}
      >
        <ChevronLeft className="w-4 h-4" />
      </Link>

      {pages.map((page, idx) =>
        page === "..." ? (
          <span
            key={`ellipsis-${idx}`}
            className="inline-flex items-center justify-center w-10 h-10 text-sm text-mid"
          >
            ...
          </span>
        ) : (
          <Link
            key={page}
            href={buildHref(page)}
            className={cn(
              "inline-flex items-center justify-center w-10 h-10 rounded-md text-sm font-medium transition-colors",
              page === currentPage
                ? "bg-primary text-white"
                : "text-mid hover:bg-light-bg hover:text-dark",
            )}
          >
            {page}
          </Link>
        ),
      )}

      <Link
        href={buildHref(currentPage + 1)}
        className={cn(
          "inline-flex items-center justify-center w-10 h-10 rounded-md text-sm font-medium transition-colors",
          currentPage === totalPages
            ? "text-mid/40 pointer-events-none"
            : "text-mid hover:bg-light-bg hover:text-dark",
        )}
        aria-disabled={currentPage === totalPages}
      >
        <ChevronRight className="w-4 h-4" />
      </Link>
    </nav>
  );
}
