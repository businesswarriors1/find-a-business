"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Suburb } from "@/types";
import { cn } from "@/lib/utils";
import {
  Loader2,
  Plus,
  Trash2,
  MapPin,
} from "lucide-react";

const AUSTRALIAN_STATES = [
  { code: "NSW", name: "New South Wales" },
  { code: "VIC", name: "Victoria" },
  { code: "QLD", name: "Queensland" },
  { code: "WA", name: "Western Australia" },
  { code: "SA", name: "South Australia" },
  { code: "TAS", name: "Tasmania" },
  { code: "NT", name: "Northern Territory" },
  { code: "ACT", name: "Australian Capital Territory" },
];

export default function AdminSuburbsPage() {
  const router = useRouter();
  const [suburbs, setSuburbs] = useState<Suburb[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeState, setActiveState] = useState("NSW");
  const [showAdd, setShowAdd] = useState(false);

  const fetchSuburbs = async () => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.replace("/admin/login");
      return;
    }
    setLoading(true);
    try {
      const { data, error: fetchErr } = await supabase
        .from("suburbs")
        .select("*")
        .order("name", { ascending: true });
      if (fetchErr) throw fetchErr;
      setSuburbs(data ?? []);
    } catch (err) {
      console.error(err);
      setError("Failed to load suburbs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSuburbs(); }, [router]);

  const stateSuburbs = suburbs.filter((s) => s.state === activeState);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[#0D6EFD]" size={32} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#111827]">Suburbs</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 h-10 px-4 rounded-lg bg-[#F97316] text-white text-sm font-semibold hover:bg-[#EA580C] transition-colors"
        >
          <Plus size={16} /> Add Suburb
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      {/* State tabs */}
      <div className="flex flex-wrap gap-1 mb-4 p-1 bg-gray-100 rounded-lg">
        {AUSTRALIAN_STATES.map((st) => (
          <button
            key={st.code}
            onClick={() => setActiveState(st.code)}
            className={cn(
              "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
              activeState === st.code
                ? "bg-white text-[#111827] shadow-sm"
                : "text-[#6B7280] hover:text-[#111827]",
            )}
          >
            {st.code}
            <span className="hidden sm:inline text-xs ml-1 text-[#6B7280]">({suburbs.filter((s) => s.state === st.code).length})</span>
          </button>
        ))}
      </div>

      {/* Add suburb form */}
      {showAdd && (
        <div className="mb-4 bg-white rounded-lg border border-[#E5E7EB] p-4">
          <AddSuburbForm
            defaultState={activeState}
            onClose={() => setShowAdd(false)}
            onSaved={() => {
              setShowAdd(false);
              fetchSuburbs();
            }}
          />
        </div>
      )}

      {/* Suburb list */}
      <div className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-[#E5E7EB] font-semibold text-sm text-[#111827]">
          {AUSTRALIAN_STATES.find((s) => s.code === activeState)?.name ?? activeState} — {stateSuburbs.length} suburbs
        </div>
        <div className="divide-y divide-[#E5E7EB]">
          {stateSuburbs.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-[#6B7280]">
              No suburbs added for {activeState} yet.
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {stateSuburbs.map((suburb) => (
              <div
                key={suburb.id}
                className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 border-b border-[#E5E7EB]"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <MapPin size={14} className="text-[#6B7280] flex-shrink-0" />
                  <span className="text-sm text-[#111827] truncate">{suburb.name}</span>
                  {suburb.postcode && (
                    <span className="text-xs text-[#6B7280]">{suburb.postcode}</span>
                  )}
                </div>
                <button
                  onClick={async () => {
                    if (confirm(`Remove "${suburb.name}"?`)) {
                      const supabase = createClient();
                      await supabase.from("suburbs").delete().eq("id", suburb.id);
                      fetchSuburbs();
                    }
                  }}
                  className="p-1 hover:bg-red-100 rounded text-red-500 flex-shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AddSuburbForm({
  defaultState,
  onClose,
  onSaved,
}: {
  defaultState: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState("");
  const [state, setState] = useState(defaultState);
  const [postcode, setPostcode] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleAdd() {
    if (!name.trim()) return;
    setSaving(true);
    const supabase = createClient();
    await supabase.from("suburbs").insert({
      name: name.trim(),
      state,
      postcode: postcode || null,
    });
    setSaving(false);
    onSaved();
  }

  return (
    <div>
      <h3 className="font-semibold text-[#111827] mb-3">Add New Suburb</h3>
      <div className="flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-xs font-medium text-[#6B7280] mb-1">Suburb Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Surry Hills"
            className="h-9 px-3 w-40 rounded border border-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-[#0D6EFD]"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#6B7280] mb-1">State</label>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="h-9 px-2 rounded border border-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-[#0D6EFD]"
          >
            {AUSTRALIAN_STATES.map((st) => (
              <option key={st.code} value={st.code}>{st.code}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#6B7280] mb-1">Postcode (optional)</label>
          <input
            type="text"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            placeholder="2010"
            className="h-9 px-3 w-24 rounded border border-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-[#0D6EFD]"
          />
        </div>
        <button
          onClick={handleAdd}
          disabled={saving || !name.trim()}
          className="h-9 px-4 rounded-lg bg-[#16A34A] text-white text-sm font-medium hover:bg-green-700 disabled:opacity-50"
        >
          Add
        </button>
        <button
          onClick={onClose}
          className="h-9 px-4 rounded-lg border border-[#E5E7EB] text-sm text-[#6B7280] hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
