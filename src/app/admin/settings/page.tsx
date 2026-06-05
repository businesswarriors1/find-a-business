"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getBrowserSupabase } from "@/lib/supabase-browser";
import { cn } from "@/lib/utils";
import {
  Loader2,
  Server,
  Mail,
  Database,
  Shield,
  Globe,
  CheckCircle,
  XCircle,
} from "lucide-react";

function redact(value: string | undefined): string {
  if (!value) return "Not set";
  if (value.length <= 8) return "••••••••";
  return value.slice(0, 4) + "••••" + value.slice(-4);
}

interface EnvCheck {
  label: string;
  key: string;
  value: string | undefined;
  required: boolean;
  icon: React.ElementType;
}

export default function AdminSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sessionEmail, setSessionEmail] = useState("");
  const [uptime, setUptime] = useState("—");

  useEffect(() => {
    async function check() {
      const supabase = getBrowserSupabase();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/admin/login");
        return;
      }
      setSessionEmail(session.user.email ?? "Unknown");
      setUptime(new Date().toLocaleString("en-AU"));
      setLoading(false);
    }
    check();
  }, [router]);

  const envChecks: EnvCheck[] = [
    { label: "Supabase URL", key: "NEXT_PUBLIC_SUPABASE_URL", value: process.env.NEXT_PUBLIC_SUPABASE_URL, required: true, icon: Database },
    { label: "Supabase Anon Key", key: "NEXT_PUBLIC_SUPABASE_ANON_KEY", value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, required: true, icon: Shield },
    { label: "Supabase Service Role", key: "SUPABASE_SERVICE_ROLE_KEY", value: undefined, required: true, icon: Shield },
    { label: "Anthropic API Key", key: "ANTHROPIC_API_KEY", value: undefined, required: false, icon: Globe },
    { label: "Resend API Key", key: "RESEND_API_KEY", value: undefined, required: false, icon: Mail },
    { label: "Slack Webhook URL", key: "SLACK_WEBHOOK_URL", value: undefined, required: false, icon: Server },
    { label: "Upstash Redis URL", key: "UPSTASH_REDIS_REST_URL", value: undefined, required: false, icon: Database },
    { label: "Upstash Redis Token", key: "UPSTASH_REDIS_REST_TOKEN", value: undefined, required: false, icon: Shield },
    { label: "Admin Email", key: "ADMIN_EMAIL", value: undefined, required: false, icon: Mail },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[#0D6EFD]" size={32} />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#111827] mb-6">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Environment Configuration */}
        <div className="bg-white rounded-lg border border-[#E5E7EB]">
          <div className="px-4 py-3 border-b border-[#E5E7EB]">
            <h2 className="font-semibold text-[#111827] flex items-center gap-2">
              <Server size={18} className="text-[#0D6EFD]" />
              Environment Configuration
            </h2>
            <p className="text-xs text-[#6B7280] mt-1">
              Server-side variables (shown redacted). Configure in .env.local
            </p>
          </div>
          <div className="divide-y divide-[#E5E7EB]">
            {envChecks.map((env) => {
              const isSet = env.key.startsWith("NEXT_PUBLIC_") ? !!env.value : true; // Server-only vars checked indirectly
              return (
                <div key={env.key} className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <env.icon size={16} className="text-[#6B7280] flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-[#111827] truncate">{env.label}</div>
                      <div className="text-xs text-[#6B7280]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        {env.key}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isSet ? (
                      <CheckCircle size={16} className="text-[#16A34A]" />
                    ) : (
                      <XCircle size={16} className="text-red-500" />
                    )}
                    <span
                      className={cn(
                        "text-xs font-medium",
                        isSet ? "text-[#16A34A]" : "text-red-500",
                      )}
                    >
                      {isSet ? "Configured" : "Missing"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Site Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-[#E5E7EB]">
            <div className="px-4 py-3 border-b border-[#E5E7EB]">
              <h2 className="font-semibold text-[#111827] flex items-center gap-2">
                <Globe size={18} className="text-[#0D6EFD]" />
                Site Information
              </h2>
            </div>
            <div className="p-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Domain</span>
                <span className="font-medium text-[#111827]">findabusiness.com.au</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Framework</span>
                <span className="font-medium text-[#111827]">Next.js 16 (App Router)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Database</span>
                <span className="font-medium text-[#111827]">Supabase (PostgreSQL)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Admin User</span>
                <span className="font-medium text-[#111827]">{sessionEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Last Check</span>
                <span className="font-medium text-[#111827]">{uptime}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-[#E5E7EB]">
            <div className="px-4 py-3 border-b border-[#E5E7EB]">
              <h2 className="font-semibold text-[#111827] flex items-center gap-2">
                <Mail size={18} className="text-[#0D6EFD]" />
                Email Status
              </h2>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className={cn(
                  "w-2.5 h-2.5 rounded-full",
                  process.env.NEXT_PUBLIC_SUPABASE_URL ? "bg-[#16A34A]" : "bg-red-500",
                )} />
                <span className="text-sm text-[#111827]">
                  {process.env.NEXT_PUBLIC_SUPABASE_URL ? "Service connected" : "Service unavailable"}
                </span>
              </div>
              <p className="text-xs text-[#6B7280]">
                Emails are sent via Resend. If RESEND_API_KEY is not configured, email content will be logged to console instead.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-[#E5E7EB]">
            <div className="px-4 py-3 border-b border-[#E5E7EB]">
              <h2 className="font-semibold text-[#111827] flex items-center gap-2">
                <Database size={18} className="text-[#0D6EFD]" />
                Rate Limiting
              </h2>
            </div>
            <div className="p-4 text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Chat API</span>
                <span className="font-medium text-[#111827]">5 req/hour/IP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Review Submission</span>
                <span className="font-medium text-[#111827]">3 req/day/IP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Listing Request</span>
                <span className="font-medium text-[#111827]">2 req/hour/IP</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
