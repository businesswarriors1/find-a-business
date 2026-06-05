import Link from "next/link";
import { ChevronRight, MapPin, Search } from "lucide-react";
import { ListingCard } from "@/components/listing-card";
import { SearchBar } from "@/components/search-bar";
import { STATES, PRIMARY_CATEGORIES, SITE_NAME } from "@/lib/constants";
import { getBusinesses, getRecentBusinesses } from "@/lib/supabase/server";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const stateInfo = STATES.find((s) => s.slug === slug);
  const name = stateInfo?.name ?? slug.toUpperCase();
  return {
    title: `Find Businesses in ${name} | ${SITE_NAME}`,
    description: `Discover local businesses across ${name}. Search by category, suburb, or keyword — free Australian business directory.`,
  };
}

export default async function StatePage({ params }: Props) {
  const { slug } = await params;
  const stateInfo = STATES.find((s) => s.slug === slug);
  const stateName = stateInfo?.name ?? slug.toUpperCase();
  const stateAbbr = stateInfo?.abbreviation ?? slug.toUpperCase();

  // Popular suburbs — static for now, will be dynamic when DB is populated
  const popularSuburbs = (await import("@/lib/constants")).AUSTRALIAN_CITIES_SUBURBS[
    slug
  ] ?? [];

  const recent = await getRecentBusinesses(6);
  const { data: topBusinesses } = await getBusinesses({
    state: stateAbbr,
    page: 1,
    pageSize: 6,
  });

  return (
    <div>
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <nav className="flex items-center gap-1.5 text-sm text-mid">
          <Link href="/" className="hover:text-dark transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-dark font-medium">{stateName}</span>
        </nav>
      </div>

      {/* Header */}
      <section className="bg-light-bg py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold font-heading text-dark mb-3">
            Find Businesses in {stateName}
          </h1>
          <p className="text-mid max-w-3xl">
            Browse trusted local businesses across {stateName}. Search by
            category, suburb, or keyword — all listings are free to access.
          </p>
          <div className="mt-6">
            <SearchBar compact prefillLocation={stateName} />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Categories in State */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold font-heading text-dark mb-4">
            Top Categories in {stateName}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {PRIMARY_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/state/${slug}/${cat.slug}`}
                className="flex flex-col items-center gap-2 p-4 bg-white border border-border rounded-lg card-hover text-center"
              >
                <span className="text-sm font-medium text-dark">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Popular Suburbs */}
        {popularSuburbs.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold font-heading text-dark mb-4">
              Popular Suburbs
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {popularSuburbs.map((sub) => (
                <Link
                  key={sub}
                  href={`/state/${slug}/${sub.toLowerCase().replace(/\s+/g, "-")}`}
                  className="flex items-center gap-2 p-3 bg-white border border-border rounded-lg card-hover"
                >
                  <MapPin className="w-4 h-4 text-mid shrink-0" />
                  <span className="text-sm font-medium text-dark">{sub}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* All businesses in state */}
        {topBusinesses.length > 0 ? (
          <section className="mb-10">
            <h2 className="text-2xl font-bold font-heading text-dark mb-4">
              Businesses in {stateName}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topBusinesses.map((b) => (
                <ListingCard key={b.id} business={b} />
              ))}
            </div>
            <div className="text-center mt-6">
              <Link
                href={`/state/${slug}?page=1`}
                className="inline-flex items-center gap-2 text-primary font-medium hover:text-primary-dark transition-colors"
              >
                View all businesses <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        ) : recent.length > 0 ? (
          <section className="mb-10">
            <h2 className="text-2xl font-bold font-heading text-dark mb-4">
              Recently Added
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recent.map((b) => (
                <ListingCard key={b.id} business={b} />
              ))}
            </div>
          </section>
        ) : null}

        {/* Get Listed CTA */}
        <div className="mt-12 text-center p-8 bg-primary/5 rounded-lg border border-primary/20">
          <p className="text-lg font-semibold text-dark mb-3">
            Do you run a business in {stateName}?
          </p>
          <Link
            href="/get-listed"
            className="inline-flex items-center gap-2 bg-cta text-white font-semibold rounded-lg px-6 py-3 hover:bg-cta-dark transition-colors"
          >
            Get Listed Free <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* JSON-LD Breadcrumb */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://findabusiness.com.au",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: stateName,
                item: `https://findabusiness.com.au/state/${slug}`,
              },
            ],
          }),
        }}
      />
    </div>
  );
}
