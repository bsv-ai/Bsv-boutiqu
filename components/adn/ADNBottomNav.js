"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Compass, ListChecks, Bot } from "lucide-react";
import { DARK } from "@/lib/theme";

const TABS = [
  { href: "/adn", icon: Users, label: "Communauté" },
  { href: "/adn/parcours", icon: Compass, label: "Parcours" },
  { href: "/adn/crm", icon: ListChecks, label: "CRM" },
  { href: "/adn/assistant", icon: Bot, label: "Assistant IA" },
];

export default function ADNBottomNav() {
  const pathname = usePathname();
  return (
    <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1px solid #ECECE6", display: "flex", padding: "8px 6px", boxShadow: "0 -4px 16px rgba(0,0,0,0.04)", zIndex: 40 }}>
      {TABS.map(({ href, icon: Icon, label }) => {
        const active = href === "/adn" ? pathname === "/adn" : pathname?.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            style={{ flex: 1, textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "none", border: "none", padding: "6px 0", color: active ? DARK : "#B0B0AA" }}
          >
            <Icon size={18} color={active ? "#C89B3C" : "#B0B0AA"} />
            <span style={{ fontSize: 10.5, fontWeight: 700 }}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
