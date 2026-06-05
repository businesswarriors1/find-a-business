import type { Metadata } from "next";
import { DM_Sans, Inter } from "next/font/google";
import Link from "next/link";
import { MobileMenu } from "@/components/mobile-menu";
import {
  Search,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
} from "lucide-react";
import "./globals.css";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL, SITE_OG_IMAGE } from "@/lib/constants";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-body",
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
    images: [{ url: SITE_OG_IMAGE, width: 1200, height: 630 }],
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-AU"
      className={`${dmSans.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body">
        {/* ===== NAV ===== */}
        <header className="sticky top-0 z-50 bg-white border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-1 text-2xl font-bold text-dark font-heading">
                findabusiness
                <span className="text-cta">.</span>
              </Link>

              {/* Desktop nav */}
              <nav className="hidden md:flex items-center gap-6">
                <Link
                  href="/"
                  className="text-sm font-medium text-dark hover:text-primary transition-colors"
                >
                  Browse
                </Link>
                <Link
                  href="/about"
                  className="text-sm font-medium text-mid hover:text-dark transition-colors"
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="text-sm font-medium text-mid hover:text-dark transition-colors"
                >
                  Contact
                </Link>
                <Link
                  href="/get-listed"
                  className="inline-flex items-center gap-2 rounded-lg bg-cta px-4 py-2 text-sm font-semibold text-white hover:bg-cta-dark transition-colors"
                >
                  Get Listed Free
                </Link>
              </nav>

              {/* Mobile hamburger */}
              <MobileMenu />
            </div>
          </div>

          {/* Mobile menu */}
          <div id="mobile-menu" className="hidden md:hidden border-t border-border bg-white">
            <div className="px-4 py-3 space-y-2">
              <Link href="/" className="block py-2 text-sm font-medium text-dark hover:text-primary">
                Browse All
              </Link>
              <Link href="/about" className="block py-2 text-sm font-medium text-mid hover:text-dark">
                About
              </Link>
              <Link href="/contact" className="block py-2 text-sm font-medium text-mid hover:text-dark">
                Contact
              </Link>
            </div>
          </div>
        </header>

        {/* ===== MAIN ===== */}
        <main className="flex-1">{children}</main>

        {/* ===== FOOTER ===== */}
        <footer className="bg-light-bg border-t border-border mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Brand */}
              <div className="md:col-span-1">
                <Link href="/" className="text-xl font-bold text-dark font-heading">
                  findabusiness<span className="text-cta">.</span>
                </Link>
                <p className="mt-2 text-sm text-mid">
                  Australia&apos;s free business directory. Find trusted local businesses across every state, city, and suburb.
                </p>
              </div>

              {/* Quick links */}
              <div>
                <h3 className="font-semibold text-dark mb-3 font-heading">Quick Links</h3>
                <ul className="space-y-2 text-sm text-mid">
                  <li><Link href="/" className="hover:text-dark">Home</Link></li>
                  <li><Link href="/get-listed" className="hover:text-dark">Get Listed</Link></li>
                  <li><Link href="/about" className="hover:text-dark">About Us</Link></li>
                  <li><Link href="/contact" className="hover:text-dark">Contact</Link></li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h3 className="font-semibold text-dark mb-3 font-heading">Legal</h3>
                <ul className="space-y-2 text-sm text-mid">
                  <li><Link href="/privacy" className="hover:text-dark">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-dark">Terms of Use</Link></li>
                </ul>
              </div>

              {/* Contact info */}
              <div>
                <h3 className="font-semibold text-dark mb-3 font-heading">Contact</h3>
                <ul className="space-y-2 text-sm text-mid">
                  <li className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>hello@findabusiness.com.au</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>Australia</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-border text-center text-sm text-mid">
              &copy; {new Date().getFullYear()} findabusiness.com.au. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
