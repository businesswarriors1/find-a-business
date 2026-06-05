import Link from "next/link";
import { Search } from "lucide-react";
import { SearchBar } from "@/components/search-bar";
import { ListingCard } from "@/components/listing-card";
import { Pagination } from "@/components/pagination";
import { PRIMARY_CATEGORIES, ITEMS_PER_PAGE, SITE_NAME } from "@/lib/constants";
import { searchBusinesses } from "@/lib/supabase/server";
import type { Metadata } from "next";

interface Props {
  searchParams: Promise<{ q?: string; location?: string; page?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q, location } = await searchParams;
  const parts = [q, location].filter(Boolean).join(" in ");
  const title = parts ? `Search results for "${parts}"` : "Search";
  return {
    title: `${title} | ${SITE_NAME}`,
    description: `Search results for businesses${parts ? ` matching ${parts}` : ""} on ${SITE_NAME}.`,
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q, location, page } = await searchParams;
  const currentPage = page ? parseInt(page, 10) : 1;

  const hasQuery = Boolean(q?.trim() || location?.trim());

  const { data: businesses, total } = hasQuery
    ? await searchBusinesses({ q, location, page: currentPage, pageSize: ITEMS_PER_PAGE })
    : { data: [], total: 0 };

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const summary = [q?.trim(), location?.trim()].filter(Boolean).join(" in ");

  return (
    <div>
      <section className="bg-light-bg py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-dark mb-4">
            {summary ? <>Search results for &ldquo;{summary}&rdquo;</> : "Search businesses"}
          </h1>
          <SearchBar
            compact
            prefillCategory={q ?? ""}
            prefillLocation={location ?? ""}
          />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!hasQuery ? (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-mid mx-auto mb-3" />
            <p className="text-mid mb-6">
              Enter what you&apos;re looking for and a location to search the directory.
            </p>
            <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
              {PRIMARY_CATEGORIES.slice(0, 10).map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="inline-flex items-center rounded-full border border-border bg-white px-3 py-1.5 text-sm font-medium text-dark hover:border-primary hover:text-primary transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        ) : businesses.length === 0 ? (
          <div className="text-center py-16 bg-light-bg rounded-lg border border-border">
            <Search className="w-12 h-12 text-mid mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-dark mb-2">No results found</h2>
            <p className="text-mid mb-6">
              We couldn&apos;t find any businesses matching {summary ? <>&ldquo;{summary}&rdquo;</> : "your search"}.
              Try a broader term, or browse by category.
            </p>
            <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
              {PRIMARY_CATEGORIES.slice(0, 8).map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="inline-flex items-center rounded-full border border-border bg-white px-3 py-1.5 text-sm font-medium text-dark hover:border-primary hover:text-primary transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm text-mid mb-4">
              {total} {total === 1 ? "business" : "businesses"} found
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {businesses.map((b) => (
                <ListingCard key={b.id} business={b} />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath="/search"
              queryParams={{
                ...(q ? { q } : {}),
                ...(location ? { location } : {}),
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
