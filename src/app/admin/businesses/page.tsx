"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getBrowserSupabase } from "@/lib/supabase-browser";
import { Business } from "@/types";
import { cn } from "@/lib/utils";
import {
  Loader2,
  Search,
  Edit3,
  ToggleLeft,
  ToggleRight,
  Mail,
  Phone,
  ExternalLink,
} from "lucide-react";

export default function AdminBusinessesPage() {
  const router = useRouter();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended">("all");
  const [editModal, setEditModal] = useState<{ open: boolean; business: Business | null }>({ open: false, business: null });

  const fetchBusinesses = useCallback(async () => {
    const supabase = getBrowserSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.replace("/admin/login");
      return;
    }
    setLoading(true);
    try {
      let query = supabase.from("businesses").select("*").order("created_at", { ascending: false });
      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }
      if (search) {
        query = query.ilike("name", `%${search}%`);
      }
      const { data, error: fetchErr } = await query.limit(100);
      if (fetchErr) throw fetchErr;
      setBusinesses(data ?? []);
    } catch (err) {
      console.error(err);
      setError("Failed to load businesses");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search, router]);

  useEffect(() => { fetchBusinesses(); }, [fetchBusinesses]);

  async function toggleStatus(business: Business) {
    const supabase = getBrowserSupabase();
    const newStatus = business.status === "active" ? "suspended" : "active";
    await supabase
      .from("businesses")
      .update({ status: newStatus })
      .eq("id", business.id);
    fetchBusinesses();
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
      <h1 className="text-2xl font-bold text-[#111827] mb-6">Businesses</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search businesses..."
            className="w-full h-10 pl-9 pr-3 rounded-lg border border-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-[#0D6EFD] focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          {(["all", "active", "suspended"] as const).map((s) => (
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
                <th className="text-left px-4 py-3 font-semibold text-[#111827]">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-[#111827]">Category</th>
                <th className="text-left px-4 py-3 font-semibold text-[#111827]">Suburb</th>
                <th className="text-left px-4 py-3 font-semibold text-[#111827]">Contact</th>
                <th className="text-left px-4 py-3 font-semibold text-[#111827]">Status</th>
                <th className="text-center px-4 py-3 font-semibold text-[#111827]">Claimed</th>
                <th className="text-right px-4 py-3 font-semibold text-[#111827]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {businesses.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-[#6B7280]">
                    No businesses found.
                  </td>
                </tr>
              )}
              {businesses.map((biz) => (
                <tr key={biz.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-[#111827]">
                    <div>{biz.name}</div>
                    <div className="text-xs text-[#6B7280]">{biz.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-[#6B7280]">{biz.category_id ?? "—"}</td>
                  <td className="px-4 py-3 text-[#6B7280]">
                    {biz.suburb ?? biz.suburb_id ?? "—"}
                    {biz.state && <span className="text-xs ml-1">({biz.state})</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-0.5">
                      {biz.contact_email && (
                        <span className="text-xs text-[#6B7280] flex items-center gap-1">
                          <Mail size={12} /> {biz.contact_email}
                        </span>
                      )}
                      {biz.phone && (
                        <span className="text-xs text-[#6B7280] flex items-center gap-1">
                          <Phone size={12} /> {biz.phone}
                        </span>
                      )}
                      {!biz.contact_email && !biz.phone && "—"}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full font-medium",
                        biz.status === "active" && "bg-green-100 text-green-700",
                        biz.status === "suspended" && "bg-red-100 text-red-700",
                      )}
                    >
                      {biz.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {biz.claimed ? (
                      <span className="text-xs text-green-600 font-medium">Yes</span>
                    ) : (
                      <span className="text-xs text-[#6B7280]">No</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={() => toggleStatus(biz)}
                        className="flex items-center gap-1 h-8 px-2 rounded-lg hover:bg-gray-100 text-[#6B7280] text-xs"
                        title={biz.status === "active" ? "Suspend" : "Activate"}
                      >
                        {biz.status === "active" ? <ToggleRight size={16} className="text-green-600" /> : <ToggleLeft size={16} className="text-red-600" />}
                      </button>
                      <button
                        onClick={() => setEditModal({ open: true, business: biz })}
                        className="flex items-center gap-1 h-8 px-2 rounded-lg border border-[#E5E7EB] text-[#6B7280] text-xs font-medium hover:bg-gray-100"
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                      <a
                        href={`/business/${biz.slug}`}
                        target="_blank"
                        rel="noopener"
                        className="flex items-center gap-1 h-8 px-2 rounded-lg text-[#0D6EFD] text-xs hover:underline"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editModal.open && editModal.business && (
        <EditBusinessModal
          business={editModal.business}
          onClose={() => setEditModal({ open: false, business: null })}
          onSaved={() => {
            setEditModal({ open: false, business: null });
            fetchBusinesses();
          }}
        />
      )}
    </div>
  );
}

function EditBusinessModal({
  business,
  onClose,
  onSaved,
}: {
  business: Business;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    name: business.name,
    slug: business.slug,
    category: (business as any).category ?? "",
    suburb: (business as any).suburb ?? "",
    state: (business as any).state ?? "",
    phone: business.phone ?? "",
    website: business.website ?? "",
    description: business.description ?? "",
    contact_name: business.contact_name ?? "",
    contact_email: business.contact_email ?? "",
  });
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    const supabase = getBrowserSupabase();
    await supabase
      .from("businesses")
      .update(form)
      .eq("id", business.id);
    setSaving(false);
    onSaved();
  }

  const fields = [
    { key: "name", label: "Business Name" },
    { key: "slug", label: "URL Slug" },
    { key: "category", label: "Category" },
    { key: "suburb", label: "Suburb" },
    { key: "state", label: "State" },
    { key: "phone", label: "Phone" },
    { key: "website", label: "Website" },
    { key: "description", label: "Description" },
    { key: "contact_name", label: "Contact Name" },
    { key: "contact_email", label: "Contact Email" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
        <h3 className="text-lg font-semibold text-[#111827] mb-4">Edit: {business.name}</h3>
        <div className="space-y-3">
          {fields.map(({ key, label }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-[#6B7280] mb-1">{label}</label>
              {key === "description" ? (
                <textarea
                  value={(form as Record<string, string>)[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-[#E5E7EB] p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D6EFD] resize-none"
                />
              ) : (
                <input
                  type="text"
                  value={(form as Record<string, string>)[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full h-9 px-3 rounded border border-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-[#0D6EFD]"
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-2 justify-end mt-4">
          <button
            onClick={onClose}
            className="h-9 px-4 rounded-lg border border-[#E5E7EB] text-sm text-[#6B7280] hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="h-9 px-4 rounded-lg bg-[#0D6EFD] text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
