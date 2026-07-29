"use client";

import { useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Field from "@/components/Field";

export default function SettingsPanel({ initialSettings }) {
  const [form, setForm] = useState(initialSettings);
  const [savedFlash, setSavedFlash] = useState(false);
  const supabase = createClient();

  async function save(next) {
    setForm(next);
    await supabase
      .from("site_settings")
      .update({ site_title: next.site_title, cover_image_url: next.cover_image_url, accent_color: next.accent_color })
      .eq("id", 1);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1600);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 420 }}>
      <Field label="Nom du site" value={form.site_title} onChange={(v) => setForm({ ...form, site_title: v })} />
      <div>
        <label style={{ fontSize: 12.5, fontWeight: 700, color: "#6E6E73", display: "block", marginBottom: 6 }}>Photo de couverture</label>
        <input
          type="text"
          value={form.cover_image_url}
          onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })}
          style={{ width: "100%", border: "1px solid #E2E1D9", borderRadius: 10, padding: "11px 13px", fontSize: 13.5, marginBottom: 6 }}
        />
        <div style={{ fontSize: 11.5, color: "#8A8A8E", marginBottom: 10 }}>URL de l&apos;image affichée en haut de la page d&apos;accueil.</div>
        <div style={{ borderRadius: 10, overflow: "hidden", border: "1px solid #ECECE6", aspectRatio: "16/7", background: "#F0EFEA", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {form.cover_image_url ? (
            <img src={form.cover_image_url} alt="cover preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <ImageIcon size={20} color="#B0B0AA" />
          )}
        </div>
      </div>
      <div>
        <label style={{ fontSize: 12.5, fontWeight: 700, color: "#6E6E73", display: "block", marginBottom: 6 }}>Couleur principale</label>
        <input type="color" value={form.accent_color} onChange={(e) => setForm({ ...form, accent_color: e.target.value })} style={{ width: 60, height: 38, border: "1px solid #E2E1D9", borderRadius: 8, padding: 2 }} />
      </div>
      <button onClick={() => save(form)} style={{ background: savedFlash ? "#2F7A4D" : "#111112", color: "#fff", border: "none", borderRadius: 10, padding: "11px 18px", fontWeight: 700, fontSize: 13.5, alignSelf: "flex-start" }}>
        {savedFlash ? "Enregistré ✓" : "Enregistrer"}
      </button>
    </div>
  );
}
