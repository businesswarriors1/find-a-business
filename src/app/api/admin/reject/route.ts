import { NextRequest, NextResponse } from "next/server";
import { createClient as getAdminSupabase } from "@/lib/supabase/admin";
import { getAdminUser } from "@/lib/admin-auth";
import { sendListingRejectedEmail } from "@/lib/email";

// POST — reject a listing request: mark it rejected and email the submitter.
// Service-role write, admin-only.
export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { requestId, reason } = body;
    if (!requestId) {
      return NextResponse.json({ error: "requestId is required" }, { status: 400 });
    }

    const supabase = getAdminSupabase();

    const { data: req } = await supabase
      .from("listing_requests")
      .select("*")
      .eq("id", requestId)
      .single();

    const rejectionReason = reason?.trim() || "Your listing did not meet our requirements.";

    const { error: updateErr } = await supabase
      .from("listing_requests")
      .update({ status: "rejected", rejection_reason: rejectionReason })
      .eq("id", requestId);

    if (updateErr) {
      console.error("Reject: request update error:", updateErr);
      return NextResponse.json({ error: "Failed to reject request" }, { status: 500 });
    }

    if (req) {
      await sendListingRejectedEmail(
        req.business_name,
        rejectionReason,
        req.contact_email,
      ).catch((e) => console.error("Rejection email error:", e));
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Reject API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
