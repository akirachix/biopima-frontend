"use client";

import { PaginationScreen } from "@/app/utils/types/sensor";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationScreen) {
  if (totalPages <= 1) return null;

  const secondaryColor = "var(--text-secondary)";

  const getPageNumbers = () => {
    const pages = [];

    // Always include current page
    pages.push(currentPage);

    // Include next page if not on last page
    if (currentPage < totalPages) {
      pages.push(currentPage + 1);
    }

    // If on last page and there are at least 2 pages, include previous
    if (currentPage === totalPages && totalPages > 1) {
      pages.unshift(currentPage - 1);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 rounded font-bold cursor-pointer ${
          currentPage === 1
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-[#F0F5EB] hover:bg-opacity-50"
        }`}
        style={{ color: secondaryColor }}
        aria-label="Previous page"
      >
        <ChevronLeft size={30} strokeWidth={3.5} />
      </button>

      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded border font-bold hover:bg-[#F0F5EB] cursor-pointer`}
          style={{
            borderColor: secondaryColor,
            color: secondaryColor,
          }}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded font-bold cursor-pointer ${
          currentPage === totalPages
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-[#F0F5EB] hover:bg-opacity-50"
        }`}
        style={{ color: secondaryColor }}
        aria-label="Next page"
      >
        <ChevronRight size={30} strokeWidth={3.5} />
      </button>
    </div>
  );
}