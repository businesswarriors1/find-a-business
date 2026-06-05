import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { createClient as getAdminSupabase } from "@/lib/supabase/admin";
import { sendNewListingAlert } from "@/lib/slack";

// POST — direct listing request form submission (alternative to chat)
export async function POST(request: NextRequest) {
  try {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip") ?? "unknown";

    // Rate limit: 2 per hour per IP
    const rateLimit = await checkRateLimit(`listing_req:${ip}`, 2, "1 h");
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const body = await request.json();

    // Honeypot check
    if (body.honeypot_field) {
      return NextResponse.json({ message: "Request received" }, { status: 200 });
    }

    const {
      business_name,
      category,
      suburb,
      state,
      phone,
      website,
      description,
      contact_name,
      contact_email,
    } = body;

    if (!business_name || typeof business_name !== "string" || business_name.trim().length === 0) {
      return NextResponse.json({ error: "Business name is required" }, { status: 400 });
    }

    const supabase = getAdminSupabase();
    const { error: insertError } = await supabase.from("listing_requests").insert({
      business_name: business_name.trim(),
      category: category ?? null,
      suburb: suburb ?? null,
      state: state ?? null,
      phone: phone ?? null,
      website: website ?? null,
      description: description ?? null,
      contact_name: contact_name ?? null,
      contact_email: contact_email ?? null,
      status: "pending",
      source: "form",
    });

    if (insertError) {
      console.error("Insert error:", insertError);
      return NextResponse.json({ error: "Failed to submit listing request" }, { status: 500 });
    }

    // Send Slack notification
    await sendNewListingAlert({
      business_name,
      category,
      suburb,
      state,
      contact_name,
      contact_email,
    }).catch((e) => console.error("Slack error:", e));

    return NextResponse.json({
      message: "Your listing request has been submitted! We'll review it and get back to you soon.",
    });
  } catch (err) {
    console.error("Listing request error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
