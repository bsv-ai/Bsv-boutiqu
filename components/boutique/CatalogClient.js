"use client";

import { useLang } from "@/context/LangContext";
import ProductGrid from "./ProductGrid";

export default function CatalogClient({ products }) {
  const { lang, t } = useLang();
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 18px 60px" }}>
      <h1 className="disp" style={{ fontSize: 28, fontWeight: 600, marginBottom: 22 }}>{t.ourProducts}</h1>
      <ProductGrid products={products} lang={lang} orderLabel={t.order} />
    </div>
  );
}
