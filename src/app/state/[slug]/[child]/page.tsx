import Link from "next/link";
import { ChevronRight, MapPin, Search } from "lucide-react";
import { ListingCard } from "@/components/listing-card";
import { SearchBar } from "@/components/search-bar";
import { Pagination } from "@/components/pagination";
import { STATES, PRIMARY_CATEGORIES, ITEMS_PER_PAGE, SITE_NAME } from "@/lib/constants";
import { getBusinesses, getCategoriesInSuburb, getNearbySuburbs } from "@/lib/supabase/server";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string; child: string }>;
  searchParams: Promise<{ page?: string; sort?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, child } = await params;
  const stateInfo = STATES.find((s) => s.slug === slug);
  const state = stateInfo?.name ?? slug.toUpperCase();
  const childName = child.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  const isCategory = PRIMARY_CATEGORIES.some((c) => c.slug === child);

  if (isCategory) {
    const catName = PRIMARY_CATEGORIES.find((c) => c.slug === child)?.name ?? childName;
    return {
      title: `${catName} in ${state} | ${SITE_NAME}`,
      description: `Find ${catName.toLowerCase()} in ${state}. Browse trusted local businesses — contact details, reviews, and more.`,
    };
  }

  return {
    title: `Find Businesses in ${childName}, ${state} | ${SITE_NAME}`,
    description: `Discover local businesses in ${childName}, ${state}. Browse trusted businesses by category — all listings free to access.`,
  };
}

export default async function StateChildPage({ params, searchParams }: Props) {
  const { slug, child } = await params;
  const { page, sort } = await searchParams;

  const currentPage = page ? parseInt(page, 10) : 1;
  const stateInfo = STATES.find((s) => s.slug === slug);
  const stateName = stateInfo?.name ?? slug.toUpperCase();
  const stateAbbr = stateInfo?.abbreviation ?? slug.toUpperCase();
  const childName = child.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  const isCategory = PRIMARY_CATEGORIES.some((c) => c.slug === child);

  // --- CATEGORY MODE ---
  if (isCategory) {
    const catName = PRIMARY_CATEGORIES.find((c) => c.slug === child)?.name ?? childName;
    const { data: businesses, total } = await getBusinesses({
      category: child,
      state: stateAbbr,
      page: currentPage,
      pageSize: ITEMS_PER_PAGE,
      sort: sort ?? "name",
    });
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

    return (
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-1.5 text-sm text-mid flex-wrap">
            <Link href="/" className="hover:text-dark transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/state/${slug}`} className="hover:text-dark transition-colors">{stateName}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-dark font-medium">{catName}</span>
          </nav>
        </div>

        <section className="bg-light-bg py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl font-bold font-heading text-dark mb-3">
              {catName} in {stateName}
            </h1>
            <p className="text-mid max-w-3xl">
              Find {catName.toLowerCase()} across {stateName}. Browse our directory
              of trusted local {catName.toLowerCase()} — compare ratings and get in touch directly.
            </p>
            <div className="mt-6">
              <SearchBar compact prefillLocation={stateName} />
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-mid">{total} {catName.toLowerCase()} found</p>
          </div>

          {businesses.length === 0 ? (
            <div className="text-center py-16 bg-light-bg rounded-lg border border-border">
              <Search className="w-12 h-12 text-mid mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-dark mb-2">
                No {catName.toLowerCase()} found in {stateName}
              </h3>
              <p className="text-mid mb-6">Be the first — list your business for free.</p>
              <Link href="/get-listed" className="inline-flex items-center gap-2 bg-cta text-white font-semibold rounded-lg px-6 py-3 hover:bg-cta-dark transition-colors">
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
              <Pagination currentPage={currentPage} totalPages={totalPages} basePath={`/state/${slug}/${child}`} />
            </>
          )}
        </div>
      </div>
    );
  }

  // --- SUBURB MODE ---
  const { data: businesses, total } = await getBusinesses({
    state: stateAbbr,
    suburb: childName,
    page: currentPage,
    pageSize: ITEMS_PER_PAGE,
    sort: sort ?? "name",
  });
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const categoriesWithCounts = await getCategoriesInSuburb(childName, stateAbbr);
  const nearbySuburbs = await getNearbySuburbs(stateAbbr, child, 6);

  const postcode = businesses.find((b) => b.postcode)?.postcode ?? null;

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <nav className="flex items-center gap-1.5 text-sm text-mid flex-wrap">
          <Link href="/" className="hover:text-dark transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href={`/state/${slug}`} className="hover:text-dark transition-colors">{stateName}</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-dark font-medium">{childName}</span>
        </nav>
      </div>

      <section className="bg-light-bg py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl sm:text-4xl font-bold font-heading text-dark">
              Find Businesses in {childName}, {stateName}
            </h1>
            {postcode && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary text-sm font-medium px-3 py-1">
                <MapPin className="w-3.5 h-3.5" />
                {postcode}
              </span>
            )}
          </div>
          <p className="mt-3 text-mid max-w-3xl">
            Browse trusted local businesses in {childName}. Find contact details, reviews, and more.
          </p>
          <div className="mt-6">
            <SearchBar compact prefillLocation={`${childName}, ${stateAbbr}`} />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {categoriesWithCounts.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold font-heading text-dark mb-4">
              Categories in {childName}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {categoriesWithCounts.slice(0, 15).map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/state/${slug}/${child}/${cat.slug}`}
                  className="flex items-center justify-between p-3 bg-white border border-border rounded-lg card-hover"
                >
                  <span className="text-sm font-medium text-dark">{cat.name}</span>
                  <span className="text-xs text-mid">({cat.count})</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-xl font-bold font-heading text-dark mb-4">
            All Businesses in {childName}
          </h2>

          {businesses.length === 0 ? (
            <div className="text-center py-16 bg-light-bg rounded-lg border border-border">
              <Search className="w-12 h-12 text-mid mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-dark mb-2">
                No businesses found in {childName}
              </h3>
              <p className="text-mid mb-6">Be the first! List your business in {childName} for free.</p>
              <Link href="/get-listed" className="inline-flex items-center gap-2 bg-cta text-white font-semibold rounded-lg px-6 py-3 hover:bg-cta-dark transition-colors">
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
              <Pagination currentPage={currentPage} totalPages={totalPages} basePath={`/state/${slug}/${child}`} />
            </>
          )}
        </section>

        {nearbySuburbs.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold font-heading text-dark mb-4">Nearby Suburbs</h2>
            <div className="flex flex-wrap gap-2">
              {nearbySuburbs.map((sub: any) => (
                <Link
                  key={sub.id}
                  href={`/state/${slug}/${sub.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-medium text-dark hover:border-primary hover:text-primary transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  {sub.name}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
