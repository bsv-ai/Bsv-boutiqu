"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Field from "@/components/Field";

export default function ContactsPanel({ initialSettings }) {
  const [form, setForm] = useState(initialSettings);
  const [savedFlash, setSavedFlash] = useState(false);
  const supabase = createClient();

  async function save() {
    await supabase
      .from("bsv_site_settings")
      .update({
        whatsapp_number: form.whatsapp_number,
        phone_number: form.phone_number,
        channel_link: form.channel_link,
        facebook_link: form.facebook_link,
        tiktok_link: form.tiktok_link,
      })
      .eq("id", 1);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1600);
  }

  return (
    <div style={{ maxWidth: 480 }}>
      <div style={{ background: "#fff", border: "1px solid #ECECE6", borderRadius: 14, padding: 18 }}>
        <h3 className="disp" style={{ fontSize: 17, fontWeight: 600, marginBottom: 4 }}>Coordonnées Bâtir Sa Valeur</h3>
        <p style={{ fontSize: 12.5, color: "#8A8A8E", marginBottom: 16, lineHeight: 1.4 }}>Ces coordonnées apparaissent sur le site (accueil, footer) et reçoivent les commandes.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Field label="Numéro WhatsApp (réception des commandes)" value={form.whatsapp_number} onChange={(v) => setForm({ ...form, whatsapp_number: v })} />
          <Field label="Numéro de téléphone" value={form.phone_number} onChange={(v) => setForm({ ...form, phone_number: v })} />
          <Field label="Lien de la chaîne WhatsApp" value={form.channel_link} onChange={(v) => setForm({ ...form, channel_link: v })} />
          <Field label="Lien de la page Facebook" value={form.facebook_link} onChange={(v) => setForm({ ...form, facebook_link: v })} />
          <Field label="Lien du compte TikTok" value={form.tiktok_link} onChange={(v) => setForm({ ...form, tiktok_link: v })} />
        </div>
        <button onClick={save} style={{ marginTop: 14, background: savedFlash ? "#2F7A4D" : "#111112", color: "#fff", border: "none", borderRadius: 10, padding: "11px 18px", fontWeight: 700, fontSize: 13.5 }}>
          {savedFlash ? "Enregistré ✓" : "Enregistrer"}
        </button>
      </div>
    </div>
  );
}
