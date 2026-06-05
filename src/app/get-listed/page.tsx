import Link from "next/link";
import {
  MessageCircle,
  Search,
  Clock,
  CheckCircle,
  Users,
  ChevronDown,
  Zap,
  Shield,
  Heart,
} from "lucide-react";
import { SITE_NAME, GET_LISTED_FAQS } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `List Your Business for Free | ${SITE_NAME}`,
  description:
    "Get your Australian business listed on findabusiness.com.au — completely free. Chat with us to get started, go live within 24 hours.",
};

export default function GetListedPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-cta/5 via-white to-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold font-heading text-dark">
            List Your Business for Free
          </h1>
          <p className="mt-4 text-lg text-mid max-w-2xl mx-auto">
            Join thousands of Australian businesses already on{" "}
            {SITE_NAME}. Get found by local customers searching for businesses
            like yours — no fees, no credit card, no catch.
          </p>
        </div>
      </section>

      {/* Value props */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-border rounded-lg p-6 text-center card-hover">
            <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center text-success mx-auto mb-4">
              <Heart className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-semibold font-heading text-dark mb-2">
              Free Forever
            </h3>
            <p className="text-sm text-mid">
              Your basic listing is 100% free, forever. No hidden fees, no
              credit card, no subscription traps.
            </p>
          </div>
          <div className="bg-white border border-border rounded-lg p-6 text-center card-hover">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-semibold font-heading text-dark mb-2">
              Get Found Locally
            </h3>
            <p className="text-sm text-mid">
              Appear on category, state, and suburb pages. Australian customers
              find you when they search for services you offer.
            </p>
          </div>
          <div className="bg-white border border-border rounded-lg p-6 text-center card-hover">
            <div className="w-14 h-14 rounded-full bg-cta/10 flex items-center justify-center text-cta mx-auto mb-4">
              <Zap className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-semibold font-heading text-dark mb-2">
              Live Within 24 Hours
            </h3>
            <p className="text-sm text-mid">
              After a quick chat to verify your details, your listing goes live —
              usually on the same day.
            </p>
          </div>
        </div>
      </section>

      {/* Chat widget CTA */}
      <section className="bg-primary py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white mb-3">
            Chat with Us to Get Listed
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Our friendly AI assistant will guide you through the process in just
            a couple of minutes. Tell us about your business and we will handle
            the rest.
          </p>
          <Link
            href="/get-listed#chat"
            className="inline-flex items-center gap-2 bg-cta text-white font-semibold rounded-lg px-8 py-4 hover:bg-cta-dark transition-colors text-lg"
          >
            <MessageCircle className="w-5 h-5" />
            Start Chat — Get Listed Free
          </Link>
        </div>
      </section>

      {/* Social proof */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-light-bg border border-border rounded-lg p-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Users className="w-6 h-6 text-primary" />
            <Shield className="w-6 h-6 text-success" />
            <CheckCircle className="w-6 h-6 text-cta" />
          </div>
          <p className="text-lg font-semibold font-heading text-dark">
            Join a Growing Directory of Australian Businesses
          </p>
          <p className="text-sm text-mid mt-2 max-w-md mx-auto">
            Every listing is verified by our team. We are building Australia&apos;s
            most trusted free business directory — one business at a time.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-2xl sm:text-3xl font-bold font-heading text-dark text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {GET_LISTED_FAQS.map((faq, idx) => (
            <details
              key={idx}
              className="group bg-white border border-border rounded-lg"
            >
              <summary className="flex items-center justify-between cursor-pointer list-none p-4 font-medium text-dark font-heading text-sm sm:text-base">
                {faq.q}
                <ChevronDown className="w-5 h-5 text-mid shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-4 pb-4 text-sm text-mid leading-relaxed">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
