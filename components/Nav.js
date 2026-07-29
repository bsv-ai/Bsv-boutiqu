"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ShoppingBag, User, LogOut, Globe } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useCart } from "@/context/CartContext";
import { useLang } from "@/context/LangContext";
import { DARK, ACCENT_DEFAULT } from "@/lib/theme";

export default function Nav({ siteTitle = "Bâtir Sa Valeur", accent = ACCENT_DEFAULT }) {
  const pathname = usePathname();
  const router = useRouter();
  const { cart } = useCart();
  const { lang, setLang, t } = useLang();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(async ({ data }) => {
      if (!mounted) return;
      setUser(data.user || null);
      if (data.user) {
        const { data: profile } = await supabase.from("bsv_profiles").select("role").eq("id", data.user.id).single();
        if (mounted) setRole(profile?.role || "member");
      }
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (!session?.user) setRole(null);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const inADN = pathname?.startsWith("/adn");
  const inAdmin = pathname?.startsWith("/admin");

  async function logout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (inAdmin) return null; // admin has its own header

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(250,250,247,0.92)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid #ECECE6",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "12px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8, color: DARK }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: DARK, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span className="disp" style={{ color: accent, fontWeight: 700, fontSize: 16 }}>{siteTitle.charAt(0)}</span>
          </div>
          <span className="disp" style={{ fontWeight: 600, fontSize: 17, letterSpacing: "-0.01em" }}>{siteTitle}</span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", background: "#F0EFEA", border: "1px solid #E2E1D9", borderRadius: 999, padding: 3 }}>
            <Link
              href="/"
              style={{
                textDecoration: "none",
                padding: "6px 12px",
                borderRadius: 999,
                fontSize: 12.5,
                fontWeight: 700,
                color: !inADN ? "#fff" : DARK,
                background: !inADN ? DARK : "transparent",
              }}
            >
              Boutique
            </Link>
            <Link
              href="/adn"
              style={{
                textDecoration: "none",
                padding: "6px 12px",
                borderRadius: 999,
                fontSize: 12.5,
                fontWeight: 700,
                color: inADN ? "#fff" : DARK,
                background: inADN ? DARK : "transparent",
              }}
            >
              Espace ADN
            </Link>
          </div>

          {!inADN && (
            <button
              onClick={() => setLang(lang === "fr" ? "en" : "fr")}
              style={{ display: "flex", alignItems: "center", gap: 5, background: "#F0EFEA", border: "1px solid #E2E1D9", borderRadius: 999, padding: "6px 11px", fontSize: 12.5, fontWeight: 600, color: DARK }}
            >
              <Globe size={13} /> {t.langBtn}
            </button>
          )}

          {!inADN && (
            <Link href="/panier" style={{ position: "relative", padding: 6, color: DARK }}>
              <ShoppingBag size={21} strokeWidth={1.8} />
              {cartCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: -2,
                    right: -2,
                    background: accent,
                    color: DARK,
                    fontSize: 10,
                    fontWeight: 800,
                    borderRadius: 999,
                    minWidth: 16,
                    height: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 3px",
                  }}
                >
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {role === "admin" && (
                <Link
                  href="/admin"
                  style={{ textDecoration: "none", fontSize: 12, fontWeight: 700, color: DARK, border: "1px solid #E2E1D9", borderRadius: 999, padding: "6px 10px" }}
                >
                  Admin
                </Link>
              )}
              <button onClick={logout} title="Se déconnecter" style={{ background: "none", border: "none", padding: 6, color: "#6E6E73", display: "flex" }}>
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link
              href="/connexion"
              style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, color: "#fff", background: DARK, borderRadius: 999, padding: "7px 13px" }}
            >
              <User size={14} /> Connexion
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
