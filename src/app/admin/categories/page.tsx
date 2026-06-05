"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getBrowserSupabase } from "@/lib/supabase-browser";
import { Category } from "@/types";
import { cn } from "@/lib/utils";
import {
  Loader2,
  Plus,
  Trash2,
  Edit3,
  GripVertical,
  FolderTree,
  FileText,
} from "lucide-react";

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  const fetchCategories = async () => {
    const supabase = getBrowserSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.replace("/admin/login");
      return;
    }
    setLoading(true);
    try {
      const { data, error: fetchErr } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true });
      if (fetchErr) throw fetchErr;
      setCategories(data ?? []);
    } catch (err) {
      console.error(err);
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, [router]);

  const parents = categories.filter((c) => !c.parent_id);
  const subcategories = categories.filter((c) => c.parent_id);

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
        <h1 className="text-2xl font-bold text-[#111827]">Categories</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 h-10 px-4 rounded-lg bg-[#F97316] text-white text-sm font-semibold hover:bg-[#EA580C] transition-colors"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Add Category Form */}
      {showAdd && (
        <div className="mb-6 bg-white rounded-lg border border-[#E5E7EB] p-4">
          <AddCategoryForm
            parents={parents}
            onClose={() => setShowAdd(false)}
            onSaved={() => {
              setShowAdd(false);
              fetchCategories();
            }}
          />
        </div>
      )}

      {/* Category List */}
      <div className="space-y-4">
        {parents.length === 0 && (
          <div className="bg-white rounded-lg border border-[#E5E7EB] p-8 text-center text-[#6B7280]">
            No categories yet. Add your first category.
          </div>
        )}

        {parents.map((parent) => {
          const subs = subcategories.filter((s) => s.parent_id === parent.id);
          return (
            <div
              key={parent.id}
              className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-[#E5E7EB]">
                <div className="flex items-center gap-3">
                  <FolderTree size={16} className="text-[#0D6EFD]" />
                  {editing === parent.id ? (
                    <InlineEdit
                      initialValue={parent.name}
                      onSave={async (name: string) => {
                        const supabase = getBrowserSupabase();
                        await supabase.from("categories").update({ name }).eq("id", parent.id);
                        setEditing(null);
                        fetchCategories();
                      }}
                      onCancel={() => setEditing(null)}
                    />
                  ) : (
                    <span
                      className="font-semibold text-[#111827] cursor-pointer hover:text-[#0D6EFD]"
                      onClick={() => setEditing(parent.id)}
                    >
                      {parent.name}
                    </span>
                  )}
                  <span className="text-xs text-[#6B7280]">{subs.length} subcategories</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditing(parent.id)}
                    className="p-1.5 hover:bg-gray-200 rounded text-[#6B7280]"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={async () => {
                      if (confirm(`Delete "${parent.name}" and its subcategories?`)) {
                        const supabase = getBrowserSupabase();
                        await supabase.from("categories").delete().eq("id", parent.id);
                        await supabase.from("categories").delete().eq("parent_id", parent.id);
                        fetchCategories();
                      }
                    }}
                    className="p-1.5 hover:bg-red-100 rounded text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="divide-y divide-[#E5E7EB]">
                {subs.length === 0 && (
                  <div className="px-4 py-3 text-sm text-[#6B7280]">No subcategories yet.</div>
                )}
                {subs.map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between px-4 py-2.5 pl-10">
                    <div className="flex items-center gap-2">
                      <GripVertical size={14} className="text-[#E5E7EB]" />
                      <FileText size={14} className="text-[#6B7280]" />
                      {editing === sub.id ? (
                        <InlineEdit
                          initialValue={sub.name}
                          onSave={async (name: string) => {
                            const supabase = getBrowserSupabase();
                            await supabase.from("categories").update({ name }).eq("id", sub.id);
                            setEditing(null);
                            fetchCategories();
                          }}
                          onCancel={() => setEditing(null)}
                        />
                      ) : (
                        <span
                          className="text-sm text-[#111827] cursor-pointer hover:text-[#0D6EFD]"
                          onClick={() => setEditing(sub.id)}
                        >
                          {sub.name}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditing(sub.id)}
                        className="p-1.5 hover:bg-gray-100 rounded text-[#6B7280]"
                      >
                        <Edit3 size={12} />
                      </button>
                      <button
                        onClick={async () => {
                          const supabase = getBrowserSupabase();
                          await supabase.from("categories").delete().eq("id", sub.id);
                          fetchCategories();
                        }}
                        className="p-1.5 hover:bg-red-100 rounded text-red-500"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add subcategory */}
              <div className="px-4 py-2 pl-10">
                <AddSubcategoryForm
                  parentId={parent.id}
                  onSaved={fetchCategories}
                  slugPrefix={parent.slug}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AddCategoryForm({
  parents,
  onClose,
  onSaved,
}: {
  parents: Category[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [subcategoryName, setSubcategoryName] = useState("");
  const [parentId, setParentId] = useState("");
  const [saving, setSaving] = useState(false);

  function generateSlug(n: string) {
    setSlug(n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
  }

  async function handleAddParent() {
    if (!name.trim()) return;
    setSaving(true);
    const supabase = getBrowserSupabase();
    await supabase.from("categories").insert({
      name: name.trim(),
      slug: slug || generateSlugForName(name),
      sort_order: parents.length + 1,
    });
    setSaving(false);
    onSaved();
  }

  async function handleAddSub() {
    if (!subcategoryName.trim() || !parentId) return;
    setSaving(true);
    const supabase = getBrowserSupabase();
    const parent = parents.find((p) => p.id === parentId);
    await supabase.from("categories").insert({
      name: subcategoryName.trim(),
      slug: `${parent?.slug ?? ""}-${generateSlugForName(subcategoryName)}`,
      parent_id: parentId,
      sort_order: 1,
    });
    setSaving(false);
    onSaved();
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-[#111827]">Add New Category</h3>

      {/* Primary category */}
      <div>
        <label className="block text-xs font-medium text-[#6B7280] mb-1">Primary Category Name</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); generateSlug(e.target.value); }}
            placeholder="e.g. Plumbers"
            className="flex-1 h-9 px-3 rounded border border-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-[#0D6EFD]"
          />
          <button
            onClick={handleAddParent}
            disabled={saving || !name.trim()}
            className="h-9 px-4 rounded-lg bg-[#16A34A] text-white text-sm font-medium hover:bg-green-700 disabled:opacity-50"
          >
            Add
          </button>
        </div>
      </div>

      {/* Subcategory */}
      <div className="border-t border-[#E5E7EB] pt-4">
        <label className="block text-xs font-medium text-[#6B7280] mb-1">Or Add Subcategory</label>
        <div className="flex gap-2">
          <select
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            className="h-9 px-2 rounded border border-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-[#0D6EFD]"
          >
            <option value="">Select parent...</option>
            {parents.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <input
            type="text"
            value={subcategoryName}
            onChange={(e) => setSubcategoryName(e.target.value)}
            placeholder="Subcategory name"
            className="flex-1 h-9 px-3 rounded border border-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-[#0D6EFD]"
          />
          <button
            onClick={handleAddSub}
            disabled={saving || !subcategoryName.trim() || !parentId}
            className="h-9 px-4 rounded-lg bg-[#16A34A] text-white text-sm font-medium hover:bg-green-700 disabled:opacity-50"
          >
            Add
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="h-9 px-4 rounded-lg border border-[#E5E7EB] text-sm text-[#6B7280] hover:bg-gray-50"
        >
          Done
        </button>
      </div>
    </div>
  );
}

function AddSubcategoryForm({
  parentId,
  onSaved,
  slugPrefix,
}: {
  parentId: string;
  onSaved: () => void;
  slugPrefix: string;
}) {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleAdd() {
    if (!name.trim()) return;
    setSaving(true);
    const supabase = getBrowserSupabase();
    await supabase.from("categories").insert({
      name: name.trim(),
      slug: `${slugPrefix}-${generateSlugForName(name)}`,
      parent_id: parentId,
      sort_order: 1,
    });
    setName("");
    setSaving(false);
    onSaved();
  }

  return (
    <div className="flex items-center gap-2">
      <Plus size={14} className="text-[#6B7280]" />
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Add subcategory..."
        className="flex-1 h-8 px-2 rounded border border-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-[#0D6EFD]"
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
      />
      <button
        onClick={handleAdd}
        disabled={saving || !name.trim()}
        className="h-8 px-3 text-xs font-medium text-[#0D6EFD] hover:underline"
      >
        Add
      </button>
    </div>
  );
}

function InlineEdit({
  initialValue,
  onSave,
  onCancel,
}: {
  initialValue: string;
  onSave: (value: string) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState(initialValue);

  return (
    <div className="flex items-center gap-1">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="h-8 px-2 rounded border border-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-[#0D6EFD]"
        autoFocus
        onKeyDown={(e) => {
          if (e.key === "Enter") onSave(value);
          if (e.key === "Escape") onCancel();
        }}
      />
      <button onClick={() => onSave(value)} className="text-xs text-green-600 hover:underline">Save</button>
      <button onClick={onCancel} className="text-xs text-[#6B7280] hover:underline">Cancel</button>
    </div>
  );
}

function generateSlugForName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
