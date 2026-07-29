"use client";

import { useState } from "react";
import { Plus, Phone, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { STATUSES, STATUS_COLORS, DARK, inputStyle } from "@/lib/theme";

export default function CRMClient({ memberId, initialProspects }) {
  const [prospects, setProspects] = useState(initialProspects);
  const [filter, setFilter] = useState("Tous");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", note: "" });
  const supabase = createClient();

  const filtered = filter === "Tous" ? prospects : prospects.filter((p) => p.status === filter);
  const priority = prospects.filter((p) => p.status === "Intéressé" || p.status === "Contacté");

  async function addProspect() {
    if (!form.name.trim() || !form.phone.trim()) return;
    const { data, error } = await supabase
      .from("bsv_prospects")
      .insert({ member_id: memberId, name: form.name, phone: form.phone, status: "Nouveau", note: form.note })
      .select()
      .single();
    if (!error && data) setProspects([data, ...prospects]);
    setForm({ name: "", phone: "", note: "" });
    setShowForm(false);
  }

  async function updateStatus(id, status) {
    setProspects(prospects.map((p) => (p.id === id ? { ...p, status } : p)));
    await supabase.from("bsv_prospects").update({ status }).eq("id", id);
  }

  async function remove(id) {
    setProspects(prospects.filter((p) => p.id !== id));
    await supabase.from("bsv_prospects").delete().eq("id", id);
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontSize: 12.5, color: "#6E6E73" }}>{prospects.length} prospects · {priority.length} à prioriser</div>
        <button onClick={() => setShowForm(true)} style={{ display: "flex", alignItems: "center", gap: 5, background: DARK, color: "#fff", border: "none", borderRadius: 9, padding: "8px 13px", fontSize: 12.5, fontWeight: 700 }}>
          <Plus size={14} /> Ajouter
        </button>
      </div>

      {showForm && (
        <div style={{ background: "#fff", border: "1px solid #ECECE6", borderRadius: 14, padding: 14, marginBottom: 14 }}>
          <input placeholder="Nom" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} />
          <input placeholder="Téléphone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={{ ...inputStyle, marginTop: 8 }} />
          <input placeholder="Note (optionnel)" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} style={{ ...inputStyle, marginTop: 8 }} />
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button onClick={addProspect} style={{ flex: 1, background: "#C89B3C", color: DARK, border: "none", borderRadius: 9, padding: "9px 0", fontWeight: 700, fontSize: 13 }}>Enregistrer</button>
            <button onClick={() => setShowForm(false)} style={{ flex: 1, background: "none", border: "1px solid #E2E1D9", borderRadius: 9, padding: "9px 0", fontWeight: 700, fontSize: 13 }}>Annuler</button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 14, paddingBottom: 2 }}>
        {["Tous", ...STATUSES].map((s) => (
          <button key={s} onClick={() => setFilter(s)} style={{ whiteSpace: "nowrap", border: filter === s ? "1px solid " + DARK : "1px solid #E2E1D9", background: filter === s ? DARK : "#fff", color: filter === s ? "#fff" : DARK, borderRadius: 999, padding: "6px 12px", fontSize: 12, fontWeight: 700 }}>{s}</button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.length === 0 && <p style={{ fontSize: 13, color: "#8A8A8E" }}>Aucun prospect dans cette catégorie.</p>}
        {filtered.map((p) => (
          <div key={p.id} style={{ background: "#fff", border: "1px solid #ECECE6", borderRadius: 14, padding: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: "#8A8A8E", display: "flex", alignItems: "center", gap: 4 }}><Phone size={11} /> {p.phone}</div>
              </div>
              <button onClick={() => remove(p.id)} style={{ background: "none", border: "none", color: "#B4463A", padding: 4 }}><Trash2 size={15} /></button>
            </div>
            {p.note && <div style={{ fontSize: 12.5, color: "#6E6E73", marginBottom: 10, lineHeight: 1.4 }}>{p.note}</div>}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {STATUSES.map((s) => (
                <button key={s} onClick={() => updateStatus(p.id, s)} style={{ fontSize: 11, fontWeight: 700, padding: "5px 9px", borderRadius: 999, border: "1px solid " + (p.status === s ? STATUS_COLORS[s] : "#E2E1D9"), background: p.status === s ? STATUS_COLORS[s] : "#fff", color: p.status === s ? "#fff" : "#6E6E73" }}>{s}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
