"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, Phone, Settings, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const TABS = [
  { href: "/admin", icon: LayoutDashboard, label: "Aperçu" },
  { href: "/admin/produits", icon: Package, label: "Produits" },
  { href: "/admin/contacts", icon: Phone, label: "Contacts" },
  { href: "/admin/reglages", icon: Settings, label: "Réglages" },
  { href: "/admin/membres", icon: Users, label: "Membres ADN" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function logout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 22, overflowX: "auto", paddingBottom: 2 }}>
      {TABS.map(({ href, icon: Icon, label }) => {
        const active = href === "/admin" ? pathname === "/admin" : pathname?.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 14px",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 700,
              whiteSpace: "nowrap",
              border: active ? "1px solid #111112" : "1px solid #E2E1D9",
              background: active ? "#111112" : "#fff",
              color: active ? "#fff" : "#111112",
            }}
          >
            <Icon size={14} /> {label}
          </Link>
        );
      })}
      <button onClick={logout} style={{ marginLeft: "auto", background: "none", border: "1px solid #E2E1D9", borderRadius: 999, padding: "8px 14px", fontSize: 12.5, fontWeight: 700, whiteSpace: "nowrap" }}>
        Se déconnecter
      </button>
    </div>
  );
}
