"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { useCart } from "@/context/CartContext";
import { createClient } from "@/lib/supabase/client";
import { formatFCFA, genOrderNumber } from "@/lib/format";
import Field from "@/components/Field";

export default function CheckoutClient({ products }) {
  const { lang, t } = useLang();
  const { cart, clearCart, setLastOrder } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", phone: "", city: "", address: "", note: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const cartTotal = cart.reduce((sum, c) => {
    const p = products.find((pr) => pr.id === c.id);
    return p ? sum + p.price * c.qty : sum;
  }, 0);

  async function submit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setError(t.fillRequired);
      return;
    }
    setError("");
    setLoading(true);

    const items = cart.map((c) => {
      const p = products.find((pr) => pr.id === c.id);
      const name = p ? (lang === "en" ? p.name_en || p.name_fr : p.name_fr) : c.id;
      return { name, qty: c.qty, price: p ? p.price : 0 };
    });
    const orderNumber = genOrderNumber();

    const supabase = createClient();
    const { error: insertError } = await supabase.from("orders").insert({
      order_number: orderNumber,
      items,
      total: cartTotal,
      customer_name: form.name,
      customer_phone: form.phone,
      customer_city: form.city,
      customer_address: form.address,
      note: form.note,
    });

    setLoading(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }

    setLastOrder({ orderNumber, items, total: cartTotal, form, date: new Date().toISOString() });
    clearCart();
    router.push("/confirmation");
  }

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "24px 18px 60px" }}>
      <button onClick={() => router.push("/panier")} style={{ background: "none", border: "none", display: "flex", alignItems: "center", gap: 6, color: "#6E6E73", fontSize: 13.5, fontWeight: 600, marginBottom: 16, padding: 0 }}>
        <ArrowLeft size={15} /> {t.back}
      </button>
      <h1 className="disp" style={{ fontSize: 24, fontWeight: 600, marginBottom: 6 }}>{t.checkoutTitle}</h1>
      <p style={{ fontSize: 13, color: "#6E6E73", marginBottom: 22 }}>{t.payDelivery}</p>
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Field label={`${t.name} *`} value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
        <Field label={`${t.phone} *`} value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} type="tel" />
        <Field label={t.city} value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
        <Field label={t.address} value={form.address} onChange={(v) => setForm({ ...form, address: v })} />
        <div>
          <label style={{ fontSize: 12.5, fontWeight: 700, color: "#6E6E73", display: "block", marginBottom: 6 }}>{t.note}</label>
          <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder={t.notePlaceholder} rows={3} style={{ width: "100%", border: "1px solid #E2E1D9", borderRadius: 10, padding: "11px 13px", fontSize: 14.5, resize: "vertical" }} />
        </div>
        {error && <div style={{ color: "#B4463A", fontSize: 13, fontWeight: 600 }}>{error}</div>}
        <div style={{ background: "#F5F4EF", borderRadius: 12, padding: 14, marginTop: 4 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 4 }}>
            <span style={{ color: "#6E6E73" }}>{t.subtotal}</span>
            <span style={{ fontWeight: 700 }}>{formatFCFA(cartTotal)}</span>
          </div>
          <div style={{ fontSize: 11.5, color: "#8A8A8E" }}>{t.deliveryNote}</div>
        </div>
        <button type="submit" disabled={loading} style={{ width: "100%", background: "#111112", color: "#fff", border: "none", borderRadius: 12, padding: "15px 0", fontWeight: 800, fontSize: 15.5, marginTop: 6, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: loading ? 0.7 : 1 }}>
          {loading && <Loader2 size={16} className="spin" />}
          {t.placeOrder}
        </button>
      </form>
    </div>
  );
}
