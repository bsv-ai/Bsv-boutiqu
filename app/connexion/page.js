"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { DARK, inputStyle } from "@/lib/theme";

function ConnexionForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/adn";
  const supabase = createClient();

  const [mode, setMode] = useState("login"); // login | signup | magic
  const [form, setForm] = useState({ email: "", password: "", fullName: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [magicSent, setMagicSent] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        const { error: err } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
        if (err) throw err;
        router.push(next);
        router.refresh();
      } else if (mode === "signup") {
        const { error: err } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: { data: { full_name: form.fullName } },
        });
        if (err) throw err;
        router.push(next);
        router.refresh();
      } else {
        const { error: err } = await supabase.auth.signInWithOtp({
          email: form.email,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
        });
        if (err) throw err;
        setMagicSent(true);
      }
    } catch (err) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 380, margin: "60px auto", padding: "0 18px" }}>
      <div style={{ textAlign: "center", marginBottom: 22 }}>
        <h1 className="disp" style={{ fontSize: 22, fontWeight: 600 }}>Espace membre ADN</h1>
        <p style={{ fontSize: 13, color: "#6E6E73", marginTop: 6 }}>Connectez-vous pour accéder à votre communauté, votre parcours et votre CRM.</p>
      </div>

      <div style={{ display: "flex", background: "#F0EFEA", border: "1px solid #E2E1D9", borderRadius: 999, padding: 3, marginBottom: 18 }}>
        {[
          ["login", "Connexion"],
          ["signup", "Créer un compte"],
          ["magic", "Lien magique"],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => { setMode(key); setError(""); setMagicSent(false); }}
            style={{
              flex: 1,
              padding: "7px 6px",
              borderRadius: 999,
              fontSize: 11.5,
              fontWeight: 700,
              border: "none",
              color: mode === key ? "#fff" : DARK,
              background: mode === key ? DARK : "transparent",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {magicSent ? (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <Mail size={26} color="#2F7A4D" style={{ marginBottom: 10 }} />
          <p style={{ fontSize: 13.5, color: "#3A3A3D" }}>Un lien de connexion a été envoyé à <strong>{form.email}</strong>. Ouvrez-le pour vous connecter.</p>
        </div>
      ) : (
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {mode === "signup" && (
            <input placeholder="Nom complet" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} style={inputStyle} />
          )}
          <input type="email" required placeholder="Adresse email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} />
          {mode !== "magic" && (
            <input type="password" required placeholder="Mot de passe" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} style={inputStyle} />
          )}
          {error && <div style={{ color: "#B4463A", fontSize: 13, fontWeight: 600 }}>{error}</div>}
          <button type="submit" disabled={loading} style={{ background: DARK, color: "#fff", border: "none", borderRadius: 10, padding: "12px 0", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: loading ? 0.7 : 1 }}>
            {loading && <Loader2 size={15} className="spin" />}
            {mode === "login" ? "Se connecter" : mode === "signup" ? "Créer mon compte" : "Recevoir le lien"}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ConnexionPage() {
  return (
    <Suspense fallback={null}>
      <ConnexionForm />
    </Suspense>
  );
}
