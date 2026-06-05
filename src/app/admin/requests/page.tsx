"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ListingRequest } from "@/types";
import { cn } from "@/lib/utils";
import {
  Loader2,
  Check,
  X,
  Edit3,
  Search,
  Filter,
} from "lucide-react";

type StatusFilter = "all" | "pending" | "approved" | "rejected";

export default function AdminRequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<ListingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("pending");
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectionModal, setRejectionModal] = useState<{ open: boolean; requestId: string; reason: string }>({ open: false, requestId: "", reason: "" });
  const [editModal, setEditModal] = useState<{ open: boolean; request: ListingRequest | null }>({ open: false, request: null });

  const fetchRequests = useCallback(async () => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.replace("/admin/login");
      return;
    }
    setLoading(true);
    try {
      let query = supabase.from("listing_requests").select("*").order("created_at", { ascending: false });
      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }
      if (search) {
        query = query.ilike("business_name", `%${search}%`);
      }
      const { data, error: fetchErr } = await query.limit(100);
      if (fetchErr) throw fetchErr;
      setRequests(data ?? []);
    } catch (err) {
      console.error(err);
      setError("Failed to load requests");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search, router]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  async function approveRequest(req: ListingRequest) {
    setActionLoading(req.id);
    // The server route (service role, admin-gated) creates the business with the
    // correct schema columns, resolves category/suburb/state, updates the
    // request, and emails the submitter.
    try {
      const res = await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId: req.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert("Failed to approve: " + (data.error ?? "Unknown error"));
      }
    } catch (e) {
      console.error("Approve API error:", e);
      alert("Network error while approving. Please try again.");
    }

    setActionLoading(null);
    fetchRequests();
  }

  async function rejectRequest() {
    const { requestId, reason } = rejectionModal;
    setActionLoading(requestId);
    try {
      const res = await fetch("/api/admin/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, reason }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert("Failed to reject: " + (data.error ?? "Unknown error"));
      }
    } catch (e) {
      console.error("Reject API error:", e);
      alert("Network error while rejecting. Please try again.");
    }

    setRejectionModal({ open: false, requestId: "", reason: "" });
    setActionLoading(null);
    fetchRequests();
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
      <h1 className="text-2xl font-bold text-[#111827] mb-6">Listing Requests</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by business name..."
            className="w-full h-10 pl-9 pr-3 rounded-lg border border-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-[#0D6EFD] focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
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
                <th className="text-left px-4 py-3 font-semibold text-[#111827]">Business Name</th>
                <th className="text-left px-4 py-3 font-semibold text-[#111827]">Category</th>
                <th className="text-left px-4 py-3 font-semibold text-[#111827]">Suburb</th>
                <th className="text-left px-4 py-3 font-semibold text-[#111827]">Contact</th>
                <th className="text-left px-4 py-3 font-semibold text-[#111827]">Submitted</th>
                <th className="text-left px-4 py-3 font-semibold text-[#111827]">Status</th>
                <th className="text-right px-4 py-3 font-semibold text-[#111827]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {requests.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-[#6B7280]">
                    No listing requests found.
                  </td>
                </tr>
              )}
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-[#111827]">{req.business_name}</td>
                  <td className="px-4 py-3 text-[#6B7280]">{req.category ?? "—"}</td>
                  <td className="px-4 py-3 text-[#6B7280]">
                    {req.suburb ?? "—"}{req.state ? `, ${req.state}` : ""}
                  </td>
                  <td className="px-4 py-3 text-[#6B7280] max-w-[200px] truncate">
                    {req.contact_name && <div>{req.contact_name}</div>}
                    {req.contact_email && <div className="text-xs">{req.contact_email}</div>}
                    {!req.contact_name && !req.contact_email && "—"}
                  </td>
                  <td className="px-4 py-3 text-[#6B7280] whitespace-nowrap">
                    {new Date(req.created_at).toLocaleDateString("en-AU")}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full font-medium",
                        req.status === "pending" && "bg-yellow-100 text-yellow-700",
                        req.status === "approved" && "bg-green-100 text-green-700",
                        req.status === "rejected" && "bg-red-100 text-red-700",
                      )}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {req.status === "pending" && (
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => approveRequest(req)}
                          disabled={actionLoading === req.id}
                          className="flex items-center gap-1 h-8 px-2.5 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-700 disabled:opacity-50"
                        >
                          {actionLoading === req.id ? <Loader2 size={12} className="animate-spin" /> : <Check size={14} />}
                          Approve
                        </button>
                        <button
                          onClick={() => setRejectionModal({ open: true, requestId: req.id, reason: "" })}
                          disabled={actionLoading === req.id}
                          className="flex items-center gap-1 h-8 px-2.5 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700 disabled:opacity-50"
                        >
                          <X size={14} />
                          Reject
                        </button>
                        <button
                          onClick={() => setEditModal({ open: true, request: req })}
                          className="flex items-center gap-1 h-8 px-2.5 rounded-lg border border-[#E5E7EB] text-[#6B7280] text-xs font-medium hover:bg-gray-100"
                        >
                          <Edit3 size={14} />
                        </button>
                      </div>
                    )}
                    {req.status !== "pending" && (
                      <span className="text-xs text-[#6B7280]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rejection Modal */}
      {rejectionModal.open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-[#111827] mb-2">Reject Request</h3>
            <p className="text-sm text-[#6B7280] mb-4">
              Optionally provide a reason for rejection (will be sent to the submitter).
            </p>
            <textarea
              value={rejectionModal.reason}
              onChange={(e) => setRejectionModal({ ...rejectionModal, reason: e.target.value })}
              placeholder="Reason for rejection..."
              rows={3}
              className="w-full rounded-lg border border-[#E5E7EB] p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D6EFD] resize-none"
            />
            <div className="flex gap-2 justify-end mt-4">
              <button
                onClick={() => setRejectionModal({ open: false, requestId: "", reason: "" })}
                className="h-9 px-4 rounded-lg border border-[#E5E7EB] text-sm font-medium text-[#6B7280] hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={rejectRequest}
                disabled={actionLoading === rejectionModal.requestId}
                className="h-9 px-4 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {actionLoading === rejectionModal.requestId ? "Rejecting..." : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal (simple inline edit) */}
      {editModal.open && editModal.request && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-[#111827] mb-4">Edit Request: {editModal.request.business_name}</h3>
            <EditRequestForm
              request={editModal.request}
              onClose={() => setEditModal({ open: false, request: null })}
              onSaved={() => {
                setEditModal({ open: false, request: null });
                fetchRequests();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function EditRequestForm({
  request,
  onClose,
  onSaved,
}: {
  request: ListingRequest;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    business_name: request.business_name,
    category: request.category ?? "",
    suburb: request.suburb ?? "",
    state: request.state ?? "",
    phone: request.phone ?? "",
    website: request.website ?? "",
    description: request.description ?? "",
    contact_name: request.contact_name ?? "",
    contact_email: request.contact_email ?? "",
  });
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    const supabase = createClient();
    await supabase
      .from("listing_requests")
      .update(form)
      .eq("id", request.id);
    setSaving(false);
    onSaved();
  }

  return (
    <div className="space-y-3">
      {Object.entries(form).map(([key, value]) => (
        <div key={key}>
          <label className="block text-xs font-medium text-[#6B7280] mb-1 capitalize">
            {key.replace(/_/g, " ")}
          </label>
          <input
            type="text"
            value={value}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            className="w-full h-9 px-3 rounded border border-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-[#0D6EFD]"
          />
        </div>
      ))}
      <div className="flex gap-2 justify-end pt-2">
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
  );
}
