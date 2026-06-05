"use client";

import { useState } from "react";
import { Star, MessageSquare, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ReviewForm({ businessId }: { businessId: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [content, setContent] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;

    if (rating < 1) {
      setStatus("error");
      setMessage("Please select a star rating.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_id: businessId,
          reviewer_name: name.trim() || null,
          reviewer_email: email.trim() || null,
          rating,
          content: content.trim() || null,
          honeypot_field: honeypot,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setStatus("done");
      setMessage(data.message ?? "Review submitted for moderation. Thank you!");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  if (status === "done") {
    return (
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-start gap-2 bg-success/10 border border-success/20 rounded-lg px-4 py-3 text-sm text-dark">
          <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
          <span>{message}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 pt-4 border-t border-border">
      <h3 className="font-semibold text-dark mb-3 font-heading">Leave a Review</h3>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full border border-border rounded-md px-4 py-2.5 text-sm min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email (not shown publicly)"
          className="w-full border border-border rounded-md px-4 py-2.5 text-sm min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          required
        />
        <div className="flex items-center gap-1">
          <span className="text-sm text-mid mr-2">Rating:</span>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              className="p-0.5"
            >
              <Star
                className={cn(
                  "w-6 h-6 transition-colors",
                  n <= (hover || rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-200",
                )}
              />
            </button>
          ))}
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your review..."
          rows={3}
          className="w-full border border-border rounded-md px-4 py-2.5 text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          required
        />

        {/* Honeypot — hidden from humans */}
        <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="review_url">Leave empty</label>
          <input
            id="review_url"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        {status === "error" && (
          <p className="text-sm text-red-600">{message}</p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center gap-2 bg-cta text-white font-semibold rounded-lg px-6 py-2.5 hover:bg-cta-dark transition-colors disabled:opacity-50"
        >
          {status === "loading" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <MessageSquare className="w-4 h-4" />
          )}
          Submit Review
        </button>
      </form>
    </div>
  );
}
