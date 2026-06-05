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
    <div className={cn("bg-white border border-border rounded-lg p-5 card-hover flex flex-col gap-3", className)}>
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 overflow-hidden">
          {business.logo_url ? (
            <img src={business.logo_url} alt={business.name} className="w-full h-full object-cover" />
          ) : (
            <Building2 className="w-6 h-6" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/business/${business.slug}`}
              className="font-semibold text-dark hover:text-primary transition-colors truncate font-heading text-base"
            >
              {business.name}
            </Link>
            {business.is_claimed && <BadgeCheck className="w-4 h-4 text-primary shrink-0" />}
          </div>
          {categoryLabel && (
            <span className="inline-block mt-1 text-xs font-medium text-primary bg-primary/10 rounded-full px-2 py-0.5">
              {categoryLabel}
            </span>
          )}
        </div>
      </div>

      {(business.suburb || business.state) && (
        <div className="flex items-center gap-1 text-sm text-mid">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span>
            {business.suburb}
            {business.suburb && business.state ? ", " : ""}
            {business.state}
            {business.postcode ? ` ${business.postcode}` : ""}
          </span>
        </div>
      )}

      {business.description && (
        <p className="text-sm text-mid line-clamp-2">{business.description}</p>
      )}

      {hasReviews && (
        <div className="flex items-center gap-1 text-sm">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="font-semibold text-dark">{business.avg_rating!.toFixed(1)}</span>
          <span className="text-mid">({business.review_count})</span>
        </div>
      )}

      <div className="flex items-center gap-3 mt-auto pt-2 border-t border-border">
        {business.phone && (
          <a href={`tel:${business.phone}`} className="flex items-center gap-1 text-sm font-medium text-primary hover:opacity-80 transition-opacity">
            <Phone className="w-3.5 h-3.5" /> Call
          </a>
        )}
        {business.website && (
          <a href={business.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm font-medium text-primary hover:opacity-80 transition-opacity">
            <Globe className="w-3.5 h-3.5" /> Website
          </a>
        )}
        <Link href={`/business/${business.slug}`} className="flex items-center gap-1 text-sm font-medium text-primary hover:opacity-80 transition-opacity ml-auto">
          Details
        </Link>
      </div>
    </div>
  );
}
