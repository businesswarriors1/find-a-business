import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { createClient } from "@/lib/supabase/admin";
import { sendNewReviewAlert } from "@/lib/slack";

// GET — fetch approved reviews for a business
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get("business_id");

    if (!businessId) {
      return NextResponse.json({ error: "business_id is required" }, { status: 400 });
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("business_id", businessId)
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Reviews fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
    }

    return NextResponse.json({ reviews: data });
  } catch (err) {
    console.error("GET reviews error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST — submit a review
export async function POST(request: NextRequest) {
  try {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip") ?? "unknown";

    // Rate limit: 3 per day per IP
    const rateLimit = await checkRateLimit(`review:${ip}`, 3, "1 d");
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "You've submitted too many reviews today. Please try again tomorrow." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const { business_id, reviewer_name, reviewer_email, rating, content } = body;

    // Honeypot — bots fill this; respond 200 but silently discard.
    if (body.honeypot_field) {
      return NextResponse.json({ message: "Review submitted for moderation. Thank you!" });
    }

    if (!business_id) {
      return NextResponse.json({ error: "business_id is required" }, { status: 400 });
    }
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    const supabase = createClient();

    // Check business exists
    const { data: business } = await supabase
      .from("businesses")
      .select("id, name")
      .eq("id", business_id)
      .single();

    const { error: insertError } = await supabase.from("reviews").insert({
      business_id,
      reviewer_name: reviewer_name ?? null,
      reviewer_email: reviewer_email ?? null,
      rating,
      content: content ?? null,
      ip_address: ip,
      status: "pending",
    });

    if (insertError) {
      console.error("Review insert error:", insertError);
      return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
    }

    // Send Slack notification
    await sendNewReviewAlert({
      reviewer_name,
      reviewer_email,
      rating,
      content,
      business_name: business?.name,
    }).catch((e) => console.error("Slack error:", e));

    return NextResponse.json({
      message: "Review submitted for moderation. Thank you!",
    });
  } catch (err) {
    console.error("POST review error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
