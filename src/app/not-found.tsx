import Link from "next/link";
import {
  Search,
  ArrowLeft,
  Wrench,
  Zap,
  Smile,
  Calculator,
  Sparkles,
  Paintbrush,
} from "lucide-react";

const popularLinks = [
  { slug: "plumbers", name: "Plumbers", icon: Wrench },
  { slug: "electricians", name: "Electricians", icon: Zap },
  { slug: "dentists", name: "Dentists", icon: Smile },
  { slug: "accountants", name: "Accountants", icon: Calculator },
  { slug: "cleaners", name: "Cleaners", icon: Sparkles },
  { slug: "painters", name: "Painters", icon: Paintbrush },
];

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Search className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-4xl font-bold font-heading text-dark mb-3">
          Page Not Found
        </h1>
        <p className="text-mid mb-6">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It may
          have been moved or no longer exists.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 justify-center bg-primary text-white font-semibold rounded-lg px-6 py-3 hover:opacity-90 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            href="/get-listed"
            className="inline-flex items-center gap-2 justify-center bg-cta text-white font-semibold rounded-lg px-6 py-3 hover:opacity-90 transition-opacity"
          >
            Get Listed Free
          </Link>
        </div>

        <div className="bg-light-bg rounded-lg p-5 border border-border">
          <h2 className="text-sm font-semibold font-heading text-dark mb-3">
            Popular Categories
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {popularLinks.map((cat) => {
              const IconCmp = cat.icon;
              return (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-sm font-medium text-dark hover:border-primary hover:text-primary transition-colors"
                >
                  <IconCmp className="w-3.5 h-3.5" />
                  {cat.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
