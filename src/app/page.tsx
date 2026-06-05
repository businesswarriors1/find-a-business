import Link from "next/link";
import {
  Wrench,
  Smile,
  Calculator,
  Zap,
  Sparkles,
  HardHat,
  Scale,
  Stethoscope,
  Home,
  Car,
  Coffee,
  UtensilsCrossed,
  Scissors,
  Paintbrush,
  Flower2,
  Truck,
  Camera,
  PawPrint,
  Monitor,
  Baby,
  MessageCircle,
  ClipboardList,
  Search,
  ChevronRight,
  MapPin,
} from "lucide-react";
import { SearchBar } from "@/components/search-bar";
import {
  PRIMARY_CATEGORIES,
  POPULAR_CATEGORIES,
  STATES,
  HOW_IT_WORKS_STEPS,
  SITE_NAME,
} from "@/lib/constants";
import { getRecentBusinesses } from "@/lib/supabase/server";

// Map icon names to actual Lucide components
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Wrench,
  Smile,
  Calculator,
  Zap,
  Sparkles,
  HardHat,
  Scale,
  Stethoscope,
  Home,
  Car,
  Coffee,
  UtensilsCrossed,
  Scissors,
  Paintbrush,
  Flower2,
  Truck,
  Camera,
  PawPrint,
  Monitor,
  Baby,
  MessageCircle,
  ClipboardList,
  Search,
  MapPin,
};

const HOW_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  MessageCircle,
  ClipboardList,
  Search,
};

export default async function HomePage() {
  const recent = await getRecentBusinesses(6);

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="bg-gradient-to-b from-primary/5 via-white to-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading text-dark tracking-tight">
            Find Any Business,{" "}
            <span className="text-primary">Anywhere in Australia</span>
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-mid max-w-2xl mx-auto">
            Australia&apos;s free business directory. Discover trusted local
            businesses — from plumbers to accountants, in every state and
            suburb.
          </p>

          <div className="mt-8">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Popular category pills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 pb-8">
        <div className="flex flex-wrap justify-center gap-2">
          <span className="text-sm text-mid font-medium self-center mr-2">
            Popular:
          </span>
          {POPULAR_CATEGORIES.map((cat) => {
            const IconCmp = ICON_MAP[cat.icon];
            return (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-sm font-medium text-dark hover:border-primary hover:text-primary transition-colors"
              >
                {IconCmp && <IconCmp className="w-3.5 h-3.5" />}
                {cat.name}
              </Link>
            );
          })}
        </div>
      </section>

      {/* ===== BROWSE BY CATEGORY ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-dark">
            Browse by Category
          </h2>
          <Link
            href="/category"
            className="text-sm font-medium text-primary hover:text-primary-dark flex items-center gap-1"
          >
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {PRIMARY_CATEGORIES.map((cat) => {
            const IconCmp = ICON_MAP[cat.icon];
            return (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="flex flex-col items-center gap-2 p-4 bg-white border border-border rounded-lg card-hover text-center"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  {IconCmp ? <IconCmp className="w-5 h-5" /> : <Search className="w-5 h-5" />}
                </div>
                <span className="text-sm font-medium text-dark">{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ===== BROWSE BY STATE ===== */}
      <section className="bg-light-bg py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-dark mb-6">
            Browse by State
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {STATES.map((state) => (
              <Link
                key={state.slug}
                href={`/state/${state.slug}`}
                className="flex items-center gap-3 p-4 bg-white border border-border rounded-lg card-hover"
              >
                <span className="text-sm font-semibold text-dark">
                  {state.name}
                </span>
                <span className="text-xs text-mid bg-light-bg rounded-full px-2 py-0.5 ml-auto">
                  {state.abbreviation}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== RECENTLY ADDED ===== */}
      {recent.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-dark mb-6">
            Recently Added
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recent.map((b) => (
              <Link
                key={b.id}
                href={`/business/${b.slug}`}
                className="flex items-center gap-3 p-4 bg-white border border-border rounded-lg card-hover"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Home className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-dark truncate">
                    {b.name}
                  </p>
                  <p className="text-xs text-mid">
                    {b.suburb}, {b.state}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ===== HOW IT WORKS ===== */}
      <section className="bg-light-bg py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-dark text-center mb-10">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS_STEPS.map((step, idx) => {
              const IconCmp = HOW_ICON_MAP[step.icon];
              return (
                <div key={idx} className="text-center">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                    {IconCmp ? (
                      <IconCmp className="w-7 h-7" />
                    ) : (
                      <Search className="w-7 h-7" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold font-heading text-dark mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-mid max-w-xs mx-auto">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== GET LISTED CTA ===== */}
      <section className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white mb-3">
            Get your business found — it&apos;s completely free
          </h2>
          <p className="text-white/80 mb-6 max-w-xl mx-auto">
            Join thousands of Australian businesses already listed on{" "}
            {SITE_NAME}. No fees, no credit card required.
          </p>
          <Link
            href="/get-listed"
            className="inline-flex items-center gap-2 bg-cta text-white font-semibold rounded-lg px-8 py-3 hover:bg-cta-dark transition-colors text-lg"
          >
            Get Listed Free <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
