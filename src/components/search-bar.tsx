"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  className?: string;
  prefillLocation?: string;
  prefillCategory?: string;
  compact?: boolean;
}

export function SearchBar({
  className,
  prefillLocation = "",
  prefillCategory = "",
  compact = false,
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(prefillCategory);
  const [location, setLocation] = useState(prefillLocation);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (location.trim()) params.set("location", location.trim());
    const qs = params.toString();
    router.push(`/search${qs ? `?${qs}` : ""}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className={cn(
        "w-full max-w-3xl mx-auto bg-white border border-border rounded-2xl sm:rounded-full p-2 flex flex-col sm:flex-row items-stretch gap-2 shadow-[0_18px_40px_-20px_rgba(12,43,42,0.45)]",
        className,
      )}
    >
      {/* What */}
      <div className="relative flex-1 flex items-center">
        <Search className="absolute left-4 w-5 h-5 text-cta pointer-events-none" />
        <input
          type="text"
          aria-label="What are you looking for?"
          placeholder="What are you looking for?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={cn(
            "w-full bg-transparent rounded-full pl-12 pr-4 text-dark placeholder:text-mid focus:outline-none",
            compact ? "min-h-[44px] text-sm" : "min-h-[56px] text-base",
          )}
        />
      </div>

      {/* Divider */}
      <div className="hidden sm:block w-px self-center h-7 bg-border" />

      {/* Where */}
      <div className="relative flex-1 flex items-center">
        <MapPin className="absolute left-4 w-5 h-5 text-cta pointer-events-none" />
        <input
          type="text"
          aria-label="Suburb or city"
          placeholder="Suburb or city"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className={cn(
            "w-full bg-transparent rounded-full pl-12 pr-4 text-dark placeholder:text-mid focus:outline-none",
            compact ? "min-h-[44px] text-sm" : "min-h-[56px] text-base",
          )}
        />
      </div>

      <button
        type="submit"
        className={cn(
          "inline-flex items-center justify-center gap-2 bg-cta text-white font-semibold rounded-full hover:bg-cta-dark transition-colors shrink-0",
          compact ? "px-5 py-2.5 text-sm min-h-[44px]" : "px-7 py-3 text-base min-h-[56px]",
        )}
      >
        <Search className="w-4 h-4" />
        Search
      </button>
    </form>
  );
}
