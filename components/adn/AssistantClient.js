"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { DARK } from "@/lib/theme";

const SUGGESTIONS = [
  "Je viens de rejoindre ADN, que dois-je faire pendant mes 7 premiers jours ?",
  "Aide-moi à répondre à quelqu'un qui dit que c'est une arnaque",
  "Prépare-moi un message pour relancer un prospect silencieux",
];

const WELCOME = { role: "assistant", content: "Salut 👋 Je suis ton assistant ADN. Je peux t'aider à préparer un message, répondre à une objection, ou organiser ta journée. Que veux-tu faire ?" };

export default function AssistantClient({ initialMessages }) {
  const [messages, setMessages] = useState(initialMessages.length > 0 ? initialMessages : [WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text) {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    setMessages((prev) => [...prev, { role: "user", content }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      const reply = data.reply || "Désolé, je n'ai pas pu répondre. Réessaie.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Une erreur est survenue. Réessaie dans un instant." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 220px)", minHeight: 420 }}>
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, paddingBottom: 10 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "85%" }}>
            <div
              style={{
                background: m.role === "user" ? DARK : "#fff",
                color: m.role === "user" ? "#fff" : DARK,
                border: m.role === "user" ? "none" : "1px solid #ECECE6",
                borderRadius: 14,
                padding: "10px 14px",
                fontSize: 13.5,
                lineHeight: 1.5,
                whiteSpace: "pre-wrap",
              }}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 6, color: "#8A8A8E", fontSize: 12.5, padding: "4px 4px" }}>
            <Loader2 size={13} className="spin" /> L&apos;assistant réfléchit…
          </div>
        )}
        <div ref={endRef} />
      </div>

      {messages.length <= 1 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
          {SUGGESTIONS.map((s, i) => (
            <button key={i} onClick={() => send(s)} style={{ textAlign: "left", background: "#fff", border: "1px solid #ECECE6", borderRadius: 10, padding: "9px 12px", fontSize: 12.5, color: "#3A3A3D" }}>{s}</button>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Écris ta question…"
          style={{ flex: 1, border: "1px solid #E2E1D9", borderRadius: 12, padding: "12px 14px", fontSize: 13.5 }}
        />
        <button onClick={() => send()} disabled={loading} style={{ background: "#C89B3C", color: DARK, border: "none", borderRadius: 12, width: 46, display: "flex", alignItems: "center", justifyContent: "center", opacity: loading ? 0.6 : 1 }}>
          <Send size={17} />
        </button>
      </div>
    </div>
  );
}
