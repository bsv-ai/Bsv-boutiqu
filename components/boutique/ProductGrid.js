"use client";

import Link from "next/link";
import { formatFCFA } from "@/lib/format";
import { productInfo } from "@/lib/products";

export default function ProductGrid({ products, lang, orderLabel }) {
  if (products.length === 0) return <p style={{ color: "#6E6E73" }}>—</p>;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
      {products.map((p) => {
        const info = productInfo(p, lang);
        return (
          <div key={p.id} style={{ background: "#fff", borderRadius: 14, overflow: "hidden", border: "1px solid #ECECE6", display: "flex", flexDirection: "column" }}>
            <Link href={`/produit/${p.id}`} style={{ textDecoration: "none", display: "block" }}>
              <div style={{ aspectRatio: "1/1", overflow: "hidden", background: "#F0EFEA" }}>
                <img src={p.image_url} alt={info.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
              </div>
            </Link>
            <div style={{ padding: "12px 14px 14px" }}>
              <Link href={`/produit/${p.id}`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                <div style={{ fontWeight: 600, fontSize: 14.5, lineHeight: 1.3, marginBottom: 3 }}>{info.name}</div>
                <div style={{ fontSize: 12.5, color: "#6E6E73", marginBottom: 8, lineHeight: 1.4 }}>{info.desc}</div>
                <div style={{ fontWeight: 800, fontSize: 15 }}>{formatFCFA(p.price)}</div>
              </Link>
              <Link
                href={`/produit/${p.id}`}
                style={{ textDecoration: "none", marginTop: 10, width: "100%", background: "#111112", color: "#fff", border: "none", borderRadius: 8, padding: "9px 0", fontSize: 13, fontWeight: 700, display: "block", textAlign: "center" }}
              >
                {orderLabel || "→"}
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
