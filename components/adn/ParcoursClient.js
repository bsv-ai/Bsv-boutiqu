"use client";

import { useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { STEPS } from "@/lib/theme";

export default function ParcoursClient({ memberId, initialProgress }) {
  const [progress, setProgress] = useState(initialProgress);
  const supabase = createClient();

  const done = STEPS.filter((s) => progress[s.id]).length;
  const pct = Math.round((done / STEPS.length) * 100);

  async function toggleStep(id) {
    const nextCompleted = !progress[id];
    setProgress((prev) => ({ ...prev, [id]: nextCompleted }));
    await supabase.from("bsv_member_progress").upsert(
      { member_id: memberId, step_id: id, completed: nextCompleted, completed_at: nextCompleted ? new Date().toISOString() : null },
      { onConflict: "member_id,step_id" }
    );
  }

  return (
    <div>
      <div style={{ background: "#fff", border: "1px solid #ECECE6", borderRadius: 14, padding: 16, marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, fontWeight: 700, marginBottom: 8 }}>
          <span>Progression</span><span>{pct}%</span>
        </div>
        <div style={{ height: 8, borderRadius: 999, background: "#F0EFEA", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: "#C89B3C", transition: "width .3s" }} />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {STEPS.map((s) => {
          const isDone = !!progress[s.id];
          return (
            <div key={s.id} style={{ background: "#fff", border: "1px solid #ECECE6", borderRadius: 14, padding: 14, display: "flex", gap: 12 }}>
              <button onClick={() => toggleStep(s.id)} style={{ background: "none", border: "none", padding: 2, color: isDone ? "#2F7A4D" : "#C9C9C3", flexShrink: 0 }}>
                {isDone ? <CheckCircle2 size={22} /> : <Circle size={22} />}
              </button>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3, color: isDone ? "#8A8A8E" : "#111112", textDecoration: isDone ? "line-through" : "none" }}>
                  Étape {s.id} — {s.title}
                </div>
                <div style={{ fontSize: 12.5, color: "#6E6E73", lineHeight: 1.5 }}>{s.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
