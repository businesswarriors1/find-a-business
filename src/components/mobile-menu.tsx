"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden flex items-center gap-3">
      <Link
        href="/get-listed"
        className="inline-flex items-center gap-1 rounded-lg bg-cta px-3 py-1.5 text-xs font-semibold text-white hover:bg-cta-dark transition-colors"
      >
        Get Listed
      </Link>
      <button
        className="p-2 rounded-md hover:bg-light-bg"
        aria-label="Open menu"
        onClick={() => setOpen(!open)}
      >
        <Menu className="w-5 h-5 text-dark" />
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 md:hidden border-t border-border bg-white">
          <div className="px-4 py-3 space-y-2">
            <Link href="/" className="block py-2 text-sm font-medium text-dark hover:text-primary" onClick={() => setOpen(false)}>
              Browse All
            </Link>
            <Link href="/about" className="block py-2 text-sm font-medium text-mid hover:text-dark" onClick={() => setOpen(false)}>
              About
            </Link>
            <Link href="/contact" className="block py-2 text-sm font-medium text-mid hover:text-dark" onClick={() => setOpen(false)}>
              Contact
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
