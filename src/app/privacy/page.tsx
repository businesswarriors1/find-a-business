import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | findabusiness.com.au",
  description:
    "How findabusiness.com.au collects, uses, and protects your personal information under the Australian Privacy Act 1988.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold font-heading text-dark mb-6">
        Privacy Policy
      </h1>
      <p className="text-mid mb-4">
        <em>Last updated: June 2026</em>
      </p>

      <div className="prose prose-slate max-w-none">
        <p>
          findabusiness.com.au (&ldquo;we&rdquo;, &ldquo;our&rdquo;,
          &ldquo;us&rdquo;) is committed to protecting your privacy. This
          Privacy Policy explains how we collect, use, disclose, and safeguard
          your information when you visit our website.
        </p>

        <h2 className="text-xl font-semibold font-heading text-dark mt-8 mb-3">
          1. Information We Collect
        </h2>
        <p>
          We may collect the following types of information when you interact
          with findabusiness.com.au:
        </p>
        <ul className="list-disc pl-6 space-y-1 text-mid">
          <li>
            <strong>Business listing information:</strong> Business name, phone
            number, address, website, description, contact name and email when
            you request a listing.
          </li>
          <li>
            <strong>Review information:</strong> Name, email, rating and review
            content when you submit a review.
          </li>
          <li>
            <strong>Usage data:</strong> Pages visited, search queries, and
            browsing behaviour via Google Analytics.
          </li>
          <li>
            <strong>Technical data:</strong> IP address, browser type, device
            information, and cookies.
          </li>
        </ul>

        <h2 className="text-xl font-semibold font-heading text-dark mt-8 mb-3">
          2. How We Use Your Information
        </h2>
        <p>We use your information to:</p>
        <ul className="list-disc pl-6 space-y-1 text-mid">
          <li>Publish and maintain business listings on the directory</li>
          <li>Communicate with you about your listing</li>
          <li>Moderate and publish reviews</li>
          <li>Improve our website and services</li>
          <li>Send relevant marketing communications (with your consent)</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2 className="text-xl font-semibold font-heading text-dark mt-8 mb-3">
          3. Data We Do NOT Share
        </h2>
        <p>We do not:</p>
        <ul className="list-disc pl-6 space-y-1 text-mid">
          <li>Sell your personal information to third parties</li>
          <li>
            Publicly display business email addresses — these are used
            exclusively for internal communication
          </li>
          <li>
            Publicly display reviewer email addresses — these are used for
            verification and moderation only
          </li>
        </ul>

        <h2 className="text-xl font-semibold font-heading text-dark mt-8 mb-3">
          4. Cookies
        </h2>
        <p>
          We use essential cookies for site functionality and analytics cookies
          via Google Analytics to understand how our site is used. You can
          control cookie preferences through our cookie consent banner or your
          browser settings.
        </p>

        <h2 className="text-xl font-semibold font-heading text-dark mt-8 mb-3">
          5. Data Retention
        </h2>
        <p>
          We retain your information for as long as your business listing is
          active, or as required by law. Review data is retained as long as the
          associated business listing exists. You can request deletion of your
          data by contacting us.
        </p>

        <h2 className="text-xl font-semibold font-heading text-dark mt-8 mb-3">
          6. Your Rights
        </h2>
        <p>
          Under the Australian Privacy Act 1988, you have the right to:
        </p>
        <ul className="list-disc pl-6 space-y-1 text-mid">
          <li>Access the personal information we hold about you</li>
          <li>Request correction of inaccurate information</li>
          <li>Request deletion of your information</li>
          <li>Make a complaint about our handling of your information</li>
        </ul>

        <h2 className="text-xl font-semibold font-heading text-dark mt-8 mb-3">
          7. Third-Party Services
        </h2>
        <p>
          We use third-party services including Supabase (database hosting),
          Vercel (website hosting), Google Analytics (analytics), and Resend
          (email delivery). Each of these services has its own privacy policy
          governing how they handle data.
        </p>

        <h2 className="text-xl font-semibold font-heading text-dark mt-8 mb-3">
          8. Contact Us
        </h2>
        <p>
          For privacy-related inquiries, please contact us at{" "}
          <a
            href="mailto:hello@findabusiness.com.au"
            className="text-primary hover:underline"
          >
            hello@findabusiness.com.au
          </a>
          .
        </p>
      </div>
    </div>
  );
}
