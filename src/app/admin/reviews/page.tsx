"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getBrowserSupabase } from "@/lib/supabase-browser";
import { Review } from "@/types";
import { cn } from "@/lib/utils";
import {
  Loader2,
  Check,
  X,
  Star,
  Filter,
} from "lucide-react";

type StatusFilter = "all" | "pending" | "approved" | "rejected";

export default function AdminReviewsPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("pending");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    const supabase = getBrowserSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.replace("/admin/login");
      return;
    }
    setLoading(true);
    try {
      let query = supabase.from("reviews").select("*, businesses!inner(name)").order("created_at", { ascending: false });
      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }
      const { data, error: fetchErr } = await query.limit(100);
      if (fetchErr) throw fetchErr;
      setReviews(data ?? []);
    } catch (err) {
      console.error(err);
      setError("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, router]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  async function updateReviewStatus(id: string, status: "approved" | "rejected") {
    setActionLoading(id);
    const supabase = getBrowserSupabase();
    await supabase.from("reviews").update({ status }).eq("id", id);
    setActionLoading(null);
    fetchReviews();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[#0D6EFD]" size={32} />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#111827] mb-6">Review Moderation</h1>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4">
        <Filter size={16} className="text-[#6B7280]" />
        {(["all", "pending", "approved", "rejected"] as StatusFilter[]).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
              statusFilter === s
                ? "bg-[#0D6EFD] text-white"
                : "bg-gray-100 text-[#6B7280] hover:bg-gray-200",
            )}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-[#E5E7EB]">
                <th className="text-left px-4 py-3 font-semibold text-[#111827]">Business</th>
                <th className="text-left px-4 py-3 font-semibold text-[#111827]">Reviewer</th>
                <th className="text-center px-4 py-3 font-semibold text-[#111827]">Rating</th>
                <th className="text-left px-4 py-3 font-semibold text-[#111827]">Comment</th>
                <th className="text-left px-4 py-3 font-semibold text-[#111827]">Submitted</th>
                <th className="text-left px-4 py-3 font-semibold text-[#111827]">Status</th>
                <th className="text-right px-4 py-3 font-semibold text-[#111827]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {reviews.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-[#6B7280]">
                    No reviews found.
                  </td>
                </tr>
              )}
              {reviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-[#6B7280] text-xs">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {(review as any).businesses?.name ?? review.business_id}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-[#111827]">
                      {review.reviewer_name ?? "Anonymous"}
                    </div>
                    {review.reviewer_email && (
                      <div className="text-xs text-[#6B7280]">{review.reviewer_email}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={12}
                          className={star <= review.rating ? "fill-[#F97316] text-[#F97316]" : "text-[#E5E7EB]"}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#6B7280] max-w-[300px]">
                    <p className="line-clamp-2">{review.content ?? "—"}</p>
                  </td>
                  <td className="px-4 py-3 text-[#6B7280] whitespace-nowrap text-xs">
                    {new Date(review.created_at).toLocaleDateString("en-AU")}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full font-medium",
                        review.status === "pending" && "bg-yellow-100 text-yellow-700",
                        review.status === "approved" && "bg-green-100 text-green-700",
                        review.status === "rejected" && "bg-red-100 text-red-700",
                      )}
                    >
                      {review.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {review.status === "pending" && (
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => updateReviewStatus(review.id, "approved")}
                          disabled={actionLoading === review.id}
                          className="flex items-center gap-1 h-8 px-2.5 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-700 disabled:opacity-50"
                        >
                          {actionLoading === review.id ? <Loader2 size={12} className="animate-spin" /> : <Check size={14} />}
                          Approve
                        </button>
                        <button
                          onClick={() => updateReviewStatus(review.id, "rejected")}
                          disabled={actionLoading === review.id}
                          className="flex items-center gap-1 h-8 px-2.5 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700 disabled:opacity-50"
                        >
                          <X size={14} />
                          Reject
                        </button>
                      </div>
                    )}
                    {review.status !== "pending" && (
                      <span className="text-xs text-[#6B7280]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
