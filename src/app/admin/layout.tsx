"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Building2,
  Star,
  FolderTree,
  MapPin,
  Settings,
  Menu,
  X,
  LogOut,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/requests", label: "Listing Requests", icon: FileText },
  { href: "/admin/businesses", label: "Businesses", icon: Building2 },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/suburbs", label: "Suburbs", icon: MapPin },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#F3F4F6] font-sans">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#111827] text-white flex flex-col transition-transform",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <Link href="/admin" className="text-lg font-bold tracking-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <span className="text-[#0D6EFD]">Find</span> a Business
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 hover:bg-gray-700 rounded"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                  "font-medium",
                  isActive
                    ? "bg-[#0D6EFD] text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white",
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-700">
          <button
            onClick={async () => {
              const { getBrowserSupabase } = await import("@/lib/supabase-browser");
              const supabase = getBrowserSupabase();
              await supabase.auth.signOut();
              window.location.href = "/admin/login";
            }}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-[#E5E7EB] bg-white flex items-center px-4 gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          <span className="text-xs text-gray-400" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            findabusiness.com.au
          </span>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
