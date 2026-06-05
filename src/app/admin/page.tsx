"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AdminStats } from "@/types";
import { cn } from "@/lib/utils";
import {
  FileText,
  Clock,
  Building2,
  Star,
  ArrowRight,
  Loader2,
  TrendingUp,
  Plus,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<{ id: string; business_name: string; status: string; created_at: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      const supabase = createClient();
      if (!supabase) {
        setError("Supabase not configured");
        setLoading(false);
        return;
      }
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/admin/login");
        return;
      }

      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Fetch all stats in parallel (supabase is guaranteed non-null here)
        const s = supabase;
        const [
          { count: newRequestsToday },
          { count: pendingRequests },
          { count: totalLive },
          { count: reviewsPending },
          { data: recent },
        ] = await Promise.all([
          s
            .from("listing_requests")
            .select("*", { count: "exact", head: true })
            .gte("created_at", today.toISOString()),
          s
            .from("listing_requests")
            .select("*", { count: "exact", head: true })
            .eq("status", "pending"),
          s
            .from("businesses")
            .select("*", { count: "exact", head: true })
            .eq("status", "active"),
          s
            .from("reviews")
            .select("*", { count: "exact", head: true })
            .eq("status", "pending"),
          s
            .from("listing_requests")
            .select("id, business_name, status, created_at")
            .order("created_at", { ascending: false })
            .limit(10),
        ]);

        setStats({
          new_requests_today: newRequestsToday ?? 0,
          pending_review: pendingRequests ?? 0,
          total_live_listings: totalLive ?? 0,
          reviews_pending: reviewsPending ?? 0,
        });
        setRecentActivity(recent ?? []);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  const statCards = stats
    ? [
        {
          label: "New Requests Today",
          value: stats.new_requests_today,
          icon: TrendingUp,
          color: "text-[#0D6EFD]",
          bg: "bg-blue-50",
          link: "/admin/requests",
        },
        {
          label: "Pending Review",
          value: stats.pending_review,
          icon: Clock,
          color: "text-[#F97316]",
          bg: "bg-orange-50",
          link: "/admin/requests",
        },
        {
          label: "Total Live Listings",
          value: stats.total_live_listings,
          icon: Building2,
          color: "text-[#16A34A]",
          bg: "bg-green-50",
          link: "/admin/businesses",
        },
        {
          label: "Reviews Pending",
          value: stats.reviews_pending,
          icon: Star,
          color: "text-purple-600",
          bg: "bg-purple-50",
          link: "/admin/reviews",
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[#0D6EFD]" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#111827]">Dashboard</h1>
        <Link
          href="/admin/requests"
          className="flex items-center gap-2 h-10 px-4 rounded-lg bg-[#F97316] text-white text-sm font-semibold hover:bg-[#EA580C] transition-colors"
        >
          <Plus size={16} />
          Review New Requests
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            href={stat.link}
            className="bg-white rounded-lg border border-[#E5E7EB] p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#6B7280]">{stat.label}</span>
              <div className={cn("p-2 rounded-lg", stat.bg)}>
                <stat.icon size={18} className={stat.color} />
              </div>
            </div>
            <div className="text-3xl font-bold text-[#111827]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {stat.value}
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-[#E5E7EB]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E7EB]">
          <h2 className="font-semibold text-[#111827]">Recent Listing Requests</h2>
          <Link href="/admin/requests" className="text-sm text-[#0D6EFD] hover:underline flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="divide-y divide-[#E5E7EB]">
          {recentActivity.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-[#6B7280]">
              No recent requests yet.
            </div>
          )}
          {recentActivity.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
            >
              <div>
                <span className="text-sm font-medium text-[#111827]">{item.business_name}</span>
                <span className="text-xs text-[#6B7280] ml-2">
                  {new Date(item.created_at).toLocaleDateString("en-AU")}
                </span>
              </div>
              <span
                className={cn(
                  "text-xs px-2 py-0.5 rounded-full font-medium",
                  item.status === "pending" && "bg-yellow-100 text-yellow-700",
                  item.status === "approved" && "bg-green-100 text-green-700",
                  item.status === "rejected" && "bg-red-100 text-red-700",
                )}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
