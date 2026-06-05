"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";

const STORAGE_KEY = "fab-cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // localStorage unavailable (private mode etc.) — don't nag.
    }
  }, []);

  function decide(choice: "accepted" | "declined") {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      /* ignore */
    }
    setVisible(false);
    // Hook analytics consent here when GA4 is wired up:
    // if (choice === "accepted") window.gtag?.("consent", "update", { analytics_storage: "granted" });
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] p-4 sm:p-6">
      <div className="max-w-3xl mx-auto bg-white border border-border rounded-xl shadow-lg p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Cookie className="w-5 h-5" />
          </div>
          <p className="text-sm text-mid leading-relaxed">
            We use cookies to understand how visitors use findabusiness.com.au and to improve the
            site. See our{" "}
            <Link href="/privacy" className="text-primary font-medium hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => decide("declined")}
            className="px-4 py-2 rounded-lg text-sm font-medium text-mid border border-border hover:bg-light-bg transition-colors"
          >
            Decline
          </button>
          <button
            onClick={() => decide("accepted")}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-cta hover:bg-cta-dark transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
