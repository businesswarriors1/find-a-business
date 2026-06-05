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
    router.push(`/${qs ? `?${qs}` : ""}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className={cn(
        "w-full max-w-3xl mx-auto",
        compact ? "flex flex-col sm:flex-row gap-2" : "flex flex-col sm:flex-row gap-3",
        className,
      )}
    >
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-mid pointer-events-none" />
        <input
          type="text"
          placeholder="What are you looking for?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={cn(
            "w-full border border-border rounded-lg pl-10 pr-4 text-dark placeholder:text-mid focus:ring-2 focus:ring-primary/30 focus:border-primary transition-shadow",
            compact ? "min-h-[44px] text-sm" : "min-h-[52px] text-base",
          )}
        />
      </div>
      <div className="relative flex-1">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-mid pointer-events-none" />
        <input
          type="text"
          placeholder="Suburb or City"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className={cn(
            "w-full border border-border rounded-lg pl-10 pr-4 text-dark placeholder:text-mid focus:ring-2 focus:ring-primary/30 focus:border-primary transition-shadow",
            compact ? "min-h-[44px] text-sm" : "min-h-[52px] text-base",
          )}
        />
      </div>
      <button
        type="submit"
        className={cn(
          "inline-flex items-center justify-center gap-2 bg-cta text-white font-semibold rounded-lg hover:bg-cta-dark transition-colors shrink-0",
          compact ? "px-4 py-2 text-sm min-h-[44px]" : "px-6 py-3 text-base min-h-[52px]",
        )}
      >
        <Search className="w-4 h-4" />
        Search
      </button>
    </form>
  );
}
