import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | findabusiness.com.au",
  description: "Get in touch with the findabusiness.com.au team.",
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white border border-border rounded-lg p-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold font-heading text-dark mb-4">
          Contact Us
        </h1>
        <p className="text-mid mb-8">
          Have a question, suggestion, or need help with your listing? We&apos;d
          love to hear from you.
        </p>

        <div className="space-y-6">
          <div className="flex items-start gap-4 p-4 bg-light-bg rounded-lg">
            <Mail className="w-6 h-6 text-primary mt-0.5" />
            <div>
              <h2 className="font-semibold text-dark mb-1 font-heading">Email</h2>
              <a
                href="mailto:hello@findabusiness.com.au"
                className="text-primary hover:underline"
              >
                hello@findabusiness.com.au
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-light-bg rounded-lg">
            <MessageCircle className="w-6 h-6 text-primary mt-0.5" />
            <div>
              <h2 className="font-semibold text-dark mb-1 font-heading">
                Get Listed
              </h2>
              <p className="text-mid mb-2">
                Want to list your business? Chat with us — it takes just a few
                minutes.
              </p>
              <Link
                href="/get-listed"
                className="inline-flex items-center gap-2 bg-cta text-white font-semibold rounded-lg px-5 py-2.5 hover:opacity-90 transition-opacity"
              >
                Get Listed Free
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
