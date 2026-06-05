import Link from "next/link";
import { ChevronRight, Search, MapPin, Shield, Users } from "lucide-react";
import { SITE_NAME } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `About Us | ${SITE_NAME}`,
  description:
    "Learn about findabusiness.com.au — Australia's free business directory. Our mission is to make finding local businesses easy, trustworthy, and free.",
};

export default function AboutPage() {
  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <nav className="flex items-center gap-1.5 text-sm text-mid">
          <Link href="/" className="hover:text-dark transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-dark font-medium">About</span>
        </nav>
      </div>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold font-heading text-dark mb-6">
          About findabusiness.com.au
        </h1>

        <p className="text-lg leading-relaxed text-mid mb-6">
          {SITE_NAME} is Australia&apos;s free business directory. We
          make it easy to find local businesses across every state, city, and
          suburb — from plumbers in Perth to cafes in Cairns.
        </p>

        <p className="text-lg leading-relaxed text-mid mb-6">
          Our mission is simple: connect Australians with trusted local
          businesses, and give every business — no matter how small — a chance
          to be found online. No paywalls, no gatekeepers, no premium-only
          visibility.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-10">
          <div className="bg-white border border-border rounded-lg p-5 text-center">
            <Search className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold font-heading text-dark mb-1">
              Easy to Search
            </h3>
            <p className="text-sm text-mid">
              Find businesses by category, state, or suburb with a simple search.
            </p>
          </div>
          <div className="bg-white border border-border rounded-lg p-5 text-center">
            <Shield className="w-8 h-8 text-success mx-auto mb-3" />
            <h3 className="font-semibold font-heading text-dark mb-1">
              Verified & Trusted
            </h3>
            <p className="text-sm text-mid">
              Every listing is reviewed before going live to ensure accuracy.
            </p>
          </div>
          <div className="bg-white border border-border rounded-lg p-5 text-center">
            <Users className="w-8 h-8 text-cta mx-auto mb-3" />
            <h3 className="font-semibold font-heading text-dark mb-1">
              100% Free
            </h3>
            <p className="text-sm text-mid">
              List your business for free. No fees, no credit card required.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold font-heading text-dark mb-4">
          Why We Built This
        </h2>
        <p className="text-mid leading-relaxed mb-4">
          Finding a trustworthy local business shouldn&apos;t be hard. But existing
          directories often hide the best results behind paywalls, or make it
          impossible for small businesses to compete with big ad budgets.
        </p>
        <p className="text-mid leading-relaxed mb-4">
          We built {SITE_NAME} to be different: a clean, honest
          directory where every business gets a fair go. No paid placements, no
          fake reviews, just real businesses and real Australians connecting.
        </p>

        <h2 className="text-2xl font-bold font-heading text-dark mb-4 mt-10">
          Our Values
        </h2>
        <ul className="space-y-3 text-mid">
          <li className="flex gap-2">
            <span className="text-cta font-bold">•</span>
            <span>
              <strong className="text-dark">Free & Open:</strong>{" "}
              Basic listings are free forever. We may introduce optional premium
              features, but core visibility is never behind a paywall.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-cta font-bold">•</span>
            <span>
              <strong className="text-dark">Australian First:</strong>{" "}
              Built for Australia, by Australians. Every state, every suburb,
              every local business.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-cta font-bold">•</span>
            <span>
              <strong className="text-dark">Trustworthy:</strong>{" "}
              We verify listings to keep the directory accurate and reliable.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-cta font-bold">•</span>
            <span>
              <strong className="text-dark">Simple:</strong>{" "}
              Clean design, fast pages, no clutter. Find what you need without
              the noise.
            </span>
          </li>
        </ul>

        <div className="mt-10 p-6 bg-primary/5 rounded-lg border border-primary/20 text-center">
          <p className="text-lg font-semibold text-dark mb-3">
            Ready to list your business?
          </p>
          <Link
            href="/get-listed"
            className="inline-flex items-center gap-2 bg-cta text-white font-semibold rounded-lg px-6 py-3 hover:bg-cta-dark transition-colors"
          >
            Get Listed Free
          </Link>
        </div>
      </section>
    </div>
  );
}
