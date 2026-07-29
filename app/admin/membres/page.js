import { createClient } from "@/lib/supabase/server";

export default async function AdminMembresPage() {
  const supabase = createClient();
  const [{ data: members }, { data: progress }, { data: prospects }] = await Promise.all([
    supabase.from("profiles").select("*").eq("role", "member").order("created_at", { ascending: false }),
    supabase.from("member_progress").select("member_id").eq("completed", true),
    supabase.from("prospects").select("member_id"),
  ]);

  const progressCount = {};
  (progress || []).forEach((r) => (progressCount[r.member_id] = (progressCount[r.member_id] || 0) + 1));
  const prospectCount = {};
  (prospects || []).forEach((r) => (prospectCount[r.member_id] = (prospectCount[r.member_id] || 0) + 1));

  return (
    <div>
      <div style={{ fontSize: 12.5, color: "#6E6E73", marginBottom: 14 }}>{(members || []).length} membres ADN</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {(members || []).length === 0 && <p style={{ fontSize: 13, color: "#8A8A8E" }}>Aucun membre pour le moment.</p>}
        {(members || []).map((m) => {
          const done = progressCount[m.id] || 0;
          const pct = Math.round((done / 6) * 100);
          return (
            <div key={m.id} style={{ background: "#fff", border: "1px solid #ECECE6", borderRadius: 12, padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{m.full_name || "Membre sans nom"}</div>
                  <div style={{ fontSize: 12, color: "#8A8A8E" }}>{m.phone || "—"} · membre depuis le {new Date(m.created_at).toLocaleDateString("fr-FR")}</div>
                </div>
                <div style={{ fontSize: 12.5, color: "#6E6E73" }}>{prospectCount[m.id] || 0} prospects</div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, fontWeight: 700, marginBottom: 6, color: "#6E6E73" }}>
                <span>Parcours</span><span>{done}/6 ({pct}%)</span>
              </div>
              <div style={{ height: 6, borderRadius: 999, background: "#F0EFEA", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: "#C89B3C" }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
