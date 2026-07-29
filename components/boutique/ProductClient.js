"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Minus, Plus, Check, ShoppingBag } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { useCart } from "@/context/CartContext";
import { formatFCFA } from "@/lib/format";
import { productInfo } from "@/lib/products";

export default function ProductClient({ product }) {
  const { lang, t } = useLang();
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <Link href="/catalogue">{t.back}</Link>
      </div>
    );
  }

  const info = productInfo(product, lang);

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "20px 18px 100px" }}>
      <Link href="/catalogue" style={{ textDecoration: "none", background: "none", border: "none", display: "flex", alignItems: "center", gap: 6, color: "#6E6E73", fontSize: 13.5, fontWeight: 600, marginBottom: 16, padding: 0 }}>
        <ArrowLeft size={15} /> {t.back}
      </Link>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>
        <div style={{ borderRadius: 16, overflow: "hidden", background: "#F0EFEA", aspectRatio: "4/3" }}>
          <img src={product.image_url} alt={info.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div>
          <h1 className="disp" style={{ fontSize: 26, fontWeight: 600, marginBottom: 8 }}>{info.name}</h1>
          <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>{formatFCFA(product.price)}</div>
          <div style={{ marginBottom: 4, fontSize: 12.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#6E6E73" }}>{t.description}</div>
          <p style={{ color: "#3A3A3D", lineHeight: 1.6, marginBottom: 22, fontSize: 15 }}>{info.long}</p>
          <div style={{ marginBottom: 4, fontSize: 12.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#6E6E73" }}>{t.quantity}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={{ width: 38, height: 38, borderRadius: 10, border: "1px solid #E2E1D9", background: "#fff" }}><Minus size={16} /></button>
            <span style={{ fontSize: 17, fontWeight: 700, minWidth: 24, textAlign: "center" }}>{qty}</span>
            <button onClick={() => setQty((q) => q + 1)} style={{ width: 38, height: 38, borderRadius: 10, border: "1px solid #E2E1D9", background: "#fff" }}><Plus size={16} /></button>
          </div>
          <button
            onClick={() => { addToCart(product.id, qty); setAdded(true); setTimeout(() => setAdded(false), 1400); }}
            style={{ width: "100%", background: added ? "#2F7A4D" : "#111112", color: "#fff", border: "none", borderRadius: 12, padding: "15px 0", fontWeight: 700, fontSize: 15.5, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
          >
            {added ? (<><Check size={17} /> {t.added}</>) : (<><ShoppingBag size={17} /> {t.addToCart}</>)}
          </button>
        </div>
      </div>
    </div>
  );
}
