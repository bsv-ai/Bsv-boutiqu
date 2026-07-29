"use client";

import { useState } from "react";
import { Plus, Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatFCFA } from "@/lib/format";
import Field from "@/components/Field";

const EMPTY_PRODUCT = { id: null, active: true, price: 0, image_url: "", name_fr: "", desc_fr: "", long_fr: "", name_en: "", desc_en: "", long_en: "" };

export default function ProductsManager({ initialProducts }) {
  const [products, setProducts] = useState(initialProducts);
  const [editing, setEditing] = useState(null); // "new" | product | null
  const supabase = createClient();

  async function toggleActive(p) {
    setProducts(products.map((pr) => (pr.id === p.id ? { ...pr, active: !pr.active } : pr)));
    await supabase.from("bsv_products").update({ active: !p.active }).eq("id", p.id);
  }

  async function remove(id) {
    if (!window.confirm("Supprimer ce produit ?")) return;
    setProducts(products.filter((pr) => pr.id !== id));
    await supabase.from("bsv_products").delete().eq("id", id);
  }

  async function save(form) {
    if (editing === "new") {
      const { data } = await supabase.from("bsv_products").insert(form).select().single();
      if (data) setProducts([data, ...products]);
    } else {
      const { id, ...rest } = form;
      await supabase.from("bsv_products").update(rest).eq("id", id);
      setProducts(products.map((p) => (p.id === id ? { ...p, ...rest } : p)));
    }
    setEditing(null);
  }

  return (
    <div>
      {editing ? (
        <ProductEditor product={editing === "new" ? null : editing} onCancel={() => setEditing(null)} onSave={save} />
      ) : (
        <>
          <button onClick={() => setEditing("new")} style={{ display: "flex", alignItems: "center", gap: 6, background: "#C89B3C", color: "#111112", border: "none", borderRadius: 10, padding: "10px 16px", fontWeight: 700, fontSize: 13.5, marginBottom: 16 }}>
            <Plus size={15} /> Ajouter un produit
          </button>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {products.map((p) => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, background: "#fff", border: "1px solid #ECECE6", borderRadius: 12, padding: 10 }}>
                <img src={p.image_url} alt={p.name_fr} style={{ width: 50, height: 50, borderRadius: 8, objectFit: "cover", background: "#F0EFEA" }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{p.name_fr}</div>
                  <div style={{ fontSize: 12.5, color: "#6E6E73" }}>{formatFCFA(p.price)}</div>
                </div>
                <button onClick={() => toggleActive(p)} title={p.active ? "Actif" : "Inactif"} style={{ background: "none", border: "none", color: p.active ? "#2F7A4D" : "#B4463A", padding: 6 }}>
                  {p.active ? <Eye size={17} /> : <EyeOff size={17} />}
                </button>
                <button onClick={() => setEditing(p)} style={{ background: "none", border: "none", color: "#111112", padding: 6 }}><Pencil size={16} /></button>
                <button onClick={() => remove(p.id)} style={{ background: "none", border: "none", color: "#B4463A", padding: 6 }}><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ProductEditor({ product, onSave, onCancel }) {
  const [form, setForm] = useState(product || EMPTY_PRODUCT);
  return (
    <div style={{ background: "#fff", border: "1px solid #ECECE6", borderRadius: 14, padding: 18, marginBottom: 16 }}>
      <h3 className="disp" style={{ fontSize: 17, fontWeight: 600, marginBottom: 14 }}>{product ? "Modifier le produit" : "Ajouter un produit"}</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Field label="URL de l'image" value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} />
        <Field label="Prix (FCFA)" value={form.price} onChange={(v) => setForm({ ...form, price: Number(v) || 0 })} type="number" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 800, color: "#8A8A8E", marginBottom: 8 }}>FR</div>
            <Field label="Nom du produit" value={form.name_fr} onChange={(v) => setForm({ ...form, name_fr: v })} />
            <div style={{ height: 10 }} />
            <Field label="Description courte" value={form.desc_fr} onChange={(v) => setForm({ ...form, desc_fr: v })} />
          </div>
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 800, color: "#8A8A8E", marginBottom: 8 }}>EN</div>
            <Field label="Nom du produit" value={form.name_en} onChange={(v) => setForm({ ...form, name_en: v })} />
            <div style={{ height: 10 }} />
            <Field label="Description courte" value={form.desc_en} onChange={(v) => setForm({ ...form, desc_en: v })} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
          <button
            onClick={() => onSave({ ...form, long_fr: form.long_fr || form.desc_fr, long_en: form.long_en || form.desc_en })}
            style={{ flex: 1, background: "#111112", color: "#fff", border: "none", borderRadius: 10, padding: "11px 0", fontWeight: 700, fontSize: 13.5 }}
          >
            Enregistrer
          </button>
          <button onClick={onCancel} style={{ flex: 1, background: "none", border: "1px solid #E2E1D9", borderRadius: 10, padding: "11px 0", fontWeight: 700, fontSize: 13.5 }}>Annuler</button>
        </div>
      </div>
    </div>
  );
}
