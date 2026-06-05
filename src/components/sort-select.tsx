"use client";

import { useRouter } from "next/navigation";

export function SortSelect({ defaultValue, category }: { defaultValue: string; category: string }) {
  const router = useRouter();

  return (
    <select
      id="sort"
      defaultValue={defaultValue}
      className="border border-border rounded-md px-3 py-1.5 text-sm bg-white min-h-[36px]"
      onChange={(e) => {
        const params = new URLSearchParams(window.location.search);
        params.set("sort", e.target.value);
        router.push(`/category/${category}?${params.toString()}`);
      }}
    >
      <option value="name">Name A-Z</option>
      <option value="avg_rating">Highest Rated</option>
      <option value="review_count">Most Reviewed</option>
      <option value="created_at">Newest</option>
    </select>
  );
}
