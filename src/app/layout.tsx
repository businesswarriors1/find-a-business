import type { Metadata } from "next";
import { Fraunces, Hanken_Grotesk } from "next/font/google";
import Link from "next/link";
import { MobileMenu } from "@/components/mobile-menu";
import { CookieConsent } from "@/components/cookie-consent";
import { Mail, MapPin, ArrowUpRight } from "lucide-react";
import "./globals.css";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/constants";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hanken",
  display: "swap",
});

export const metadata: Metadata = {
  title: `Find a Business in Australia | ${SITE_NAME}`,
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: `Find a Business in Australia | ${SITE_NAME}`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Find a Business in Australia | ${SITE_NAME}`,
    description: SITE_DESCRIPTION,
  },
  alternates: {
    canonical: SITE_URL,
  },
};

function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <span
      className={`font-heading font-black tracking-tight ${light ? "text-paper" : "text-ink"}`}
    >
      findabusiness<span className="text-cta">.</span>
    </span>
  );
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-AU"
      data-scroll-behavior="smooth"
      className={`${fraunces.variable} ${hanken.variable} h-full`}
    >
      <body className="min-h-full flex flex-col font-body bg-paper">
        {/* ===== NAV ===== */}
        <header className="sticky top-0 z-50 bg-paper/85 backdrop-blur-md border-b border-border">
          <div className="rule-accent h-0.5 w-full" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-[68px]">
              <Link href="/" className="text-2xl">
                <Wordmark />
              </Link>

              <nav className="hidden md:flex items-center gap-8">
                <Link href="/search" className="text-sm font-medium text-dark/80 hover:text-cta transition-colors">
                  Browse
                </Link>
                <Link href="/about" className="text-sm font-medium text-dark/80 hover:text-cta transition-colors">
                  About
                </Link>
                <Link href="/contact" className="text-sm font-medium text-dark/80 hover:text-cta transition-colors">
                  Contact
                </Link>
                <Link
                  href="/get-listed"
                  className="group inline-flex items-center gap-1.5 rounded-full bg-cta px-5 py-2.5 text-sm font-semibold text-white hover:bg-cta-dark transition-colors"
                >
                  List your business
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </nav>

              <MobileMenu />
            </div>
          </div>
        </header>

        {/* ===== MAIN ===== */}
        <main className="flex-1">{children}</main>

        <CookieConsent />

        {/* ===== FOOTER ===== */}
        <footer className="surface-ink text-paper mt-24">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
              <div className="md:col-span-5">
                <Link href="/" className="text-2xl">
                  <Wordmark light />
                </Link>
                <p className="mt-4 text-sm text-paper/65 max-w-sm leading-relaxed">
                  Australia&apos;s free business directory. Find trusted local
                  businesses across every state, city and suburb — and get your
                  own listed for nothing.
                </p>
                <Link
                  href="/get-listed"
                  className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-cta px-5 py-2.5 text-sm font-semibold text-white hover:bg-cta-dark transition-colors"
                >
                  List your business free <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="md:col-span-2">
                <h3 className="font-heading font-semibold text-paper mb-4 text-sm uppercase tracking-wider">Explore</h3>
                <ul className="space-y-2.5 text-sm text-paper/65">
                  <li><Link href="/search" className="hover:text-gold transition-colors">Browse businesses</Link></li>
                  <li><Link href="/get-listed" className="hover:text-gold transition-colors">Get listed</Link></li>
                  <li><Link href="/about" className="hover:text-gold transition-colors">About us</Link></li>
                  <li><Link href="/contact" className="hover:text-gold transition-colors">Contact</Link></li>
                </ul>
              </div>

              <div className="md:col-span-2">
                <h3 className="font-heading font-semibold text-paper mb-4 text-sm uppercase tracking-wider">Legal</h3>
                <ul className="space-y-2.5 text-sm text-paper/65">
                  <li><Link href="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-gold transition-colors">Terms of Use</Link></li>
                </ul>
              </div>

              <div className="md:col-span-3">
                <h3 className="font-heading font-semibold text-paper mb-4 text-sm uppercase tracking-wider">Contact</h3>
                <ul className="space-y-2.5 text-sm text-paper/65">
                  <li className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gold shrink-0" />
                    <span>hello@findabusiness.com.au</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gold shrink-0" />
                    <span>Australia-wide</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-paper/50">
              <span>&copy; {new Date().getFullYear()} findabusiness.com.au</span>
              <span>Made in Australia 🦘</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
