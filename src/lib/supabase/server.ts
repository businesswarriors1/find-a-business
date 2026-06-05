import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {}
        },
      },
    }
  );
}

// ============================================================
// Data Fetching Helpers (all return empty/default when Supabase unconfigured)
// ============================================================

export async function getBusinesses(filters: {
  category?: string; state?: string; suburb?: string; page?: number; pageSize?: number; sort?: string;
}) {
  const supabase = await createClient();
  if (!supabase) return { data: [], total: 0 };

  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 20;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("businesses")
    .select("*, states!inner(abbreviation), suburbs!inner(name, postcode), categories!inner(name, slug)", { count: "exact" })
    .eq("status", "active");

  if (filters.category) query = query.eq("categories.slug", filters.category);
  if (filters.state) {
    const abbrev = filters.state.length <= 4 ? filters.state.toUpperCase() : filters.state;
    query = query.eq("states.abbreviation", abbrev);
  }
  if (filters.suburb) query = query.eq("suburbs.name", filters.suburb);

  if (filters.sort === "created_at") query = query.order("created_at", { ascending: false });
  else query = query.order("name", { ascending: true });

  query = query.range(from, to);
  const { data, count, error } = await query;
  if (error || !data) return { data: [], total: 0 };

  const businesses = data.map((row: any) => ({
    id: row.id, name: row.name, slug: row.slug,
    description: row.description ?? "", phone: row.phone ?? "", website: row.website ?? "",
    email: row.email ?? "", address: row.address ?? "",
    category: row.categories?.name ?? "", category_slug: row.categories?.slug ?? "",
    suburb: row.suburbs?.name ?? "", suburb_slug: "",
    postcode: row.suburbs?.postcode ?? "", state: row.states?.abbreviation ?? "",
    state_id: row.state_id ?? "", logo_url: row.logo_url ?? "",
    is_claimed: row.is_claimed ?? false, is_featured: row.is_featured ?? false,
    created_at: row.created_at ?? "",
  }));

  return { data: businesses, total: count ?? 0 };
}

export async function getBusinessBySlug(slug: string) {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("businesses")
    .select("*, states!inner(abbreviation), suburbs!inner(name, postcode), categories!inner(name, slug)")
    .eq("slug", slug).eq("status", "active").single();
  if (error || !data) return null;

  return {
    id: data.id, name: data.name, slug: data.slug,
    description: data.description ?? "", phone: data.phone ?? "", website: data.website ?? "",
    email: data.email ?? "", address: data.address ?? "",
    category: data.categories?.name ?? "", category_slug: data.categories?.slug ?? "",
    suburb: data.suburbs?.name ?? "", postcode: data.suburbs?.postcode ?? "",
    state: data.states?.abbreviation ?? "", logo_url: data.logo_url ?? "",
    is_claimed: data.is_claimed ?? false, is_featured: data.is_featured ?? false,
    created_at: data.created_at ?? "",
  };
}

export async function getRecentBusinesses(limit: number = 6) {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("businesses")
    .select("id, name, slug, suburbs!inner(name), states!inner(abbreviation)")
    .eq("status", "active").order("created_at", { ascending: false }).limit(limit);
  if (error || !data) return [];

  return data.map((row: any) => ({
    id: row.id, name: row.name, slug: row.slug,
    suburb: row.suburbs?.name ?? "", state: row.states?.abbreviation ?? "",
  }));
}

export async function getCategoryBySlug(slug: string) {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data } = await supabase.from("categories").select("*").eq("slug", slug).single();
  return data ?? null;
}

export async function getSubcategories(parentSlug: string) {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data: parent } = await supabase.from("categories").select("id").eq("slug", parentSlug).single();
  if (!parent) return [];

  const { data } = await supabase.from("categories").select("id, name, slug").eq("parent_id", parent.id).order("sort_order");
  return (data ?? []).map((s: any) => ({ ...s, listing_count: 0 }));
}

export async function getSuburbBySlug(stateSlug: string, suburbSlug: string) {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from("suburbs").select("*, states!inner(abbreviation, name)")
    .eq("slug", suburbSlug).eq("states.slug", stateSlug).single();
  return data ?? null;
}

export async function getBusinessReviews(businessId: string) {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("reviews").select("id, reviewer_name, rating, content, created_at")
    .eq("business_id", businessId).eq("status", "approved").order("created_at", { ascending: false });
  if (error || !data) return [];

  return data.map((r: any) => ({
    id: r.id, reviewer_name: r.reviewer_name ?? "Anonymous",
    rating: r.rating, content: r.content ?? "", created_at: r.created_at,
  }));
}

export async function getReviewStats(businessId: string) {
  const supabase = await createClient();
  if (!supabase) return { average: 0, count: 0 };

  const { data, error } = await supabase
    .from("reviews").select("rating").eq("business_id", businessId).eq("status", "approved");
  if (error || !data) return { average: 0, count: 0 };

  const ratings = data.map((r: any) => r.rating);
  const average = ratings.length > 0
    ? Math.round((ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length) * 10) / 10 : 0;
  return { average, count: ratings.length };
}

export async function getStatesWithCounts() {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data } = await supabase.from("states").select("id, name, slug, abbreviation");
  return (data ?? []).map((s: any) => ({ ...s, listing_count: 0 }));
}

export async function getCategoriesWithCounts() {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data } = await supabase.from("categories").select("id, name, slug, icon, sort_order").is("parent_id", null).order("sort_order");
  return (data ?? []).map((c: any) => ({ ...c, listing_count: 0 }));
}

export async function getSuburbsByState(stateSlug: string) {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data } = await supabase.from("suburbs").select("id, name, slug, postcode, states!inner(slug)")
    .eq("states.slug", stateSlug).order("name");
  return data ?? [];
}

export async function getNearbySuburbs(stateAbbr: string, suburbSlug: string, limit: number = 5) {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data: state } = await supabase.from("states").select("id").eq("abbreviation", stateAbbr).single();
  if (!state) return [];

  const { data } = await supabase.from("suburbs").select("id, name, slug")
    .eq("state_id", state.id).neq("slug", suburbSlug).limit(limit).order("name");
  return data ?? [];
}

export async function getCategoriesInSuburb(suburbName: string, stateAbbr: string) {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("businesses").select("categories!inner(id, name, slug)")
    .eq("status", "active").eq("suburbs.name", suburbName).eq("states.abbreviation", stateAbbr);
  if (error || !data) return [];

  const seen = new Map<string, { name: string; slug: string; count: number }>();
  for (const row of data) {
    const cat = (row as any).categories;
    if (cat && !seen.has(cat.slug)) seen.set(cat.slug, { name: cat.name, slug: cat.slug, count: 0 });
    if (cat) seen.get(cat.slug)!.count++;
  }
  return Array.from(seen.values());
}
