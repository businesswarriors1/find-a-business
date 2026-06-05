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
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  HeartHandshake,
  MapPinned,
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

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Wrench, Smile, Calculator, Zap, Sparkles, HardHat, Scale, Stethoscope, Home,
  Car, Coffee, UtensilsCrossed, Scissors, Paintbrush, Flower2, Truck, Camera,
  PawPrint, Monitor, Baby, MessageCircle, ClipboardList, Search,
};

const HOW_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  MessageCircle, ClipboardList, Search,
};

const TRUST = [
  { icon: HeartHandshake, title: "Free, forever", body: "A basic listing costs nothing — no card, no catch, no subscription traps." },
  { icon: ShieldCheck, title: "Verified by humans", body: "Every business is reviewed by our team before it goes live, so the directory stays trustworthy." },
  { icon: MapPinned, title: "Every suburb", body: "From Bondi to Broome — find and list businesses across all eight states and territories." },
];

export default async function HomePage() {
  const recent = await getRecentBusinesses(6);

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="surface-ink text-paper overflow-hidden">
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <p className="animate-rise inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-gold mb-7">
            Australia&apos;s free business directory
          </p>
          <h1 className="animate-rise font-heading text-4xl sm:text-6xl lg:text-7xl font-black leading-[1.02] tracking-tight">
            Find any business,
            <br className="hidden sm:block" />{" "}
            <span className="italic font-light text-gold">anywhere</span> in Australia
          </h1>
          <p className="animate-rise mt-6 text-lg sm:text-xl text-paper/70 max-w-2xl mx-auto leading-relaxed">
            From plumbers to paediatricians — discover trusted local businesses
            in every state and suburb, all in one place.
          </p>

          <div className="animate-rise mt-10">
            <SearchBar />
          </div>

          {/* Popular pills */}
          <div className="animate-rise mt-7 flex flex-wrap justify-center items-center gap-2">
            <span className="text-sm text-paper/50 mr-1">Popular:</span>
            {POPULAR_CATEGORIES.map((cat) => {
              const IconCmp = ICON_MAP[cat.icon];
              return (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-1.5 text-sm font-medium text-paper/85 hover:border-gold hover:text-gold transition-colors"
                >
                  {IconCmp && <IconCmp className="w-3.5 h-3.5" />}
                  {cat.name}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== TRUST BAND ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TRUST.map((t) => (
            <div key={t.title} className="bg-white border border-border rounded-2xl p-6 card-hover">
              <div className="w-11 h-11 rounded-xl bg-cta/10 flex items-center justify-center text-cta mb-4">
                <t.icon className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-dark mb-1.5">{t.title}</h3>
              <p className="text-sm text-mid leading-relaxed">{t.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== BROWSE BY CATEGORY ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cta mb-2">Browse</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-dark">By category</h2>
          </div>
          <Link href="/search" className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-dark hover:text-cta transition-colors">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {PRIMARY_CATEGORIES.map((cat) => {
            const IconCmp = ICON_MAP[cat.icon];
            return (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="group flex flex-col items-center gap-3 p-5 bg-white border border-border rounded-2xl card-hover text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-light-bg flex items-center justify-center text-primary group-hover:bg-cta group-hover:text-white transition-colors">
                  {IconCmp ? <IconCmp className="w-6 h-6" /> : <Search className="w-6 h-6" />}
                </div>
                <span className="text-sm font-medium text-dark">{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ===== BROWSE BY STATE ===== */}
      <section className="bg-light-bg/60 border-y border-border py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cta mb-2">Browse</p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-dark mb-8">By state &amp; territory</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {STATES.map((state) => (
              <Link
                key={state.slug}
                href={`/state/${state.slug}`}
                className="group flex items-center gap-3 p-5 bg-white border border-border rounded-2xl card-hover"
              >
                <span className="font-heading font-semibold text-dark group-hover:text-cta transition-colors">
                  {state.name}
                </span>
                <span className="ml-auto text-xs font-semibold text-mid bg-light-bg rounded-full px-2.5 py-1">
                  {state.abbreviation}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== RECENTLY ADDED ===== */}
      {recent.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-dark mb-8">Recently added</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recent.map((b) => (
              <Link
                key={b.id}
                href={`/business/${b.slug}`}
                className="flex items-center gap-4 p-5 bg-white border border-border rounded-2xl card-hover"
              >
                <div className="w-12 h-12 rounded-xl bg-light-bg flex items-center justify-center text-primary shrink-0">
                  <Home className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <p className="font-heading font-semibold text-dark truncate">{b.name}</p>
                  <p className="text-sm text-mid">{b.suburb}, {b.state}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ===== HOW IT WORKS ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cta mb-2">For business owners</p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-dark">How it works</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {HOW_IT_WORKS_STEPS.map((step, idx) => {
            const IconCmp = HOW_ICON_MAP[step.icon];
            return (
              <div key={idx} className="relative text-center">
                <div className="font-heading text-6xl font-black text-light-bg absolute -top-4 left-1/2 -translate-x-1/2 select-none">
                  {idx + 1}
                </div>
                <div className="relative w-16 h-16 rounded-2xl bg-primary text-paper flex items-center justify-center mx-auto mb-5">
                  {IconCmp ? <IconCmp className="w-8 h-8" /> : <Search className="w-8 h-8" />}
                </div>
                <h3 className="font-heading text-xl font-semibold text-dark mb-2">{step.title}</h3>
                <p className="text-sm text-mid max-w-xs mx-auto leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== GET LISTED CTA ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <div className="surface-ink rounded-3xl px-6 sm:px-12 py-14 text-center overflow-hidden">
          <div className="relative z-10">
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-paper mb-4">
              Get found — for <span className="italic text-gold">free</span>.
            </h2>
            <p className="text-paper/70 mb-8 max-w-xl mx-auto text-lg">
              Join the businesses already listed on {SITE_NAME}. Two-minute chat,
              live within 24 hours, no credit card.
            </p>
            <Link
              href="/get-listed"
              className="inline-flex items-center gap-2 bg-cta text-white font-semibold rounded-full px-8 py-4 hover:bg-cta-dark transition-colors text-lg"
            >
              List your business <ArrowUpRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
