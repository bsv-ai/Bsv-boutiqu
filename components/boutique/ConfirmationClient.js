"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, MessageCircle } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { useCart } from "@/context/CartContext";
import { formatFCFA } from "@/lib/format";

export default function ConfirmationClient({ siteSettings }) {
  const { t } = useLang();
  const { lastOrder, ready } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (ready && !lastOrder) router.replace("/");
  }, [ready, lastOrder, router]);

  const message = useMemo(() => {
    if (!lastOrder) return "";
    const lines = [
      `🛍️ *${siteSettings.site_title}* — Nouvelle commande`,
      `${t.orderNumber}: ${lastOrder.orderNumber}`,
      "",
      ...lastOrder.items.map((it) => `• ${it.name} x${it.qty} — ${formatFCFA(it.price * it.qty)}`),
      "",
      `${t.total}: ${formatFCFA(lastOrder.total)}`,
      "",
      `${t.name}: ${lastOrder.form.name}`,
      `${t.phone}: ${lastOrder.form.phone}`,
      lastOrder.form.city ? `${t.city}: ${lastOrder.form.city}` : null,
      lastOrder.form.address ? `${t.address}: ${lastOrder.form.address}` : null,
      lastOrder.form.note ? `${t.note}: ${lastOrder.form.note}` : null,
    ].filter(Boolean);
    return lines.join("\n");
  }, [lastOrder, siteSettings, t]);

  if (!lastOrder) return null;

  const waLink = `https://wa.me/${siteSettings.whatsapp_number}?text=${encodeURIComponent(message)}`;

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "36px 18px 60px", textAlign: "center" }}>
      <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#EAF4EC", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
        <Check size={28} color="#2F7A4D" strokeWidth={2.5} />
      </div>
      <h1 className="disp" style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>{t.orderReceived}</h1>
      <p style={{ color: "#6E6E73", fontSize: 14, lineHeight: 1.55, marginBottom: 24 }}>{t.orderReceivedSub}</p>
      <div style={{ background: "#fff", border: "1px dashed #D8D7CF", borderRadius: 14, padding: "20px 18px", textAlign: "left", marginBottom: 24 }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: "#8A8A8E", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{t.orderNumber}</div>
        <div className="disp" style={{ fontSize: 20, fontWeight: 700, marginBottom: 14 }}>{lastOrder.orderNumber}</div>
        {lastOrder.items.map((it, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, padding: "5px 0", borderTop: i === 0 ? "1px solid #EFEFE9" : "none", color: "#3A3A3D" }}>
            <span>{it.name} x{it.qty}</span>
            <span style={{ fontWeight: 600 }}>{formatFCFA(it.price * it.qty)}</span>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 15, marginTop: 10, paddingTop: 10, borderTop: "1px solid #EFEFE9" }}>
          <span>{t.total}</span><span>{formatFCFA(lastOrder.total)}</span>
        </div>
      </div>
      <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, background: "#25D366", color: "#fff", textDecoration: "none", borderRadius: 12, padding: "15px 0", fontWeight: 800, fontSize: 15, marginBottom: 12 }}>
        <MessageCircle size={19} /> {t.sendWhatsapp}
      </a>
      <Link href="/" style={{ textDecoration: "none", display: "block", width: "100%", background: "none", border: "1px solid #E2E1D9", borderRadius: 12, padding: "13px 0", fontWeight: 700, fontSize: 14, color: "#111112" }}>{t.backHome}</Link>
    </div>
  );
}
