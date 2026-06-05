import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase";
import { sendListingApprovedEmail } from "@/lib/email";

// POST — approve a listing request (called by admin dashboard)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { requestId, businessId, slug } = body;

    if (!requestId || !businessId) {
      return NextResponse.json({ error: "requestId and businessId required" }, { status: 400 });
    }

    const supabase = getAdminSupabase();

    // Get the request details
    const { data: reqData } = await supabase
      .from("listing_requests")
      .select("*")
      .eq("id", requestId)
      .single();

    if (reqData) {
      await sendListingApprovedEmail({
        name: reqData.business_name,
        slug: slug || "",
        contact_email: reqData.contact_email,
      }).catch((e) => console.error("Approval email error:", e));
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Approve API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
