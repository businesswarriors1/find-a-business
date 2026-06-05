import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  BadgeCheck,
  Phone,
  Globe,
  MapPin,
  Star,
  Building2,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { getBusinessBySlug, getBusinesses, getBusinessReviews, getReviewStats } from "@/lib/supabase/server";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);
  if (!business) return { title: `Not Found | ${SITE_NAME}` };

  return {
    title: `${business.name} — ${business.suburb}, ${business.state} | ${SITE_NAME}`,
    description: business.description?.slice(0, 160) ?? `${business.name} in ${business.suburb}, ${business.state}. Contact details, reviews, and more.`,
    openGraph: {
      title: business.name,
      description: business.description?.slice(0, 160) ?? "",
      url: `${SITE_URL}/business/${slug}`,
      type: "website",
    },
  };
}

export default async function BusinessPage({ params }: Props) {
  const { slug } = await params;

  const business = await getBusinessBySlug(slug);
  if (!business) notFound();

  const reviews = await getBusinessReviews(business.id);
  const stats = await getReviewStats(business.id);

  // Fetch related businesses
  const { data: related } = await getBusinesses({
    category: business.category_slug,
    state: business.state,
    page: 1,
    pageSize: 4,
    sort: "created_at",
  });
  const relatedBusinesses = related.filter((r: any) => r.id !== business.id).slice(0, 3);

  const categoryName = business.category_slug
    ? business.category_slug.split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
    : "";

  return (
    <div>
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <nav className="flex items-center gap-1.5 text-sm text-mid flex-wrap">
          <Link href="/" className="hover:text-dark transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href={`/state/${business.state?.toLowerCase()}`} className="hover:text-dark transition-colors">
            {business.state}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-dark font-medium">{business.suburb}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div className="bg-white border border-border rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  {business.logo_url ? (
                    <img src={business.logo_url} alt={business.name} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <Building2 className="w-8 h-8" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl font-bold font-heading text-dark">
                      {business.name}
                    </h1>
                    {business.is_claimed && (
                      <BadgeCheck className="w-5 h-5 text-primary shrink-0" />
                    )}
                  </div>
                  {categoryName && (
                    <span className="inline-block mt-1 text-sm font-medium text-primary bg-primary/10 rounded-full px-3 py-0.5">
                      {categoryName}
                    </span>
                  )}
                  <div className="flex items-center gap-1 mt-2 text-sm text-mid">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span>{business.suburb}, {business.state} {business.postcode}</span>
                  </div>
                </div>
              </div>

              {/* Contact actions */}
              <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-border">
                {business.phone && (
                  <a
                    href={`tel:${business.phone}`}
                    className="inline-flex items-center gap-2 bg-primary text-white font-medium rounded-lg px-4 py-2.5 hover:opacity-90 transition-opacity"
                  >
                    <Phone className="w-4 h-4" /> {business.phone}
                  </a>
                )}
                {business.website && (
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-primary text-primary font-medium rounded-lg px-4 py-2.5 hover:bg-primary/5 transition-colors"
                  >
                    <Globe className="w-4 h-4" /> Visit Website
                  </a>
                )}
                {business.address && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-border text-dark font-medium rounded-lg px-4 py-2.5 hover:bg-light-bg transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" /> Get Directions
                  </a>
                )}
              </div>
            </div>

            {/* About */}
            {business.description && (
              <div className="bg-white border border-border rounded-lg p-6">
                <h2 className="text-xl font-bold font-heading text-dark mb-3">About</h2>
                <p className="text-mid leading-relaxed">{business.description}</p>
              </div>
            )}

            {/* Map placeholder */}
            {business.address && (
              <div className="bg-white border border-border rounded-lg p-6">
                <h2 className="text-xl font-bold font-heading text-dark mb-3">Location</h2>
                <div className="aspect-video bg-light-bg rounded-lg flex items-center justify-center border border-border">
                  <div className="text-center text-mid">
                    <MapPin className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm font-medium">{business.address}</p>
                    <p className="text-sm">{business.suburb}, {business.state} {business.postcode}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="bg-white border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-bold font-heading text-dark">Reviews</h2>
                {stats.count > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold text-dark">{stats.average}</span>
                    <span className="text-mid text-sm">({stats.count} {stats.count === 1 ? "review" : "reviews"})</span>
                  </div>
                )}
              </div>

              {reviews.length === 0 ? (
                <p className="text-mid text-sm">No reviews yet. Be the first to review!</p>
              ) : (
                <div className="space-y-4">
                  {reviews.slice(0, 5).map((r: any) => (
                    <div key={r.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-dark text-sm font-heading">{r.reviewer_name}</span>
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${i < r.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`}
                            />
                          ))}
                        </div>
                      </div>
                      {r.content && <p className="text-mid text-sm">{r.content}</p>}
                    </div>
                  ))}
                </div>
              )}

              {/* Leave a review form */}
              <div className="mt-6 pt-4 border-t border-border">
                <h3 className="font-semibold text-dark mb-3 font-heading">Leave a Review</h3>
                <form className="space-y-3" action="/api/reviews" method="POST">
                  <input type="hidden" name="business_id" value={business.id} />
                  <input
                    type="text"
                    name="reviewer_name"
                    placeholder="Your name"
                    className="w-full border border-border rounded-md px-4 py-2.5 text-sm min-h-[44px]"
                    required
                  />
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-mid mr-2">Rating:</span>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <label key={n} className="cursor-pointer">
                        <input type="radio" name="rating" value={n} className="sr-only peer" />
                        <Star className="w-5 h-5 text-gray-200 peer-checked:text-yellow-400 peer-checked:fill-yellow-400" />
                      </label>
                    ))}
                  </div>
                  <textarea
                    name="content"
                    placeholder="Write your review..."
                    rows={3}
                    className="w-full border border-border rounded-md px-4 py-2.5 text-sm min-h-[80px]"
                    required
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 bg-cta text-white font-semibold rounded-lg px-6 py-2.5 hover:opacity-90 transition-opacity"
                  >
                    <MessageSquare className="w-4 h-4" /> Submit Review
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {!business.is_claimed && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-5 text-center">
                <h3 className="font-semibold text-dark mb-2 font-heading">Is this your business?</h3>
                <p className="text-sm text-mid mb-4">Claim your free listing to add more details and manage your information.</p>
                <Link
                  href="/get-listed"
                  className="inline-flex items-center gap-2 bg-primary text-white font-semibold rounded-lg px-4 py-2.5 hover:opacity-90 transition-opacity w-full justify-center"
                >
                  Chat to Claim
                </Link>
              </div>
            )}

            <div className="bg-cta/5 border border-cta/20 rounded-lg p-5 text-center">
              <h3 className="font-semibold text-dark mb-2 font-heading">Not listed?</h3>
              <p className="text-sm text-mid mb-4">Add your business to findabusiness.com.au — it&apos;s completely free.</p>
              <Link
                href="/get-listed"
                className="inline-flex items-center gap-2 bg-cta text-white font-semibold rounded-lg px-4 py-2.5 hover:opacity-90 transition-opacity w-full justify-center"
              >
                Get Listed Free
              </Link>
            </div>
          </div>
        </div>

        {/* Related businesses */}
        {relatedBusinesses.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold font-heading text-dark mb-4">
              More in {categoryName} near {business.suburb}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedBusinesses.map((b: any) => (
                <Link
                  key={b.id}
                  href={`/business/${b.slug}`}
                  className="bg-white border border-border rounded-lg p-4 card-hover"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-dark text-sm truncate font-heading">{b.name}</p>
                      <p className="text-xs text-mid">{b.suburb}, {b.state}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: business.name,
              description: business.description ?? "",
              telephone: business.phone ?? "",
              address: {
                "@type": "PostalAddress",
                streetAddress: business.address ?? "",
                addressLocality: business.suburb ?? "",
                addressRegion: business.state ?? "",
                postalCode: business.postcode ?? "",
                addressCountry: "AU",
              },
              aggregateRating: stats.count > 0 ? {
                "@type": "AggregateRating",
                ratingValue: stats.average,
                reviewCount: stats.count,
              } : undefined,
            }),
          }}
        />
      </div>
    </div>
  );
}
