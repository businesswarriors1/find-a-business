"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Loader2, LogIn } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) { setError(signInError.message); setLoading(false); return; }
      router.push("/admin");
    } catch (err: any) {
      setError(err?.message ?? "Login failed.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3F4F6] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#111827]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <span className="text-[#0D6EFD]">Find</span> a Business
          </h1>
          <p className="text-[#6B7280] text-sm mt-1">Admin Panel</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-[#E5E7EB] p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#111827] mb-4">Sign In</h2>
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#111827] mb-1">Email</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full h-11 px-3 rounded border border-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-[#0D6EFD] focus:border-transparent"
                placeholder="admin@findabusiness.com.au" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#111827] mb-1">Password</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="w-full h-11 px-3 rounded border border-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-[#0D6EFD] focus:border-transparent"
                placeholder="••••••••" />
            </div>
          </div>
          <button type="submit" disabled={loading}
            className={cn("w-full mt-6 h-11 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2",
              "bg-[#F97316] text-white hover:bg-[#EA580C]", loading && "opacity-50 cursor-not-allowed")}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : <LogIn size={18} />} Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
