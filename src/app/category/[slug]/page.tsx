import Link from "next/link";
import { ChevronRight, Search, Filter } from "lucide-react";
import { SearchBar } from "@/components/search-bar";
import { ListingCard } from "@/components/listing-card";
import { Pagination } from "@/components/pagination";
import { SortSelect } from "@/components/sort-select";
import { PRIMARY_CATEGORIES, ITEMS_PER_PAGE, SITE_NAME } from "@/lib/constants";
import { getCategoryBySlug, getSubcategories, getBusinesses } from "@/lib/supabase/server";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; state?: string; sort?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = PRIMARY_CATEGORIES.find((c) => c.slug === slug);
  const name = category?.name ?? slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  return {
    title: `${name} in Australia | ${SITE_NAME}`,
    description: `Find ${name.toLowerCase()} across Australia. Browse verified ${name.toLowerCase()}, compare reviews, and contact local businesses — all for free.`,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page, state, sort } = await searchParams;

  const currentPage = page ? parseInt(page, 10) : 1;
  const categoryName = PRIMARY_CATEGORIES.find((c) => c.slug === slug)?.name ??
    slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  const dbCategory = await getCategoryBySlug(slug);
  const subcategories = await getSubcategories(slug);
  const { data: businesses, total } = await getBusinesses({
    category: slug,
    state: state ?? undefined,
    page: currentPage,
    pageSize: ITEMS_PER_PAGE,
    sort: sort ?? "name",
  });

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div>
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <nav className="flex items-center gap-1.5 text-sm text-mid">
          <Link href="/" className="hover:text-dark transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-dark font-medium">{categoryName}</span>
        </nav>
      </div>

      {/* Header */}
      <section className="bg-light-bg py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold font-heading text-dark mb-3">
            {categoryName} in Australia
          </h1>
          <p className="text-mid max-w-3xl">
            {dbCategory?.description ??
              `Find ${categoryName.toLowerCase()} across Australia. Browse our directory of trusted ${categoryName.toLowerCase()} — compare ratings, read reviews, and get in touch directly. Whether you need a local expert or a specialised service, findabusiness.com.au makes it easy to discover the right ${categoryName.toLowerCase()} for your needs.`}
          </p>
          <div className="mt-6">
            <SearchBar compact />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Subcategory filter pills */}
        {subcategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <Link
              href={`/category/${slug}`}
              className="inline-flex items-center gap-1 rounded-full bg-primary text-white px-3 py-1.5 text-sm font-medium"
            >
              All
            </Link>
            {subcategories.map((sub) => (
              <Link
                key={sub.slug}
                href={`/category/${slug}?sub=${sub.slug}`}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-3 py-1.5 text-sm font-medium text-dark hover:border-primary hover:text-primary transition-colors"
              >
                {sub.name}
                <span className="text-xs text-mid">({sub.listing_count})</span>
              </Link>
            ))}
          </div>
        )}

        {/* State filter tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="text-sm font-medium text-mid self-center mr-1">
            <Filter className="w-4 h-4 inline mr-1" /> Filter by state:
          </span>
          <Link
            href={`/category/${slug}`}
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              !state ? "bg-primary text-white" : "bg-white border border-border text-dark hover:border-primary hover:text-primary"
            }`}
          >
            All
          </Link>
          {["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"].map((st) => (
            <Link
              key={st}
              href={`/category/${slug}?state=${st}`}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                state === st ? "bg-primary text-white" : "bg-white border border-border text-dark hover:border-primary hover:text-primary"
              }`}
            >
              {st}
            </Link>
          ))}
        </div>

        {/* Results */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-mid">
            {total} {categoryName.toLowerCase()} found
          </p>
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm text-mid">Sort:</label>
            <SortSelect defaultValue={sort ?? "name"} category={slug} />
          </div>
        </div>

        {businesses.length === 0 ? (
          <div className="text-center py-16 bg-light-bg rounded-lg border border-border">
            <Search className="w-12 h-12 text-mid mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-dark mb-2">
              No {categoryName.toLowerCase()} found yet
            </h3>
            <p className="text-mid mb-6">
              Be the first! List your {categoryName.toLowerCase()} business for free.
            </p>
            <Link
              href="/get-listed"
              className="inline-flex items-center gap-2 bg-cta text-white font-semibold rounded-lg px-6 py-3 hover:bg-cta-dark transition-colors"
            >
              Get Listed Free
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {businesses.map((b) => (
                <ListingCard key={b.id} business={b} />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath={`/category/${slug}`}
              queryParams={{ ...(state ? { state } : {}), ...(sort ? { sort } : {}) }}
            />
          </>
        )}

        {/* Bottom CTA */}
        <div className="mt-12 text-center p-8 bg-primary/5 rounded-lg border border-primary/20">
          <p className="text-lg font-semibold text-dark mb-3">
            Is your {categoryName.toLowerCase()} business listed?
          </p>
          <Link
            href="/get-listed"
            className="inline-flex items-center gap-2 bg-cta text-white font-semibold rounded-lg px-6 py-3 hover:bg-cta-dark transition-colors"
          >
            Get Listed Free <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: businesses.map((b, idx) => ({
              "@type": "ListItem",
              position: idx + 1,
              item: {
                "@type": "LocalBusiness",
                name: b.name,
                address: {
                  "@type": "PostalAddress",
                  addressLocality: b.suburb,
                  addressRegion: b.state,
                  postalCode: b.postcode,
                },
              },
            })),
          }),
        }}
      />
    </div>
  );
}
