import Link from "next/link";
import { Building2, Phone, Globe, MapPin, Star, BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface ListingCardBusiness {
  id: string;
  name: string;
  slug: string;
  description?: string;
  phone?: string;
  website?: string;
  category?: string;
  category_slug?: string;
  suburb?: string;
  state?: string;
  postcode?: string;
  logo_url?: string;
  is_claimed?: boolean;
  avg_rating?: number;
  review_count?: number;
}

interface ListingCardProps {
  business: ListingCardBusiness;
  className?: string;
}

export function ListingCard({ business, className }: ListingCardProps) {
  const categoryLabel = business.category_slug
    ? business.category_slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
    : (business.category ?? "");

  const hasReviews = (business.avg_rating ?? 0) > 0 && (business.review_count ?? 0) > 0;

  return (
    <div className={cn("group bg-white border border-border rounded-2xl p-5 card-hover flex flex-col gap-3.5", className)}>
      <div className="flex items-start gap-3.5">
        <div className="w-14 h-14 rounded-xl bg-light-bg flex items-center justify-center text-primary shrink-0 overflow-hidden">
          {business.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={business.logo_url} alt={business.name} className="w-full h-full object-cover" />
          ) : (
            <Building2 className="w-7 h-7" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <Link
              href={`/business/${business.slug}`}
              className="font-heading font-semibold text-dark hover:text-cta transition-colors truncate text-lg leading-tight"
            >
              {business.name}
            </Link>
            {business.is_claimed && <BadgeCheck className="w-4 h-4 text-success shrink-0" />}
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            {categoryLabel && (
              <span className="inline-block text-xs font-medium text-primary bg-light-bg rounded-full px-2.5 py-0.5">
                {categoryLabel}
              </span>
            )}
            {hasReviews && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-dark">
                <Star className="w-3.5 h-3.5 text-gold fill-gold" />
                {business.avg_rating!.toFixed(1)}
                <span className="text-mid">({business.review_count})</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {(business.suburb || business.state) && (
        <div className="flex items-center gap-1.5 text-sm text-mid">
          <MapPin className="w-3.5 h-3.5 shrink-0 text-cta" />
          <span>
            {business.suburb}
            {business.suburb && business.state ? ", " : ""}
            {business.state}
            {business.postcode ? ` ${business.postcode}` : ""}
          </span>
        </div>
      )}

      {business.description && (
        <p className="text-sm text-mid line-clamp-2 leading-relaxed">{business.description}</p>
      )}

      <div className="flex items-center gap-4 mt-auto pt-3 border-t border-border">
        {business.phone && (
          <a href={`tel:${business.phone}`} className="flex items-center gap-1.5 text-sm font-medium text-dark hover:text-cta transition-colors">
            <Phone className="w-4 h-4" /> Call
          </a>
        )}
        {business.website && (
          <a href={business.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm font-medium text-dark hover:text-cta transition-colors">
            <Globe className="w-4 h-4" /> Website
          </a>
        )}
        <Link
          href={`/business/${business.slug}`}
          className="flex items-center gap-1 text-sm font-semibold text-cta hover:text-cta-dark transition-colors ml-auto"
        >
          View details
        </Link>
      </div>
    </div>
  );
}
