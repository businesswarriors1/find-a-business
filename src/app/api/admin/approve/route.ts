import { NextRequest, NextResponse } from "next/server";
import { createClient as getAdminSupabase } from "@/lib/supabase/admin";
import { getAdminUser } from "@/lib/admin-auth";
import { sendListingApprovedEmail } from "@/lib/email";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// POST — approve a listing request: create the live business, mark the request
// approved, and email the submitter. Service-role write, admin-only.
export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { requestId } = body;
    if (!requestId) {
      return NextResponse.json({ error: "requestId is required" }, { status: 400 });
    }

    const supabase = getAdminSupabase();

    const { data: req, error: reqErr } = await supabase
      .from("listing_requests")
      .select("*")
      .eq("id", requestId)
      .single();

    if (reqErr || !req) {
      return NextResponse.json({ error: "Listing request not found" }, { status: 404 });
    }

    // Best-effort resolve free-text category / suburb / state to FK ids so the
    // listing surfaces on the relevant directory pages.
    let category_id: string | null = null;
    let state_id: string | null = null;
    let suburb_id: string | null = null;

    if (req.category) {
      const { data: cat } = await supabase
        .from("categories")
        .select("id")
        .or(`name.ilike.${req.category},slug.ilike.${slugify(req.category)}`)
        .is("parent_id", null)
        .limit(1)
        .maybeSingle();
      category_id = cat?.id ?? null;
    }

    if (req.state) {
      const { data: st } = await supabase
        .from("states")
        .select("id")
        .or(`abbreviation.ilike.${req.state},name.ilike.${req.state},slug.ilike.${req.state.toLowerCase()}`)
        .limit(1)
        .maybeSingle();
      state_id = st?.id ?? null;
    }

    if (req.suburb) {
      let sq = supabase.from("suburbs").select("id").ilike("name", req.suburb).limit(1);
      if (state_id) sq = sq.eq("state_id", state_id);
      const { data: sub } = await sq.maybeSingle();
      suburb_id = sub?.id ?? null;
    }

    // Ensure a unique slug.
    const baseSlug = slugify(req.business_name || "business");
    let slug = baseSlug;
    const { data: existing } = await supabase
      .from("businesses")
      .select("slug")
      .ilike("slug", `${baseSlug}%`);
    if (existing && existing.length > 0) {
      const taken = new Set(existing.map((b: { slug: string }) => b.slug));
      if (taken.has(slug)) {
        let n = 2;
        while (taken.has(`${baseSlug}-${n}`)) n++;
        slug = `${baseSlug}-${n}`;
      }
    }

    const { data: business, error: insertErr } = await supabase
      .from("businesses")
      .insert({
        name: req.business_name,
        slug,
        description: req.description ?? null,
        phone: req.phone ?? null,
        website: req.website ?? null,
        email: req.contact_email ?? req.email ?? null,
        category_id,
        state_id,
        suburb_id,
        status: "active",
        is_claimed: false,
      })
      .select("id, slug")
      .single();

    if (insertErr || !business) {
      console.error("Approve: business insert error:", insertErr);
      return NextResponse.json({ error: "Failed to create business" }, { status: 500 });
    }

    const { error: updateErr } = await supabase
      .from("listing_requests")
      .update({ status: "approved", business_id: business.id })
      .eq("id", requestId);

    if (updateErr) {
      console.error("Approve: request update error:", updateErr);
    }

    await sendListingApprovedEmail({
      name: req.business_name,
      slug: business.slug,
      contact_email: req.contact_email,
    }).catch((e) => console.error("Approval email error:", e));

    return NextResponse.json({ success: true, businessId: business.id, slug: business.slug });
  } catch (err) {
    console.error("Approve API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
