import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use | findabusiness.com.au",
  description:
    "Terms and conditions for using findabusiness.com.au, including listing guidelines and content standards.",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold font-heading text-dark mb-6">
        Terms of Use
      </h1>
      <p className="text-mid mb-4">
        <em>Last updated: June 2026</em>
      </p>

      <div className="prose prose-slate max-w-none">
        <p>
          Welcome to findabusiness.com.au. By accessing or using our website,
          you agree to be bound by these Terms of Use. If you do not agree,
          please do not use the site.
        </p>

        <h2 className="text-xl font-semibold font-heading text-dark mt-8 mb-3">
          1. Acceptance of Terms
        </h2>
        <p>
          By accessing findabusiness.com.au, you acknowledge that you have read,
          understood, and agree to be bound by these Terms of Use and our
          Privacy Policy.
        </p>

        <h2 className="text-xl font-semibold font-heading text-dark mt-8 mb-3">
          2. Directory Listings
        </h2>
        <p>Business listings on findabusiness.com.au are subject to:</p>
        <ul className="list-disc pl-6 space-y-1 text-mid">
          <li>
            All listing requests are reviewed by our team before publication
          </li>
          <li>
            We reserve the right to reject, edit, or remove any listing at our
            discretion
          </li>
          <li>
            Listings must be for legitimate businesses operating in Australia
          </li>
          <li>Duplicate listings are not permitted</li>
          <li>
            Listings containing false, misleading, or offensive content will be
            removed
          </li>
        </ul>

        <h2 className="text-xl font-semibold font-heading text-dark mt-8 mb-3">
          3. Reviews & User Content
        </h2>
        <p>When submitting a review, you agree that:</p>
        <ul className="list-disc pl-6 space-y-1 text-mid">
          <li>Reviews must be based on genuine experiences</li>
          <li>
            Fake reviews, spam, or reviews containing offensive content are
            prohibited
          </li>
          <li>
            We review all submissions before publication and may reject any
            review
          </li>
          <li>
            Reviews that violate these terms will be removed without notice
          </li>
        </ul>

        <h2 className="text-xl font-semibold font-heading text-dark mt-8 mb-3">
          4. Intellectual Property
        </h2>
        <p>
          The findabusiness.com.au name, logo, and website content (excluding
          user-submitted content) are the property of Business Warriors. You may
          not reproduce, distribute, or create derivative works without
          permission.
        </p>

        <h2 className="text-xl font-semibold font-heading text-dark mt-8 mb-3">
          5. Disclaimer
        </h2>
        <p>
          findabusiness.com.au provides a directory of businesses. We do not
          endorse, guarantee, or warrant any business listed on the site. Users
          should conduct their own due diligence before engaging with any listed
          business. We are not responsible for the quality of services or
          products provided by listed businesses.
        </p>

        <h2 className="text-xl font-semibold font-heading text-dark mt-8 mb-3">
          6. Limitation of Liability
        </h2>
        <p>
          To the fullest extent permitted by law, findabusiness.com.au and its
          operators shall not be liable for any direct, indirect, incidental, or
          consequential damages arising from the use of or inability to use the
          website.
        </p>

        <h2 className="text-xl font-semibold font-heading text-dark mt-8 mb-3">
          7. Changes to Terms
        </h2>
        <p>
          We reserve the right to modify these terms at any time. Changes will
          be posted on this page with an updated date. Continued use of the site
          after changes constitutes acceptance of the new terms.
        </p>

        <h2 className="text-xl font-semibold font-heading text-dark mt-8 mb-3">
          8. Governing Law
        </h2>
        <p>
          These terms are governed by the laws of Western Australia and the
          Commonwealth of Australia.
        </p>

        <h2 className="text-xl font-semibold font-heading text-dark mt-8 mb-3">
          9. Contact
        </h2>
        <p>
          For questions about these terms, contact us at{" "}
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
