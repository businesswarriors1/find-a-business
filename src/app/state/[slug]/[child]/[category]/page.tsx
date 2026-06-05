import Link from "next/link";
import { ChevronRight, MapPin, Search } from "lucide-react";
import { ListingCard } from "@/components/listing-card";
import { Pagination } from "@/components/pagination";
import { STATES, PRIMARY_CATEGORIES, ITEMS_PER_PAGE, SITE_NAME, SITE_URL } from "@/lib/constants";
import { getBusinesses, getNearbySuburbs, getCategoriesInSuburb } from "@/lib/supabase/server";
import { jsonLd } from "@/lib/utils";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string; child: string; category: string }>;
  searchParams: Promise<{ page?: string; sort?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, child, category } = await params;
  const stateInfo = STATES.find((s) => s.slug === slug);
  const state = stateInfo?.name ?? slug.toUpperCase();
  const suburbName = child.replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase());
  const catName = PRIMARY_CATEGORIES.find((c) => c.slug === category)?.name ??
    category.replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase());

  return {
    title: `${catName} in ${suburbName}, ${state} | ${SITE_NAME}`,
    description: `Looking for ${catName.toLowerCase()} in ${suburbName}, ${state}? Browse ${catName.toLowerCase()} near you — contact details, reviews, and more.`,
    alternates: { canonical: `${SITE_URL}/state/${slug}/${child}/${category}` },
  };
}

export default async function MoneyPage({ params, searchParams }: Props) {
  const { slug, child, category } = await params;
  const { page, sort } = await searchParams;

  const currentPage = page ? parseInt(page, 10) : 1;
  const stateInfo = STATES.find((s) => s.slug === slug);
  const stateName = stateInfo?.name ?? slug.toUpperCase();
  const stateAbbr = stateInfo?.abbreviation ?? slug.toUpperCase();
  const suburbName = child.replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase());
  const catName = PRIMARY_CATEGORIES.find((c) => c.slug === category)?.name ??
    category.replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase());

  const { data: businesses, total } = await getBusinesses({
    category,
    state: stateAbbr,
    suburb: suburbName,
    page: currentPage,
    pageSize: ITEMS_PER_PAGE,
    sort: sort ?? "name",
  });
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const [nearbySuburbs, relatedCategories] = await Promise.all([
    getNearbySuburbs(stateAbbr, child, 6),
    getCategoriesInSuburb(suburbName, stateAbbr),
  ]);
  const otherCategories = relatedCategories.filter((c: any) => c.slug !== category).slice(0, 6);

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <nav className="flex items-center gap-1.5 text-sm text-mid flex-wrap">
          <Link href="/" className="hover:text-dark">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href={`/state/${slug}`} className="hover:text-dark">{stateName}</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href={`/state/${slug}/${child}`} className="hover:text-dark">{suburbName}</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-dark font-medium">{catName}</span>
        </nav>
      </div>

      <section className="bg-light-bg py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold font-heading text-dark mb-3">
            {catName} in {suburbName}, {stateName}
          </h1>
          <p className="text-mid max-w-3xl">
            Looking for {catName.toLowerCase()} in {suburbName}? Browse {total} {catName.toLowerCase()}{total === 1 ? "" : "s"} serving {suburbName} and surrounding areas. Compare contact details, read reviews, and connect directly.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-mid">{total} {catName.toLowerCase()}{total === 1 ? "" : "s"} found</p>
        </div>

        {businesses.length === 0 ? (
          <div className="text-center py-16 bg-light-bg rounded-lg border border-border">
            <Search className="w-12 h-12 text-mid mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-dark mb-2">
              No {catName.toLowerCase()} listed in {suburbName} yet
            </h3>
            <p className="text-mid mb-6">Be the first! List your {catName.toLowerCase()} business for free.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href={`/state/${slug}/${child}`} className="inline-flex items-center gap-2 border border-primary text-primary font-semibold rounded-lg px-6 py-3 hover:bg-primary/5 transition-colors">
                Browse {suburbName}
              </Link>
              <Link href={`/category/${category}`} className="inline-flex items-center gap-2 border border-primary text-primary font-semibold rounded-lg px-6 py-3 hover:bg-primary/5 transition-colors">
                Browse {catName}
              </Link>
              <Link href="/get-listed" className="inline-flex items-center gap-2 bg-cta text-white font-semibold rounded-lg px-6 py-3 hover:bg-cta-dark transition-colors">
                Get Listed Free
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {businesses.map((b: any) => (
                <ListingCard key={b.id} business={b} />
              ))}
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} basePath={`/state/${slug}/${child}/${category}`} />
          </>
        )}

        {/* Nearby suburbs + related categories */}
        {(nearbySuburbs.length > 0 || otherCategories.length > 0) && (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-light-bg rounded-lg p-5 border border-border">
              <h3 className="font-semibold text-dark mb-3 font-heading">
                <MapPin className="w-4 h-4 inline mr-1" /> {catName} Nearby
              </h3>
              {nearbySuburbs.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {nearbySuburbs.map((sub: any) => (
                    <Link
                      key={sub.id}
                      href={`/state/${slug}/${sub.slug}/${category}`}
                      className="inline-flex items-center rounded-full border border-border bg-white px-3 py-1.5 text-sm font-medium text-dark hover:border-primary hover:text-primary transition-colors"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-mid">No nearby suburbs listed yet.</p>
              )}
            </div>
            <div className="bg-light-bg rounded-lg p-5 border border-border">
              <h3 className="font-semibold text-dark mb-3 font-heading">Other Categories in {suburbName}</h3>
              {otherCategories.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {otherCategories.map((cat: any) => (
                    <Link
                      key={cat.slug}
                      href={`/state/${slug}/${child}/${cat.slug}`}
                      className="inline-flex items-center rounded-full border border-border bg-white px-3 py-1.5 text-sm font-medium text-dark hover:border-primary hover:text-primary transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-mid">No other categories listed here yet.</p>
              )}
            </div>
          </div>
        )}

        <div className="mt-8 text-center p-8 bg-primary/5 rounded-lg border border-primary/20">
          <p className="text-lg font-semibold text-dark mb-3">
            Is your {catName.toLowerCase()} business in {suburbName}?
          </p>
          <Link href="/get-listed" className="inline-flex items-center gap-2 bg-cta text-white font-semibold rounded-lg px-6 py-3 hover:bg-cta-dark transition-colors">
            Get Listed Free <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* JSON-LD: ItemList */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({
        "@context": "https://schema.org",
        "@type": "ItemList",
        itemListElement: businesses.map((b: any, idx: number) => ({
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
      }) }} />

      {/* JSON-LD: BreadcrumbList */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: stateName, item: `${SITE_URL}/state/${slug}` },
          { "@type": "ListItem", position: 3, name: suburbName, item: `${SITE_URL}/state/${slug}/${child}` },
          { "@type": "ListItem", position: 4, name: catName, item: `${SITE_URL}/state/${slug}/${child}/${category}` },
        ],
      }) }} />
    </div>
  );
}
