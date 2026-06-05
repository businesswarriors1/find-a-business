import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase";
import { sendListingRejectedEmail } from "@/lib/email";

// POST — reject a listing request (called by admin dashboard)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { requestId, reason } = body;

    if (!requestId) {
      return NextResponse.json({ error: "requestId required" }, { status: 400 });
    }

    const supabase = getAdminSupabase();

    // Get the request details
    const { data: reqData } = await supabase
      .from("listing_requests")
      .select("*")
      .eq("id", requestId)
      .single();

    if (reqData) {
      await sendListingRejectedEmail(
        reqData.business_name,
        reason ?? "Your listing did not meet our requirements.",
        reqData.contact_email,
      ).catch((e) => console.error("Rejection email error:", e));
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Reject API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
