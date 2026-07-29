"use client";

import Link from "next/link";
import { ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { useCart } from "@/context/CartContext";
import { formatFCFA } from "@/lib/format";
import { productInfo } from "@/lib/products";

export default function CartClient({ products }) {
  const { lang, t } = useLang();
  const { cart, updateCartQty, removeFromCart, ready } = useCart();

  const cartTotal = cart.reduce((sum, c) => {
    const p = products.find((pr) => pr.id === c.id);
    return p ? sum + p.price * c.qty : sum;
  }, 0);

  if (!ready) return null;

  if (cart.length === 0) {
    return (
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "60px 18px", textAlign: "center" }}>
        <ShoppingBag size={40} strokeWidth={1.3} color="#C9C9C3" style={{ marginBottom: 14 }} />
        <p style={{ color: "#6E6E73", marginBottom: 20 }}>{t.emptyCart}</p>
        <Link href="/catalogue" style={{ textDecoration: "none", background: "#111112", color: "#fff", border: "none", borderRadius: 10, padding: "12px 22px", fontWeight: 700 }}>{t.browse}</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "24px 18px 140px" }}>
      <h1 className="disp" style={{ fontSize: 24, fontWeight: 600, marginBottom: 20 }}>{t.yourCart}</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {cart.map((c) => {
          const p = products.find((pr) => pr.id === c.id);
          if (!p) return null;
          const info = productInfo(p, lang);
          return (
            <div key={c.id} style={{ display: "flex", gap: 12, background: "#fff", border: "1px solid #ECECE6", borderRadius: 12, padding: 10 }}>
              <img src={p.image_url} alt={info.name} style={{ width: 68, height: 68, borderRadius: 8, objectFit: "cover", background: "#F0EFEA" }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{info.name}</div>
                <div style={{ fontSize: 13, color: "#6E6E73", marginBottom: 8 }}>{formatFCFA(p.price)} {t.each}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <button onClick={() => updateCartQty(c.id, c.qty - 1)} style={{ width: 26, height: 26, borderRadius: 7, border: "1px solid #E2E1D9", background: "#fff" }}><Minus size={12} /></button>
                  <span style={{ fontWeight: 700, fontSize: 13.5, minWidth: 16, textAlign: "center" }}>{c.qty}</span>
                  <button onClick={() => updateCartQty(c.id, c.qty + 1)} style={{ width: 26, height: 26, borderRadius: 7, border: "1px solid #E2E1D9", background: "#fff" }}><Plus size={12} /></button>
                  <button onClick={() => removeFromCart(c.id)} style={{ marginLeft: "auto", background: "none", border: "none", color: "#B4463A", display: "flex", alignItems: "center", gap: 4, fontSize: 12.5, fontWeight: 600 }}><Trash2 size={13} /> {t.remove}</button>
                </div>
              </div>
              <div style={{ fontWeight: 800, fontSize: 14, whiteSpace: "nowrap" }}>{formatFCFA(p.price * c.qty)}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1px solid #ECECE6", padding: "14px 18px", boxShadow: "0 -4px 16px rgba(0,0,0,0.04)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 15 }}>
            <span style={{ fontWeight: 600 }}>{t.total}</span>
            <span style={{ fontWeight: 800 }}>{formatFCFA(cartTotal)}</span>
          </div>
          <Link href="/checkout" style={{ textDecoration: "none", display: "block", textAlign: "center", width: "100%", background: "#C89B3C", color: "#111112", border: "none", borderRadius: 12, padding: "14px 0", fontWeight: 800, fontSize: 15 }}>{t.checkout}</Link>
        </div>
      </div>
    </div>
  );
}
